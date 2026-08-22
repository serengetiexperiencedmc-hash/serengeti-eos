import type { Classification } from "./types.js";

export type OpsSupplierConfirmationStatus = "requested" | "confirmed" | "declined";

export const OPS_SUPPLIER_CONFIRMATION_STATUSES = [
  "requested",
  "confirmed",
  "declined",
] as const satisfies readonly OpsSupplierConfirmationStatus[];

export function canTransitionSupplierConfirmation(
  from: OpsSupplierConfirmationStatus,
  to: OpsSupplierConfirmationStatus,
): { allowed: boolean; reason?: string } {
  if (from === to) return { allowed: false, reason: "already_in_status" };
  if (from === "confirmed" || from === "declined") {
    return { allowed: false, reason: "terminal_status" };
  }
  if (from === "requested" && (to === "confirmed" || to === "declined")) {
    return { allowed: true };
  }
  return { allowed: false, reason: "invalid_transition" };
}

export type OpsSupplierConfirmation = {
  id: string;
  tenantId: string;
  bookingId: string;
  programmeId: string;
  supplierId: string;
  programmeItemId?: string;
  label: string;
  status: OpsSupplierConfirmationStatus;
  supplierReference?: string;
  notes?: string;
  requestedAt: string;
  respondedAt?: string;
  respondedByPrincipalId?: string;
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export function supplierConfirmationsReadyForHandover(
  confirmations: Pick<OpsSupplierConfirmation, "status">[],
): boolean {
  return confirmations.length > 0;
}

export function allSupplierConfirmationsConfirmed(
  confirmations: Pick<OpsSupplierConfirmation, "status">[],
): boolean {
  return confirmations.length > 0 && confirmations.every((c) => c.status === "confirmed");
}
