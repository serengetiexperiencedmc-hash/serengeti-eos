import { authorize, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { createEmailAdapter } from "./email.js";
import { ensureNotificationCollections } from "./collections.js";

/**
 * I3.21 — batched email summarizing pending SES allowlist dual-control approvals.
 * Respects I3.20 snooze/dismiss; dedupes per recipient per UTC day.
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
  const to = principal.email?.trim().toLowerCase();
  if (!to || !to.includes("@")) {
    return { error: "invalid_request" as const, reason: "principal_email_required" };
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
  const key = `allowlist-dual-digest:${day}:${to}`;

  if (pending.length === 0) {
    return {
      dispatched: [] as string[],
      skipped: [{ key, reason: "none_pending" }],
      adapter: adapter.name,
      pendingCount: 0,
      increment: "I3.21" as const,
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

  const result = await adapter.send({
    to,
    subject,
    bodyText,
    notificationKey: key,
    templateKey: "notif.approval.allowlist_dual_digest",
  });

  if (result.status === "sent") {
    return {
      dispatched: [key],
      skipped: [] as { key: string; reason?: string; to?: string }[],
      adapter: adapter.name,
      pendingCount: pending.length,
      increment: "I3.21" as const,
    };
  }

  return {
    dispatched: [] as string[],
    skipped: [{ key, reason: result.reason, to }],
    adapter: adapter.name,
    pendingCount: pending.length,
    increment: "I3.21" as const,
  };
}
