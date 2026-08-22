import { eosFetch } from "./eos-client";

export type FinQuote = {
  id: string;
  quoteCode: string;
  bookingId: string;
  status: string;
  currency: string;
  amount: number;
  validUntil: string;
  sentAt?: string;
  acceptedAt?: string;
};

export type FinInvoice = {
  id: string;
  invoiceCode: string;
  bookingId: string;
  invoiceType: string;
  status: string;
  amount: number;
  amountPaid: number;
  currency: string;
  dueDate?: string;
  issuedAt?: string;
};

export type FinReconciliation = {
  id: string;
  bookingId: string;
  invoiceId: string;
  status: string;
  expectedAmount: number;
  receivedAmount: number;
  variance: number;
  currency: string;
};

export async function listQuotes(token: string, bookingId?: string) {
  const qs = bookingId ? `?bookingId=${bookingId}` : "";
  return eosFetch<{ items: FinQuote[] }>(`/v1/finance/quotes${qs}`, { token });
}

export async function createQuote(token: string, bookingId: string) {
  return eosFetch<{ quote: FinQuote }>("/v1/finance/quotes", {
    token,
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export async function sendQuote(token: string, quoteId: string) {
  return eosFetch<{ quote: FinQuote }>(`/v1/finance/quotes/${quoteId}/send`, { token, method: "POST", body: "{}" });
}

export async function listInvoices(token: string, bookingId?: string) {
  const qs = bookingId ? `?bookingId=${bookingId}` : "";
  return eosFetch<{ items: FinInvoice[] }>(`/v1/finance/invoices${qs}`, { token });
}

export async function createDepositInvoice(token: string, bookingId: string) {
  return eosFetch<{ invoice: FinInvoice }>("/v1/finance/invoices/deposit", {
    token,
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export async function createProgressInvoice(token: string, bookingId: string) {
  return eosFetch<{ invoice: FinInvoice }>("/v1/finance/invoices/progress", {
    token,
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export async function createFinalInvoice(token: string, bookingId: string) {
  return eosFetch<{ invoice: FinInvoice }>("/v1/finance/invoices/final", {
    token,
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export async function autoCreateFinalInvoice(token: string, bookingId: string) {
  return eosFetch<{ invoice: FinInvoice }>("/v1/finance/invoices/final/auto", {
    token,
    method: "POST",
    body: JSON.stringify({ bookingId }),
  });
}

export type FinalInvoiceEligibility = {
  bookingId: string;
  eligible: boolean;
  reason?: string;
  remainingAmount?: number;
  prerequisites: { depositPaid: boolean; progressPaid: boolean; finalExists: boolean };
};

export async function getFinalInvoiceEligibility(token: string, bookingId: string) {
  return eosFetch<FinalInvoiceEligibility>(`/v1/finance/bookings/${bookingId}/final-invoice-eligibility`, { token });
}

export type PaymentRequestItem = {
  approvalId: string;
  paymentId: string;
  invoiceId: string;
  invoiceCode: string;
  invoiceType: string;
  bookingId: string;
  amount: number;
  currency: string;
  beneficiary: string;
  status: string;
  approvalStatus: string;
};

export async function listPaymentRequests(token: string) {
  return eosFetch<{ items: PaymentRequestItem[] }>("/v1/finance/payment-requests", { token });
}

export async function issueInvoice(token: string, invoiceId: string) {
  return eosFetch<{ invoice: FinInvoice; reconciliation: FinReconciliation }>(
    `/v1/finance/invoices/${invoiceId}/issue`,
    { token, method: "POST", body: "{}" },
  );
}

export async function listReconciliations(token: string, bookingId?: string) {
  const qs = bookingId ? `?bookingId=${bookingId}` : "";
  return eosFetch<{ items: FinReconciliation[] }>(`/v1/finance/reconciliations${qs}`, { token });
}

export async function resolveReconciliation(token: string, reconciliationId: string, notes: string) {
  return eosFetch<{ reconciliation: FinReconciliation }>(`/v1/finance/reconciliations/${reconciliationId}/resolve`, {
    token,
    method: "POST",
    body: JSON.stringify({ notes }),
  });
}

export async function requestInvoicePayment(token: string, invoiceId: string, amount: number, beneficiary: string) {
  return eosFetch<{ payment: { id: string; status: string }; approvalId: string; message: string }>(
    `/v1/finance/invoices/${invoiceId}/payment-requests`,
    { token, method: "POST", body: JSON.stringify({ amount, beneficiary }) },
  );
}

export async function approveFinancePayment(token: string, approvalId: string) {
  return eosFetch<{ payment: { id: string; status: string } }>(`/v1/finance/payments/${approvalId}/approve`, {
    token,
    method: "POST",
    body: "{}",
  });
}

export async function applyApprovedPayment(token: string, invoiceId: string) {
  return eosFetch<{ invoice: FinInvoice; reconciliation?: FinReconciliation }>(
    `/v1/finance/invoices/${invoiceId}/apply-payment`,
    { token, method: "POST", body: "{}" },
  );
}
