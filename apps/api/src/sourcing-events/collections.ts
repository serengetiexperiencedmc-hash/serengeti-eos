import type { Store } from "../store.js";

export function ensureSourcingEventCollections(store: Store): void {
  if (!store.sourcingEventRecords) store.sourcingEventRecords = [];
}

export function seedDefaultSourcingEventRecords(store: Store): void {
  ensureSourcingEventCollections(store);
}
