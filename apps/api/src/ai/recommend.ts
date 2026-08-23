import {
  AI_RECOMMEND_STALE_HOURS_DEFAULT,
  aiRecommendLastRunFreshness,
  authorize,
  createDevRulesRecommendProvider,
  filterAiRecommendLastRunKeys,
  formatAiRecommendLastRunCsv,
  formatAiRecommendStaleSuppressionAuditCsv,
  hasPermission,
  isAiRecommendStaleSuppressed,
  sanitizeAiRecommendLastRun,
  sanitizeAiRecommendStaleSuppression,
  sanitizeAiRecommendStaleSuppressionAudit,
  type AiRecommendLastRun,
  type AiRecommendStaleSuppression,
  type AiRecommendStaleSuppressionAudit,
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
import {
  persistAiRecommendStaleSuppression,
  persistAiRecommendStaleSuppressionAudit,
  persistDeleteAiRecommendStaleSuppression,
} from "../persistence/ai-recommend-stale-suppressions.js";

const INCREMENT = "I20.15" as const;

function recommendStaleThresholdHours(): number {
  const raw = Number(process.env.EOS_AI_RECOMMEND_STALE_HOURS);
  return Number.isFinite(raw) && raw > 0 ? raw : AI_RECOMMEND_STALE_HOURS_DEFAULT;
}
const provider = createDevRulesRecommendProvider();

function ensureAiRecommendRuns(store: Store): void {
  if (!store.aiRecommendRuns) store.aiRecommendRuns = [];
}

function ensureAiRecommendStaleSuppressions(store: Store): void {
  if (!store.aiRecommendStaleSuppressions) store.aiRecommendStaleSuppressions = [];
}

function ensureAiRecommendStaleSuppressionAudits(store: Store): void {
  if (!store.aiRecommendStaleSuppressionAudits) store.aiRecommendStaleSuppressionAudits = [];
}

async function appendAiRecommendStaleSuppressionAudit(
  store: Store,
  principal: Principal,
  action: AiRecommendStaleSuppressionAudit["action"],
  suppression?: AiRecommendStaleSuppression | null,
): Promise<void> {
  ensureAiRecommendStaleSuppressionAudits(store);
  const entry: AiRecommendStaleSuppressionAudit = {
    id: crypto.randomUUID(),
    tenantId: principal.tenantId,
    principalId: principal.id,
    action,
    ...(suppression?.snoozedUntil ? { snoozedUntil: suppression.snoozedUntil } : {}),
    ...(suppression?.acknowledgedAt ? { acknowledgedAt: suppression.acknowledgedAt } : {}),
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
  };
  store.aiRecommendStaleSuppressionAudits.push(entry);
  await persistAiRecommendStaleSuppressionAudit(store.dbPool, entry);
}

function findAiRecommendStaleSuppression(store: Store, principal: Principal) {
  ensureAiRecommendStaleSuppressions(store);
  return (
    store.aiRecommendStaleSuppressions.find(
      (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
    ) ?? null
  );
}

function clearAiRecommendStaleSuppression(store: Store, principal: Principal): void {
  ensureAiRecommendStaleSuppressions(store);
  store.aiRecommendStaleSuppressions = store.aiRecommendStaleSuppressions.filter(
    (row) => !(row.tenantId === principal.tenantId && row.principalId === principal.id),
  );
}

async function upsertAiRecommendStaleSuppression(
  store: Store,
  principal: Principal,
  patch: Partial<Pick<AiRecommendStaleSuppression, "acknowledgedAt" | "snoozedUntil">>,
): Promise<AiRecommendStaleSuppression> {
  ensureAiRecommendStaleSuppressions(store);
  const now = new Date().toISOString();
  const existing = findAiRecommendStaleSuppression(store, principal);
  const next: AiRecommendStaleSuppression = {
    tenantId: principal.tenantId,
    principalId: principal.id,
    ...(existing ?? {}),
    ...patch,
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  const idx = store.aiRecommendStaleSuppressions.findIndex(
    (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
  );
  if (idx >= 0) store.aiRecommendStaleSuppressions[idx] = next;
  else store.aiRecommendStaleSuppressions.push(next);
  await persistAiRecommendStaleSuppression(store.dbPool, next);
  await appendAiRecommendStaleSuppressionAudit(store, principal, next.acknowledgedAt ? "ack" : "snooze", next);
  return next;
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

async function rememberRecommendRun(
  store: Store,
  principal: Principal,
  keys: string[],
): Promise<AiRecommendLastRun> {
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
  const existing = findAiRecommendStaleSuppression(store, principal);
  clearAiRecommendStaleSuppression(store, principal);
  if (existing) await appendAiRecommendStaleSuppressionAudit(store, principal, "cleared", existing);
  await persistDeleteAiRecommendStaleSuppression(store.dbPool, principal.tenantId, principal.id);
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

  const lastRun = await rememberRecommendRun(
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
    freshness: aiRecommendLastRunFreshness(lastRun.occurredAt, Date.now(), recommendStaleThresholdHours()),
    suppression: null,
    suppressed: false,
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
  const freshness = aiRecommendLastRunFreshness(
    lastRun?.occurredAt,
    Date.now(),
    recommendStaleThresholdHours(),
  );
  const rawSuppression = findAiRecommendStaleSuppression(store, principal);
  const suppressed = isAiRecommendStaleSuppressed(rawSuppression);
  return {
    lastRun,
    keys,
    matchCount: keys.length,
    filter: { key: key?.trim() ? key.trim() : null },
    freshness,
    suppression: rawSuppression ? sanitizeAiRecommendStaleSuppression(rawSuppression) : null,
    suppressed,
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
        stale: viewed.freshness.stale,
        neverRun: viewed.freshness.neverRun,
        ageHours: viewed.freshness.ageHours,
        thresholdHours: viewed.freshness.thresholdHours,
      }),
    };
  }
  return { ...viewed, format: "json" as const, generatedAt };
}

export function exportAiRecommendStaleSuppression(
  store: Store,
  principal: Principal,
  query?: { format?: string },
) {
  if (query?.format && query.format !== "json" && query.format !== "csv") {
    return { error: "invalid_request" as const, reason: "invalid_format" };
  }
  const viewed = lastRunView(store, principal);
  if ("error" in viewed) return viewed;
  ensureAiRecommendStaleSuppressionAudits(store);
  const audits = store.aiRecommendStaleSuppressionAudits
    .filter((row) => row.tenantId === principal.tenantId && row.principalId === principal.id)
    .map(sanitizeAiRecommendStaleSuppressionAudit);
  const generatedAt = new Date().toISOString();
  const format = query?.format === "csv" ? "csv" : "json";
  if (format === "csv") {
    return {
      format: "csv" as const,
      csv: formatAiRecommendStaleSuppressionAuditCsv(audits),
      suppression: viewed.suppression,
      suppressed: viewed.suppressed,
      audits,
      count: audits.length,
      generatedAt,
      increment: INCREMENT,
    };
  }
  return {
    format: "json" as const,
    suppression: viewed.suppression,
    suppressed: viewed.suppressed,
    audits,
    count: audits.length,
    generatedAt,
    increment: INCREMENT,
  };
}

export async function snoozeAiRecommendStale(store: Store, principal: Principal, input: { hours?: number } = {}) {
  const decision = authorize({
    principal,
    permission: "ai:write:draft",
    action: "snooze:ai_recommend_stale",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const hours = Number(input.hours ?? 24);
  if (!Number.isFinite(hours) || hours <= 0) {
    return { error: "invalid_request" as const, reason: "invalid_hours" };
  }
  const suppression = await upsertAiRecommendStaleSuppression(store, principal, {
    snoozedUntil: new Date(Date.now() + hours * 3_600_000).toISOString(),
    acknowledgedAt: undefined,
  });
  return {
    suppression: sanitizeAiRecommendStaleSuppression(suppression),
    suppressed: true,
    increment: INCREMENT,
  };
}

export async function acknowledgeAiRecommendStale(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "ai:write:draft",
    action: "ack:ai_recommend_stale",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const suppression = await upsertAiRecommendStaleSuppression(store, principal, {
    acknowledgedAt: new Date().toISOString(),
    snoozedUntil: undefined,
  });
  return {
    suppression: sanitizeAiRecommendStaleSuppression(suppression),
    suppressed: true,
    increment: INCREMENT,
  };
}
