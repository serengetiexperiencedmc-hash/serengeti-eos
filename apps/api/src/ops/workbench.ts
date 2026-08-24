import {
  authorize,
  computeHandoverProgress,
  requiresOpsAttention,
  type OpsWorkbenchItem,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureOpsCollections } from "./collections.js";

const ACTIVE_BOOKING_STATUSES = new Set(["confirmed", "handover_pending", "handed_over"]);

export function collectOpsWorkbenchItems(store: Store, tenantId: string): OpsWorkbenchItem[] {
  ensureOpsCollections(store);
  const bookings = store.bkgBookings
    .filter((b) => b.tenantId === tenantId && !b.archivedAt && ACTIVE_BOOKING_STATUSES.has(b.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return bookings.map((booking) => {
    const tasks = store.bkgHandoverTasks.filter((t) => t.bookingId === booking.id && t.tenantId === tenantId);
    const completed = tasks.filter((t) => t.status === "complete").length;
    const manifest = store.opsManifests.find((m) => m.bookingId === booking.id && m.tenantId === tenantId);
    const pendingHandoverTasks = tasks.filter((t) => t.status === "pending").length;
    const supplierConfirmationsPending = store.opsSupplierConfirmations.filter(
      (c) => c.bookingId === booking.id && c.tenantId === tenantId && c.status === "requested",
    ).length;
    const vouchersDraft = (store.opsVouchers ?? []).filter(
      (v) => v.bookingId === booking.id && v.tenantId === tenantId && v.status === "draft",
    ).length;
    const fieldTasksOpen = store.opsFieldTasks.filter(
      (t) => t.bookingId === booking.id && t.tenantId === tenantId && t.status !== "complete",
    ).length;
    const syncConflicts = (store.opsSyncConflicts ?? []).filter(
      (c) => c.bookingId === booking.id && c.tenantId === tenantId && !c.resolution,
    ).length;

    const signals = {
      pendingHandoverTasks,
      supplierConfirmationsPending,
      vouchersDraft,
      fieldTasksOpen,
      syncConflicts,
    };

    const item: OpsWorkbenchItem = {
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      title: booking.title,
      organizationId: booking.organizationId,
      status: booking.status,
      handoverProgressPercent: computeHandoverProgress(completed, tasks.length),
      pendingHandoverTasks,
      supplierConfirmationsPending,
      vouchersDraft,
      fieldTasksOpen,
      syncConflicts,
      attentionRequired: requiresOpsAttention(signals),
    };
    if (manifest?.status) item.manifestStatus = manifest.status;
    if (booking.paxCount != null) item.paxCount = booking.paxCount;
    if (booking.travelDates) item.travelDates = booking.travelDates;
    return item;
  });
}

export function listOpsWorkbench(
  store: Store,
  principal: Principal,
  query?: { attention?: string; status?: string; q?: string },
) {
  const decision = authorize({
    principal,
    permission: "ops:read:operations",
    action: "read:ops_workbench",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = collectOpsWorkbenchItems(store, principal.tenantId);
  const attention =
    query?.attention === "true" || query?.attention === "1" || query?.attention === "yes";
  if (attention) items = items.filter((item) => item.attentionRequired);
  if (query?.status) items = items.filter((item) => item.status === query.status);
  const q = query?.q?.trim().toLowerCase();
  if (q) {
    items = items.filter(
      (item) => item.bookingCode.toLowerCase().includes(q) || item.title.toLowerCase().includes(q),
    );
  }
  return { items };
}
