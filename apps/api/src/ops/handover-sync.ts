import type { Store } from "../store.js";
import { ensureBookingCollections } from "../booking/collections.js";

function refreshBookingHandoverStatus(store: Store, bookingId: string, now: string): void {
  const booking = store.bkgBookings.find((b) => b.id === bookingId);
  if (!booking) return;
  const tasks = store.bkgHandoverTasks.filter((t) => t.bookingId === bookingId);
  const allComplete = tasks.length > 0 && tasks.every((t) => t.status === "complete");
  const anyComplete = tasks.some((t) => t.status === "complete");
  if (allComplete) {
    booking.status = "handed_over";
    booking.handoverCompletedAt = booking.handoverCompletedAt ?? now;
  } else if (anyComplete) {
    booking.status = "handover_pending";
  } else {
    booking.status = "confirmed";
  }
  booking.updatedAt = now;
}

export function autoCompleteHandoverTaskByKey(
  store: Store,
  tenantId: string,
  bookingId: string,
  taskKey: string,
  principalId: string,
): boolean {
  ensureBookingCollections(store);
  const task = store.bkgHandoverTasks.find(
    (t) => t.bookingId === bookingId && t.tenantId === tenantId && t.taskKey === taskKey && t.status === "pending",
  );
  if (!task) return false;
  const now = new Date().toISOString();
  task.status = "complete";
  task.completedAt = now;
  task.completedByPrincipalId = principalId;
  task.updatedAt = now;
  const booking = store.bkgBookings.find((b) => b.id === bookingId);
  if (booking) {
    booking.version += 1;
    booking.updatedByPrincipalId = principalId;
    refreshBookingHandoverStatus(store, bookingId, now);
  }
  return true;
}
