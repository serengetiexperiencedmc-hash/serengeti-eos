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
import { createActivity } from "../crm/activity.js";
import { ensureCrmCollections } from "../crm/collections.js";
import { createTask } from "../crm/task.js";
import { persistAiDraft } from "../persistence/ai-drafts.js";
import { listAiRecommendations } from "./recommend.js";

function findOverdueAssociation(store: Store, tenantId: string) {
  ensureCrmCollections(store);
  const now = new Date().toISOString();
  const overdue = store.crmTasks.filter(
    (t) =>
      t.tenantId === tenantId &&
      (t.status === "Open" || t.status === "InProgress") &&
      t.dueAt !== undefined &&
      t.dueAt < now,
  );
  for (const task of overdue) {
    if (task.relatedOrganizationId || task.relatedContactId) {
      return {
        organizationId: task.relatedOrganizationId,
        contactId: task.relatedContactId,
      };
    }
  }
  return undefined;
}

const INCREMENT = "I20.4" as const;

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

export async function createAiDraft(
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
    await persistAiDraft(store.dbPool, existing);
    return { draft: sanitizeDraft(existing), replay: true as const, increment: INCREMENT };
  }

  const artefact = buildAiDraftArtefact({
    recommendationKey: key,
    title: rec.title,
    reason: rec.reason,
  });
  if ("error" in artefact) return { error: "invalid_request" as const, reason: artefact.error };

  let artefactType = artefact.artefactType;
  let title = artefact.title;
  let body = artefact.body;
  let relatedOrganizationId: string | undefined;
  let relatedContactId: string | undefined;
  if (artefactType === "crm_activity") {
    const assoc = findOverdueAssociation(store, principal.tenantId);
    if (!assoc) {
      artefactType = "crm_task";
      title = `Follow up: ${rec.title}`.slice(0, 200);
      body = [
        rec.reason,
        "",
        "Drafted as a CRM task (I20.3). Not applied until a human accepts.",
        "This draft does not merge, email, assign an owner, or approve anything.",
      ].join("\n");
    } else {
      relatedOrganizationId = assoc.organizationId;
      relatedContactId = assoc.contactId;
    }
  }

  const now = new Date().toISOString();
  const draft: AiDraft = {
    id: newId(),
    tenantId: principal.tenantId,
    recommendationKey: key,
    artefactType,
    title,
    body,
    status: "pending",
    autonomyLevel: 2,
    createdAt: now,
    createdByPrincipalId: principal.id,
    ...(relatedOrganizationId ? { relatedOrganizationId } : {}),
    ...(relatedContactId ? { relatedContactId } : {}),
  };
  store.aiDrafts.push(draft);
  await persistAiDraft(store.dbPool, draft);
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
  return { draft: sanitizeDraft(draft), increment: INCREMENT };
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
  return { items: items.map(sanitizeDraft), increment: INCREMENT };
}

export async function discardAiDraft(store: Store, principal: Principal, draftId: string, correlationId: string) {
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
  await persistAiDraft(store.dbPool, draft);
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
  return { draft: sanitizeDraft(draft), increment: INCREMENT };
}

export async function acceptAiDraft(store: Store, principal: Principal, draftId: string, correlationId: string) {
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

  if (draft.artefactType === "crm_activity") {
    const created = createActivity(
      store,
      principal,
      {
        activityType: "follow_up",
        subject: draft.title,
        occurredAt: new Date().toISOString(),
        notes: draft.body,
        ownerPrincipalId: principal.id,
        ...(draft.relatedOrganizationId ? { organizationId: draft.relatedOrganizationId } : {}),
        ...(draft.relatedContactId ? { contactId: draft.relatedContactId } : {}),
      },
      correlationId,
    );
    if ("error" in created) return created;
    draft.status = "accepted";
    draft.acceptedAt = new Date().toISOString();
    draft.acceptedByPrincipalId = principal.id;
    draft.appliedEntityType = "crm_activity";
    draft.appliedEntityId = created.activity.id;
    await persistAiDraft(store.dbPool, draft);
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
      evidence: { appliedEntityType: "crm_activity", appliedEntityId: created.activity.id },
    });
    return {
      draft: sanitizeDraft(draft),
      activity: { id: created.activity.id, subject: created.activity.subject },
      increment: INCREMENT,
    };
  }

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
  await persistAiDraft(store.dbPool, draft);
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
  return { draft: sanitizeDraft(draft), task: { id: created.task.id, title: created.task.title }, increment: INCREMENT };
}
