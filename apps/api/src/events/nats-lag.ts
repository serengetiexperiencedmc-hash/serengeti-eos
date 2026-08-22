import { authorize, type Principal } from "@sedmc/kernel";
import { connect } from "nats";
import type { Store } from "../store.js";
import { createNatsTransportFromEnv } from "./nats-transport.js";
import { DEFAULT_EVENT_CONSUMER } from "./consumer.js";
import { getEventTransport } from "../outbox.js";

export type NatsLagMetrics = {
  increment: "I4.5";
  asOf: string;
  natsConfigured: boolean;
  stream: {
    name: string;
    lastSeq: number;
    messageCount: number;
    firstSeq: number;
    bytes: number;
  } | null;
  durableConsumer: {
    durableName: string;
    logicalConsumer: string;
    numPending: number;
    numAckPending: number;
    ackFloorStreamSeq: number | null;
    deliveredStreamSeq: number | null;
    brokerLag: number | null;
  } | null;
  transport: { ok: boolean; detail: string };
  offsets: Array<{
    tenantId: string;
    consumer: string;
    stream: string;
    lastStreamSeq: number;
    lastEventId?: string;
    updatedAt: string;
    stalenessMs: number;
  }>;
  summary: {
    tenantsTracked: number;
    maxStalenessMs: number;
    brokerLag: number | null;
    status: "ok" | "degraded" | "unavailable";
  };
};

function lagStatus(brokerLag: number | null, maxStalenessMs: number): NatsLagMetrics["summary"]["status"] {
  if (brokerLag === null) return "unavailable";
  if (brokerLag > 1000 || maxStalenessMs > 15 * 60 * 1000) return "degraded";
  return "ok";
}

export async function getNatsConsumerLagMetrics(
  store: Store,
  principal: Principal,
  input: { stream?: string } = {},
): Promise<{ ok: true; metrics: NatsLagMetrics } | { ok: false; reason: string }> {
  const decision = authorize({
    principal,
    permission: "events:read:operations",
    action: "read:nats_lag",
  });
  if (decision.result === "deny") return { ok: false, reason: decision.reason };

  const asOf = new Date().toISOString();
  const nowMs = Date.now();
  const opts = createNatsTransportFromEnv();
  const transportHealth = await getEventTransport(store).health();

  const offsets = (store.natsConsumerOffsets ?? [])
    .filter((o) => o.tenantId === principal.tenantId)
    .map((o) => ({
      tenantId: o.tenantId,
      consumer: o.consumer,
      stream: o.stream,
      lastStreamSeq: o.lastStreamSeq,
      ...(o.lastEventId ? { lastEventId: o.lastEventId } : {}),
      updatedAt: o.updatedAt,
      stalenessMs: Math.max(0, nowMs - Date.parse(o.updatedAt)),
    }));

  const maxStalenessMs = offsets.reduce((max, o) => Math.max(max, o.stalenessMs), 0);

  if (!opts) {
    const metrics: NatsLagMetrics = {
      increment: "I4.5",
      asOf,
      natsConfigured: false,
      stream: null,
      durableConsumer: null,
      transport: transportHealth,
      offsets,
      summary: {
        tenantsTracked: offsets.length,
        maxStalenessMs,
        brokerLag: null,
        status: "unavailable",
      },
    };
    return { ok: true, metrics };
  }

  const stream = input.stream ?? opts.stream;
  const durableName = process.env.EOS_NATS_CONSUMER ?? "EOS_PLATFORM_OBSERVER";
  const nc = await connect({ servers: opts.url });
  try {
    const jsm = await nc.jetstreamManager();
    const streamInfo = await jsm.streams.info(stream);
    let consumerInfo: Awaited<ReturnType<typeof jsm.consumers.info>> | null = null;
    try {
      consumerInfo = await jsm.consumers.info(stream, durableName);
    } catch {
      consumerInfo = null;
    }

    const lastSeq = streamInfo.state.last_seq;
    const ackFloor = consumerInfo?.ack_floor.stream_seq ?? null;
    const brokerLag = ackFloor != null && lastSeq >= ackFloor ? lastSeq - ackFloor : null;

    const metrics: NatsLagMetrics = {
      increment: "I4.5",
      asOf,
      natsConfigured: true,
      stream: {
        name: stream,
        lastSeq,
        messageCount: streamInfo.state.messages,
        firstSeq: streamInfo.state.first_seq,
        bytes: streamInfo.state.bytes,
      },
      durableConsumer: consumerInfo
        ? {
            durableName,
            logicalConsumer: DEFAULT_EVENT_CONSUMER,
            numPending: consumerInfo.num_pending,
            numAckPending: consumerInfo.num_ack_pending,
            ackFloorStreamSeq: ackFloor,
            deliveredStreamSeq: consumerInfo.delivered.stream_seq ?? null,
            brokerLag,
          }
        : null,
      transport: transportHealth,
      offsets,
      summary: {
        tenantsTracked: offsets.length,
        maxStalenessMs,
        brokerLag,
        status: lagStatus(brokerLag, maxStalenessMs),
      },
    };
    return { ok: true, metrics };
  } finally {
    await nc.drain();
    await nc.close();
  }
}
