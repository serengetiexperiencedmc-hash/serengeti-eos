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
  const csv = ["legalName,organizationTypeKey,tradingName,country", "Booking Client Ltd,corporate,Booking Client,UK"].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `c9-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createSentProposal(app: ReturnType<typeof buildServer>, carolToken: string, orgId: string) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { opportunityCode: "OPP-BKG-001", title: "Safari Incentive", organizationId: orgId, paxCount: 65 },
  });
  const oppId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { rfpCode: "RFP-BKG-001", opportunityId: oppId, title: "Safari Incentive", paxCount: 65 },
  });
  const rfpId = rfp.json().rfp.id as string;
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { rfpId, title: "Safari Programme", days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Transfer" }] }] },
  });
  const programmeId = prg.json().programme.id as string;
  const sheet = await app.inject({
    method: "POST",
    url: "/v1/costing/sheets",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: {
      programmeId,
      sellPrice: 285000,
      paxCount: 65,
      lineItems: [{ category: "accommodation", description: "Lodges", unitCost: 86400 }],
    },
  });
  const costSheetId = sheet.json().sheet.id as string;
  const approvalReq = await app.inject({
    method: "POST",
    url: "/v1/commercial-approvals/request",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { costSheetId },
  });
  const approvalId = approvalReq.json().request.id as string;
  const bobToken = await loginBob(app);
  await app.inject({
    method: "POST",
    url: `/v1/commercial-approvals/${approvalId}/decision`,
    headers: { authorization: `Bearer ${bobToken}` },
    payload: { outcome: "approved" },
  });
  const proposal = await app.inject({
    method: "POST",
    url: "/v1/proposals",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { rfpId },
  });
  const proposalId = proposal.json().proposal.id as string;
  await app.inject({
    method: "POST",
    url: `/v1/proposals/${proposalId}/transitions`,
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { toStatus: "sent" },
  });
  await app.inject({
    method: "POST",
    url: `/v1/proposals/${proposalId}/transitions`,
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { toStatus: "accepted" },
  });
  return { proposalId, rfpId, oppId };
}

describe("C9 booking API", () => {
  it("lists C9 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("021_c9_booking"))).toBe(true);
  });

  it("creates booking from accepted proposal with handover tasks", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const { proposalId } = await createSentProposal(app, token, orgId);

    const created = await app.inject({
      method: "POST",
      url: "/v1/bookings",
      headers: { authorization: `Bearer ${token}` },
      payload: { proposalId },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().booking.bookingCode).toBe("BKG-BKG-001");
    expect(created.json().handoverTasks.length).toBeGreaterThanOrEqual(4);

    const opp = store.oppOpportunities.find((o) => o.opportunityCode === "OPP-BKG-001");
    expect(opp?.stage).toBe("won");
  });

  it("completes handover tasks and updates booking status", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const { proposalId } = await createSentProposal(app, token, orgId);

    const created = await app.inject({
      method: "POST",
      url: "/v1/bookings",
      headers: { authorization: `Bearer ${token}` },
      payload: { proposalId },
    });
    const bookingId = created.json().booking.id as string;
    const taskId = created.json().handoverTasks[0].id as string;

    const completed = await app.inject({
      method: "POST",
      url: `/v1/bookings/${bookingId}/handover-tasks/${taskId}/complete`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(completed.statusCode).toBe(200);
    expect(completed.json().booking.status).toBe("handover_pending");
  });
});
