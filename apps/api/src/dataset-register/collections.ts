import type { Store } from "../store.js";

export function ensureDatasetRecordCollections(store: Store): void {
  if (!store.datasetRecords) store.datasetRecords = [];
}

export function seedDefaultDatasetRecords(store: Store): void {
  ensureDatasetRecordCollections(store);
}
