import { authorize, type NotifDlqSlaDigestLastRun, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { listDeadLetters } from "../outbox.js";
import { createEmailAdapter } from "./email.js";
import { ensureNotificationCollections } from "./collections.js";
import { resolveDlqSlaDigestRecipientEmails } from "./dlq-sla-digest-recipients.js";
import { persistNotifDlqSlaDigestLastRun } from "../persistence/notifications.js";
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
  return run;
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
      increment: "I4.23" as const,
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
    increment: "I4.23" as const,
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
    increment: "I4.23" as const,
  };
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll("\"", "\"\"")}"`;
  return value;
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
      increment: "I4.23" as const,
    };
  }

  return {
    format,
    lastRun,
    analytics: status.analytics,
    freshness: status.freshness,
    row,
    generatedAt,
    increment: "I4.23" as const,
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
      increment: "I4.23" as const,
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
    increment: "I4.23" as const,
  };
}
