import type { Classification, OppOpportunity, OppStageHistory, OpportunityStage, OpportunityStatus } from "@sedmc/kernel";
import { asNumber, asNumberRequired, dateOnly, isoTimestamp, type Queryable } from "./durable.js";

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

export function mapOpportunityRow(row: Record<string, unknown>): OppOpportunity {
  const opp: OppOpportunity = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    opportunityCode: row.opportunity_code as string,
    title: row.title as string,
    organizationId: row.organization_id as string,
    stage: row.stage as OpportunityStage,
    status: row.status as OpportunityStatus,
    ownerPrincipalId: row.owner_principal_id as string,
    classification: row.classification as Classification,
    version: asNumberRequired(row.version),
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
    updatedByPrincipalId: (row.updated_by_principal_id as string) ?? "",
  };
  const accountId = optionalString(row.account_id);
  if (accountId) opp.accountId = accountId;
  const programmeSummary = optionalString(row.programme_summary);
  if (programmeSummary) opp.programmeSummary = programmeSummary;
  const estimatedValue = asNumber(row.estimated_value);
  if (estimatedValue !== undefined) opp.estimatedValue = estimatedValue;
  const currency = optionalString(row.currency);
  if (currency) opp.currency = currency;
  const paxCount = asNumber(row.pax_count);
  if (paxCount !== undefined) opp.paxCount = paxCount;
  const expectedCloseDate = dateOnly(row.expected_close_date);
  if (expectedCloseDate) opp.expectedCloseDate = expectedCloseDate;
  if (row.archived_at) opp.archivedAt = isoTimestamp(row.archived_at);
  return opp;
}

export function mapStageHistoryRow(row: Record<string, unknown>): OppStageHistory {
  const history: OppStageHistory = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    opportunityId: row.opportunity_id as string,
    toStage: row.to_stage as OpportunityStage,
    changedAt: isoTimestamp(row.changed_at),
    changedByPrincipalId: (row.changed_by_principal_id as string) ?? "",
  };
  const fromStage = optionalString(row.from_stage);
  if (fromStage) history.fromStage = fromStage as OpportunityStage;
  const notes = optionalString(row.notes);
  if (notes) history.notes = notes;
  return history;
}

export async function insertOpportunity(client: Queryable, opp: OppOpportunity): Promise<void> {
  await client.query(
    `INSERT INTO opp_opportunities (
      id, tenant_id, opportunity_code, title, organization_id, account_id, stage, status,
      programme_summary, estimated_value, currency, pax_count, expected_close_date,
      owner_principal_id, classification, version, archived_at, created_at, updated_at,
      created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
    )`,
    [
      opp.id,
      opp.tenantId,
      opp.opportunityCode,
      opp.title,
      opp.organizationId,
      opp.accountId ?? null,
      opp.stage,
      opp.status,
      opp.programmeSummary ?? null,
      opp.estimatedValue ?? null,
      opp.currency ?? null,
      opp.paxCount ?? null,
      opp.expectedCloseDate ?? null,
      opp.ownerPrincipalId,
      opp.classification,
      opp.version,
      opp.archivedAt ?? null,
      opp.createdAt,
      opp.updatedAt,
      opp.createdByPrincipalId,
      opp.updatedByPrincipalId,
    ],
  );
}

export async function insertOpportunityStageHistory(client: Queryable, history: OppStageHistory): Promise<void> {
  await client.query(
    `INSERT INTO opp_stage_history (
      id, tenant_id, opportunity_id, from_stage, to_stage, changed_at, changed_by_principal_id, notes
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      history.id,
      history.tenantId,
      history.opportunityId,
      history.fromStage ?? null,
      history.toStage,
      history.changedAt,
      history.changedByPrincipalId,
      history.notes ?? null,
    ],
  );
}

export async function updateOpportunityOptimistic(client: Queryable, opp: OppOpportunity, expectedVersion: number): Promise<number> {
  const result = await client.query(
    `UPDATE opp_opportunities SET
      title = $3, organization_id = $4, account_id = $5, stage = $6, status = $7,
      programme_summary = $8, estimated_value = $9, currency = $10, pax_count = $11,
      expected_close_date = $12, owner_principal_id = $13, classification = $14,
      version = $15, archived_at = $16, updated_at = $17, updated_by_principal_id = $18
     WHERE id = $1 AND tenant_id = $2 AND version = $19 AND archived_at IS NULL`,
    [
      opp.id,
      opp.tenantId,
      opp.title,
      opp.organizationId,
      opp.accountId ?? null,
      opp.stage,
      opp.status,
      opp.programmeSummary ?? null,
      opp.estimatedValue ?? null,
      opp.currency ?? null,
      opp.paxCount ?? null,
      opp.expectedCloseDate ?? null,
      opp.ownerPrincipalId,
      opp.classification,
      opp.version,
      opp.archivedAt ?? null,
      opp.updatedAt,
      opp.updatedByPrincipalId,
      expectedVersion,
    ],
  );
  return result.rowCount ?? 0;
}

export async function getOpportunityById(
  client: Queryable,
  tenantId: string,
  id: string,
): Promise<OppOpportunity | undefined> {
  const result = await client.query(
    `SELECT * FROM opp_opportunities WHERE id = $1 AND tenant_id = $2 AND archived_at IS NULL`,
    [id, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapOpportunityRow(row) : undefined;
}

export async function opportunityCodeExists(
  client: Queryable,
  tenantId: string,
  code: string,
): Promise<boolean> {
  const result = await client.query(
    `SELECT 1 FROM opp_opportunities WHERE tenant_id = $1 AND opportunity_code = $2`,
    [tenantId, code],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function listOpportunitiesByTenant(
  client: Queryable,
  tenantId: string,
  query?: { stage?: string; organizationId?: string; status?: string },
): Promise<OppOpportunity[]> {
  const clauses = [`tenant_id = $1`, `archived_at IS NULL`];
  const params: unknown[] = [tenantId];
  if (query?.stage) {
    params.push(query.stage);
    clauses.push(`stage = $${params.length}`);
  }
  if (query?.organizationId) {
    params.push(query.organizationId);
    clauses.push(`organization_id = $${params.length}`);
  }
  if (query?.status) {
    params.push(query.status);
    clauses.push(`status = $${params.length}`);
  }
  const result = await client.query(
    `SELECT * FROM opp_opportunities WHERE ${clauses.join(" AND ")} ORDER BY updated_at DESC`,
    params,
  );
  return (result.rows as Record<string, unknown>[]).map(mapOpportunityRow);
}

export async function countOpportunities(client: Queryable, tenantId: string): Promise<number> {
  const result = await client.query(
    `SELECT COUNT(*)::int AS c FROM opp_opportunities WHERE tenant_id = $1 AND archived_at IS NULL`,
    [tenantId],
  );
  return asNumberRequired(result.rows[0]?.c);
}

export async function listStageHistory(
  client: Queryable,
  tenantId: string,
  opportunityId: string,
): Promise<OppStageHistory[]> {
  const result = await client.query(
    `SELECT * FROM opp_stage_history WHERE tenant_id = $1 AND opportunity_id = $2 ORDER BY changed_at DESC`,
    [tenantId, opportunityId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapStageHistoryRow);
}
