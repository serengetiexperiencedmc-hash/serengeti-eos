import {
  assessFinalInvoiceEligibility,
  authorize,
  buildInvoiceCode,
  buildQuoteCode,
  canAcceptQuote,
  canIssueInvoice,
  computeReconciliationVariance,
  deriveReconciliationStatus,
  isQuoteExpired,
  newId,
  type FinInvoice,
  type FinQuote,
  type FinReconciliation,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { createPayment, decideApproval } from "../app.js";
import { autoCompleteHandoverTaskByKey } from "../ops/handover-sync.js";
import { ensureFinanceCollections } from "./collections.js";

function sanitizeInvoice(inv: FinInvoice) {
  return {
    id: inv.id,
    invoiceCode: inv.invoiceCode,
    bookingId: inv.bookingId,
    organizationId: inv.organizationId,
    invoiceType: inv.invoiceType,
    status: inv.status,
    currency: inv.currency,
    amount: inv.amount,
    amountPaid: inv.amountPaid,
    dueDate: inv.dueDate,
    issuedAt: inv.issuedAt,
  };
}

function sanitizeReconciliation(rec: FinReconciliation) {
  return {
    id: rec.id,
    bookingId: rec.bookingId,
    invoiceId: rec.invoiceId,
    status: rec.status,
    expectedAmount: rec.expectedAmount,
    receivedAmount: rec.receivedAmount,
    variance: rec.variance,
    currency: rec.currency,
    matchedPaymentIds: rec.matchedPaymentIds,
    resolvedAt: rec.resolvedAt,
  };
}

function sanitizeQuote(quote: FinQuote) {
  return {
    id: quote.id,
    quoteCode: quote.quoteCode,
    bookingId: quote.bookingId,
    organizationId: quote.organizationId,
    status: quote.status,
    currency: quote.currency,
    amount: quote.amount,
    validUntil: quote.validUntil,
    sentAt: quote.sentAt,
    acceptedAt: quote.acceptedAt,
  };
}

function invoicedTotal(store: Store, bookingId: string, excludeVoid = true) {
  return store.finInvoices
    .filter((i) => i.bookingId === bookingId && (!excludeVoid || i.status !== "void"))
    .reduce((sum, i) => sum + i.amount, 0);
}

function createTypedInvoice(
  store: Store,
  principal: Principal,
  booking: NonNullable<ReturnType<typeof findBooking>>,
  invoiceType: FinInvoice["invoiceType"],
  amount: number,
) {
  const now = new Date().toISOString();
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const invoice: FinInvoice = {
    id: newId(),
    tenantId: principal.tenantId,
    invoiceCode: buildInvoiceCode(booking.bookingCode, invoiceType),
    bookingId: booking.id,
    organizationId: booking.organizationId,
    invoiceType,
    status: "draft",
    currency: booking.currency,
    amount,
    amountPaid: 0,
    dueDate: due,
    classification: booking.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.finInvoices.push(invoice);
  return invoice;
}

function findBooking(store: Store, tenantId: string, bookingId: string) {
  return store.bkgBookings.find((b) => b.id === bookingId && b.tenantId === tenantId && !b.archivedAt);
}

export function getFinanceModuleHealth(store: Store, principal: Principal) {
  ensureFinanceCollections(store);
  const decision = authorize({
    principal,
    permission: "finance:read:invoice",
    action: "read:fin_health",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const tenantId = principal.tenantId;
  const pendingPayments = store.finPaymentLinks.filter((link) => {
    const payment = store.payments.get(link.paymentId);
    return payment?.status === "pending_approval" && payment.tenantId === tenantId;
  }).length;
  return {
    module: "finance",
    increment: "I8.4",
    status: "ok" as const,
    invoices: store.finInvoices.filter((i) => i.tenantId === tenantId).length,
    quotes: store.finQuotes.filter((q) => q.tenantId === tenantId).length,
    reconciliations: store.finReconciliations.filter((r) => r.tenantId === tenantId).length,
    exceptions: store.finReconciliations.filter((r) => r.tenantId === tenantId && r.status === "exception").length,
    pendingPaymentRequests: pendingPayments,
    bookings: store.bkgBookings.filter((b) => b.tenantId === tenantId && !b.archivedAt && b.status !== "cancelled").length,
  };
}

export function listInvoices(store: Store, principal: Principal, query?: { bookingId?: string; status?: string }) {
  ensureFinanceCollections(store);
  const decision = authorize({ principal, permission: "finance:read:invoice", action: "read:fin_invoice" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.finInvoices.filter((i) => i.tenantId === principal.tenantId);
  if (query?.bookingId) items = items.filter((i) => i.bookingId === query.bookingId);
  if (query?.status) items = items.filter((i) => i.status === query.status);
  return { items: items.map(sanitizeInvoice) };
}

export type CreateDepositInvoiceInput = {
  bookingId: string;
  depositPercent?: number;
};

export function createDepositInvoice(
  store: Store,
  principal: Principal,
  input: CreateDepositInvoiceInput,
  correlationId: string,
) {
  ensureFinanceCollections(store);
  const decision = authorize({ principal, permission: "finance:write:invoice", action: "create:fin_invoice" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const booking = findBooking(store, principal.tenantId, input.bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const existing = store.finInvoices.find(
    (i) => i.bookingId === input.bookingId && i.invoiceType === "deposit" && i.status !== "void",
  );
  if (existing) return { error: "conflict" as const, reason: "deposit_invoice_exists", invoice: sanitizeInvoice(existing) };

  const pct = input.depositPercent ?? 30;
  const amount = Math.round(booking.sellPrice * (pct / 100) * 100) / 100;
  const now = new Date().toISOString();
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const invoice: FinInvoice = {
    id: newId(),
    tenantId: principal.tenantId,
    invoiceCode: buildInvoiceCode(booking.bookingCode, "deposit"),
    bookingId: booking.id,
    organizationId: booking.organizationId,
    invoiceType: "deposit",
    status: "draft",
    currency: booking.currency,
    amount,
    amountPaid: 0,
    dueDate: due,
    classification: booking.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.finInvoices.push(invoice);
  void correlationId;
  return { invoice: sanitizeInvoice(invoice) };
}

export function issueInvoice(store: Store, principal: Principal, invoiceId: string, correlationId: string) {
  ensureFinanceCollections(store);
  const invoice = store.finInvoices.find((i) => i.id === invoiceId && i.tenantId === principal.tenantId);
  if (!invoice) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "finance:write:invoice", action: "issue:fin_invoice" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const gate = canIssueInvoice(invoice.status);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  const now = new Date().toISOString();
  invoice.status = "issued";
  invoice.issuedAt = now;
  invoice.issuedByPrincipalId = principal.id;
  invoice.updatedAt = now;
  invoice.version += 1;
  invoice.updatedByPrincipalId = principal.id;

  if (invoice.invoiceType === "deposit") {
    autoCompleteHandoverTaskByKey(store, principal.tenantId, invoice.bookingId, "deposit_invoice", principal.id);
  }

  const reconciliation: FinReconciliation = {
    id: newId(),
    tenantId: principal.tenantId,
    bookingId: invoice.bookingId,
    invoiceId: invoice.id,
    status: "open",
    expectedAmount: invoice.amount,
    receivedAmount: 0,
    variance: invoice.amount,
    currency: invoice.currency,
    matchedPaymentIds: [],
    classification: invoice.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.finReconciliations.push(reconciliation);
  void correlationId;
  return { invoice: sanitizeInvoice(invoice), reconciliation: sanitizeReconciliation(reconciliation) };
}

export function listReconciliations(store: Store, principal: Principal, query?: { status?: string; bookingId?: string }) {
  ensureFinanceCollections(store);
  const decision = authorize({ principal, permission: "finance:read:reconciliation", action: "read:fin_reconciliation" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.finReconciliations.filter((r) => r.tenantId === principal.tenantId);
  if (query?.status) items = items.filter((r) => r.status === query.status);
  if (query?.bookingId) items = items.filter((r) => r.bookingId === query.bookingId);
  return { items: items.map(sanitizeReconciliation) };
}

export function recordInvoicePayment(
  store: Store,
  principal: Principal,
  invoiceId: string,
  input: { amount: number; paymentId: string },
  correlationId: string,
) {
  ensureFinanceCollections(store);
  const invoice = store.finInvoices.find((i) => i.id === invoiceId && i.tenantId === principal.tenantId);
  if (!invoice) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "finance:reconcile:booking", action: "reconcile:fin_invoice" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const now = new Date().toISOString();
  invoice.amountPaid = Math.round((invoice.amountPaid + input.amount) * 100) / 100;
  invoice.updatedAt = now;
  invoice.version += 1;
  if (invoice.amountPaid >= invoice.amount) invoice.status = "paid";
  else if (invoice.amountPaid > 0) invoice.status = "partially_paid";

  const rec = store.finReconciliations.find((r) => r.invoiceId === invoiceId);
  if (rec) {
    rec.receivedAmount = invoice.amountPaid;
    rec.variance = computeReconciliationVariance(rec.expectedAmount, rec.receivedAmount);
    rec.status = deriveReconciliationStatus(rec.expectedAmount, rec.receivedAmount);
    if (!rec.matchedPaymentIds.includes(input.paymentId)) rec.matchedPaymentIds.push(input.paymentId);
    rec.updatedAt = now;
    rec.version += 1;
  }

  void correlationId;
  return {
    invoice: sanitizeInvoice(invoice),
    reconciliation: rec ? sanitizeReconciliation(rec) : undefined,
  };
}

export function resolveReconciliation(
  store: Store,
  principal: Principal,
  reconciliationId: string,
  notes: string,
  correlationId: string,
) {
  ensureFinanceCollections(store);
  const rec = store.finReconciliations.find((r) => r.id === reconciliationId && r.tenantId === principal.tenantId);
  if (!rec) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "finance:reconcile:booking", action: "resolve:fin_reconciliation" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const now = new Date().toISOString();
  rec.status = "matched";
  rec.resolvedAt = now;
  rec.resolvedByPrincipalId = principal.id;
  rec.resolutionNotes = notes;
  rec.updatedAt = now;
  rec.version += 1;
  void correlationId;
  return { reconciliation: sanitizeReconciliation(rec) };
}

export function listQuotes(store: Store, principal: Principal, query?: { bookingId?: string }) {
  ensureFinanceCollections(store);
  const decision = authorize({ principal, permission: "finance:read:invoice", action: "read:fin_quote" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.finQuotes.filter((q) => q.tenantId === principal.tenantId);
  if (query?.bookingId) items = items.filter((q) => q.bookingId === query.bookingId);
  for (const quote of items) {
    if (quote.status === "sent" && isQuoteExpired(quote.validUntil)) quote.status = "expired";
  }
  return { items: items.map(sanitizeQuote) };
}

export function createQuoteFromBooking(
  store: Store,
  principal: Principal,
  input: { bookingId: string; validDays?: number },
  correlationId: string,
) {
  ensureFinanceCollections(store);
  const decision = authorize({ principal, permission: "finance:write:invoice", action: "create:fin_quote" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const booking = findBooking(store, principal.tenantId, input.bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const now = new Date().toISOString();
  const validUntil = new Date(Date.now() + (input.validDays ?? 30) * 86400000).toISOString().slice(0, 10);
  const quote: FinQuote = {
    id: newId(),
    tenantId: principal.tenantId,
    quoteCode: buildQuoteCode(booking.bookingCode),
    bookingId: booking.id,
    organizationId: booking.organizationId,
    status: "draft",
    currency: booking.currency,
    amount: booking.sellPrice,
    validUntil,
    classification: booking.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.finQuotes.push(quote);
  void correlationId;
  return { quote: sanitizeQuote(quote) };
}

export function sendQuote(store: Store, principal: Principal, quoteId: string, correlationId: string) {
  ensureFinanceCollections(store);
  const quote = store.finQuotes.find((q) => q.id === quoteId && q.tenantId === principal.tenantId);
  if (!quote) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "finance:write:invoice", action: "send:fin_quote" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (quote.status !== "draft") return { error: "conflict" as const, reason: "not_draft" };

  const now = new Date().toISOString();
  quote.status = "sent";
  quote.sentAt = now;
  quote.updatedAt = now;
  quote.version += 1;
  void correlationId;
  return { quote: sanitizeQuote(quote) };
}

export function acceptQuote(store: Store, principal: Principal, quoteId: string, correlationId: string) {
  ensureFinanceCollections(store);
  const quote = store.finQuotes.find((q) => q.id === quoteId && q.tenantId === principal.tenantId);
  if (!quote) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "finance:write:invoice", action: "accept:fin_quote" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const gate = canAcceptQuote(quote.status, quote.validUntil);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  const now = new Date().toISOString();
  quote.status = "accepted";
  quote.acceptedAt = now;
  quote.updatedAt = now;
  quote.version += 1;
  void correlationId;
  return { quote: sanitizeQuote(quote) };
}

export function createProgressInvoice(
  store: Store,
  principal: Principal,
  input: { bookingId: string; progressPercent?: number },
  correlationId: string,
) {
  ensureFinanceCollections(store);
  const decision = authorize({ principal, permission: "finance:write:invoice", action: "create:fin_invoice" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const booking = findBooking(store, principal.tenantId, input.bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const existing = store.finInvoices.find(
    (i) => i.bookingId === input.bookingId && i.invoiceType === "progress" && i.status !== "void",
  );
  if (existing) return { error: "conflict" as const, reason: "progress_invoice_exists", invoice: sanitizeInvoice(existing) };

  const pct = input.progressPercent ?? 40;
  const amount = Math.round(booking.sellPrice * (pct / 100) * 100) / 100;
  const invoice = createTypedInvoice(store, principal, booking, "progress", amount);
  void correlationId;
  return { invoice: sanitizeInvoice(invoice) };
}

export function createFinalInvoice(
  store: Store,
  principal: Principal,
  input: { bookingId: string },
  correlationId: string,
) {
  ensureFinanceCollections(store);
  const decision = authorize({ principal, permission: "finance:write:invoice", action: "create:fin_invoice" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const booking = findBooking(store, principal.tenantId, input.bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const existing = store.finInvoices.find(
    (i) => i.bookingId === input.bookingId && i.invoiceType === "final" && i.status !== "void",
  );
  if (existing) return { error: "conflict" as const, reason: "final_invoice_exists", invoice: sanitizeInvoice(existing) };

  const remaining = Math.round((booking.sellPrice - invoicedTotal(store, input.bookingId)) * 100) / 100;
  if (remaining <= 0) return { error: "conflict" as const, reason: "nothing_to_invoice" };

  const invoice = createTypedInvoice(store, principal, booking, "final", remaining);
  void correlationId;
  return { invoice: sanitizeInvoice(invoice) };
}

export function getFinalInvoiceEligibility(store: Store, principal: Principal, bookingId: string) {
  ensureFinanceCollections(store);
  const decision = authorize({ principal, permission: "finance:read:invoice", action: "read:fin_invoice" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const booking = findBooking(store, principal.tenantId, bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const invoices = store.finInvoices.filter((i) => i.bookingId === bookingId && i.tenantId === principal.tenantId);
  const eligibility = assessFinalInvoiceEligibility(booking.sellPrice, invoices);
  return { bookingId, ...eligibility };
}

export function autoCreateFinalInvoice(
  store: Store,
  principal: Principal,
  input: { bookingId: string },
  correlationId: string,
) {
  const eligibility = getFinalInvoiceEligibility(store, principal, input.bookingId);
  if ("error" in eligibility) return eligibility;
  if (!eligibility.eligible) return { error: "conflict" as const, reason: eligibility.reason ?? "not_eligible" };
  return createFinalInvoice(store, principal, input, correlationId);
}

export function listPaymentRequests(store: Store, principal: Principal) {
  ensureFinanceCollections(store);
  const decision = authorize({ principal, permission: "finance:read:payment", action: "read:payment_requests" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const items = store.finPaymentLinks
    .map((link) => {
      const payment = store.payments.get(link.paymentId);
      const invoice = store.finInvoices.find((i) => i.id === link.invoiceId && i.tenantId === principal.tenantId);
      const approval = store.approvals.get(link.approvalId);
      if (!payment || payment.tenantId !== principal.tenantId || !invoice) return null;
      return {
        approvalId: link.approvalId,
        paymentId: link.paymentId,
        invoiceId: link.invoiceId,
        invoiceCode: invoice.invoiceCode,
        invoiceType: invoice.invoiceType,
        bookingId: invoice.bookingId,
        amount: link.amount,
        currency: payment.currency,
        beneficiary: payment.beneficiary,
        status: payment.status,
        approvalStatus: approval?.status ?? "unknown",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return { items };
}

export function requestInvoicePayment(
  store: Store,
  principal: Principal,
  invoiceId: string,
  input: { amount: number; beneficiary: string },
  correlationId: string,
) {
  ensureFinanceCollections(store);
  const invoice = store.finInvoices.find((i) => i.id === invoiceId && i.tenantId === principal.tenantId);
  if (!invoice) return { error: "not_found" as const };
  if (invoice.status === "draft" || invoice.status === "void") {
    return { error: "conflict" as const, reason: "invoice_not_payable" };
  }

  const pending = store.finPaymentLinks.find((l) => l.invoiceId === invoiceId);
  if (pending) {
    const payment = store.payments.get(pending.paymentId);
    if (payment && payment.status === "pending_approval") {
      return { error: "conflict" as const, reason: "payment_pending_approval", approvalId: pending.approvalId };
    }
  }

  const created = createPayment(store, principal, { amount: input.amount, currency: invoice.currency, beneficiary: input.beneficiary }, correlationId);
  if ("error" in created) return created;

  store.finPaymentLinks.push({
    invoiceId,
    paymentId: created.payment.id,
    approvalId: created.approvalId,
    amount: input.amount,
  });
  return {
    payment: created.payment,
    approvalId: created.approvalId,
    invoiceId,
    message: "Payment pending SoD approval — a different finance approver must approve before applying to invoice",
  };
}

export function applyApprovedInvoicePayment(
  store: Store,
  principal: Principal,
  invoiceId: string,
  correlationId: string,
) {
  ensureFinanceCollections(store);
  const link = store.finPaymentLinks.find((l) => l.invoiceId === invoiceId);
  if (!link) return { error: "not_found" as const, reason: "no_payment_link" };

  const payment = store.payments.get(link.paymentId);
  if (!payment) return { error: "not_found" as const, reason: "payment_not_found" };
  if (payment.status !== "approved") {
    return { error: "conflict" as const, reason: "payment_not_approved", status: payment.status };
  }

  store.finPaymentLinks = store.finPaymentLinks.filter((l) => l.invoiceId !== invoiceId);
  return recordInvoicePayment(store, principal, invoiceId, { amount: link.amount, paymentId: link.paymentId }, correlationId);
}

export { decideApproval };
