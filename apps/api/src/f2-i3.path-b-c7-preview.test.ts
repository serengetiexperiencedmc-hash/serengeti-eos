import { describe, expect, it } from "vitest";
import { evaluateCommercialApprovalGate, evaluatePathBApprovalRequirement } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { evaluatePreviewPathBSend } from "../src/commercial-facts/path-b.js";

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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2i3-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createApprovedStack(
  app: ReturnType<typeof buildServer>,
  carolToken: string,
  orgId: string,
  suffix: string,
) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { opportunityCode: `OPP-F2I3-${suffix}`, title: "Path B preview", organizationId: orgId, paxCount: 65 },
  });
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: {
      rfpCode: `RFP-F2I3-${suffix}`,
      opportunityId: opp.json().opportunity.id,
      title: "Path B preview",
      paxCount: 65,
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
  const sheet = await app.inject({
    method: "POST",
    url: "/v1/costing/sheets",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: {
      programmeId: prg.json().programme.id,
      sellPrice: 285000,
      paxCount: 65,
      lineItems: [{ category: "accommodation", description: "Lodges", unitCost: 86400 }],
    },
  });
  const costSheetId = sheet.json().sheet.id as string;
  const req = await app.inject({
    method: "POST",
    url: "/v1/commercial-approvals/request",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { costSheetId },
  });
  const bobToken = await loginBob(app);
  await app.inject({
    method: "POST",
    url: `/v1/commercial-approvals/${req.json().request.id}/decision`,
    headers: { authorization: `Bearer ${bobToken}` },
    payload: { outcome: "approved" },
  });
  return { rfpId, costSheetId, bobToken, legacyGateType: req.json().request.gateType as string };
}

describe("F2-I3 Path B on in-memory/preview proposal send", () => {
  it("Test A — no exceptional category allows existing preview send", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I3 A Ltd");
    const { rfpId } = await createApprovedStack(app, carolToken, orgId, "A");

    const pathB = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(pathB.statusCode).toBe(200);
    expect(pathB.json().pathB.required).toBe(false);
    expect(pathB.json().pathB.status).toBe("not_required");
    expect(pathB.json().pathB.categories).toEqual([]);

    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().pathBApproval.required).toBe(false);
    const proposalId = created.json().proposal.id as string;

    const sent = await app.inject({
      method: "POST",
      url: `/v1/proposals/${proposalId}/transitions`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { toStatus: "sent" },
    });
    expect(sent.statusCode).toBe(200);
    expect(sent.json().proposal.status).toBe("sent");
  });

  it("Test B — one Path B category blocks send until qualitative approval", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I3 B Ltd");
    const { rfpId, bobToken } = await createApprovedStack(app, carolToken, orgId, "B");

    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId },
    });
    expect(created.statusCode).toBe(201);
    const proposalId = created.json().proposal.id as string;

    const declared = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { categories: ["exceptional_discounting"] },
    });
    expect(declared.statusCode).toBe(200);
    expect(declared.json().pathB.required).toBe(true);
    expect(declared.json().pathB.status).toBe("pending");
    expect(declared.json().pathB.categories).toEqual(["exceptional_discounting"]);

    const blocked = await app.inject({
      method: "POST",
      url: `/v1/proposals/${proposalId}/transitions`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { toStatus: "sent" },
    });
    expect(blocked.statusCode).toBe(409);
    expect(blocked.json().reason).toBe("path_b_approval_required");

    const self = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/path-b-approval/decision`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { outcome: "approved" },
    });
    expect(self.statusCode).toBe(403);

    const decided = await app.inject({
      method: "POST",
      url: `/v1/rfps/${rfpId}/path-b-approval/decision`,
      headers: { authorization: `Bearer ${bobToken}` },
      payload: { outcome: "approved", notes: "Discount accepted" },
    });
    expect(decided.statusCode).toBe(200);
    expect(decided.json().pathB.status).toBe("approved");
    expect(decided.json().pathB.categories).toEqual(["exceptional_discounting"]);

    const sent = await app.inject({
      method: "POST",
      url: `/v1/proposals/${proposalId}/transitions`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { toStatus: "sent" },
    });
    expect(sent.statusCode).toBe(200);
    expect(sent.json().proposal.status).toBe("sent");
  });

  it("Test C — multiple Path B categories are all preserved", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I3 C Ltd");
    const { rfpId } = await createApprovedStack(app, carolToken, orgId, "C");

    const declared = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        categories: ["unusual_payment_credit", "strategic_high_risk_accounts", "exceptional_discounting"],
      },
    });
    expect(declared.statusCode).toBe(200);
    expect(declared.json().pathB.categories).toEqual([
      "unusual_payment_credit",
      "strategic_high_risk_accounts",
      "exceptional_discounting",
    ]);
    expect(declared.json().pathB.required).toBe(true);
    expect(declared.json().pathB.commercialFacts.legacyCollapsedSourceAuthoritativeForF2).toBe(false);
  });

  it("Test D — Path B decision does not use sell price or margin percentage", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I3 D Ltd");
    const { rfpId, costSheetId } = await createApprovedStack(app, carolToken, orgId, "D");

    const sheet = store.costSheets.find((s) => s.id === costSheetId);
    expect(sheet?.sellPrice).toBe(285000);

    const unset = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(unset.json().pathB.required).toBe(false);
    expect(evaluatePreviewPathBSend(store, rfpId).allowed).toBe(true);

    const empty = evaluatePathBApprovalRequirement([]);
    expect(empty.required).toBe(false);
    const withCategory = evaluatePathBApprovalRequirement(["margin_below_approved_floor"]);
    expect(withCategory.required).toBe(true);
    expect(withCategory.categories).toEqual(["margin_below_approved_floor"]);
    expect(JSON.stringify(withCategory)).not.toMatch(/250000|250_000|20%/);
  });

  it("Test E — mixed legacy numerical gate is unchanged", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken, "F2 I3 E Ltd");
    const { rfpId, legacyGateType } = await createApprovedStack(app, carolToken, orgId, "E");

    expect(legacyGateType).toBe("sell_threshold");
    const legacy = evaluateCommercialApprovalGate({
      marginPercent: 30.4,
      marginFloorPercent: 20,
      sellPrice: 285000,
    });
    expect(legacy.gateType).toBe("sell_threshold");

    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { categories: ["significant_contractual_commitments"] },
    });
    const after = evaluateCommercialApprovalGate({
      marginPercent: 30.4,
      marginFloorPercent: 20,
      sellPrice: 285000,
    });
    expect(after.gateType).toBe("sell_threshold");
    expect(evaluatePreviewPathBSend(store, rfpId).categories).toEqual(["significant_contractual_commitments"]);
  });
});
