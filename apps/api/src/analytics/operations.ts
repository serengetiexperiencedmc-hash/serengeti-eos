import {
  authorize,
  computeHandoverProgress,
  type OpsAnalyticsSummary,
  type OpsBookingReadinessRollup,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";

const ACTIVE_BOOKING_STATUSES = new Set(["confirmed", "handover_pending", "handed_over"]);

export function getOperationsAnalyticsSummary(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "analytics:read:operations", action: "read:ops_analytics" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const tenantId = principal.tenantId;
  const bookings = store.bkgBookings.filter((b) => b.tenantId === tenantId && !b.archivedAt);
  const activeBookings = bookings.filter((b) => ACTIVE_BOOKING_STATUSES.has(b.status));

  const handoverTasks = store.bkgHandoverTasks.filter((t) => t.tenantId === tenantId);
  const supplierConfs = store.opsSupplierConfirmations.filter((c) => c.tenantId === tenantId);
  const manifests = store.opsManifests.filter((m) => m.tenantId === tenantId);
  const manifestEntries = store.opsManifestEntries.filter((e) => e.tenantId === tenantId);
  const vouchers = (store.opsVouchers ?? []).filter((v) => v.tenantId === tenantId && v.status !== "void");
  const fieldTasks = store.opsFieldTasks.filter((t) => t.tenantId === tenantId);
  const briefs = store.opsBriefs.filter((b) => b.tenantId === tenantId);
  const syncConflicts = (store.opsSyncConflicts ?? []).filter((c) => c.tenantId === tenantId && !c.resolution);

  const summary: OpsAnalyticsSummary = {
    activeBookings: activeBookings.length,
    bookingsInHandover: bookings.filter((b) => b.status === "handover_pending" || b.status === "handed_over").length,
    handoverTasksPending: handoverTasks.filter((t) => t.status === "pending").length,
    handoverTasksComplete: handoverTasks.filter((t) => t.status === "complete").length,
    supplierConfirmationsPending: supplierConfs.filter((c) => c.status === "requested").length,
    supplierConfirmationsConfirmed: supplierConfs.filter((c) => c.status === "confirmed").length,
    manifestsDraft: manifests.filter((m) => m.status === "draft").length,
    manifestsPublished: manifests.filter((m) => m.status === "published").length,
    manifestGuestCount: manifestEntries.length,
    vouchersDraft: vouchers.filter((v) => v.status === "draft").length,
    vouchersIssued: vouchers.filter((v) => v.status === "issued").length,
    fieldTasksOpen: fieldTasks.filter((t) => t.status !== "complete").length,
    fieldTasksComplete: fieldTasks.filter((t) => t.status === "complete").length,
    opsBriefsIssued: briefs.filter((b) => b.issuedAt).length,
    syncConflicts: syncConflicts.length,
    asOf: new Date().toISOString(),
  };

  return { summary };
}

export function getOperationsBookingReadiness(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "analytics:read:operations", action: "read:ops_booking_readiness" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const tenantId = principal.tenantId;
  const bookings = store.bkgBookings
    .filter((b) => b.tenantId === tenantId && !b.archivedAt && ACTIVE_BOOKING_STATUSES.has(b.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const items: OpsBookingReadinessRollup[] = bookings.map((booking) => {
    const tasks = store.bkgHandoverTasks.filter((t) => t.bookingId === booking.id);
    const completed = tasks.filter((t) => t.status === "complete").length;
    const manifest = store.opsManifests.find((m) => m.bookingId === booking.id);
    const supplierPending = store.opsSupplierConfirmations.filter(
      (c) => c.bookingId === booking.id && c.status === "requested",
    ).length;
    const vouchersDraft = (store.opsVouchers ?? []).filter(
      (v) => v.bookingId === booking.id && v.status === "draft",
    ).length;
    const fieldOpen = store.opsFieldTasks.filter(
      (t) => t.bookingId === booking.id && t.status !== "complete",
    ).length;
    const conflicts = (store.opsSyncConflicts ?? []).filter(
      (c) => c.bookingId === booking.id && !c.resolution,
    ).length;

    return {
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      title: booking.title,
      status: booking.status,
      handoverProgressPercent: computeHandoverProgress(completed, tasks.length),
      pendingHandoverTasks: tasks.filter((t) => t.status === "pending").length,
      supplierConfirmationsPending: supplierPending,
      ...(manifest?.status ? { manifestStatus: manifest.status } : {}),
      vouchersDraft,
      fieldTasksOpen: fieldOpen,
      syncConflicts: conflicts,
    };
  });

  return { items };
}
