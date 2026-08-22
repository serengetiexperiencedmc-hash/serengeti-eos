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

async function seedCrmOrg(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "Costing Client Ltd,corporate,Costing Client,UK"].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `c6-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createProgramme(app: ReturnType<typeof buildServer>, token: string, orgId: string) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: { opportunityCode: "OPP-CST-001", title: "Safari", organizationId: orgId, paxCount: 65 },
  });
  const oppId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpCode: "RFP-CST-001", opportunityId: oppId, title: "Safari RFP", paxCount: 65 },
  });
  const rfpId = rfp.json().rfp.id as string;
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpId, title: "Safari Programme" },
  });
  return prg.json().programme.id as string;
}

describe("C6 costing API", () => {
  it("lists C6 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("018_c6_costing"))).toBe(true);
  });

  it("creates cost sheet with line items and verifies margin math", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const programmeId = await createProgramme(app, token, orgId);

    const created = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId,
        sellPrice: 285000,
        paxCount: 65,
        marginFloorPercent: 20,
        lineItems: [
          { category: "accommodation", description: "Lodges", unitCost: 86400 },
          { category: "transport", description: "Fleet", unitCost: 32200 },
          { category: "activities", description: "Balloon + drives", unitCost: 38935 },
          { category: "av_events", description: "Gala AV", unitCost: 18500 },
          { category: "park_fees_misc", description: "Park fees", unitCost: 22365 },
        ],
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().sheet.totalCost).toBe(198400);
    expect(created.json().sheet.sellPrice).toBe(285000);
    expect(created.json().sheet.marginPercent).toBe(30.39);
    expect(created.json().sheet.marginMeetsFloor).toBe(true);
    expect(created.json().lineItems).toHaveLength(5);

    const byProgramme = await app.inject({
      method: "GET",
      url: `/v1/costing/sheets/by-programme/${programmeId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(byProgramme.statusCode).toBe(200);
    expect(byProgramme.json().sheet.categoryTotals.accommodation).toBe(86400);
  });

  it("adds line item and recalculates totals", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const programmeId = await createProgramme(app, token, orgId);

    const created = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId,
        sellPrice: 100000,
        lineItems: [{ category: "transport", description: "Vehicles", unitCost: 50000 }],
      },
    });
    const sheetId = created.json().sheet.id as string;

    const added = await app.inject({
      method: "POST",
      url: `/v1/costing/sheets/${sheetId}/line-items`,
      headers: { authorization: `Bearer ${token}` },
      payload: { category: "accommodation", description: "Lodges", unitCost: 30000 },
    });
    expect(added.statusCode).toBe(201);
    expect(added.json().sheet.totalCost).toBe(80000);
  });
});
