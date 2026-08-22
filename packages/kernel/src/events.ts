import { newId } from "./crypto.js";
import type { ActorType, Classification } from "./types.js";

export type EnterpriseEventEnvelope = {
  eventId: string;
  eventType: string;
  schemaVersion: number;
  aggregateId?: string;
  tenantId: string;
  producer: string;
  actor?: { type: ActorType; principalId: string };
  occurredAt: string;
  correlationId: string;
  causationId?: string;
  classification: Classification;
  payload: Record<string, unknown>;
  eventVersion: number;
};

export type OutboxRecord = {
  id: string;
  tenantId: string;
  eventType: string;
  envelope: EnterpriseEventEnvelope;
  classification: Classification;
  createdAt: string;
  publishedAt?: string;
  attempts: number;
  lastError?: string;
  status: "pending" | "published" | "dead_letter";
  /** Monotonic sequence per ordering key (aggregate) within tenant */
  sequence?: number;
};

export type DlqLifecycleStatus =
  | "failed"
  | "investigating"
  | "corrected"
  | "replay_approved"
  | "replayed"
  | "resolved"
  | "permanently_rejected"
  | "closed";

export type DeadLetterRecord = {
  id: string;
  outboxId: string;
  tenantId: string;
  eventType: string;
  eventId: string;
  failureReason: string;
  consumer: string;
  attempts: number;
  firstFailureAt: string;
  lastFailureAt: string;
  status: DlqLifecycleStatus;
  owner?: string;
  remediation?: string;
  replayStatus?: "none" | "pending" | "approved" | "replayed" | "rejected";
  /** I4.15 — suppress SLA escalation until cleared or snooze expires. */
  slaAcknowledgedAt?: string;
  slaAcknowledgedByPrincipalId?: string;
  slaSnoozeUntil?: string;
};

export type EventCatalogueEntry = {
  eventType: string;
  owner: string;
  purpose: string;
  schemaVersion: number;
  classification: Classification;
  producer: string;
  consumers: string[];
  retentionDays: number;
  compatibility: "backward" | "forward" | "none";
  lifecycle: "draft" | "active" | "deprecated" | "retired";
  orderingKey?: "aggregateId" | "tenantId" | "none";
  requiredFields?: Array<{ name: string; type: string; description?: string }>;
  optionalFields?: Array<{ name: string; type: string; description?: string }>;
  forbiddenPayloadKeys?: string[];
  maxPayloadBytes?: number;
  sensitiveDataPolicy?: "reference_only" | "minimal_embedded" | "restricted_embedded";
};

export type ReplayRequest = {
  id: string;
  tenantId: string;
  requestedByPrincipalId: string;
  reason: string;
  intent: "reconstruction" | "reexecute";
  deadLetterIds: string[];
  targetConsumer?: string;
  status: "pending" | "approved" | "executed" | "rejected";
  createdAt: string;
  executedAt?: string;
  correlationId: string;
};

export type EventOperationsMetrics = {
  eventsCommitted: number;
  eventsPublished: number;
  publisherFailures: number;
  consumerFailures: number;
  retries: number;
  dlqCount: number;
  replays: number;
  schemaErrors: number;
  authorizationFailures: number;
  oldestPendingOutboxAt?: string;
};

export type ProcessedEventKey = {
  tenantId: string;
  consumer: string;
  eventId: string;
  processedAt: string;
};

export type NatsConsumerOffset = {
  tenantId: string;
  consumer: string;
  stream: string;
  lastStreamSeq: number;
  lastEventId?: string;
  updatedAt: string;
};

export function buildEnvelope(input: {
  eventType: string;
  tenantId: string;
  producer: string;
  correlationId: string;
  classification: Classification;
  payload: Record<string, unknown>;
  actor?: { type: ActorType; principalId: string };
  aggregateId?: string;
  causationId?: string;
  schemaVersion?: number;
  eventVersion?: number;
}): EnterpriseEventEnvelope {
  return {
    eventId: newId(),
    eventType: input.eventType,
    schemaVersion: input.schemaVersion ?? 1,
    ...(input.aggregateId !== undefined ? { aggregateId: input.aggregateId } : {}),
    tenantId: input.tenantId,
    producer: input.producer,
    ...(input.actor !== undefined ? { actor: input.actor } : {}),
    occurredAt: new Date().toISOString(),
    correlationId: input.correlationId,
    ...(input.causationId !== undefined ? { causationId: input.causationId } : {}),
    classification: input.classification,
    payload: input.payload,
    eventVersion: input.eventVersion ?? 1,
  };
}

export function createOutboxRecord(envelope: EnterpriseEventEnvelope): OutboxRecord {
  return {
    id: newId(),
    tenantId: envelope.tenantId,
    eventType: envelope.eventType,
    envelope,
    classification: envelope.classification,
    createdAt: envelope.occurredAt,
    attempts: 0,
    status: "pending",
  };
}
