import {
  authorize,
  computeFinanceOutstanding,
  computeMarginAmount,
  computeMarginPercent,
  type FinanceAnalyticsSummary,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";

function parseBound(value: string | undefined, endOfDay: boolean): number | undefined {
  if (!value) return undefined;
  const parsed = Date.parse(endOfDay ? `${value}T23:59:59.999Z` : `${value}T00:00:00.000Z`);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}

export function getFinanceAnalyticsSummary(
  store: Store,
  principal: Principal,
  query?: { from?: string; to?: string },
) {
  const decision = authorize({
    principal,
    permission: "analytics:read:finance",
    action: "read:finance_analytics",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const fromBound = parseBound(query?.from, false);
  const toBound = parseBound(query?.to, true);
  if (fromBound !== undefined && Number.isNaN(fromBound)) return { error: "invalid" as const, reason: "invalid_date_range" };
  if (toBound !== undefined && Number.isNaN(toBound)) return { error: "invalid" as const, reason: "invalid_date_range" };
  if (fromBound !== undefined && toBound !== undefined && fromBound > toBound) {
    return { error: "invalid" as const, reason: "invalid_date_range" };
  }

  const tenantId = principal.tenantId;
  const bookings = store.bkgBookings.filter((b) => {
    if (b.tenantId !== tenantId || b.archivedAt || b.status === "cancelled") return false;
    const confirmed = Date.parse(b.confirmedAt);
    if (fromBound !== undefined && confirmed < fromBound) return false;
    if (toBound !== undefined && confirmed > toBound) return false;
    return true;
  });
  const bookingIds = new Set(bookings.map((b) => b.id));

  const clientRevenue = bookings.reduce((sum, b) => sum + b.sellPrice, 0);
  const supplierCost = bookings.reduce((sum, booking) => {
    const sheet = store.costSheets.find(
      (s) =>
        s.tenantId === tenantId &&
        !s.archivedAt &&
        (s.programmeId === booking.programmeId || s.rfpId === booking.rfpId),
    );
    return sum + (sheet?.totalCost ?? 0);
  }, 0);

  const invoices = (store.finInvoices ?? []).filter(
    (i) => i.tenantId === tenantId && bookingIds.has(i.bookingId) && i.status !== "void",
  );
  const invoicedTotal = invoices.reduce((sum, i) => sum + i.amount, 0);
  const paidTotal = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const outstandingInvoiceCount = invoices.filter((i) => i.status === "issued" || i.status === "partially_paid").length;
  const reconciliationExceptions = (store.finReconciliations ?? []).filter(
    (r) => r.tenantId === tenantId && bookingIds.has(r.bookingId) && r.status === "exception",
  ).length;

  const summary: FinanceAnalyticsSummary = {
    bookingCount: bookings.length,
    clientRevenue: Math.round(clientRevenue * 100) / 100,
    supplierCost: Math.round(supplierCost * 100) / 100,
    marginAmount: computeMarginAmount(clientRevenue, supplierCost),
    marginPercent: computeMarginPercent(clientRevenue, supplierCost),
    invoicedTotal: Math.round(invoicedTotal * 100) / 100,
    paidTotal: Math.round(paidTotal * 100) / 100,
    outstandingTotal: computeFinanceOutstanding(clientRevenue, paidTotal),
    outstandingInvoiceCount,
    reconciliationExceptions,
    currency: "USD",
    asOf: new Date().toISOString(),
  };
  if (query?.from) summary.from = query.from;
  if (query?.to) summary.to = query.to;
  return { summary };
}
