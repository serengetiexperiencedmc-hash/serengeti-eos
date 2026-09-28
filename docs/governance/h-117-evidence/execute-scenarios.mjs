/**
 * H-117 UAT scenario runner. Evidence harness only — not application code.
 * Synthetic data per docs/governance/h-116-uat-data-plan.md
 */
import { writeFileSync } from "node:fs";

const BASE = process.env.UAT_API_URL ?? "http://127.0.0.1:18117";
const CAROL_PW = process.env.EOS_BOOTSTRAP_CAROL_PASSWORD ?? "test-carol-not-for-prod";
const ALICE_PW = process.env.EOS_BOOTSTRAP_ALICE_PASSWORD ?? "test-alice-not-for-prod";
const ENV_LABEL = "127.0.0.1:18117 against 127.0.0.1:5436/eos_h117_uat";
const SOURCE_CLASSES = [
  "direct_supplier_contract",
  "supplier_contracted_rate_sheet",
  "written_supplier_quotation",
  "trade_partner_net_agreement",
  "public_benchmark",
];
const RATE_TYPES = ["negotiated_contracted", "trade_net", "public", "promotional", "quoted_ad_hoc"];

function nowIso() {
  return new Date().toISOString();
}

function redact(value) {
  if (value === undefined || value === null) return value;
  const raw = JSON.stringify(value);
  return JSON.parse(
    raw.replace(/"accessToken"\s*:\s*"[^"]*"/g, '"accessToken":"[REDACTED]"'),
  );
}

async function req(method, path, { token, body } = {}) {
  const headers = { accept: "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers["content-type"] = "application/json";
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    json = { _nonJson: text.slice(0, 500) };
  }
  return { status: res.status, json, jsonRedacted: redact(json), rawSnippet: text.slice(0, 1200) };
}

const ids = {};
const scenarios = [];

function record(id, actor, action, expected, actual, pass, notes, defect) {
  const row = {
    scenarioId: id,
    actor,
    environment: ENV_LABEL,
    timestamp: nowIso(),
    action,
    expectedResult: expected,
    actualResult: actual,
    passFail: pass ? "PASS" : "FAIL",
    notes,
    defectId: defect ?? null,
  };
  scenarios.push(row);
  console.log(`${pass ? "PASS" : "FAIL"} ${id} ${actual.status ?? ""} ${notes ?? ""}`.trim());
  return row;
}

try {
  const health = await req("GET", "/health");
  record(
    "UAT-01-HEALTH",
    "operator",
    "GET /health",
    "200",
    { status: health.status, json: health.jsonRedacted },
    health.status === 200,
    undefined,
    health.status === 200 ? null : "H117-ENV-01",
  );
  const ready = await req("GET", "/ready");
  record(
    "UAT-01-READY",
    "operator",
    "GET /ready",
    "200",
    { status: ready.status, json: ready.jsonRedacted },
    ready.status === 200,
    undefined,
    ready.status === 200 ? null : "H117-ENV-02",
  );

  const carolLogin = await req("POST", "/v1/auth/login", {
    body: { email: "carol.admin@sedmc.local", password: CAROL_PW, tenantSlug: "sedmc" },
  });
  const carolToken = carolLogin.json?.accessToken;
  record(
    "UAT-AUTH-01",
    "carol.admin@sedmc.local",
    "POST /v1/auth/login",
    "200 with accessToken",
    { status: carolLogin.status, tokenPresent: Boolean(carolToken) }, // token not stored
    carolLogin.status === 200 && Boolean(carolToken),
  );
  if (!carolToken) throw new Error("Carol login failed; cannot continue authorized scenarios");

  const badLogin = await req("POST", "/v1/auth/login", {
    body: {
      email: "carol.admin@sedmc.local",
      password: "not-the-bootstrap-password",
      tenantSlug: "sedmc",
    },
  });
  record(
    "UAT-AUTH-02",
    "carol.admin@sedmc.local (wrong password)",
    "POST /v1/auth/login invalid password",
    "Not 200 with usable token",
    { status: badLogin.status, tokenPresent: Boolean(badLogin.json?.accessToken), json: badLogin.jsonRedacted },
    badLogin.status !== 200 && !badLogin.json?.accessToken,
  );

  const unauthMe = await req("GET", "/v1/me");
  record(
    "UAT-AUTH-03",
    "none",
    "GET /v1/me without Authorization",
    "401 unauthenticated",
    { status: unauthMe.status, json: unauthMe.jsonRedacted },
    unauthMe.status === 401,
  );

  const me = await req("GET", "/v1/me", { token: carolToken });
  record(
    "UAT-01-ME",
    "carol.admin@sedmc.local",
    "GET /v1/me",
    "200; platform.admin / sedmc",
    { status: me.status, json: me.jsonRedacted },
    me.status === 200,
  );

  const types = await req("GET", "/v1/crm/organization-types", { token: carolToken });
  const typeItems = types.json?.items ?? [];
  const corporate = typeItems.find((t) => t.key === "corporate") ?? typeItems[0];
  ids.organizationTypeId = corporate?.id;
  ids.organizationTypeKey = corporate?.key;
  record(
    "UAT-01-ORG-TYPES",
    "carol.admin@sedmc.local",
    "GET /v1/crm/organization-types",
    "200; corporate type id from PG hydrate",
    { status: types.status, organizationTypeId: ids.organizationTypeId, key: ids.organizationTypeKey },
    types.status === 200 && Boolean(ids.organizationTypeId),
  );

  const org = await req("POST", "/v1/crm/organizations", {
    token: carolToken,
    body: {
      legalName: "UAT Synthetic Client Ltd",
      organizationTypeId: ids.organizationTypeId,
      country: "United Kingdom",
    },
  });
  ids.organizationId = org.json?.organization?.id;
  const acc = await req("POST", "/v1/crm/accounts", {
    token: carolToken,
    body: {
      organizationId: ids.organizationId,
      accountName: "UAT Synthetic Account",
    },
  });
  ids.accountId = acc.json?.account?.id;
  record(
    "UAT-ACC-01",
    "carol.admin@sedmc.local",
    "POST /v1/crm/organizations then POST /v1/crm/accounts",
    "Both 201",
    {
      orgStatus: org.status,
      accStatus: acc.status,
      organizationId: ids.organizationId,
      accountId: ids.accountId,
      org: org.json,
      account: acc.json,
    },
    org.status === 201 && acc.status === 201,
  );

  const getAcc = await req("GET", `/v1/crm/accounts/${ids.accountId}`, { token: carolToken });
  record(
    "UAT-ACC-02",
    "carol.admin@sedmc.local",
    `GET /v1/crm/accounts/${ids.accountId}`,
    "200; name UAT Synthetic Account",
    { status: getAcc.status, json: getAcc.json },
    getAcc.status === 200 && getAcc.json?.account?.accountName === "UAT Synthetic Account",
  );

  const putAccFacts = await req("PUT", `/v1/crm/accounts/${ids.accountId}/commercial-facts`, {
    token: carolToken,
    body: { accountType: "pco", market: "united_kingdom" },
  });
  const accFacts = putAccFacts.json?.facts ?? {};
  record(
    "UAT-ACC-03",
    "carol.admin@sedmc.local",
    `PUT /v1/crm/accounts/${ids.accountId}/commercial-facts`,
    "200; pco; united_kingdom; accountTypeIndependentOfMarket true; legacyCrmMarketAuthoritativeForF2 false",
    { status: putAccFacts.status, facts: accFacts },
    putAccFacts.status === 200 &&
      accFacts.accountType === "pco" &&
      accFacts.market === "united_kingdom" &&
      accFacts.accountTypeIndependentOfMarket === true &&
      accFacts.legacyCrmMarketAuthoritativeForF2 === false,
  );

  const opp = await req("POST", "/v1/pipeline/opportunities", {
    token: carolToken,
    body: {
      opportunityCode: "UAT-OPP-001",
      title: "UAT synthetic opportunity",
      organizationId: ids.organizationId,
      paxCount: 12,
    },
  });
  ids.opportunityId = opp.json?.opportunity?.id;
  record(
    "UAT-OPP-01",
    "carol.admin@sedmc.local",
    "POST /v1/pipeline/opportunities",
    "201",
    { status: opp.status, json: opp.json },
    opp.status === 201 && Boolean(ids.opportunityId),
  );

  const getOpp = await req("GET", `/v1/pipeline/opportunities/${ids.opportunityId}`, { token: carolToken });
  record(
    "UAT-OPP-02",
    "carol.admin@sedmc.local",
    `GET /v1/pipeline/opportunities/${ids.opportunityId}`,
    "200; code UAT-OPP-001; owner present",
    { status: getOpp.status, json: getOpp.json },
    getOpp.status === 200 &&
      getOpp.json?.opportunity?.opportunityCode === "UAT-OPP-001" &&
      Boolean(getOpp.json?.opportunity?.ownerPrincipalId),
  );

  const getOppFacts = await req("GET", `/v1/pipeline/opportunities/${ids.opportunityId}/commercial-facts`, {
    token: carolToken,
  });
  const of0 = getOppFacts.json?.facts ?? {};
  record(
    "UAT-OPP-03",
    "carol.admin@sedmc.local",
    `GET /v1/pipeline/opportunities/${ids.opportunityId}/commercial-facts`,
    "qualification independent of workflow stage; no 250k/20%",
    { status: getOppFacts.status, facts: of0 },
    getOppFacts.status === 200 &&
      of0.qualificationStatus !== of0.workflowStage &&
      (of0.qualificationIsIndependentOfWorkflowStage === true ||
        of0.newQualifiedStageIsNotQualification === true) &&
      of0.or01Qualified !== true,
  );

  const putNext = await req("PUT", `/v1/pipeline/opportunities/${ids.opportunityId}/commercial-facts`, {
    token: carolToken,
    body: { nextAction: { description: "UAT follow-up with buyer" } },
  });
  const of1 = putNext.json?.facts ?? {};
  record(
    "UAT-OPP-04",
    "carol.admin@sedmc.local",
    `PUT opportunity commercial-facts nextAction`,
    "200; description persisted; owner present",
    { status: putNext.status, facts: of1 },
    putNext.status === 200 &&
      of1.nextAction?.description === "UAT follow-up with buyer" &&
      Boolean(of1.ownerPrincipalId || getOpp.json?.opportunity?.ownerPrincipalId),
  );

  const conflict = await req("PUT", `/v1/pipeline/opportunities/${ids.opportunityId}/commercial-facts`, {
    token: carolToken,
    body: { opportunityId: "00000000-0000-4000-8000-000000000099" },
  });
  record(
    "UAT-OPP-05",
    "carol.admin@sedmc.local",
    "PUT commercial-facts with conflicting opportunityId",
    "409 *_immutable",
    { status: conflict.status, json: conflict.json },
    conflict.status === 409,
  );

  const rfp = await req("POST", "/v1/rfps", {
    token: carolToken,
    body: {
      rfpCode: "UAT-RFP-001",
      opportunityId: ids.opportunityId,
      title: "UAT synthetic RFP",
      paxCount: 12,
      source: "email",
    },
  });
  ids.rfpId = rfp.json?.rfp?.id;
  record(
    "UAT-RFP-01",
    "carol.admin@sedmc.local",
    "POST /v1/rfps",
    "201",
    { status: rfp.status, json: rfp.json },
    rfp.status === 201 && Boolean(ids.rfpId),
  );

  const putRfp = await req("PUT", `/v1/rfps/${ids.rfpId}/commercial-facts`, {
    token: carolToken,
    body: {
      primarySource: "referral",
      channel: "email",
      receivedAt: "2026-09-10T08:00:00.000Z",
      clarificationStatus: "not_started",
    },
  });
  const rf = putRfp.json?.facts ?? {};
  record(
    "UAT-RFP-02",
    "carol.admin@sedmc.local",
    `PUT /v1/rfps/${ids.rfpId}/commercial-facts SOURCE/CHANNEL`,
    "200; SOURCE referral AND CHANNEL email; sourceDistinctFromChannel true",
    { status: putRfp.status, facts: rf },
    putRfp.status === 200 &&
      rf.primarySource === "referral" &&
      rf.channel === "email" &&
      rf.sourceDistinctFromChannel === true &&
      rf.legacyCollapsedSourceAuthoritativeForF2 === false,
  );
  record(
    "UAT-RFP-03",
    "carol.admin@sedmc.local",
    "PUT/GET RFP timestamps (explicit receivedAt only)",
    "explicit ISO stored; createdAtUsedAsReceivedAt false; firstResponse not invented",
    { status: putRfp.status, facts: rf },
    putRfp.status === 200 &&
      rf.receivedAt === "2026-09-10T08:00:00.000Z" &&
      rf.createdAtUsedAsReceivedAt === false &&
      (rf.firstResponseAt === undefined || rf.firstResponseAt === null),
  );
  record(
    "UAT-RFP-04",
    "carol.admin@sedmc.local",
    "PUT clarificationStatus not_started",
    "Status stored; no invented events",
    { status: putRfp.status, clarificationStatus: rf.clarificationStatus, events: rf.clarificationEvents },
    putRfp.status === 200 &&
      rf.clarificationStatus === "not_started" &&
      (!rf.clarificationEvents || rf.clarificationEvents.length === 0),
  );

  const putPathB = await req("PUT", `/v1/rfps/${ids.rfpId}/path-b-approval`, {
    token: carolToken,
    body: { categories: ["significant_contractual_commitments"] },
  });
  const getPathB = await req("GET", `/v1/rfps/${ids.rfpId}/path-b-approval`, { token: carolToken });
  const pb = getPathB.json?.pathB ?? putPathB.json?.pathB ?? {};
  const pbStr = JSON.stringify(pb);
  record(
    "UAT-RFP-05",
    "carol.admin@sedmc.local",
    `PUT /v1/rfps/${ids.rfpId}/path-b-approval`,
    "200; category present; no sell-price/KPI fields",
    { putStatus: putPathB.status, getStatus: getPathB.status, pathB: pb },
    putPathB.status === 200 &&
      getPathB.status === 200 &&
      Array.isArray(pb.categories) &&
      pb.categories.includes("significant_contractual_commitments") &&
      !/sellPrice|revenue|profit|kpiHistory/i.test(pbStr),
  );

  const unauthRfp = await req("GET", `/v1/rfps/${ids.rfpId}/commercial-facts`);
  record(
    "UAT-RFP-07",
    "none",
    "GET RFP facts without token",
    "401",
    { status: unauthRfp.status, json: unauthRfp.json },
    unauthRfp.status === 401,
  );

  const prg = await req("POST", "/v1/programmes", {
    token: carolToken,
    body: {
      rfpId: ids.rfpId,
      title: "UAT synthetic programme",
      days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "UAT transfer" }] }],
    },
  });
  ids.programmeId = prg.json?.programme?.id;
  record(
    "UAT-PRG-01",
    "carol.admin@sedmc.local",
    "POST /v1/programmes",
    "201",
    { status: prg.status, json: prg.json },
    prg.status === 201 && Boolean(ids.programmeId),
  );

  const putPrg = await req("PUT", `/v1/programmes/${ids.programmeId}/commercial-facts`, {
    token: carolToken,
    body: { note: "UAT identifier-trace only" },
  });
  const pf = putPrg.json?.facts ?? {};
  record(
    "UAT-PRG-02",
    "carol.admin@sedmc.local",
    `PUT /v1/programmes/${ids.programmeId}/commercial-facts`,
    "rfpObserved true; sellPriceTreatedAsRevenue false",
    { status: putPrg.status, facts: pf },
    putPrg.status === 200 && pf.rfpObserved === true && pf.sellPriceTreatedAsRevenue === false,
  );

  const sup = await req("POST", "/v1/suppliers", {
    token: carolToken,
    body: {
      supplierCode: "UAT-SUP-001",
      legalName: "UAT Synthetic Lodge",
      category: "accommodation",
      country: "TZ",
      defaultCurrency: "TZS",
    },
  });
  ids.supplierId = sup.json?.supplier?.id;
  const rate = await req("POST", `/v1/suppliers/${ids.supplierId}/rates`, {
    token: carolToken,
    body: {
      rateCode: "UAT-SGL",
      rateName: "UAT-SGL",
      rateType: "per_room_per_night",
      amount: 250,
      currency: "USD",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      status: "active",
    },
  });
  ids.rateId = rate.json?.rate?.id;
  const overlayPath = `/v1/suppliers/${ids.supplierId}/rates/${ids.rateId}/commercial-facts`;
  const putRi1 = await req("PUT", overlayPath, {
    token: carolToken,
    body: {
      versionIdentity: 1,
      sourceClass: "direct_supplier_contract",
      rateType: "negotiated_contracted",
      originalCurrency: "TZS",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      itemIdentity: "UAT-SGL",
    },
  });
  const ri1 = putRi1.json ?? {};
  const riFacts = ri1.facts ?? ri1;
  record(
    "UAT-RI-01",
    "carol.admin@sedmc.local",
    "POST supplier; POST rate; PUT overlay v1",
    "201/201/200; amountIsNotIdentity; overlay TZS; mixed 250 USD; fx/winner out",
    {
      supStatus: sup.status,
      rateStatus: rate.status,
      putStatus: putRi1.status,
      supplierId: ids.supplierId,
      rateId: ids.rateId,
      body: ri1,
      mixed: rate.json?.rate,
    },
    sup.status === 201 &&
      rate.status === 201 &&
      putRi1.status === 200 &&
      (riFacts.amountIsNotIdentity === true || ri1.amountIsNotIdentity === true) &&
      (riFacts.originalCurrency === "TZS" ||
        ri1.identities?.[0]?.originalCurrency === "TZS" ||
        ri1.identity?.originalCurrency === "TZS") &&
      (riFacts.fxProviderImplemented === false || ri1.fxProviderImplemented === false) &&
      (riFacts.overlapResolution === "none" || ri1.overlapResolution === "none") &&
      rate.json?.rate?.amount === 250 &&
      rate.json?.rate?.currency === "USD",
  );

  const getRi = await req("GET", `${overlayPath}?at=2026-09-21`, { token: carolToken });
  const identities = getRi.json?.identities ?? getRi.json?.facts?.identities ?? [];
  record(
    "UAT-RI-02",
    "carol.admin@sedmc.local",
    `GET overlay ?at=2026-09-21`,
    "200; identities length 1; supplier ownership; identityId ≠ supplierId",
    { status: getRi.status, json: getRi.json },
    getRi.status === 200 && identities.length === 1,
  );

  const aliceLogin = await req("POST", "/v1/auth/login", {
    body: { email: "alice.finance@sedmc.local", password: ALICE_PW, tenantSlug: "sedmc" },
  });
  const aliceToken = aliceLogin.json?.accessToken;
  const aliceGet = await req("GET", `${overlayPath}?at=2026-09-21`, { token: aliceToken });
  const alicePut = await req("PUT", overlayPath, {
    token: aliceToken,
    body: {
      versionIdentity: 99,
      sourceClass: "direct_supplier_contract",
      rateType: "negotiated_contracted",
      originalCurrency: "TZS",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
    },
  });
  record(
    "UAT-AUTH-04",
    "alice.finance@sedmc.local",
    "GET and PUT rate overlay with finance.member",
    "403 on GET and PUT; overlay unchanged",
    {
      aliceLoginStatus: aliceLogin.status,
      aliceGet: aliceGet.status,
      alicePut: alicePut.status,
      aliceGetBody: aliceGet.json,
      alicePutBody: alicePut.json,
    },
    aliceLogin.status === 200 && aliceGet.status === 403 && alicePut.status === 403,
  );

  const putRi2 = await req("PUT", overlayPath, {
    token: carolToken,
    body: {
      versionIdentity: 2,
      sourceClass: "direct_supplier_contract",
      rateType: "negotiated_contracted",
      originalCurrency: "EUR",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      itemIdentity: "UAT-SGL",
    },
  });
  const getRi2 = await req("GET", `${overlayPath}?at=2026-09-21`, { token: carolToken });
  const idsAfter2 = getRi2.json?.identities ?? getRi2.json?.facts?.identities ?? [];
  const v1 = idsAfter2.find((x) => Number(x.versionIdentity) === 1);
  const v2 = idsAfter2.find((x) => Number(x.versionIdentity) === 2);
  record(
    "UAT-RI-03",
    "carol.admin@sedmc.local",
    "PUT overlay versionIdentity 2 EUR",
    "200; identities [1,2]; v1 still TZS",
    { putStatus: putRi2.status, getStatus: getRi2.status, identities: idsAfter2 },
    putRi2.status === 200 &&
      idsAfter2.length >= 2 &&
      v1?.originalCurrency === "TZS" &&
      v2?.originalCurrency === "EUR",
  );

  const dup = await req("PUT", overlayPath, {
    token: carolToken,
    body: {
      versionIdentity: 1,
      sourceClass: "direct_supplier_contract",
      rateType: "negotiated_contracted",
      originalCurrency: "GBP",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      itemIdentity: "UAT-SGL",
    },
  });
  const afterDup = await req("GET", `${overlayPath}?at=2026-09-21`, { token: carolToken });
  const v1AfterDup = (afterDup.json?.identities ?? afterDup.json?.facts?.identities ?? []).find(
    (x) => Number(x.versionIdentity) === 1,
  );
  record(
    "UAT-RI-04",
    "carol.admin@sedmc.local",
    "PUT duplicate versionIdentity 1",
    "409 version_identity_exists; v1 still TZS",
    { status: dup.status, json: dup.json, v1: v1AfterDup },
    dup.status === 409 &&
      (dup.json?.error === "version_identity_exists" || dup.json?.reason === "version_identity_exists") &&
      v1AfterDup?.originalCurrency === "TZS",
  );

  const unauthRi = await req("GET", `${overlayPath}?at=2026-09-21`);
  record(
    "UAT-RI-06",
    "none",
    "GET overlay without token",
    "401",
    { status: unauthRi.status, json: unauthRi.json },
    unauthRi.status === 401,
  );

  const badClass = await req("PUT", overlayPath, {
    token: carolToken,
    body: {
      versionIdentity: 80,
      sourceClass: "website_inferred",
      rateType: "negotiated_contracted",
      originalCurrency: "TZS",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
    },
  });
  const badType = await req("PUT", overlayPath, {
    token: carolToken,
    body: {
      versionIdentity: 81,
      sourceClass: "direct_supplier_contract",
      rateType: "per_room_per_night",
      originalCurrency: "TZS",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
    },
  });
  const badCcy = await req("PUT", overlayPath, {
    token: carolToken,
    body: {
      versionIdentity: 82,
      sourceClass: "direct_supplier_contract",
      rateType: "negotiated_contracted",
      originalCurrency: "TZ",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
    },
  });
  record(
    "UAT-RI-07",
    "carol.admin@sedmc.local",
    "Three invalid overlay PUTs",
    "400 invalid_source_class / invalid_or08_rate_type / invalid_original_currency",
    {
      badClass: { status: badClass.status, json: badClass.json },
      badType: { status: badType.status, json: badType.json },
      badCcy: { status: badCcy.status, json: badCcy.json },
    },
    badClass.status === 400 && badType.status === 400 && badCcy.status === 400,
  );

  const classPuts = [];
  for (let i = 0; i < SOURCE_CLASSES.length; i++) {
    classPuts.push(
      await req("PUT", overlayPath, {
        token: carolToken,
        body: {
          versionIdentity: 10 + i,
          sourceClass: SOURCE_CLASSES[i],
          rateType: "negotiated_contracted",
          originalCurrency: "TZS",
          validFrom: "2026-01-01",
          validTo: "2026-12-31",
          itemIdentity: `UAT-SRC-${i + 1}`,
        },
      }),
    );
  }
  const typePuts = [];
  for (let i = 0; i < RATE_TYPES.length; i++) {
    typePuts.push(
      await req("PUT", overlayPath, {
        token: carolToken,
        body: {
          versionIdentity: 20 + i,
          sourceClass: "direct_supplier_contract",
          rateType: RATE_TYPES[i],
          originalCurrency: "TZS",
          validFrom: "2026-01-01",
          validTo: "2026-12-31",
          itemIdentity: `UAT-TYP-${i + 1}`,
        },
      }),
    );
  }
  record(
    "UAT-RI-08",
    "carol.admin@sedmc.local",
    "PUT each of five source classes and five OR-08 types as distinct versionIdentity",
    "Each 200",
    {
      sourceClasses: classPuts.map((p, i) => ({ sourceClass: SOURCE_CLASSES[i], status: p.status, json: p.json })),
      rateTypes: typePuts.map((p, i) => ({ rateType: RATE_TYPES[i], status: p.status, json: p.json })),
    },
    classPuts.every((p) => p.status === 200) && typePuts.every((p) => p.status === 200),
  );

  const getRiFlags = await req("GET", `${overlayPath}?at=2026-09-21`, { token: carolToken });
  const flagBody = getRiFlags.json ?? {};
  record(
    "UAT-RI-09",
    "carol.admin@sedmc.local",
    "Inspect overlay JSON for winner/FX/freeze absence",
    "overlapResolution none; fxProviderImplemented false; no freezeOnSend",
    { status: getRiFlags.status, json: flagBody },
    getRiFlags.status === 200 &&
      (flagBody.overlapResolution === "none" || flagBody.facts?.overlapResolution === "none") &&
      (flagBody.fxProviderImplemented === false || flagBody.facts?.fxProviderImplemented === false) &&
      flagBody.freezeOnSend === undefined &&
      flagBody.facts?.freezeOnSend === undefined,
  );

  const badDates = await req("PUT", overlayPath, {
    token: carolToken,
    body: {
      versionIdentity: 90,
      sourceClass: "direct_supplier_contract",
      rateType: "negotiated_contracted",
      originalCurrency: "TZS",
      validFrom: "2026-12-31",
      validTo: "2026-01-01",
    },
  });
  record(
    "UAT-SEC-01",
    "carol.admin@sedmc.local",
    "PUT overlay validFrom after validTo",
    "400 invalid_validity_dates",
    { status: badDates.status, json: badDates.json },
    badDates.status === 400,
  );

  const unknown = await req(
    "GET",
    "/v1/pipeline/opportunities/aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee/commercial-facts",
    { token: carolToken },
  );
  record(
    "UAT-SEC-02",
    "carol.admin@sedmc.local",
    "GET commercial-facts for unknown opportunity UUID",
    "404",
    { status: unknown.status, json: unknown.json },
    unknown.status === 404,
  );

  const getAccFacts = await req("GET", `/v1/crm/accounts/${ids.accountId}/commercial-facts`, {
    token: carolToken,
  });
  record(
    "UAT-06-ACC-GET",
    "carol.admin@sedmc.local",
    "GET account commercial-facts",
    "200 persisted pco/UK",
    { status: getAccFacts.status, facts: getAccFacts.json?.facts },
    getAccFacts.status === 200 && getAccFacts.json?.facts?.accountType === "pco",
  );
} catch (err) {
  scenarios.push({
    scenarioId: "UAT-HARNESS",
    actor: "operator",
    environment: ENV_LABEL,
    timestamp: nowIso(),
    action: "runner exception",
    expectedResult: "no uncaught exception",
    actualResult: { error: String(err), stack: err?.stack },
    passFail: "FAIL",
    defectId: "H117-ENV-HARNESS",
  });
  console.error(err);
}

const out = {
  capturedAt: nowIso(),
  environment: ENV_LABEL,
  ids,
  scenarios,
};
writeFileSync(new URL("./wave1-results.json", import.meta.url), JSON.stringify(out, null, 2));
writeFileSync(new URL("./uat-ids.json", import.meta.url), JSON.stringify({ capturedAt: nowIso(), ids }, null, 2));
console.log(`WROTE ${scenarios.length} scenarios; ids=${JSON.stringify(ids)}`);
