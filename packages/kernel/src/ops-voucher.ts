import type { Classification } from "./types.js";

export type OpsVoucherType = "guest_meal" | "guest_activity" | "transfer";
export type OpsVoucherStatus = "draft" | "issued" | "void";

export const OPS_VOUCHER_STATUSES = ["draft", "issued", "void"] as const satisfies readonly OpsVoucherStatus[];

export function buildVoucherCode(bookingCode: string, sequence: number): string {
  const base = bookingCode.replace(/^BKG-/i, "VCH-");
  return `${base}-${String(sequence).padStart(3, "0")}`;
}

export function canIssueVoucher(status: OpsVoucherStatus): { allowed: boolean; reason?: string } {
  if (status !== "draft") return { allowed: false, reason: "not_draft" };
  return { allowed: true };
}

export type OpsVoucher = {
  id: string;
  tenantId: string;
  bookingId: string;
  manifestEntryId: string;
  voucherCode: string;
  voucherType: OpsVoucherType;
  guestName: string;
  supplierLabel?: string;
  status: OpsVoucherStatus;
  issuedAt?: string;
  issuedByPrincipalId?: string;
  notes?: string;
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
