import type { KnowledgeDocument } from "@sedmc/kernel";
import type { Store } from "../store.js";

export const KNOWLEDGE_SEED = {
  sampleDocId: "84848484-8484-4848-8848-848484848484",
} as const;

export function ensureKnowledgeCollections(store: Store): void {
  if (!store.knowledgeDocuments) store.knowledgeDocuments = [];
}

export function seedDefaultKnowledge(store: Store): void {
  ensureKnowledgeCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.knowledgeDocuments.some((d) => d.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  const doc: KnowledgeDocument = {
    id: KNOWLEDGE_SEED.sampleDocId,
    tenantId: tenant.id,
    docCode: "DOC-0001",
    title: "Sample Dev/Test policy",
    body: "Seeded knowledge row — searchable body text for tenant isolation tests.",
    documentType: "policy",
    authorityState: "draft",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  store.knowledgeDocuments.push(doc);
}
