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
  const csv = ["legalName,organizationTypeKey,tradingName,country", "Demo Client Ltd,corporate,Demo Client,United Kingdom"].join(
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `c2-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

describe("C2 pipeline API", () => {
  it("lists C2 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("015_c2_opportunity"))).toBe(true);
  });

  it("creates opportunity and returns kanban board", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);

    const created = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: "OPP-2026-001",
        title: "Safari Incentive",
        organizationId: orgId,
        programmeSummary: "Northern Circuit · 65 pax",
        estimatedValue: 285000,
        currency: "USD",
        paxCount: 65,
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().opportunity.stage).toBe("new_qualified");
    const oppId = created.json().opportunity.id as string;

    const board = await app.inject({
      method: "GET",
      url: "/v1/pipeline/board",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(board.statusCode).toBe(200);
    const col = board.json().columns.find((c: { stage: string }) => c.stage === "new_qualified");
    expect(col.items.some((o: { id: string }) => o.id === oppId)).toBe(true);

    const transitioned = await app.inject({
      method: "POST",
      url: `/v1/pipeline/opportunities/${oppId}/transitions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { toStage: "rfp_received" },
    });
    expect(transitioned.statusCode).toBe(200);
    expect(transitioned.json().opportunity.stage).toBe("rfp_received");

    const detail = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${oppId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(detail.statusCode).toBe(200);
    expect(detail.json().opportunity.id).toBe(oppId);
    expect(detail.json().stageHistory.length).toBeGreaterThanOrEqual(2);
    expect(detail.json().stageHistory[0]).not.toHaveProperty("tenantId");

    const health = await app.inject({
      method: "GET",
      url: "/v1/pipeline/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("C2");
    expect(health.json().opportunities).toBeGreaterThanOrEqual(1);
  });

  it("denies pipeline access without permission", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginAlice(app);

    const res = await app.inject({
      method: "GET",
      url: "/v1/pipeline/board",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(403);
  });

  it("rejects invalid stage transition", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);

    const created = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: "OPP-2026-002",
        title: "Conference",
        organizationId: orgId,
      },
    });
    const oppId = created.json().opportunity.id as string;

    const bad = await app.inject({
      method: "POST",
      url: `/v1/pipeline/opportunities/${oppId}/transitions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { toStage: "proposal_sent" },
    });
    expect(bad.statusCode).toBe(409);
  });

  it("rejects won skip and allows lost from new_qualified", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);

    const created = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: "OPP-2026-003",
        title: "Skip Won",
        organizationId: orgId,
      },
    });
    const oppId = created.json().opportunity.id as string;

    const skipWon = await app.inject({
      method: "POST",
      url: `/v1/pipeline/opportunities/${oppId}/transitions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { toStage: "won" },
    });
    expect(skipWon.statusCode).toBe(409);

    const lost = await app.inject({
      method: "POST",
      url: `/v1/pipeline/opportunities/${oppId}/transitions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { toStage: "lost" },
    });
    expect(lost.statusCode).toBe(200);
    expect(lost.json().opportunity.status).toBe("lost");
  });

  it("isolates opportunities across tenants", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const created = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: "OPP-2026-004",
        title: "Tenant A",
        organizationId: orgId,
      },
    });
    const oppId = created.json().opportunity.id as string;

    const partnerLogin = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "partner@external.local", password: P.partnerPassword, tenantSlug: "partner-demo" },
    });
    const partnerToken = partnerLogin.json().accessToken as string;

    const foreign = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${oppId}`,
      headers: { authorization: `Bearer ${partnerToken}` },
    });
    expect(foreign.statusCode).toBe(404);

    const health = await app.inject({
      method: "GET",
      url: "/v1/pipeline/health",
      headers: { authorization: `Bearer ${partnerToken}` },
    });
    expect([403, 200]).toContain(health.statusCode);
    if (health.statusCode === 200) {
      expect(health.json().opportunities).toBe(0);
    }
  });

  it("rejects unauthenticated pipeline reads", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const res = await app.inject({ method: "GET", url: "/v1/pipeline/board" });
    expect(res.statusCode).toBe(401);
  });
});
