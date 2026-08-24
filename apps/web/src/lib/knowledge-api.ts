import { eosFetch } from "./eos-client";

export type KnowledgeDocumentType = "policy" | "sop" | "note";
export type AuthorityState = "draft" | "authoritative" | "retired";

export type KnowledgeDocument = {
  id: string;
  docCode: string;
  title: string;
  documentType: KnowledgeDocumentType;
  authorityState: AuthorityState;
  body?: string;
};

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

export async function getKnowledgeHealth(token: string) {
  return eosFetch<{ increment: string; documents: number; authoritative: number }>("/v1/knowledge/health", { token });
}

export async function listKnowledgeDocuments(
  token: string,
  query?: { q?: string; type?: string; state?: string },
) {
  const params = new URLSearchParams();
  if (query?.q) params.set("q", query.q);
  if (query?.type) params.set("type", query.type);
  if (query?.state) params.set("state", query.state);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return eosFetch<{ items: KnowledgeDocument[] }>(`/v1/knowledge/documents${suffix}`, { token });
}

export async function createKnowledgeDocument(
  token: string,
  input: { title: string; documentType: KnowledgeDocumentType; body?: string },
) {
  return eosFetch<{ document: KnowledgeDocument }>("/v1/knowledge/documents", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchKnowledgeDocument(
  token: string,
  id: string,
  input: { title?: string; documentType?: KnowledgeDocumentType; body?: string },
) {
  return eosFetch<{ document: KnowledgeDocument }>(`/v1/knowledge/documents/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function transitionKnowledgeDocument(token: string, id: string, action: "publish" | "retire") {
  return eosFetch<{ document: KnowledgeDocument }>(`/v1/knowledge/documents/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}
