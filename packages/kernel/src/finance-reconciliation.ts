import type { Classification } from "./types.js";

export type FinReconciliationStatus = "open" | "matched" | "exception";

export function computeReconciliationVariance(expected: number, received: number): number {
  return Math.round((expected - received) * 100) / 100;
}

export function deriveReconciliationStatus(
  expected: number,
  received: number,
  tolerance = 0.01,
): FinReconciliationStatus {
  const variance = Math.abs(computeReconciliationVariance(expected, received));
  if (variance <= tolerance) return "matched";
  if (received > 0) return "exception";
  return "open";
}

export type FinReconciliation = {
  id: string;
  tenantId: string;
  bookingId: string;
  invoiceId: string;
  status: FinReconciliationStatus;
  expectedAmount: number;
  receivedAmount: number;
  variance: number;
  currency: string;
  matchedPaymentIds: string[];
  resolvedAt?: string;
  resolvedByPrincipalId?: string;
  resolutionNotes?: string;
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
