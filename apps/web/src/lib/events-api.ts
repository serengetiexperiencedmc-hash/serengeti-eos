import { eosFetch } from "./eos-client";

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

export async function getNatsConsumerLag(token: string) {
  return eosFetch<NatsLagMetrics>("/v1/events/consumers/nats/lag", { token });
}

export async function listNatsConsumerOffsets(token: string) {
  return eosFetch<{ items: NatsLagMetrics["offsets"]; increment: string }>(
    "/v1/events/consumers/nats/offsets",
    { token },
  );
}
