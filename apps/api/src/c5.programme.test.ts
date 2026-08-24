import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function loginAlice(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function seedCrmOrg(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "Programme Client Ltd,corporate,Programme Client,UK"].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `c5-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createRfp(app: ReturnType<typeof buildServer>, token: string, orgId: string) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: "OPP-PRG-001",
      title: "Safari Incentive",
      organizationId: orgId,
      paxCount: 65,
    },
  });
  const oppId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: "RFP-PRG-001",
      opportunityId: oppId,
      title: "Safari Incentive Programme",
      paxCount: 65,
      destinations: "Serengeti",
    },
  });
  return rfp.json().rfp.id as string;
}

describe("C5 programme API", () => {
  it("lists C5 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("017_c5_programme"))).toBe(true);
  });

  it("creates programme with days and items linked to RFP", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const rfpId = await createRfp(app, token, orgId);

    const created = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rfpId,
        title: "Tanzania Safari — 8 Days",
        days: [
          {
            dayNumber: 1,
            title: "Day 1 — Arrival",
            location: "Arusha",
            items: [{ startTime: "14:00", title: "Airport transfer", supplierLabel: "SEDMC Fleet" }],
          },
        ],
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().programme.programmeCode).toBe("PRG-PRG-001");
    expect(created.json().days).toHaveLength(1);
    expect(created.json().days[0].items).toHaveLength(1);

    const byRfp = await app.inject({
      method: "GET",
      url: `/v1/programmes/by-rfp/${rfpId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(byRfp.statusCode).toBe(200);
    expect(byRfp.json().programme.rfpId).toBe(rfpId);
  });

  it("rejects duplicate programme for same RFP", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const rfpId = await createRfp(app, token, orgId);

    await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId, title: "First" },
    });

    const dup = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId, title: "Second" },
    });
    expect(dup.statusCode).toBe(409);
  });

  it("scopes programme health and enforces builder validation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const rfpId = await createRfp(app, token, orgId);

    const created = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId, title: "Health Programme" },
    });
    expect(created.statusCode).toBe(201);
    const programmeId = created.json().programme.id as string;
    expect(created.json().programme).not.toHaveProperty("tenantId");

    store.prgProgrammes.push({
      ...store.prgProgrammes[0]!,
      id: "99999999-9999-4999-8999-999999999999",
      tenantId: "22222222-2222-4222-8222-222222222222",
      programmeCode: "PRG-FOREIGN",
    });

    const health = await app.inject({
      method: "GET",
      url: "/v1/programmes/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("C5");
    expect(health.json().programmes).toBe(1);

    const blankDay = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days`,
      headers: { authorization: `Bearer ${token}` },
      payload: { dayNumber: 1, title: "   " },
    });
    expect(blankDay.statusCode).toBe(400);
    expect(blankDay.json().reason).toBe("title_required");

    const day = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days`,
      headers: { authorization: `Bearer ${token}` },
      payload: { dayNumber: 1, title: "Arrival", location: "Arusha" },
    });
    expect(day.statusCode).toBe(201);
    const dayId = day.json().day.id as string;
    expect(day.json().day).not.toHaveProperty("tenantId");

    const blankItem = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days/${dayId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { title: " " },
    });
    expect(blankItem.statusCode).toBe(400);

    const item = await app.inject({
      method: "POST",
      url: `/v1/programmes/${programmeId}/days/${dayId}/items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { title: "Airport transfer", startTime: "14:00" },
    });
    expect(item.statusCode).toBe(201);

    const aliceToken = await loginAlice(app);
    const denied = await app.inject({
      method: "GET",
      url: "/v1/programmes/health",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(denied.statusCode).toBe(403);

    const partnerLogin = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
    });
    const partnerToken = partnerLogin.json().accessToken as string;
    const foreign = await app.inject({
      method: "GET",
      url: `/v1/programmes/${programmeId}`,
      headers: { authorization: `Bearer ${partnerToken}` },
    });
    expect(foreign.statusCode).toBe(404);
  });

  it("rejects unauthenticated programme reads", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const res = await app.inject({ method: "GET", url: "/v1/programmes/health" });
    expect(res.statusCode).toBe(401);
  });
});
