/**
 * H-152 focused post-H-151 UAT harness. Evidence only — not application code.
 * Isolated catalog eos_h152_uat. Synthetic data only. Not Production.
 */
import { writeFileSync } from "node:fs";

const BASE = process.env.H152_API_URL ?? "http://127.0.0.1:18153";
const CAROL_PW = process.env.EOS_BOOTSTRAP_CAROL_PASSWORD ?? "test-carol-not-for-prod";
const BOB_PW = process.env.EOS_BOOTSTRAP_BOB_PASSWORD ?? "test-bob-not-for-prod";
const PARTNER_PW = process.env.EOS_BOOTSTRAP_PARTNER_PASSWORD ?? "test-partner-not-for-prod";
const ENV_LABEL = process.env.UAT_ENV_LABEL ?? "127.0.0.1:18153 against 127.0.0.1:5440/eos_h152_uat H-152";

function nowIso() {
  return new Date().toISOString();
}

function redact(value) {
  if (value === undefined || value === null) return value;
  const raw = JSON.stringify(value);
  return JSON.parse(raw.replace(/"accessToken"\s*:\s*"[^"]*"/g, '"accessToken":"[REDACTED]"'));
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

function record(id, actor, action, expected, actual, pass, notes) {
  const row = {
    scenarioId: id,
    actor,
    environment: ENV_LABEL,
    timestamp: nowIso(),
    action,
    expectedResult: expected,
    actualResult: actual,
    passFail: pass ? "PASS" : "FAIL",
    notes: notes ?? null,
  };
  scenarios.push(row);
  console.log(`${pass ? "PASS" : "FAIL"} ${id} ${actual.status ?? ""} ${notes ?? ""}`.trim());
  return row;
}

try {
  const health = await req("GET", "/health");
  record(
    "H152-ENV-HEALTH",
    "operator",
    "GET /health",
    "200 productionReady false",
    { status: health.status, json: health.jsonRedacted },
    health.status === 200 && health.json?.productionReady === false,
  );

  const carolLogin = await req("POST", "/v1/auth/login", {
    body: { email: "carol.admin@sedmc.local", password: CAROL_PW, tenantSlug: "sedmc" },
  });
  const carolToken = carolLogin.json?.accessToken;
  record(
    "H152-AUTH-CAROL",
    "carol.admin@sedmc.local",
    "POST /v1/auth/login",
    "200 token",
    { status: carolLogin.status, tokenPresent: Boolean(carolToken) },
    carolLogin.status === 200 && Boolean(carolToken),
  );

  const types = await req("GET", "/v1/crm/organization-types", { token: carolToken });
  const typeItems = types.json?.items ?? types.json?.types ?? [];
  const corporate = typeItems.find((t) => t.key === "corporate") ?? typeItems[0];
  ids.organizationTypeId = corporate?.id;

  const org = await req("POST", "/v1/crm/organizations", {
    token: carolToken,
    body: {
      legalName: "H152 Synthetic Client Ltd",
      organizationTypeId: ids.organizationTypeId,
      country: "United Kingdom",
    },
  });
  ids.organizationId = org.json?.organization?.id;
  const acc = await req("POST", "/v1/crm/accounts", {
    token: carolToken,
    body: { organizationId: ids.organizationId, accountName: "H152 Synthetic Account" },
  });
  ids.accountId = acc.json?.account?.id;
  const opp = await req("POST", "/v1/pipeline/opportunities", {
    token: carolToken,
    body: {
      opportunityCode: "H152-OPP-001",
      title: "H152 synthetic opportunity",
      organizationId: ids.organizationId,
      paxCount: 12,
    },
  });
  ids.opportunityId = opp.json?.opportunity?.id;

  const rfp = await req("POST", "/v1/rfps", {
    token: carolToken,
    body: {
      rfpCode: "H152-RFP-001",
      opportunityId: ids.opportunityId,
      title: "H152 synthetic RFP",
      paxCount: 12,
      source: "email",
    },
  });
  ids.rfpId = rfp.json?.rfp?.id;
  const getRfp = await req("GET", `/v1/rfps/${ids.rfpId}`, { token: carolToken });
  record(
    "D01-A-CREATE",
    "carol.admin@sedmc.local",
    "POST /v1/rfps then GET /v1/rfps/:id",
    "201 then 200; RFP persisted",
    {
      createStatus: rfp.status,
      getStatus: getRfp.status,
      rfpId: ids.rfpId,
      title: getRfp.json?.rfp?.title,
    },
    rfp.status === 201 && getRfp.status === 200 && Boolean(ids.rfpId),
  );

  const prg = await req("POST", "/v1/programmes", {
    token: carolToken,
    body: {
      rfpId: ids.rfpId,
      title: "H152 synthetic programme",
      days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "H152 transfer" }] }],
    },
  });
  ids.programmeId = prg.json?.programme?.id;

  const sheet = await req("POST", "/v1/costing/sheets", {
    token: carolToken,
    body: {
      programmeId: ids.programmeId,
      sellPrice: 12000,
      paxCount: 12,
      marginFloorPercent: 20,
      lineItems: [{ category: "transport", description: "H152 synthetic transfer", unitCost: 2400 }],
    },
  });
  ids.costSheetId = sheet.json?.sheet?.id;
  const getSheet = await req("GET", `/v1/costing/sheets/${ids.costSheetId}`, { token: carolToken });
  record(
    "D01-E-COSTING",
    "carol.admin@sedmc.local",
    "POST/GET costing sheet",
    "201 then 200; programme linkage; existing sellPrice/margin floor unchanged",
    {
      createStatus: sheet.status,
      getStatus: getSheet.status,
      programmeId: getSheet.json?.sheet?.programmeId,
      sellPrice: getSheet.json?.sheet?.sellPrice,
    },
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
  record(
    "D01-E-MIXED-APPROVAL",
    "bob.approver@sedmc.local",
    "POST commercial-approvals request then Bob decision",
    "201 then 200 approved",
    {
      approvalStatus: approval.status,
      bobLogin: bobLogin.status,
      decisionStatus: decided.status,
      approvalId: ids.approvalId,
    },
    approval.status === 201 && bobLogin.status === 200 && decided.status === 200,
  );

  const putPathB = await req("PUT", `/v1/rfps/${ids.rfpId}/path-b-approval`, {
    token: carolToken,
    body: { categories: ["significant_contractual_commitments"] },
  });
  const getPathB = await req("GET", `/v1/rfps/${ids.rfpId}/path-b-approval`, { token: carolToken });
  const pb = getPathB.json?.pathB ?? putPathB.json?.pathB ?? {};
  record(
    "D01-B-PATHB-REQUIRED",
    "carol.admin@sedmc.local",
    "PUT Path B categories",
    "200 required/pending; existing Path B semantics",
    { putStatus: putPathB.status, getStatus: getPathB.status, pathB: pb },
    putPathB.status === 200 && getPathB.status === 200 && pb.required === true,
  );

  const blocked = await req("POST", "/v1/proposals", {
    token: carolToken,
    body: { rfpId: ids.rfpId, title: "H152 synthetic proposal" },
  });
  record(
    "D01-B-PATHB-BLOCKS",
    "carol.admin@sedmc.local",
    "POST /v1/proposals while Path B pending",
    "409 Path B conflict; not rfp_not_found",
    { status: blocked.status, json: blocked.jsonRedacted },
    blocked.status === 409 && blocked.json?.reason !== "rfp_not_found",
  );

  const pathBDecision = await req("POST", `/v1/rfps/${ids.rfpId}/path-b-approval/decision`, {
    token: bobToken,
    body: { outcome: "approved" },
  });
  record(
    "D01-B-PATHB-DECISION",
    "bob.approver@sedmc.local",
    "POST Path B decision approved",
    "200 approved",
    { status: pathBDecision.status, pathB: pathBDecision.json?.pathB },
    pathBDecision.status === 200 &&
      (pathBDecision.json?.pathB?.status === "approved" || pathBDecision.json?.status === "approved"),
  );

  const proposal = await req("POST", "/v1/proposals", {
    token: carolToken,
    body: { rfpId: ids.rfpId, title: "H152 synthetic proposal" },
  });
  ids.proposalId = proposal.json?.proposal?.id ?? proposal.json?.id;
  const getProp = await req("GET", `/v1/proposals/${ids.proposalId}`, { token: carolToken });
  const byRfp = await req("GET", `/v1/proposals/by-rfp/${ids.rfpId}`, { token: carolToken });
  record(
    "D01-B-GENERATE",
    "carol.admin@sedmc.local",
    "POST /v1/proposals after Path B + mixed approval",
    "201; no rfp_not_found; GET 200 persisted",
    {
      createStatus: proposal.status,
      getStatus: getProp.status,
      byRfpStatus: byRfp.status,
      proposalId: ids.proposalId,
      reason: proposal.json?.reason,
    },
    proposal.status === 201 &&
      proposal.json?.reason !== "rfp_not_found" &&
      getProp.status === 200 &&
      Boolean(ids.proposalId),
  );

  const guestNameProp = await req("POST", "/v1/proposals", {
    token: carolToken,
    body: { rfpId: ids.rfpId, title: "Must not persist", guestName: "Jane Planner" },
  });
  record(
    "PRV-OD09-GENERATE",
    "carol.admin@sedmc.local",
    "POST /v1/proposals with leftover guestName",
    "400 person_domain_removed",
    { status: guestNameProp.status, json: guestNameProp.jsonRedacted },
    guestNameProp.status === 400 && guestNameProp.json?.reason === "person_domain_removed",
  );

  const personOpp = await req("POST", "/v1/pipeline/opportunities", {
    token: carolToken,
    body: {
      opportunityCode: "H152-OPP-PERSON",
      title: "Must not persist",
      organizationId: ids.organizationId,
      guestName: "Jane",
    },
  });
  const contactImp = await req("POST", "/v1/crm/imports", {
    token: carolToken,
    body: {
      sourceSystem: "uat-h152",
      entityType: "contact",
      csv: "givenName,familyName\nJane,Planner",
    },
  });
  const supContactImp = await req("POST", "/v1/suppliers/imports", {
    token: carolToken,
    body: {
      sourceSystem: "uat-h152",
      entityType: "supplier_contact",
      csv: "supplierCode,contactRole,givenName,familyName\nX,reservations,A,B",
    },
  });
  record(
    "PRV-PERSON-WRITE",
    "carol.admin@sedmc.local",
    "Retired person-domain write + import fail-closed",
    "400 person_domain_removed for opp write and contact imports",
    {
      opp: { status: personOpp.status, reason: personOpp.json?.reason },
      contactImp: { status: contactImp.status, reason: contactImp.json?.reason },
      supContactImp: { status: supContactImp.status, reason: supContactImp.json?.reason },
    },
    personOpp.status === 400 &&
      personOpp.json?.reason === "person_domain_removed" &&
      contactImp.status === 400 &&
      contactImp.json?.reason === "person_domain_removed" &&
      supContactImp.status === 400 &&
      supContactImp.json?.reason === "person_domain_removed",
  );

  const tplPerson = await req("PUT", "/v1/notifications/email/templates/notif.finance.warning", {
    token: carolToken,
    body: { subject: "Keep commercial", bodyText: "Keep commercial", guestName: "Jane" },
  });
  record(
    "PRV-NOTIFICATION",
    "carol.admin@sedmc.local",
    "Notification template leftover person key",
    "400 person_domain_removed",
    { status: tplPerson.status, reason: tplPerson.json?.reason },
    tplPerson.status === 400 && tplPerson.json?.reason === "person_domain_removed",
  );

  const sup = await req("POST", "/v1/suppliers", {
    token: carolToken,
    body: {
      supplierCode: "H152-LODGE",
      legalName: "H152 Synthetic Lodge",
      category: "accommodation",
      country: "TZ",
      defaultCurrency: "TZS",
    },
  });
  ids.supplierId = sup.json?.supplier?.id;
  const rate = await req("POST", `/v1/suppliers/${ids.supplierId}/rates`, {
    token: carolToken,
    body: {
      rateCode: "H152-SGL",
      rateName: "H152-SGL",
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
  const putRi = await req("PUT", overlayPath, {
    token: carolToken,
    body: {
      versionIdentity: 1,
      sourceClass: "direct_supplier_contract",
      rateType: "negotiated_contracted",
      originalCurrency: "TZS",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      itemIdentity: "H152-SGL",
    },
  });
  const getRi = await req("GET", `${overlayPath}?at=2026-09-21`, { token: carolToken });
  const identities = getRi.json?.identities ?? getRi.json?.facts?.identities ?? [];
  record(
    "RI-OVERLAY",
    "carol.admin@sedmc.local",
    "POST supplier/rate; PUT/GET Rate Identity overlay",
    "201/201/200 overlay; GET overlay 200; mixed amount 250 USD unchanged",
    {
      supStatus: sup.status,
      rateStatus: rate.status,
      putStatus: putRi.status,
      getStatus: getRi.status,
      identityCount: identities.length,
      mixedAmount: rate.json?.rate?.amount,
      mixedCurrency: rate.json?.rate?.currency,
    },
    sup.status === 201 &&
      rate.status === 201 &&
      putRi.status === 200 &&
      getRi.status === 200,
  );

  const getRateById = await req("GET", `/v1/suppliers/${ids.supplierId}/rates/${ids.rateId}`, {
    token: carolToken,
  });
  record(
    "REC-01-UNCHANGED",
    "carol.admin@sedmc.local",
    "GET /v1/suppliers/:id/rates/:rateId (unsupported; not added)",
    "not 200 resource; H149-REC-01 remains unsupported",
    { status: getRateById.status, json: getRateById.jsonRedacted },
    getRateById.status !== 200,
  );

  const partnerLogin = await req("POST", "/v1/auth/login", {
    body: { email: "partner@external.local", password: PARTNER_PW, tenantSlug: "partner-demo" },
  });
  const partnerToken = partnerLogin.json?.accessToken;
  const partnerGetRfp = await req("GET", `/v1/rfps/${ids.rfpId}`, { token: partnerToken });
  const partnerProp = await req("POST", "/v1/proposals", {
    token: partnerToken,
    body: { rfpId: ids.rfpId, title: "cross tenant" },
  });
  const partnerGetProp = await req("GET", `/v1/proposals/${ids.proposalId}`, { token: partnerToken });
  record(
    "D01-D-TENANT",
    "partner@external.local",
    "Partner GET RFP / POST proposals / GET proposal for sedmc ids",
    "existing contract: hidden or forbidden; not a sedmc generate",
    {
      partnerLogin: partnerLogin.status,
      getRfp: partnerGetRfp.status,
      postProposal: partnerProp.status,
      getProposal: partnerGetProp.status,
    },
    partnerLogin.status === 200 &&
      partnerGetRfp.status !== 200 &&
      partnerProp.status !== 201 &&
      partnerGetProp.status !== 200,
  );
} catch (err) {
  scenarios.push({
    scenarioId: "H152-HARNESS-ERROR",
    passFail: "FAIL",
    actualResult: { error: String(err) },
    timestamp: nowIso(),
  });
  console.error(err);
}

const out = {
  campaign: "H-152",
  capturedAt: nowIso(),
  environment: ENV_LABEL,
  productionReady: false,
  ids,
  summary: {
    total: scenarios.length,
    pass: scenarios.filter((s) => s.passFail === "PASS").length,
    fail: scenarios.filter((s) => s.passFail === "FAIL").length,
  },
  scenarios,
};
writeFileSync(new URL("./wave1-results.json", import.meta.url), JSON.stringify(out, null, 2));
writeFileSync(new URL("./uat-ids.json", import.meta.url), JSON.stringify({ capturedAt: nowIso(), ids }, null, 2));
console.log(JSON.stringify(out.summary));
