export const DOCUMENT_TYPES = ["policy", "sop", "note"] as const;
export type KnowledgeDocumentType = (typeof DOCUMENT_TYPES)[number];

export const AUTHORITY_STATES = ["draft", "authoritative", "retired"] as const;
export type AuthorityState = (typeof AUTHORITY_STATES)[number];

export const DOCUMENT_TYPE_LABELS: Record<KnowledgeDocumentType, string> = {
  policy: "Policy",
  sop: "SOP",
  note: "Note",
};

export const AUTHORITY_STATE_LABELS: Record<AuthorityState, string> = {
  draft: "Draft",
  authoritative: "Authoritative",
  retired: "Retired",
};

export function isValidDocumentType(value: string): value is KnowledgeDocumentType {
  return (DOCUMENT_TYPES as readonly string[]).includes(value);
}

export function isValidAuthorityState(value: string): value is AuthorityState {
  return (AUTHORITY_STATES as readonly string[]).includes(value);
}

export function nextDocumentCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^DOC-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `DOC-${String(max + 1).padStart(4, "0")}`;
}

export function canTransitionDocument(
  from: AuthorityState,
  action: "publish" | "retire",
): { allowed: true; next: AuthorityState } | { allowed: false; reason: "invalid_transition" } {
  if (action === "publish" && from === "draft") return { allowed: true, next: "authoritative" };
  if (action === "retire" && from !== "retired") return { allowed: true, next: "retired" };
  return { allowed: false, reason: "invalid_transition" };
}

export type KnowledgeDocument = {
  id: string;
  tenantId: string;
  docCode: string;
  title: string;
  body?: string;
  documentType: KnowledgeDocumentType;
  authorityState: AuthorityState;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
