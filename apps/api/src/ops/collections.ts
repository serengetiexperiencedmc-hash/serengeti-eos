import type { Store } from "../store.js";

export function ensureOpsCollections(store: Store): void {
  if (!store.opsSupplierConfirmations) store.opsSupplierConfirmations = [];
  if (!store.opsManifests) store.opsManifests = [];
  if (!store.opsManifestEntries) store.opsManifestEntries = [];
  if (!store.opsAssignments) store.opsAssignments = [];
  if (!store.opsFieldTasks) store.opsFieldTasks = [];
  if (!store.opsBriefs) store.opsBriefs = [];
  if (!store.opsFieldSyncSessions) store.opsFieldSyncSessions = [];
  if (!store.opsSyncConflicts) store.opsSyncConflicts = [];
  if (!store.opsVouchers) store.opsVouchers = [];
}
