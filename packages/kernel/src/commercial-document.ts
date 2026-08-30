import type { Classification } from "./types.js";

/** CD Phase 1 — commercial document metadata. Bytes live behind DocumentStorage. */

export const COMMERCIAL_DOCUMENT_KINDS = ["rfp", "contract", "rate_sheet", "other"] as const;
export type CommercialDocumentKind = (typeof COMMERCIAL_DOCUMENT_KINDS)[number];

export const COMMERCIAL_DOCUMENT_STATUSES = ["active", "superseded", "deleted"] as const;
export type CommercialDocumentStatus = (typeof COMMERCIAL_DOCUMENT_STATUSES)[number];

export function isValidCommercialDocumentKind(value: string): value is CommercialDocumentKind {
  return (COMMERCIAL_DOCUMENT_KINDS as readonly string[]).includes(value);
}

export function isValidCommercialDocumentStatus(value: string): value is CommercialDocumentStatus {
  return (COMMERCIAL_DOCUMENT_STATUSES as readonly string[]).includes(value);
}

export function canMutateCommercialDocument(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export type CommercialDocument = {
  id: string;
  tenantId: string;
  kind: CommercialDocumentKind;
  status: CommercialDocumentStatus;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  storageRef: string;
  version: number;
  rfpId?: string;
  supplierId?: string;
  contractId?: string;
  classification: Classification;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export const COMMERCIAL_DOC_MIME_ALLOWLIST = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/jpeg",
  "image/png",
] as const;

export const COMMERCIAL_DOC_MAX_BYTES = 10 * 1024 * 1024;

export function isAllowedCommercialMime(mime: string): boolean {
  return (COMMERCIAL_DOC_MIME_ALLOWLIST as readonly string[]).includes(mime);
}

export type DocumentStoragePutInput = {
  tenantId: string;
  documentId: string;
  bytes: Buffer;
  mimeType: string;
};

export type DocumentStorage = {
  readonly name: string;
  put(input: DocumentStoragePutInput): Promise<{ storageRef: string }>;
  get(storageRef: string): Promise<Buffer | null>;
};
