import type { DbPool } from "@sedmc/db";
import type { SupHeatmapRollupSnapshot } from "@sedmc/kernel";
import { ensureSupplierCollections } from "../supplier/collections.js";
import type { Store } from "../store.js";
import {
  loadSupContacts,
  loadSupContentBlocks,
  loadSupHeatmapRollupSnapshots,
  loadSupImportBatches,
  loadSupImportExecuteIdempotencies,
  loadSupRates,
  loadSupSuppliers,
  upsertSupContact,
  upsertSupContentBlock,
  upsertSupHeatmapRollupSnapshot,
  upsertSupImportBatch,
  upsertSupImportExecuteIdempotency,
  upsertSupRate,
  upsertSupSupplier,
} from "./pg-repository.js";

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

export async function persistSupImportExecuteIdempotencyAfterCommit(
  pool: DbPool | undefined,
  tenantId: string,
  batchId: string,
  clientKey: string,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertSupImportExecuteIdempotency(pool, { tenantId, batchId, clientKey });
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistSupEntityAfterCommit(
  pool: DbPool | undefined,
  store: Store,
  entityType: string,
  entityId: string,
): Promise<void> {
  if (!pool) return;
  try {
    if (entityType === "supplier") {
      const supplier = store.supSuppliers.find((s) => s.id === entityId);
      if (supplier) await upsertSupSupplier(pool, supplier);
      return;
    }
    if (entityType === "supplier_contact") {
      const contact = store.supContacts.find((c) => c.id === entityId);
      if (contact) await upsertSupContact(pool, contact);
      return;
    }
    if (entityType === "supplier_rate") {
      const rate = store.supRates.find((r) => r.id === entityId);
      if (rate) await upsertSupRate(pool, rate);
      return;
    }
    if (entityType === "supplier_content_block") {
      const block = store.supContentBlocks.find((b) => b.id === entityId);
      if (block) await upsertSupContentBlock(pool, block);
    }
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

export async function hydrateSupImportExecuteIdempotenciesFromPostgres(pool: DbPool, store: Store): Promise<number> {
  ensureSupplierCollections(store);
  const rows = await loadSupImportExecuteIdempotencies(pool);
  let merged = 0;
  for (const row of rows) {
    if (store.supImportExecuteIdempotency[row.storeKey]) continue;
    store.supImportExecuteIdempotency[row.storeKey] = row.status;
    merged += 1;
  }
  return merged;
}

export async function persistSupHeatmapRollupSnapshot(
  pool: DbPool | undefined,
  snapshot: SupHeatmapRollupSnapshot,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertSupHeatmapRollupSnapshot(pool, snapshot);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateSupHeatmapRollupSnapshots(pool: DbPool, store: Store): Promise<number> {
  ensureSupplierCollections(store);
  const rows = await loadSupHeatmapRollupSnapshots(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.supHeatmapRollupSnapshots.findIndex((s) => s.tenantId === row.tenantId);
    if (idx >= 0) {
      store.supHeatmapRollupSnapshots[idx] = row;
    } else {
      store.supHeatmapRollupSnapshots.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function hydrateSupFromPostgres(pool: DbPool, store: Store): Promise<{
  suppliers: number;
  contacts: number;
  rates: number;
  contentBlocks: number;
}> {
  ensureSupplierCollections(store);
  const [suppliers, contacts, rates, contentBlocks] = await Promise.all([
    loadSupSuppliers(pool),
    loadSupContacts(pool),
    loadSupRates(pool),
    loadSupContentBlocks(pool),
  ]);
  return {
    suppliers: mergeById(store.supSuppliers, suppliers),
    contacts: mergeById(store.supContacts, contacts),
    rates: mergeById(store.supRates, rates),
    contentBlocks: mergeById(store.supContentBlocks, contentBlocks),
  };
}
