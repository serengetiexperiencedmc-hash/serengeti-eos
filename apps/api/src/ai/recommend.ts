import {
  authorize,
  createDevRulesRecommendProvider,
  filterAiRecommendLastRunKeys,
  formatAiRecommendLastRunCsv,
  hasPermission,
  sanitizeAiRecommendLastRun,
  type AiRecommendLastRun,
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
import { persistAiRecommendRun } from "../persistence/ai-recommend-runs.js";

const INCREMENT = "I20.10" as const;
const provider = createDevRulesRecommendProvider();

function ensureAiRecommendRuns(store: Store): void {
  if (!store.aiRecommendRuns) store.aiRecommendRuns = [];
}

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

function rememberRecommendRun(
  store: Store,
  principal: Principal,
  keys: string[],
): AiRecommendLastRun {
  ensureAiRecommendRuns(store);
  const run: AiRecommendLastRun = {
    tenantId: principal.tenantId,
    principalId: principal.id,
    occurredAt: new Date().toISOString(),
    provider: provider.name,
    count: keys.length,
    keys,
  };
  const idx = store.aiRecommendRuns.findIndex(
    (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
  );
  if (idx >= 0) store.aiRecommendRuns[idx] = run;
  else store.aiRecommendRuns.push(run);
  return run;
}

export async function listAiRecommendations(store: Store, principal: Principal, correlationId: string) {
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

  const lastRun = rememberRecommendRun(
    store,
    principal,
    items.map((i) => i.key),
  );
  await persistAiRecommendRun(store.dbPool, lastRun);

  return {
    items,
    provider: provider.name,
    autonomyCeiling: provider.autonomyCeiling,
    lastRun: sanitizeAiRecommendLastRun(lastRun),
    increment: INCREMENT,
  };
}

function lastRunView(store: Store, principal: Principal, key?: string) {
  ensureAiRecommendRuns(store);
  const decision = authorize({
    principal,
    permission: "ai:read:recommend",
    action: "read:ai_recommendations",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const run = store.aiRecommendRuns.find(
    (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
  );
  const lastRun = run ? sanitizeAiRecommendLastRun(run) : null;
  const keys = filterAiRecommendLastRunKeys(lastRun?.keys ?? [], key);
  return {
    lastRun,
    keys,
    matchCount: keys.length,
    filter: { key: key?.trim() ? key.trim() : null },
    increment: INCREMENT,
  };
}

export function getAiRecommendLastRun(store: Store, principal: Principal, query?: { key?: string }) {
  return lastRunView(store, principal, query?.key);
}

export function exportAiRecommendLastRun(
  store: Store,
  principal: Principal,
  query?: { key?: string; format?: string },
) {
  if (query?.format && query.format !== "json" && query.format !== "csv") {
    return { error: "invalid_request" as const, reason: "invalid_format" };
  }
  const viewed = lastRunView(store, principal, query?.key);
  if ("error" in viewed) return viewed;
  const format = query?.format === "csv" ? "csv" : "json";
  const generatedAt = new Date().toISOString();
  if (format === "csv") {
    return {
      ...viewed,
      format: "csv" as const,
      generatedAt,
      csv: formatAiRecommendLastRunCsv({
        occurredAt: viewed.lastRun?.occurredAt ?? "",
        provider: viewed.lastRun?.provider ?? "",
        count: viewed.lastRun?.count ?? 0,
        keys: viewed.keys,
      }),
    };
  }
  return { ...viewed, format: "json" as const, generatedAt };
}
