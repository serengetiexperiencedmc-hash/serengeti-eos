import { eosFetch } from "./eos-client";

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

export type PipelineStageRollup = {
  stage: string;
  count: number;
  totalValue: number;
};

export type MarginRollup = {
  costSheetId: string;
  rfpId: string;
  totalCost: number;
  sellPrice: number;
  marginPercent: number;
  currency: string;
};

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export async function getCommercialSummary(token: string) {
  return eosFetch<{ summary: CommercialAnalyticsSummary }>("/v1/analytics/commercial/summary", { token });
}

export async function getPipelineRollup(token: string) {
  return eosFetch<{ stages: PipelineStageRollup[] }>("/v1/analytics/commercial/pipeline", { token });
}

export async function getMarginRollup(token: string) {
  return eosFetch<{ items: MarginRollup[] }>("/v1/analytics/commercial/margins", { token });
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

export async function getOperationsSummary(token: string) {
  return eosFetch<{ summary: OpsAnalyticsSummary }>("/v1/analytics/operations/summary", { token });
}

export async function getOperationsBookingReadiness(token: string) {
  return eosFetch<{ items: OpsBookingReadinessRollup[] }>("/v1/analytics/operations/bookings", { token });
}
