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

async function loginAlice(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function seedCrmOrg(app: ReturnType<typeof buildServer>, token: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", "Proposal Client Ltd,corporate,Proposal Client,UK"].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `c8-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createApprovedStack(app: ReturnType<typeof buildServer>, carolToken: string, orgId: string) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { opportunityCode: "OPP-PROP-001", title: "Safari Incentive", organizationId: orgId, paxCount: 65 },
  });
  const oppId = opp.json().opportunity.id as string;
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { rfpCode: "RFP-PROP-001", opportunityId: oppId, title: "Safari Incentive", paxCount: 65 },
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
  const req = await app.inject({
    method: "POST",
    url: "/v1/commercial-approvals/request",
    headers: { authorization: `Bearer ${carolToken}` },
    payload: { costSheetId },
  });
  const approvalId = req.json().request.id as string;
  const bobToken = await loginBob(app);
  await app.inject({
    method: "POST",
    url: `/v1/commercial-approvals/${approvalId}/decision`,
    headers: { authorization: `Bearer ${bobToken}` },
    payload: { outcome: "approved" },
  });
  return { rfpId, costSheetId };
}

describe("C8 proposal API", () => {
  it("lists C8 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("020_c8_proposal"))).toBe(true);
  });

  it("generates proposal after commercial approval and sends it", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken);
    const { rfpId } = await createApprovedStack(app, carolToken, orgId);

    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId, title: "Safari Incentive Proposal" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().proposal.proposalCode).toBe("PROP-PROP-001");
    expect(created.json().proposal.status).toBe("approved");
    expect(created.json().proposal.sellPrice).toBe(285000);
    const proposalId = created.json().proposal.id as string;

    const sent = await app.inject({
      method: "POST",
      url: `/v1/proposals/${proposalId}/transitions`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { toStatus: "sent" },
    });
    expect(sent.statusCode).toBe(200);
    expect(sent.json().proposal.status).toBe("sent");

    const rfp = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(rfp.json().rfp.workflowStage).toBe("sent");
  });

  it("rejects proposal generation without approved commercial approval", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken);
    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { opportunityCode: "OPP-NOAPR", title: "Test", organizationId: orgId },
    });
    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpCode: "RFP-NOAPR", opportunityId: opp.json().opportunity.id, title: "Test" },
    });
    const rfpId = rfp.json().rfp.id as string;
    await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId, title: "Programme" },
    });
    await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        programmeId: (await app.inject({
          method: "GET",
          url: `/v1/programmes/by-rfp/${rfpId}`,
          headers: { authorization: `Bearer ${carolToken}` },
        })).json().programme.id,
        sellPrice: 100000,
        lineItems: [{ category: "other", description: "Misc", unitCost: 50000 }],
      },
    });

    const fail = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId },
    });
    expect(fail.statusCode).toBe(409);
  });

  it("scopes proposal health and rejects unauthorized access", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const orgId = await seedCrmOrg(app, carolToken);
    const { rfpId } = await createApprovedStack(app, carolToken, orgId);
    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { rfpId },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().proposal).not.toHaveProperty("tenantId");
    const proposalId = created.json().proposal.id as string;

    store.propProposals.push({
      ...store.propProposals[0]!,
      id: "99999999-9999-4999-8999-999999999999",
      tenantId: "22222222-2222-4222-8222-222222222222",
      proposalCode: "PROP-FOREIGN",
    });

    const health = await app.inject({
      method: "GET",
      url: "/v1/proposals/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("C8");
    expect(health.json().proposals).toBe(1);

    const aliceToken = await loginAlice(app);
    const denied = await app.inject({
      method: "GET",
      url: "/v1/proposals/health",
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
      url: `/v1/proposals/${proposalId}`,
      headers: { authorization: `Bearer ${partnerToken}` },
    });
    expect(foreign.statusCode).toBe(404);

    const unauth = await app.inject({ method: "GET", url: "/v1/proposals/health" });
    expect(unauth.statusCode).toBe(401);
  });
});
