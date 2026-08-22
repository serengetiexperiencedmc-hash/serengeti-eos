import type { Store } from "../store.js";

export function ensureFinanceCollections(store: Store): void {
  if (!store.finInvoices) store.finInvoices = [];
  if (!store.finReconciliations) store.finReconciliations = [];
  if (!store.finQuotes) store.finQuotes = [];
  if (!store.finPaymentLinks) store.finPaymentLinks = [];
}
