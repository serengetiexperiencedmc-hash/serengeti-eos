import type { Store } from "../store.js";

export function ensureCrisisActionCollections(store: Store): void {
  if (!store.crisisActions) store.crisisActions = [];
}

export function seedDefaultCrisisActions(store: Store): void {
  ensureCrisisActionCollections(store);
}
