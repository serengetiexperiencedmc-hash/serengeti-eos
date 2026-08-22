import type { DbPool } from "@sedmc/db";
import type { ProcessedEventKey } from "@sedmc/kernel";
import type { Store } from "../store.js";
import {
  deleteProcessedEvent,
  insertProcessedEvent,
  loadProcessedEvents,
} from "./pg-repository.js";

export async function persistProcessedEvent(pool: DbPool | undefined, key: ProcessedEventKey): Promise<void> {
  if (!pool) return;
  await insertProcessedEvent(pool, key);
}

export async function removeProcessedEvent(
  pool: DbPool | undefined,
  tenantId: string,
  consumer: string,
  eventId: string,
): Promise<void> {
  if (!pool) return;
  await deleteProcessedEvent(pool, tenantId, consumer, eventId);
}

export async function hydrateProcessedEvents(pool: DbPool, store: Store): Promise<number> {
  const rows = await loadProcessedEvents(pool);
  const existing = new Set(
    store.processedEvents.map((p) => `${p.tenantId}:${p.consumer}:${p.eventId}`),
  );
  let merged = 0;
  for (const row of rows) {
    const key = `${row.tenantId}:${row.consumer}:${row.eventId}`;
    if (existing.has(key)) continue;
    store.processedEvents.push(row);
    existing.add(key);
    merged += 1;
  }
  return merged;
}
