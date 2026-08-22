import type { Classification } from "./types.js";

export type FinInvoiceType = "deposit" | "progress" | "final";
export type FinInvoiceStatus = "draft" | "issued" | "partially_paid" | "paid" | "void";

export const FIN_INVOICE_STATUSES = [
  "draft",
  "issued",
  "partially_paid",
  "paid",
  "void",
] as const satisfies readonly FinInvoiceStatus[];

export function buildInvoiceCode(bookingCode: string, type: FinInvoiceType): string {
  const suffix = type === "deposit" ? "DEP" : type === "progress" ? "PRG" : "FIN";
  return bookingCode.replace(/^BKG-/i, `INV-${suffix}-`);
}

export function canIssueInvoice(status: FinInvoiceStatus): { allowed: boolean; reason?: string } {
  if (status !== "draft") return { allowed: false, reason: "not_draft" };
  return { allowed: true };
}

export type FinInvoice = {
  id: string;
  tenantId: string;
  invoiceCode: string;
  bookingId: string;
  organizationId: string;
  invoiceType: FinInvoiceType;
  status: FinInvoiceStatus;
  currency: string;
  amount: number;
  amountPaid: number;
  dueDate?: string;
  issuedAt?: string;
  issuedByPrincipalId?: string;
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
