import type {
  Classification,
  ProposalStatus,
  PropProposal,
  PropProposalSnapshot,
  PropProposalVersion,
} from "@sedmc/kernel";
import { asNumber, asNumberRequired, isoTimestamp, type Queryable } from "./durable.js";

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

export function mapProposalRow(row: Record<string, unknown>): PropProposal {
  const p: PropProposal = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    proposalCode: row.proposal_code as string,
    rfpId: row.rfp_id as string,
    programmeId: row.programme_id as string,
    costSheetId: row.cost_sheet_id as string,
    organizationId: row.organization_id as string,
    title: row.title as string,
    status: row.status as ProposalStatus,
    currency: (row.currency as string) ?? "USD",
    totalCost: asNumberRequired(row.total_cost),
    sellPrice: asNumberRequired(row.sell_price),
    marginPercent: asNumberRequired(row.margin_percent),
    itineraryDayCount: asNumberRequired(row.itinerary_day_count),
    currentVersion: asNumberRequired(row.current_version),
    classification: row.classification as Classification,
    version: asNumberRequired(row.version),
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
    updatedByPrincipalId: (row.updated_by_principal_id as string) ?? "",
  };
  const approvalRequestId = optionalString(row.approval_request_id);
  if (approvalRequestId) p.approvalRequestId = approvalRequestId;
  const paxCount = asNumber(row.pax_count);
  if (paxCount !== undefined) p.paxCount = paxCount;
  const programmeSummary = optionalString(row.programme_summary);
  if (programmeSummary) p.programmeSummary = programmeSummary;
  if (row.sent_at) p.sentAt = isoTimestamp(row.sent_at);
  if (row.client_viewed_at) p.clientViewedAt = isoTimestamp(row.client_viewed_at);
  if (row.archived_at) p.archivedAt = isoTimestamp(row.archived_at);
  return p;
}

export function mapProposalVersionRow(row: Record<string, unknown>): PropProposalVersion {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    proposalId: row.proposal_id as string,
    versionNumber: asNumberRequired(row.version_number),
    summary: row.summary as string,
    snapshot: (row.snapshot as PropProposalSnapshot) ?? {
      programmeTitle: "Programme",
      itineraryDayCount: 0,
      itineraryItemCount: 0,
      totalCost: 0,
      sellPrice: 0,
      marginPercent: 0,
      currency: "USD",
      categoryTotals: {},
    },
    createdAt: isoTimestamp(row.created_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
  };
}

export async function insertProposal(client: Queryable, p: PropProposal): Promise<void> {
  await client.query(
    `INSERT INTO prop_proposals (
      id, tenant_id, proposal_code, rfp_id, programme_id, cost_sheet_id, approval_request_id,
      organization_id, title, status, currency, total_cost, sell_price, margin_percent, pax_count,
      programme_summary, itinerary_day_count, sent_at, client_viewed_at, current_version,
      classification, version, archived_at, created_at, updated_at,
      created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27
    )`,
    [
      p.id,
      p.tenantId,
      p.proposalCode,
      p.rfpId,
      p.programmeId,
      p.costSheetId,
      p.approvalRequestId,
      p.organizationId,
      p.title,
      p.status,
      p.currency,
      p.totalCost,
      p.sellPrice,
      p.marginPercent,
      p.paxCount ?? null,
      p.programmeSummary ?? null,
      p.itineraryDayCount,
      p.sentAt ?? null,
      p.clientViewedAt ?? null,
      p.currentVersion,
      p.classification,
      p.version,
      p.archivedAt ?? null,
      p.createdAt,
      p.updatedAt,
      p.createdByPrincipalId,
      p.updatedByPrincipalId,
    ],
  );
}

export async function insertProposalVersion(client: Queryable, v: PropProposalVersion): Promise<void> {
  await client.query(
    `INSERT INTO prop_proposal_versions (
      id, tenant_id, proposal_id, version_number, summary, snapshot, created_at, created_by_principal_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [v.id, v.tenantId, v.proposalId, v.versionNumber, v.summary, v.snapshot, v.createdAt, v.createdByPrincipalId],
  );
}

export async function getProposalById(
  client: Queryable,
  tenantId: string,
  id: string,
): Promise<PropProposal | undefined> {
  const result = await client.query(
    `SELECT * FROM prop_proposals WHERE id = $1 AND tenant_id = $2 AND archived_at IS NULL`,
    [id, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapProposalRow(row) : undefined;
}

export async function getProposalByRfpId(
  client: Queryable,
  tenantId: string,
  rfpId: string,
): Promise<PropProposal | undefined> {
  const result = await client.query(
    `SELECT * FROM prop_proposals WHERE tenant_id = $1 AND rfp_id = $2 AND archived_at IS NULL`,
    [tenantId, rfpId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapProposalRow(row) : undefined;
}

export async function proposalCodeExists(client: Queryable, tenantId: string, code: string): Promise<boolean> {
  const result = await client.query(
    `SELECT 1 FROM prop_proposals WHERE tenant_id = $1 AND proposal_code = $2`,
    [tenantId, code],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function listProposalsByTenant(
  client: Queryable,
  tenantId: string,
  query?: { rfpId?: string; status?: string; organizationId?: string },
): Promise<PropProposal[]> {
  const clauses = [`tenant_id = $1`, `archived_at IS NULL`];
  const params: unknown[] = [tenantId];
  if (query?.rfpId) {
    params.push(query.rfpId);
    clauses.push(`rfp_id = $${params.length}`);
  }
  if (query?.status) {
    params.push(query.status);
    clauses.push(`status = $${params.length}`);
  }
  if (query?.organizationId) {
    params.push(query.organizationId);
    clauses.push(`organization_id = $${params.length}`);
  }
  const result = await client.query(
    `SELECT * FROM prop_proposals WHERE ${clauses.join(" AND ")} ORDER BY updated_at DESC`,
    params,
  );
  return (result.rows as Record<string, unknown>[]).map(mapProposalRow);
}

export async function listProposalVersions(
  client: Queryable,
  tenantId: string,
  proposalId: string,
): Promise<PropProposalVersion[]> {
  const result = await client.query(
    `SELECT * FROM prop_proposal_versions WHERE tenant_id = $1 AND proposal_id = $2 ORDER BY version_number DESC`,
    [tenantId, proposalId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapProposalVersionRow);
}
