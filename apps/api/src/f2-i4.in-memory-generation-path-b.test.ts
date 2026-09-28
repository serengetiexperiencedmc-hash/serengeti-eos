import { describe, expect, it } from "vitest";
import { evaluateCommercialApprovalGate } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { evaluatePreviewPathBSend } from "../src/commercial-facts/path-b.js";
import { createF2Dp01MemoryPool } from "../src/f2-dp-01.memory-pool.js";

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

async function seedCrmOrg(app: ReturnType<typeof buildServer>, token: string, name: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", `${name},corporate,${name},UK`].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2i4-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createPreviewStack(
  app: ReturnType<typeof buildServer>,
  carolToken: string,
  orgId: string,
  suffix: string,
  sellPrice = 285000,
) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { opportunityCode: `OPP-F2I4-${suffix}`, title: "I4 preview", organizationId: orgId, paxCount: 40 },
  });
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: {
      rfpCode: `RFP-F2I4-${suffix}`,
      opportunityId: opp.json().opportunity.id,
      title: "I4 preview",
      paxCount: 40,
      source: "email",
    },
  });
  const rfpId = rfp.json().rfp.id as string;
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { rfpId, title: "Safari Programme", days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Transfer" }] }] },
  });
  await app.inject({
    method: "POST",
    url: "/v1/costing/sheets",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: {
      programmeId: prg.json().programme.id,
      sellPrice,
      paxCount: 40,
      lineItems: [{ category: "accommodation", description: "Lodges", unitCost: 86400 }],
    },
  });
  return { rfpId };
}

describe("F2-I4 in-memory proposal generation Path B", () => {
  it("Test 1 — Path B not_required allows preview generation without legacy ComApprovalRequest", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I4 T1 Ltd");
    const { rfpId } = await createPreviewStack(app, carolToken, orgId, "T1");

    expect(store.comApprovalRequests.filter((r) => r.rfpId === rfpId)).toHaveLength(0);

    const pathB = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(pathB.json().pathB.required).toBe(false);
    expect(pathB.json().pathB.status).toBe("not_required");

    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().proposal.status).toBe("approved");
    expect(created.json().pathBApproval.required).toBe(false);
  });

  it("Test 2 — one approved Path B category allows preview generation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const bobToken = await loginBob(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I4 T2 Ltd");
    const { rfpId } = await createPreviewStack(app, carolToken, orgId, "T2");

    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { categories: ["exceptional_discounting"] },
    });
    const decided = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/path-b-approval/decision`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { outcome: "approved" },
    });
    expect(decided.statusCode).toBe(200);
    expect(decided.json().pathB.status).toBe("approved");

    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().pathBApproval.categories).toEqual(["exceptional_discounting"]);
    expect(created.json().pathBApproval.status).toBe("approved");
  });

  it("Test 3 — outstanding Path B category blocks preview generation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I4 T3 Ltd");
    const { rfpId } = await createPreviewStack(app, carolToken, orgId, "T3");

    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { categories: ["unusual_payment_credit"] },
    });

    const blocked = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId },
    });
    expect(blocked.statusCode).toBe(409);
    expect(blocked.json().reason).toBe("path_b_approval_required");
  });

  it("Test 4 — multiple approved categories allow generate; outstanding blocks", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const bobToken = await loginBob(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I4 T4 Ltd");
    const categories = [
      "unusual_payment_credit",
      "strategic_high_risk_accounts",
      "exceptional_discounting",
    ];

    const approved = await createPreviewStack(app, carolToken, orgId, "T4A");
    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${approved.rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { categories },
    });
    await app.inject({
      method: "POST",
      url: `/v1/rfps/${approved.rfpId}/path-b-approval/decision`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { outcome: "approved" },
    });
    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId: approved.rfpId },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().pathBApproval.categories).toEqual(categories);

    const outstanding = await createPreviewStack(app, carolToken, orgId, "T4B");
    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${outstanding.rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { categories },
    });
    const blocked = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId: outstanding.rfpId },
    });
    expect(blocked.statusCode).toBe(409);
    expect(blocked.json().reason).toBe("path_b_approval_required");
    const pending = await app.inject({
      method: "GET",
      url: `/v1/rfps/${outstanding.rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(pending.json().pathB.categories).toEqual(categories);
    expect(pending.json().pathB.status).toBe("pending");
  });

  it("Test 5 — 285000 does not independently create a Path B requirement", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I4 T5 Ltd");
    const { rfpId } = await createPreviewStack(app, carolToken, orgId, "T5", 285000);

    const sheet = store.costSheets.find((s) => s.rfpId === rfpId);
    expect(sheet?.sellPrice).toBe(285000);
    expect(evaluatePreviewPathBSend(store, rfpId).required).toBe(false);

    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().pathBApproval.required).toBe(false);
  });

  it("Test 6 — F2-DP-01 Dev/Test generate uses Path B; mixed 250k/20% remains legacy", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I4 T6 Ltd");
    const { rfpId } = await createPreviewStack(app, carolToken, orgId, "T6");

    store.dbPool = createF2Dp01MemoryPool();

    expect(evaluatePreviewPathBSend(store, rfpId).allowed).toBe(true);

    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().pathBApproval.required).toBe(false);

    const legacy = evaluateCommercialApprovalGate({
      marginPercent: 30.4,
      marginFloorPercent: 20,
      sellPrice: 285000,
    });
    expect(legacy.gateType).toBe("sell_threshold");
  });
});
