import type { Store } from "../store.js";

export function ensureCostingCollections(store: Store): void {
  if (!store.costSheets) store.costSheets = [];
  if (!store.costLineItems) store.costLineItems = [];
  if (!store.costSheetVersions) store.costSheetVersions = [];
}
