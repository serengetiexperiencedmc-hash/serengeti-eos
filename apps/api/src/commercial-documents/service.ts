import {
  authorize,
  canMutateCommercialDocument,
  COMMERCIAL_DOC_MAX_BYTES,
  isAllowedCommercialMime,
  isValidCommercialDocumentKind,
  newId,
  type CommercialDocument,
  type CommercialDocumentKind,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCdAudit, denyCdAudit } from "./audit.js";
import { ensureCommercialDocumentCollections } from "./collections.js";
import {
  decodeContentBase64,
  DocumentStorageCollisionError,
  LocalFsDocumentStorage,
  sha256Buffer,
} from "./storage.js";
import {
  allowAuditRecord,
  denyAuditRecord,
  insertChainedAudit,
  isMixedSqlDurable,
  persistDenyAudit,
  rememberPostCommit,
  runDurableTx,
} from "../persistence/durable.js";
import {
  getCommercialDocumentById,
  insertCommercialDocument,
  listDocumentsForRfp,
} from "../persistence/commercial-document-repository.js";
import { resolveDocumentRoot } from "../infrastructure-contract.js";
import { loadRfp } from "../rfp/rfp.js";
import {
  rejectPersonDomainContent,
  rejectPersonDomainDocumentFilename,
} from "../personal-data-content-contract.js";

function documentRoot(): string {
  return resolveDocumentRoot();
}

export function ensureDocumentStorage(store: Store): void {
  if (!store.documentStorage) {
    store.documentStorage = new LocalFsDocumentStorage(documentRoot());
  }
}

function sanitize(doc: CommercialDocument) {
  return {
    id: doc.id,
    kind: doc.kind,
    status: doc.status,
    filename: doc.filename,
    mimeType: doc.mimeType,
    sizeBytes: doc.sizeBytes,
    checksumSha256: doc.checksumSha256,
    version: doc.version,
    rfpId: doc.rfpId,
    supplierId: doc.supplierId,
    contractId: doc.contractId,
    classification: doc.classification,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdByPrincipalId: doc.createdByPrincipalId,
  };
}

async function compensateBytes(store: Store, storageRef: string): Promise<void> {
  const storage = store.documentStorage;
  if (storage) await storage.delete(storageRef);
}

export type UploadDocumentInput = {
  filename: string;
  mimeType: string;
  contentBase64: string;
  kind?: string;
  rfpId?: string;
  supplierId?: string;
  contractId?: string;
};

export async function uploadCommercialDocument(
  store: Store,
  principal: Principal,
  input: UploadDocumentInput,
  correlationId: string,
) {
  ensureCommercialDocumentCollections(store);
  ensureDocumentStorage(store);
  const human = canMutateCommercialDocument(principal.actorType);
  if (!human.allowed) {
    if (isMixedSqlDurable(store)) {
      await persistDenyAudit(
        store,
        denyAuditRecord(principal, "commercialDocument:write:document", "commercial_document", correlationId, human.reason),
      );
    } else {
      denyCdAudit(store, principal, "commercialDocument:write:document", "commercial_document", correlationId, human.reason);
    }
    return { error: "forbidden" as const, reason: human.reason };
  }
  const decision = authorize({
    principal,
    permission: "commercialDocument:write:document",
    action: "create:commercial_document",
  });
  if (decision.result === "deny") {
    if (isMixedSqlDurable(store)) {
      await persistDenyAudit(
        store,
        denyAuditRecord(principal, "commercialDocument:write:document", "commercial_document", correlationId, decision.reason),
      );
    } else {
      denyCdAudit(store, principal, "commercialDocument:write:document", "commercial_document", correlationId, decision.reason);
    }
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;

  const filename = input.filename?.trim();
  if (!filename || filename.length > 255) {
    return { error: "invalid" as const, reason: "filename_required" };
  }
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return { error: "invalid" as const, reason: "invalid_filename" };
  }
  const personFilename = rejectPersonDomainDocumentFilename(filename);
  if (personFilename) return personFilename;
  const mimeType = input.mimeType?.trim();
  if (!mimeType || !isAllowedCommercialMime(mimeType)) {
    return { error: "invalid" as const, reason: "mime_not_allowed" };
  }
  if (!input.contentBase64?.trim()) {
    return { error: "invalid" as const, reason: "content_required" };
  }
  const decoded = decodeContentBase64(input.contentBase64);
  if ("error" in decoded) return { error: "invalid" as const, reason: decoded.error };
  if (decoded.length === 0) return { error: "invalid" as const, reason: "empty_content" };
  if (decoded.length > COMMERCIAL_DOC_MAX_BYTES) {
    return { error: "invalid" as const, reason: "file_too_large" };
  }

  let kind: CommercialDocumentKind = "other";
  if (input.kind !== undefined) {
    if (!isValidCommercialDocumentKind(input.kind)) {
      return { error: "invalid" as const, reason: "invalid_kind" };
    }
    kind = input.kind;
  }

  if (input.rfpId) {
    const rfp = await loadRfp(store, principal.tenantId, input.rfpId);
    if (!rfp) return { error: "invalid" as const, reason: "invalid_rfp" };
    if (kind === "other") kind = "rfp";
  }
  if (input.supplierId) {
    const supplier = store.supSuppliers.find(
      (s) => s.id === input.supplierId && s.tenantId === principal.tenantId && !s.archivedAt,
    );
    if (!supplier) return { error: "invalid" as const, reason: "invalid_supplier" };
  }
  if (input.contractId) {
    const contract = store.supContracts.find(
      (c) => c.id === input.contractId && c.tenantId === principal.tenantId && !c.archivedAt,
    );
    if (!contract) return { error: "invalid" as const, reason: "invalid_contract" };
    if (input.supplierId && contract.supplierId !== input.supplierId) {
      return { error: "invalid" as const, reason: "contract_supplier_mismatch" };
    }
  }

  const id = newId();
  const now = new Date().toISOString();
  const checksumSha256 = sha256Buffer(decoded);
  let put: { storageRef: string };
  try {
    put = await store.documentStorage!.put({
      tenantId: principal.tenantId,
      documentId: id,
      bytes: decoded,
      mimeType,
    });
  } catch (err) {
    if (err instanceof DocumentStorageCollisionError) {
      return { error: "conflict" as const, reason: "storage_collision" };
    }
    throw err;
  }

  const doc: CommercialDocument = {
    id,
    tenantId: principal.tenantId,
    kind,
    status: "active",
    filename,
    mimeType,
    sizeBytes: decoded.length,
    checksumSha256,
    storageRef: put.storageRef,
    version: 1,
    ...(input.rfpId ? { rfpId: input.rfpId } : {}),
    ...(input.supplierId ? { supplierId: input.supplierId } : {}),
    ...(input.contractId ? { contractId: input.contractId } : {}),
    classification: "Confidential",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertCommercialDocument(client, doc);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(
            principal,
            "commercialDocument:write:document",
            "commercial_document",
            doc.id,
            correlationId,
            sanitize(doc),
          ),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      await compensateBytes(store, put.storageRef);
      throw error;
    }
    return { document: sanitize(doc) };
  }

  store.commercialDocuments.push(doc);
  allowCdAudit(store, principal, "commercialDocument:write:document", "commercial_document", doc.id, correlationId, sanitize(doc));
  return { document: sanitize(doc) };
}

export async function listRfpDocuments(store: Store, principal: Principal, rfpId: string) {
  ensureCommercialDocumentCollections(store);
  const decision = authorize({
    principal,
    permission: "commercialDocument:read:document",
    action: "list:commercial_document",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const rfp = await loadRfp(store, principal.tenantId, rfpId);
  if (!rfp) return { error: "not_found" as const };
  const items = isMixedSqlDurable(store)
    ? await listDocumentsForRfp(store.dbPool, principal.tenantId, rfpId)
    : store.commercialDocuments.filter((d) => d.tenantId === principal.tenantId && d.rfpId === rfpId && d.status === "active");
  return {
    items: items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).map(sanitize),
  };
}

export async function getCommercialDocument(store: Store, principal: Principal, id: string) {
  ensureCommercialDocumentCollections(store);
  const decision = authorize({
    principal,
    permission: "commercialDocument:read:document",
    action: "get:commercial_document",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const doc = isMixedSqlDurable(store)
    ? await getCommercialDocumentById(store.dbPool, principal.tenantId, id)
    : store.commercialDocuments.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!doc || doc.status === "deleted") return { error: "not_found" as const };
  return { document: sanitize(doc) };
}

export async function getCommercialDocumentContent(store: Store, principal: Principal, id: string) {
  ensureCommercialDocumentCollections(store);
  ensureDocumentStorage(store);
  const decision = authorize({
    principal,
    permission: "commercialDocument:read:document",
    action: "get:commercial_document_content",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const doc = isMixedSqlDurable(store)
    ? await getCommercialDocumentById(store.dbPool, principal.tenantId, id)
    : store.commercialDocuments.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!doc || doc.status === "deleted") return { error: "not_found" as const };
  const bytes = await store.documentStorage!.get(doc.storageRef);
  if (!bytes) return { error: "not_found" as const, reason: "storage_missing" };
  return {
    document: sanitize(doc),
    contentBase64: bytes.toString("base64"),
  };
}
