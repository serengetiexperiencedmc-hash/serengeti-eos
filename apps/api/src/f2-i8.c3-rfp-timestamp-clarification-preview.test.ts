import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { f2FactsMemory } from "../src/commercial-facts/memory.js";
import { createF2Dp01MemoryPool } from "../src/f2-dp-01.memory-pool.js";

const P = TEST_BOOTSTRAP_SECRETS;
const RECEIVED_AT = "2026-09-10T08:00:00.000Z";
const FIRST_RESPONSE_AT = "2026-09-10T10:00:00.000Z";
const CLARIFICATION_AT = "2026-09-11T09:30:00.000Z";

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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2i8-org-${batchId}` },
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
  return res.json().rfp as { id: string; createdAt: string; receivedAt?: string; source?: string };
}

function factsOf(res: { json: () => { facts: Record<string, unknown> } }) {
  return res.json().facts;
}

describe("F2-I8 C3 RFP timestamp and clarification preview", () => {
  it("Test 1 — explicit receivedAt is accepted and returned with provenance", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Receipt Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0001");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0001");

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: RECEIVED_AT, receivedAtNote: "Logged from buyer covering email" },
    });
    expect(saved.statusCode).toBe(200);
    const facts = factsOf(saved);
    expect(facts.receivedAt).toBe(RECEIVED_AT);
    expect(facts.receivedAtProvenance).toBe("explicit_business_fact");
    expect(facts.receivedAtObserved).toBe(true);
    expect(facts.receivedAtStatus).toBe("observed");
    expect(facts.receivedAtNote).toBe("Logged from buyer covering email");
    expect(facts.createdAtUsedAsReceivedAt).toBe(false);
    expect(facts.legacyRfpRecordReceivedAtAuthoritativeForF2).toBe(false);

    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(factsOf(got).receivedAt).toBe(RECEIVED_AT);
  });

  it("Test 2 — missing receivedAt remains absent and is not synthesized", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Absent Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0002");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0002");

    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    const facts = factsOf(got);
    expect(facts.receivedAt).toBeUndefined();
    expect(facts.receivedAtObserved).toBe(false);
    expect(facts.receivedAtStatus).toBe("unavailable");
    expect(facts.firstResponseAt).toBeUndefined();
    expect(facts.firstResponseAtStatus).toBe("unavailable");
    expect(facts.clarificationEvents).toEqual([]);
    expect(facts.responseTimeReadiness).toMatchObject({
      status: "unavailable",
      createdAtUsedAsReceivedAt: false,
      proposalSentAtUsedAsFirstResponse: false,
    });
  });

  it("Test 3 — createdAt is not treated as receivedAt", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Created Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0003");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0003");
    expect(rfp.createdAt).toBeTruthy();

    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    const facts = factsOf(got);
    expect(facts.rfpCreatedAt).toBe(rfp.createdAt);
    expect(facts.receivedAt).toBeUndefined();
    expect(facts.createdAtUsedAsReceivedAt).toBe(false);
    expect(facts.legacyRfpRecordReceivedAtAuthoritativeForF2).toBe(false);
    expect(facts.receivedAtIsNotCreatedAt).toBe(true);
    if (rfp.receivedAt) {
      expect(facts.legacyRfpRecordReceivedAt).toBe(rfp.receivedAt);
      expect(facts.receivedAt).not.toBe(rfp.receivedAt);
    }
  });

  it("Test 4 — invalid timestamps are rejected", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Invalid Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0004");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0004");

    const garbage = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: "not-a-timestamp" },
    });
    expect(garbage.statusCode).toBe(400);
    expect(garbage.json().reason).toBe("invalid_receivedAt");

    const dateOnly = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: "2026-09-18" },
    });
    expect(dateOnly.statusCode).toBe(400);
    expect(dateOnly.json().reason).toBe("invalid_receivedAt");

    const empty = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: "" },
    });
    expect(empty.statusCode).toBe(400);

    const after = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(factsOf(after).receivedAt).toBeUndefined();
  });

  it("Test 5 — clarification observation records an explicit timestamp", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Clar Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0005");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0005");

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        clarificationEvent: {
          eventType: "requested",
          eventAt: CLARIFICATION_AT,
          note: "Buyer asked for lodge availability",
        },
      },
    });
    expect(saved.statusCode).toBe(200);
    const events = factsOf(saved).clarificationEvents as Array<{
      eventType: string;
      eventAt: string;
      provenance: string;
      note?: string;
    }>;
    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe("requested");
    expect(events[0].eventAt).toBe(CLARIFICATION_AT);
    expect(events[0].provenance).toBe("explicit_business_fact");
    expect(events[0].note).toBe("Buyer asked for lodge availability");
    expect(factsOf(saved).responseTimeReadiness).toMatchObject({
      clarificationRequestedAtObserved: true,
      clarificationAnsweredAtObserved: false,
      status: "partially_ready",
    });
  });

  it("Test 6 — clarification timestamps are not inferred from status", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Infer Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0006");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0006");

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { clarificationStatus: "started" },
    });
    expect(saved.statusCode).toBe(200);
    expect(factsOf(saved).clarificationStatus).toBe("started");
    expect(factsOf(saved).clarificationEvents).toEqual([]);
    expect(factsOf(saved).receivedAt).toBeUndefined();

    const badEvent = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { clarificationEvent: { eventType: "requested" } },
    });
    expect(badEvent.statusCode).toBe(400);
    expect(badEvent.json().reason).toBe("invalid_clarification_timestamp");
  });

  it("Test 7 — existing RFP commercial facts remain compatible", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Compat Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0007");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0007");

    const source = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        primarySource: "referral",
        secondarySources: ["linkedin"],
        channel: "email",
        clarificationStatus: "started",
      },
    });
    expect(source.statusCode).toBe(200);
    expect(factsOf(source).primarySource).toBe("referral");
    expect(factsOf(source).channel).toBe("email");
    expect(factsOf(source).clarificationStatus).toBe("started");
    expect(factsOf(source).legacyCollapsedSource).toBe("email");
    expect(factsOf(source).legacyCollapsedSourceAuthoritativeForF2).toBe(false);

    const stamped = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: RECEIVED_AT },
    });
    expect(stamped.statusCode).toBe(200);
    expect(factsOf(stamped).primarySource).toBe("referral");
    expect(factsOf(stamped).channel).toBe("email");
    expect(factsOf(stamped).clarificationStatus).toBe("started");
    expect(factsOf(stamped).receivedAt).toBe(RECEIVED_AT);

    const conflict = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: "2026-09-12T08:00:00.000Z" },
    });
    expect(conflict.statusCode).toBe(409);
    expect(conflict.json().reason).toBe("receivedAt_already_observed");
  });

  it("Test 8 — F2-DP-01 Dev/Test persist keeps explicit receivedAt after process-local cache clear", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Durable Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0008");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0008");

    store.dbPool = createF2Dp01MemoryPool();

    const put = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: RECEIVED_AT },
    });
    expect(put.statusCode).toBe(200);
    expect(put.json().facts.receivedAt).toBe(RECEIVED_AT);
    expect(put.json().facts.receivedAtProvenance).toBe("explicit_business_fact");
    expect(put.json().facts.legacyRfpRecordReceivedAtAuthoritativeForF2).toBe(false);

    f2FactsMemory(store).rfps.clear();
    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().facts.receivedAt).toBe(RECEIVED_AT);
    expect(got.json().facts.createdAtUsedAsReceivedAt).toBe(false);
  });

  it("Test 9 — response time stays unavailable without firstResponseAt", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Rt Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0009");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0009");

    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        receivedAt: RECEIVED_AT,
        clarificationEvent: { eventType: "requested", eventAt: CLARIFICATION_AT },
      },
    });

    const kpis = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(kpis.statusCode).toBe(200);
    const responseTime = (kpis.json().metrics as Array<{ key: string; status: string; value?: number; reason?: string }>).find(
      (row) => row.key === "response_time",
    );
    expect(responseTime?.status).toBe("unavailable");
    expect(responseTime?.reason).toBe("insufficient_timestamps_no_complete_received_to_response_chain");
    expect(responseTime?.value).toBeUndefined();

    const facts = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(factsOf(facts).responseTimeReadiness).toMatchObject({
      receivedAtObserved: true,
      firstResponseAtObserved: false,
      status: "partially_ready",
    });
  });

  it("Test 10 — provenance distinguishes observed, derived, and unavailable", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I8 Prov Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I8-0010");
    const rfp = await createRfp(app, token, opp.id, "RFP-F2I8-0010");

    const before = factsOf(
      await app.inject({
        method: "GET",
        url: `/v1/rfps/${rfp.id}/commercial-facts`,
        headers: { authorization: `Bearer ${token}` },
      }),
    );
    expect(before.receivedAtStatus).toBe("unavailable");
    expect(before.firstResponseAtStatus).toBe("unavailable");

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: RECEIVED_AT, firstResponseAt: FIRST_RESPONSE_AT },
    });
    expect(saved.statusCode).toBe(200);
    expect(factsOf(saved).receivedAtStatus).toBe("observed");
    expect(factsOf(saved).firstResponseAtStatus).toBe("observed");
    expect(factsOf(saved).receivedAtProvenance).toBe("explicit_business_fact");
    expect(factsOf(saved).firstResponseAtProvenance).toBe("explicit_business_fact");
    expect(factsOf(saved).responseTimeReadiness).toMatchObject({
      status: "first_response_chain_ready",
      createdAtUsedAsReceivedAt: false,
      proposalSentAtUsedAsFirstResponse: false,
    });

    const kpis = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const responseTime = (kpis.json().metrics as Array<{ key: string; status: string; value?: number }>).find(
      (row) => row.key === "response_time",
    );
    expect(responseTime?.status).toBe("derived");
    expect(responseTime?.value).toBe(2 * 60 * 60 * 1000);
  });
});
