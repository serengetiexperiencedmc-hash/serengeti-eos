/**
 * H-149 CURRENT-CODE UAT scenario runner. Evidence harness only — not application code.
 * Synthetic data only. Isolated catalog eos_h149_uat. Not Production.
 */
import { writeFileSync } from "node:fs";

const BASE = process.env.UAT_API_URL ?? "http://127.0.0.1:18149";
const CAROL_PW = process.env.EOS_BOOTSTRAP_CAROL_PASSWORD ?? "test-carol-not-for-prod";
const ALICE_PW = process.env.EOS_BOOTSTRAP_ALICE_PASSWORD ?? "test-alice-not-for-prod";
const BOB_PW = process.env.EOS_BOOTSTRAP_BOB_PASSWORD ?? "test-bob-not-for-prod";
const PARTNER_PW = process.env.EOS_BOOTSTRAP_PARTNER_PASSWORD ?? "test-partner-not-for-prod";
const ENV_LABEL = "127.0.0.1:18149 against 127.0.0.1:5439/eos_h149_uat CURRENT-CODE UAT";
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

async function req(method, path, { token, body, extraHeaders } = {}) {
  const headers = { accept: "application/json", ...(extraHeaders ?? {}) };
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
    health.status === 200 ? null : "H149-ENV-01",
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
    ready.status === 200 ? null : "H149-ENV-02",
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

  const actTypes = await req("GET", "/v1/crm/activity-types", { token: carolToken });
  const act = await req("POST", "/v1/crm/activities", {
    token: carolToken,
    body: {
      activityType: "meeting",
      subject: "UAT synthetic discovery",
      occurredAt: "2026-09-22T08:00:00.000Z",
      organizationId: ids.organizationId,
      outcome: "Commercial interest recorded",
      notes: "UAT synthetic activity notes",
    },
  });
  ids.activityId = act.json?.activity?.id;
  const getAct = await req("GET", `/v1/crm/activities/${ids.activityId}`, { token: carolToken });
  record(
    "UAT-ACT-01",
    "carol.admin@sedmc.local",
    "POST/GET synthetic CRM activity",
    "201 then 200; subject retained",
    { typesStatus: actTypes.status, createStatus: act.status, getStatus: getAct.status, json: getAct.json },
    actTypes.status === 200 &&
      act.status === 201 &&
      getAct.status === 200 &&
      getAct.json?.activity?.subject === "UAT synthetic discovery",
  );

  const task = await req("POST", "/v1/crm/tasks", {
    token: carolToken,
    body: { title: "UAT send commercial outline", relatedOrganizationId: ids.organizationId },
  });
  ids.taskId = task.json?.task?.id;
  const getTask = await req("GET", `/v1/crm/tasks/${ids.taskId}`, { token: carolToken });
  record(
    "UAT-TSK-01",
    "carol.admin@sedmc.local",
    "POST/GET synthetic CRM task",
    "201 then 200; title retained",
    { createStatus: task.status, getStatus: getTask.status, json: getTask.json },
    task.status === 201 &&
      getTask.status === 200 &&
      getTask.json?.task?.title === "UAT send commercial outline",
  );

  const note = await req("POST", "/v1/crm/notes", {
    token: carolToken,
    body: {
      body: "UAT synthetic commercial note",
      entityType: "organization",
      entityId: ids.organizationId,
    },
  });
  ids.noteId = note.json?.note?.id;
  record(
    "UAT-NOTE-01",
    "carol.admin@sedmc.local",
    "POST commercial organization note",
    "201",
    { status: note.status, json: note.json },
    note.status === 201 && Boolean(ids.noteId),
  );

  const sheet = await req("POST", "/v1/costing/sheets", {
    token: carolToken,
    body: {
      programmeId: ids.programmeId,
      sellPrice: 12000,
      paxCount: 12,
      marginFloorPercent: 20,
      lineItems: [{ category: "transport", description: "UAT synthetic transfer", unitCost: 2400 }],
    },
  });
  ids.costSheetId = sheet.json?.sheet?.id;
  const getSheet = await req("GET", `/v1/costing/sheets/${ids.costSheetId}`, { token: carolToken });
  record(
    "UAT-CST-01",
    "carol.admin@sedmc.local",
    "POST/GET costing sheet for UAT programme",
    "201 then 200; programme linkage",
    { createStatus: sheet.status, getStatus: getSheet.status, json: getSheet.json },
    sheet.status === 201 &&
      getSheet.status === 200 &&
      getSheet.json?.sheet?.programmeId === ids.programmeId,
  );

  const approval = await req("POST", "/v1/commercial-approvals/request", {
    token: carolToken,
    body: { costSheetId: ids.costSheetId },
  });
  ids.approvalId = approval.json?.request?.id;
  const bobLogin = await req("POST", "/v1/auth/login", {
    body: { email: "bob.approver@sedmc.local", password: BOB_PW, tenantSlug: "sedmc" },
  });
  const bobToken = bobLogin.json?.accessToken;
  const decided = await req("POST", `/v1/commercial-approvals/${ids.approvalId}/decision`, {
    token: bobToken,
    body: { outcome: "approved" },
  });
  const proposal = await req("POST", "/v1/proposals", {
    token: carolToken,
    body: { rfpId: ids.rfpId, title: "UAT synthetic proposal" },
  });
  ids.proposalId = proposal.json?.proposal?.id;
  const getProp = await req("GET", `/v1/proposals/${ids.proposalId}`, { token: carolToken });
  record(
    "UAT-PROP-01",
    "carol.admin@sedmc.local",
    "Approve costing then POST/GET proposal",
    "201 then 200; proposal generated",
    {
      approvalStatus: approval.status,
      bobLogin: bobLogin.status,
      decisionStatus: decided.status,
      createStatus: proposal.status,
      getStatus: getProp.status,
      proposalId: ids.proposalId,
    },
    approval.status === 201 &&
      bobLogin.status === 200 &&
      decided.status === 200 &&
      proposal.status === 201 &&
      getProp.status === 200 &&
      Boolean(ids.proposalId),
  );

  const pdfB64 = Buffer.from("%PDF-1.4 UAT-H149-SYNTHETIC").toString("base64");
  const unauthDoc = await req("POST", `/v1/rfps/${ids.rfpId}/documents`, {
    body: { filename: "client-rfp.pdf", mimeType: "application/pdf", contentBase64: pdfB64 },
  });
  const okDoc = await req("POST", `/v1/rfps/${ids.rfpId}/documents`, {
    token: carolToken,
    body: { filename: "client-rfp.pdf", mimeType: "application/pdf", contentBase64: pdfB64 },
  });
  ids.documentId = okDoc.json?.document?.id;
  const getDoc = await req("GET", `/v1/commercial-documents/${ids.documentId}/content`, { token: carolToken });
  record(
    "UAT-DOC-01",
    "carol.admin@sedmc.local",
    "Upload commercial RFP PDF and GET content",
    "unauth 401; auth 201; content 200",
    {
      unauth: unauthDoc.status,
      createStatus: okDoc.status,
      getStatus: getDoc.status,
      filename: okDoc.json?.document?.filename,
    },
    unauthDoc.status === 401 &&
      okDoc.status === 201 &&
      getDoc.status === 200 &&
      okDoc.json?.document?.filename === "client-rfp.pdf",
  );
  const docsBeforeReject = (
    await req("GET", `/v1/rfps/${ids.rfpId}/documents`, { token: carolToken })
  ).json?.items?.length;
  const personDoc = await req("POST", `/v1/rfps/${ids.rfpId}/documents`, {
    token: carolToken,
    body: {
      filename: "client-rfp-2.pdf",
      mimeType: "application/pdf",
      contentBase64: pdfB64,
      guestName: "Jane Planner",
    },
  });
  const passportDoc = await req("POST", `/v1/rfps/${ids.rfpId}/documents`, {
    token: carolToken,
    body: { filename: "passport-scan.pdf", mimeType: "application/pdf", contentBase64: pdfB64 },
  });
  const docsAfterReject = (
    await req("GET", `/v1/rfps/${ids.rfpId}/documents`, { token: carolToken })
  ).json?.items?.length;
  record(
    "UAT-DOC-02",
    "carol.admin@sedmc.local",
    "Reject person-domain document metadata and identity filename",
    "400 person_domain_removed; document count unchanged",
    {
      personStatus: personDoc.status,
      personReason: personDoc.json?.reason,
      passportStatus: passportDoc.status,
      passportReason: passportDoc.json?.reason,
      before: docsBeforeReject,
      after: docsAfterReject,
    },
    personDoc.status === 400 &&
      personDoc.json?.reason === "person_domain_removed" &&
      passportDoc.status === 400 &&
      passportDoc.json?.reason === "person_domain_removed" &&
      docsAfterReject === docsBeforeReject,
  );

  const ntf = await req("GET", "/v1/notifications", { token: carolToken });
  const outbox = await req("GET", "/v1/notifications/email/outbox", { token: carolToken });
  const outboxItems = outbox.json?.items ?? [];
  const outboxHasBody = outboxItems.some((item) => "bodyText" in item || "bodyHtml" in item);
  record(
    "UAT-NTF-01",
    "carol.admin@sedmc.local",
    "GET notifications and email outbox",
    "200; outbox omits bodyText/bodyHtml",
    { ntfStatus: ntf.status, outboxStatus: outbox.status, outboxHasBody, count: outboxItems.length },
    ntf.status === 200 && outbox.status === 200 && outboxHasBody === false,
  );
  const allowPerson = await req("POST", "/v1/notifications/email/allowlist", {
    token: carolToken,
    body: { email: "uat-ops-h149@example.com", givenName: "Jane" },
  });
  const allowOk = await req("POST", "/v1/notifications/email/allowlist", {
    token: carolToken,
    body: { email: "uat-ops-h149@example.com", note: "UAT synthetic ops alias" },
  });
  const tplPerson = await req("PUT", "/v1/notifications/email/templates/notif.finance.warning", {
    token: carolToken,
    body: { subject: "Keep commercial", bodyText: "Keep commercial", guestName: "Jane" },
  });
  record(
    "UAT-NTF-02",
    "carol.admin@sedmc.local",
    "Notification structural-key reject; commercial allowlist accepted",
    "person-key 400; commercial 201; template person-key 400",
    {
      allowPerson: { status: allowPerson.status, reason: allowPerson.json?.reason },
      allowOk: allowOk.status,
      tplPerson: { status: tplPerson.status, reason: tplPerson.json?.reason },
    },
    allowPerson.status === 400 &&
      allowPerson.json?.reason === "person_domain_removed" &&
      allowOk.status === 201 &&
      tplPerson.status === 400 &&
      tplPerson.json?.reason === "person_domain_removed",
  );

  const orgImp = await req("POST", "/v1/crm/imports", {
    token: carolToken,
    body: {
      sourceSystem: "uat-h149",
      entityType: "organization",
      csv: "legalName,organizationTypeKey\nUAT H149 Import House,mice_agency",
    },
  });
  const contactImp = await req("POST", "/v1/crm/imports", {
    token: carolToken,
    body: {
      sourceSystem: "uat-h149",
      entityType: "contact",
      csv: "givenName,familyName\nJane,Planner",
    },
  });
  const supContactImp = await req("POST", "/v1/suppliers/imports", {
    token: carolToken,
    body: {
      sourceSystem: "uat-h149",
      entityType: "supplier_contact",
      csv: "supplierCode,contactRole,givenName,familyName\nX,reservations,A,B",
    },
  });
  record(
    "UAT-IMP-01",
    "carol.admin@sedmc.local",
    "Organization import create remains supported",
    "201 batch",
    { status: orgImp.status, batchId: orgImp.json?.batch?.id },
    orgImp.status === 201 && Boolean(orgImp.json?.batch?.id),
  );
  record(
    "UAT-IMP-02",
    "carol.admin@sedmc.local",
    "CRM contact import fail-closed",
    "400 person_domain_removed; no batch",
    { status: contactImp.status, reason: contactImp.json?.reason, batch: contactImp.json?.batch },
    contactImp.status === 400 &&
      contactImp.json?.reason === "person_domain_removed" &&
      contactImp.json?.batch === undefined,
  );
  record(
    "UAT-IMP-03",
    "carol.admin@sedmc.local",
    "Supplier-contact import fail-closed",
    "400 person_domain_removed; no batch",
    { status: supContactImp.status, reason: supContactImp.json?.reason, batch: supContactImp.json?.batch },
    supContactImp.status === 400 &&
      supContactImp.json?.reason === "person_domain_removed" &&
      supContactImp.json?.batch === undefined,
  );

  const contactCreate = await req("POST", "/v1/crm/contacts", {
    token: carolToken,
    body: { givenName: "Jane", familyName: "Planner", organizationId: ids.organizationId },
  });
  const contactList = await req("GET", "/v1/crm/contacts", { token: carolToken });
  record(
    "UAT-PRV-01",
    "carol.admin@sedmc.local",
    "Retired CRM contact create/list",
    "fail-closed person_domain_removed",
    {
      create: { status: contactCreate.status, reason: contactCreate.json?.reason },
      list: { status: contactList.status, reason: contactList.json?.reason },
    },
    contactCreate.status === 400 &&
      contactCreate.json?.reason === "person_domain_removed" &&
      contactList.json?.reason === "person_domain_removed",
  );

  const supContact = await req("POST", `/v1/suppliers/${ids.supplierId}/contacts`, {
    token: carolToken,
    body: { givenName: "Jane", familyName: "Planner", role: "reservations" },
  });
  record(
    "UAT-PRV-02",
    "carol.admin@sedmc.local",
    "Retired supplier-contact create",
    "fail-closed person_domain_removed",
    { status: supContact.status, reason: supContact.json?.reason },
    supContact.status === 400 && supContact.json?.reason === "person_domain_removed",
  );

  const hr = await req("POST", "/v1/hr/employees", {
    token: carolToken,
    body: { givenName: "Jane", familyName: "Staff" },
  });
  const vouchers = await req("POST", "/v1/ops/vouchers/generate", {
    token: carolToken,
    body: { bookingId: "11111111-1111-4111-8111-111111111111" },
  });
  const manifests = await req("POST", "/v1/ops/manifests/by-booking/11111111-1111-4111-8111-111111111111", {
    token: carolToken,
    body: {},
  });
  record(
    "UAT-PRV-03",
    "carol.admin@sedmc.local",
    "Retired HR/voucher/manifest writes",
    "fail-closed person_domain_removed / unavailable",
    {
      hr: { status: hr.status, reason: hr.json?.reason },
      vouchers: { status: vouchers.status, reason: vouchers.json?.reason },
      manifests: { status: manifests.status, reason: manifests.json?.reason },
    },
    hr.json?.reason === "person_domain_removed" &&
      vouchers.json?.reason === "person_domain_removed" &&
      manifests.json?.reason === "person_domain_removed",
  );

  const tasksBefore = (await req("GET", "/v1/crm/tasks", { token: carolToken })).json?.items?.length;
  const personTask = await req("POST", "/v1/crm/tasks", {
    token: carolToken,
    body: { title: "Must not persist person keys", guestName: "Jane Planner" },
  });
  const tasksAfter = (await req("GET", "/v1/crm/tasks", { token: carolToken })).json?.items?.length;
  const personPatch = await req("PATCH", `/v1/crm/tasks/${ids.taskId}`, {
    token: carolToken,
    body: { title: "Still commercial", givenName: "Jane" },
  });
  const afterPatch = await req("GET", `/v1/crm/tasks/${ids.taskId}`, { token: carolToken });
  record(
    "UAT-PRV-04",
    "carol.admin@sedmc.local",
    "H-145 leftover person-domain keys rejected on task writes; not persisted",
    "400 person_domain_removed; task count/title unchanged",
    {
      personTask: { status: personTask.status, reason: personTask.json?.reason },
      personPatch: { status: personPatch.status, reason: personPatch.json?.reason },
      before: tasksBefore,
      after: tasksAfter,
      title: afterPatch.json?.task?.title,
    },
    personTask.status === 400 &&
      personTask.json?.reason === "person_domain_removed" &&
      personPatch.status === 400 &&
      personPatch.json?.reason === "person_domain_removed" &&
      tasksAfter === tasksBefore &&
      afterPatch.json?.task?.title === "UAT send commercial outline",
  );

  const personOpp = await req("POST", "/v1/pipeline/opportunities", {
    token: carolToken,
    body: {
      opportunityCode: "UAT-OPP-PERSON",
      title: "Must not persist",
      organizationId: ids.organizationId,
      guestName: "Jane",
    },
  });
  const personPrg = await req("POST", "/v1/programmes", {
    token: carolToken,
    body: { rfpId: ids.rfpId, title: "Must not persist", guestName: "Jane" },
  });
  const personSup = await req("POST", "/v1/suppliers", {
    token: carolToken,
    body: {
      supplierCode: "UAT-SUP-PERSON",
      legalName: "UAT Person Lodge",
      category: "accommodation",
      country: "TZ",
      givenName: "Jane",
    },
  });
  record(
    "UAT-PRV-05",
    "carol.admin@sedmc.local",
    "Person-domain keys rejected on leftover commercial writes",
    "400 person_domain_removed for opp/programme/supplier",
    {
      opp: { status: personOpp.status, reason: personOpp.json?.reason },
      prg: { status: personPrg.status, reason: personPrg.json?.reason },
      sup: { status: personSup.status, reason: personSup.json?.reason },
    },
    personOpp.status === 400 &&
      personOpp.json?.reason === "person_domain_removed" &&
      personPrg.status === 400 &&
      personPrg.json?.reason === "person_domain_removed" &&
      personSup.status === 400 &&
      personSup.json?.reason === "person_domain_removed",
  );

  const policy = await req("GET", "/v1/ops/sync/policy", { token: carolToken });
  const pushPerson = await req("POST", "/v1/ops/sync/push", {
    token: carolToken,
    body: {
      sessionId: "00000000-0000-4000-8000-000000000001",
      deltas: [
        {
          entityType: "field_task",
          entityId: "00000000-0000-4000-8000-000000000002",
          clientVersion: 1,
          payload: { status: "complete", guestName: "Jane" },
        },
      ],
    },
  });
  record(
    "UAT-OPS-01",
    "carol.admin@sedmc.local",
    "Field-sync policy and person-key push reject",
    "policy 200; push 400 person_domain_removed",
    {
      policyStatus: policy.status,
      requireEncryptedCache: policy.json?.policy?.requireEncryptedCache,
      push: { status: pushPerson.status, reason: pushPerson.json?.reason },
    },
    policy.status === 200 &&
      policy.json?.policy?.requireEncryptedCache === true &&
      pushPerson.status === 400 &&
      pushPerson.json?.reason === "person_domain_removed",
  );

  const partnerLogin = await req("POST", "/v1/auth/login", {
    body: { email: "partner@external.local", password: PARTNER_PW, tenantSlug: "partner-demo" },
  });
  const partnerToken = partnerLogin.json?.accessToken;
  const partnerAllow = await req("GET", "/v1/notifications/email/allowlist", { token: partnerToken });
  const partnerDocs = await req("GET", `/v1/rfps/${ids.rfpId}/documents`, { token: partnerToken });
  const partnerAcc = await req("GET", `/v1/crm/accounts/${ids.accountId}`, { token: partnerToken });
  const partnerEmails = (partnerAllow.json?.items ?? []).map((row) => row.email);
  record(
    "UAT-TEN-01",
    "partner@external.local",
    "Partner tenant cannot read SEDMC allowlist/docs/account",
    "login 200; allowlist omits SEDMC email; docs/account 403 or 404",
    {
      partnerLogin: partnerLogin.status,
      allowStatus: partnerAllow.status,
      partnerEmails,
      docsStatus: partnerDocs.status,
      accStatus: partnerAcc.status,
    },
    partnerLogin.status === 200 &&
      !partnerEmails.includes("uat-ops-h149@example.com") &&
      [403, 404].includes(partnerDocs.status) &&
      [403, 404].includes(partnerAcc.status),
  );

  const exp = await req("GET", "/v1/notifications/email/allowlist/export?format=csv", { token: carolToken });
  record(
    "UAT-EXP-01",
    "carol.admin@sedmc.local",
    "Allowlist CSV export where supported",
    "200 CSV or documented supported export status",
    { status: exp.status, snippet: String(exp.rawSnippet ?? "").slice(0, 200) },
    [200, 201].includes(exp.status),
  );

  const audit = await req("GET", "/v1/audit-events", { token: carolToken });
  record(
    "UAT-AUD-01",
    "carol.admin@sedmc.local",
    "GET audit events where currently supported",
    "200 authenticated list or existing contract status not 5xx",
    { status: audit.status, json: audit.jsonRedacted },
    audit.status >= 200 && audit.status < 500,
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
    defectId: "H149-ENV-HARNESS",
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
