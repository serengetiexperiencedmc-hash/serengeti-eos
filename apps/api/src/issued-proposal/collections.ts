import type { Store } from "../store.js";

export function ensureIssuedProposalCollections(store: Store): void {
  if (!store.issuedProposals) store.issuedProposals = [];
  if (!store.issuedClientDocuments) store.issuedClientDocuments = [];
  if (!store.issuedClientDocumentDeliveries) store.issuedClientDocumentDeliveries = [];
  if (!store.issuedClientDocumentDeliveryAttempts) store.issuedClientDocumentDeliveryAttempts = [];
}
