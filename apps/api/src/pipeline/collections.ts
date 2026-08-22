import type { Store } from "../store.js";

export function ensurePipelineCollections(store: Store): void {
  if (!store.oppOpportunities) store.oppOpportunities = [];
  if (!store.oppStageHistory) store.oppStageHistory = [];
}
