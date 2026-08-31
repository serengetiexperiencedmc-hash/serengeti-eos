import {
  authorize,
  computeFinanceOutstanding,
  computeHandoverProgress,
  type BookingCommandCenterSnapshot,
  type BookingCommandCenterTimelineEntry,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureBookingCollections } from "./collections.js";
import { getBookingDetail } from "./booking.js";

function findBooking(store: Store, tenantId: string, id: string) {
  return store.bkgBookings.find((b) => b.id === id && b.tenantId === tenantId && !b.archivedAt);
}

function buildTimeline(
  booking: { confirmedAt: string; handoverCompletedAt?: string },
  ops: BookingCommandCenterSnapshot["ops"],
  finance: BookingCommandCenterSnapshot["finance"],
  handoverComplete: boolean,
): BookingCommandCenterTimelineEntry[] {
  const entries: BookingCommandCenterTimelineEntry[] = [
    {
      key: "confirmed",
      label: "Booking confirmed",
      at: booking.confirmedAt,
      status: "complete",
    },
    {
      key: "deposit_invoice",
      label: "Deposit invoice raised",
      status: finance.invoicesCount > 0 ? "complete" : "pending",
    },
    {
      key: "supplier_confirm",
      label: "Supplier confirmations",
      status: ops.supplierConfirmationsTotal > 0 && ops.supplierConfirmationsPending === 0 ? "complete" : "pending",
    },
    {
      key: "guest_manifest",
      label: "Guest manifest published",
      ...(ops.manifestPublishedAt ? { at: ops.manifestPublishedAt } : {}),
      status: ops.manifestStatus === "published" ? "complete" : "pending",
    },
    {
      key: "ops_brief",
      label: "Operations brief issued",
      status: ops.briefIssued ? "complete" : "pending",
    },
    {
      key: "guest_vouchers",
      label: "Guest vouchers issued",
      status: ops.vouchersIssued > 0 && ops.vouchersDraft === 0 ? "complete" : "pending",
    },
    {
      key: "handover_complete",
      label: "Operational handover complete",
      ...(booking.handoverCompletedAt ? { at: booking.handoverCompletedAt } : {}),
      status: handoverComplete ? "complete" : "pending",
    },
  ];
  return entries;
}

export function getBookingCommandCenter(store: Store, principal: Principal, bookingId: string) {
  ensureBookingCollections(store);
  const detail = getBookingDetail(store, principal, bookingId);
  if ("error" in detail) return detail;

  const booking = findBooking(store, principal.tenantId, bookingId);
  if (!booking) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "booking:read:command_center",
    action: "read:booking_command_center",
    resource: {
      tenantId: booking.tenantId,
      type: "booking",
      id: booking.id,
      classification: booking.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const handoverTasks = detail.handoverTasks;
  const completedCount = handoverTasks.filter((t) => t.status === "complete").length;
  const handoverComplete = handoverTasks.length > 0 && completedCount === handoverTasks.length;

  const supplierConfs = store.opsSupplierConfirmations.filter((c) => c.bookingId === bookingId);
  const manifest = store.opsManifests.find((m) => m.bookingId === bookingId);
  const manifestEntries = manifest
    ? store.opsManifestEntries.filter((e) => e.manifestId === manifest.id)
    : [];
  const vouchers = (store.opsVouchers ?? []).filter((v) => v.bookingId === bookingId && v.status !== "void");
  const fieldTasks = store.opsFieldTasks.filter((t) => t.bookingId === bookingId);
  const brief = store.opsBriefs.find((b) => b.bookingId === bookingId);
  const syncConflicts = (store.opsSyncConflicts ?? []).filter(
    (c) => c.bookingId === bookingId && !c.resolution,
  ).length;

  const invoices = (store.finInvoices ?? []).filter(
    (i) => i.bookingId === bookingId && i.tenantId === principal.tenantId && i.status !== "void",
  );
  const quotes = (store.finQuotes ?? []).filter(
    (q) => q.bookingId === bookingId && q.tenantId === principal.tenantId,
  );
  const reconExceptions = (store.finReconciliations ?? []).filter(
    (r) => r.bookingId === bookingId && r.status === "exception",
  ).length;

  const invoicedTotal = invoices.reduce((sum, i) => sum + i.amount, 0);
  const paidTotal = invoices.reduce((sum, i) => sum + i.amountPaid, 0);

  const opsSection: BookingCommandCenterSnapshot["ops"] = {
    supplierConfirmationsTotal: supplierConfs.length,
    supplierConfirmationsPending: supplierConfs.filter((c) => c.status === "requested").length,
    supplierConfirmationsConfirmed: supplierConfs.filter((c) => c.status === "confirmed").length,
    ...(manifest?.status ? { manifestStatus: manifest.status } : {}),
    manifestGuestCount: manifestEntries.length,
    ...(manifest?.publishedAt ? { manifestPublishedAt: manifest.publishedAt } : {}),
    vouchersDraft: vouchers.filter((v) => v.status === "draft").length,
    vouchersIssued: vouchers.filter((v) => v.status === "issued").length,
    fieldTasksOpen: fieldTasks.filter((t) => t.status !== "complete").length,
    fieldTasksComplete: fieldTasks.filter((t) => t.status === "complete").length,
    briefIssued: Boolean(brief?.issuedAt),
    syncConflicts,
  };

  const financeSection: BookingCommandCenterSnapshot["finance"] = {
    contractValue: booking.sellPrice,
    currency: booking.currency,
    invoicedTotal: Math.round(invoicedTotal * 100) / 100,
    paidTotal: Math.round(paidTotal * 100) / 100,
    outstandingTotal: computeFinanceOutstanding(booking.sellPrice, paidTotal),
    quotesCount: quotes.length,
    invoicesCount: invoices.length,
    reconciliationExceptions: reconExceptions,
  };

  const snapshot: BookingCommandCenterSnapshot = {
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    title: booking.title,
    status: booking.status,
    handover: {
      progressPercent: computeHandoverProgress(completedCount, handoverTasks.length),
      completedCount,
      totalCount: handoverTasks.length,
    },
    ops: opsSection,
    finance: financeSection,
    timeline: buildTimeline(booking, opsSection, financeSection, handoverComplete),
  };

  return {
    ...detail,
    snapshot,
    invoices: invoices.map((i) => ({
      id: i.id,
      invoiceCode: i.invoiceCode,
      invoiceType: i.invoiceType,
      status: i.status,
      amount: i.amount,
      amountPaid: i.amountPaid,
      currency: i.currency,
    })),
    quotes: quotes.map((q) => ({
      id: q.id,
      quoteCode: q.quoteCode,
      status: q.status,
      amount: q.amount,
      currency: q.currency,
    })),
  };
}
