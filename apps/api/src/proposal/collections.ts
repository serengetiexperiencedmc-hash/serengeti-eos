import type { Store } from "../store.js";

export function ensureProposalCollections(store: Store): void {
  if (!store.propProposals) store.propProposals = [];
  if (!store.propProposalVersions) store.propProposalVersions = [];
}
