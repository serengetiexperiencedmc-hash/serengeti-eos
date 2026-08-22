import {
  assertLiveAllowed,
  buildCrmEventCatalogue,
  buildEnvelope,
  createOutboxRecord,
  isCrmEventType,
  validateEnvelopeSchema,
  type Classification,
  type CrmEventType,
  type EnterpriseEventEnvelope,
  type EventCatalogueEntry,
  type ExecutionMode,
  type OutboxRecord,
  type Principal,
} from "@sedmc/kernel";
import { ensureOutboxCollections } from "../outbox.js";
import { persistCrmEntityAfterCommit } from "../persistence/crm.js";
import { persistOutboxInsert } from "../persistence/outbox.js";
import type { Store } from "../store.js";

const CLASSIFICATION_RANK: Record<Classification, number> = {
  Public: 0,
  Internal: 1,
  Confidential: 2,
  Restricted: 3,
  HighlyRestricted: 4,
};

function effectiveEventClassification(
  entityClassification: Classification,
  catalogueClassification: Classification,
): Classification {
  return CLASSIFICATION_RANK[entityClassification] >= CLASSIFICATION_RANK[catalogueClassification]
    ? entityClassification
    : catalogueClassification;
}

export type EmitCrmEventInput = {
  eventType: CrmEventType;
  entityType: string;
  entityId: string;
  classification: Classification;
  correlationId: string;
  payload: Record<string, unknown>;
  requestId?: string;
  mode?: ExecutionMode;
};

function buildEventPayload(input: EmitCrmEventInput): Record<string, unknown> {
  return {
    entityType: input.entityType,
    entityId: input.entityId,
    correlationId: input.correlationId,
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
    ...input.payload,
  };
}

/** Dry-run validation without writing to outbox. */
export function validateCrmEventEmission(
  store: Store,
  principal: Principal,
  input: EmitCrmEventInput,
): { ok: true } | { ok: false; reason: string } {
  ensureCrmEventCatalogue(store);
  if (!isCrmEventType(input.eventType)) {
    return { ok: false, reason: "unknown_crm_event_type" };
  }
  const entry = store.eventCatalogue.find((e) => e.eventType === input.eventType && e.lifecycle === "active");
  if (!entry) return { ok: false, reason: "event_type_not_registered" };

  const envelope = buildEnvelope({
    eventType: input.eventType,
    tenantId: principal.tenantId,
    producer: entry.producer,
    correlationId: input.correlationId,
    classification: effectiveEventClassification(input.classification, entry.classification),
    payload: buildEventPayload(input),
    actor: { type: principal.actorType, principalId: principal.id },
    aggregateId: input.entityId,
    schemaVersion: entry.schemaVersion,
    eventVersion: 1,
  });

  const schemaCheck = validateEnvelopeSchema(catalogueToSchema(entry), envelope);
  if (!schemaCheck.ok) return { ok: false, reason: schemaCheck.reason };
  return { ok: true };
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
    maxPayloadBytes: entry.maxPayloadBytes ?? 8192,
    sensitiveDataPolicy: entry.sensitiveDataPolicy ?? "reference_only",
  };
}

export function ensureCrmEventCatalogue(store: Store): void {
  ensureOutboxCollections(store);
  for (const entry of buildCrmEventCatalogue()) {
    const idx = store.eventCatalogue.findIndex((e) => e.eventType === entry.eventType);
    if (idx >= 0) store.eventCatalogue[idx] = entry;
    else store.eventCatalogue.push(entry);
  }
}

function assignAggregateSequence(
  store: Store,
  entry: EventCatalogueEntry,
  envelope: EnterpriseEventEnvelope,
): number | undefined {
  if (entry.orderingKey !== "aggregateId" || !envelope.aggregateId) return undefined;
  const key = `${envelope.tenantId}:${envelope.eventType}:${envelope.aggregateId}`;
  const next = (store.aggregateSequences.get(key) ?? 0) + 1;
  store.aggregateSequences.set(key, next);
  return next;
}

type CrmDomainSnapshot = {
  crmOrganizations: Store["crmOrganizations"];
  crmOrganizationUnits: Store["crmOrganizationUnits"];
  crmContacts: Store["crmContacts"];
  crmRelationships: Store["crmRelationships"];
  crmAccounts: Store["crmAccounts"];
  crmActivities: Store["crmActivities"];
  crmNotes: Store["crmNotes"];
  crmTasks: Store["crmTasks"];
  crmTags: Store["crmTags"];
  crmEntityTags: Store["crmEntityTags"];
  crmExternalIdentifiers: Store["crmExternalIdentifiers"];
  crmDuplicateCandidates: Store["crmDuplicateCandidates"];
  crmMergeRecords: Store["crmMergeRecords"];
  crmImportBatches: Store["crmImportBatches"];
  crmMergeIdempotency: Record<string, string>;
  crmImportExecuteIdempotency: Record<string, string>;
  auditLen: number;
  outboxLen: number;
  aggregateSequences: Map<string, number>;
};

function snapshotCrmDomain(store: Store): CrmDomainSnapshot {
  return {
    crmOrganizations: [...store.crmOrganizations],
    crmOrganizationUnits: [...store.crmOrganizationUnits],
    crmContacts: [...store.crmContacts],
    crmRelationships: [...store.crmRelationships],
    crmAccounts: [...store.crmAccounts],
    crmActivities: [...store.crmActivities],
    crmNotes: [...store.crmNotes],
    crmTasks: [...store.crmTasks],
    crmTags: [...store.crmTags],
    crmEntityTags: [...store.crmEntityTags],
    crmExternalIdentifiers: [...store.crmExternalIdentifiers],
    crmDuplicateCandidates: [...store.crmDuplicateCandidates],
    crmMergeRecords: [...store.crmMergeRecords],
    crmImportBatches: [...store.crmImportBatches],
    crmMergeIdempotency: { ...store.crmMergeIdempotency },
    crmImportExecuteIdempotency: { ...store.crmImportExecuteIdempotency },
    auditLen: store.audit.length,
    outboxLen: store.outboxEvents.length,
    aggregateSequences: new Map(store.aggregateSequences),
  };
}

function restoreCrmDomain(store: Store, snap: CrmDomainSnapshot): void {
  store.crmOrganizations = snap.crmOrganizations;
  store.crmOrganizationUnits = snap.crmOrganizationUnits;
  store.crmContacts = snap.crmContacts;
  store.crmRelationships = snap.crmRelationships;
  store.crmAccounts = snap.crmAccounts;
  store.crmActivities = snap.crmActivities;
  store.crmNotes = snap.crmNotes;
  store.crmTasks = snap.crmTasks;
  store.crmTags = snap.crmTags;
  store.crmEntityTags = snap.crmEntityTags;
  store.crmExternalIdentifiers = snap.crmExternalIdentifiers;
  store.crmDuplicateCandidates = snap.crmDuplicateCandidates;
  store.crmMergeRecords = snap.crmMergeRecords;
  store.crmImportBatches = snap.crmImportBatches;
  store.crmMergeIdempotency = snap.crmMergeIdempotency;
  store.crmImportExecuteIdempotency = snap.crmImportExecuteIdempotency;
  store.audit.length = snap.auditLen;
  store.outboxEvents.length = snap.outboxLen;
  store.aggregateSequences = snap.aggregateSequences;
}

export type CommitCrmWithOutboxInput = EmitCrmEventInput & {
  mutate: () => void;
  /** Additional outbox events committed in the same transaction as the primary event */
  additionalEvents?: Omit<EmitCrmEventInput, "mode">[];
  /** Test hook: simulate outbox persistence failure after domain mutate */
  simulateOutboxWriteFailure?: boolean;
};

type PreparedCrmOutbox = { outbox: OutboxRecord; envelope: EnterpriseEventEnvelope };

function prepareCrmOutboxRecord(
  store: Store,
  principal: Principal,
  input: EmitCrmEventInput,
): { ok: true; prepared: PreparedCrmOutbox } | { ok: false; reason: string } {
  const validated = validateCrmEventEmission(store, principal, input);
  if (!validated.ok) return validated;

  ensureCrmEventCatalogue(store);
  const entry = store.eventCatalogue.find((e) => e.eventType === input.eventType && e.lifecycle === "active")!;
  const payload = buildEventPayload(input);

  const envelope = buildEnvelope({
    eventType: input.eventType,
    tenantId: principal.tenantId,
    producer: entry.producer,
    correlationId: input.correlationId,
    classification: effectiveEventClassification(input.classification, entry.classification),
    payload,
    actor: { type: principal.actorType, principalId: principal.id },
    aggregateId: input.entityId,
    schemaVersion: entry.schemaVersion,
    eventVersion: 1,
  });

  const outbox = createOutboxRecord(envelope);
  const sequence = assignAggregateSequence(store, entry, envelope);
  if (sequence !== undefined) outbox.sequence = sequence;
  return { ok: true, prepared: { outbox, envelope } };
}

/**
 * Atomically commit a CRM domain mutation and its outbox event.
 * Rolls back CRM state, audit, and outbox on failure.
 */
export function commitCrmWithOutbox(
  store: Store,
  principal: Principal,
  input: CommitCrmWithOutboxInput,
): { ok: true; outbox: OutboxRecord; envelope: EnterpriseEventEnvelope } | { ok: false; reason: string } {
  const mode = input.mode ?? "LIVE";
  try {
    assertLiveAllowed({ mode, correlationId: input.correlationId, actorPrincipalId: principal.id }, "commitCrmWithOutbox");
  } catch {
    return { ok: false, reason: "simulation_cannot_publish" };
  }

  const primary = prepareCrmOutboxRecord(store, principal, input);
  if (!primary.ok) return primary;

  const additionalPrepared: PreparedCrmOutbox[] = [];
  for (const extra of input.additionalEvents ?? []) {
    const prepared = prepareCrmOutboxRecord(store, principal, { ...extra, mode });
    if (!prepared.ok) return prepared;
    additionalPrepared.push(prepared.prepared);
  }

  const { outbox, envelope } = primary.prepared;

  const domainSnapshot = snapshotCrmDomain(store);
  try {
    input.mutate();
    void persistCrmEntityAfterCommit(store.dbPool, store, input.entityType, input.entityId, principal.tenantId);
    if (input.simulateOutboxWriteFailure) {
      throw new Error("outbox_write_failed");
    }
    store.outboxEvents.push(outbox);
    void persistOutboxInsert(store.dbPool, outbox);
    for (const extra of additionalPrepared) {
      store.outboxEvents.push(extra.outbox);
      void persistOutboxInsert(store.dbPool, extra.outbox);
    }
  } catch (err) {
    restoreCrmDomain(store, domainSnapshot);
    return { ok: false, reason: err instanceof Error ? err.message : "tx_failed" };
  }

  const eventCount = 1 + additionalPrepared.length;
  if (store.eventMetrics) store.eventMetrics.eventsCommitted += eventCount;
  return { ok: true, outbox, envelope };
}

/**
 * Emit a CRM domain event without a coupled mutation (e.g. post-rollback failure events).
 * Prefer commitCrmWithOutbox for mutation paths.
 */
export function emitCrmEvent(
  store: Store,
  principal: Principal,
  input: EmitCrmEventInput,
): { ok: true; outbox: OutboxRecord; envelope: EnterpriseEventEnvelope } | { ok: false; reason: string } {
  const mode = input.mode ?? "LIVE";
  try {
    assertLiveAllowed({ mode, correlationId: input.correlationId, actorPrincipalId: principal.id }, "emitCrmEvent");
  } catch {
    return { ok: false, reason: "simulation_cannot_publish" };
  }

  const validated = validateCrmEventEmission(store, principal, input);
  if (!validated.ok) return validated;

  ensureCrmEventCatalogue(store);
  const entry = store.eventCatalogue.find((e) => e.eventType === input.eventType && e.lifecycle === "active")!;
  const payload = buildEventPayload(input);

  const envelope = buildEnvelope({
    eventType: input.eventType,
    tenantId: principal.tenantId,
    producer: entry.producer,
    correlationId: input.correlationId,
    classification: effectiveEventClassification(input.classification, entry.classification),
    payload,
    actor: { type: principal.actorType, principalId: principal.id },
    aggregateId: input.entityId,
    schemaVersion: entry.schemaVersion,
    eventVersion: 1,
  });

  const outbox = createOutboxRecord(envelope);
  const sequence = assignAggregateSequence(store, entry, envelope);
  if (sequence !== undefined) outbox.sequence = sequence;
  store.outboxEvents.push(outbox);
  void persistOutboxInsert(store.dbPool, outbox);
  if (store.eventMetrics) store.eventMetrics.eventsCommitted += 1;
  return { ok: true, outbox, envelope };
}

/** Development/Test: list CRM outbox events for a tenant (filtered by crm.* prefix). */
export function listCrmOutboxEvents(store: Store, principal: Principal, query?: { limit?: number }) {
  ensureCrmEventCatalogue(store);
  const limit = Math.min(Math.max(query?.limit ?? 50, 1), 200);
  const items = store.outboxEvents
    .filter((e) => e.tenantId === principal.tenantId && e.eventType.startsWith("crm."))
    .slice(-limit);
  return { items };
}
