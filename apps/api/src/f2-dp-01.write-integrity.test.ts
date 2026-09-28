import { describe, expect, it } from "vitest";
import type { DbPool } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { f2FactsMemory } from "../src/commercial-facts/memory.js";

const P = TEST_BOOTSTRAP_SECRETS;
const APPROVED_URL = "postgres://eos:test-secret-do-not-print@127.0.0.1:5432/eos";
const FOREIGN_ID = "00000000-0000-4000-8000-000000000099";
const FOREIGN_TENANT = "00000000-0000-4000-8000-000000000077";

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function seedOrg(app: ReturnType<typeof buildServer>, token: string, name: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", `${name},corporate,${name},United Kingdom`].join(
    "\n",
  );
  const created = await app.inject({
    method: "POST",
    url: "/v1/crm/imports",
    headers: { authorization: `Bearer ${token}` },
    payload: { sourceSystem: "test", entityType: "organization", csv },
  });
  const batchId = created.json().batch.id as string;
  await app.inject({
    method: "POST",
    url: `/v1/crm/imports/${batchId}/validate`,
    headers: { authorization: `Bearer ${token}` },
  });
  await app.inject({
    method: "POST",
    url: `/v1/crm/imports/${batchId}/execute`,
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `d4-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createOpportunity(
  app: ReturnType<typeof buildServer>,
  token: string,
  orgId: string,
  code: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: { opportunityCode: code, title: code, organizationId: orgId, paxCount: 20 },
  });
  expect(res.statusCode).toBe(201);
  return res.json().opportunity as { id: string };
}

async function createAccount(
  app: ReturnType<typeof buildServer>,
  token: string,
  orgId: string,
  name: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/crm/accounts",
    headers: { authorization: `Bearer ${token}` },
    payload: { organizationId: orgId, accountName: name, market: "Europe" },
  });
  expect(res.statusCode).toBe(201);
  return res.json().account as { id: string };
}

async function createRfp(
  app: ReturnType<typeof buildServer>,
  token: string,
  opportunityId: string,
  code: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpCode: code, opportunityId, title: code, paxCount: 20, source: "email" },
  });
  expect(res.statusCode).toBe(201);
  return res.json().rfp as { id: string };
}

async function createProgramme(
  app: ReturnType<typeof buildServer>,
  token: string,
  rfpId: string,
  title: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpId,
      title,
      days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Transfer" }] }],
    },
  });
  expect(res.statusCode).toBe(201);
  return res.json().programme as { id: string };
}

function throwingSidecarPool(table: string) {
  const insert = new RegExp(`INSERT INTO ${table}`, "i");
  const query = (async (text: string) => {
    if (insert.test(String(text))) throw new Error("sidecar_unavailable");
    return { rows: [], rowCount: 0 };
  }) as DbPool["query"];
  return {
    query,
    connect: async () => ({ query, release() {} }),
    options: { connectionString: APPROVED_URL },
  } as unknown as DbPool;
}

describe("H-111 Day 4 D1 — F2 write-integrity on opportunity, account, programme PUTs", () => {
  it("opportunity PUT rejects conflicting entity and tenant identifiers", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day4 Opp Ids Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D4-IDS");

    const mismatchedOpp = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { opportunityId: FOREIGN_ID, nextAction: { description: "Do not redirect" } },
    });
    expect(mismatchedOpp.statusCode).toBe(409);
    expect(mismatchedOpp.json().reason).toBe("opportunityId_immutable");

    const mismatchedId = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { id: "not-this-opportunity", nextAction: { description: "Do not redirect" } },
    });
    expect(mismatchedId.statusCode).toBe(409);
    expect(mismatchedId.json().reason).toBe("opportunityId_immutable");

    const mismatchedTenant = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { tenantId: FOREIGN_TENANT, nextAction: { description: "Do not redirect" } },
    });
    expect(mismatchedTenant.statusCode).toBe(409);
    expect(mismatchedTenant.json().reason).toBe("tenantId_immutable");

    const matching = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { opportunityId: opp.id, nextAction: { description: "Keep follow-up" } },
    });
    expect(matching.statusCode).toBe(200);
    expect(matching.json().facts.opportunityId).toBe(opp.id);
    expect(matching.json().facts.nextAction.description).toBe("Keep follow-up");
  });

  it("opportunity PUT sidecar persist failure is fail-closed", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day4 Opp Fail Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D4-FAIL");
    store.dbPool = throwingSidecarPool("f2_opportunity_facts");
    store.f2Dp01BoundedSidecarOnly = true;

    const put = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { nextAction: { description: "Must not persist" } },
    });
    expect(put.statusCode).toBe(409);
    expect(put.json().reason).toBe("f2_sidecar_persist_failed");
    expect(f2FactsMemory(store).opportunities.get(opp.id)).toBeUndefined();

    const got = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().facts.nextAction).toBeUndefined();
    expect(got.json().persistence.recorded).toBe(false);
    expect(got.json().persistence.mixedSqlDurable).toBe(false);
  });

  it("account PUT rejects conflicting entity and tenant identifiers", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day4 Acc Ids Ltd");
    const account = await createAccount(app, token, orgId, "Day4 Account");

    const mismatchedAccount = await app.inject({
      method: "PUT",
      url: `/v1/crm/accounts/${account.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { accountId: FOREIGN_ID, accountType: "pco" },
    });
    expect(mismatchedAccount.statusCode).toBe(409);
    expect(mismatchedAccount.json().reason).toBe("accountId_immutable");

    const mismatchedId = await app.inject({
      method: "PUT",
      url: `/v1/crm/accounts/${account.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { id: "not-this-account", accountType: "pco" },
    });
    expect(mismatchedId.statusCode).toBe(409);
    expect(mismatchedId.json().reason).toBe("accountId_immutable");

    const mismatchedTenant = await app.inject({
      method: "PUT",
      url: `/v1/crm/accounts/${account.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { tenantId: FOREIGN_TENANT, accountType: "pco" },
    });
    expect(mismatchedTenant.statusCode).toBe(409);
    expect(mismatchedTenant.json().reason).toBe("tenantId_immutable");

    const matching = await app.inject({
      method: "PUT",
      url: `/v1/crm/accounts/${account.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { accountId: account.id, accountType: "pco", market: "south_africa" },
    });
    expect(matching.statusCode).toBe(200);
    expect(matching.json().facts.accountId).toBe(account.id);
    expect(matching.json().facts.accountType).toBe("pco");
    expect(matching.json().facts.legacyCrmMarketAuthoritativeForF2).toBe(false);
  });

  it("account PUT sidecar persist failure is fail-closed", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day4 Acc Fail Ltd");
    const account = await createAccount(app, token, orgId, "Day4 Fail Account");
    store.dbPool = throwingSidecarPool("f2_account_facts");
    store.f2Dp01BoundedSidecarOnly = true;

    const put = await app.inject({
      method: "PUT",
      url: `/v1/crm/accounts/${account.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { accountType: "pco" },
    });
    expect(put.statusCode).toBe(409);
    expect(put.json().reason).toBe("f2_sidecar_persist_failed");
    expect(f2FactsMemory(store).accounts.get(account.id)).toBeUndefined();

    const got = await app.inject({
      method: "GET",
      url: `/v1/crm/accounts/${account.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().facts.accountType).toBeUndefined();
    expect(got.json().persistence.recorded).toBe(false);
    expect(got.json().persistence.mixedSqlDurable).toBe(false);
  });

  it("programme PUT rejects conflicting entity and tenant identifiers", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day4 Prg Ids Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D4-PRG");
    const rfp = await createRfp(app, token, opp.id, "RFP-D4-PRG");
    const programme = await createProgramme(app, token, rfp.id, "Day4 programme");

    const mismatchedProgramme = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${programme.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId: FOREIGN_ID, note: "do not redirect" },
    });
    expect(mismatchedProgramme.statusCode).toBe(409);
    expect(mismatchedProgramme.json().reason).toBe("programmeId_immutable");

    const mismatchedId = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${programme.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { id: "not-this-programme", note: "do not redirect" },
    });
    expect(mismatchedId.statusCode).toBe(409);
    expect(mismatchedId.json().reason).toBe("programmeId_immutable");

    const mismatchedTenant = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${programme.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { tenantId: FOREIGN_TENANT, note: "do not redirect" },
    });
    expect(mismatchedTenant.statusCode).toBe(409);
    expect(mismatchedTenant.json().reason).toBe("tenantId_immutable");

    const matching = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${programme.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { programmeId: programme.id, note: "identifier-trace only" },
    });
    expect(matching.statusCode).toBe(200);
    expect(matching.json().facts.programmeId).toBe(programme.id);
    expect(matching.json().facts.note).toBe("identifier-trace only");
    expect(matching.json().facts.sellPriceTreatedAsRevenue).toBe(false);
  });

  it("programme PUT sidecar persist failure is fail-closed", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day4 Prg Fail Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D4-PFAIL");
    const rfp = await createRfp(app, token, opp.id, "RFP-D4-PFAIL");
    const programme = await createProgramme(app, token, rfp.id, "Day4 fail programme");
    store.dbPool = throwingSidecarPool("f2_programme_facts");
    store.f2Dp01BoundedSidecarOnly = true;

    const put = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${programme.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { note: "must not persist" },
    });
    expect(put.statusCode).toBe(409);
    expect(put.json().reason).toBe("f2_sidecar_persist_failed");
    expect(f2FactsMemory(store).programmes.get(programme.id)).toBeUndefined();

    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${programme.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().facts.note).toBeUndefined();
    expect(got.json().persistence.recorded).toBe(false);
    expect(got.json().persistence.mixedSqlDurable).toBe(false);
  });
});
