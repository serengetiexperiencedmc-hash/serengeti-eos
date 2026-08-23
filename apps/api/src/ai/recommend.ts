import {
  authorize,
  createDevRulesRecommendProvider,
  hasPermission,
  type AiRecommendSignal,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { recordAudit } from "../store.js";
import { ensureCrmCollections } from "../crm/collections.js";
import { ensureNotificationCollections } from "../notifications/collections.js";
import {
  getAllowlistDualDigestStatus,
  isAllowlistDualDigestStaleSuppressed,
} from "../notifications/allowlist-dual-digest.js";
import { getDlqSlaDigestStatus, isDlqSlaDigestStaleSuppressed } from "../notifications/dlq-sla-digest.js";

const provider = createDevRulesRecommendProvider();

function collectSignals(store: Store, principal: Principal): AiRecommendSignal[] {
  const signals: AiRecommendSignal[] = [];
  ensureCrmCollections(store);
  ensureNotificationCollections(store);

  if (hasPermission(principal, "crm:read:duplicate")) {
    const count = store.crmDuplicateCandidates.filter(
      (c) =>
        c.tenantId === principal.tenantId &&
        (c.status === "PotentialDuplicate" || c.status === "UnderReview"),
    ).length;
    if (count > 0) signals.push({ kind: "crm_duplicate", count });
  }

  if (hasPermission(principal, "crm:read:task")) {
    const now = new Date().toISOString();
    const count = store.crmTasks.filter(
      (t) =>
        t.tenantId === principal.tenantId &&
        (t.status === "Open" || t.status === "InProgress") &&
        t.dueAt !== undefined &&
        t.dueAt < now,
    ).length;
    if (count > 0) signals.push({ kind: "crm_task_overdue", count });
  }

  if (hasPermission(principal, "crm:read:organization")) {
    const count = store.crmOrganizations.filter(
      (o) =>
        o.tenantId === principal.tenantId &&
        !o.archivedAt &&
        !o.mergedIntoId &&
        (o.status === "Active" || o.status === "Qualified" || o.status === "Engaged") &&
        !o.ownerPrincipalId,
    ).length;
    if (count > 0) signals.push({ kind: "org_missing_owner", count });
  }

  if (hasPermission(principal, "notification:read:email_outbox")) {
    const allowlist = getAllowlistDualDigestStatus(store, principal);
    if (
      !("error" in allowlist) &&
      allowlist.freshness.stale &&
      !isAllowlistDualDigestStaleSuppressed(store, principal.tenantId)
    ) {
      signals.push({ kind: "allowlist_digest_stale", ageHours: allowlist.freshness.ageHours });
    }
    const dlq = getDlqSlaDigestStatus(store, principal);
    if (!("error" in dlq) && dlq.freshness.stale && !isDlqSlaDigestStaleSuppressed(store, principal.tenantId)) {
      signals.push({ kind: "dlq_digest_stale", ageHours: dlq.freshness.ageHours });
    }
  }

  return signals;
}

export function listAiRecommendations(store: Store, principal: Principal, correlationId: string) {
  const decision = authorize({
    principal,
    permission: "ai:read:recommend",
    action: "read:ai_recommendations",
  });
  if (decision.result === "deny") {
    recordAudit(store, {
      tenantId: principal.tenantId,
      occurredAt: new Date().toISOString(),
      actorType: principal.actorType,
      actorPrincipalId: principal.id,
      action: "read:ai_recommendations",
      resourceType: "ai_recommendation",
      correlationId,
      authorization: "deny",
      evidence: { reason: decision.reason },
    });
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const signals = collectSignals(store, principal);
  const items = provider.recommend({
    tenantId: principal.tenantId,
    principalId: principal.id,
    signals,
  });

  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "read:ai_recommendations",
    resourceType: "ai_recommendation",
    resourceId: provider.name,
    correlationId,
    authorization: "allow",
    evidence: {
      provider: provider.name,
      autonomyCeiling: provider.autonomyCeiling,
      count: items.length,
      keys: items.map((i) => i.key),
    },
  });

  return {
    items,
    provider: provider.name,
    autonomyCeiling: provider.autonomyCeiling,
    increment: "I20.8" as const,
  };
}
