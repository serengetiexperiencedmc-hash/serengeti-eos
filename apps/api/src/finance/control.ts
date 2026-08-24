import {
  authorize,
  computeFinanceOutstanding,
  computeMarginAmount,
  computeMarginPercent,
  type BookingFinancialControl,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureFinanceCollections } from "./collections.js";

function findBooking(store: Store, tenantId: string, bookingId: string) {
  return store.bkgBookings.find((b) => b.id === bookingId && b.tenantId === tenantId && !b.archivedAt);
}

function latestInvoiceStatus(store: Store, tenantId: string, bookingId: string, type: "deposit" | "progress" | "final") {
  const match = store.finInvoices.find(
    (i) => i.tenantId === tenantId && i.bookingId === bookingId && i.invoiceType === type && i.status !== "void",
  );
  return match?.status;
}

export function buildBookingFinancialControl(store: Store, tenantId: string, bookingId: string): BookingFinancialControl | undefined {
  ensureFinanceCollections(store);
  const booking = findBooking(store, tenantId, bookingId);
  if (!booking) return undefined;

  const invoices = store.finInvoices.filter((i) => i.tenantId === tenantId && i.bookingId === booking.id && i.status !== "void");
  const invoicedTotal = invoices.reduce((sum, i) => sum + i.amount, 0);
  const paidTotal = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const quotesCount = store.finQuotes.filter((q) => q.tenantId === tenantId && q.bookingId === booking.id).length;
  const exceptions = store.finReconciliations.filter(
    (r) => r.tenantId === tenantId && r.bookingId === booking.id && r.status === "exception",
  ).length;

  const sheet = store.costSheets.find(
    (s) =>
      s.tenantId === tenantId &&
      !s.archivedAt &&
      (s.programmeId === booking.programmeId || s.rfpId === booking.rfpId),
  );
  const supplierCost = sheet?.totalCost ?? 0;
  const clientRevenue = booking.sellPrice;
  const depositStatus = latestInvoiceStatus(store, tenantId, booking.id, "deposit");
  const progressStatus = latestInvoiceStatus(store, tenantId, booking.id, "progress");
  const finalStatus = latestInvoiceStatus(store, tenantId, booking.id, "final");

  const item: BookingFinancialControl = {
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    title: booking.title,
    organizationId: booking.organizationId,
    status: booking.status,
    currency: booking.currency,
    clientRevenue,
    supplierCost,
    marginAmount: computeMarginAmount(clientRevenue, supplierCost),
    marginPercent: computeMarginPercent(clientRevenue, supplierCost),
    invoicedTotal: Math.round(invoicedTotal * 100) / 100,
    paidTotal: Math.round(paidTotal * 100) / 100,
    outstandingTotal: computeFinanceOutstanding(clientRevenue, paidTotal),
    quotesCount,
    invoicesCount: invoices.length,
    reconciliationExceptions: exceptions,
  };
  if (depositStatus) item.depositStatus = depositStatus;
  if (progressStatus) item.progressStatus = progressStatus;
  if (finalStatus) item.finalStatus = finalStatus;
  return item;
}

export function listFinanceControl(store: Store, principal: Principal) {
  ensureFinanceCollections(store);
  const decision = authorize({
    principal,
    permission: "finance:read:invoice",
    action: "read:fin_control",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const items = store.bkgBookings
    .filter((b) => b.tenantId === principal.tenantId && !b.archivedAt && b.status !== "cancelled")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((b) => buildBookingFinancialControl(store, principal.tenantId, b.id))
    .filter((item): item is BookingFinancialControl => item !== undefined);

  return { items };
}

export function getBookingFinancialControl(store: Store, principal: Principal, bookingId: string) {
  ensureFinanceCollections(store);
  const decision = authorize({
    principal,
    permission: "finance:read:invoice",
    action: "read:fin_control",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const control = buildBookingFinancialControl(store, principal.tenantId, bookingId);
  if (!control) return { error: "not_found" as const, reason: "booking_not_found" };
  return { control };
}
