import type { Store } from "../store.js";

export function ensurePrivacyDpiaCollections(store: Store): void {
  if (!store.privacyDpias) store.privacyDpias = [];
}

export function seedDefaultPrivacyDpias(store: Store): void {
  ensurePrivacyDpiaCollections(store);
}
