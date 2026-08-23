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

export type DeadLetterItem = {
  id: string;
  outboxId: string;
  eventType: string;
  eventId: string;
  failureReason: string;
  consumer: string;
  attempts: number;
  status: string;
  lastFailureAt: string;
  firstFailureAt?: string;
  replayStatus?: string;
  owner?: string;
  remediation?: string;
  ageHours?: number;
  slaBreached?: boolean;
  slaAcknowledgedAt?: string;
  slaSnoozeUntil?: string;
};

export async function listDeadLetters(
  token: string,
  query: {
    owner?: string;
    status?: string;
    unassigned?: boolean;
    minAgeHours?: number;
    slaBreached?: boolean;
    slaHours?: number;
  } = {},
) {
  const params = new URLSearchParams();
  if (query.owner) params.set("owner", query.owner);
  if (query.status) params.set("status", query.status);
  if (query.unassigned) params.set("unassigned", "1");
  if (query.minAgeHours !== undefined) params.set("minAgeHours", String(query.minAgeHours));
  if (query.slaBreached) params.set("slaBreached", "1");
  if (query.slaHours !== undefined) params.set("slaHours", String(query.slaHours));
  const qs = params.toString();
  return eosFetch<{
    items: DeadLetterItem[];
    owners: string[];
    sla: { thresholdHours: number; breachedCount: number; openCount: number };
    increment: string;
  }>(`/v1/events/dlq${qs ? `?${qs}` : ""}`, { token });
}

export async function assignDeadLetterOwner(token: string, id: string, owner: string | null) {
  return eosFetch<{ ok: true; deadLetter: DeadLetterItem; increment: string }>(`/v1/events/dlq/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify({ owner }),
  });
}

export async function bulkAssignDeadLetterOwners(
  token: string,
  input: { ids: string[]; owner: string | null },
) {
  return eosFetch<{ ok: true; updated: number; notFound: string[]; increment: string }>(
    "/v1/events/dlq/assign",
    { token, method: "POST", body: JSON.stringify(input) },
  );
}

export async function updateDeadLetterRemediation(
  token: string,
  id: string,
  input: { status: string; owner?: string | null; remediation?: string | null },
) {
  return eosFetch<{ ok: true; deadLetter: DeadLetterItem; increment: string }>(`/v1/events/dlq/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function acknowledgeDeadLetterSla(token: string, id: string) {
  return eosFetch<{ ok: true; deadLetter: DeadLetterItem; increment: string }>(
    `/v1/events/dlq/${id}/sla-acknowledge`,
    { token, method: "POST", body: "{}" },
  );
}

export async function snoozeDeadLetterSla(token: string, id: string, input: { hours?: number; until?: string } = { hours: 24 }) {
  return eosFetch<{ ok: true; deadLetter: DeadLetterItem; increment: string }>(
    `/v1/events/dlq/${id}/sla-snooze`,
    { token, method: "POST", body: JSON.stringify(input) },
  );
}

export async function clearDeadLetterSlaSuppression(token: string, id: string) {
  return eosFetch<{ ok: true; deadLetter: DeadLetterItem; increment: string }>(
    `/v1/events/dlq/${id}/sla-clear`,
    { token, method: "POST", body: "{}" },
  );
}

export async function requestEventReplay(
  token: string,
  input: {
    reason: string;
    intent: "reconstruction" | "reexecute";
    deadLetterIds: string[];
    targetConsumer?: string;
  },
) {
  return eosFetch<{ id: string; status: string; increment: string }>("/v1/events/replay/request", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function executeEventReplay(token: string, requestId: string) {
  return eosFetch<{ ok: true; replayed: number; increment: string }>(
    `/v1/events/replay/${requestId}/execute`,
    { token, method: "POST", body: "{}" },
  );
}

export type DlqSlaDigestLastRun = {
  tenantId: string;
  day: string;
  lastRunAt: string;
  lastRunByPrincipalId: string;
  breachedCount: number;
  dispatchedCount: number;
  skippedCount: number;
  recipientCount: number;
};

export type DigestFreshness = {
  stale: boolean;
  neverRun: boolean;
  ageHours: number | null;
  thresholdHours: number;
};

export async function getDlqSlaDigestStatus(token: string) {
  return eosFetch<{
    lastRun: DlqSlaDigestLastRun | null;
    analytics: { outboxDigestCount: number; outboxByStatus: Record<string, number> };
    freshness: DigestFreshness;
    increment: string;
  }>("/v1/notifications/email/dlq-sla-digest-status", { token });
}

export async function exportDlqSlaDigestLastRun(token: string, format: "json" | "csv" = "json") {
  return eosFetch<{
    format: "json" | "csv";
    lastRun: DlqSlaDigestLastRun | null;
    analytics: { outboxDigestCount: number; outboxByStatus: Record<string, number> };
    csv?: string;
    generatedAt: string;
    increment: string;
  }>(`/v1/notifications/email/dlq-sla-digest-status/export?format=${format}`, { token });
}

export async function dispatchDlqSlaDigest(token: string) {
  return eosFetch<{
    dispatched: string[];
    skipped: { key: string; reason?: string }[];
    lastRun?: DlqSlaDigestLastRun;
    increment: string;
  }>("/v1/notifications/email/dispatch-dlq-sla-digest", { token, method: "POST", body: "{}" });
}
