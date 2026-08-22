import type { Store } from "../store.js";

export function ensureNotificationCollections(store: Store): void {
  if (!store.notifDismissals) store.notifDismissals = [];
  if (!store.notifEmailOutbox) store.notifEmailOutbox = [];
}
