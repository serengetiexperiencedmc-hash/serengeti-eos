import type { Store } from "../store.js";

export function ensureSupplierCollections(store: Store): void {
  if (!store.supImportBatches) store.supImportBatches = [];
  if (!store.supSuppliers) store.supSuppliers = [];
  if (!store.supContacts) store.supContacts = [];
  if (!store.supRates) store.supRates = [];
  if (!store.supSeasons) store.supSeasons = [];
  if (!store.supContentBlocks) store.supContentBlocks = [];
  if (!store.supImportExecuteIdempotency) store.supImportExecuteIdempotency = {};
}
