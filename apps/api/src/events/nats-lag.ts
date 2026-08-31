import { authorize, type Principal } from "@sedmc/kernel";
import { connect, StringCodec, type JetStreamManager } from "nats";
import type { Store } from "../store.js";
import {
  buildNatsTenantFilterSubject,
  createNatsTransportFromEnv,
  parseTenantIdFromNatsSubject,
  tenantDurableConsumerName,
} from "./nats-transport.js";
import { DEFAULT_EVENT_CONSUMER } from "./consumer.js";
import { getEventTransport } from "../outbox.js";

const TENANT_SCAN_LIMIT = 50;

export type NatsLagMetrics = {
  increment: "I4.7";
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
  tenantFilter: {
    subject: string;
    durableName: string;
    numPending: number | null;
    brokerLag: number | null;
  } | null;
  transport: { ok: boolean; detail: string };
  tenantIndex: {
    scanned: number;
    tenantMessages: number;
    otherTenantMessages: number;
  } | null;
  offsets: Array<{
    tenantId: string;
    consumer: string;
    stream: string;
    lastStreamSeq: number;
    lastEventId?: string;
    updatedAt: string;
    stalenessMs: number;
    streamHeadSeq: number | null;
    tenantStreamLag: number | null;
  }>;
  summary: {
    tenantsTracked: number;
    maxStalenessMs: number;
    maxTenantStreamLag: number | null;
    brokerLag: number | null;
    tenantBrokerLag: number | null;
    status: "ok" | "degraded" | "unavailable";
  };
};

function lagStatus(
  brokerLag: number | null,
  maxStalenessMs: number,
  maxTenantStreamLag: number | null,
  tenantBrokerLag: number | null,
): NatsLagMetrics["summary"]["status"] {
  if (brokerLag === null && maxTenantStreamLag === null && tenantBrokerLag === null) return "unavailable";
  if (
    (brokerLag ?? 0) > 1000 ||
    maxStalenessMs > 15 * 60 * 1000 ||
    (maxTenantStreamLag ?? 0) > 500 ||
    (tenantBrokerLag ?? 0) > 500
  ) {
    return "degraded";
  }
  return "ok";
}

async function scanTenantMessageIndex(
  jsm: JetStreamManager,
  stream: string,
  tenantId: string,
  lastSeq: number,
  firstSeq: number,
  subjectPrefix: string,
): Promise<NatsLagMetrics["tenantIndex"]> {
  const sc = StringCodec();
  const startSeq = Math.max(firstSeq, lastSeq - TENANT_SCAN_LIMIT + 1);
  let tenantMessages = 0;
  let otherTenantMessages = 0;
  let scanned = 0;

  for (let seq = startSeq; seq <= lastSeq; seq++) {
    try {
      const stored = await jsm.streams.getMessage(stream, { seq });
      scanned += 1;
      const subjectTenant = parseTenantIdFromNatsSubject(stored.subject, subjectPrefix);
      if (subjectTenant) {
        if (subjectTenant === tenantId) tenantMessages += 1;
        else otherTenantMessages += 1;
        continue;
      }
      const envelope = JSON.parse(sc.decode(stored.data)) as { tenantId?: string };
      if (envelope.tenantId === tenantId) tenantMessages += 1;
      else otherTenantMessages += 1;
    } catch {
      // Skip gaps in sequence.
    }
  }

  return { scanned, tenantMessages, otherTenantMessages };
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
  const tenantFilterSubject = opts
    ? buildNatsTenantFilterSubject(opts.subjectPrefix, principal.tenantId)
    : `eos.events.${principal.tenantId}.>`;
  const tenantDurable = tenantDurableConsumerName(principal.tenantId);

  const baseOffsets = (store.natsConsumerOffsets ?? []).filter((o) => o.tenantId === principal.tenantId);

  if (!opts) {
    const offsets = baseOffsets.map((o) => ({
      tenantId: o.tenantId,
      consumer: o.consumer,
      stream: o.stream,
      lastStreamSeq: o.lastStreamSeq,
      ...(o.lastEventId ? { lastEventId: o.lastEventId } : {}),
      updatedAt: o.updatedAt,
      stalenessMs: Math.max(0, nowMs - Date.parse(o.updatedAt)),
      streamHeadSeq: null,
      tenantStreamLag: null,
    }));
    const maxStalenessMs = offsets.reduce((max, o) => Math.max(max, o.stalenessMs), 0);

    return {
      ok: true,
      metrics: {
        increment: "I4.7",
        asOf,
        natsConfigured: false,
        stream: null,
        durableConsumer: null,
        tenantFilter: {
          subject: tenantFilterSubject,
          durableName: tenantDurable,
          numPending: null,
          brokerLag: null,
        },
        transport: transportHealth,
        tenantIndex: null,
        offsets,
        summary: {
          tenantsTracked: offsets.length,
          maxStalenessMs,
          maxTenantStreamLag: null,
          brokerLag: null,
          tenantBrokerLag: null,
          status: "unavailable",
        },
      },
    };
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

    let tenantConsumerInfo: Awaited<ReturnType<typeof jsm.consumers.info>> | null = null;
    try {
      tenantConsumerInfo = await jsm.consumers.info(stream, tenantDurable);
    } catch {
      tenantConsumerInfo = null;
    }

    const lastSeq = streamInfo.state.last_seq;
    const firstSeq = streamInfo.state.first_seq;
    const ackFloor = consumerInfo?.ack_floor.stream_seq ?? null;
    const brokerLag = ackFloor != null && lastSeq >= ackFloor ? lastSeq - ackFloor : null;
    const tenantAckFloor = tenantConsumerInfo?.ack_floor.stream_seq ?? null;
    const tenantBrokerLag =
      tenantAckFloor != null && lastSeq >= tenantAckFloor ? lastSeq - tenantAckFloor : null;

    const offsets = baseOffsets.map((o) => {
      const tenantStreamLag = lastSeq >= o.lastStreamSeq ? lastSeq - o.lastStreamSeq : null;
      return {
        tenantId: o.tenantId,
        consumer: o.consumer,
        stream: o.stream,
        lastStreamSeq: o.lastStreamSeq,
        ...(o.lastEventId ? { lastEventId: o.lastEventId } : {}),
        updatedAt: o.updatedAt,
        stalenessMs: Math.max(0, nowMs - Date.parse(o.updatedAt)),
        streamHeadSeq: lastSeq,
        tenantStreamLag,
      };
    });

    const maxStalenessMs = offsets.reduce((max, o) => Math.max(max, o.stalenessMs), 0);
    const maxTenantStreamLag = offsets.reduce<number | null>((max, o) => {
      if (o.tenantStreamLag === null) return max;
      return max === null ? o.tenantStreamLag : Math.max(max, o.tenantStreamLag);
    }, null);

    let tenantIndex: NatsLagMetrics["tenantIndex"] = null;
    if (lastSeq > 0) {
      tenantIndex = await scanTenantMessageIndex(
        jsm,
        stream,
        principal.tenantId,
        lastSeq,
        firstSeq,
        opts.subjectPrefix,
      );
    }

    return {
      ok: true,
      metrics: {
        increment: "I4.7",
        asOf,
        natsConfigured: true,
        stream: {
          name: stream,
          lastSeq,
          messageCount: streamInfo.state.messages,
          firstSeq,
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
        tenantFilter: {
          subject: tenantFilterSubject,
          durableName: tenantDurable,
          numPending: tenantConsumerInfo?.num_pending ?? null,
          brokerLag: tenantBrokerLag,
        },
        transport: transportHealth,
        tenantIndex,
        offsets,
        summary: {
          tenantsTracked: offsets.length,
          maxStalenessMs,
          maxTenantStreamLag,
          brokerLag,
          tenantBrokerLag,
          status: lagStatus(brokerLag, maxStalenessMs, maxTenantStreamLag, tenantBrokerLag),
        },
      },
    };
  } finally {
    await nc.drain();
    await nc.close();
  }
}
