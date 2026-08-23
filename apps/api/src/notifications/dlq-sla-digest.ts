import {
  authorize,
  filterNotifDlqSlaDigestStaleSuppressionAudits,
  newId,
  normalizeNotifDlqSlaDigestStaleAuditExportPresetName,
  parseNotifDlqSlaDigestStaleAuditExportFilter,
  sanitizeNotifDlqSlaDigestStaleAuditExportLastFilter,
  sanitizeNotifDlqSlaDigestStaleAuditExportPreset,
  type NotifDlqSlaDigestLastRun,
  type NotifDlqSlaDigestStaleAuditExportLastFilter,
  type NotifDlqSlaDigestStaleAuditExportPreset,
  type NotifDlqSlaDigestStaleSuppression,
  type NotifDlqSlaDigestStaleSuppressionAudit,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { listDeadLetters } from "../outbox.js";
import { createEmailAdapter } from "./email.js";
import { ensureNotificationCollections } from "./collections.js";
import { resolveDlqSlaDigestRecipientEmails } from "./dlq-sla-digest-recipients.js";
import {
  persistDeleteNotifDlqSlaDigestStaleSuppression,
  persistNotifDlqSlaDigestLastRun,
  persistNotifDlqSlaDigestStaleAuditExportLastFilter,
  persistNotifDlqSlaDigestStaleSuppression,
  persistNotifDlqSlaDigestStaleSuppressionAudit,
} from "../persistence/notifications.js";
import { digestLastRunFreshness } from "./digest-freshness.js";

function stampLastRun(
  store: Store,
  principal: Principal,
  day: string,
  counts: {
    breachedCount: number;
    dispatchedCount: number;
    skippedCount: number;
    recipientCount: number;
  },
) {
  ensureNotificationCollections(store);
  const run: NotifDlqSlaDigestLastRun = {
    tenantId: principal.tenantId,
    day,
    lastRunAt: new Date().toISOString(),
    lastRunByPrincipalId: principal.id,
    breachedCount: counts.breachedCount,
    dispatchedCount: counts.dispatchedCount,
    skippedCount: counts.skippedCount,
    recipientCount: counts.recipientCount,
  };
  const idx = (store.notifDlqSlaDigestLastRuns ?? []).findIndex((r) => r.tenantId === principal.tenantId);
  if (idx >= 0) store.notifDlqSlaDigestLastRuns[idx] = run;
  else store.notifDlqSlaDigestLastRuns.push(run);
  void persistNotifDlqSlaDigestLastRun(store.dbPool, run);
  store.notifDlqSlaDigestStaleSuppressions = (store.notifDlqSlaDigestStaleSuppressions ?? []).filter(
    (s) => s.tenantId !== principal.tenantId,
  );
  void persistDeleteNotifDlqSlaDigestStaleSuppression(store.dbPool, principal.tenantId);
  appendStaleSuppressionAudit(store, principal, "cleared");
  return run;
}

export function getDlqSlaDigestStaleSuppression(store: Store, tenantId: string) {
  return (store.notifDlqSlaDigestStaleSuppressions ?? []).find((s) => s.tenantId === tenantId) ?? null;
}

export function isDlqSlaDigestStaleSuppressed(store: Store, tenantId: string, nowMs = Date.now()) {
  const suppression = getDlqSlaDigestStaleSuppression(store, tenantId);
  if (!suppression) return false;
  if (suppression.acknowledgedAt) return true;
  if (suppression.snoozedUntil && new Date(suppression.snoozedUntil).getTime() > nowMs) return true;
  return false;
}

function appendStaleSuppressionAudit(
  store: Store,
  principal: Principal,
  action: NotifDlqSlaDigestStaleSuppressionAudit["action"],
  suppression?: NotifDlqSlaDigestStaleSuppression | null,
) {
  ensureNotificationCollections(store);
  const entry: NotifDlqSlaDigestStaleSuppressionAudit = {
    id: newId(),
    tenantId: principal.tenantId,
    action,
    ...(suppression?.snoozedUntil ? { snoozedUntil: suppression.snoozedUntil } : {}),
    ...(suppression?.acknowledgedAt ? { acknowledgedAt: suppression.acknowledgedAt } : {}),
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
  };
  store.notifDlqSlaDigestStaleSuppressionAudits.push(entry);
  void persistNotifDlqSlaDigestStaleSuppressionAudit(store.dbPool, entry);
}

function upsertStaleSuppression(
  store: Store,
  principal: Principal,
  patch: Partial<Pick<NotifDlqSlaDigestStaleSuppression, "acknowledgedAt" | "snoozedUntil">>,
) {
  ensureNotificationCollections(store);
  const now = new Date().toISOString();
  const existing = getDlqSlaDigestStaleSuppression(store, principal.tenantId);
  const next: NotifDlqSlaDigestStaleSuppression = {
    tenantId: principal.tenantId,
    ...existing,
    ...patch,
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  const idx = (store.notifDlqSlaDigestStaleSuppressions ?? []).findIndex((s) => s.tenantId === principal.tenantId);
  if (idx >= 0) store.notifDlqSlaDigestStaleSuppressions[idx] = next;
  else store.notifDlqSlaDigestStaleSuppressions.push(next);
  void persistNotifDlqSlaDigestStaleSuppression(store.dbPool, next);
  appendStaleSuppressionAudit(store, principal, next.acknowledgedAt ? "ack" : "snooze", next);
  return next;
}

/**
 * I4.16–I4.20 — on-demand batched email summarizing open DLQ SLA breaches.
 * Fans out to caller + store/env ops aliases; dedupes per recipient per UTC day.
 * I4.19/I4.20 stamps last-run metadata (Postgres dual-write when pool set).
 */
export async function dispatchDlqSlaDigest(store: Store, principal: Principal) {
  const dispatchAuth = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "dispatch:dlq_sla_digest",
  });
  if (dispatchAuth.result === "deny") {
    return { error: "forbidden" as const, reason: dispatchAuth.reason };
  }

  const dlqAuth = authorize({
    principal,
    permission: "events:read:dlq",
    action: "read:dlq",
  });
  if (dlqAuth.result === "deny") {
    return { error: "forbidden" as const, reason: dlqAuth.reason };
  }

  ensureNotificationCollections(store);
  const recipients = resolveDlqSlaDigestRecipientEmails(store, principal);
  if (recipients.length === 0) {
    return { error: "invalid_request" as const, reason: "no_digest_recipients" };
  }

  const listed = listDeadLetters(store, principal, { slaBreached: true });
  if (!listed.ok) {
    return { error: "forbidden" as const, reason: listed.reason };
  }

  const day = new Date().toISOString().slice(0, 10);
  const adapter = createEmailAdapter(store, principal);

  if (listed.items.length === 0) {
    const lastRun = stampLastRun(store, principal, day, {
      breachedCount: 0,
      dispatchedCount: 0,
      skippedCount: 1,
      recipientCount: recipients.length,
    });
    return {
      dispatched: [] as string[],
      skipped: [{ key: `dlq-sla-digest:${day}`, reason: "none_breached" }],
      adapter: adapter.name,
      breachedCount: 0,
      thresholdHours: listed.sla.thresholdHours,
      recipientCount: recipients.length,
      lastRun,
      increment: "I4.30" as const,
    };
  }

  const lines = listed.items.map(
    (d) =>
      `- ${d.eventType} · ${d.ageHours}h open${d.owner ? ` · owner ${d.owner}` : ""} · ${d.id}`,
  );
  const bodyText = [
    `${listed.sla.breachedCount} DLQ SLA breach(es) (threshold ${listed.sla.thresholdHours}h).`,
    "",
    ...lines,
    "",
    "View in EOS: /commercial/events",
  ].join("\n");
  const subject = `[EOS URGENT] DLQ SLA digest — ${listed.sla.breachedCount} open`;

  const dispatched: string[] = [];
  const skipped: { key: string; reason?: string; to?: string }[] = [];

  for (const email of recipients) {
    const key = `dlq-sla-digest:${day}:${email}`;
    const result = await adapter.send({
      to: email,
      subject,
      bodyText,
      notificationKey: key,
      templateKey: "notif.operations.dlq_sla_digest",
    });
    if (result.status === "sent") dispatched.push(key);
    else skipped.push({ key, reason: result.reason, to: email });
  }

  const lastRun = stampLastRun(store, principal, day, {
    breachedCount: listed.sla.breachedCount,
    dispatchedCount: dispatched.length,
    skippedCount: skipped.length,
    recipientCount: recipients.length,
  });

  return {
    dispatched,
    skipped,
    adapter: adapter.name,
    breachedCount: listed.sla.breachedCount,
    thresholdHours: listed.sla.thresholdHours,
    recipientCount: recipients.length,
    lastRun,
    increment: "I4.30" as const,
  };
}

/** I4.19 — last-run stamp + outbox digest analytics for the tenant. */
export function getDlqSlaDigestStatus(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "notification:read:email_outbox",
    action: "read:dlq_sla_digest_status",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }

  ensureNotificationCollections(store);
  const lastRun =
    (store.notifDlqSlaDigestLastRuns ?? []).find((r) => r.tenantId === principal.tenantId) ?? null;

  const byStatus: Record<string, number> = {};
  let outboxDigestCount = 0;
  for (const entry of store.notifEmailOutbox ?? []) {
    if (entry.tenantId !== principal.tenantId) continue;
    if (!entry.notificationKey.startsWith("dlq-sla-digest:")) continue;
    outboxDigestCount += 1;
    byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;
  }

  return {
    lastRun,
    analytics: {
      outboxDigestCount,
      outboxByStatus: byStatus,
    },
    freshness: digestLastRunFreshness(lastRun?.lastRunAt),
    suppression: getDlqSlaDigestStaleSuppression(store, principal.tenantId),
    lastFilter: (() => {
      const last = findDlqStaleAuditExportLastFilter(store, principal);
      return last ? sanitizeNotifDlqSlaDigestStaleAuditExportLastFilter(last) : null;
    })(),
    presets: sanitizedTenantDlqPresets(store, principal.tenantId),
    increment: "I4.30" as const,
  };
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll("\"", "\"\"")}"`;
  return value;
}

function listTenantDlqStaleAuditExportPresets(store: Store, tenantId: string) {
  ensureNotificationCollections(store);
  return store.notifDlqSlaDigestStaleAuditExportPresets
    .filter((row) => row.tenantId === tenantId)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
}

function sanitizedTenantDlqPresets(store: Store, tenantId: string) {
  return listTenantDlqStaleAuditExportPresets(store, tenantId).map(
    sanitizeNotifDlqSlaDigestStaleAuditExportPreset,
  );
}

function findDlqStaleAuditExportPreset(
  store: Store,
  tenantId: string,
  query: { presetId?: string; preset?: string },
) {
  ensureNotificationCollections(store);
  const presetId = query.presetId?.trim();
  if (presetId) {
    return (
      store.notifDlqSlaDigestStaleAuditExportPresets.find(
        (row) => row.tenantId === tenantId && row.id === presetId,
      ) ?? null
    );
  }
  const name = normalizeNotifDlqSlaDigestStaleAuditExportPresetName(query.preset);
  if (!name) return null;
  const lowered = name.toLowerCase();
  return (
    store.notifDlqSlaDigestStaleAuditExportPresets.find(
      (row) => row.tenantId === tenantId && row.name.toLowerCase() === lowered,
    ) ?? null
  );
}

export function listDlqSlaDigestStaleAuditExportPresets(store: Store, principal: Principal) {
  const status = getDlqSlaDigestStatus(store, principal);
  if ("error" in status) return status;
  return { presets: status.presets, increment: "I4.30" as const };
}

export function upsertDlqSlaDigestStaleAuditExportPreset(
  store: Store,
  principal: Principal,
  input: { name?: string; action?: string; since?: string; until?: string } = {},
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "write:dlq_sla_digest_stale_audit_export_preset",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const name = normalizeNotifDlqSlaDigestStaleAuditExportPresetName(input.name);
  if (!name) return { error: "invalid_request" as const, reason: "invalid_name" };
  const parsed = parseNotifDlqSlaDigestStaleAuditExportFilter(input);
  if ("error" in parsed) return { error: "invalid_request" as const, reason: parsed.error };
  ensureNotificationCollections(store);
  const now = new Date().toISOString();
  const existing = findDlqStaleAuditExportPreset(store, principal.tenantId, { preset: name });
  const next: NotifDlqSlaDigestStaleAuditExportPreset = existing
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
    ? store.notifDlqSlaDigestStaleAuditExportPresets.findIndex((row) => row.id === existing.id)
    : -1;
  if (idx >= 0) store.notifDlqSlaDigestStaleAuditExportPresets[idx] = next;
  else store.notifDlqSlaDigestStaleAuditExportPresets.push(next);
  return {
    preset: sanitizeNotifDlqSlaDigestStaleAuditExportPreset(next),
    presets: sanitizedTenantDlqPresets(store, principal.tenantId),
    increment: "I4.30" as const,
  };
}

function findDlqStaleAuditExportLastFilter(store: Store, principal: Principal) {
  ensureNotificationCollections(store);
  return (
    store.notifDlqSlaDigestStaleAuditExportLastFilters.find(
      (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
    ) ?? null
  );
}

async function upsertDlqStaleAuditExportLastFilter(
  store: Store,
  principal: Principal,
  filter: { action: NotifDlqSlaDigestStaleAuditExportLastFilter["action"] | null; since: string | null; until: string | null },
): Promise<NotifDlqSlaDigestStaleAuditExportLastFilter> {
  ensureNotificationCollections(store);
  const next: NotifDlqSlaDigestStaleAuditExportLastFilter = {
    tenantId: principal.tenantId,
    principalId: principal.id,
    ...(filter.action ? { action: filter.action } : {}),
    ...(filter.since ? { since: filter.since } : {}),
    ...(filter.until ? { until: filter.until } : {}),
    updatedAt: new Date().toISOString(),
  };
  const idx = store.notifDlqSlaDigestStaleAuditExportLastFilters.findIndex(
    (row) => row.tenantId === principal.tenantId && row.principalId === principal.id,
  );
  if (idx >= 0) store.notifDlqSlaDigestStaleAuditExportLastFilters[idx] = next;
  else store.notifDlqSlaDigestStaleAuditExportLastFilters.push(next);
  await persistNotifDlqSlaDigestStaleAuditExportLastFilter(store.dbPool, next);
  return next;
}

/** I4.21 — CSV/JSON export of last-run + outbox analytics for ops dashboards. */
export function exportDlqSlaDigestLastRun(
  store: Store,
  principal: Principal,
  options: { format?: "json" | "csv" } = {},
) {
  const status = getDlqSlaDigestStatus(store, principal);
  if ("error" in status) return status;

  const generatedAt = new Date().toISOString();
  const format = options.format === "csv" ? "csv" : "json";
  const lastRun = status.lastRun;
  const row = {
    tenantId: lastRun?.tenantId ?? principal.tenantId,
    day: lastRun?.day ?? "",
    lastRunAt: lastRun?.lastRunAt ?? "",
    lastRunByPrincipalId: lastRun?.lastRunByPrincipalId ?? "",
    breachedCount: lastRun?.breachedCount ?? 0,
    dispatchedCount: lastRun?.dispatchedCount ?? 0,
    skippedCount: lastRun?.skippedCount ?? 0,
    recipientCount: lastRun?.recipientCount ?? 0,
    outboxDigestCount: status.analytics.outboxDigestCount,
    outboxSent: status.analytics.outboxByStatus.sent ?? 0,
    outboxQueued: status.analytics.outboxByStatus.queued ?? 0,
    outboxFailed: status.analytics.outboxByStatus.failed ?? 0,
    stale: status.freshness.stale,
    neverRun: status.freshness.neverRun,
    ageHours: status.freshness.ageHours ?? "",
    thresholdHours: status.freshness.thresholdHours,
  };

  if (format === "csv") {
    const header =
      "tenantId,day,lastRunAt,lastRunByPrincipalId,breachedCount,dispatchedCount,skippedCount,recipientCount,outboxDigestCount,outboxSent,outboxQueued,outboxFailed,stale,neverRun,ageHours,thresholdHours";
    const csv = [
      header,
      [
        row.tenantId,
        row.day,
        row.lastRunAt,
        row.lastRunByPrincipalId,
        String(row.breachedCount),
        String(row.dispatchedCount),
        String(row.skippedCount),
        String(row.recipientCount),
        String(row.outboxDigestCount),
        String(row.outboxSent),
        String(row.outboxQueued),
        String(row.outboxFailed),
        String(row.stale),
        String(row.neverRun),
        String(row.ageHours),
        String(row.thresholdHours),
      ]
        .map(csvEscape)
        .join(","),
    ].join("\n");
    return {
      format,
      csv,
      lastRun,
      analytics: status.analytics,
      freshness: status.freshness,
      generatedAt,
      increment: "I4.30" as const,
    };
  }

  return {
    format,
    lastRun,
    analytics: status.analytics,
    freshness: status.freshness,
    row,
    generatedAt,
    increment: "I4.30" as const,
  };
}

/** I4.23 — email escalation when last-run is stale / never-run (deduped per recipient per UTC day). */
export async function dispatchDlqSlaDigestStaleAlert(store: Store, principal: Principal) {
  const dispatchAuth = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "dispatch:dlq_sla_digest_stale",
  });
  if (dispatchAuth.result === "deny") {
    return { error: "forbidden" as const, reason: dispatchAuth.reason };
  }

  const status = getDlqSlaDigestStatus(store, principal);
  if ("error" in status) return status;

  ensureNotificationCollections(store);
  const recipients = resolveDlqSlaDigestRecipientEmails(store, principal);
  if (recipients.length === 0) {
    return { error: "invalid_request" as const, reason: "no_digest_recipients" };
  }

  const day = new Date().toISOString().slice(0, 10);
  const adapter = createEmailAdapter(store, principal);
  const inboxKey = `dlq-sla-digest-stale:${day}`;

  if (!status.freshness.stale) {
    return {
      dispatched: [] as string[],
      skipped: [{ key: `dlq-sla-digest-stale:${day}`, reason: "not_stale" }],
      adapter: adapter.name,
      freshness: status.freshness,
      inboxKey,
      increment: "I4.30" as const,
    };
  }

  if (isDlqSlaDigestStaleSuppressed(store, principal.tenantId)) {
    const suppression = getDlqSlaDigestStaleSuppression(store, principal.tenantId);
    return {
      dispatched: [] as string[],
      skipped: [
        {
          key: `dlq-sla-digest-stale:${day}`,
          reason: suppression?.acknowledgedAt ? "acknowledged" : "snoozed",
        },
      ],
      adapter: adapter.name,
      freshness: status.freshness,
      suppression,
      inboxKey,
      increment: "I4.30" as const,
    };
  }

  const age = status.freshness.neverRun
    ? "never run"
    : `${status.freshness.ageHours ?? "?"}h old (threshold ${status.freshness.thresholdHours}h)`;
  const subject = `[EOS URGENT] DLQ SLA digest stale — ${age}`;
  const bodyText = [
    "The DLQ SLA digest last-run is stale.",
    "",
    `Status: ${status.freshness.neverRun ? "never run" : `last run ${status.lastRun?.lastRunAt}`}`,
    `Age: ${age}`,
    "",
    "Dispatch the digest or check /commercial/events.",
  ].join("\n");

  const dispatched: string[] = [];
  const skipped: { key: string; reason?: string; to?: string }[] = [];
  for (const email of recipients) {
    const key = `dlq-sla-digest-stale:${day}:${email}`;
    const result = await adapter.send({
      to: email,
      subject,
      bodyText,
      notificationKey: key,
      templateKey: "notif.operations.dlq_sla_digest_stale",
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
    increment: "I4.30" as const,
  };
}

/** I4.24 — snooze stale-digest inbox / email escalation. */
export function snoozeDlqSlaDigestStale(store: Store, principal: Principal, input: { hours?: number } = {}) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "snooze:dlq_sla_digest_stale",
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
  return { suppression, increment: "I4.30" as const };
}

/** I4.24 — acknowledge stale-digest inbox until the next last-run stamp. */
export function acknowledgeDlqSlaDigestStale(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "ack:dlq_sla_digest_stale",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  ensureNotificationCollections(store);
  const suppression = upsertStaleSuppression(store, principal, {
    acknowledgedAt: new Date().toISOString(),
    snoozedUntil: undefined,
  });
  return { suppression, increment: "I4.30" as const };
}

/** I4.26 / I4.28 / I4.29 / I4.30 — CSV/JSON export of current suppression + snooze/ack/clear audit. */
export async function exportDlqSlaDigestStaleSuppression(
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
  let preset: NotifDlqSlaDigestStaleAuditExportPreset | null = null;
  if (presetId || presetName) {
    if (presetName && !presetId && !normalizeNotifDlqSlaDigestStaleAuditExportPresetName(presetName)) {
      return { error: "invalid_request" as const, reason: "invalid_name" };
    }
    preset = findDlqStaleAuditExportPreset(store, principal.tenantId, {
      ...(presetId ? { presetId } : {}),
      ...(presetName ? { preset: presetName } : {}),
    });
    if (!preset) return { error: "not_found" as const, reason: "preset_not_found" };
  }
  const parsed = parseNotifDlqSlaDigestStaleAuditExportFilter({
    action: options.action || preset?.action,
    since: options.since || preset?.since,
    until: options.until || preset?.until,
  });
  if ("error" in parsed) return { error: "invalid_request" as const, reason: parsed.error };
  const status = getDlqSlaDigestStatus(store, principal);
  if ("error" in status) return status;

  ensureNotificationCollections(store);
  const generatedAt = new Date().toISOString();
  const format = options.format === "csv" ? "csv" : "json";
  const suppression = status.suppression;
  const filter = { action: parsed.action, since: parsed.since, until: parsed.until };
  const last = await upsertDlqStaleAuditExportLastFilter(store, principal, filter);
  const lastFilter = sanitizeNotifDlqSlaDigestStaleAuditExportLastFilter(last);
  const audits = filterNotifDlqSlaDigestStaleSuppressionAudits(
    (store.notifDlqSlaDigestStaleSuppressionAudits ?? []).filter((a) => a.tenantId === principal.tenantId),
    parsed,
  );
  const sanitizedPreset = preset ? sanitizeNotifDlqSlaDigestStaleAuditExportPreset(preset) : null;

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
      preset: sanitizedPreset,
      generatedAt,
      increment: "I4.30" as const,
    };
  }

  return {
    format,
    suppression,
    audits,
    count: audits.length,
    filter,
    lastFilter,
    preset: sanitizedPreset,
    generatedAt,
    increment: "I4.30" as const,
  };
}
