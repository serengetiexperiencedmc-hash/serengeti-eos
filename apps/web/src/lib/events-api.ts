import { eosFetch } from "./eos-client";

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

export async function getNatsConsumerLag(token: string) {
  return eosFetch<NatsLagMetrics>("/v1/events/consumers/nats/lag", { token });
}

export async function listNatsConsumerOffsets(token: string) {
  return eosFetch<{ items: NatsLagMetrics["offsets"]; increment: string }>(
    "/v1/events/consumers/nats/offsets",
    { token },
  );
}
