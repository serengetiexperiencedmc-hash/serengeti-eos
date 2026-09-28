import type {
  Classification,
  CommercialDocument,
  CommercialDocumentKind,
  CommercialDocumentStatus,
} from "@sedmc/kernel";
import { asNumberRequired, isoTimestamp, type Queryable } from "./durable.js";

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

export function mapDocumentRow(row: Record<string, unknown>): CommercialDocument {
  const d: CommercialDocument = {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    kind: row.kind as CommercialDocumentKind,
    status: row.status as CommercialDocumentStatus,
    filename: row.filename as string,
    mimeType: row.mime_type as string,
    sizeBytes: asNumberRequired(row.size_bytes),
    checksumSha256: row.checksum_sha256 as string,
    storageRef: row.storage_ref as string,
    version: asNumberRequired(row.version),
    classification: row.classification as Classification,
    createdAt: isoTimestamp(row.created_at),
    updatedAt: isoTimestamp(row.updated_at),
    createdByPrincipalId: (row.created_by_principal_id as string) ?? "",
    updatedByPrincipalId: (row.updated_by_principal_id as string) ?? "",
  };
  const rfpId = optionalString(row.rfp_id);
  if (rfpId) d.rfpId = rfpId;
  const supplierId = optionalString(row.supplier_id);
  if (supplierId) d.supplierId = supplierId;
  const contractId = optionalString(row.contract_id);
  if (contractId) d.contractId = contractId;
  return d;
}

export async function insertCommercialDocument(client: Queryable, d: CommercialDocument): Promise<void> {
  await client.query(
    `INSERT INTO commercial_documents (
      id, tenant_id, kind, status, filename, mime_type, size_bytes, checksum_sha256, storage_ref,
      version, rfp_id, supplier_id, contract_id, classification, created_at, updated_at,
      created_by_principal_id, updated_by_principal_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
    )`,
    [
      d.id,
      d.tenantId,
      d.kind,
      d.status,
      d.filename,
      d.mimeType,
      d.sizeBytes,
      d.checksumSha256,
      d.storageRef,
      d.version,
      d.rfpId ?? null,
      d.supplierId ?? null,
      d.contractId ?? null,
      d.classification,
      d.createdAt,
      d.updatedAt,
      d.createdByPrincipalId,
      d.updatedByPrincipalId,
    ],
  );
}

export async function getCommercialDocumentById(
  client: Queryable,
  tenantId: string,
  id: string,
): Promise<CommercialDocument | undefined> {
  const result = await client.query(
    `SELECT * FROM commercial_documents WHERE id = $1 AND tenant_id = $2 AND status <> 'deleted'`,
    [id, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapDocumentRow(row) : undefined;
}

export async function listDocumentsForRfp(
  client: Queryable,
  tenantId: string,
  rfpId: string,
): Promise<CommercialDocument[]> {
  const result = await client.query(
    `SELECT * FROM commercial_documents
     WHERE tenant_id = $1 AND rfp_id = $2 AND status = 'active'
     ORDER BY created_at DESC`,
    [tenantId, rfpId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapDocumentRow);
}
