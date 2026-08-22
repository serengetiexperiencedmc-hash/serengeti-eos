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
  const csv = ["legalName,organizationTypeKey,tradingName,country", "RFP Client AG,corporate,RFP Client,Germany"].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `c3-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createOpportunity(app: ReturnType<typeof buildServer>, token: string, orgId: string) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: "OPP-RFP-001",
      title: "Tanzania Safari Incentive",
      organizationId: orgId,
      programmeSummary: "Safari · 65 pax",
      estimatedValue: 285000,
      paxCount: 65,
    },
  });
  return res.json().opportunity.id as string;
}

describe("C3 RFP API", () => {
  it("lists C3 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("016_c3_rfp"))).toBe(true);
  });

  it("creates RFP, advances workflow, and adds version", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const oppId = await createOpportunity(app, token, orgId);

    const created = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rfpCode: "RFP-2026-0847",
        opportunityId: oppId,
        title: "Tanzania Safari Incentive",
        programmeType: "Incentive · Safari",
        paxCount: 65,
        travelDates: "15–22 Mar 2027",
        destinations: "Arusha, Serengeti, Ngorongoro",
        budgetMin: 250000,
        budgetMax: 300000,
        requirementsText: "5-star accommodation, private charter, gala dinner",
        slaDueAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().rfp.workflowStage).toBe("intake");
    expect(created.json().rfp.slaStatus).toBe("at_risk");
    const rfpId = created.json().rfp.id as string;

    const opp = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${oppId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(opp.json().opportunity.stage).toBe("rfp_received");

    for (const stage of ["programme", "costing", "approval"] as const) {
      const t = await app.inject({
        method: "POST",
        url: `/v1/rfps/${rfpId}/transitions`,
        headers: { authorization: `Bearer ${token}` },
        payload: { toStage: stage },
      });
      expect(t.statusCode).toBe(200);
      expect(t.json().rfp.workflowStage).toBe(stage);
    }

    const version = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/versions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { summary: "Updated lodge selection (Seronera)" },
    });
    expect(version.statusCode).toBe(201);
    expect(version.json().version.versionNumber).toBe(2);

    const detail = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(detail.json().versions).toHaveLength(2);
  });

  it("denies RFP access without permission", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginAlice(app);

    const res = await app.inject({
      method: "GET",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(403);
  });
});
