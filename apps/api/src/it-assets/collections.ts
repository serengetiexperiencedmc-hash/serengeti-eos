import type { Store } from "../store.js";

export function ensureItAssetCollections(store: Store): void {
  if (!store.itAssets) store.itAssets = [];
}

export function seedDefaultItAssets(store: Store): void {
  ensureItAssetCollections(store);
}
