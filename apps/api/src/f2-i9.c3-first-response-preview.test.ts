import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { f2FactsMemory } from "../src/commercial-facts/memory.js";
import { createF2Dp01MemoryPool } from "../src/f2-dp-01.memory-pool.js";

const P = TEST_BOOTSTRAP_SECRETS;
const RECEIVED_AT = "2026-09-10T08:00:00.000Z";
const FIRST_RESPONSE_AT = "2026-09-10T10:00:00.000Z";
const CLARIFICATION_AT = "2026-09-11T09:30:00.000Z";
const CONFLICTING_FIRST_RESPONSE = "2026-09-10T12:00:00.000Z";
const BEFORE_RECEIVED = "2026-09-10T07:00:00.000Z";

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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2i9-org-${batchId}` },
  });
  const orgs = await app.inject({
    method: "GET",
    url: "/v1/crm/organizations",
    headers: { authorization: `Bearer ${token}` },
  });
  return orgs.json().items[0].id as string;
}

async function createOpportunity(
  app: ReturnType<typeof buildServer>,
  token: string,
  orgId: string,
  code: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: { opportunityCode: code, title: code, organizationId: orgId, paxCount: 20 },
  });
  expect(res.statusCode).toBe(201);
  return res.json().opportunity as { id: string };
}

async function createRfp(
  app: ReturnType<typeof buildServer>,
  token: string,
  opportunityId: string,
  code: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/rfps",
    headers: { authorization: `Bearer ${token}` },
    payload: { rfpCode: code, opportunityId, title: code, paxCount: 20, source: "email" },
  });
  expect(res.statusCode).toBe(201);
  return res.json().rfp as { id: string; createdAt: string; receivedAt?: string };
}

function factsOf(res: { json: () => { facts: Record<string, unknown> } }) {
  return res.json().facts;
}

function responseTimeOf(body: { metrics: Array<{ key: string; status: string; value?: number; reason?: string; population?: string; dataSufficiency?: string }> }) {
  return body.metrics.find((row) => row.key === "response_time");
}

describe("F2-I9 C3 explicit first-response preview", () => {
  it("Test 1 — explicit firstResponseAt is accepted with provenance", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I9 Accept Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I9-0001");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I9-0001");

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: FIRST_RESPONSE_AT },
    });
    expect(saved.statusCode).toBe(200);
    const facts = factsOf(saved);
    expect(facts.firstResponseAt).toBe(FIRST_RESPONSE_AT);
    expect(facts.firstResponseAtProvenance).toBe("explicit_business_fact");
    expect(facts.firstResponseAtObserved).toBe(true);
    expect(facts.firstResponseAtStatus).toBe("observed");
    expect(facts.createdAtUsedAsFirstResponse).toBe(false);
    expect(facts.receivedAtUsedAsFirstResponse).toBe(false);
    expect(facts.responseTimeReadiness).toMatchObject({
      proposalSentAtUsedAsFirstResponse: false,
      createdAtUsedAsFirstResponse: false,
      receivedAtUsedAsFirstResponse: false,
    });
  });

  it("Test 2 — date-only and invalid firstResponseAt values are rejected", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I9 Invalid Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I9-0002");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I9-0002");

    const dateOnly = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: "2026-09-10" },
    });
    expect(dateOnly.statusCode).toBe(400);
    expect(dateOnly.json().reason).toBe("invalid_firstResponseAt");

    const garbage = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: "not-a-timestamp" },
    });
    expect(garbage.statusCode).toBe(400);
    expect(garbage.json().reason).toBe("invalid_firstResponseAt");

    const after = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(factsOf(after).firstResponseAt).toBeUndefined();
    expect(factsOf(after).firstResponseAtStatus).toBe("unavailable");
  });

  it("Test 3 — missing firstResponseAt stays unavailable and createdAt/receivedAt are not substituted", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I9 Missing Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I9-0003");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I9-0003");
    expect(rfp.createdAt).toBeTruthy();

    const before = factsOf(
      await app.inject({
        method: "GET",
        url: `/v1/rfps/${rfp.id}/commercial-facts`,
        headers: { authorization: `Bearer ${token}` },
      }),
    );
    expect(before.firstResponseAt).toBeUndefined();
    expect(before.firstResponseAtStatus).toBe("unavailable");
    expect(before.createdAtUsedAsFirstResponse).toBe(false);
    expect(before.firstResponseAt).not.toBe(rfp.createdAt);

    const receipt = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: RECEIVED_AT },
    });
    expect(receipt.statusCode).toBe(200);
    expect(factsOf(receipt).receivedAt).toBe(RECEIVED_AT);
    expect(factsOf(receipt).firstResponseAt).toBeUndefined();
    expect(factsOf(receipt).receivedAtUsedAsFirstResponse).toBe(false);
    expect(factsOf(receipt).firstResponseAt).not.toBe(RECEIVED_AT);
  });

  it("Test 4 — conflicting firstResponseAt is rejected and the same value is idempotent", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I9 Conflict Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I9-0004");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I9-0004");

    const first = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: FIRST_RESPONSE_AT },
    });
    expect(first.statusCode).toBe(200);

    const again = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: FIRST_RESPONSE_AT },
    });
    expect(again.statusCode).toBe(200);
    expect(factsOf(again).firstResponseAt).toBe(FIRST_RESPONSE_AT);

    const conflict = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: CONFLICTING_FIRST_RESPONSE },
    });
    expect(conflict.statusCode).toBe(409);
    expect(conflict.json().reason).toBe("firstResponseAt_already_observed");
  });

  it("Test 5 — negative response interval is rejected", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I9 Negative Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I9-0005");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I9-0005");

    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: RECEIVED_AT },
    });

    const negative = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: BEFORE_RECEIVED },
    });
    expect(negative.statusCode).toBe(400);
    expect(negative.json().reason).toBe("negative_response_interval");

    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(factsOf(got).receivedAt).toBe(RECEIVED_AT);
    expect(factsOf(got).firstResponseAt).toBeUndefined();
  });

  it("Test 6 — F2-DP-01 Dev/Test persist keeps explicit firstResponseAt after cache clear", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I9 Durable Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I9-0006");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I9-0006");

    store.dbPool = createF2Dp01MemoryPool();

    const put = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: FIRST_RESPONSE_AT },
    });
    expect(put.statusCode).toBe(200);
    expect(put.json().facts.firstResponseAt).toBe(FIRST_RESPONSE_AT);
    expect(put.json().facts.firstResponseAtProvenance).toBe("explicit_business_fact");
    expect(put.json().facts.createdAtUsedAsFirstResponse).toBe(false);
    expect(put.json().facts.receivedAtUsedAsFirstResponse).toBe(false);

    f2FactsMemory(store).rfps.clear();
    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().facts.firstResponseAt).toBe(FIRST_RESPONSE_AT);
  });

  it("Test 7 — I8 receipt and clarification observations remain intact", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I9 I8 Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I9-0007");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I9-0007");

    const receipt = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        receivedAt: RECEIVED_AT,
        clarificationEvent: { eventType: "requested", eventAt: CLARIFICATION_AT },
      },
    });
    expect(receipt.statusCode).toBe(200);
    expect(factsOf(receipt).receivedAt).toBe(RECEIVED_AT);
    expect((factsOf(receipt).clarificationEvents as Array<{ eventAt: string }>).map((e) => e.eventAt)).toEqual([
      CLARIFICATION_AT,
    ]);

    const response = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: FIRST_RESPONSE_AT },
    });
    expect(response.statusCode).toBe(200);
    expect(factsOf(response).receivedAt).toBe(RECEIVED_AT);
    expect(factsOf(response).firstResponseAt).toBe(FIRST_RESPONSE_AT);
    expect((factsOf(response).clarificationEvents as Array<{ eventAt: string }>)).toHaveLength(1);
  });

  it("Test 8 — response time stays unavailable when either timestamp is missing", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I9 Partial Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I9-0008");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I9-0008");

    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: FIRST_RESPONSE_AT },
    });

    const onlyFirst = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(responseTimeOf(onlyFirst.json())?.status).toBe("unavailable");
    expect(responseTimeOf(onlyFirst.json())?.reason).toBe("insufficient_timestamps_no_complete_received_to_response_chain");
    expect(responseTimeOf(onlyFirst.json())?.value).toBeUndefined();
  });

  it("Test 9 — response time is derived only when every preview RFP has both explicit timestamps", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I9 Derived Ltd");
    const completeOpp = await createOpportunity(app, token, orgId, "OPP-F2I9-0009A");
    const incompleteOpp = await createOpportunity(app, token, orgId, "OPP-F2I9-0009B");
    const complete = await createRfp(app, token, completeOpp.id, "RFP-F2I9-0009A");
    const incomplete = await createRfp(app, token, incompleteOpp.id, "RFP-F2I9-0009B");

    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${complete.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: RECEIVED_AT, firstResponseAt: FIRST_RESPONSE_AT },
    });
    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${incomplete.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: RECEIVED_AT },
    });

    const mixed = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const mixedMetric = responseTimeOf(mixed.json());
    expect(mixedMetric?.status).toBe("unavailable");
    expect(mixedMetric?.value).toBeUndefined();
    expect(mixedMetric?.population).toBe("preview_tenant_rfps");
    expect(mixedMetric?.dataSufficiency).toBe("partial");
    expect(mixedMetric?.reason).toBe("insufficient_timestamps_no_complete_received_to_response_chain");

    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${incomplete.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: FIRST_RESPONSE_AT },
    });

    const completeSet = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const derived = responseTimeOf(completeSet.json());
    expect(derived?.status).toBe("derived");
    expect(derived?.value).toBe(2 * 60 * 60 * 1000);
    expect(derived?.population).toBe("preview_tenant_rfps");
    expect(derived?.dataSufficiency).toBe("sufficient");
  });
});
