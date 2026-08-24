import type { Store } from "../store.js";

export function ensureOperationalIssueCollections(store: Store): void {
  if (!store.operationalIssues) store.operationalIssues = [];
}

export function seedDefaultOperationalIssues(store: Store): void {
  ensureOperationalIssueCollections(store);
}
