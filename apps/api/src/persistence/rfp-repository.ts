import type { Classification, RfpRecord, RfpStatus, RfpVersion, RfpWorkflowStage } from "@sedmc/kernel";
import { asNumber, asNumberRequired, isoTimestamp, type Queryable } from "./durable.js";

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

export function mapRfpRow(row: Record<string, unknown>): RfpRecord {
  const rfp: RfpRecord = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    rfpCode: row.rfp_code as string,
    opportunityId: row.opportunity_id as string,
    organizationId: row.organization_id as string,
    title: row.title as string,
    workflowStage: row.workflow_stage as RfpWorkflowStage,
    status: row.status as RfpStatus,
    currentVersion: asNumberRequired(row.current_version),
    classification: row.classification as Classification,
    version: asNumberRequired(row.version),
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
    updatedByPrincipalId: (row.updated_by_principal_id as string) ?? "",
  };
  const programmeType = optionalString(row.programme_type);
  if (programmeType) rfp.programmeType = programmeType;
  const paxCount = asNumber(row.pax_count);
  if (paxCount !== undefined) rfp.paxCount = paxCount;
  const travelDates = optionalString(row.travel_dates);
  if (travelDates) rfp.travelDates = travelDates;
  const destinations = optionalString(row.destinations);
  if (destinations) rfp.destinations = destinations;
  const budgetMin = asNumber(row.budget_min);
  if (budgetMin !== undefined) rfp.budgetMin = budgetMin;
  const budgetMax = asNumber(row.budget_max);
  if (budgetMax !== undefined) rfp.budgetMax = budgetMax;
  const currency = optionalString(row.currency);
  if (currency) rfp.currency = currency;
  const requirementsText = optionalString(row.requirements_text);
  if (requirementsText) rfp.requirementsText = requirementsText;
  const notes = optionalString(row.notes);
  if (notes) rfp.notes = notes;
  const source = optionalString(row.source);
  if (source) rfp.source = source;
  if (row.received_at) rfp.receivedAt = isoTimestamp(row.received_at);
  if (row.sla_due_at) rfp.slaDueAt = isoTimestamp(row.sla_due_at);
  const assigned = optionalString(row.assigned_principal_id);
  if (assigned) rfp.assignedPrincipalId = assigned;
  if (row.archived_at) rfp.archivedAt = isoTimestamp(row.archived_at);
  return rfp;
}

export function mapRfpVersionRow(row: Record<string, unknown>): RfpVersion {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    rfpId: row.rfp_id as string,
    versionNumber: asNumberRequired(row.version_number),
    summary: row.summary as string,
    createdAt: isoTimestamp(row.created_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
  };
}

export async function insertRfp(client: Queryable, rfp: RfpRecord): Promise<void> {
  await client.query(
    `INSERT INTO rfp_rfps (
      id, tenant_id, rfp_code, opportunity_id, organization_id, title, workflow_stage, status,
      programme_type, pax_count, travel_dates, destinations, budget_min, budget_max, currency,
      requirements_text, notes, source, received_at, sla_due_at, sla_status, assigned_principal_id,
      current_version, classification, version, archived_at, created_at, updated_at,
      created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30
    )`,
    [
      rfp.id,
      rfp.tenantId,
      rfp.rfpCode,
      rfp.opportunityId,
      rfp.organizationId,
      rfp.title,
      rfp.workflowStage,
      rfp.status,
      rfp.programmeType ?? null,
      rfp.paxCount ?? null,
      rfp.travelDates ?? null,
      rfp.destinations ?? null,
      rfp.budgetMin ?? null,
      rfp.budgetMax ?? null,
      rfp.currency ?? "USD",
      rfp.requirementsText ?? null,
      rfp.notes ?? null,
      rfp.source ?? null,
      rfp.receivedAt ?? null,
      rfp.slaDueAt ?? null,
      rfp.slaStatus ?? null,
      rfp.assignedPrincipalId ?? null,
      rfp.currentVersion,
      rfp.classification,
      rfp.version,
      rfp.archivedAt ?? null,
      rfp.createdAt,
      rfp.updatedAt,
      rfp.createdByPrincipalId,
      rfp.updatedByPrincipalId,
    ],
  );
}

export async function insertRfpVersion(client: Queryable, version: RfpVersion): Promise<void> {
  await client.query(
    `INSERT INTO rfp_versions (
      id, tenant_id, rfp_id, version_number, summary, created_at, created_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      version.id,
      version.tenantId,
      version.rfpId,
      version.versionNumber,
      version.summary,
      version.createdAt,
      version.createdByPrincipalId,
    ],
  );
}

export async function updateRfpOptimistic(client: Queryable, rfp: RfpRecord, expectedVersion: number): Promise<number> {
  const result = await client.query(
    `UPDATE rfp_rfps SET
      title = $3, workflow_stage = $4, status = $5, programme_type = $6, pax_count = $7,
      travel_dates = $8, destinations = $9, budget_min = $10, budget_max = $11, currency = $12,
      requirements_text = $13, notes = $14, source = $15, received_at = $16, sla_due_at = $17,
      sla_status = $18, assigned_principal_id = $19, current_version = $20, classification = $21,
      version = $22, archived_at = $23, updated_at = $24, updated_by_principal_id = $25
     WHERE id = $1 AND tenant_id = $2 AND version = $26 AND archived_at IS NULL`,
    [
      rfp.id,
      rfp.tenantId,
      rfp.title,
      rfp.workflowStage,
      rfp.status,
      rfp.programmeType ?? null,
      rfp.paxCount ?? null,
      rfp.travelDates ?? null,
      rfp.destinations ?? null,
      rfp.budgetMin ?? null,
      rfp.budgetMax ?? null,
      rfp.currency ?? "USD",
      rfp.requirementsText ?? null,
      rfp.notes ?? null,
      rfp.source ?? null,
      rfp.receivedAt ?? null,
      rfp.slaDueAt ?? null,
      rfp.slaStatus ?? null,
      rfp.assignedPrincipalId ?? null,
      rfp.currentVersion,
      rfp.classification,
      rfp.version,
      rfp.archivedAt ?? null,
      rfp.updatedAt,
      rfp.updatedByPrincipalId,
      expectedVersion,
    ],
  );
  return result.rowCount ?? 0;
}

export async function getRfpById(client: Queryable, tenantId: string, id: string): Promise<RfpRecord | undefined> {
  const result = await client.query(
    `SELECT * FROM rfp_rfps WHERE id = $1 AND tenant_id = $2 AND archived_at IS NULL`,
    [id, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapRfpRow(row) : undefined;
}

export async function rfpCodeExists(client: Queryable, tenantId: string, code: string): Promise<boolean> {
  const result = await client.query(`SELECT 1 FROM rfp_rfps WHERE tenant_id = $1 AND rfp_code = $2`, [tenantId, code]);
  return (result.rowCount ?? 0) > 0;
}

export async function listRfpsByTenant(
  client: Queryable,
  tenantId: string,
  query?: { opportunityId?: string; workflowStage?: string; status?: string },
): Promise<RfpRecord[]> {
  const clauses = [`tenant_id = $1`, `archived_at IS NULL`];
  const params: unknown[] = [tenantId];
  if (query?.opportunityId) {
    params.push(query.opportunityId);
    clauses.push(`opportunity_id = $${params.length}`);
  }
  if (query?.workflowStage) {
    params.push(query.workflowStage);
    clauses.push(`workflow_stage = $${params.length}`);
  }
  if (query?.status) {
    params.push(query.status);
    clauses.push(`status = $${params.length}`);
  }
  const result = await client.query(
    `SELECT * FROM rfp_rfps WHERE ${clauses.join(" AND ")} ORDER BY updated_at DESC`,
    params,
  );
  return (result.rows as Record<string, unknown>[]).map(mapRfpRow);
}

export async function countRfps(client: Queryable, tenantId: string): Promise<{ rfps: number; versions: number }> {
  const rfps = await client.query(
    `SELECT COUNT(*)::int AS c FROM rfp_rfps WHERE tenant_id = $1 AND archived_at IS NULL`,
    [tenantId],
  );
  const versions = await client.query(`SELECT COUNT(*)::int AS c FROM rfp_versions WHERE tenant_id = $1`, [tenantId]);
  return { rfps: asNumberRequired(rfps.rows[0]?.c), versions: asNumberRequired(versions.rows[0]?.c) };
}

export async function listRfpVersions(client: Queryable, tenantId: string, rfpId: string): Promise<RfpVersion[]> {
  const result = await client.query(
    `SELECT * FROM rfp_versions WHERE tenant_id = $1 AND rfp_id = $2 ORDER BY version_number DESC`,
    [tenantId, rfpId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapRfpVersionRow);
}
