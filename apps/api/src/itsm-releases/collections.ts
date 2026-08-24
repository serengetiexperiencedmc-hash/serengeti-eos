import type { Store } from "../store.js";

export function ensureItsmReleaseCollections(store: Store): void {
  if (!store.itsmReleases) store.itsmReleases = [];
}

export function seedDefaultItsmReleases(store: Store): void {
  ensureItsmReleaseCollections(store);
}
