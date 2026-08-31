import type { DbPool } from "@sedmc/db";
import type { OutboxRecord } from "@sedmc/kernel";
import type { Store } from "../store.js";
import {
  countPendingOutboxEvents,
  hydratePendingOutboxEvents,
  insertOutboxEvent,
  updateOutboxEventStatus,
} from "./pg-repository.js";

export async function persistOutboxInsert(pool: DbPool | undefined, outbox: OutboxRecord): Promise<void> {
  if (!pool) return;
  await insertOutboxEvent(pool, outbox);
}

export async function persistOutboxPublish(
  pool: DbPool | undefined,
  outbox: OutboxRecord,
): Promise<void> {
  if (!pool) return;
  await updateOutboxEventStatus(pool, {
    id: outbox.id,
    status: outbox.status,
    ...(outbox.publishedAt !== undefined ? { publishedAt: outbox.publishedAt } : {}),
    attempts: outbox.attempts,
    ...(outbox.lastError !== undefined ? { lastError: outbox.lastError } : {}),
  });
}

export async function hydratePendingOutbox(pool: DbPool, store: Store): Promise<number> {
  const pending = await hydratePendingOutboxEvents(pool);
  const existing = new Set(store.outboxEvents.map((e) => e.id));
  let merged = 0;
  for (const row of pending) {
    if (existing.has(row.id)) continue;
    store.outboxEvents.push(row);
    merged += 1;
  }
  return merged;
}

export async function countPendingOutbox(pool: DbPool, tenantId?: string): Promise<number> {
  return countPendingOutboxEvents(pool, tenantId);
}
