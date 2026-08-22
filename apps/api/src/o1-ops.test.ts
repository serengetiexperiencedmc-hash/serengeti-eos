import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const TENANT = "11111111-1111-4111-8111-111111111111";

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function seedCrmOrg(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "Ops Client Ltd,corporate,Ops Client,UK"].join("\n");
  const created = await app.inject({
    method: "POST",
    url: "/v1/crm/imports",
    headers: { authorization: `Bearer ${token}` },
    payload: { sourceSystem: "test", entityType: "organization", csv },
  });
  const batchId = created.json().batch.id as string;
  await app.inject({ method: "POST", url: `/v1/crm/imports/${batchId}/validate`, headers: { authorization: `Bearer ${token}` } });
  await app.inject({
    method: "POST",
    url: `/v1/crm/imports/${batchId}/execute`,
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `ops-org-${batchId}` },
  });
  const orgs = await app.inject({ method: "GET", url: "/v1/crm/organizations", headers: { authorization: `Bearer ${token}` } });
  return orgs.json().items[0].id as string;
}

async function createBookingStack(app: ReturnType<typeof buildServer>, token: string, orgId: string, store: ReturnType<typeof seedStore>) {
  const supplierId = newId();
  const now = new Date().toISOString();
  store.supSuppliers.push({
    id: supplierId,
    tenantId: TENANT,
    supplierCode: "SUP-OPS-001",
    legalName: "Ops Safari Lodge",
    tradingName: "Ops Lodge",
    category: "accommodation",
    country: "TZ",
    status: "active",
    preferredPartner: false,
    dataQualityStatus: "Verified",
    classification: "Internal",
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  });

  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: { opportunityCode: "OPP-OPS-001", title: "Safari Incentive", organizationId: orgId, paxCount: 65 },
  });
  const oppId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpCode: "RFP-OPS-001", opportunityId: oppId, title: "Safari Incentive", paxCount: 65 },
  });
  const rfpId = rfp.json().rfp.id as string;
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpId,
      title: "Safari Programme",
      days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Transfer", supplierId, supplierLabel: "Ops Lodge" }] }],
    },
  });
  const programmeId = prg.json().programme.id as string;
  const sheet = await app.inject({
    method: "POST",
    url: "/v1/costing/sheets",
    headers: { authorization: `Bearer ${token}` },
    payload: { programmeId, sellPrice: 285000, paxCount: 65, lineItems: [{ category: "accommodation", description: "Lodges", unitCost: 86400 }] },
  });
  const costSheetId = sheet.json().sheet.id as string;
  const approvalReq = await app.inject({
    method: "POST",
    url: "/v1/commercial-approvals/request",
    headers: { authorization: `Bearer ${token}` },
    payload: { costSheetId },
  });
  const bob = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "bob.approver@sedmc.local", password: P.bobPassword, tenantSlug: "sedmc" },
  });
  await app.inject({
    method: "POST",
    url: `/v1/commercial-approvals/${approvalReq.json().request.id}/decision`,
    headers: { authorization: `Bearer ${bob.json().accessToken}` },
    payload: { outcome: "approved" },
  });
  const proposal = await app.inject({
    method: "POST",
    url: "/v1/proposals",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpId },
  });
  const proposalId = proposal.json().proposal.id as string;
  await app.inject({ method: "POST", url: `/v1/proposals/${proposalId}/transitions`, headers: { authorization: `Bearer ${token}` }, payload: { toStatus: "sent" } });
  await app.inject({ method: "POST", url: `/v1/proposals/${proposalId}/transitions`, headers: { authorization: `Bearer ${token}` }, payload: { toStatus: "accepted" } });
  const booking = await app.inject({
    method: "POST",
    url: "/v1/bookings",
    headers: { authorization: `Bearer ${token}` },
    payload: { proposalId },
  });
  return { bookingId: booking.json().booking.id as string, programmeId };
}

describe("O1-O3 operations API", () => {
  it("lists ops migrations", () => {
    const files = listMigrationFiles();
    expect(files.some((f) => f.includes("022_o1_ops_supplier_confirmation"))).toBe(true);
    expect(files.some((f) => f.includes("023_o2_ops_manifest"))).toBe(true);
    expect(files.some((f) => f.includes("024_o3_ops_field"))).toBe(true);
  });

  it("generates supplier confirmations and completes handover task", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const { bookingId } = await createBookingStack(app, token, orgId, store);

    const generated = await app.inject({
      method: "POST",
      url: "/v1/ops/supplier-confirmations/generate",
      headers: { authorization: `Bearer ${token}` },
      payload: { bookingId },
    });
    expect(generated.statusCode).toBe(201);

    const detail = await app.inject({
      method: "GET",
      url: `/v1/bookings/${bookingId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    const supplierTask = detail.json().handoverTasks.find((t: { taskKey: string }) => t.taskKey === "supplier_confirm");
    expect(supplierTask?.status).toBe("complete");
  });

  it("publishes manifest and issues ops brief", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const { bookingId } = await createBookingStack(app, token, orgId, store);

    const manifest = await app.inject({
      method: "POST",
      url: `/v1/ops/manifests/by-booking/${bookingId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    const manifestId = manifest.json().manifest.id as string;
    await app.inject({
      method: "POST",
      url: `/v1/ops/manifests/${manifestId}/entries`,
      headers: { authorization: `Bearer ${token}` },
      payload: { guestName: "Jane Doe", dietary: "Vegetarian" },
    });
    const published = await app.inject({
      method: "POST",
      url: `/v1/ops/manifests/${manifestId}/publish`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(published.statusCode).toBe(200);
    expect(published.json().manifest.status).toBe("published");

    await app.inject({
      method: "PUT",
      url: `/v1/ops/briefs/by-booking/${bookingId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { content: "Field briefing for safari incentive group." },
    });
    const issued = await app.inject({
      method: "POST",
      url: `/v1/ops/briefs/by-booking/${bookingId}/issue`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(issued.statusCode).toBe(200);
    expect(issued.json().brief.issuedAt).toBeTruthy();
  });
});

describe("J1 commercial analytics API", () => {
  it("returns commercial summary rollups", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const res = await app.inject({
      method: "GET",
      url: "/v1/analytics/commercial/summary",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().summary).toMatchObject({
      currency: "USD",
      totalOpportunities: expect.any(Number),
      winRatePercent: expect.any(Number),
    });
  });
});
