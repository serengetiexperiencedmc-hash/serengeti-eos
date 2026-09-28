import type {
  IssuedClientDocumentDelivery,
  IssuedClientDocumentDeliveryAttempt,
} from "@sedmc/kernel/issued-client-document-delivery";
import type { ClientIssueApprovalAuthority } from "@sedmc/kernel/issued-proposal";
import { asNumberRequired, isoTimestamp, type Queryable } from "./durable.js";

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value);
  return s.length > 0 ? s : undefined;
}

export function mapIssuedClientDocumentDeliveryRow(row: Record<string, unknown>): IssuedClientDocumentDelivery {
  return {
    id: row.id as string,
    deliveryCode: row.delivery_code as string,
    kind: "issued_client_document_delivery",
    tenantId: row.tenant_id as string,
    issuedClientDocumentId: row.issued_client_document_id as string,
    documentCode: row.document_code as string,
    issuedProposalId: row.issued_proposal_id as string,
    issuedCode: row.issued_code as string,
    programmeId: row.programme_id as string,
    relatedOrganizationId: row.related_organization_id as string,
    recipientEmail: row.recipient_email as string,
    recipientConfirmed: true,
    senderKey: "h203.devtest.organizational_sender",
    senderOrganizationName: "Serengeti Experience DMC",
    senderAddress: "noreply@sedmc.invalid",
    senderMode: "devtest-mock",
    authorizationPrincipalId: row.authorization_principal_id as string,
    authorizationAuthority: row.authorization_authority as ClientIssueApprovalAuthority,
    authorizedAt: isoTimestamp(row.authorized_at),
    contentSha256: row.content_sha256 as string,
    artifactSha256: row.artifact_sha256 as string,
    idempotencyKey: row.idempotency_key as string,
    templateVersion: "h203-del-v1",
    authorizeSupersededDocument: row.authorize_superseded_document === true,
    state: "queued",
    immutable: true,
    createdAt: isoTimestamp(row.created_at),
  };
}

export function mapIssuedClientDocumentDeliveryAttemptRow(
  row: Record<string, unknown>,
): IssuedClientDocumentDeliveryAttempt {
  const record: IssuedClientDocumentDeliveryAttempt = {
    id: row.id as string,
    attemptCode: row.attempt_code as string,
    kind: "issued_client_document_delivery_attempt",
    tenantId: row.tenant_id as string,
    deliveryId: row.delivery_id as string,
    deliveryCode: row.delivery_code as string,
    issuedClientDocumentId: row.issued_client_document_id as string,
    issuedProposalId: row.issued_proposal_id as string,
    recipientEmail: row.recipient_email as string,
    contentSha256: row.content_sha256 as string,
    artifactSha256: row.artifact_sha256 as string,
    attemptNumber: asNumberRequired(row.attempt_number),
    requestedAt: isoTimestamp(row.requested_at),
    result: row.result as IssuedClientDocumentDeliveryAttempt["result"],
    recipientDelivered: false,
    providerName: "devtest-mock",
    actorPrincipalId: row.actor_principal_id as string,
    immutable: true,
    createdAt: isoTimestamp(row.created_at),
  };
  const failureReason = optionalString(row.failure_reason);
  if (failureReason) record.failureReason = failureReason;
  const providerReference = optionalString(row.provider_reference);
  if (providerReference) record.providerReference = providerReference;
  return record;
}

export async function insertIssuedClientDocumentDelivery(
  client: Queryable,
  record: IssuedClientDocumentDelivery,
): Promise<void> {
  await client.query(
    `INSERT INTO issued_client_document_deliveries (
      id, tenant_id, delivery_code, kind, issued_client_document_id, document_code,
      issued_proposal_id, issued_code, programme_id, related_organization_id, recipient_email,
      recipient_confirmed, sender_key, sender_organization_name, sender_address, sender_mode,
      authorization_principal_id, authorization_authority, authorized_at, content_sha256,
      artifact_sha256, idempotency_key, template_version, authorize_superseded_document,
      state, immutable, created_at
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27
    )`,
    [
      record.id,
      record.tenantId,
      record.deliveryCode,
      record.kind,
      record.issuedClientDocumentId,
      record.documentCode,
      record.issuedProposalId,
      record.issuedCode,
      record.programmeId,
      record.relatedOrganizationId,
      record.recipientEmail,
      true,
      record.senderKey,
      record.senderOrganizationName,
      record.senderAddress,
      record.senderMode,
      record.authorizationPrincipalId,
      record.authorizationAuthority,
      record.authorizedAt,
      record.contentSha256,
      record.artifactSha256,
      record.idempotencyKey,
      record.templateVersion,
      record.authorizeSupersededDocument,
      record.state,
      true,
      record.createdAt,
    ],
  );
}

export async function insertIssuedClientDocumentDeliveryAttempt(
  client: Queryable,
  record: IssuedClientDocumentDeliveryAttempt,
): Promise<void> {
  await client.query(
    `INSERT INTO issued_client_document_delivery_attempts (
      id, tenant_id, attempt_code, kind, delivery_id, delivery_code, issued_client_document_id,
      issued_proposal_id, recipient_email, content_sha256, artifact_sha256, attempt_number,
      requested_at, result, recipient_delivered, failure_reason, provider_name, provider_reference,
      actor_principal_id, immutable, created_at
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
    )`,
    [
      record.id,
      record.tenantId,
      record.attemptCode,
      record.kind,
      record.deliveryId,
      record.deliveryCode,
      record.issuedClientDocumentId,
      record.issuedProposalId,
      record.recipientEmail,
      record.contentSha256,
      record.artifactSha256,
      record.attemptNumber,
      record.requestedAt,
      record.result,
      false,
      record.failureReason ?? null,
      record.providerName,
      record.providerReference ?? null,
      record.actorPrincipalId,
      true,
      record.createdAt,
    ],
  );
}

export async function getIssuedClientDocumentDeliveryById(
  client: Queryable,
  tenantId: string,
  id: string,
): Promise<IssuedClientDocumentDelivery | undefined> {
  const result = await client.query(
    `SELECT * FROM issued_client_document_deliveries WHERE id = $1 AND tenant_id = $2`,
    [id, tenantId],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapIssuedClientDocumentDeliveryRow(row) : undefined;
}

export async function getIssuedClientDocumentDeliveryByIdempotency(
  client: Queryable,
  tenantId: string,
  idempotencyKey: string,
): Promise<IssuedClientDocumentDelivery | undefined> {
  const result = await client.query(
    `SELECT * FROM issued_client_document_deliveries WHERE tenant_id = $1 AND idempotency_key = $2`,
    [tenantId, idempotencyKey],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapIssuedClientDocumentDeliveryRow(row) : undefined;
}

export async function getIssuedClientDocumentDeliveryByDocumentRecipient(
  client: Queryable,
  tenantId: string,
  documentId: string,
  recipientEmail: string,
): Promise<IssuedClientDocumentDelivery | undefined> {
  const result = await client.query(
    `SELECT * FROM issued_client_document_deliveries
     WHERE tenant_id = $1 AND issued_client_document_id = $2 AND recipient_email = $3`,
    [tenantId, documentId, recipientEmail],
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  return row ? mapIssuedClientDocumentDeliveryRow(row) : undefined;
}

export async function listIssuedClientDocumentDeliveriesByTenant(
  client: Queryable,
  tenantId: string,
): Promise<IssuedClientDocumentDelivery[]> {
  const result = await client.query(
    `SELECT * FROM issued_client_document_deliveries WHERE tenant_id = $1 ORDER BY created_at DESC`,
    [tenantId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapIssuedClientDocumentDeliveryRow);
}

export async function listIssuedClientDocumentDeliveryAttempts(
  client: Queryable,
  tenantId: string,
  deliveryId: string,
): Promise<IssuedClientDocumentDeliveryAttempt[]> {
  const result = await client.query(
    `SELECT * FROM issued_client_document_delivery_attempts
     WHERE tenant_id = $1 AND delivery_id = $2
     ORDER BY attempt_number ASC`,
    [tenantId, deliveryId],
  );
  return (result.rows as Record<string, unknown>[]).map(mapIssuedClientDocumentDeliveryAttemptRow);
}

export async function nextIssuedClientDocumentDeliveryAttemptNumber(
  client: Queryable,
  tenantId: string,
  deliveryId: string,
): Promise<number> {
  const result = await client.query(
    `SELECT COALESCE(MAX(attempt_number), 0)::int AS c
     FROM issued_client_document_delivery_attempts
     WHERE tenant_id = $1 AND delivery_id = $2`,
    [tenantId, deliveryId],
  );
  return asNumberRequired(result.rows[0]?.c) + 1;
}
