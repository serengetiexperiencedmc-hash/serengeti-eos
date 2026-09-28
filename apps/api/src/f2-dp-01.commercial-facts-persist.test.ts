import { describe, expect, it } from "vitest";
import { evaluateCommercialApprovalGate, QUALIFICATION_CONDITION_KEYS } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { f2FactsMemory } from "../src/commercial-facts/memory.js";
import { f2Dp01PersistDecision } from "../src/commercial-facts/persist.js";
import { createF2Dp01MemoryPool, F2_DP01_GATEB_URL } from "../src/f2-dp-01.memory-pool.js";

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
  const csv = ["legalName,organizationTypeKey,tradingName,country", `${name},corporate,${name},United Kingdom`].join(
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2dp01-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

describe("F2-DP-01 bounded Dev/Test F2 commercial-facts persist", () => {
  it("persists the six granted maps across process-local cache clear and leaves mixed rows in place", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 DP01 Client Ltd");

    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const account = await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        organizationId: orgId,
        accountName: "DP01 Account",
        market: "Europe",
      },
    });
    expect(account.statusCode).toBe(201);
    const accountId = account.json().account.id as string;

    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        opportunityCode: "OPP-F2DP01-0001",
        title: "F2-DP-01 persist",
        organizationId: orgId,
        accountId,
        paxCount: 20,
      },
    });
    expect(opp.statusCode).toBe(201);
    const opportunityId = opp.json().opportunity.id as string;
    expect(store.oppOpportunities.some((o) => o.id === opportunityId)).toBe(true);

    const rfp = await app.inject({
      method: "POST",
      url: "/v1/rfps",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rfpCode: "RFP-F2DP01-0001",
        opportunityId,
        title: "F2-DP-01 RFP",
        source: "email",
      },
    });
    expect(rfp.statusCode).toBe(201);
    const rfpId = rfp.json().rfp.id as string;

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "SUP-F2DP01",
        legalName: "DP01 Lodge",
        category: "accommodation",
        country: "TZ",
        defaultCurrency: "TZS",
      },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;
    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "SGL-BB",
        rateName: "SGL-BB",
        rateType: "per_room_per_night",
        amount: 250,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        status: "active",
      },
    });
    expect(rate.statusCode).toBe(201);
    const rateId = rate.json().rate.id as string;

    const programme = await app.inject({
      method: "POST",
      url: "/v1/programmes",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rfpId,
        title: "DP01 programme",
        days: [{ dayNumber: 1, title: "Day 1", items: [{ title: "Transfer" }] }],
      },
    });
    expect(programme.statusCode).toBe(201);
    const programmeId = programme.json().programme.id as string;

    store.dbPool = createF2Dp01MemoryPool();

    const accountPut = await app.inject({
      method: "PUT",
      url: `/v1/crm/accounts/${accountId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { accountType: "pco", market: "south_africa" },
    });
    expect(accountPut.statusCode).toBe(200);
    expect(accountPut.json().facts.legacyCrmMarketAuthoritativeForF2).toBe(false);

    const conditions = Object.fromEntries(QUALIFICATION_CONDITION_KEYS.map((key) => [key, true]));
    const oppPut = await app.inject({
      method: "PUT",
      url: `/v1/pipeline/opportunities/${opportunityId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        qualificationStatus: "qualified",
        qualificationConditions: conditions,
        nextAction: { description: "Follow up with buyer" },
      },
    });
    expect(oppPut.statusCode).toBe(200);
    expect(oppPut.json().facts.qualificationStatus).toBe("qualified");
    expect(oppPut.json().facts.or01Qualified).toBe(true);
    expect(oppPut.json().facts.qualificationIsIndependentOfWorkflowStage).toBe(true);
    expect(oppPut.json().facts.workflowStage).not.toBe("qualified");

    const rfpPut = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        primarySource: "referral",
        channel: "email",
        receivedAt: "2026-09-10T08:00:00.000Z",
      },
    });
    expect(rfpPut.statusCode).toBe(200);
    expect(rfpPut.json().facts.primarySource).toBe("referral");
    expect(rfpPut.json().facts.channel).toBe("email");
    expect(rfpPut.json().facts.legacyCollapsedSourceAuthoritativeForF2).toBe(false);
    expect(rfpPut.json().facts.createdAtUsedAsReceivedAt).toBe(false);

    const pathBPut = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${token}` },
      payload: { categories: ["significant_contractual_commitments"] },
    });
    expect(pathBPut.statusCode).toBe(200);
    expect(pathBPut.json().pathB.required).toBe(true);

    const ratePut = await app.inject({
      method: "PUT",
      url: `/v1/suppliers/${supplierId}/rates/${rateId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        versionIdentity: 1,
        sourceClass: "direct_supplier_contract",
        rateType: "negotiated_contracted",
        originalCurrency: "TZS",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
      },
    });
    expect(ratePut.statusCode).toBe(200);
    expect(ratePut.json().identity.fxProviderImplemented).toBe(false);

    const programmePut = await app.inject({
      method: "PUT",
      url: `/v1/programmes/${programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { note: "identifier-trace only" },
    });
    expect(programmePut.statusCode).toBe(200);
    expect(programmePut.json().facts.sellPriceTreatedAsRevenue).toBe(false);

    const mem = f2FactsMemory(store);
    mem.opportunities.clear();
    mem.rfps.clear();
    mem.pathB.clear();
    mem.accounts.clear();
    mem.rates.clear();
    mem.programmes.clear();

    const oppGot = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${opportunityId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(oppGot.statusCode).toBe(200);
    expect(oppGot.json().facts.qualificationStatus).toBe("qualified");
    expect(oppGot.json().facts.c1Account.market).toBe("south_africa");

    const rfpGot = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(rfpGot.statusCode).toBe(200);
    expect(rfpGot.json().facts.receivedAt).toBe("2026-09-10T08:00:00.000Z");

    const pathBGot = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfpId}/path-b-approval`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(pathBGot.statusCode).toBe(200);
    expect(pathBGot.json().pathB.categories).toEqual(["significant_contractual_commitments"]);

    const accountGot = await app.inject({
      method: "GET",
      url: `/v1/crm/accounts/${accountId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(accountGot.statusCode).toBe(200);
    expect(accountGot.json().facts.market).toBe("south_africa");

    const mixedAccount = await app.inject({
      method: "GET",
      url: `/v1/crm/accounts/${accountId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(mixedAccount.json().account.market).toBe("Europe");

    const rateGot = await app.inject({
      method: "GET",
      url: `/v1/suppliers/${supplierId}/rates/${rateId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(rateGot.statusCode).toBe(200);
    expect(rateGot.json().identities).toHaveLength(1);

    const programmeGot = await app.inject({
      method: "GET",
      url: `/v1/programmes/${programmeId}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(programmeGot.statusCode).toBe(200);
    expect(programmeGot.json().facts.note).toBe("identifier-trace only");
    expect(programmeGot.json().facts.trace.rfpObserved).toBe(true);

    const kpi = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(kpi.statusCode).toBe(409);
    expect(kpi.json().reason).toBe("f2_i7_in_memory_preview_only");

    expect(mem.opportunities.size).toBeGreaterThan(0);
    expect((store as { bookings?: unknown }).bookings).toBeUndefined();

    const organizationTypesStillListed = types.statusCode;
    expect(organizationTypesStillListed).toBe(200);
  });

  it("does not authorize eos_gateb or Production persist and does not invent a 250k/20% F2 rule", () => {
    const store = seedStore("test-secret");
    store.dbPool = createF2Dp01MemoryPool(F2_DP01_GATEB_URL);
    expect(f2Dp01PersistDecision(store)).toEqual({ persist: false, reason: "eos_gateb_not_authorized" });

    store.dbPool = createF2Dp01MemoryPool();
    expect(f2Dp01PersistDecision(store, { EOS_ENV: "production" })).toEqual({
      persist: false,
      reason: "production_not_authorized",
    });

    const legacy = evaluateCommercialApprovalGate({
      marginPercent: 30.4,
      marginFloorPercent: 20,
      sellPrice: 250000,
    });
    expect(legacy.gateType).toBe("sell_threshold");
  });

  it("keeps eos_gateb commercial-facts on the preview-only 409 boundary", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 DP01 GateB Ltd");
    const opp = await app.inject({
      method: "POST",
      url: "/v1/pipeline/opportunities",
      headers: { authorization: `Bearer ${token}` },
      payload: { opportunityCode: "OPP-F2DP01-GATEB", title: "gateb", organizationId: orgId, paxCount: 10 },
    });
    store.dbPool = createF2Dp01MemoryPool(F2_DP01_GATEB_URL);
    const got = await app.inject({
      method: "GET",
      url: `/v1/pipeline/opportunities/${opp.json().opportunity.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(409);
    expect(got.json().reason).toBe("f2_i2_in_memory_preview_only");
  });
});
