import type { DbPool } from "@sedmc/db";
import type { NatsConsumerOffset } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { loadNatsConsumerOffsets, upsertNatsConsumerOffset } from "./pg-repository.js";

export async function persistNatsConsumerOffset(
  pool: DbPool | undefined,
  offset: NatsConsumerOffset,
): Promise<void> {
  if (!pool) return;
  await upsertNatsConsumerOffset(pool, offset);
}

export async function hydrateNatsConsumerOffsets(pool: DbPool, store: Store): Promise<number> {
  if (!store.natsConsumerOffsets) store.natsConsumerOffsets = [];
  const rows = await loadNatsConsumerOffsets(pool);
  const existing = new Set(
    store.natsConsumerOffsets.map((o) => `${o.tenantId}:${o.consumer}:${o.stream}`),
  );
  let merged = 0;
  for (const row of rows) {
    const key = `${row.tenantId}:${row.consumer}:${row.stream}`;
    if (existing.has(key)) continue;
    store.natsConsumerOffsets.push(row);
    existing.add(key);
    merged += 1;
  }
  return merged;
}

export function recordNatsConsumerOffset(
  store: Store,
  input: {
    tenantId: string;
    consumer: string;
    stream: string;
    streamSeq: number;
    eventId?: string;
  },
): void {
  if (!store.natsConsumerOffsets) store.natsConsumerOffsets = [];
  const now = new Date().toISOString();
  const existing = store.natsConsumerOffsets.find(
    (o) => o.tenantId === input.tenantId && o.consumer === input.consumer && o.stream === input.stream,
  );
  if (existing) {
    if (input.streamSeq >= existing.lastStreamSeq) {
      existing.lastStreamSeq = input.streamSeq;
      existing.updatedAt = now;
      if (input.eventId) existing.lastEventId = input.eventId;
    }
  } else {
    store.natsConsumerOffsets.push({
      tenantId: input.tenantId,
      consumer: input.consumer,
      stream: input.stream,
      lastStreamSeq: input.streamSeq,
      ...(input.eventId ? { lastEventId: input.eventId } : {}),
      updatedAt: now,
    });
  }
  const offset = store.natsConsumerOffsets.find(
    (o) => o.tenantId === input.tenantId && o.consumer === input.consumer && o.stream === input.stream,
  )!;
  void persistNatsConsumerOffset(store.dbPool, offset);
}
