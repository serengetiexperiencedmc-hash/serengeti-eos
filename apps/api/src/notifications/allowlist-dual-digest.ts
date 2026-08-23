import {
  authorize,
  filterNotifAllowlistDualDigestStaleSuppressionAudits,
  formatNotifAllowlistDualDigestStaleAuditExportPresetUsageCsv,
  newId,
  normalizeNotifAllowlistDualDigestStaleAuditExportPresetName,
  parseNotifAllowlistDualDigestStaleAuditExportFilter,
  sanitizeNotifAllowlistDualDigestStaleAuditExportLastFilter,
  sanitizeNotifAllowlistDualDigestStaleAuditExportLastPreset,
  sanitizeNotifAllowlistDualDigestStaleAuditExportPreset,
  sanitizeNotifAllowlistDualDigestStaleAuditExportPresetUsage,
  type NotifAllowlistDualDigestLastRun,
  type NotifAllowlistDualDigestStaleAuditExportLastFilter,
  type NotifAllowlistDualDigestStaleAuditExportLastPreset,
  type NotifAllowlistDualDigestStaleAuditExportPreset,
  type NotifAllowlistDualDigestStaleAuditExportPresetUsage,
  type NotifAllowlistDualDigestStaleSuppression,
  type NotifAllowlistDualDigestStaleSuppressionAudit,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { createEmailAdapter } from "./email.js";
import { ensureNotificationCollections } from "./collections.js";
import { resolveAllowlistDualDigestRecipientEmails } from "./allowlist-dual-digest-recipients.js";
import {
  persistDeleteNotifAllowlistDualDigestStaleSuppression,
  persistDeleteNotifAllowlistDualDigestStaleAuditExportPreset,
  persistNotifAllowlistDualDigestLastRun,
  persistNotifAllowlistDualDigestStaleAuditExportLastFilter,
  persistNotifAllowlistDualDigestStaleAuditExportPreset,
  persistNotifAllowlistDualDigestStaleSuppression,
  persistNotifAllowlistDualDigestStaleSuppressionAudit,
} from "../persistence/notifications.js";
import { digestLastRunFreshness } from "./digest-freshness.js";

const INCREMENT = "I3.36" as const;

function stampLastRun(
  store: Store,
  principal: Principal,
  day: string,
  counts: {
    pendingCount: number;
    dispatchedCount: number;
    skippedCount: number;
    recipientCount: number;
  },
) {
  ensureNotificationCollections(store);
  const run: NotifAllowlistDualDigestLastRun = {
    tenantId: principal.tenantId,
    day,
    lastRunAt: new Date().toISOString(),
    lastRunByPrincipalId: principal.id,
    pendingCount: counts.pendingCount,
    dispatchedCount: counts.dispatchedCount,
    skippedCount: counts.skippedCount,
    recipientCount: counts.recipientCount,
  };
  const idx = (store.notifAllowlistDualDigestLastRuns ?? []).findIndex((r) => r.tenantId === principal.tenantId);
  if (idx >= 0) store.notifAllowlistDualDigestLastRuns[idx] = run;
  else store.notifAllowlistDualDigestLastRuns.push(run);
  void persistNotifAllowlistDualDigestLastRun(store.dbPool, run);
  store.notifAllowlistDualDigestStaleSuppressions = (store.notifAllowlistDualDigestStaleSuppressions ?? []).filter(
    (s) => s.tenantId !== principal.tenantId,
  );
  void persistDeleteNotifAllowlistDualDigestStaleSuppression(store.dbPool, principal.tenantId);
  appendStaleSuppressionAudit(store, principal, "cleared");
  return run;
}

export function getAllowlistDualDigestStaleSuppression(store: Store, tenantId: string) {
  return (store.notifAllowlistDualDigestStaleSuppressions ?? []).find((s) => s.tenantId === tenantId) ?? null;
}

export function isAllowlistDualDigestStaleSuppressed(store: Store, tenantId: string, nowMs = Date.now()) {
  const suppression = getAllowlistDualDigestStaleSuppression(store, tenantId);
  if (!suppression) return false;
  if (suppression.acknowledgedAt) return true;
  if (suppression.snoozedUntil && new Date(suppression.snoozedUntil).getTime() > nowMs) return true;
  return false;
}

function upsertStaleSuppression(
  store: Store,
  principal: Principal,
  patch: Partial<Pick<NotifAllowlistDualDigestStaleSuppression, "acknowledgedAt" | "snoozedUntil">>,
) {
  ensureNotificationCollections(store);
  const now = new Date().toISOString();
  const existing = getAllowlistDualDigestStaleSuppression(store, principal.tenantId);
  const next: NotifAllowlistDualDigestStaleSuppression = {
    tenantId: principal.tenantId,
    ...existing,
    ...patch,
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  const idx = (store.notifAllowlistDualDigestStaleSuppressions ?? []).findIndex((s) => s.tenantId === principal.tenantId);
  if (idx >= 0) store.notifAllowlistDualDigestStaleSuppressions[idx] = next;
  else store.notifAllowlistDualDigestStaleSuppressions.push(next);
  void persistNotifAllowlistDualDigestStaleSuppression(store.dbPool, next);
  appendStaleSuppressionAudit(store, principal, next.acknowledgedAt ? "ack" : "snooze", next);
  return next;
}

function appendStaleSuppressionAudit(
  store: Store,
  principal: Principal,
  action: NotifAllowlistDualDigestStaleSuppressionAudit["action"],
  suppression?: NotifAllowlistDualDigestStaleSuppression | null,
) {
  ensureNotificationCollections(store);
  const entry: NotifAllowlistDualDigestStaleSuppressionAudit = {
    id: newId(),
    tenantId: principal.tenantId,
    action,
    ...(suppression?.snoozedUntil ? { snoozedUntil: suppression.snoozedUntil } : {}),
    ...(suppression?.acknowledgedAt ? { acknowledgedAt: suppression.acknowledgedAt } : {}),
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
  };
  store.notifAllowlistDualDigestStaleSuppressionAudits.push(entry);
  void persistNotifAllowlistDualDigestStaleSuppressionAudit(store.dbPool, entry);
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function findAllowlistStaleAuditExportLastFilter(store: Store, principal: Principal) {
  ensureNotificationCollections(store);
  return (
    store.notifAllowlistDualDigestStaleAuditExportLastFilters.find(
      (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
    ) ?? null
  );
}

function findAllowlistStaleAuditExportLastPreset(store: Store, principal: Principal) {
  ensureNotificationCollections(store);
  return (
    store.notifAllowlistDualDigestStaleAuditExportLastPresets.find(
      (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
    ) ?? null
  );
}

function principalAllowlistPresetUsages(store: Store, principal: Principal) {
  ensureNotificationCollections(store);
  return store.notifAllowlistDualDigestStaleAuditExportPresetUsages
    .filter((row) => row.tenantId === principal.tenantId && row.principalId === principal.id)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function recordAllowlistStaleAuditExportPresetUsage(
  store: Store,
  principal: Principal,
  preset: NotifAllowlistDualDigestStaleAuditExportPreset,
) {
  ensureNotificationCollections(store);
  const usedAt = new Date().toISOString();
  const usage: NotifAllowlistDualDigestStaleAuditExportPresetUsage = {
    id: newId(),
    tenantId: principal.tenantId,
    principalId: principal.id,
    presetId: preset.id,
    presetName: preset.name,
    createdAt: usedAt,
    createdByPrincipalId: principal.id,
  };
  store.notifAllowlistDualDigestStaleAuditExportPresetUsages.push(usage);
  const last: NotifAllowlistDualDigestStaleAuditExportLastPreset = {
    tenantId: principal.tenantId,
    principalId: principal.id,
    presetId: preset.id,
    presetName: preset.name,
    usedAt,
  };
  const idx = store.notifAllowlistDualDigestStaleAuditExportLastPresets.findIndex(
    (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
  );
  if (idx >= 0) store.notifAllowlistDualDigestStaleAuditExportLastPresets[idx] = last;
  else store.notifAllowlistDualDigestStaleAuditExportLastPresets.push(last);
  return { usage, last };
}

async function upsertAllowlistStaleAuditExportLastFilter(
  store: Store,
  principal: Principal,
  filter: { action: NotifAllowlistDualDigestStaleAuditExportLastFilter["action"] | null; since: string | null; until: string | null },
): Promise<NotifAllowlistDualDigestStaleAuditExportLastFilter> {
  ensureNotificationCollections(store);
  const next: NotifAllowlistDualDigestStaleAuditExportLastFilter = {
    tenantId: principal.tenantId,
    principalId: principal.id,
    ...(filter.action ? { action: filter.action } : {}),
    ...(filter.since ? { since: filter.since } : {}),
    ...(filter.until ? { until: filter.until } : {}),
    updatedAt: new Date().toISOString(),
  };
  const idx = store.notifAllowlistDualDigestStaleAuditExportLastFilters.findIndex(
    (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
  );
  if (idx >= 0) store.notifAllowlistDualDigestStaleAuditExportLastFilters[idx] = next;
  else store.notifAllowlistDualDigestStaleAuditExportLastFilters.push(next);
  await persistNotifAllowlistDualDigestStaleAuditExportLastFilter(store.dbPool, next);
  return next;
}

function listTenantAllowlistStaleAuditExportPresets(store: Store, tenantId: string) {
  ensureNotificationCollections(store);
  return store.notifAllowlistDualDigestStaleAuditExportPresets
    .filter((row) => row.tenantId === tenantId)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
}

function sanitizedTenantAllowlistPresets(store: Store, tenantId: string) {
  return listTenantAllowlistStaleAuditExportPresets(store, tenantId).map(
    sanitizeNotifAllowlistDualDigestStaleAuditExportPreset,
  );
}

function findAllowlistStaleAuditExportPreset(
  store: Store,
  tenantId: string,
  query: { presetId?: string; preset?: string },
) {
  ensureNotificationCollections(store);
  const presetId = query.presetId?.trim();
  if (presetId) {
    return (
      store.notifAllowlistDualDigestStaleAuditExportPresets.find(
        (row) => row.tenantId === tenantId && row.id === presetId,
      ) ?? null
    );
  }
  const name = normalizeNotifAllowlistDualDigestStaleAuditExportPresetName(query.preset);
  if (!name) return null;
  const lowered = name.toLowerCase();
  return (
    store.notifAllowlistDualDigestStaleAuditExportPresets.find(
      (row) => row.tenantId === tenantId && row.name.toLowerCase() === lowered,
    ) ?? null
  );
}

/**
 * I3.21–I3.23 — batched email summarizing pending SES allowlist dual-control approvals.
 * Fans out to caller + store/env ops aliases; respects I3.20 snooze/dismiss.
 * I3.23/I3.24 stamps last-run metadata (Postgres dual-write when pool set).
 */
export async function dispatchAllowlistDualDigest(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "dispatch:allowlist_dual_digest",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }

  ensureNotificationCollections(store);
  const recipients = resolveAllowlistDualDigestRecipientEmails(store, principal);
  if (recipients.length === 0) {
    return { error: "invalid_request" as const, reason: "no_digest_recipients" };
  }

  const nowMs = Date.now();
  const pending = (store.notifEmailAllowlist ?? []).filter((entry) => {
    if (entry.tenantId !== principal.tenantId) return false;
    if (entry.revokedAt) return false;
    if (entry.expiresAt && new Date(entry.expiresAt).getTime() <= nowMs) return false;
    if (entry.sesDualControlStatus !== "pending") return false;
    if (entry.dualReminderDismissedAt) return false;
    if (entry.dualReminderSnoozeUntil && new Date(entry.dualReminderSnoozeUntil).getTime() > nowMs) {
      return false;
    }
    return true;
  });

  const day = new Date().toISOString().slice(0, 10);
  const adapter = createEmailAdapter(store, principal);

  if (pending.length === 0) {
    const lastRun = stampLastRun(store, principal, day, {
      pendingCount: 0,
      dispatchedCount: 0,
      skippedCount: 1,
      recipientCount: recipients.length,
    });
    return {
      dispatched: [] as string[],
      skipped: [{ key: `allowlist-dual-digest:${day}`, reason: "none_pending" }],
      adapter: adapter.name,
      pendingCount: 0,
      recipientCount: recipients.length,
      lastRun,
      increment: INCREMENT,
    };
  }

  const lines = pending.map(
    (e) =>
      `- ${e.email}${e.sesSyncNote ? ` · ${e.sesSyncNote}` : ""} · id ${e.id}`,
  );
  const bodyText = [
    `${pending.length} SES allowlist dual-control approval(s) pending.`,
    "",
    ...lines,
    "",
    "View in EOS: /commercial/notifications",
  ].join("\n");
  const subject = `[EOS URGENT] Allowlist dual-control digest — ${pending.length} pending`;

  const dispatched: string[] = [];
  const skipped: { key: string; reason?: string; to?: string }[] = [];

  for (const email of recipients) {
    const key = `allowlist-dual-digest:${day}:${email}`;
    const result = await adapter.send({
      to: email,
      subject,
      bodyText,
      notificationKey: key,
      templateKey: "notif.approval.allowlist_dual_digest",
    });
    if (result.status === "sent") dispatched.push(key);
    else skipped.push({ key, reason: result.reason, to: email });
  }

  const lastRun = stampLastRun(store, principal, day, {
    pendingCount: pending.length,
    dispatchedCount: dispatched.length,
    skippedCount: skipped.length,
    recipientCount: recipients.length,
  });

  return {
    dispatched,
    skipped,
    adapter: adapter.name,
    pendingCount: pending.length,
    recipientCount: recipients.length,
    lastRun,
    increment: INCREMENT,
  };
}

/** I3.23–I3.25 — last-run stamp + outbox digest analytics + freshness. */
export function getAllowlistDualDigestStatus(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "notification:read:email_outbox",
    action: "read:allowlist_dual_digest_status",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }

  ensureNotificationCollections(store);
  const lastRun =
    (store.notifAllowlistDualDigestLastRuns ?? []).find((r) => r.tenantId === principal.tenantId) ?? null;

  const byStatus: Record<string, number> = {};
  let outboxDigestCount = 0;
  for (const entry of store.notifEmailOutbox ?? []) {
    if (entry.tenantId !== principal.tenantId) continue;
    if (!entry.notificationKey.startsWith("allowlist-dual-digest:")) continue;
    outboxDigestCount += 1;
    byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;
  }

  return {
    lastRun,
    analytics: {
      outboxDigestCount,
      outboxByStatus: byStatus,
    },
    freshness: digestLastRunFreshness(lastRun?.lastRunAt, Date.now(), "EOS_ALLOWLIST_DUAL_DIGEST_STALE_HOURS"),
    suppression: getAllowlistDualDigestStaleSuppression(store, principal.tenantId),
    lastFilter: (() => {
      const last = findAllowlistStaleAuditExportLastFilter(store, principal);
      return last ? sanitizeNotifAllowlistDualDigestStaleAuditExportLastFilter(last) : null;
    })(),
    lastPreset: (() => {
      const last = findAllowlistStaleAuditExportLastPreset(store, principal);
      return last ? sanitizeNotifAllowlistDualDigestStaleAuditExportLastPreset(last) : null;
    })(),
    usages: principalAllowlistPresetUsages(store, principal).map(
      sanitizeNotifAllowlistDualDigestStaleAuditExportPresetUsage,
    ),
    presets: sanitizedTenantAllowlistPresets(store, principal.tenantId),
    increment: INCREMENT,
  };
}

export function listAllowlistDualDigestStaleAuditExportPresets(store: Store, principal: Principal) {
  const status = getAllowlistDualDigestStatus(store, principal);
  if ("error" in status) return status;
  return { presets: status.presets, increment: INCREMENT };
}

export async function upsertAllowlistDualDigestStaleAuditExportPreset(
  store: Store,
  principal: Principal,
  input: { name?: string; action?: string; since?: string; until?: string } = {},
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "write:allowlist_dual_digest_stale_audit_export_preset",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const name = normalizeNotifAllowlistDualDigestStaleAuditExportPresetName(input.name);
  if (!name) return { error: "invalid_request" as const, reason: "invalid_name" };
  const parsed = parseNotifAllowlistDualDigestStaleAuditExportFilter(input);
  if ("error" in parsed) return { error: "invalid_request" as const, reason: parsed.error };
  ensureNotificationCollections(store);
  const now = new Date().toISOString();
  const existing = findAllowlistStaleAuditExportPreset(store, principal.tenantId, { preset: name });
  const next: NotifAllowlistDualDigestStaleAuditExportPreset = existing
    ? {
        ...existing,
        name,
        action: parsed.action ?? undefined,
        since: parsed.since ?? undefined,
        until: parsed.until ?? undefined,
        updatedAt: now,
      }
    : {
        id: newId(),
        tenantId: principal.tenantId,
        name,
        ...(parsed.action ? { action: parsed.action } : {}),
        ...(parsed.since ? { since: parsed.since } : {}),
        ...(parsed.until ? { until: parsed.until } : {}),
        createdAt: now,
        createdByPrincipalId: principal.id,
        updatedAt: now,
      };
  if (!parsed.action) delete next.action;
  if (!parsed.since) delete next.since;
  if (!parsed.until) delete next.until;
  const idx = existing
    ? store.notifAllowlistDualDigestStaleAuditExportPresets.findIndex((row) => row.id === existing.id)
    : -1;
  if (idx >= 0) store.notifAllowlistDualDigestStaleAuditExportPresets[idx] = next;
  else store.notifAllowlistDualDigestStaleAuditExportPresets.push(next);
  await persistNotifAllowlistDualDigestStaleAuditExportPreset(store.dbPool, next);
  return {
    preset: sanitizeNotifAllowlistDualDigestStaleAuditExportPreset(next),
    presets: sanitizedTenantAllowlistPresets(store, principal.tenantId),
    increment: INCREMENT,
  };
}

export async function renameAllowlistDualDigestStaleAuditExportPreset(
  store: Store,
  principal: Principal,
  id: string,
  input: { name?: string } = {},
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "rename:allowlist_dual_digest_stale_audit_export_preset",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const name = normalizeNotifAllowlistDualDigestStaleAuditExportPresetName(input.name);
  if (!name) return { error: "invalid_request" as const, reason: "invalid_name" };
  ensureNotificationCollections(store);
  const existing = findAllowlistStaleAuditExportPreset(store, principal.tenantId, { presetId: id });
  if (!existing) return { error: "not_found" as const, reason: "preset_not_found" };
  const clash = findAllowlistStaleAuditExportPreset(store, principal.tenantId, { preset: name });
  if (clash && clash.id !== existing.id) return { error: "conflict" as const, reason: "name_taken" };
  const next = { ...existing, name, updatedAt: new Date().toISOString() };
  const idx = store.notifAllowlistDualDigestStaleAuditExportPresets.findIndex((row) => row.id === existing.id);
  store.notifAllowlistDualDigestStaleAuditExportPresets[idx] = next;
  await persistNotifAllowlistDualDigestStaleAuditExportPreset(store.dbPool, next);
  return {
    preset: sanitizeNotifAllowlistDualDigestStaleAuditExportPreset(next),
    presets: sanitizedTenantAllowlistPresets(store, principal.tenantId),
    increment: INCREMENT,
  };
}

export async function deleteAllowlistDualDigestStaleAuditExportPreset(
  store: Store,
  principal: Principal,
  id: string,
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "delete:allowlist_dual_digest_stale_audit_export_preset",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  ensureNotificationCollections(store);
  const existing = findAllowlistStaleAuditExportPreset(store, principal.tenantId, { presetId: id });
  if (!existing) return { error: "not_found" as const, reason: "preset_not_found" };
  store.notifAllowlistDualDigestStaleAuditExportPresets = store.notifAllowlistDualDigestStaleAuditExportPresets.filter(
    (row) => row.id !== existing.id,
  );
  await persistDeleteNotifAllowlistDualDigestStaleAuditExportPreset(store.dbPool, existing.id);
  return {
    presets: sanitizedTenantAllowlistPresets(store, principal.tenantId),
    increment: INCREMENT,
  };
}

/** I3.26 — email escalation when allowlist dual digest last-run is stale / never-run. */
export async function dispatchAllowlistDualDigestStaleAlert(store: Store, principal: Principal) {
  const dispatchAuth = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "dispatch:allowlist_dual_digest_stale",
  });
  if (dispatchAuth.result === "deny") {
    return { error: "forbidden" as const, reason: dispatchAuth.reason };
  }

  const status = getAllowlistDualDigestStatus(store, principal);
  if ("error" in status) return status;

  ensureNotificationCollections(store);
  const recipients = resolveAllowlistDualDigestRecipientEmails(store, principal);
  if (recipients.length === 0) {
    return { error: "invalid_request" as const, reason: "no_digest_recipients" };
  }

  const day = new Date().toISOString().slice(0, 10);
  const adapter = createEmailAdapter(store, principal);
  const inboxKey = `allowlist-dual-digest-stale:${day}`;

  if (!status.freshness.stale) {
    return {
      dispatched: [] as string[],
      skipped: [{ key: inboxKey, reason: "not_stale" }],
      adapter: adapter.name,
      freshness: status.freshness,
      inboxKey,
      increment: INCREMENT,
    };
  }

  if (isAllowlistDualDigestStaleSuppressed(store, principal.tenantId)) {
    const suppression = getAllowlistDualDigestStaleSuppression(store, principal.tenantId);
    return {
      dispatched: [] as string[],
      skipped: [
        {
          key: inboxKey,
          reason: suppression?.acknowledgedAt ? "acknowledged" : "snoozed",
        },
      ],
      adapter: adapter.name,
      freshness: status.freshness,
      inboxKey,
      increment: INCREMENT,
    };
  }

  const age = status.freshness.neverRun
    ? "never run"
    : `${status.freshness.ageHours ?? "?"}h old (threshold ${status.freshness.thresholdHours}h)`;
  const subject = `[EOS URGENT] Allowlist dual digest stale — ${age}`;
  const bodyText = [
    "The allowlist dual-control digest last-run is stale.",
    "",
    `Status: ${status.freshness.neverRun ? "never run" : `last run ${status.lastRun?.lastRunAt}`}`,
    `Age: ${age}`,
    "",
    "Dispatch the digest or check /commercial/notifications.",
  ].join("\n");

  const dispatched: string[] = [];
  const skipped: { key: string; reason?: string; to?: string }[] = [];
  for (const email of recipients) {
    const key = `allowlist-dual-digest-stale:${day}:${email}`;
    const result = await adapter.send({
      to: email,
      subject,
      bodyText,
      notificationKey: key,
      templateKey: "notif.approval.allowlist_dual_digest_stale",
    });
    if (result.status === "sent") dispatched.push(key);
    else skipped.push({ key, reason: result.reason, to: email });
  }

  return {
    dispatched,
    skipped,
    adapter: adapter.name,
    freshness: status.freshness,
    inboxKey,
    increment: INCREMENT,
  };
}

/** I3.27 — snooze stale-digest inbox / email escalation. */
export function snoozeAllowlistDualDigestStale(store: Store, principal: Principal, input: { hours?: number } = {}) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "snooze:allowlist_dual_digest_stale",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const hours = Number(input.hours ?? 24);
  if (!Number.isFinite(hours) || hours <= 0) {
    return { error: "invalid_request" as const, reason: "invalid_hours" };
  }
  ensureNotificationCollections(store);
  const snoozedUntil = new Date(Date.now() + hours * 3_600_000).toISOString();
  const suppression = upsertStaleSuppression(store, principal, {
    snoozedUntil,
    acknowledgedAt: undefined,
  });
  return { suppression, increment: INCREMENT };
}

/** I3.27 — acknowledge stale-digest inbox until the next last-run stamp. */
export function acknowledgeAllowlistDualDigestStale(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "ack:allowlist_dual_digest_stale",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  ensureNotificationCollections(store);
  const suppression = upsertStaleSuppression(store, principal, {
    acknowledgedAt: new Date().toISOString(),
    snoozedUntil: undefined,
  });
  return { suppression, increment: INCREMENT };
}

/** I3.29 / I3.31 / I3.32 / I3.33 / I3.34 / I3.35 / I3.36 — CSV/JSON export of current suppression + snooze/ack/clear audit. */
export async function exportAllowlistDualDigestStaleSuppression(
  store: Store,
  principal: Principal,
  options: {
    format?: "json" | "csv";
    action?: string;
    since?: string;
    until?: string;
    preset?: string;
    presetId?: string;
  } = {},
) {
  const presetId = options.presetId?.trim();
  const presetName = options.preset?.trim();
  let preset: NotifAllowlistDualDigestStaleAuditExportPreset | null = null;
  if (presetId || presetName) {
    if (presetName && !presetId && !normalizeNotifAllowlistDualDigestStaleAuditExportPresetName(presetName)) {
      return { error: "invalid_request" as const, reason: "invalid_name" };
    }
    preset = findAllowlistStaleAuditExportPreset(store, principal.tenantId, {
      ...(presetId ? { presetId } : {}),
      ...(presetName ? { preset: presetName } : {}),
    });
    if (!preset) return { error: "not_found" as const, reason: "preset_not_found" };
  }
  const parsed = parseNotifAllowlistDualDigestStaleAuditExportFilter({
    action: options.action || preset?.action,
    since: options.since || preset?.since,
    until: options.until || preset?.until,
  });
  if ("error" in parsed) return { error: "invalid_request" as const, reason: parsed.error };
  const status = getAllowlistDualDigestStatus(store, principal);
  if ("error" in status) return status;

  ensureNotificationCollections(store);
  const generatedAt = new Date().toISOString();
  const format = options.format === "csv" ? "csv" : "json";
  const suppression = status.suppression;
  const filter = { action: parsed.action, since: parsed.since, until: parsed.until };
  const last = await upsertAllowlistStaleAuditExportLastFilter(store, principal, filter);
  const lastFilter = sanitizeNotifAllowlistDualDigestStaleAuditExportLastFilter(last);
  const recorded = preset ? recordAllowlistStaleAuditExportPresetUsage(store, principal, preset) : null;
  const lastPreset = recorded
    ? sanitizeNotifAllowlistDualDigestStaleAuditExportLastPreset(recorded.last)
    : (() => {
        const existing = findAllowlistStaleAuditExportLastPreset(store, principal);
        return existing ? sanitizeNotifAllowlistDualDigestStaleAuditExportLastPreset(existing) : null;
      })();
  const audits = filterNotifAllowlistDualDigestStaleSuppressionAudits(
    (store.notifAllowlistDualDigestStaleSuppressionAudits ?? []).filter((a) => a.tenantId === principal.tenantId),
    parsed,
  );
  const sanitizedPreset = preset ? sanitizeNotifAllowlistDualDigestStaleAuditExportPreset(preset) : null;

  if (format === "csv") {
    const csv = [
      "action,snoozedUntil,acknowledgedAt,createdAt,createdByPrincipalId",
      ...audits.map((row) =>
        [
          row.action,
          row.snoozedUntil ?? "",
          row.acknowledgedAt ?? "",
          row.createdAt,
          row.createdByPrincipalId,
        ]
          .map(csvEscape)
          .join(","),
      ),
    ].join("\n");
    return {
      format,
      csv,
      suppression,
      audits,
      count: audits.length,
      filter,
      lastFilter,
      lastPreset,
      preset: sanitizedPreset,
      generatedAt,
      increment: INCREMENT,
    };
  }

  return {
    format,
    suppression,
    audits,
    count: audits.length,
    filter,
    lastFilter,
    lastPreset,
    preset: sanitizedPreset,
    generatedAt,
    increment: INCREMENT,
  };
}

/** I3.36 — JSON/CSV export of the caller’s in-memory allowlist preset usage. Does not record usage. */
export function exportAllowlistDualDigestStaleAuditExportPresetUsage(
  store: Store,
  principal: Principal,
  query?: { format?: string },
) {
  if (query?.format && query.format !== "json" && query.format !== "csv") {
    return { error: "invalid_request" as const, reason: "invalid_format" };
  }
  const decision = authorize({
    principal,
    permission: "notification:read:email_outbox",
    action: "read:allowlist_dual_digest_stale_audit_export_preset_usage",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  ensureNotificationCollections(store);
  const existing = findAllowlistStaleAuditExportLastPreset(store, principal);
  const lastPreset = existing ? sanitizeNotifAllowlistDualDigestStaleAuditExportLastPreset(existing) : null;
  const usages = principalAllowlistPresetUsages(store, principal).map(
    sanitizeNotifAllowlistDualDigestStaleAuditExportPresetUsage,
  );
  const generatedAt = new Date().toISOString();
  const format = query?.format === "csv" ? "csv" : "json";
  if (format === "csv") {
    return {
      format: "csv" as const,
      csv: formatNotifAllowlistDualDigestStaleAuditExportPresetUsageCsv(usages),
      lastPreset,
      usages,
      count: usages.length,
      generatedAt,
      increment: INCREMENT,
    };
  }
  return {
    format: "json" as const,
    lastPreset,
    usages,
    count: usages.length,
    generatedAt,
    increment: INCREMENT,
  };
}
