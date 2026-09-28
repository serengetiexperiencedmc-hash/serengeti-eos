import type { Classification, ComApprovalGateType, ComApprovalRequest, ComApprovalStatus } from "@sedmc/kernel";
import { asNumber, asNumberRequired, isoTimestamp, type Queryable } from "./durable.js";

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

export function mapApprovalRow(row: Record<string, unknown>): ComApprovalRequest {
  const r: ComApprovalRequest = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    requestCode: row.request_code as string,
    costSheetId: row.cost_sheet_id as string,
    rfpId: row.rfp_id as string,
    programmeId: row.programme_id as string,
    organizationId: row.organization_id as string,
    status: row.status as ComApprovalStatus,
    gateType: row.gate_type as ComApprovalGateType,
    gateReason: row.gate_reason as string,
    marginPercent: asNumberRequired(row.margin_percent),
    marginFloorPercent: asNumberRequired(row.margin_floor_percent),
    totalCost: asNumberRequired(row.total_cost),
    sellPrice: asNumberRequired(row.sell_price),
    currency: (row.currency as string) ?? "USD",
    marginMeetsFloor: Boolean(row.margin_meets_floor),
    requestedByPrincipalId: row.requested_by_principal_id as string,
    classification: row.classification as Classification,
    version: asNumberRequired(row.version),
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
  };
  const decidedBy = optionalString(row.decided_by_principal_id);
  if (decidedBy) r.decidedByPrincipalId = decidedBy;
  if (row.decided_at) r.decidedAt = isoTimestamp(row.decided_at);
  const notes = optionalString(row.decision_notes);
  if (notes) r.decisionNotes = notes;
  return r;
}

export async function insertApprovalRequest(client: Queryable, r: ComApprovalRequest): Promise<void> {
  await client.query(
    `INSERT INTO com_approval_requests (
      id, tenant_id, request_code, cost_sheet_id, rfp_id, programme_id, organization_id, status,
      gate_type, gate_reason, margin_percent, margin_floor_percent, total_cost, sell_price, currency,
      margin_meets_floor, requested_by_principal_id, decided_by_principal_id, decided_at, decision_notes,
      classification, version, created_at, updated_at
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
    )`,
    [
      r.id,
      r.tenantId,
      r.requestCode,
      r.costSheetId,
      r.rfpId,
      r.programmeId,
      r.organizationId,
      r.status,
      r.gateType,
      r.gateReason,
      r.marginPercent,
      r.marginFloorPercent,
      r.totalCost,
      r.sellPrice,
      r.currency,
      r.marginMeetsFloor,
      r.requestedByPrincipalId,
      r.decidedByPrincipalId ?? null,
      r.decidedAt ?? null,
      r.decisionNotes ?? null,
      r.classification,
      r.version,
      r.createdAt,
      r.updatedAt,
    ],
  );
}

export async function updateApprovalOptimistic(
  client: Queryable,
  r: ComApprovalRequest,
  expectedVersion: number,
): Promise<number> {
  const result = await client.query(
    `UPDATE com_approval_requests SET
      status = $3, decided_by_principal_id = $4, decided_at = $5, decision_notes = $6,
      version = $7, updated_at = $8
     WHERE id = $1 AND tenant_id = $2 AND version = $9`,
    [
      r.id,
      r.tenantId,
      r.status,
      r.decidedByPrincipalId ?? null,
      r.decidedAt ?? null,
      r.decisionNotes ?? null,
      r.version,
      r.updatedAt,
      expectedVersion,
    ],
  );
  return result.rowCount ?? 0;
}

export async function getApprovalById(
  client: Queryable,
  tenantId: string,
  id: string,
): Promise<ComApprovalRequest | undefined> {
  const result = await client.query(`SELECT * FROM com_approval_requests WHERE id = $1 AND tenant_id = $2`, [
    id,
    tenantId,
  ]);
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapApprovalRow(row) : undefined;
}

export async function findLatestApprovedApprovalForProgramme(
  client: Queryable,
  tenantId: string,
  programmeId: string,
): Promise<ComApprovalRequest | undefined> {
  const result = await client.query(
    `SELECT * FROM com_approval_requests
     WHERE tenant_id = $1 AND programme_id = $2 AND status = 'approved'
     ORDER BY COALESCE(decided_at, updated_at) DESC
     LIMIT 1`,
    [tenantId, programmeId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapApprovalRow(row) : undefined;
}

export async function findPendingApprovalForSheet(
  client: Queryable,
  tenantId: string,
  costSheetId: string,
): Promise<ComApprovalRequest | undefined> {
  const result = await client.query(
    `SELECT * FROM com_approval_requests WHERE tenant_id = $1 AND cost_sheet_id = $2 AND status = 'pending'`,
    [tenantId, costSheetId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapApprovalRow(row) : undefined;
}

export async function listApprovalsByTenant(
  client: Queryable,
  tenantId: string,
  query?: { costSheetId?: string; rfpId?: string; status?: string },
): Promise<ComApprovalRequest[]> {
  const clauses = [`tenant_id = $1`];
  const params: unknown[] = [tenantId];
  if (query?.costSheetId) {
    params.push(query.costSheetId);
    clauses.push(`cost_sheet_id = $${params.length}`);
  }
  if (query?.rfpId) {
    params.push(query.rfpId);
    clauses.push(`rfp_id = $${params.length}`);
  }
  if (query?.status) {
    params.push(query.status);
    clauses.push(`status = $${params.length}`);
  }
  const result = await client.query(
    `SELECT * FROM com_approval_requests WHERE ${clauses.join(" AND ")} ORDER BY created_at DESC`,
    params,
  );
  return (result.rows as Record<string, unknown>[]).map(mapApprovalRow);
}

export async function countApprovals(
  client: Queryable,
  tenantId: string,
): Promise<{ requests: number; pending: number }> {
  const all = await client.query(`SELECT COUNT(*)::int AS c FROM com_approval_requests WHERE tenant_id = $1`, [
    tenantId,
  ]);
  const pending = await client.query(
    `SELECT COUNT(*)::int AS c FROM com_approval_requests WHERE tenant_id = $1 AND status = 'pending'`,
    [tenantId],
  );
  return { requests: asNumberRequired(all.rows[0]?.c), pending: asNumberRequired(pending.rows[0]?.c) };
}

export async function requestCodeExists(client: Queryable, tenantId: string, code: string): Promise<boolean> {
  const result = await client.query(
    `SELECT 1 FROM com_approval_requests WHERE tenant_id = $1 AND request_code = $2`,
    [tenantId, code],
  );
  return (result.rowCount ?? 0) > 0;
}
