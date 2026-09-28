import type { DbPool } from "@sedmc/db";
import {
  buildEnvelope,
  chainAudit,
  createOutboxRecord,
  GENESIS_HASH,
  isValidUuid,
  type ChainedAuditRecord,
  type Classification,
  type OutboxRecord,
  type Principal,
} from "@sedmc/kernel";
import { createLogger } from "../observability.js";
import { recordAudit, type Store } from "../store.js";
import {
  insertAuditEventOn,
  insertOutboxEventOn,
  withTransaction,
  type Queryable,
} from "./pg-repository.js";

const log = createLogger();

export type { Queryable };

export class OptimisticConcurrencyError extends Error {
  readonly code = "stale_version" as const;
  constructor(readonly entity: string) {
    super(`stale_version:${entity}`);
    this.name = "OptimisticConcurrencyError";
  }
}

export function isDurableSoR(store: Store): store is Store & { dbPool: DbPool } {
  return Boolean(store.dbPool);
}

/** F2-DP-01 bounded Dev/Test: dbPool is attached for sidecar maps only. */
export function isF2Dp01BoundedSidecarOnly(store: Store): boolean {
  return store.f2Dp01BoundedSidecarOnly === true;
}

/**
 * Mixed C-spine SQL (opp_/rfp_/prg_/cost_/com_approval_/commercial_documents) is durable
 * only when a pool is attached AND the bounded 124-only sidecar path is not active.
 */
export function isMixedSqlDurable(store: Store): store is Store & { dbPool: DbPool } {
  return isDurableSoR(store) && !isF2Dp01BoundedSidecarOnly(store);
}

export function isUniqueViolation(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code: unknown }).code === "23505");
}

export function uniqueConstraintName(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("constraint" in error)) return undefined;
  const name = (error as { constraint?: unknown }).constraint;
  return typeof name === "string" ? name : undefined;
}

export async function runDurableTx<T>(store: Store, fn: (client: Queryable) => Promise<T>): Promise<T> {
  if (!store.dbPool) throw new Error("durable_pool_required");
  try {
    return await withTransaction(store.dbPool, fn);
  } catch (error) {
    log.error("persistence_failed", {
      err: error instanceof Error ? error.message : String(error),
      code: error instanceof OptimisticConcurrencyError ? error.code : undefined,
    });
    throw error;
  }
}

export function isoTimestamp(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return String(value);
}

export function dateOnly(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const raw = String(value);
  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

export function asNumber(value: unknown): number | undefined {
  if (value == null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function asNumberRequired(value: unknown): number {
  const n = asNumber(value);
  return n ?? 0;
}

/** audit_events.correlation_id is UUID; coerce invalid inbound ids rather than failing the chain. */
export function pgCorrelationId(value: string): string {
  return isValidUuid(value) ? value : globalThis.crypto.randomUUID();
}

export async function loadLastAuditHash(client: Queryable, tenantId: string): Promise<string> {
  const result = await client.query(
    `SELECT row_hash AS "rowHash" FROM audit_events WHERE tenant_id = $1 ORDER BY sequence DESC LIMIT 1`,
    [tenantId],
  );
  const hash = result.rows[0]?.rowHash;
  return typeof hash === "string" && hash.length > 0 ? hash : GENESIS_HASH;
}

function auditRecordForPg(
  record: Omit<ChainedAuditRecord, "prevHash" | "rowHash">,
): Omit<ChainedAuditRecord, "prevHash" | "rowHash"> {
  const correlationId = pgCorrelationId(record.correlationId);
  if (correlationId === record.correlationId) return record;
  return {
    ...record,
    correlationId,
    evidence:
      record.evidence && typeof record.evidence === "object"
        ? { ...(record.evidence as Record<string, unknown>), originalCorrelationId: record.correlationId }
        : { originalCorrelationId: record.correlationId },
  };
}

export async function insertChainedAudit(
  client: Queryable,
  record: Omit<ChainedAuditRecord, "prevHash" | "rowHash">,
): Promise<ChainedAuditRecord> {
  const prepared = auditRecordForPg(record);
  const prev = await loadLastAuditHash(client, prepared.tenantId);
  const chained = chainAudit(prepared, prev);
  await insertAuditEventOn(client, chained);
  return chained;
}

export async function persistDenyAudit(
  store: Store,
  record: Omit<ChainedAuditRecord, "prevHash" | "rowHash">,
): Promise<ChainedAuditRecord> {
  if (!isMixedSqlDurable(store)) return recordAudit(store, record);
  const chained = await runDurableTx(store, (client) => insertChainedAudit(client, record));
  store.audit.push(chained);
  return chained;
}

export function denyAuditRecord(
  principal: Principal,
  action: string,
  resourceType: string,
  correlationId: string,
  reason: string,
  resourceId?: string,
): Omit<ChainedAuditRecord, "prevHash" | "rowHash"> {
  return {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType,
    ...(resourceId !== undefined ? { resourceId } : {}),
    correlationId,
    authorization: "deny",
    evidence: { reason },
  };
}

export function unhashedAuditRecord(
  record: ChainedAuditRecord,
): Omit<ChainedAuditRecord, "prevHash" | "rowHash"> {
  const { prevHash: _prev, rowHash: _row, ...rest } = record;
  return rest;
}

export function allowAuditRecord(
  principal: Principal,
  action: string,
  resourceType: string,
  resourceId: string,
  correlationId: string,
  newState: unknown,
): Omit<ChainedAuditRecord, "prevHash" | "rowHash"> {
  return {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType,
    resourceId,
    correlationId,
    authorization: "allow",
    evidence: { newState },
  };
}

export async function insertDomainOutbox(
  client: Queryable,
  input: {
    principal: Principal;
    eventType: string;
    payload: Record<string, unknown>;
    classification: Classification;
    correlationId: string;
    aggregateId: string;
    producer?: string;
  },
): Promise<OutboxRecord> {
  const envelope = buildEnvelope({
    eventType: input.eventType,
    tenantId: input.principal.tenantId,
    producer: input.producer ?? "serengeti-eos-api",
    correlationId: pgCorrelationId(input.correlationId),
    classification: input.classification,
    payload: input.payload,
    actor: { type: input.principal.actorType, principalId: input.principal.id },
    aggregateId: input.aggregateId,
    schemaVersion: 1,
  });
  const outbox = createOutboxRecord(envelope);
  await insertOutboxEventOn(client, outbox);
  return outbox;
}

export function rememberPostCommit(
  store: Store,
  audit: ChainedAuditRecord,
  outbox?: OutboxRecord,
): void {
  store.audit.push(audit);
  if (outbox) {
    if (!store.outboxEvents) store.outboxEvents = [];
    store.outboxEvents.push(outbox);
  }
}

export async function loadAuditEvents(pool: DbPool, tenantId: string): Promise<ChainedAuditRecord[]> {
  const result = await pool.query(
    `SELECT tenant_id, occurred_at, actor_type, actor_principal_id, action, resource_type, resource_id,
            correlation_id, "authorization", previous_state, new_state, evidence, prev_hash, row_hash
     FROM audit_events
     WHERE tenant_id = $1
     ORDER BY sequence ASC`,
    [tenantId],
  );
  return result.rows.map((row) => {
    const record: ChainedAuditRecord = {
      tenantId: row.tenant_id as string,
      occurredAt: isoTimestamp(row.occurred_at),
      actorType: row.actor_type as ChainedAuditRecord["actorType"],
      action: row.action as string,
      resourceType: row.resource_type as string,
      correlationId: row.correlation_id as string,
      authorization: row.authorization as ChainedAuditRecord["authorization"],
      prevHash: row.prev_hash as string,
      rowHash: row.row_hash as string,
    };
    if (row.actor_principal_id) record.actorPrincipalId = row.actor_principal_id as string;
    if (row.resource_id) record.resourceId = row.resource_id as string;
    if (row.previous_state != null) record.previousState = row.previous_state;
    if (row.new_state != null) record.newState = row.new_state;
    if (row.evidence != null) record.evidence = row.evidence;
    return record;
  });
}

export async function assertVersionMatch(
  client: Queryable,
  sql: string,
  params: unknown[],
  entity: string,
): Promise<void> {
  const result = await client.query(sql, params);
  if ((result.rowCount ?? 0) === 0) throw new OptimisticConcurrencyError(entity);
}
