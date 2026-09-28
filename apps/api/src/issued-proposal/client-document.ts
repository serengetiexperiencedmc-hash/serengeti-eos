import { authorize, type IssuedClientDocument, type Principal } from "@sedmc/kernel";
import {
  ISSUED_CLIENT_DOCUMENT_GENERATION,
  assertIssuedClientDocumentPayloadSanitized,
  composeIssuedClientDocumentPayload,
  createIssuedClientDocument,
  hashIssuedClientDocumentArtifact,
  hashIssuedClientDocumentContent,
  renderIssuedClientDocumentPdf,
} from "@sedmc/kernel/issued-client-document";
import { ISSUED_PROPOSAL_DELIVERY } from "@sedmc/kernel/issued-proposal";
import type { Store } from "../store.js";
import { recordAudit } from "../store.js";
import { DocumentStorageCollisionError, LocalFsDocumentStorage } from "../commercial-documents/storage.js";
import { resolveDocumentRoot } from "../infrastructure-contract.js";
import {
  allowAuditRecord,
  insertChainedAudit,
  isMixedSqlDurable,
  isUniqueViolation,
  rememberPostCommit,
  runDurableTx,
} from "../persistence/durable.js";
import {
  getIssuedClientDocumentById,
  insertIssuedClientDocument,
  listIssuedClientDocumentsByTenant,
  nextIssuedClientDocumentSequence,
} from "../persistence/issued-client-document-repository.js";
import { ensureIssuedProposalCollections } from "./collections.js";
import { loadIssuedProposalRecord } from "./issued-proposal.js";

function ensureDocumentStorage(store: Store): void {
  if (!store.documentStorage) {
    store.documentStorage = new LocalFsDocumentStorage(resolveDocumentRoot());
  }
}

function denyDocumentAudit(
  store: Store,
  principal: Principal,
  action: string,
  correlationId: string,
  reason: string,
  resourceId?: string,
) {
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType: "issued_client_document",
    ...(resourceId !== undefined ? { resourceId } : {}),
    correlationId,
    authorization: "deny",
    evidence: { reason },
  });
}

function allowDocumentAudit(
  store: Store,
  principal: Principal,
  action: string,
  resourceId: string,
  correlationId: string,
  newState: unknown,
) {
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType: "issued_client_document",
    resourceId,
    correlationId,
    authorization: "allow",
    evidence: { newState },
  });
}

function sanitizeDocument(record: IssuedClientDocument) {
  return {
    document: {
      id: record.id,
      documentCode: record.documentCode,
      kind: record.kind,
      issuedProposalId: record.issuedProposalId,
      issuedCode: record.issuedCode,
      documentType: record.documentType,
      sequence: record.sequence,
      generatedAt: record.generatedAt,
      generatedByPrincipalId: record.generatedByPrincipalId,
      generationContext: record.generationContext,
      status: record.status,
      contentSha256: record.contentSha256,
      artifactSha256: record.artifactSha256,
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes,
      storageRef: record.storageRef,
      immutable: true as const,
      createdAt: record.createdAt,
    },
    clientContent: record.clientContent,
    generation: ISSUED_CLIENT_DOCUMENT_GENERATION,
    delivery: ISSUED_PROPOSAL_DELIVERY,
  };
}

async function nextSequence(store: Store, tenantId: string, issuedProposalId: string): Promise<number> {
  if (isMixedSqlDurable(store)) {
    return nextIssuedClientDocumentSequence(store.dbPool, tenantId, issuedProposalId);
  }
  const max = store.issuedClientDocuments
    .filter((d) => d.tenantId === tenantId && d.issuedProposalId === issuedProposalId)
    .reduce((acc, d) => Math.max(acc, d.sequence), 0);
  return max + 1;
}

async function loadDocument(
  store: Store,
  tenantId: string,
  id: string,
): Promise<IssuedClientDocument | undefined> {
  ensureIssuedProposalCollections(store);
  if (isMixedSqlDurable(store)) {
    const persisted = await getIssuedClientDocumentById(store.dbPool, tenantId, id);
    if (persisted) return persisted;
  }
  return store.issuedClientDocuments.find((d) => d.id === id && d.tenantId === tenantId);
}

async function compensateBytes(store: Store, storageRef: string): Promise<void> {
  const storage = store.documentStorage;
  if (storage) await storage.delete(storageRef);
}

export function listIssuedClientDocumentRoutes(): string[] {
  return [
    "/v1/issued-proposal-documents",
    "/v1/issued-proposal-documents/:id",
    "/v1/issued-proposal-documents/:id/content",
  ];
}

export function unauthorizedIssuedClientDocumentRoutes(): string[] {
  return [
    "/v1/client/issued-proposal-documents",
    "/v1/client/proposals",
    "/v1/public/issued-proposal-documents",
    "/v1/issued-proposal-documents/:id/download",
    "/v1/issued-proposal-documents/:id/pdf",
    "/v1/public/download",
    "/portal/issued-proposal-documents/:id",
  ];
}

export async function generateIssuedClientDocument(
  store: Store,
  principal: Principal,
  input: { issuedProposalId?: string; programmeId?: string },
  correlationId: string,
) {
  ensureIssuedProposalCollections(store);
  ensureDocumentStorage(store);
  const decision = authorize({
    principal,
    permission: "proposal:write:proposal",
    action: "generate:issued_client_document",
  });
  if (decision.result === "deny") {
    denyDocumentAudit(store, principal, "generate:issued_client_document", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (!input.issuedProposalId || input.programmeId) {
    denyDocumentAudit(
      store,
      principal,
      "generate:issued_client_document",
      correlationId,
      "issued_proposal_required",
    );
    return { error: "invalid_request" as const, reason: "issued_proposal_required" };
  }

  const issued = await loadIssuedProposalRecord(store, principal.tenantId, input.issuedProposalId);
  if (!issued) return { error: "not_found" as const, reason: "issued_proposal_not_found" };

  let pdfBytes: Uint8Array;
  try {
    const payload = composeIssuedClientDocumentPayload(issued);
    assertIssuedClientDocumentPayloadSanitized(payload);
    pdfBytes = renderIssuedClientDocumentPdf(payload);
  } catch {
    denyDocumentAudit(
      store,
      principal,
      "generate:issued_client_document",
      correlationId,
      "pdf_generation_failed",
      issued.id,
    );
    return { error: "invalid_request" as const, reason: "pdf_generation_failed" };
  }

  const sequence = await nextSequence(store, principal.tenantId, issued.id);
  const created = createIssuedClientDocument({
    tenantId: principal.tenantId,
    issued,
    generatedBy: principal,
    sequence,
    pdfBytes,
  });
  if ("error" in created) {
    denyDocumentAudit(store, principal, "generate:issued_client_document", correlationId, created.error, issued.id);
    return { error: "conflict" as const, reason: created.error };
  }

  try {
    await store.documentStorage!.put({
      tenantId: created.tenantId,
      documentId: created.id,
      bytes: Buffer.from(pdfBytes),
      mimeType: created.mimeType,
    });
  } catch (err) {
    if (err instanceof DocumentStorageCollisionError) {
      return { error: "conflict" as const, reason: "storage_collision" };
    }
    throw err;
  }

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertIssuedClientDocument(client, created);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(
            principal,
            "generate:issued_client_document",
            "issued_client_document",
            created.id,
            correlationId,
            {
              documentCode: created.documentCode,
              issuedProposalId: created.issuedProposalId,
              contentSha256: created.contentSha256,
            },
          ),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      await compensateBytes(store, created.storageRef);
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_document_code" };
      throw error;
    }
    store.issuedClientDocuments.push(created);
    return sanitizeDocument(created);
  }

  store.issuedClientDocuments.push(created);
  allowDocumentAudit(store, principal, "generate:issued_client_document", created.id, correlationId, {
    documentCode: created.documentCode,
    issuedProposalId: created.issuedProposalId,
    contentSha256: created.contentSha256,
  });
  return sanitizeDocument(created);
}

export async function listIssuedClientDocuments(
  store: Store,
  principal: Principal,
  query?: { issuedProposalId?: string },
) {
  ensureIssuedProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:issued_client_document",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (isMixedSqlDurable(store)) {
    const items = await listIssuedClientDocumentsByTenant(store.dbPool, principal.tenantId, query);
    return { items: items.map(sanitizeDocument) };
  }
  const items = store.issuedClientDocuments
    .filter((d) => d.tenantId === principal.tenantId)
    .filter((d) => (query?.issuedProposalId ? d.issuedProposalId === query.issuedProposalId : true))
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt) || b.sequence - a.sequence)
    .map(sanitizeDocument);
  return { items };
}

export async function getIssuedClientDocument(store: Store, principal: Principal, id: string) {
  ensureIssuedProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:issued_client_document",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const record = await loadDocument(store, principal.tenantId, id);
  if (!record) return { error: "not_found" as const };
  return sanitizeDocument(record);
}

export async function getIssuedClientDocumentContent(store: Store, principal: Principal, id: string) {
  ensureIssuedProposalCollections(store);
  ensureDocumentStorage(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:issued_client_document_content",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const record = await loadDocument(store, principal.tenantId, id);
  if (!record) return { error: "not_found" as const };
  const bytes = await store.documentStorage!.get(record.storageRef);
  if (!bytes) return { error: "not_found" as const, reason: "storage_missing" };
  const artifactSha256 = hashIssuedClientDocumentArtifact(bytes);
  const contentSha256 = hashIssuedClientDocumentContent(record.clientContent);
  if (artifactSha256 !== record.artifactSha256 || contentSha256 !== record.contentSha256) {
    return { error: "conflict" as const, reason: "document_hash_mismatch" };
  }
  return {
    ...sanitizeDocument(record),
    contentBase64: bytes.toString("base64"),
  };
}
