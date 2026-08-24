import type { Store } from "../store.js";

export function ensureCrisisDecisionCollections(store: Store): void {
  if (!store.crisisDecisions) store.crisisDecisions = [];
}

export function seedDefaultCrisisDecisions(store: Store): void {
  ensureCrisisDecisionCollections(store);
}
