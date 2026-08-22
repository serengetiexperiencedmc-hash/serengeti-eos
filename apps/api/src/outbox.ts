import {
  assertLiveAllowed,
  assertSchemaCompatibility,
  authorize,
  buildEnvelope,
  createOutboxRecord,
  newId,
  validateEnvelopeSchema,
  type DeadLetterRecord,
  type DlqLifecycleStatus,
  type EnterpriseEventEnvelope,
  type EventCatalogueEntry,
  type EventOperationsMetrics,
  type EventTransport,
  type ExecutionContext,
  type OutboxRecord,
  type Principal,
  type ProcessedEventKey,
  type ReplayRequest,
} from "@sedmc/kernel";
import { recordAudit, type Store } from "./store.js";
import { persistOutboxInsert, persistOutboxPublish } from "./persistence/outbox.js";
import { persistProcessedEvent, removeProcessedEvent } from "./persistence/processed-events.js";
import { resolveEventTransport } from "./events/transport-init.js";
import { getEventHandler } from "./events/handlers.js";

export type PublisherFailurePoint =
  | "before_read"
  | "after_read"
  | "before_publish"
  | "after_publish_before_mark"
  | "during_retry"
  | "during_shutdown";

export function ensureOutboxCollections(store: Store): void {
  if (!store.outboxEvents) store.outboxEvents = [];
  if (!store.deadLetters) store.deadLetters = [];
  if (!store.processedEvents) store.processedEvents = [];
  if (!store.eventCatalogue) store.eventCatalogue = [];
  if (!store.publishedBus) store.publishedBus = [];
  if (!store.replayRequests) store.replayRequests = [];
  if (!store.eventMetrics) {
    store.eventMetrics = {
      eventsCommitted: 0,
      eventsPublished: 0,
      publisherFailures: 0,
      consumerFailures: 0,
      retries: 0,
      dlqCount: 0,
      replays: 0,
      schemaErrors: 0,
      authorizationFailures: 0,
    };
  }
  if (!store.aggregateSequences) store.aggregateSequences = new Map();
}

export function getEventTransport(store: Store, opts?: { allowDuplicateRepublish?: boolean }): EventTransport {
  return resolveEventTransport(store, opts);
}

function catalogueToSchema(entry: EventCatalogueEntry) {
  return {
    eventType: entry.eventType,
    schemaVersion: entry.schemaVersion,
    owner: entry.owner,
    purpose: entry.purpose,
    producer: entry.producer,
    consumers: entry.consumers,
    classification: entry.classification,
    retentionDays: entry.retentionDays,
    compatibility: entry.compatibility,
    lifecycle: entry.lifecycle,
    orderingKey: entry.orderingKey ?? "none",
    requiredFields: (entry.requiredFields ?? []).map((f) => ({
      name: f.name,
      type: f.type as "string" | "number" | "boolean" | "object" | "array",
      ...(f.description !== undefined ? { description: f.description } : {}),
    })),
    optionalFields: (entry.optionalFields ?? []).map((f) => ({
      name: f.name,
      type: f.type as "string" | "number" | "boolean" | "object" | "array",
      ...(f.description !== undefined ? { description: f.description } : {}),
    })),
    forbiddenPayloadKeys: entry.forbiddenPayloadKeys ?? [],
    maxPayloadBytes: entry.maxPayloadBytes ?? 65536,
    sensitiveDataPolicy: entry.sensitiveDataPolicy ?? "reference_only",
  };
}

export function registerEventType(
  store: Store,
  principal: Principal,
  entry: EventCatalogueEntry,
  correlationId: string,
): { ok: true; entry: EventCatalogueEntry } | { ok: false; reason: string } {
  ensureOutboxCollections(store);
  const decision = authorize({
    principal,
    permission: "events:register:catalogue",
    action: "register:event_schema",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: decision.reason };
  }
  const existing = store.eventCatalogue.find((e) => e.eventType === entry.eventType);
  if (existing && entry.schemaVersion > existing.schemaVersion) {
    const compat = assertSchemaCompatibility(catalogueToSchema(existing), catalogueToSchema(entry));
    if (!compat.ok) return { ok: false, reason: compat.reason };
  }
  const idx = store.eventCatalogue.findIndex((e) => e.eventType === entry.eventType);
  if (idx >= 0) store.eventCatalogue[idx] = entry;
  else store.eventCatalogue.push(entry);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "events:register:catalogue",
    resourceType: "event_schema",
    resourceId: entry.eventType,
    correlationId,
    authorization: "allow",
    newState: { schemaVersion: entry.schemaVersion, lifecycle: entry.lifecycle },
  });
  return { ok: true, entry };
}

function bumpMetric(store: Store, key: keyof EventOperationsMetrics, delta = 1): void {
  ensureOutboxCollections(store);
  const m = store.eventMetrics;
  if (key === "oldestPendingOutboxAt") return;
  (m[key] as number) += delta;
}

export function assertProducerAuthorized(
  store: Store,
  principal: Principal,
  eventType: string,
  envelopeTenantId?: string,
): { ok: true } | { ok: false; reason: string } {
  if (envelopeTenantId !== undefined && envelopeTenantId !== principal.tenantId) {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: "tenant_cross_publish" };
  }
  const entry = store.eventCatalogue.find((e) => e.eventType === eventType && e.lifecycle === "active");
  if (!entry) {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: "event_type_not_registered" };
  }
  const decision = authorize({
    principal,
    permission: "events:publish:outbox",
    action: "publish:event",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: decision.reason };
  }
  return { ok: true };
}

export function assertConsumerAuthorized(
  store: Store,
  principal: Principal,
  eventType: string,
  consumer: string,
): { ok: true } | { ok: false; reason: string } {
  const entry = store.eventCatalogue.find((e) => e.eventType === eventType && e.lifecycle === "active");
  if (!entry) {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: "event_type_not_registered" };
  }
  if (!entry.consumers.includes(consumer)) {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: "consumer_not_authorized" };
  }
  const decision = authorize({
    principal,
    permission: "events:consume:outbox",
    action: "consume:event",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: decision.reason };
  }
  return { ok: true };
}

function assignSequence(store: Store, entry: EventCatalogueEntry, envelope: EnterpriseEventEnvelope): number | undefined {
  if (entry.orderingKey === "none" || !entry.orderingKey) return undefined;
  const key =
    entry.orderingKey === "aggregateId"
      ? `${envelope.tenantId}:${envelope.aggregateId ?? "none"}`
      : envelope.tenantId;
  const next = (store.aggregateSequences.get(key) ?? 0) + 1;
  store.aggregateSequences.set(key, next);
  return next;
}

export function commitWithOutbox(
  store: Store,
  principal: Principal,
  input: {
    eventType: string;
    payload: Record<string, unknown>;
    classification: EnterpriseEventEnvelope["classification"];
    correlationId: string;
    aggregateId?: string;
    causationId?: string;
    mutate: () => void;
    /** Test hook: simulate outbox persistence failure after domain mutate */
    simulateOutboxWriteFailure?: boolean;
  },
  mode: ExecutionContext["mode"] = "LIVE",
): { ok: true; outbox: OutboxRecord; envelope: EnterpriseEventEnvelope } | { ok: false; reason: string } {
  ensureOutboxCollections(store);
  try {
    assertLiveAllowed(
      { mode, correlationId: input.correlationId, actorPrincipalId: principal.id },
      "commitWithOutbox",
    );
  } catch {
    return { ok: false, reason: "simulation_cannot_publish" };
  }

  const authz = assertProducerAuthorized(store, principal, input.eventType);
  if (!authz.ok) return { ok: false, reason: authz.reason };

  const entry = store.eventCatalogue.find((e) => e.eventType === input.eventType)!;
  const envelope = buildEnvelope({
    eventType: input.eventType,
    tenantId: principal.tenantId,
    producer: entry.producer,
    correlationId: input.correlationId,
    classification: input.classification,
    payload: input.payload,
    actor: { type: principal.actorType, principalId: principal.id },
    ...(input.aggregateId !== undefined ? { aggregateId: input.aggregateId } : {}),
    ...(input.causationId !== undefined ? { causationId: input.causationId } : {}),
    schemaVersion: entry.schemaVersion,
  });

  const schemaCheck = validateEnvelopeSchema(catalogueToSchema(entry), envelope);
  if (!schemaCheck.ok) {
    bumpMetric(store, "schemaErrors");
    return { ok: false, reason: schemaCheck.reason };
  }

  const outbox = createOutboxRecord(envelope);
  const sequence = assignSequence(store, entry, envelope);
  if (sequence !== undefined) outbox.sequence = sequence;

  const domainSnapshot = snapshotDomain(store);
  const outboxLen = store.outboxEvents.length;
  try {
    input.mutate();
    if (input.simulateOutboxWriteFailure) {
      throw new Error("outbox_write_failed");
    }
    store.outboxEvents.push(outbox);
    void persistOutboxInsert(store.dbPool, outbox);
  } catch (err) {
    restoreDomain(store, domainSnapshot);
    store.outboxEvents.length = outboxLen;
    return { ok: false, reason: err instanceof Error ? err.message : "tx_failed" };
  }

  bumpMetric(store, "eventsCommitted");
  const pending = store.outboxEvents.filter((r) => r.status === "pending");
  if (pending.length > 0) {
    store.eventMetrics.oldestPendingOutboxAt = pending.reduce((oldest, r) =>
      r.createdAt < oldest ? r.createdAt : oldest,
    pending[0]!.createdAt);
  }

  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "events:outbox:write",
    resourceType: "outbox_event",
    resourceId: outbox.id,
    correlationId: input.correlationId,
    authorization: "allow",
    newState: {
      eventId: envelope.eventId,
      eventType: envelope.eventType,
      status: outbox.status,
      sequence: outbox.sequence,
      mode: "LIVE",
    },
  });
  return { ok: true, outbox, envelope };
}

function snapshotDomain(store: Store) {
  return {
    workflowInstances: store.workflowInstances ? [...store.workflowInstances] : [],
    workflowTasks: store.workflowTasks ? [...store.workflowTasks] : [],
    payments: new Map(store.payments),
  };
}

function restoreDomain(
  store: Store,
  snap: {
    workflowInstances: typeof store.workflowInstances;
    workflowTasks: typeof store.workflowTasks;
    payments: typeof store.payments;
  },
) {
  if (store.workflowInstances)
    store.workflowInstances.splice(0, store.workflowInstances.length, ...snap.workflowInstances);
  if (store.workflowTasks) store.workflowTasks.splice(0, store.workflowTasks.length, ...snap.workflowTasks);
  store.payments.clear();
  for (const [k, v] of snap.payments) store.payments.set(k, v);
}

export type PublishResult = {
  published: number;
  deadLettered: number;
  remaining: number;
  crashed?: boolean;
  crashPoint?: PublisherFailurePoint;
};

export type PublishOptions = {
  maxAttempts?: number;
  failEventIds?: Set<string>;
  transport?: EventTransport;
  injectFailure?: { at: PublisherFailurePoint; eventId?: string };
  allowDuplicateRepublish?: boolean;
};

/**
 * Publisher drains pending outbox via EventTransport abstraction.
 * In-memory-dev is a Development/Test stand-in — not Production transport.
 */
export function publishPendingOutbox(store: Store, opts: PublishOptions = {}): PublishResult {
  ensureOutboxCollections(store);
  const maxAttempts = opts.maxAttempts ?? 3;
  const transport = opts.transport ?? getEventTransport(store, {
    ...(opts.allowDuplicateRepublish !== undefined
      ? { allowDuplicateRepublish: opts.allowDuplicateRepublish }
      : {}),
  });
  let published = 0;
  let deadLettered = 0;

  if (opts.injectFailure?.at === "before_read") {
    bumpMetric(store, "publisherFailures");
    return { published: 0, deadLettered: 0, remaining: pendingCount(store), crashed: true, crashPoint: "before_read" };
  }

  const pending = store.outboxEvents.filter((r) => r.status === "pending");
  if (opts.injectFailure?.at === "after_read") {
    bumpMetric(store, "publisherFailures");
    return {
      published: 0,
      deadLettered: 0,
      remaining: pending.length,
      crashed: true,
      crashPoint: "after_read",
    };
  }

  for (const row of pending) {
    if (opts.injectFailure?.at === "during_shutdown") {
      bumpMetric(store, "publisherFailures");
      return {
        published,
        deadLettered,
        remaining: pendingCount(store),
        crashed: true,
        crashPoint: "during_shutdown",
      };
    }

    row.attempts += 1;
    if (row.attempts > 1) bumpMetric(store, "retries");

    const shouldFailTransport = opts.failEventIds?.has(row.envelope.eventId);
    const failBefore =
      opts.injectFailure?.at === "before_publish" && opts.injectFailure.eventId === row.envelope.eventId;
    const failAfterMark =
      opts.injectFailure?.at === "after_publish_before_mark" && opts.injectFailure.eventId === row.envelope.eventId;

    if (opts.injectFailure?.at === "during_retry" && row.attempts > 1 && opts.injectFailure.eventId === row.envelope.eventId) {
      bumpMetric(store, "publisherFailures");
      row.lastError = "publisher_crash_during_retry";
      return {
        published,
        deadLettered,
        remaining: pendingCount(store),
        crashed: true,
        crashPoint: "during_retry",
      };
    }

    if (shouldFailTransport || failBefore) {
      row.lastError = "publisher_transport_failure";
      bumpMetric(store, "publisherFailures");
      if (row.attempts >= maxAttempts) {
        moveToDlq(store, row, "outbox-publisher");
        deadLettered += 1;
      }
      continue;
    }

    try {
      transport.publish(row.envelope);
      if (failAfterMark) {
        bumpMetric(store, "publisherFailures");
        row.lastError = "publisher_crash_after_publish_before_mark";
        return {
          published,
          deadLettered,
          remaining: pendingCount(store),
          crashed: true,
          crashPoint: "after_publish_before_mark",
        };
      }
      row.publishedAt = new Date().toISOString();
      row.status = "published";
      void persistOutboxPublish(store.dbPool, row);
      bumpMetric(store, "eventsPublished");
      published += 1;
    } catch (err) {
      row.lastError = err instanceof Error ? err.message : "publisher_failed";
      bumpMetric(store, "publisherFailures");
      if (row.attempts >= maxAttempts) {
        moveToDlq(store, row, "outbox-publisher");
        deadLettered += 1;
      }
    }
  }

  return { published, deadLettered, remaining: pendingCount(store) };
}

function pendingCount(store: Store): number {
  return store.outboxEvents.filter((r) => r.status === "pending").length;
}

function moveToDlq(store: Store, row: OutboxRecord, consumer: string): void {
  row.status = "dead_letter";
  void persistOutboxPublish(store.dbPool, row);
  const now = new Date().toISOString();
  const existing = store.deadLetters.find((d) => d.outboxId === row.id && d.consumer === consumer);
  if (existing) {
    existing.attempts = row.attempts;
    existing.lastFailureAt = now;
    existing.failureReason = row.lastError ?? "unknown";
    existing.status = "failed";
    return;
  }
  store.deadLetters.push({
    id: row.id + "-dlq",
    outboxId: row.id,
    tenantId: row.tenantId,
    eventType: row.eventType,
    eventId: row.envelope.eventId,
    failureReason: row.lastError ?? "unknown",
    consumer,
    attempts: row.attempts,
    firstFailureAt: now,
    lastFailureAt: now,
    status: "failed",
    replayStatus: "none",
  });
  bumpMetric(store, "dlqCount");
}

export function consumeEventIdempotent(
  store: Store,
  principal: Principal,
  input: {
    event: EnterpriseEventEnvelope;
    consumer: string;
    handler: (event: EnterpriseEventEnvelope) => void;
    force?: boolean;
  },
): { delivered: true; processed: boolean; reason?: string } | { delivered: false; reason: string } {
  ensureOutboxCollections(store);
  if (input.event.tenantId !== principal.tenantId) {
    bumpMetric(store, "authorizationFailures");
    return { delivered: false, reason: "tenant_isolation" };
  }
  if (input.event.actor && input.event.actor.principalId !== principal.id && principal.actorType !== "Service") {
    // Consumers act as themselves; forged actor on envelope is ignored for authz boundary
  }
  const authz = assertConsumerAuthorized(store, principal, input.event.eventType, input.consumer);
  if (!authz.ok) return { delivered: false, reason: authz.reason };

  const entry = store.eventCatalogue.find((e) => e.eventType === input.event.eventType);
  if (entry) {
    const schemaCheck = validateEnvelopeSchema(catalogueToSchema(entry), input.event);
    if (!schemaCheck.ok) {
      bumpMetric(store, "schemaErrors");
      return { delivered: false, reason: schemaCheck.reason };
    }
  }

  const prior = store.processedEvents.find(
    (p) =>
      p.tenantId === principal.tenantId &&
      p.consumer === input.consumer &&
      p.eventId === input.event.eventId,
  );
  if (prior && !input.force) {
    return { delivered: true, processed: false, reason: "already_processed" };
  }
  if (prior && input.force) {
    const idx = store.processedEvents.indexOf(prior);
    if (idx >= 0) store.processedEvents.splice(idx, 1);
    void removeProcessedEvent(store.dbPool, prior.tenantId, prior.consumer, prior.eventId);
  }

  try {
    input.handler(input.event);
  } catch (err) {
    bumpMetric(store, "consumerFailures");
    const now = new Date().toISOString();
    store.deadLetters.push({
      id: `${input.event.eventId}-${input.consumer}-dlq`,
      outboxId: input.event.eventId,
      tenantId: input.event.tenantId,
      eventType: input.event.eventType,
      eventId: input.event.eventId,
      failureReason: err instanceof Error ? err.message : "handler_failed",
      consumer: input.consumer,
      attempts: 1,
      firstFailureAt: now,
      lastFailureAt: now,
      status: "failed",
      replayStatus: "none",
    });
    bumpMetric(store, "dlqCount");
    return { delivered: true, processed: false, reason: "handler_failed" };
  }

  const key: ProcessedEventKey = {
    tenantId: principal.tenantId,
    consumer: input.consumer,
    eventId: input.event.eventId,
    processedAt: new Date().toISOString(),
  };
  store.processedEvents.push(key);
  void persistProcessedEvent(store.dbPool, key);
  return { delivered: true, processed: true };
}

export function requestReplay(
  store: Store,
  principal: Principal,
  input: {
    reason: string;
    intent: "reconstruction" | "reexecute";
    deadLetterIds: string[];
    targetConsumer?: string;
    correlationId: string;
  },
): { ok: true; request: ReplayRequest } | { ok: false; reason: string } {
  ensureOutboxCollections(store);
  if (input.intent === "reexecute") {
    const decision = authorize({
      principal,
      permission: "events:replay:outbox",
      action: "request:replay",
    });
    if (decision.result === "deny") {
      bumpMetric(store, "authorizationFailures");
      return { ok: false, reason: decision.reason };
    }
  }
  if (!input.reason.trim()) return { ok: false, reason: "reason_required" };
  for (const id of input.deadLetterIds) {
    const dlq = store.deadLetters.find((d) => d.id === id && d.tenantId === principal.tenantId);
    if (!dlq) return { ok: false, reason: "dlq_not_found_or_cross_tenant" };
  }
  const request: ReplayRequest = {
    id: newId(),
    tenantId: principal.tenantId,
    requestedByPrincipalId: principal.id,
    reason: input.reason,
    intent: input.intent,
    deadLetterIds: input.deadLetterIds,
    ...(input.targetConsumer !== undefined ? { targetConsumer: input.targetConsumer } : {}),
    status: input.intent === "reconstruction" ? "approved" : "pending",
    createdAt: new Date().toISOString(),
    correlationId: input.correlationId,
  };
  store.replayRequests.push(request);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "events:replay:request",
    resourceType: "replay_request",
    resourceId: request.id,
    correlationId: input.correlationId,
    authorization: "allow",
    newState: { intent: input.intent, deadLetterIds: input.deadLetterIds, reason: input.reason },
  });
  return { ok: true, request };
}

export function executeReplayRequest(
  store: Store,
  principal: Principal,
  requestId: string,
  correlationId: string,
): { ok: true; replayed: number } | { ok: false; reason: string } {
  ensureOutboxCollections(store);
  const decision = authorize({
    principal,
    permission: "events:replay:outbox",
    action: "execute:replay",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: decision.reason };
  }
  const request = store.replayRequests.find((r) => r.id === requestId && r.tenantId === principal.tenantId);
  if (!request) return { ok: false, reason: "not_found" };
  if (request.status === "executed") return { ok: false, reason: "already_executed" };
  if (request.intent === "reexecute" && request.status !== "approved" && request.status !== "pending") {
    return { ok: false, reason: "not_approved" };
  }

  let replayed = 0;
  for (const dlqId of request.deadLetterIds) {
    const dlq = store.deadLetters.find((d) => d.id === dlqId && d.tenantId === principal.tenantId);
    if (!dlq) continue;
    const row = store.outboxEvents.find((o) => o.id === dlq.outboxId);
    if (!row) continue;
    row.status = "pending";
    row.attempts = 0;
    delete row.lastError;
    dlq.status = "replay_approved";
    dlq.replayStatus = "replayed";
    dlq.remediation = request.reason;
    replayed += 1;
  }
  request.status = "executed";
  request.executedAt = new Date().toISOString();
  bumpMetric(store, "replays", replayed);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "events:replay:execute",
    resourceType: "replay_request",
    resourceId: request.id,
    correlationId,
    authorization: "allow",
    newState: { replayed, intent: request.intent },
  });
  return { ok: true, replayed };
}

/** @deprecated use requestReplay + executeReplayRequest */
export function replayDeadLetter(
  store: Store,
  principal: Principal,
  deadLetterId: string,
  correlationId: string,
  intent: "reconstruction" | "reexecute",
  reason = "legacy_replay",
): { ok: true; deadLetter: DeadLetterRecord } | { ok: false; reason: string } {
  const req = requestReplay(store, principal, {
    reason,
    intent,
    deadLetterIds: [deadLetterId],
    correlationId,
  });
  if (!req.ok) return { ok: false, reason: req.reason };
  if (intent === "reexecute") {
    req.request.status = "approved";
  }
  const exec = executeReplayRequest(store, principal, req.request.id, correlationId);
  if (!exec.ok) return { ok: false, reason: exec.reason };
  const dlq = store.deadLetters.find((d) => d.id === deadLetterId)!;
  return { ok: true, deadLetter: dlq };
}

export const DLQ_SLA_THRESHOLD_HOURS = 24;

export function listDeadLetters(
  store: Store,
  principal: Principal,
  query: {
    owner?: string;
    status?: string;
    unassigned?: boolean;
    minAgeHours?: number;
    maxAgeHours?: number;
    slaBreached?: boolean;
    slaHours?: number;
  } = {},
): {
  ok: true;
  items: Array<DeadLetterRecord & { ageHours: number; slaBreached: boolean }>;
  owners: string[];
  sla: { thresholdHours: number; breachedCount: number; openCount: number };
  increment: "I4.13";
} | { ok: false; reason: string } {
  ensureOutboxCollections(store);
  const decision = authorize({
    principal,
    permission: "events:read:dlq",
    action: "read:dlq",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: decision.reason };
  }

  const thresholdHours =
    typeof query.slaHours === "number" && query.slaHours > 0 ? query.slaHours : DLQ_SLA_THRESHOLD_HOURS;
  const now = Date.now();

  let items = store.deadLetters.filter((d) => d.tenantId === principal.tenantId);
  const owners = [
    ...new Set(items.map((d) => d.owner).filter((o): o is string => Boolean(o?.trim()))),
  ].sort((a, b) => a.localeCompare(b));

  if (query.unassigned) {
    items = items.filter((d) => !d.owner?.trim());
  } else if (query.owner?.trim()) {
    const owner = query.owner.trim().toLowerCase();
    items = items.filter((d) => (d.owner ?? "").toLowerCase() === owner);
  }
  if (query.status?.trim()) {
    items = items.filter((d) => d.status === query.status);
  }

  const enriched = items.map((d) => {
    const ageMs = Math.max(0, now - new Date(d.firstFailureAt).getTime());
    const ageHours = ageMs / 3_600_000;
    const open = d.status !== "closed" && d.status !== "resolved";
    return {
      ...d,
      ageHours: Math.round(ageHours * 10) / 10,
      slaBreached: open && ageHours >= thresholdHours,
    };
  });

  let filtered = enriched;
  if (typeof query.minAgeHours === "number" && query.minAgeHours >= 0) {
    filtered = filtered.filter((d) => d.ageHours >= query.minAgeHours!);
  }
  if (typeof query.maxAgeHours === "number" && query.maxAgeHours >= 0) {
    filtered = filtered.filter((d) => d.ageHours <= query.maxAgeHours!);
  }
  if (query.slaBreached) {
    filtered = filtered.filter((d) => d.slaBreached);
  }

  const openAll = enriched.filter((d) => d.status !== "closed" && d.status !== "resolved");
  const breachedCount = openAll.filter((d) => d.slaBreached).length;

  return {
    ok: true,
    items: filtered,
    owners,
    sla: {
      thresholdHours,
      breachedCount,
      openCount: openAll.length,
    },
    increment: "I4.13" as const,
  };
}

const DLQ_TRANSITIONS: Record<DlqLifecycleStatus, DlqLifecycleStatus[]> = {
  failed: ["investigating"],
  investigating: ["corrected", "permanently_rejected", "failed"],
  corrected: ["resolved", "investigating"],
  replay_approved: ["resolved", "replayed"],
  replayed: ["resolved"],
  resolved: ["closed"],
  permanently_rejected: ["closed"],
  closed: [],
};

/** I4.11 — assign/clear owner without requiring a status transition. */
export function assignDeadLetterOwner(
  store: Store,
  principal: Principal,
  id: string,
  input: { owner: string | null },
  correlationId: string,
): { ok: true; deadLetter: DeadLetterRecord; increment: "I4.13" } | { ok: false; reason: string } {
  ensureOutboxCollections(store);
  const decision = authorize({
    principal,
    permission: "events:replay:outbox",
    action: "assign:dlq_owner",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: decision.reason };
  }

  const dlq = store.deadLetters.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!dlq) return { ok: false, reason: "not_found" };

  const previous = { owner: dlq.owner };
  if (input.owner === null || input.owner.trim() === "") delete dlq.owner;
  else dlq.owner = input.owner.trim();

  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "events:dlq:assign_owner",
    resourceType: "dead_letter",
    resourceId: dlq.id,
    correlationId,
    authorization: "allow",
    previousState: previous,
    newState: { owner: dlq.owner },
  });

  return { ok: true, deadLetter: dlq, increment: "I4.13" as const };
}

/** I4.12 — assign/clear owner on many DLQ rows in one call. */
export function bulkAssignDeadLetterOwners(
  store: Store,
  principal: Principal,
  input: { ids: string[]; owner: string | null },
  correlationId: string,
): { ok: true; updated: number; notFound: string[]; increment: "I4.13" } | { ok: false; reason: string } {
  ensureOutboxCollections(store);
  const decision = authorize({
    principal,
    permission: "events:replay:outbox",
    action: "bulk_assign:dlq_owner",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: decision.reason };
  }

  const ids = [...new Set((input.ids ?? []).filter(Boolean))];
  if (ids.length === 0) return { ok: false, reason: "ids_required" };

  let updated = 0;
  const notFound: string[] = [];
  for (const id of ids) {
    const result = assignDeadLetterOwner(store, principal, id, { owner: input.owner }, correlationId);
    if (!result.ok) {
      if (result.reason === "not_found") notFound.push(id);
      else return result;
      continue;
    }
    updated += 1;
  }

  return { ok: true, updated, notFound, increment: "I4.13" as const };
}

export function updateDeadLetterRemediation(
  store: Store,
  principal: Principal,
  id: string,
  input: { status: DlqLifecycleStatus; owner?: string | null; remediation?: string | null },
  correlationId: string,
): { ok: true; deadLetter: DeadLetterRecord; increment: "I4.13" } | { ok: false; reason: string } {
  ensureOutboxCollections(store);
  const decision = authorize({
    principal,
    permission: "events:replay:outbox",
    action: "update:dlq_remediation",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: decision.reason };
  }

  const dlq = store.deadLetters.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!dlq) return { ok: false, reason: "not_found" };

  const allowed = DLQ_TRANSITIONS[dlq.status] ?? [];
  if (!allowed.includes(input.status)) {
    return { ok: false, reason: "invalid_transition" };
  }

  const previous = { status: dlq.status, owner: dlq.owner, remediation: dlq.remediation };
  dlq.status = input.status;
  if (input.owner !== undefined) {
    if (input.owner === null || input.owner.trim() === "") delete dlq.owner;
    else dlq.owner = input.owner.trim();
  }
  if (input.remediation !== undefined) {
    if (input.remediation === null || input.remediation.trim() === "") delete dlq.remediation;
    else dlq.remediation = input.remediation.trim();
  }

  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "events:dlq:remediate",
    resourceType: "dead_letter",
    resourceId: dlq.id,
    correlationId,
    authorization: "allow",
    previousState: previous,
    newState: { status: dlq.status, owner: dlq.owner, remediation: dlq.remediation },
  });

  return { ok: true, deadLetter: dlq, increment: "I4.13" as const };
}

export function getOrderedPublishedEvents(
  store: Store,
  tenantId: string,
  aggregateId: string,
): EnterpriseEventEnvelope[] {
  ensureOutboxCollections(store);
  return store.outboxEvents
    .filter(
      (r) =>
        r.status === "published" &&
        r.tenantId === tenantId &&
        r.envelope.aggregateId === aggregateId,
    )
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
    .map((r) => r.envelope);
}

export function getEventOperationsView(store: Store, principal: Principal) {
  ensureOutboxCollections(store);
  const decision = authorize({
    principal,
    permission: "events:read:operations",
    action: "read:event_operations",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const transport = getEventTransport(store);
  const pending = store.outboxEvents.filter((r) => r.status === "pending");
  const oldest = pending.length
    ? pending.reduce((a, b) => (a.createdAt < b.createdAt ? a : b)).createdAt
    : undefined;
  return {
    metrics: { ...store.eventMetrics, oldestPendingOutboxAt: oldest },
    transport: {
      kind: transport.kind,
      health: transport.health(),
      note: "in-memory-dev is a Development/Test stand-in — not Production transport",
    },
    pendingOutbox: pending.length,
    publishedCount: store.outboxEvents.filter((r) => r.status === "published").length,
    dlqOpen: store.deadLetters.filter((d) => d.tenantId === principal.tenantId && d.status === "failed").length,
    replays: store.replayRequests.filter((r) => r.tenantId === principal.tenantId).length,
    correlationHint: "Business transaction → outbox → event → consumer → result (via correlationId)",
  };
}

export function getEventInfrastructureHealth(store: Store) {
  ensureOutboxCollections(store);
  const transport = getEventTransport(store);
  const transportHealth = transport.health();
  const pending = store.outboxEvents.filter((r) => r.status === "pending").length;
  const dlq = store.deadLetters.filter((d) => d.status === "failed").length;
  const schemaActive = store.eventCatalogue.filter((e) => e.lifecycle === "active").length;
  return {
    outbox: { ok: true, pending },
    publisher: { ok: pending < 10_000, pendingBacklog: pending },
    transport: transportHealth,
    transportKind: store.eventTransportKind,
    dlq: { ok: dlq < 1000, open: dlq },
    schemaCatalogue: { ok: schemaActive > 0, activeSchemas: schemaActive },
    eventInfrastructureReady: transportHealth.ok && schemaActive > 0,
    note: "eventInfrastructureReady is separate from applicationReady; neither implies Production readiness",
  };
}

export function traceEventCorrelation(store: Store, correlationId: string, tenantId: string) {
  ensureOutboxCollections(store);
  const outbox = store.outboxEvents.filter(
    (r) => r.envelope.correlationId === correlationId && r.tenantId === tenantId,
  );
  const audit = store.audit.filter((a) => a.correlationId === correlationId && a.tenantId === tenantId);
  const processed = store.processedEvents.filter(() =>
    outbox.some((o) => o.envelope.eventId),
  );
  return { outbox, audit, processedCount: processed.length };
}

export function listConsumerProcessedEvents(
  store: Store,
  principal: Principal,
  query?: { consumer?: string; limit?: number },
) {
  ensureOutboxCollections(store);
  const decision = authorize({
    principal,
    permission: "events:read:operations",
    action: "read:processed_events",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false as const, reason: decision.reason };
  }
  const limit = Math.min(Math.max(query?.limit ?? 50, 1), 200);
  const items = store.processedEvents
    .filter(
      (p) =>
        p.tenantId === principal.tenantId &&
        (!query?.consumer || p.consumer === query.consumer),
    )
    .slice(-limit);
  return { ok: true as const, items };
}

function findEnvelopeForReplay(store: Store, tenantId: string, eventId: string): EnterpriseEventEnvelope | undefined {
  const outbox = store.outboxEvents.find(
    (r) => r.tenantId === tenantId && r.envelope.eventId === eventId,
  );
  if (outbox) return outbox.envelope;
  return store.publishedBus.find((e) => e.tenantId === tenantId && e.eventId === eventId);
}

export function replayEventsToConsumer(
  store: Store,
  principal: Principal,
  input: {
    consumer: string;
    eventIds: string[];
    force?: boolean;
    correlationId: string;
  },
):
  | { ok: true; results: Array<{ eventId: string; processed: boolean; reason?: string }> }
  | { ok: false; reason: string } {
  ensureOutboxCollections(store);
  const decision = authorize({
    principal,
    permission: "events:consume:outbox",
    action: "replay:consumer_events",
  });
  if (decision.result === "deny") {
    bumpMetric(store, "authorizationFailures");
    return { ok: false, reason: decision.reason };
  }
  if (!input.eventIds.length) return { ok: false, reason: "event_ids_required" };

  const results: Array<{ eventId: string; processed: boolean; reason?: string }> = [];
  for (const eventId of input.eventIds) {
    const envelope = findEnvelopeForReplay(store, principal.tenantId, eventId);
    if (!envelope) {
      results.push({ eventId, processed: false, reason: "event_not_found" });
      continue;
    }
    const handlerFn = getEventHandler(envelope.eventType);
    if (!handlerFn) {
      results.push({ eventId, processed: false, reason: "no_handler_registered" });
      continue;
    }
    const result = consumeEventIdempotent(store, principal, {
      event: envelope,
      consumer: input.consumer,
      force: input.force === true,
      handler: (event) => handlerFn(event, store),
    });
    if ("delivered" in result && result.delivered) {
      results.push({
        eventId,
        processed: result.processed,
        ...(result.reason !== undefined ? { reason: result.reason } : {}),
      });
    } else {
      results.push({ eventId, processed: false, reason: result.reason });
    }
  }

  if (store.eventMetrics) store.eventMetrics.replays += results.filter((r) => r.processed).length;
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "events:consumer_replay",
    resourceType: "consumer",
    resourceId: input.consumer,
    correlationId: input.correlationId,
    authorization: "allow",
    newState: { eventIds: input.eventIds, force: input.force === true, results },
  });
  return { ok: true, results };
}
