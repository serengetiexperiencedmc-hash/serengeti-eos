export type CommercialPipelineStageRollup = {
  stage: string;
  count: number;
  totalValue: number;
};

export type CommercialMarginRollup = {
  costSheetId: string;
  rfpId: string;
  totalCost: number;
  sellPrice: number;
  marginPercent: number;
  currency: string;
};

export type CommercialAnalyticsSummary = {
  activeRfps: number;
  pipelineValue: number;
  wonOpportunities: number;
  totalOpportunities: number;
  winRatePercent: number;
  confirmedBookings: number;
  bookingsInHandover: number;
  averageMarginPercent: number;
  outstandingInvoices: number;
  reconciliationExceptions: number;
  fieldSyncConflicts: number;
  currency: string;
  asOf: string;
};

export function computeWinRate(won: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((won / total) * 1000) / 10;
}

export function computeAverageMargin(margins: number[]): number {
  if (margins.length === 0) return 0;
  const sum = margins.reduce((a, b) => a + b, 0);
  return Math.round((sum / margins.length) * 10) / 10;
}

export type OpsAnalyticsSummary = {
  activeBookings: number;
  bookingsInHandover: number;
  handoverTasksPending: number;
  handoverTasksComplete: number;
  supplierConfirmationsPending: number;
  supplierConfirmationsConfirmed: number;
  manifestsDraft: number;
  manifestsPublished: number;
  manifestGuestCount: number;
  vouchersDraft: number;
  vouchersIssued: number;
  fieldTasksOpen: number;
  fieldTasksComplete: number;
  opsBriefsIssued: number;
  syncConflicts: number;
  asOf: string;
};

export type OpsBookingReadinessRollup = {
  bookingId: string;
  bookingCode: string;
  title: string;
  status: string;
  handoverProgressPercent: number;
  pendingHandoverTasks: number;
  supplierConfirmationsPending: number;
  manifestStatus?: string;
  vouchersDraft: number;
  fieldTasksOpen: number;
  syncConflicts: number;
};

export type OpsWorkbenchItem = OpsBookingReadinessRollup & {
  organizationId: string;
  attentionRequired: boolean;
  paxCount?: number;
  travelDates?: string;
};

export function computeHandoverProgress(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 1000) / 10;
}

export function requiresOpsAttention(item: {
  pendingHandoverTasks: number;
  supplierConfirmationsPending: number;
  vouchersDraft: number;
  fieldTasksOpen: number;
  syncConflicts: number;
}): boolean {
  return (
    item.pendingHandoverTasks > 0 ||
    item.supplierConfirmationsPending > 0 ||
    item.vouchersDraft > 0 ||
    item.fieldTasksOpen > 0 ||
    item.syncConflicts > 0
  );
}
