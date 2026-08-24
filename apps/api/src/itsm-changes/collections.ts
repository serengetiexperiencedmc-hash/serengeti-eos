import type { Store } from "../store.js";

export function ensureItsmChangeCollections(store: Store): void {
  if (!store.itsmChanges) store.itsmChanges = [];
}

export function seedDefaultItsmChanges(store: Store): void {
  ensureItsmChangeCollections(store);
}
