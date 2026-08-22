import type { DbPool } from "@sedmc/db";
import { ensureSupplierCollections } from "../supplier/collections.js";
import type { Store } from "../store.js";
import { loadSupImportBatches, upsertSupImportBatch } from "./pg-repository.js";

export async function persistSupImportBatchAfterCommit(
  pool: DbPool | undefined,
  store: Store,
  batchId: string,
): Promise<void> {
  if (!pool) return;
  try {
    const batch = store.supImportBatches.find((b) => b.id === batchId);
    if (batch) await upsertSupImportBatch(pool, batch);
  } catch {
    // Fire-and-forget dual-write.
  }
}

function mergeById<T extends { id: string }>(target: T[], incoming: T[]): number {
  let merged = 0;
  for (const row of incoming) {
    if (target.some((x) => x.id === row.id)) continue;
    target.push(row);
    merged += 1;
  }
  return merged;
}

export async function hydrateSupImportBatchesFromPostgres(pool: DbPool, store: Store): Promise<number> {
  ensureSupplierCollections(store);
  const batches = await loadSupImportBatches(pool);
  return mergeById(store.supImportBatches, batches);
}
