/**
 * H-152 D-01-C restart retrieval against a fresh API process.
 * Evidence only. Isolated catalog eos_h152_uat. Not Production.
 */
import { writeFileSync } from "node:fs";

const BASE = process.env.UAT_API_URL ?? "http://127.0.0.1:18154";
const CAROL_PW = process.env.EOS_BOOTSTRAP_CAROL_PASSWORD ?? "test-carol-not-for-prod";
const PARTNER_PW = process.env.EOS_BOOTSTRAP_PARTNER_PASSWORD ?? "test-partner-not-for-prod";
const rfpId = process.env.H152_RFP_ID;
const proposalId = process.env.H152_PROPOSAL_ID;
const ENV_LABEL = process.env.UAT_ENV_LABEL ?? "127.0.0.1:18154 against 127.0.0.1:5440/eos_h152_uat H-152 restart";

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
  return { status: res.status, json };
}

const scenarios = [];
function record(id, expected, actual, pass) {
  scenarios.push({
    scenarioId: id,
    environment: ENV_LABEL,
    timestamp: new Date().toISOString(),
    expectedResult: expected,
    actualResult: actual,
    passFail: pass ? "PASS" : "FAIL",
  });
  console.log(`${pass ? "PASS" : "FAIL"} ${id}`);
}

const carolLogin = await req("POST", "/v1/auth/login", {
  body: { email: "carol.admin@sedmc.local", password: CAROL_PW, tenantSlug: "sedmc" },
});
const carolToken = carolLogin.json?.accessToken;
const getRfp = await req("GET", `/v1/rfps/${rfpId}`, { token: carolToken });
record(
  "D01-C-GET-RFP",
  "200 from fresh process; durable RFP",
  { status: getRfp.status, title: getRfp.json?.rfp?.title, rfpId },
  getRfp.status === 200 && getRfp.json?.rfp?.id === rfpId,
);

const getProp = await req("GET", `/v1/proposals/${proposalId}`, { token: carolToken });
const byRfp = await req("GET", `/v1/proposals/by-rfp/${rfpId}`, { token: carolToken });
record(
  "D01-C-GET-PROPOSAL",
  "200 proposal from fresh process; not in-memory RFP store",
  {
    getStatus: getProp.status,
    byRfpStatus: byRfp.status,
    proposalId: getProp.json?.proposal?.id ?? getProp.json?.id,
    rfpId: getProp.json?.proposal?.rfpId ?? getProp.json?.rfpId,
  },
  getProp.status === 200 && (getProp.json?.proposal?.rfpId === rfpId || getProp.json?.rfpId === rfpId),
);

const partnerLogin = await req("POST", "/v1/auth/login", {
  body: { email: "partner@external.local", password: PARTNER_PW, tenantSlug: "partner-demo" },
});
const partnerToken = partnerLogin.json?.accessToken;
const partnerGetRfp = await req("GET", `/v1/rfps/${rfpId}`, { token: partnerToken });
const partnerGetProp = await req("GET", `/v1/proposals/${proposalId}`, { token: partnerToken });
record(
  "D01-D-RESTART-TENANT",
  "partner cannot read sedmc RFP/proposal",
  {
    partnerLogin: partnerLogin.status,
    getRfp: partnerGetRfp.status,
    getProposal: partnerGetProp.status,
  },
  partnerLogin.status === 200 && partnerGetRfp.status !== 200 && partnerGetProp.status !== 200,
);

const out = {
  campaign: "H-152-restart",
  capturedAt: new Date().toISOString(),
  environment: ENV_LABEL,
  ids: { rfpId, proposalId },
  summary: {
    total: scenarios.length,
    pass: scenarios.filter((s) => s.passFail === "PASS").length,
    fail: scenarios.filter((s) => s.passFail === "FAIL").length,
  },
  scenarios,
};
writeFileSync(new URL("./wave2-restart-results.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out.summary));
