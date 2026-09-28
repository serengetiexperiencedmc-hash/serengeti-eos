import {
  issuedClientSafeContainsForbidden,
  pickIssuedClientSafe,
  type ClientIssueApprovalAuthority,
  type IssuedClientSafeRepresentation,
  type IssuedProposal,
} from "@sedmc/kernel/issued-proposal";
import { asNumber, isoTimestamp, type Queryable } from "./durable.js";

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

function parseClientSafe(value: unknown): IssuedClientSafeRepresentation {
  const raw = typeof value === "string" ? (JSON.parse(value) as Record<string, unknown>) : (value as Record<string, unknown>);
  return pickIssuedClientSafe(raw ?? {});
}

export function mapIssuedProposalRow(row: Record<string, unknown>): IssuedProposal {
  const clientSafe = parseClientSafe(row.client_safe);
  const record: IssuedProposal = {
    id: row.id as string,
    issuedCode: row.issued_code as string,
    kind: "issued_proposal",
    tenantId: row.tenant_id as string,
    programmeId: row.programme_id as string,
    rfpId: row.rfp_id as string,
    programmeCommercialVersionLabel: "final",
    clientSafe,
    issuedAt: isoTimestamp(row.issued_at),
    issuedByPrincipalId: row.issued_by_principal_id as string,
    approvalAuthority: row.approval_authority as ClientIssueApprovalAuthority,
    approvalRecordedAt: isoTimestamp(row.approval_recorded_at),
    immutable: true,
    createdAt: isoTimestamp(row.created_at),
  };
  const c8 = optionalString(row.c8_proposal_id);
  if (c8) record.c8ProposalId = c8;
  const versionNumber = asNumber(row.programme_version_number);
  if (versionNumber !== undefined) record.programmeVersionNumber = versionNumber;
  const versionId = optionalString(row.programme_version_id);
  if (versionId) record.programmeVersionId = versionId;
  const approvalRequestId = optionalString(row.approval_request_id);
  if (approvalRequestId) record.approvalRequestId = approvalRequestId;
  return record;
}

export async function insertIssuedProposal(client: Queryable, record: IssuedProposal): Promise<void> {
  if (issuedClientSafeContainsForbidden(record.clientSafe as unknown as Record<string, unknown>)) {
    throw new Error("issued_client_safe_contains_forbidden");
  }
  await client.query(
    `INSERT INTO issued_proposals (
      id, tenant_id, issued_code, kind, programme_id, rfp_id, c8_proposal_id,
      programme_commercial_version_label, programme_version_number, programme_version_id,
      issued_by_principal_id, approval_authority, approval_request_id,
      issued_at, approval_recorded_at, client_safe, immutable, created_at
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb,$17,$18
    )`,
    [
      record.id,
      record.tenantId,
      record.issuedCode,
      record.kind,
      record.programmeId,
      record.rfpId,
      record.c8ProposalId ?? null,
      record.programmeCommercialVersionLabel,
      record.programmeVersionNumber ?? null,
      record.programmeVersionId ?? null,
      record.issuedByPrincipalId,
      record.approvalAuthority,
      record.approvalRequestId ?? null,
      record.issuedAt,
      record.approvalRecordedAt,
      JSON.stringify(pickIssuedClientSafe(record.clientSafe as unknown as Record<string, unknown>)),
      true,
      record.createdAt,
    ],
  );
}

export async function getIssuedProposalById(
  client: Queryable,
  tenantId: string,
  id: string,
): Promise<IssuedProposal | undefined> {
  const result = await client.query(`SELECT * FROM issued_proposals WHERE id = $1 AND tenant_id = $2`, [id, tenantId]);
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapIssuedProposalRow(row) : undefined;
}

export async function listIssuedProposalsByTenant(
  client: Queryable,
  tenantId: string,
  query?: { programmeId?: string },
): Promise<IssuedProposal[]> {
  const clauses = [`tenant_id = $1`];
  const params: unknown[] = [tenantId];
  if (query?.programmeId) {
    params.push(query.programmeId);
    clauses.push(`programme_id = $${params.length}`);
  }
  const result = await client.query(
    `SELECT * FROM issued_proposals WHERE ${clauses.join(" AND ")} ORDER BY issued_at DESC`,
    params,
  );
  return (result.rows as Record<string, unknown>[]).map(mapIssuedProposalRow);
}

export async function countIssuedProposalsByTenant(client: Queryable, tenantId: string): Promise<number> {
  const result = await client.query(`SELECT COUNT(*)::int AS c FROM issued_proposals WHERE tenant_id = $1`, [
    tenantId,
  ]);
  return asNumber(result.rows[0]?.c) ?? 0;
}

export async function issuedCodeExists(client: Queryable, tenantId: string, issuedCode: string): Promise<boolean> {
  const result = await client.query(`SELECT 1 FROM issued_proposals WHERE tenant_id = $1 AND issued_code = $2`, [
    tenantId,
    issuedCode,
  ]);
  return (result.rowCount ?? 0) > 0;
}
