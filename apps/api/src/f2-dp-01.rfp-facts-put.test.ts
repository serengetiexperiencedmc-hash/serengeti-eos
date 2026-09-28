import { describe, expect, it } from "vitest";
import type { DbPool } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { f2FactsMemory } from "../src/commercial-facts/memory.js";
import { runF2Dp01BoundedDevtestApiStartup } from "../src/commercial-facts/bounded-startup.js";
import { createF2Dp01MemoryPool } from "../src/f2-dp-01.memory-pool.js";
import { isMixedSqlDurable } from "../src/persistence/durable.js";

const P = TEST_BOOTSTRAP_SECRETS;
const RECEIVED_AT = "2026-09-10T08:00:00.000Z";
const FIRST_RESPONSE_AT = "2026-09-10T10:00:00.000Z";
const CLARIFICATION_AT = "2026-09-11T09:30:00.000Z";
const APPROVED_URL = "postgres://eos:test-secret-do-not-print@127.0.0.1:5432/eos";

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `d3-org-${batchId}` },
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
  return res.json().rfp as { id: string; tenantId?: string; createdAt: string };
}

function factsOf(res: { json: () => { facts: Record<string, unknown> } }) {
  return res.json().facts;
}

function recordingPool() {
  const sql: string[] = [];
  const query = (async (text: string) => {
    sql.push(String(text));
    return { rows: [], rowCount: 0 };
  }) as DbPool["query"];
  return {
    sql,
    pool: {
      query,
      connect: async () => ({ query, release() {} }),
      options: { connectionString: APPROVED_URL },
    } as unknown as DbPool,
  };
}

function throwingRfpSidecarPool() {
  const query = (async (text: string) => {
    if (/INSERT INTO f2_rfp_facts/i.test(String(text))) {
      throw new Error("sidecar_unavailable");
    }
    return { rows: [], rowCount: 0 };
  }) as DbPool["query"];
  return {
    query,
    connect: async () => ({ query, release() {} }),
    options: { connectionString: APPROVED_URL },
  } as unknown as DbPool;
}

describe("H-111 Day 3 — RFP commercial-facts PUT vertical slice", () => {
  it("GET returns existing RFP facts without synthesizing timestamps or collapsing SOURCE into CHANNEL", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Get Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-GET");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-GET");

    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    const facts = factsOf(got);
    expect(facts.rfpId).toBe(rfp.id);
    expect(facts.primarySource).toBeUndefined();
    expect(facts.channel).toBeUndefined();
    expect(facts.legacyCollapsedSource).toBe("email");
    expect(facts.legacyCollapsedSourceAuthoritativeForF2).toBe(false);
    expect(facts.sourceDistinctFromChannel).toBe(true);
    expect(facts.receivedAt).toBeUndefined();
    expect(facts.firstResponseAt).toBeUndefined();
    expect(facts.createdAtUsedAsReceivedAt).toBe(false);
    expect(got.json().persistence.recorded).toBe(false);
    expect(got.json().persistence.mixedSqlDurable).toBe(false);
  });

  it("authorized PUT persists SOURCE, CHANNEL, explicit timestamps and returns persistence status", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Put Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-PUT");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-PUT");

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        primarySource: "referral",
        channel: "email",
        receivedAt: RECEIVED_AT,
        firstResponseAt: FIRST_RESPONSE_AT,
        clarificationStatus: "started",
        clarificationEvent: { eventType: "requested", eventAt: CLARIFICATION_AT },
      },
    });
    expect(saved.statusCode).toBe(200);
    const facts = factsOf(saved);
    expect(facts.primarySource).toBe("referral");
    expect(facts.channel).toBe("email");
    expect(facts.receivedAt).toBe(RECEIVED_AT);
    expect(facts.firstResponseAt).toBe(FIRST_RESPONSE_AT);
    expect(facts.clarificationStatus).toBe("started");
    expect((facts.clarificationEvents as Array<{ eventAt: string }>)[0].eventAt).toBe(CLARIFICATION_AT);
    expect(facts.sourceDistinctFromChannel).toBe(true);
    expect(saved.json().persistence.recorded).toBe(true);
    expect(saved.json().persistence.mixedSqlDurable).toBe(false);
  });

  it("persistence survives hydration after process-local cache clear", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Hydrate Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-HYD");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-HYD");
    store.dbPool = createF2Dp01MemoryPool();

    const put = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "website_organic", channel: "website_web_form", receivedAt: RECEIVED_AT },
    });
    expect(put.statusCode).toBe(200);
    expect(put.json().persistence.mode).toBe("f2_dp01_sidecar");

    f2FactsMemory(store).rfps.clear();
    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(factsOf(got).primarySource).toBe("website_organic");
    expect(factsOf(got).channel).toBe("website_web_form");
    expect(factsOf(got).receivedAt).toBe(RECEIVED_AT);
    expect(factsOf(got).firstResponseAt).toBeUndefined();
  });

  it("partial update does not erase unrelated fields", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Partial Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-PAR");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-PAR");

    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        primarySource: "trade_show_industry_event",
        channel: "trade_show_in_person",
        receivedAt: RECEIVED_AT,
      },
    });

    const partial = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { clarificationStatus: "completed" },
    });
    expect(partial.statusCode).toBe(200);
    const facts = factsOf(partial);
    expect(facts.clarificationStatus).toBe("completed");
    expect(facts.primarySource).toBe("trade_show_industry_event");
    expect(facts.channel).toBe("trade_show_in_person");
    expect(facts.receivedAt).toBe(RECEIVED_AT);
    expect(facts.firstResponseAt).toBeUndefined();
  });

  it("rejects invalid SOURCE (including CHANNEL keys used as SOURCE)", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 BadSrc Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-BSRC");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-BSRC");

    const invented = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "walk_in", channel: "email" },
    });
    expect(invented.statusCode).toBe(400);
    expect(invented.json().reason).toBe("invalid_primary_source");

    const channelAsSource = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "email", channel: "email" },
    });
    expect(channelAsSource.statusCode).toBe(400);
    expect(channelAsSource.json().reason).toBe("invalid_primary_source");
  });

  it("rejects invalid CHANNEL (including SOURCE keys used as CHANNEL)", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 BadCh Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-BCH");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-BCH");

    const invented = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "referral", channel: "sms" },
    });
    expect(invented.statusCode).toBe(400);
    expect(invented.json().reason).toBe("invalid_channel");

    const sourceAsChannel = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "referral", channel: "referral" },
    });
    expect(sourceAsChannel.statusCode).toBe(400);
    expect(sourceAsChannel.json().reason).toBe("invalid_channel");
  });

  it("keeps SOURCE and CHANNEL distinct and does not infer one from the other", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Distinct Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-DIST");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-DIST");

    const sourceOnly = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "referral" },
    });
    expect(sourceOnly.statusCode).toBe(400);
    expect(sourceOnly.json().reason).toBe("primary_source_and_channel_required");

    const channelOnly = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { channel: "whatsapp" },
    });
    expect(channelOnly.statusCode).toBe(400);
    expect(channelOnly.json().reason).toBe("primary_source_and_channel_required");

    const both = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "referral", channel: "whatsapp" },
    });
    expect(both.statusCode).toBe(200);
    expect(factsOf(both).primarySource).toBe("referral");
    expect(factsOf(both).channel).toBe("whatsapp");
    expect(factsOf(both).sourceDistinctFromChannel).toBe(true);
    expect(factsOf(both).legacyCollapsedSource).toBe("email");
    expect(factsOf(both).channel).not.toBe(factsOf(both).legacyCollapsedSource);
  });

  it("unauthorized and unauthenticated updates are refused", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Authz Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-AUTH");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-AUTH");

    const anon = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      payload: { primarySource: "referral", channel: "email" },
    });
    expect(anon.statusCode).toBe(401);

    const alice = await loginAlice(app);
    const forbidden = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${alice}` },
      payload: { primarySource: "referral", channel: "email" },
    });
    expect(forbidden.statusCode).toBe(403);
  });

  it("protects immutable identifiers on PUT", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Ids Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-IDS");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-IDS");

    const mismatchedRfp = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId: "00000000-0000-4000-8000-000000000099", primarySource: "referral", channel: "email" },
    });
    expect(mismatchedRfp.statusCode).toBe(409);
    expect(mismatchedRfp.json().reason).toBe("rfpId_immutable");

    const mismatchedId = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { id: "not-this-rfp", clarificationStatus: "started" },
    });
    expect(mismatchedId.statusCode).toBe(409);
    expect(mismatchedId.json().reason).toBe("rfpId_immutable");

    const mismatchedTenant = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { tenantId: "00000000-0000-4000-8000-000000000077" },
    });
    expect(mismatchedTenant.statusCode).toBe(409);
    expect(mismatchedTenant.json().reason).toBe("tenantId_immutable");

    const matching = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { rfpId: rfp.id, primarySource: "referral", channel: "phone" },
    });
    expect(matching.statusCode).toBe(200);
    expect(factsOf(matching).rfpId).toBe(rfp.id);
    expect(factsOf(matching).channel).toBe("phone");
  });

  it("validates timestamps and does not treat PUT time as first response", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Ts Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-TS");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-TS");
    const before = Date.now();

    const garbage = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { firstResponseAt: "tomorrow" },
    });
    expect(garbage.statusCode).toBe(400);
    expect(garbage.json().reason).toBe("invalid_firstResponseAt");

    const saved = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "existing_client_repeat", channel: "email" },
    });
    expect(saved.statusCode).toBe(200);
    expect(factsOf(saved).firstResponseAt).toBeUndefined();
    expect(factsOf(saved).receivedAt).toBeUndefined();
    expect(factsOf(saved).firstResponseAtStatus).toBe("unavailable");
    const after = Date.now();
    expect(Date.parse(String(factsOf(saved).updatedAt ?? "x"))).not.toBeGreaterThan(after + 1000);
    expect(before).toBeLessThanOrEqual(after);
  });

  it("missing and empty timestamps stay absent; observed receivedAt is immutable", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Missing Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-MISS");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-MISS");

    const empty = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: "" },
    });
    expect(empty.statusCode).toBe(400);

    const first = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: RECEIVED_AT },
    });
    expect(first.statusCode).toBe(200);

    const rewrite = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { receivedAt: FIRST_RESPONSE_AT },
    });
    expect(rewrite.statusCode).toBe(409);
    expect(rewrite.json().reason).toBe("receivedAt_already_observed");

    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(factsOf(got).receivedAt).toBe(RECEIVED_AT);
    expect(factsOf(got).firstResponseAt).toBeUndefined();
  });

  it("sidecar persist failure does not write facts or fall back to mixed SQL", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Fail Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-FAIL");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-FAIL");
    store.dbPool = throwingRfpSidecarPool();
    store.f2Dp01BoundedSidecarOnly = true;

    const put = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "referral", channel: "email", receivedAt: RECEIVED_AT },
    });
    expect(put.statusCode).toBe(409);
    expect(put.json().reason).toBe("f2_sidecar_persist_failed");
    expect(f2FactsMemory(store).rfps.get(rfp.id)).toBeUndefined();

    const got = await app.inject({
      method: "GET",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(got.statusCode).toBe(200);
    expect(factsOf(got).primarySource).toBeUndefined();
    expect(factsOf(got).receivedAt).toBeUndefined();
    expect(got.json().persistence.recorded).toBe(false);
  });

  it("bounded sidecar-only PUT writes f2_rfp_facts and does not treat mixed SQL as durable", async () => {
    const store = seedStore("test-secret");
    const recorded = recordingPool();
    await runF2Dp01BoundedDevtestApiStartup({ store, pool: recorded.pool });
    expect(isMixedSqlDurable(store)).toBe(false);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Day3 Mixed Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-D3-MIX");
    const rfp = await createRfp(app, token, opp.id, "RFP-D3-MIX");

    const put = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "partner", channel: "email" },
    });
    expect(put.statusCode).toBe(400);
    expect(put.json().reason).toBe("invalid_primary_source");

    const ok = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "existing_partner_agency", channel: "email" },
    });
    expect(ok.statusCode).toBe(200);
    expect(ok.json().persistence.mode).toBe("f2_dp01_sidecar");
    expect(ok.json().persistence.mixedSqlDurable).toBe(false);

    const joined = recorded.sql.join("\n").toLowerCase();
    expect(joined).toContain("f2_rfp_facts");
    expect(joined).not.toMatch(/insert into rfp_/);
    expect(joined).not.toMatch(/update rfp_/);
    expect(joined).not.toContain("schema_migrations");
    expect(joined).not.toMatch(/opp_opportunities/);
  });
});
