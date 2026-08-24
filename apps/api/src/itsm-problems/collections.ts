import type { Store } from "../store.js";

export function ensureItsmProblemCollections(store: Store): void {
  if (!store.itsmProblems) store.itsmProblems = [];
}

export function seedDefaultItsmProblems(store: Store): void {
  ensureItsmProblemCollections(store);
}
