import type { Store } from "../store.js";

export function ensureProcurementCollections(store: Store): void {
  if (!store.procurementRecords) store.procurementRecords = [];
}

export function seedDefaultProcurementRecords(store: Store): void {
  ensureProcurementCollections(store);
}
