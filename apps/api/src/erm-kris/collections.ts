import type { Store } from "../store.js";

export function ensureErmKriCollections(store: Store): void {
  if (!store.ermKris) store.ermKris = [];
}

export function seedDefaultErmKris(store: Store): void {
  ensureErmKriCollections(store);
}
