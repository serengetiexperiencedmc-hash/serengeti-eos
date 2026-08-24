import type { Store } from "../store.js";

export function ensureHrCertificationCollections(store: Store): void {
  if (!store.hrCertifications) store.hrCertifications = [];
}

export function seedDefaultHrCertifications(store: Store): void {
  ensureHrCertificationCollections(store);
}
