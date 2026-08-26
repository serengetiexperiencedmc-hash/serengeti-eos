import type { Store } from "../store.js";

export function ensureErmTreatmentCollections(store: Store): void {
  if (!store.ermTreatments) store.ermTreatments = [];
}

export function seedDefaultErmTreatments(store: Store): void {
  ensureErmTreatmentCollections(store);
}
