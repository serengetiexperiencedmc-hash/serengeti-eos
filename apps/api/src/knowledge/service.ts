import {
  authorize,
  canTransitionDocument,
  isValidAuthorityState,
  isValidDocumentType,
  newId,
  nextDocumentCode,
  type AuthorityState,
  type KnowledgeDocument,
  type KnowledgeDocumentType,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureKnowledgeCollections } from "./collections.js";

const BODY_MAX = 20_000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

export type KnowledgeDocumentView = {
  id: string;
  docCode: string;
  title: string;
  documentType: KnowledgeDocumentType;
  authorityState: AuthorityState;
  body?: string;
};

function sanitize(doc: KnowledgeDocument): KnowledgeDocumentView {
  const view: KnowledgeDocumentView = {
    id: doc.id,
    docCode: doc.docCode,
    title: doc.title,
    documentType: doc.documentType,
    authorityState: doc.authorityState,
  };
  if (doc.body) view.body = doc.body;
  return view;
}

function matchesQuery(doc: KnowledgeDocument, q: string): boolean {
  const haystack = `${doc.title} ${doc.body ?? ""}`.toLowerCase();
  return haystack.includes(q);
}

export function getKnowledgeHealth(store: Store, principal: Principal) {
  ensureKnowledgeCollections(store);
  const decision = authorize({ principal, permission: "knowledge:read:document", action: "read:knowledge_health" });
  if (decision.result === "deny") return deny(decision.reason);
  const docs = store.knowledgeDocuments.filter((d) => d.tenantId === principal.tenantId);
  return {
    module: "knowledge",
    increment: "I19" as const,
    status: "ok" as const,
    documents: docs.length,
    authoritative: docs.filter((d) => d.authorityState === "authoritative").length,
  };
}

export function listDocuments(
  store: Store,
  principal: Principal,
  query?: { q?: string; type?: string; state?: string },
) {
  ensureKnowledgeCollections(store);
  const decision = authorize({ principal, permission: "knowledge:read:document", action: "list:knowledge_document" });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.type && !isValidDocumentType(query.type)) return { error: "invalid" as const, reason: "invalid_type" };
  if (query?.state && !isValidAuthorityState(query.state)) return { error: "invalid" as const, reason: "invalid_state" };
  const q = query?.q?.trim().toLowerCase();
  const items = store.knowledgeDocuments
    .filter((d) => d.tenantId === principal.tenantId)
    .filter((d) => (query?.type ? d.documentType === query.type : true))
    .filter((d) => (query?.state ? d.authorityState === query.state : true))
    .filter((d) => (q ? matchesQuery(d, q) : true))
    .map(sanitize);
  return { items };
}

export function getDocument(store: Store, principal: Principal, id: string) {
  ensureKnowledgeCollections(store);
  const decision = authorize({ principal, permission: "knowledge:read:document", action: "get:knowledge_document" });
  if (decision.result === "deny") return deny(decision.reason);
  const doc = store.knowledgeDocuments.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!doc) return { error: "not_found" as const };
  return { document: sanitize(doc) };
}

export function createDocument(
  store: Store,
  principal: Principal,
  input: { title?: string; body?: string; documentType?: string },
) {
  ensureKnowledgeCollections(store);
  const decision = authorize({ principal, permission: "knowledge:write:document", action: "create:knowledge_document" });
  if (decision.result === "deny") return deny(decision.reason);
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  const documentType = input.documentType ?? "note";
  if (!isValidDocumentType(documentType)) return { error: "invalid" as const, reason: "invalid_type" };
  const body = input.body?.trim();
  if (body && body.length > BODY_MAX) return { error: "invalid" as const, reason: "body_too_long" };
  const now = new Date().toISOString();
  const row: KnowledgeDocument = {
    id: newId(),
    tenantId: principal.tenantId,
    docCode: nextDocumentCode(
      store.knowledgeDocuments.filter((d) => d.tenantId === principal.tenantId).map((d) => d.docCode),
    ),
    title,
    documentType,
    authorityState: "draft",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (body) row.body = body;
  store.knowledgeDocuments.push(row);
  return { document: sanitize(row) };
}

export function patchDocument(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; body?: string; documentType?: string },
) {
  ensureKnowledgeCollections(store);
  const decision = authorize({ principal, permission: "knowledge:write:document", action: "patch:knowledge_document" });
  if (decision.result === "deny") return deny(decision.reason);
  const doc = store.knowledgeDocuments.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!doc) return { error: "not_found" as const };
  if (doc.authorityState !== "draft") return { error: "conflict" as const, reason: "not_draft" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    doc.title = title;
  }
  if (input.body !== undefined) {
    const body = input.body.trim();
    if (body.length > BODY_MAX) return { error: "invalid" as const, reason: "body_too_long" };
    if (body) doc.body = body;
    else delete doc.body;
  }
  if (input.documentType !== undefined) {
    if (!isValidDocumentType(input.documentType)) return { error: "invalid" as const, reason: "invalid_type" };
    doc.documentType = input.documentType;
  }
  doc.updatedAt = new Date().toISOString();
  doc.updatedByPrincipalId = principal.id;
  return { document: sanitize(doc) };
}

export function transitionDocument(store: Store, principal: Principal, id: string, action: "publish" | "retire") {
  ensureKnowledgeCollections(store);
  const decision = authorize({
    principal,
    permission: "knowledge:write:document",
    action: `transition:knowledge_document:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const doc = store.knowledgeDocuments.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!doc) return { error: "not_found" as const };
  const next = canTransitionDocument(doc.authorityState, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  doc.authorityState = next.next;
  doc.updatedAt = new Date().toISOString();
  doc.updatedByPrincipalId = principal.id;
  return { document: sanitize(doc) };
}
