import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { f2FactsMemory } from "../src/commercial-facts/memory.js";
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

async function seedOrg(app: ReturnType<typeof buildServer>, token: string, name: string) {
  const csv = ["legalName,organizationTypeKey,tradingName,country", `${name},corporate,${name},United Kingdom`].join("\n");
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2i10-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createProgrammeStack(
  app: ReturnType<typeof buildServer>,
  token: string,
  orgId: string,
  suffix: string,
) {
  const opp = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: { opportunityCode: `OPP-F2I10-${suffix}`, title: "I10 programme", organizationId: orgId, paxCount: 20 },
  });
  expect(opp.statusCode).toBe(201);
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: `RFP-F2I10-${suffix}`,
      opportunityId: opp.json().opportunity.id,
      title: "I10 programme",
      paxCount: 20,
    },
  });
  expect(rfp.statusCode).toBe(201);
  const prg = await app.inject({
    method: "POST",
    url: "/v1/programmes",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpId: rfp.json().rfp.id,
      title: "I10 commercial programme",
      days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Transfer" }] }],
    },
  });
  expect(prg.statusCode).toBe(201);
  return {
    opportunityId: opp.json().opportunity.id as string,
    rfpId: rfp.json().rfp.id as string,
    programmeId: prg.json().programme.id as string,
  };
}

function factsOf(res: { json: () => { facts: Record<string, unknown> } }) {
  return res.json().facts;
}

describe("F2-I10 C5 programme identity/trace preview", () => {
  it("Test 1 — programme-to-RFP identity is observed without synthesizing costing or proposal", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I10 Identity Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T1");

    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    const facts = factsOf(got);
    expect(facts.programmeId).toBe(stack.programmeId);
    expect(facts.rfpId).toBe(stack.rfpId);
    expect(facts.opportunityId).toBe(stack.opportunityId);
    expect(facts.rfpObserved).toBe(true);
    expect(facts.rfpStatus).toBe("observed");
    expect(facts.costingReferencesProgramme).toBe(false);
    expect(facts.costingStatus).toBe("unavailable");
    expect(facts.proposalReferencesProgramme).toBe(false);
    expect(facts.proposalStatus).toBe("unavailable");
    expect(facts.observedClientFacingVersionStatus).toBe("unavailable");
    expect(facts.officeDocumentIsNotIdentity).toBe(true);
    expect(facts.mixedProgrammeDatesUsedAsCommercialConsistency).toBe(false);
    expect(facts.itemCostingConsistencyValidated).toBe(false);
    expect(facts.trace).toMatchObject({ status: "partial_rfp_observed" });
  });

  it("Test 2 — missing programme is not found and invalid version observations are rejected", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I10 Missing Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T2");

    const missing = await app.inject({
      method: "GET",
      url: "/v1/programmes/00000000-0000-4000-8000-000000000099/commercial-facts",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missing.statusCode).toBe(404);

    const unrecorded = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { observedClientFacingVersionNumber: 1 },
    });
    expect(unrecorded.statusCode).toBe(400);
    expect(unrecorded.json().reason).toBe("programme_version_not_recorded");

    const invalid = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { observedClientFacingVersionNumber: "v1" },
    });
    expect(invalid.statusCode).toBe(400);
    expect(invalid.json().reason).toBe("invalid_programme_version");
  });

  it("Test 3 — costing reference is observed without treating cost amount as identity", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I10 Costing Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T3");

    const sheet = await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId: stack.programmeId,
        sellPrice: 10000,
        paxCount: 20,
        lineItems: [{ category: "accommodation", description: "Lodge", unitCost: 4000 }],
      },
    });
    expect(sheet.statusCode).toBe(201);

    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(factsOf(got).costingReferencesProgramme).toBe(true);
    expect(factsOf(got).costingStatus).toBe("observed");
    expect(factsOf(got).costSheetIds).toEqual([sheet.json().sheet.id]);
    expect(factsOf(got).proposalStatus).toBe("unavailable");
    expect(factsOf(got).trace).toMatchObject({ status: "partial_costing_observed" });
  });

  it("Test 4 — proposal reference completes the preview identity chain", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I10 Proposal Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T4");
    await app.inject({
      method: "POST",
      url: "/v1/costing/sheets",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        programmeId: stack.programmeId,
        sellPrice: 10000,
        paxCount: 20,
        lineItems: [{ category: "accommodation", description: "Lodge", unitCost: 4000 }],
      },
    });
    const created = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId: stack.rfpId },
    });
    expect(created.statusCode).toBe(201);

    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(factsOf(got).proposalReferencesProgramme).toBe(true);
    expect(factsOf(got).proposalStatus).toBe("observed");
    expect(factsOf(got).proposalIds).toEqual([created.json().proposal.id]);
    expect(factsOf(got).trace).toMatchObject({ status: "rfp_programme_costing_proposal_observed" });
  });

  it("Test 5 — explicit client-facing version is idempotent and conflicting values are rejected", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I10 Version Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T5");

    const version = await app.inject({
      method: "POST",
      url: `/v1/programmes/${stack.programmeId}/versions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { summary: "Baseline itinerary" },
    });
    expect(version.statusCode).toBe(201);
    const versionNumber = version.json().version.versionNumber as number;

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { observedClientFacingVersionNumber: versionNumber, note: "Client-facing baseline" },
    });
    expect(saved.statusCode).toBe(200);
    expect(factsOf(saved).observedClientFacingVersionNumber).toBe(versionNumber);
    expect(factsOf(saved).observedClientFacingVersionProvenance).toBe("explicit_business_fact");
    expect(factsOf(saved).observedClientFacingVersionStatus).toBe("observed");
    expect(factsOf(saved).note).toBe("Client-facing baseline");

    const again = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { observedClientFacingVersionNumber: versionNumber },
    });
    expect(again.statusCode).toBe(200);

    const secondVersion = await app.inject({
      method: "POST",
      url: `/v1/programmes/${stack.programmeId}/versions`,
      headers: { authorization: `Bearer ${token}` },
      payload: { summary: "Revised itinerary" },
    });
    expect(secondVersion.statusCode).toBe(201);

    const conflict = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { observedClientFacingVersionNumber: secondVersion.json().version.versionNumber },
    });
    expect(conflict.statusCode).toBe(409);
    expect(conflict.json().reason).toBe("programme_version_already_observed");
  });

  it("Test 6 — F2-DP-01 Dev/Test persist keeps programme facts after cache clear", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I10 Durable Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T6");

    store.dbPool = createF2Dp01MemoryPool();

    const put = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { note: "identifier-trace persist" },
    });
    expect(put.statusCode).toBe(200);
    expect(put.json().facts.note).toBe("identifier-trace persist");
    expect(put.json().facts.sellPriceTreatedAsRevenue).toBe(false);

    f2FactsMemory(store).programmes.clear();
    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().facts.note).toBe("identifier-trace persist");
    expect(got.json().facts.trace.relationshipKind).toBe("explicit_mixed_foreign_key");
  });
});
