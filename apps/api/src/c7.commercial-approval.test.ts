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

async function loginBob(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "bob.approver@sedmc.local", password: P.bobPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function seedCrmOrg(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "Approval Client Ltd,corporate,Approval Client,UK"].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `c7-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createCostSheet(app: ReturnType<typeof buildServer>, token: string, orgId: string) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: { opportunityCode: "OPP-APR-001", title: "Safari", organizationId: orgId, paxCount: 65 },
  });
  const oppId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpCode: "RFP-APR-001", opportunityId: oppId, title: "Safari Incentive", paxCount: 65 },
  });
  const rfpId = rfp.json().rfp.id as string;
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpId, title: "Safari Programme" },
  });
  const programmeId = prg.json().programme.id as string;
  const sheet = await app.inject({
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
        { category: "transport", description: "Vehicles", unitCost: 32200 },
        { category: "activities", description: "Balloon", unitCost: 38935 },
        { category: "av_events", description: "Gala AV", unitCost: 18500 },
        { category: "park_fees_misc", description: "Fees", unitCost: 22365 },
      ],
    },
  });
  return { sheetId: sheet.json().sheet.id as string, rfpId };
}

describe("C7 commercial approval API", () => {
  it("lists C7 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("019_c7_commercial_approval"))).toBe(true);
  });

  it("requests and approves commercial approval with SoD", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const bobToken = await loginBob(app);
    const orgId = await seedCrmOrg(app, carolToken);
    const { sheetId, rfpId } = await createCostSheet(app, carolToken, orgId);

    const requested = await app.inject({
      method: "POST",
      url: "/v1/commercial-approvals/request",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { costSheetId: sheetId },
    });
    expect(requested.statusCode).toBe(201);
    expect(requested.json().request.status).toBe("pending");
    expect(requested.json().request.gateType).toBe("sell_threshold");
    const approvalId = requested.json().request.id as string;

    const selfDecide = await app.inject({
      method: "POST",
      url: `/v1/commercial-approvals/${approvalId}/decision`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { outcome: "approved" },
    });
    expect(selfDecide.statusCode).toBe(403);

    const approved = await app.inject({
      method: "POST",
      url: `/v1/commercial-approvals/${approvalId}/decision`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { outcome: "approved", notes: "Margin acceptable" },
    });
    expect(approved.statusCode).toBe(200);
    expect(approved.json().request.status).toBe("approved");

    const rfp = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(rfp.json().rfp.workflowStage).toBe("proposal");
  });

  it("rejects approval request when margin below floor", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: { opportunityCode: "OPP-LOW-001", title: "Low margin", organizationId: orgId },
    });
    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpCode: "RFP-LOW-001", opportunityId: opp.json().opportunity.id, title: "Low margin deal" },
    });
    const prg = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId: rfp.json().rfp.id, title: "Programme" },
    });
    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId: prg.json().programme.id,
        sellPrice: 100000,
        marginFloorPercent: 20,
        lineItems: [{ category: "other", description: "High cost", unitCost: 95000 }],
      },
    });
    const bad = await app.inject({
      method: "POST",
      url: "/v1/commercial-approvals/request",
      headers: { authorization: `Bearer ${token}` },
      payload: { costSheetId: sheet.json().sheet.id },
    });
    expect(bad.statusCode).toBe(409);
    expect(bad.json().reason).toBe("margin_below_floor");
  });
});
