import type { Store } from "../store.js";

export function ensureCommercialApprovalCollections(store: Store): void {
  if (!store.comApprovalRequests) store.comApprovalRequests = [];
}
