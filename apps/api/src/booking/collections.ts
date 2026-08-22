import type { Store } from "../store.js";

export function ensureBookingCollections(store: Store): void {
  if (!store.bkgBookings) store.bkgBookings = [];
  if (!store.bkgHandoverTasks) store.bkgHandoverTasks = [];
}
