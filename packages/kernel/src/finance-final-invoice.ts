import type { FinInvoice } from "./finance-invoice.js";

export type FinalInvoicePrerequisites = {
  depositPaid: boolean;
  progressPaid: boolean;
  finalExists: boolean;
};

export type FinalInvoiceEligibility = {
  eligible: boolean;
  reason?: string;
  remainingAmount?: number;
  prerequisites: FinalInvoicePrerequisites;
};

type InvoiceSlice = Pick<FinInvoice, "invoiceType" | "status" | "amount">;

export function assessFinalInvoiceEligibility(
  sellPrice: number,
  invoices: InvoiceSlice[],
): FinalInvoiceEligibility {
  const active = invoices.filter((i) => i.status !== "void");
  const deposit = active.find((i) => i.invoiceType === "deposit");
  const progress = active.find((i) => i.invoiceType === "progress");
  const finalExists = active.some((i) => i.invoiceType === "final");
  const depositPaid = deposit?.status === "paid";
  const progressPaid = progress?.status === "paid";

  const prerequisites: FinalInvoicePrerequisites = {
    depositPaid: !!depositPaid,
    progressPaid: !!progressPaid,
    finalExists,
  };

  if (finalExists) return { eligible: false, reason: "final_invoice_exists", prerequisites };
  if (!deposit) return { eligible: false, reason: "deposit_missing", prerequisites };
  if (!depositPaid) return { eligible: false, reason: "deposit_not_paid", prerequisites };
  if (!progress) return { eligible: false, reason: "progress_missing", prerequisites };
  if (!progressPaid) return { eligible: false, reason: "progress_not_paid", prerequisites };

  const invoiced = active.reduce((sum, i) => sum + i.amount, 0);
  const remaining = Math.round((sellPrice - invoiced) * 100) / 100;
  if (remaining <= 0) return { eligible: false, reason: "nothing_to_invoice", prerequisites };

  return { eligible: true, remainingAmount: remaining, prerequisites };
}
