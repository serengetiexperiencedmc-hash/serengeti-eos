import type { Store } from "../store.js";

export function ensureItLicenseCollections(store: Store): void {
  if (!store.itLicenses) store.itLicenses = [];
}

export function seedDefaultItLicenses(store: Store): void {
  ensureItLicenseCollections(store);
}
