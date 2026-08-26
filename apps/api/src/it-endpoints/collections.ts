import type { Store } from "../store.js";

export function ensureItEndpointCollections(store: Store): void {
  if (!store.itEndpoints) store.itEndpoints = [];
}

export function seedDefaultItEndpoints(store: Store): void {
  ensureItEndpointCollections(store);
}
