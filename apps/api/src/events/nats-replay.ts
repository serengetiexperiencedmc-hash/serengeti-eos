import { authorize, type NatsConsumerOffset, type Principal } from "@sedmc/kernel";
import { connect, StringCodec } from "nats";
import type { Store } from "../store.js";
import { createNatsTransportFromEnv } from "./nats-transport.js";
import { DEFAULT_EVENT_CONSUMER, processEventEnvelope } from "./consumer.js";
import { recordNatsConsumerOffset } from "../persistence/nats-offsets.js";

export function listNatsConsumerOffsets(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "events:read:operations",
    action: "read:nats_offsets",
  });
  if (decision.result === "deny") return { ok: false as const, reason: decision.reason };

  const items = (store.natsConsumerOffsets ?? []).filter((o) => o.tenantId === principal.tenantId);
  return { ok: true as const, items };
}

export async function replayNatsStreamFromSeq(
  store: Store,
  principal: Principal,
  input: {
    stream?: string;
    consumer?: string;
    fromSeq: number;
    maxMessages?: number;
    force?: boolean;
  },
): Promise<
  | { ok: true; processed: number; skipped: number; results: Array<{ seq: number; eventId: string; processed: boolean }> }
  | { ok: false; reason: string }
> {
  const decision = authorize({
    principal,
    permission: "events:consume:outbox",
    action: "replay:nats_stream",
  });
  if (decision.result === "deny") return { ok: false, reason: decision.reason };

  const opts = createNatsTransportFromEnv();
  if (!opts) return { ok: false, reason: "nats_not_configured" };

  const stream = input.stream ?? opts.stream;
  const consumer = input.consumer ?? DEFAULT_EVENT_CONSUMER;
  const maxMessages = Math.min(Math.max(input.maxMessages ?? 25, 1), 200);
  const sc = StringCodec();

  const nc = await connect({ servers: opts.url });
  try {
    const js = nc.jetstream();
    const jsm = await nc.jetstreamManager();
    const info = await jsm.streams.info(stream);
    const lastSeq = info.state.last_seq;
    const results: Array<{ seq: number; eventId: string; processed: boolean }> = [];
    let processed = 0;
    let skipped = 0;

    for (let seq = input.fromSeq; seq <= lastSeq && results.length < maxMessages; seq++) {
      let stored;
      try {
        stored = await js.getMessage(stream, { seq });
      } catch {
        continue;
      }
      const envelope = JSON.parse(sc.decode(stored.data));
      const prior = store.processedEvents.find(
        (p) =>
          p.tenantId === principal.tenantId &&
          p.consumer === consumer &&
          p.eventId === envelope.eventId,
      );
      if (prior && !input.force) {
        skipped += 1;
        results.push({ seq, eventId: envelope.eventId, processed: false });
        continue;
      }
      if (prior && input.force) {
        const idx = store.processedEvents.indexOf(prior);
        if (idx >= 0) store.processedEvents.splice(idx, 1);
      }
      const result = processEventEnvelope(store, envelope, consumer);
      if (result.processed) processed += 1;
      else skipped += 1;
      results.push({ seq, eventId: envelope.eventId, processed: result.processed });
      recordNatsConsumerOffset(store, {
        tenantId: envelope.tenantId,
        consumer,
        stream,
        streamSeq: seq,
        eventId: envelope.eventId,
      });
    }

    return { ok: true, processed, skipped, results };
  } finally {
    await nc.drain();
    await nc.close();
  }
}

export function getStoredNatsOffset(
  store: Store,
  tenantId: string,
  consumer: string,
  stream: string,
): NatsConsumerOffset | undefined {
  return store.natsConsumerOffsets?.find(
    (o) => o.tenantId === tenantId && o.consumer === consumer && o.stream === stream,
  );
}
