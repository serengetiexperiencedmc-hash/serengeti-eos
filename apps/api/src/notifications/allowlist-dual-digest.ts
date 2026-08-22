import { authorize, type NotifAllowlistDualDigestLastRun, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { createEmailAdapter } from "./email.js";
import { ensureNotificationCollections } from "./collections.js";
import { resolveAllowlistDualDigestRecipientEmails } from "./allowlist-dual-digest-recipients.js";

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
  return run;
}

/**
 * I3.21–I3.23 — batched email summarizing pending SES allowlist dual-control approvals.
 * Fans out to caller + store/env ops aliases; respects I3.20 snooze/dismiss.
 * I3.23 stamps last-run metadata (in-memory; dual-write later).
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
      increment: "I3.23" as const,
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
    increment: "I3.23" as const,
  };
}

/** I3.23 — last-run stamp + outbox digest analytics for the tenant. */
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
    increment: "I3.23" as const,
  };
}
