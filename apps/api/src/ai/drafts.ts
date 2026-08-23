import {
  authorize,
  buildAiDraftArtefact,
  isDraftableRecommendationKey,
  newId,
  type AiDraft,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { recordAudit } from "../store.js";
import { createTask } from "../crm/task.js";
import { listAiRecommendations } from "./recommend.js";

export function ensureAiCollections(store: Store): void {
  if (!store.aiDrafts) store.aiDrafts = [];
}

function sanitizeDraft(draft: AiDraft) {
  return {
    id: draft.id,
    recommendationKey: draft.recommendationKey,
    artefactType: draft.artefactType,
    title: draft.title,
    body: draft.body,
    status: draft.status,
    autonomyLevel: draft.autonomyLevel,
    createdAt: draft.createdAt,
    createdByPrincipalId: draft.createdByPrincipalId,
    ...(draft.acceptedAt ? { acceptedAt: draft.acceptedAt } : {}),
    ...(draft.appliedEntityId
      ? { appliedEntityType: draft.appliedEntityType, appliedEntityId: draft.appliedEntityId }
      : {}),
  };
}

export function createAiDraft(
  store: Store,
  principal: Principal,
  input: { recommendationKey?: string },
  correlationId: string,
) {
  ensureAiCollections(store);
  const decision = authorize({
    principal,
    permission: "ai:write:draft",
    action: "write:ai_draft",
  });
  if (decision.result === "deny") {
    recordAudit(store, {
      tenantId: principal.tenantId,
      occurredAt: new Date().toISOString(),
      actorType: principal.actorType,
      actorPrincipalId: principal.id,
      action: "write:ai_draft",
      resourceType: "ai_draft",
      correlationId,
      authorization: "deny",
      evidence: { reason: decision.reason },
    });
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const key = input.recommendationKey?.trim() ?? "";
  if (!isDraftableRecommendationKey(key)) {
    return { error: "invalid_request" as const, reason: "unknown_recommendation_key" };
  }

  const listed = listAiRecommendations(store, principal, correlationId);
  if ("error" in listed) return listed;
  const rec = listed.items.find((item) => item.key === key);
  if (!rec) return { error: "conflict" as const, reason: "recommendation_not_active" };

  const existing = store.aiDrafts.find(
    (d) =>
      d.tenantId === principal.tenantId &&
      d.createdByPrincipalId === principal.id &&
      d.recommendationKey === key &&
      d.status === "pending",
  );
  if (existing) {
    return { draft: sanitizeDraft(existing), replay: true as const, increment: "I20.2" as const };
  }

  const artefact = buildAiDraftArtefact({
    recommendationKey: key,
    title: rec.title,
    reason: rec.reason,
  });
  if ("error" in artefact) return { error: "invalid_request" as const, reason: artefact.error };

  const now = new Date().toISOString();
  const draft: AiDraft = {
    id: newId(),
    tenantId: principal.tenantId,
    recommendationKey: key,
    artefactType: artefact.artefactType,
    title: artefact.title,
    body: artefact.body,
    status: "pending",
    autonomyLevel: 2,
    createdAt: now,
    createdByPrincipalId: principal.id,
  };
  store.aiDrafts.push(draft);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: now,
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "write:ai_draft",
    resourceType: "ai_draft",
    resourceId: draft.id,
    correlationId,
    authorization: "allow",
    evidence: { recommendationKey: key, artefactType: draft.artefactType },
  });
  return { draft: sanitizeDraft(draft), increment: "I20.2" as const };
}

export function listAiDrafts(store: Store, principal: Principal, query?: { status?: string }) {
  ensureAiCollections(store);
  const decision = authorize({
    principal,
    permission: "ai:read:recommend",
    action: "read:ai_draft",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.aiDrafts.filter((d) => d.tenantId === principal.tenantId);
  if (query?.status) items = items.filter((d) => d.status === query.status);
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { items: items.map(sanitizeDraft), increment: "I20.2" as const };
}

export function discardAiDraft(store: Store, principal: Principal, draftId: string, correlationId: string) {
  ensureAiCollections(store);
  const draft = store.aiDrafts.find((d) => d.id === draftId);
  if (!draft || draft.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "ai:write:draft",
    action: "discard:ai_draft",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (draft.status !== "pending") return { error: "conflict" as const, reason: "draft_not_pending" };

  draft.status = "discarded";
  draft.discardedAt = new Date().toISOString();
  draft.discardedByPrincipalId = principal.id;
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: draft.discardedAt,
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "discard:ai_draft",
    resourceType: "ai_draft",
    resourceId: draft.id,
    correlationId,
    authorization: "allow",
    evidence: { recommendationKey: draft.recommendationKey },
  });
  return { draft: sanitizeDraft(draft), increment: "I20.2" as const };
}

export function acceptAiDraft(store: Store, principal: Principal, draftId: string, correlationId: string) {
  ensureAiCollections(store);
  const draft = store.aiDrafts.find((d) => d.id === draftId);
  if (!draft || draft.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "ai:write:draft",
    action: "accept:ai_draft",
  });
  if (decision.result === "deny") {
    recordAudit(store, {
      tenantId: principal.tenantId,
      occurredAt: new Date().toISOString(),
      actorType: principal.actorType,
      actorPrincipalId: principal.id,
      action: "accept:ai_draft",
      resourceType: "ai_draft",
      resourceId: draft.id,
      correlationId,
      authorization: "deny",
      evidence: { reason: decision.reason },
    });
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (draft.status !== "pending") return { error: "conflict" as const, reason: "draft_not_pending" };

  const created = createTask(
    store,
    principal,
    { title: draft.title, description: draft.body, priority: "medium", assigneePrincipalId: principal.id },
    correlationId,
  );
  if ("error" in created) return created;

  draft.status = "accepted";
  draft.acceptedAt = new Date().toISOString();
  draft.acceptedByPrincipalId = principal.id;
  draft.appliedEntityType = "crm_task";
  draft.appliedEntityId = created.task.id;
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: draft.acceptedAt,
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "accept:ai_draft",
    resourceType: "ai_draft",
    resourceId: draft.id,
    correlationId,
    authorization: "allow",
    evidence: { appliedEntityType: "crm_task", appliedEntityId: created.task.id },
  });
  return { draft: sanitizeDraft(draft), task: { id: created.task.id, title: created.task.title }, increment: "I20.2" as const };
}
