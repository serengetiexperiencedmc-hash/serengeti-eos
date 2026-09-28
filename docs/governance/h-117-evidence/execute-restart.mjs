/**
 * H-117 GET-after-restart evidence. Reads uat-ids.json.
 */
import { readFileSync, writeFileSync } from "node:fs";

const BASE = process.env.UAT_API_URL ?? "http://127.0.0.1:18117";
const CAROL_PW = process.env.EOS_BOOTSTRAP_CAROL_PASSWORD ?? "test-carol-not-for-prod";
const ENV_LABEL = "127.0.0.1:18117 against 127.0.0.1:5436/eos_h117_uat (post-restart)";
const ids = JSON.parse(readFileSync(new URL("./uat-ids.json", import.meta.url), "utf8")).ids;

async function req(method, path, { token, body } = {}) {
  const headers = { accept: "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers["content-type"] = "application/json";
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => undefined);
  return { status: res.status, json };
}

const scenarios = [];
function record(id, action, expected, actual, pass) {
  scenarios.push({
    scenarioId: id,
    actor: "carol.admin@sedmc.local",
    environment: ENV_LABEL,
    timestamp: new Date().toISOString(),
    action,
    expectedResult: expected,
    actualResult: actual,
    passFail: pass ? "PASS" : "FAIL",
    defectId: pass ? null : `${id}-RESTART`,
  });
  console.log(`${pass ? "PASS" : "FAIL"} ${id} ${actual.status ?? ""}`);
}

const health = await req("GET", "/health");
const ready = await req("GET", "/ready");
record("UAT-REC-HEALTH", "GET /health after restart", "200", health, health.status === 200);
record("UAT-REC-READY", "GET /ready after restart", "200", ready, ready.status === 200);

const login = await req("POST", "/v1/auth/login", {
  body: { email: "carol.admin@sedmc.local", password: CAROL_PW, tenantSlug: "sedmc" },
});
const token = login.json?.accessToken;
record("UAT-REC-LOGIN", "POST /v1/auth/login after restart", "200 token", { status: login.status, tokenPresent: Boolean(token) }, login.status === 200 && Boolean(token));
if (!token) {
  writeFileSync(new URL("./wave2-restart-results.json", import.meta.url), JSON.stringify({ ids, scenarios }, null, 2));
  process.exit(1);
}

const acc = await req("GET", `/v1/crm/accounts/${ids.accountId}/commercial-facts`, { token });
const af = acc.json?.facts ?? {};
record(
  "UAT-ACC-04",
  `GET account facts ${ids.accountId}`,
  "pco / united_kingdom",
  { status: acc.status, facts: af },
  acc.status === 200 && af.accountType === "pco" && af.market === "united_kingdom",
);

const opp = await req("GET", `/v1/pipeline/opportunities/${ids.opportunityId}/commercial-facts`, { token });
const of = opp.json?.facts ?? {};
record(
  "UAT-OPP-06",
  `GET opportunity facts ${ids.opportunityId}`,
  "nextAction UAT follow-up with buyer",
  { status: opp.status, facts: of },
  opp.status === 200 && of.nextAction?.description === "UAT follow-up with buyer",
);

const rfp = await req("GET", `/v1/rfps/${ids.rfpId}/commercial-facts`, { token });
const rf = rfp.json?.facts ?? {};
record(
  "UAT-RFP-06",
  `GET RFP facts ${ids.rfpId}`,
  "referral / email retained",
  { status: rfp.status, facts: rf },
  rfp.status === 200 && rf.primarySource === "referral" && rf.channel === "email",
);

const prg = await req("GET", `/v1/programmes/${ids.programmeId}/commercial-facts`, { token });
const pf = prg.json?.facts ?? {};
record(
  "UAT-PRG-03",
  `GET programme facts ${ids.programmeId}`,
  "note / rfpObserved retained",
  { status: prg.status, facts: pf },
  prg.status === 200 && pf.rfpObserved === true && (pf.note === "UAT identifier-trace only" || pf.note !== undefined),
);

const mix = await req("GET", `/v1/crm/accounts/${ids.accountId}`, { token });
const oppMix = await req("GET", `/v1/pipeline/opportunities/${ids.opportunityId}`, { token });
const rfpMix = await req("GET", `/v1/rfps/${ids.rfpId}`, { token });
const prgMix = await req("GET", `/v1/programmes/${ids.programmeId}`, { token });
const rateMix = await req("GET", `/v1/suppliers/${ids.supplierId}/rates/${ids.rateId}`, { token });

const ri = await req(
  "GET",
  `/v1/suppliers/${ids.supplierId}/rates/${ids.rateId}/commercial-facts?at=2026-09-21`,
  { token },
);
const identities = ri.json?.identities ?? [];
const v1 = identities.find((x) => Number(x.versionIdentity) === 1);
const v2 = identities.find((x) => Number(x.versionIdentity) === 2);
record(
  "UAT-RI-05",
  `GET overlay after restart ${ids.rateId}`,
  "v1 TZS and v2 EUR retained",
  { status: ri.status, identityCount: identities.length, v1, v2 },
  ri.status === 200 && v1?.originalCurrency === "TZS" && v2?.originalCurrency === "EUR",
);

const allMatch =
  scenarios.filter((s) => ["UAT-ACC-04", "UAT-OPP-06", "UAT-RFP-06", "UAT-PRG-03", "UAT-RI-05"].includes(s.scenarioId)).every((s) => s.passFail === "PASS") &&
  mix.status === 200 &&
  oppMix.status === 200 &&
  rfpMix.status === 200 &&
  prgMix.status === 200 &&
  rateMix.status === 200;

record(
  "UAT-REC-01",
  "Combined GET after single restart",
  "All recorded overlays return; mixed parents retrievable",
  {
    mixed: {
      account: mix.status,
      opportunity: oppMix.status,
      rfp: rfpMix.status,
      programme: prgMix.status,
      rate: rateMix.status,
    },
    overlays: {
      account: acc.status,
      opportunity: opp.status,
      rfp: rfp.status,
      programme: prg.status,
      rate: ri.status,
    },
  },
  allMatch,
);

writeFileSync(new URL("./wave2-restart-results.json", import.meta.url), JSON.stringify({ capturedAt: new Date().toISOString(), ids, scenarios }, null, 2));
console.log(`WROTE ${scenarios.length} restart scenarios`);
