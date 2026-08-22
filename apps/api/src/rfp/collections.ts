import type { Store } from "../store.js";

export function ensureRfpCollections(store: Store): void {
  if (!store.rfpRfps) store.rfpRfps = [];
  if (!store.rfpVersions) store.rfpVersions = [];
}
