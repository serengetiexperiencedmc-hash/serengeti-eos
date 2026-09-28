import { describe, expect, it } from "vitest";
import { QUALIFICATION_CONDITION_KEYS } from "@sedmc/kernel";
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
  const csv = ["legalName,organizationTypeKey,tradingName,country", "F2 I2 Client Ltd,corporate,F2 I2,United Kingdom"].join(
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2i2-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createOpportunity(app: ReturnType<typeof buildServer>, token: string, orgId: string, code: string) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: code,
      title: "F2-I2 Safari Incentive",
      organizationId: orgId,
      programmeSummary: "Northern Circuit",
      paxCount: 40,
    },
  });
  expect(res.statusCode).toBe(201);
  return res.json().opportunity as { id: string; stage: string; ownerPrincipalId: string };
}

describe("F2-I2 C2/C3 commercial facts (in-memory/preview)", () => {
  it("keeps qualification independent of new_qualified and requires OR-01-B plus next action", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I2-0001");

    expect(opp.stage).toBe("new_qualified");
    expect(opp.ownerPrincipalId).toBeTruthy();

    const initial = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(initial.statusCode).toBe(200);
    const facts = initial.json().facts;
    expect(facts.workflowStage).toBe("new_qualified");
    expect(facts.qualificationStatus).toBe("not_yet_assessed");
    expect(facts.or01Qualified).toBe(false);
    expect(facts.newQualifiedStageIsNotQualification).toBe(true);
    expect(facts.ownerExistsBeforeQualification).toBe(true);
    expect(facts.nextAction).toBeUndefined();

    const incomplete = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { qualificationStatus: "qualified" },
    });
    expect(incomplete.statusCode).toBe(400);

    const conditions = Object.fromEntries(QUALIFICATION_CONDITION_KEYS.map((key) => [key, true]));
    const qualified = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        qualificationStatus: "qualified",
        qualificationConditions: conditions,
        nextAction: { description: "Call buyer with draft programme", dueAt: "2026-09-25T10:00:00Z" },
        qualificationEvidenceRefs: ["note:original-rfp"],
      },
    });
    expect(qualified.statusCode).toBe(200);
    expect(qualified.json().facts.qualificationStatus).toBe("qualified");
    expect(qualified.json().facts.or01Qualified).toBe(true);
    expect(qualified.json().facts.workflowStage).toBe("new_qualified");
    expect(qualified.json().facts.nextAction.description).toBe("Call buyer with draft programme");
    expect(qualified.json().facts.qualificationConditions.buyer_account_fit).toBe(true);
    expect(qualified.json().facts.qualificationConditions).not.toHaveProperty("budget");
  });

  it("records SOURCE ≠ CHANNEL without treating legacy RfpRecord.source as F2 SOURCE", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I2-0002");

    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rfpCode: "RFP-F2I2-0002",
        opportunityId: opp.id,
        title: "F2-I2 RFP",
        source: "email",
      },
    });
    expect(rfp.statusCode).toBe(201);
    const rfpId = rfp.json().rfp.id as string;
    expect(rfp.json().rfp.source).toBe("email");

    const before = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(before.statusCode).toBe(200);
    expect(before.json().facts.legacyCollapsedSource).toBe("email");
    expect(before.json().facts.legacyCollapsedSourceAuthoritativeForF2).toBe(false);
    expect(before.json().facts.primarySource).toBeUndefined();
    expect(before.json().facts.channel).toBeUndefined();

    const tooMany = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        primarySource: "referral",
        secondarySources: ["linkedin", "website_organic", "corporate_direct"],
        channel: "email",
      },
    });
    expect(tooMany.statusCode).toBe(400);

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        primarySource: "referral",
        secondarySources: ["linkedin", "website_organic"],
        channel: "email",
        clarificationStatus: "started",
      },
    });
    expect(saved.statusCode).toBe(200);
    expect(saved.json().facts.primarySource).toBe("referral");
    expect(saved.json().facts.secondarySources).toEqual(["linkedin", "website_organic"]);
    expect(saved.json().facts.channel).toBe("email");
    expect(saved.json().facts.clarificationStatus).toBe("started");
    expect(saved.json().facts.legacyCollapsedSource).toBe("email");
    expect(saved.json().facts.legacyCollapsedSourceAuthoritativeForF2).toBe(false);

    const unchanged = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(unchanged.json().rfp.source).toBe("email");
  });

  it("distinguishes primary vs contributing loss reasons and requires LR-12 explanation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I2-0003");

    const tooEarly = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { closedLost: { primary: "LR-01" } },
    });
    expect(tooEarly.statusCode).toBe(409);

    await app.inject({
      method: "POST",
      url: `/v1/pipeline/opportunities/${opp.id}/transitions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { toStage: "lost" },
    });

    const missingOther = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { closedLost: { primary: "LR-12" } },
    });
    expect(missingOther.statusCode).toBe(400);

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        closedLost: {
          primary: "LR-01",
          contributing: ["LR-02", "LR-12"],
          otherExplanation: "Buyer also selected a competing DMC",
        },
      },
    });
    expect(saved.statusCode).toBe(200);
    expect(saved.json().facts.closedLost.primary).toBe("LR-01");
    expect(saved.json().facts.closedLost.contributing).toEqual(["LR-02", "LR-12"]);
    expect(saved.json().facts.workflowStage).toBe("lost");
    expect(saved.json().facts.qualificationStatus).toBe("not_yet_assessed");
  });

  it("keeps intake owner history when follow-up ownership transfers", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedCrmOrg(app, token);
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I2-0004");
    const intakeOwner = opp.ownerPrincipalId;

    const transferred = await app.inject({
      method: "POST",
      url: `/v1/pipeline/opportunities/${opp.id}/commercial-facts/transfers`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        newOwnerPrincipalId: "principal-transfer-target",
        nextAction: "Handover briefing with Commercial Director",
      },
    });
    expect(transferred.statusCode).toBe(200);
    const facts = transferred.json().facts;
    expect(facts.intakeOwnerPrincipalId).toBe(intakeOwner);
    expect(facts.followUpOwnerPrincipalId).toBe("principal-transfer-target");
    expect(facts.ownerPrincipalId).toBe("principal-transfer-target");
    expect(facts.ownershipTransfers).toHaveLength(1);
    expect(facts.ownershipTransfers[0].previousOwnerPrincipalId).toBe(intakeOwner);
    expect(facts.nextAction.description).toContain("Handover");
  });
});
