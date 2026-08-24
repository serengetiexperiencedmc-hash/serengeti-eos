import type { Store } from "../store.js";

export const OBS_SPAN_LIMIT = 200;

export function ensureObsCollections(store: Store): void {
  if (!store.otelSpans) store.otelSpans = [];
}
