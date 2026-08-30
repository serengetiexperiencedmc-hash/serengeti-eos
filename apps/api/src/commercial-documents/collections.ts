import type { Store } from "../store.js";

export function ensureCommercialDocumentCollections(store: Store): void {
  if (!store.commercialDocuments) store.commercialDocuments = [];
}

export function ensureSupplierContractCollections(store: Store): void {
  if (!store.supContracts) store.supContracts = [];
  if (!store.supContractVersions) store.supContractVersions = [];
  if (!store.supHotelProfiles) store.supHotelProfiles = [];
}
