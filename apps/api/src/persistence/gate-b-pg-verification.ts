import type { DbPool } from "@sedmc/db";
import { checkDatabaseHealth } from "@sedmc/db";

/**
 * Gate B PostgreSQL verification helpers (test harness only).
 *
 * Schema is an external prerequisite. This module must not import or call
 * `migrate()`, must not import `main.ts`, and must not emit schema-changing SQL.
 * It does not claim Production RTO/RPO evidence.
 */

export const GATE_B_REQUIRED_TABLES = [
  "tenants",
  "principals",
  "opp_opportunities",
  "opp_stage_history",
  "rfp_rfps",
  "rfp_versions",
  "prg_programmes",
  "prg_days",
  "prg_items",
  "prg_programme_versions",
  "cost_sheets",
  "cost_line_items",
  "cost_sheet_versions",
  "com_approval_requests",
  "commercial_documents",
  "audit_events",
  "outbox_events",
] as const;

export class GateBDatabaseUnreachableError extends Error {
  constructor(detail?: string) {
    super(
      `Gate B PostgreSQL verification prerequisite failed: database unreachable.${detail ? ` ${detail}` : ""} The harness will not run migrate() and will not create schema.`,
    );
    this.name = "GateBDatabaseUnreachableError";
  }
}

export class GateBSchemaMissingError extends Error {
  constructor(readonly missingTables: string[]) {
    super(
      `Gate B PostgreSQL verification prerequisite failed: required tables are missing (${missingTables.join(", ")}). Provision an already-migrated Dev/Test database. This harness will not create or repair schema.`,
    );
    this.name = "GateBSchemaMissingError";
  }
}

export type GateBCreatedIds = {
  opportunityIds: string[];
  rfpIds: string[];
  programmeIds: string[];
  costSheetIds: string[];
  approvalIds: string[];
  documentIds: string[];
};

export function emptyGateBCreatedIds(): GateBCreatedIds {
  return {
    opportunityIds: [],
    rfpIds: [],
    programmeIds: [],
    costSheetIds: [],
    approvalIds: [],
    documentIds: [],
  };
}

/** Read-only connectivity + table presence. Never creates tables. */
export async function assertAlreadyProvisionedGateBDatabase(pool: DbPool): Promise<void> {
  const health = await checkDatabaseHealth(pool);
  if (!health.ok) {
    throw new GateBDatabaseUnreachableError(health.error);
  }
  const result = await pool.query(
    `SELECT tablename
       FROM pg_catalog.pg_tables
      WHERE schemaname = 'public'
        AND tablename = ANY($1::text[])`,
    [GATE_B_REQUIRED_TABLES],
  );
  const found = new Set(result.rows.map((row) => String(row.tablename)));
  const missing = GATE_B_REQUIRED_TABLES.filter((name) => !found.has(name));
  if (missing.length > 0) {
    throw new GateBSchemaMissingError([...missing]);
  }
}

export function gateBTrackedResourceIds(ids: GateBCreatedIds): string[] {
  return [
    ...ids.opportunityIds,
    ...ids.rfpIds,
    ...ids.programmeIds,
    ...ids.costSheetIds,
    ...ids.approvalIds,
    ...ids.documentIds,
  ];
}

/**
 * audit_events is insert-only (BEFORE UPDATE OR DELETE trigger). The harness
 * never deletes audit rows. Isolation is by tracked resource ids and GBV markers.
 * Residue is expected on this disposable Dev/Test instance.
 */
export async function countAuditRowsForResourceIds(pool: DbPool, resourceIds: string[]): Promise<number> {
  if (resourceIds.length === 0) return 0;
  const result = await pool.query(
    `SELECT count(*)::int AS c FROM audit_events WHERE resource_id = ANY($1::text[])`,
    [resourceIds],
  );
  return Number(result.rows[0]?.c ?? 0);
}

/**
 * Delete only rows whose ids were created by this verification run.
 * Does not DELETE audit_events (insert-only trigger). Does not touch tenants/principals.
 * outbox_events.aggregate_id is TEXT in the existing schema — do not cast to uuid[].
 */
export async function cleanupGateBBusinessRows(pool: DbPool, ids: GateBCreatedIds): Promise<void> {
  const q = (sql: string, params: unknown[]) => pool.query(sql, params);
  if (ids.documentIds.length > 0) {
    await q(`DELETE FROM commercial_documents WHERE id = ANY($1::uuid[])`, [ids.documentIds]);
  }
  if (ids.approvalIds.length > 0) {
    await q(`DELETE FROM com_approval_requests WHERE id = ANY($1::uuid[])`, [ids.approvalIds]);
  }
  if (ids.costSheetIds.length > 0) {
    await q(`DELETE FROM cost_sheet_versions WHERE cost_sheet_id = ANY($1::uuid[])`, [ids.costSheetIds]);
    await q(`DELETE FROM cost_line_items WHERE cost_sheet_id = ANY($1::uuid[])`, [ids.costSheetIds]);
    await q(`DELETE FROM cost_sheets WHERE id = ANY($1::uuid[])`, [ids.costSheetIds]);
  }
  if (ids.programmeIds.length > 0) {
    await q(`DELETE FROM prg_programme_versions WHERE programme_id = ANY($1::uuid[])`, [ids.programmeIds]);
    await q(`DELETE FROM prg_items WHERE programme_id = ANY($1::uuid[])`, [ids.programmeIds]);
    await q(`DELETE FROM prg_days WHERE programme_id = ANY($1::uuid[])`, [ids.programmeIds]);
    await q(`DELETE FROM prg_programmes WHERE id = ANY($1::uuid[])`, [ids.programmeIds]);
  }
  if (ids.rfpIds.length > 0) {
    await q(`DELETE FROM rfp_versions WHERE rfp_id = ANY($1::uuid[])`, [ids.rfpIds]);
    await q(`DELETE FROM rfp_rfps WHERE id = ANY($1::uuid[])`, [ids.rfpIds]);
  }
  if (ids.opportunityIds.length > 0) {
    await q(`DELETE FROM opp_stage_history WHERE opportunity_id = ANY($1::uuid[])`, [ids.opportunityIds]);
    await q(`DELETE FROM opp_opportunities WHERE id = ANY($1::uuid[])`, [ids.opportunityIds]);
  }
  const aggregateIds = gateBTrackedResourceIds(ids);
  if (aggregateIds.length > 0) {
    await q(`DELETE FROM outbox_events WHERE aggregate_id = ANY($1::text[])`, [aggregateIds]);
  }
}

/** Intercept SQL on borrowed connections. Does not close the underlying pool. */
export function wrapPoolRejectingSql(pool: DbPool, sqlFragment: string, message: string): DbPool {
  return {
    query: pool.query.bind(pool),
    connect: async () => {
      const client = await pool.connect();
      const original = client.query.bind(client);
      const intercepted = (...args: unknown[]) => {
        const text =
          typeof args[0] === "string"
            ? args[0]
            : String((args[0] as { text?: string } | undefined)?.text ?? "");
        if (text.includes(sqlFragment)) {
          return Promise.reject(new Error(message));
        }
        return original(...(args as Parameters<typeof client.query>));
      };
      (client as { query: typeof client.query }).query = intercepted as typeof client.query;
      return client;
    },
    end: async () => undefined,
  } as DbPool;
}
