import type { Store } from "../store.js";

export function ensureConsentRecordCollections(store: Store): void {
  if (!store.consentRecords) store.consentRecords = [];
}

export function seedDefaultConsentRecords(store: Store): void {
  ensureConsentRecordCollections(store);
}
