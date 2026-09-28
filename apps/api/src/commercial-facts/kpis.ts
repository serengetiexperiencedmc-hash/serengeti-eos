import {
  authorize,
  COMMERCIAL_ACCOUNT_TYPE_LABELS,
  COMMERCIAL_CHANNEL_LABELS,
  COMMERCIAL_MARKET_LABELS,
  COMMERCIAL_SOURCE_LABELS,
  type CommercialAccountType,
  type CommercialChannel,
  type CommercialMarket,
  type CommercialSource,
  type Principal,
} from "@sedmc/kernel";
import { isDurableSoR } from "../persistence/durable.js";
import type { Store } from "../store.js";
import { f2FactsMemory } from "./memory.js";

const IN_MEMORY_ONLY = { error: "conflict" as const, reason: "f2_i7_in_memory_preview_only" };

export type KpiStatus = "observed" | "derived" | "unavailable";

export type KpiMetric = {
  key: string;
  name: string;
  status: KpiStatus;
  unit: string;
  observationPeriod: { kind: string; from?: string; to?: string };
  population: string;
  calculationMethod: string;
  sourceFacts: string[];
  dataSufficiency: string;
  numericalTargetAuthorized: false;
  value?: number;
  formula?: string;
  numerator?: number;
  denominator?: number;
  reason?: string;
  legacyApprovalThresholdApplied?: false;
};

function dateKey(iso: string): string {
  return iso.slice(0, 10);
}

function inWindow(iso: string, from?: string, to?: string): boolean {
  const key = dateKey(iso);
  if (from && key < dateKey(from)) return false;
  if (to && key > dateKey(to)) return false;
  return true;
}

function metric(partial: Omit<KpiMetric, "numericalTargetAuthorized">): KpiMetric {
  return { ...partial, numericalTargetAuthorized: false };
}

function bump<K extends string>(map: Map<K, number>, key: K) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

export async function getCommercialKpiPreview(
  store: Store,
  principal: Principal,
  query?: { from?: string; to?: string },
) {
  if (isDurableSoR(store)) return IN_MEMORY_ONLY;
  const decision = authorize({
    principal,
    permission: "analytics:read:commercial",
    action: "read:commercial_kpi_preview",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const from = query?.from?.trim() || undefined;
  const to = query?.to?.trim() || undefined;
  if (from && to && dateKey(from) > dateKey(to)) {
    return { error: "invalid_request" as const, reason: "invalid_observation_window" };
  }

  const period = {
    kind: from || to ? "explicit_window" : "unbounded_preview_set",
    ...(from ? { from: dateKey(from) } : {}),
    ...(to ? { to: dateKey(to) } : {}),
  };
  const tenantId = principal.tenantId;
  const mem = f2FactsMemory(store);

  const opportunities = store.oppOpportunities.filter(
    (o) => o.tenantId === tenantId && !o.archivedAt && inWindow(o.createdAt, from, to),
  );
  const rfps = store.rfpRfps.filter((r) => r.tenantId === tenantId && !r.archivedAt && inWindow(r.createdAt, from, to));
  const opportunityIds = new Set(opportunities.map((o) => o.id));
  const bookings = store.bkgBookings.filter(
    (b) => b.tenantId === tenantId && !b.archivedAt && opportunityIds.has(b.opportunityId),
  );

  const qualified = opportunities.filter((o) => mem.opportunities.get(o.id)?.qualificationStatus === "qualified");
  const qualifiedIds = new Set(qualified.map((o) => o.id));
  const confirmedBookings = bookings.filter((b) => b.status !== "cancelled" && qualifiedIds.has(b.opportunityId));
  const lost = opportunities.filter(
    (o) => o.stage === "lost" || Boolean(mem.opportunities.get(o.id)?.closedLost),
  );
  const valued = opportunities.filter((o) => typeof o.estimatedValue === "number");
  const pipelineSum = valued.reduce((sum, o) => sum + (o.estimatedValue as number), 0);

  const rfpFactsWithSource = rfps.filter((r) => mem.rfps.get(r.id)?.primarySource);
  const repeatCount = rfpFactsWithSource.filter(
    (r) => mem.rfps.get(r.id)?.primarySource === "existing_client_repeat",
  ).length;

  const rfpVolume = metric({
    key: "rfp_volume",
    name: "RFP volume",
    status: "observed",
    value: rfps.length,
    unit: "count",
    observationPeriod: period,
    population: "preview_tenant_rfps",
    calculationMethod: "count of non-archived RFP records in the observation set",
    sourceFacts: ["rfpRfps.id"],
    dataSufficiency: "sufficient",
  });

  const qualifiedOpportunities = metric({
    key: "qualified_opportunities",
    name: "Qualified opportunities",
    status: "observed",
    value: qualified.length,
    unit: "count",
    observationPeriod: period,
    population: "preview_tenant_opportunities",
    calculationMethod: "count where commercial-facts qualificationStatus is qualified; workflow stage new_qualified is not qualification",
    sourceFacts: ["f2OpportunityFacts.qualificationStatus"],
    dataSufficiency: "sufficient",
  });

  const conversion =
    qualified.length > 0 && bookings.length > 0
      ? metric({
          key: "conversion_rate",
          name: "Conversion rate",
          status: "derived",
          value: Math.round((confirmedBookings.length / qualified.length) * 10000) / 10000,
          unit: "ratio",
          formula: "non_cancelled_bookings_linked_to_qualified_opportunities / qualified_opportunities",
          numerator: confirmedBookings.length,
          denominator: qualified.length,
          observationPeriod: period,
          population: "preview_tenant_qualified_opportunities_with_booking_outcomes",
          calculationMethod: "confirmed/handover/handed_over/non-cancelled bookings whose opportunityId is in the qualified set, divided by qualified opportunity count",
          sourceFacts: ["bkgBookings.status", "bkgBookings.opportunityId", "f2OpportunityFacts.qualificationStatus"],
          dataSufficiency: "sufficient",
        })
      : metric({
          key: "conversion_rate",
          name: "Conversion rate",
          status: "unavailable",
          unit: "ratio",
          formula: "non_cancelled_bookings_linked_to_qualified_opportunities / qualified_opportunities",
          observationPeriod: period,
          population: "preview_tenant_qualified_opportunities_with_booking_outcomes",
          calculationMethod: "not calculated",
          sourceFacts: ["bkgBookings.status", "f2OpportunityFacts.qualificationStatus"],
          dataSufficiency: "insufficient",
          reason:
            qualified.length === 0
              ? "no_qualified_opportunities_in_population"
              : "no_booking_outcome_facts_in_population",
        });

  const revenue = metric({
    key: "revenue",
    name: "Revenue",
    status: "unavailable",
    unit: "currency",
    observationPeriod: period,
    population: "preview_tenant",
    calculationMethod: "not calculated",
    sourceFacts: [],
    dataSufficiency: "insufficient",
    reason: "no_authoritative_revenue_fact_costing_proposal_and_booking_sellPrice_are_not_revenue",
  });

  const responseIntervals = rfps.map((r) => {
    const facts = mem.rfps.get(r.id);
    if (!facts?.receivedAt || !facts.firstResponseAt) {
      return { rfpId: r.id, kind: "missing" as const };
    }
    const durationMs = Date.parse(facts.firstResponseAt) - Date.parse(facts.receivedAt);
    if (!Number.isFinite(durationMs) || durationMs < 0) {
      return { rfpId: r.id, kind: "negative" as const };
    }
    return { rfpId: r.id, kind: "valid" as const, durationMs };
  });
  const validIntervals = responseIntervals.filter(
    (row): row is { rfpId: string; kind: "valid"; durationMs: number } => row.kind === "valid",
  );
  const negativeCount = responseIntervals.filter((row) => row.kind === "negative").length;
  const missingCount = responseIntervals.filter((row) => row.kind === "missing").length;
  const completePopulation = rfps.length > 0 && validIntervals.length === rfps.length;
  const responseTime = completePopulation
    ? metric({
        key: "response_time",
        name: "Response time",
        status: "derived",
        value: Math.round(validIntervals.reduce((sum, row) => sum + row.durationMs, 0) / validIntervals.length),
        unit: "milliseconds",
        formula: "mean(firstResponseAt - receivedAt) from explicit sidecar observations",
        observationPeriod: period,
        population: "preview_tenant_rfps",
        calculationMethod:
          "derived only when every RFP in the preview set has explicit sidecar receivedAt and firstResponseAt and a non-negative interval; incomplete RFPs are not dropped from the population; createdAt is not receivedAt; proposal.sentAt is not firstResponseAt",
        sourceFacts: ["f2RfpFacts.receivedAt", "f2RfpFacts.firstResponseAt"],
        dataSufficiency: "sufficient",
      })
    : metric({
        key: "response_time",
        name: "Response time",
        status: "unavailable",
        unit: "duration",
        observationPeriod: period,
        population: "preview_tenant_rfps",
        calculationMethod:
          "not calculated unless every RFP in the preview set has explicit receivedAt and firstResponseAt; incomplete RFPs are retained in the population; createdAt is not receivedAt; proposal.sentAt is not firstResponseAt",
        sourceFacts: ["f2RfpFacts.receivedAt", "f2RfpFacts.firstResponseAt"],
        dataSufficiency: missingCount === rfps.length ? "insufficient" : "partial",
        reason:
          negativeCount > 0 && missingCount === 0
            ? "negative_response_interval"
            : "insufficient_timestamps_no_complete_received_to_response_chain",
      });

  const pipelineValue =
    valued.length > 0
      ? metric({
          key: "pipeline_value",
          name: "Pipeline value",
          status: "derived",
          value: pipelineSum,
          unit: "explicit_estimatedValue",
          formula: "sum(opportunity.estimatedValue) where estimatedValue is explicitly set",
          observationPeriod: period,
          population: "preview_tenant_opportunities_with_explicit_estimatedValue",
          calculationMethod: "sum of explicit estimatedValue only; missing values are not invented; no 250000 or 20 percent filter",
          sourceFacts: ["oppOpportunities.estimatedValue"],
          dataSufficiency: valued.length === opportunities.length ? "sufficient" : "partial",
          legacyApprovalThresholdApplied: false,
        })
      : metric({
          key: "pipeline_value",
          name: "Pipeline value",
          status: "unavailable",
          unit: "explicit_estimatedValue",
          observationPeriod: period,
          population: "preview_tenant_opportunities_with_explicit_estimatedValue",
          calculationMethod: "not calculated",
          sourceFacts: ["oppOpportunities.estimatedValue"],
          dataSufficiency: "insufficient",
          reason: "no_explicit_estimatedValue_on_opportunities",
          legacyApprovalThresholdApplied: false,
        });

  const repeatBusiness =
    rfpFactsWithSource.length > 0
      ? metric({
          key: "repeat_business",
          name: "Repeat business",
          status: "observed",
          value: repeatCount,
          unit: "count",
          observationPeriod: period,
          population: "preview_tenant_rfps_with_explicit_primarySource",
          calculationMethod: "count of RFP commercial facts whose primarySource is existing_client_repeat; not inferred from names",
          sourceFacts: ["f2RfpFacts.primarySource"],
          dataSufficiency: "sufficient",
        })
      : metric({
          key: "repeat_business",
          name: "Repeat business",
          status: "unavailable",
          unit: "count",
          observationPeriod: period,
          population: "preview_tenant_rfps_with_explicit_primarySource",
          calculationMethod: "not calculated",
          sourceFacts: ["f2RfpFacts.primarySource"],
          dataSufficiency: "insufficient",
          reason: "no_explicit_primarySource_facts",
        });

  const profitPerBooking = metric({
    key: "profit_per_booking",
    name: "Profit per booking",
    status: "unavailable",
    unit: "currency",
    observationPeriod: period,
    population: "preview_tenant_bookings",
    calculationMethod: "not calculated",
    sourceFacts: [],
    dataSufficiency: "insufficient",
    reason: "no_authoritative_revenue_and_profit_facts_costing_margin_is_not_profit_per_booking",
  });

  const byMarket = new Map<CommercialMarket, number>();
  const byAccountType = new Map<CommercialAccountType, number>();
  const bySource = new Map<CommercialSource, number>();
  const byChannel = new Map<CommercialChannel, number>();
  for (const opp of opportunities) {
    const account = opp.accountId
      ? store.crmAccounts.find((a) => a.id === opp.accountId && a.tenantId === tenantId)
      : undefined;
    const accountFacts = account ? mem.accounts.get(account.id) : undefined;
    if (accountFacts?.market) bump(byMarket, accountFacts.market);
    if (accountFacts?.accountType) bump(byAccountType, accountFacts.accountType);
  }
  for (const rfp of rfps) {
    const facts = mem.rfps.get(rfp.id);
    if (facts?.primarySource) bump(bySource, facts.primarySource);
    if (facts?.channel) bump(byChannel, facts.channel);
  }

  return {
    previewOnly: true as const,
    durable: false as const,
    f2Increment: "I7",
    observationPeriod: period,
    population: "preview_tenant_in_memory",
    numericalTargetsAuthorized: false as const,
    ownerUnauditedBaselineSeeded: false as const,
    legacySellThresholdApplied: false as const,
    mixedJ3AnalyticsAuthoritativeForF2: false as const,
    metrics: [
      rfpVolume,
      qualifiedOpportunities,
      conversion,
      revenue,
      responseTime,
      pipelineValue,
      repeatBusiness,
      profitPerBooking,
    ],
    outcomes: {
      open: opportunities.filter((o) => o.stage !== "lost" && o.stage !== "won").length,
      qualified: qualified.length,
      proposal: store.propProposals.filter((p) => p.tenantId === tenantId && !p.archivedAt && rfps.some((r) => r.id === p.rfpId))
        .length,
      booked: bookings.filter((b) => b.status !== "cancelled").length,
      lost: lost.length,
      workflowStageIsNotQualification: true as const,
    },
    dimensions: {
      accountTypeIndependentOfMarket: true as const,
      sourceDistinctFromChannel: true as const,
      pcoDistinctFromEventAgency: true as const,
      byMarket: [...byMarket.entries()].map(([key, count]) => ({
        key,
        label: COMMERCIAL_MARKET_LABELS[key],
        opportunityCount: count,
      })),
      byAccountType: [...byAccountType.entries()].map(([key, count]) => ({
        key,
        label: COMMERCIAL_ACCOUNT_TYPE_LABELS[key],
        opportunityCount: count,
        isPco: key === "pco",
      })),
      bySource: [...bySource.entries()].map(([key, count]) => ({
        key,
        label: COMMERCIAL_SOURCE_LABELS[key],
        rfpCount: count,
      })),
      byChannel: [...byChannel.entries()].map(([key, count]) => ({
        key,
        label: COMMERCIAL_CHANNEL_LABELS[key],
        rfpCount: count,
      })),
    },
  };
}
