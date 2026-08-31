import {
  authorize,
  computeAverageMargin,
  computeWinRate,
  type CommercialAnalyticsSummary,
  type CommercialMarginRollup,
  type CommercialPipelineStageRollup,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";

const STAGE_VALUES: Record<string, number> = {
  new_qualified: 50000,
  discovery: 85000,
  proposal_sent: 120000,
  negotiation: 200000,
  won: 0,
  lost: 0,
};

export function getCommercialAnalyticsSummary(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "analytics:read:commercial", action: "read:commercial_analytics" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const tenantId = principal.tenantId;
  const opportunities = store.oppOpportunities.filter((o) => o.tenantId === tenantId && !o.archivedAt);
  const won = opportunities.filter((o) => o.stage === "won").length;
  const activeRfps = store.rfpRfps.filter(
    (r) => r.tenantId === tenantId && !r.archivedAt && r.workflowStage !== "closed" && r.status !== "closed",
  ).length;

  const pipelineValue = opportunities
    .filter((o) => o.stage !== "won" && o.stage !== "lost")
    .reduce((sum, o) => sum + (o.estimatedValue ?? STAGE_VALUES[o.stage] ?? 75000), 0);

  const bookings = store.bkgBookings.filter((b) => b.tenantId === tenantId && !b.archivedAt);
  const margins = store.costSheets
    .filter((s) => s.tenantId === tenantId && !s.archivedAt && s.marginPercent != null)
    .map((s) => s.marginPercent as number);

  const outstandingInvoices = (store.finInvoices ?? []).filter(
    (i) => i.tenantId === tenantId && (i.status === "issued" || i.status === "partially_paid"),
  ).length;
  const reconciliationExceptions = (store.finReconciliations ?? []).filter(
    (r) => r.tenantId === tenantId && r.status === "exception",
  ).length;
  const fieldSyncConflicts = (store.opsSyncConflicts ?? []).filter(
    (c) => c.tenantId === tenantId && !c.resolution,
  ).length;

  const summary: CommercialAnalyticsSummary = {
    activeRfps,
    pipelineValue,
    wonOpportunities: won,
    totalOpportunities: opportunities.length,
    winRatePercent: computeWinRate(won, opportunities.length),
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    bookingsInHandover: bookings.filter((b) => b.status === "handover_pending" || b.status === "handed_over").length,
    averageMarginPercent: computeAverageMargin(margins),
    outstandingInvoices,
    reconciliationExceptions,
    fieldSyncConflicts,
    currency: "USD",
    asOf: new Date().toISOString(),
  };

  return { summary };
}

export function getCommercialPipelineRollup(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "analytics:read:commercial", action: "read:commercial_pipeline" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const tenantId = principal.tenantId;
  const byStage = new Map<string, { count: number; totalValue: number }>();
  for (const opp of store.oppOpportunities.filter((o) => o.tenantId === tenantId && !o.archivedAt)) {
    const cur = byStage.get(opp.stage) ?? { count: 0, totalValue: 0 };
    cur.count += 1;
    cur.totalValue += opp.estimatedValue ?? STAGE_VALUES[opp.stage] ?? 75000;
    byStage.set(opp.stage, cur);
  }

  const stages: CommercialPipelineStageRollup[] = [...byStage.entries()].map(([stage, data]) => ({
    stage,
    count: data.count,
    totalValue: data.totalValue,
  }));

  return { stages };
}

export function getCommercialMarginRollup(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "analytics:read:commercial", action: "read:commercial_margins" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const items: CommercialMarginRollup[] = store.costSheets
    .filter((s) => s.tenantId === principal.tenantId && !s.archivedAt)
    .map((s) => ({
      costSheetId: s.id,
      rfpId: s.rfpId,
      totalCost: s.totalCost,
      sellPrice: s.sellPrice ?? 0,
      marginPercent: s.marginPercent ?? 0,
      currency: s.currency,
    }));

  return { items };
}

export function getAnalyticsModuleHealth(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "analytics:read:commercial",
    action: "read:analytics_health",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const tenantId = principal.tenantId;
  return {
    module: "analytics",
    increment: "J3",
    status: "ok" as const,
    costSheets: store.costSheets.filter((s) => s.tenantId === tenantId && !s.archivedAt).length,
    opportunities: store.oppOpportunities.filter((o) => o.tenantId === tenantId && !o.archivedAt).length,
    bookings: store.bkgBookings.filter((b) => b.tenantId === tenantId && !b.archivedAt).length,
    opsVouchers: (store.opsVouchers ?? []).filter((v) => v.tenantId === tenantId).length,
  };
}
