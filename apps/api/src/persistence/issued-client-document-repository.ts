import {
  assertIssuedClientDocumentPayloadSanitized,
  type IssuedClientDocument,
  type IssuedClientDocumentPayload,
} from "@sedmc/kernel/issued-client-document";
import { asNumberRequired, isoTimestamp, type Queryable } from "./durable.js";

function parseClientContent(value: unknown): IssuedClientDocumentPayload {
  const raw =
    typeof value === "string" ? (JSON.parse(value) as IssuedClientDocumentPayload) : (value as IssuedClientDocumentPayload);
  assertIssuedClientDocumentPayloadSanitized(raw);
  return raw;
}

export function mapIssuedClientDocumentRow(row: Record<string, unknown>): IssuedClientDocument {
  return {
    id: row.id as string,
    documentCode: row.document_code as string,
    kind: "issued_client_pdf",
    tenantId: row.tenant_id as string,
    issuedProposalId: row.issued_proposal_id as string,
    issuedCode: row.issued_code as string,
    documentType: "client_proposal_pdf",
    sequence: asNumberRequired(row.sequence),
    generatedAt: isoTimestamp(row.generated_at),
    generatedByPrincipalId: row.generated_by_principal_id as string,
    generationContext: "internal_document_generation",
    status: "generated",
    contentSha256: row.content_sha256 as string,
    artifactSha256: row.artifact_sha256 as string,
    mimeType: "application/pdf",
    sizeBytes: asNumberRequired(row.size_bytes),
    storageRef: row.storage_ref as string,
    clientContent: parseClientContent(row.client_content),
    immutable: true,
    createdAt: isoTimestamp(row.created_at),
  };
}

export async function insertIssuedClientDocument(client: Queryable, record: IssuedClientDocument): Promise<void> {
  assertIssuedClientDocumentPayloadSanitized(record.clientContent);
  await client.query(
    `INSERT INTO issued_client_documents (
      id, tenant_id, document_code, kind, issued_proposal_id, issued_code,
      document_type, sequence, generated_at, generated_by_principal_id, generation_context,
      status, content_sha256, artifact_sha256, mime_type, size_bytes, storage_ref,
      client_content, immutable, created_at
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18::jsonb,$19,$20
    )`,
    [
      record.id,
      record.tenantId,
      record.documentCode,
      record.kind,
      record.issuedProposalId,
      record.issuedCode,
      record.documentType,
      record.sequence,
      record.generatedAt,
      record.generatedByPrincipalId,
      record.generationContext,
      record.status,
      record.contentSha256,
      record.artifactSha256,
      record.mimeType,
      record.sizeBytes,
      record.storageRef,
      JSON.stringify(record.clientContent),
      true,
      record.createdAt,
    ],
  );
}

export async function getIssuedClientDocumentById(
  client: Queryable,
  tenantId: string,
  id: string,
): Promise<IssuedClientDocument | undefined> {
  const result = await client.query(
    `SELECT * FROM issued_client_documents WHERE id = $1 AND tenant_id = $2`,
    [id, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapIssuedClientDocumentRow(row) : undefined;
}

export async function listIssuedClientDocumentsByTenant(
  client: Queryable,
  tenantId: string,
  query?: { issuedProposalId?: string },
): Promise<IssuedClientDocument[]> {
  const clauses = [`tenant_id = $1`];
  const params: unknown[] = [tenantId];
  if (query?.issuedProposalId) {
    params.push(query.issuedProposalId);
    clauses.push(`issued_proposal_id = $${params.length}`);
  }
  const result = await client.query(
    `SELECT * FROM issued_client_documents WHERE ${clauses.join(" AND ")} ORDER BY generated_at DESC, sequence DESC`,
    params,
  );
  return (result.rows as Record<string, unknown>[]).map(mapIssuedClientDocumentRow);
}

export async function nextIssuedClientDocumentSequence(
  client: Queryable,
  tenantId: string,
  issuedProposalId: string,
): Promise<number> {
  const result = await client.query(
    `SELECT COALESCE(MAX(sequence), 0)::int AS c FROM issued_client_documents WHERE tenant_id = $1 AND issued_proposal_id = $2`,
    [tenantId, issuedProposalId],
  );
  return asNumberRequired(result.rows[0]?.c) + 1;
}
