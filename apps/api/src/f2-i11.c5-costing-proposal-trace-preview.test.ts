import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { f2FactsMemory } from "../src/commercial-facts/memory.js";
import { createF2Dp01MemoryPool } from "../src/f2-dp-01.memory-pool.js";

const P = TEST_BOOTSTRAP_SECRETS;
const FOREIGN_RFP = "00000000-0000-4000-8000-0000000000aa";

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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2i11-org-${batchId}` },
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
    payload: { opportunityCode: `OPP-F2I11-${suffix}`, title: "I11 trace", organizationId: orgId, paxCount: 20 },
  });
  expect(opp.statusCode).toBe(201);
  const rfp = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rfpCode: `RFP-F2I11-${suffix}`,
      opportunityId: opp.json().opportunity.id,
      title: "I11 trace",
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
      title: "I11 commercial programme",
      days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Transfer" }] }],
    },
  });
  expect(prg.statusCode).toBe(201);
  return {
    rfpId: rfp.json().rfp.id as string,
    programmeId: prg.json().programme.id as string,
  };
}

async function createCostSheet(
  app: ReturnType<typeof buildServer>,
  token: string,
  programmeId: string,
) {
  const sheet = await app.inject({
    method: "POST",
    url: "/v1/costing/sheets",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      programmeId,
      sellPrice: 10000,
      paxCount: 20,
      lineItems: [{ category: "accommodation", description: "Lodge", unitCost: 4000 }],
    },
  });
  expect(sheet.statusCode).toBe(201);
  return sheet.json().sheet as { id: string; sheetCode: string; rfpId: string; programmeId: string };
}

async function createProposal(app: ReturnType<typeof buildServer>, token: string, rfpId: string) {
  const created = await app.inject({
    method: "POST",
    url: "/v1/proposals",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpId },
  });
  expect(created.statusCode).toBe(201);
  return created.json().proposal as {
    id: string;
    proposalCode: string;
    rfpId: string;
    programmeId: string;
    costSheetId: string;
    sellPrice: number;
  };
}

function factsOf(res: { json: () => { facts: Record<string, unknown> } }) {
  return res.json().facts;
}

describe("F2-I11 C5 costing and proposal trace preview", () => {
  it("Test 1 — complete explicit RFP → programme → costing → proposal trace", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I11 Complete Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T1");
    const sheet = await createCostSheet(app, token, stack.programmeId);
    const proposal = await createProposal(app, token, stack.rfpId);

    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    const facts = factsOf(got);
    expect(facts.programmeId).toBe(stack.programmeId);
    expect(facts.rfpId).toBe(stack.rfpId);
    expect(facts.costSheetIds).toEqual([sheet.id]);
    expect(facts.proposalIds).toEqual([proposal.id]);
    expect(facts.costingIdentities).toEqual([
      {
        costSheetId: sheet.id,
        sheetCode: sheet.sheetCode,
        rfpId: stack.rfpId,
        programmeId: stack.programmeId,
        relationship: "explicit_mixed_foreign_key",
        relationshipSource: "costSheet.programmeId+costSheet.rfpId",
      },
    ]);
    expect(facts.proposalIdentities).toEqual([
      {
        proposalId: proposal.id,
        proposalCode: proposal.proposalCode,
        rfpId: stack.rfpId,
        programmeId: stack.programmeId,
        costSheetId: sheet.id,
        relationship: "explicit_mixed_foreign_key",
        relationshipSource: "proposal.rfpId+proposal.programmeId+proposal.costSheetId",
      },
    ]);
    expect(facts.trace).toMatchObject({ completeness: "complete", relationshipKind: "explicit_mixed_foreign_key" });
    expect(facts.dataSufficiency).toBe("sufficient");
    expect(facts.relationshipProvenance).toBe("explicit_mixed_foreign_key");
    expect(facts.sellPriceTreatedAsRevenue).toBe(false);
    expect(facts.costingTotalTreatedAsRevenue).toBe(false);
    expect(facts).not.toHaveProperty("sellPrice");
    expect(facts).not.toHaveProperty("totalCost");
    expect(facts).not.toHaveProperty("marginPercent");
  });

  it("Test 2 — programme present but costing missing remains partial", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I11 NoCost Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T2");

    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    const facts = factsOf(got);
    expect(facts.rfpStatus).toBe("observed");
    expect(facts.costingStatus).toBe("unavailable");
    expect(facts.proposalStatus).toBe("unavailable");
    expect(facts.costSheetIds).toEqual([]);
    expect(facts.proposalIds).toEqual([]);
    expect(facts.trace).toMatchObject({ completeness: "partial", status: "partial_rfp_observed" });
    expect(facts.dataSufficiency).toBe("partial");
  });

  it("Test 3 — costing present but proposal missing remains partial", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I11 NoProp Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T3");
    const sheet = await createCostSheet(app, token, stack.programmeId);

    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    const facts = factsOf(got);
    expect(facts.costingStatus).toBe("observed");
    expect(facts.proposalStatus).toBe("unavailable");
    expect(facts.costSheetIds).toEqual([sheet.id]);
    expect(facts.proposalIds).toEqual([]);
    expect(facts.trace).toMatchObject({ completeness: "partial", status: "partial_costing_observed" });
    expect(facts.dataSufficiency).toBe("partial");
  });

  it("Test 4 — mismatched mixed FKs are unsupported and do not complete the trace", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I11 Mismatch Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T4");
    const sheet = await createCostSheet(app, token, stack.programmeId);
    const original = store.costSheets.find((s) => s.id === sheet.id);
    expect(original).toBeTruthy();
    store.costSheets.push({
      ...original!,
      id: newId(),
      sheetCode: `${original!.sheetCode}-MISMATCH`,
      rfpId: FOREIGN_RFP,
    });

    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    const facts = factsOf(got);
    expect(facts.costSheetIds).toEqual([sheet.id]);
    expect(facts.unsupportedCostSheetIds).toHaveLength(1);
    expect(facts.unsupportedCostSheetIds).not.toContain(sheet.id);
    expect(facts.inferredFromName).toBe(false);
    expect(facts.inferredFromDate).toBe(false);
    expect(facts.inferredFromAmount).toBe(false);
    expect(facts.inferredFromCreationOrder).toBe(false);
    expect(facts.proposalStatus).toBe("unavailable");
    expect(facts.trace).toMatchObject({ completeness: "partial" });
  });

  it("Test 5 — F2-DP-01 Dev/Test persist keeps programme identifier-trace facts after cache clear", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I11 Durable Ltd");
    const stack = await createProgrammeStack(app, token, orgId, "T5");

    store.dbPool = createF2Dp01MemoryPool();
    const put = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { note: "i11-trace" },
    });
    expect(put.statusCode).toBe(200);
    f2FactsMemory(store).programmes.clear();
    const got = await app.inject({
      method: "GET",
      url: `/v1/programmes/${stack.programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().facts.note).toBe("i11-trace");
    expect(got.json().facts.itemCostingConsistencyValidated).toBe(false);
  });
});
