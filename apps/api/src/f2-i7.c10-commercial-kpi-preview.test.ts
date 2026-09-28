import { describe, expect, it } from "vitest";
import { QUALIFICATION_CONDITION_KEYS, newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const CONDITIONS = Object.fromEntries(QUALIFICATION_CONDITION_KEYS.map((key) => [key, true]));

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
    headers: { authorization: `Bearer ${token}`, "idempotency-key": `f2i7-org-${batchId}` },
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
  extras?: { estimatedValue?: number; accountId?: string },
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/pipeline/opportunities",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      opportunityCode: code,
      title: code,
      organizationId: orgId,
      paxCount: 20,
      ...(extras?.estimatedValue !== undefined ? { estimatedValue: extras.estimatedValue } : {}),
      ...(extras?.accountId ? { accountId: extras.accountId } : {}),
    },
  });
  expect(res.statusCode).toBe(201);
  return res.json().opportunity as { id: string; stage: string };
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
    payload: { rfpCode: code, opportunityId, title: code, paxCount: 20 },
  });
  expect(res.statusCode).toBe(201);
  return res.json().rfp as { id: string };
}

async function qualify(app: ReturnType<typeof buildServer>, token: string, opportunityId: string) {
  const res = await app.inject({
    method: "PUT",
    url: `/v1/pipeline/opportunities/${opportunityId}/commercial-facts`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      qualificationStatus: "qualified",
      qualificationConditions: CONDITIONS,
      nextAction: { description: "Follow up", dueAt: "2026-09-25T10:00:00Z" },
    },
  });
  expect(res.statusCode).toBe(200);
}

function metric(body: { metrics: Array<{ key: string }> }, key: string) {
  return body.metrics.find((row) => row.key === key) as {
    key: string;
    status: string;
    value?: number;
    reason?: string;
    formula?: string;
    numerator?: number;
    denominator?: number;
    numericalTargetAuthorized: boolean;
    legacyApprovalThresholdApplied?: boolean;
  };
}

describe("F2-I7 C10 commercial KPI preview", () => {
  it("Test 1 — RFP volume is the observed RFP count", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I7 Volume Ltd");
    const a = await createOpportunity(app, token, orgId, "OPP-F2I7-V1");
    const b = await createOpportunity(app, token, orgId, "OPP-F2I7-V2");
    await createRfp(app, token, a.id, "RFP-F2I7-V1");
    await createRfp(app, token, b.id, "RFP-F2I7-V2");

    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(metric(res.json(), "rfp_volume").status).toBe("observed");
    expect(metric(res.json(), "rfp_volume").value).toBe(2);
  });

  it("Test 2 — qualified count uses explicit qualification, not new_qualified stage", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I7 Qual Ltd");
    const staged = await createOpportunity(app, token, orgId, "OPP-F2I7-Q1");
    const qualifiedOpp = await createOpportunity(app, token, orgId, "OPP-F2I7-Q2");
    expect(staged.stage).toBe("new_qualified");
    expect(qualifiedOpp.stage).toBe("new_qualified");
    await qualify(app, token, qualifiedOpp.id);

    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(metric(res.json(), "qualified_opportunities").value).toBe(1);
    expect(res.json().outcomes.workflowStageIsNotQualification).toBe(true);
    expect(res.json().outcomes.qualified).toBe(1);
  });

  it("Test 3 — conversion uses qualified opportunities and booking outcomes", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I7 Conv Ltd");
    const booked = await createOpportunity(app, token, orgId, "OPP-F2I7-C1");
    const open = await createOpportunity(app, token, orgId, "OPP-F2I7-C2");
    await qualify(app, token, booked.id);
    await qualify(app, token, open.id);
    const now = new Date().toISOString();
    const tenantId = store.oppOpportunities.find((o) => o.id === booked.id)!.tenantId;
    store.bkgBookings.push({
      id: newId(),
      tenantId,
      bookingCode: "BKG-F2I7-C1",
      proposalId: newId(),
      rfpId: newId(),
      programmeId: newId(),
      opportunityId: booked.id,
      organizationId: orgId,
      title: "Converted",
      status: "confirmed",
      currency: "USD",
      sellPrice: 100000,
      confirmedAt: now,
      classification: "Internal",
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      updatedByPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const conv = metric(res.json(), "conversion_rate");
    expect(conv.status).toBe("derived");
    expect(conv.numerator).toBe(1);
    expect(conv.denominator).toBe(2);
    expect(conv.value).toBe(0.5);
    expect(conv.formula).toContain("qualified_opportunities");
  });

  it("Test 4 — conversion is unavailable when booking outcomes are missing", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I7 Conv Miss Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I7-CM1");
    await qualify(app, token, opp.id);

    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const conv = metric(res.json(), "conversion_rate");
    expect(conv.status).toBe("unavailable");
    expect(conv.reason).toBe("no_booking_outcome_facts_in_population");
    expect(conv.value).toBeUndefined();
  });

  it("Test 5 — revenue is unavailable and does not substitute costing or proposal value", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I7 Rev Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I7-R1", { estimatedValue: 285000 });
    await createRfp(app, token, opp.id, "RFP-F2I7-R1");

    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const revenue = metric(res.json(), "revenue");
    expect(revenue.status).toBe("unavailable");
    expect(revenue.reason).toContain("not_revenue");
    expect(revenue.value).toBeUndefined();
  });

  it("Test 6 — response time is unavailable without receivedAt", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I7 Rt Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I7-RT1");
    await createRfp(app, token, opp.id, "RFP-F2I7-RT1");

    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const responseTime = metric(res.json(), "response_time");
    expect(responseTime.status).toBe("unavailable");
    expect(responseTime.reason).toBe("insufficient_timestamps_no_complete_received_to_response_chain");
    expect(responseTime.value).toBeUndefined();
  });

  it("Test 7 — pipeline value sums explicit estimatedValue and does not apply 250k/20%", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I7 Pipe Ltd");
    await createOpportunity(app, token, orgId, "OPP-F2I7-P1", { estimatedValue: 285000 });
    await createOpportunity(app, token, orgId, "OPP-F2I7-P2", { estimatedValue: 10000 });
    await createOpportunity(app, token, orgId, "OPP-F2I7-P3");

    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const pipeline = metric(res.json(), "pipeline_value");
    expect(pipeline.status).toBe("derived");
    expect(pipeline.value).toBe(295000);
    expect(pipeline.legacyApprovalThresholdApplied).toBe(false);
    expect(res.json().legacySellThresholdApplied).toBe(false);
    expect(res.json().numericalTargetsAuthorized).toBe(false);
  });

  it("Test 8 — repeat business uses explicit SOURCE and is not inferred from names", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "Repeat Name Client Ltd");
    const missing = await createOpportunity(app, token, orgId, "OPP-F2I7-RB0");
    await createRfp(app, token, missing.id, "RFP-F2I7-RB0");
    const empty = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(metric(empty.json(), "repeat_business").status).toBe("unavailable");
    expect(metric(empty.json(), "repeat_business").reason).toBe("no_explicit_primarySource_facts");

    const repeatOpp = await createOpportunity(app, token, orgId, "OPP-F2I7-RB1");
    const rfp = await createRfp(app, token, repeatOpp.id, "RFP-F2I7-RB1");
    const put = await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfp.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "existing_client_repeat", channel: "email" },
    });
    expect(put.statusCode).toBe(200);

    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const repeat = metric(res.json(), "repeat_business");
    expect(repeat.status).toBe("observed");
    expect(repeat.value).toBe(1);
  });

  it("Test 9 — profit per booking is unavailable without authoritative profit facts", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    await seedOrg(app, token, "F2 I7 Profit Ltd");
    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    const profit = metric(res.json(), "profit_per_booking");
    expect(profit.status).toBe("unavailable");
    expect(profit.reason).toContain("not_profit_per_booking");
  });

  it("Test 10 — dimensions keep PCO, market, SOURCE and CHANNEL distinct", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const organizationTypeId = types.json().items[0].id as string;
    const org = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "F2 I7 Dim Ltd", organizationTypeId },
    });
    const orgId = org.json().organization.id as string;
    const pcoSa = await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers: { authorization: `Bearer ${token}` },
      payload: { organizationId: orgId, accountName: "PCO SA" },
    });
    const pcoUk = await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers: { authorization: `Bearer ${token}` },
      payload: { organizationId: orgId, accountName: "PCO UK" },
    });
    const incentive = await app.inject({
      method: "POST",
      url: "/v1/crm/accounts",
      headers: { authorization: `Bearer ${token}` },
      payload: { organizationId: orgId, accountName: "Incentive SA" },
    });
    await app.inject({
      method: "PUT",
      url: `/v1/crm/accounts/${pcoSa.json().account.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { accountType: "pco", market: "south_africa" },
    });
    await app.inject({
      method: "PUT",
      url: `/v1/crm/accounts/${pcoUk.json().account.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { accountType: "pco", market: "united_kingdom" },
    });
    await app.inject({
      method: "PUT",
      url: `/v1/crm/accounts/${incentive.json().account.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { accountType: "incentive_house_agency", market: "south_africa" },
    });

    const oppSa = await createOpportunity(app, token, orgId, "OPP-F2I7-D1", { accountId: pcoSa.json().account.id });
    const oppUk = await createOpportunity(app, token, orgId, "OPP-F2I7-D2", { accountId: pcoUk.json().account.id });
    const oppInc = await createOpportunity(app, token, orgId, "OPP-F2I7-D3", {
      accountId: incentive.json().account.id,
    });
    const rfpSa = await createRfp(app, token, oppSa.id, "RFP-F2I7-D1");
    const rfpUk = await createRfp(app, token, oppUk.id, "RFP-F2I7-D2");
    await createRfp(app, token, oppInc.id, "RFP-F2I7-D3");
    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpSa.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "referral", channel: "email" },
    });
    await app.inject({
      method: "PUT",
      url: `/v1/rfps/${rfpUk.id}/commercial-facts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { primarySource: "linkedin", channel: "phone" },
    });

    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    const dims = res.json().dimensions;
    expect(dims.accountTypeIndependentOfMarket).toBe(true);
    expect(dims.sourceDistinctFromChannel).toBe(true);
    expect(dims.pcoDistinctFromEventAgency).toBe(true);
    expect(dims.byAccountType.find((row: { key: string }) => row.key === "pco").opportunityCount).toBe(2);
    expect(dims.byAccountType.find((row: { key: string }) => row.key === "pco").isPco).toBe(true);
    expect(dims.byMarket.find((row: { key: string }) => row.key === "south_africa").opportunityCount).toBe(2);
    expect(dims.bySource.find((row: { key: string }) => row.key === "referral").rfpCount).toBe(1);
    expect(dims.byChannel.find((row: { key: string }) => row.key === "email").rfpCount).toBe(1);
    expect(dims.bySource.some((row: { key: string }) => row.key === "email")).toBe(false);
  });

  it("Test 11 — every metric carries observed, derived, or unavailable status", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const res = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().metrics).toHaveLength(8);
    for (const row of res.json().metrics) {
      expect(["observed", "derived", "unavailable"]).toContain(row.status);
      expect(row.numericalTargetAuthorized).toBe(false);
      expect(row.calculationMethod).toBeTruthy();
      expect(row.population).toBeTruthy();
    }
    expect(res.json().ownerUnauditedBaselineSeeded).toBe(false);
  });

  it("Test 12 — KPI observation is preview-only and does not persist", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const orgId = await seedOrg(app, token, "F2 I7 Bound Ltd");
    const opp = await createOpportunity(app, token, orgId, "OPP-F2I7-B1");
    await createRfp(app, token, opp.id, "RFP-F2I7-B1");
    const preview = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(preview.statusCode).toBe(200);
    expect(preview.json().previewOnly).toBe(true);
    expect(preview.json().durable).toBe(false);
    expect(store.costSheets.length).toBe(0);

    store.dbPool = { options: { connectionString: "postgres://preview-kpi-boundary" } } as typeof store.dbPool;
    const durable = await app.inject({
      method: "GET",
      url: "/v1/commercial/kpis/preview",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(durable.statusCode).toBe(409);
    expect(durable.json().reason).toBe("f2_i7_in_memory_preview_only");
  });
});
