import type { Store } from "../store.js";

export function ensureClassificationRecordCollections(store: Store): void {
  if (!store.classificationRecords) store.classificationRecords = [];
}

export function seedDefaultClassificationRecords(store: Store): void {
  ensureClassificationRecordCollections(store);
}
