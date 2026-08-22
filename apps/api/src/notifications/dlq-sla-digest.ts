import { authorize, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { listDeadLetters } from "../outbox.js";
import { createEmailAdapter } from "./email.js";
import { ensureNotificationCollections } from "./collections.js";

/**
 * I4.16 — on-demand batched email summarizing open DLQ SLA breaches.
 * Dedupes per principal per UTC day via outbox notificationKey.
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

  if (!principal.email) {
    return { error: "invalid_request" as const, reason: "principal_has_no_email" };
  }

  ensureNotificationCollections(store);
  const listed = listDeadLetters(store, principal, { slaBreached: true });
  if (!listed.ok) {
    return { error: "forbidden" as const, reason: listed.reason };
  }

  const day = new Date().toISOString().slice(0, 10);
  const key = `dlq-sla-digest:${day}`;
  const adapter = createEmailAdapter(store, principal);

  if (listed.items.length === 0) {
    return {
      dispatched: [] as string[],
      skipped: [{ key, reason: "none_breached" }],
      adapter: adapter.name,
      breachedCount: 0,
      thresholdHours: listed.sla.thresholdHours,
      increment: "I4.16" as const,
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

  const message = {
    to: principal.email,
    subject: `[EOS URGENT] DLQ SLA digest — ${listed.sla.breachedCount} open`,
    bodyText,
    notificationKey: key,
    templateKey: "notif.operations.dlq_sla_digest",
  };

  const result = await adapter.send(message);
  if (result.status === "sent") {
    return {
      dispatched: [key],
      skipped: [] as { key: string; reason?: string }[],
      adapter: adapter.name,
      breachedCount: listed.sla.breachedCount,
      thresholdHours: listed.sla.thresholdHours,
      increment: "I4.16" as const,
    };
  }

  return {
    dispatched: [] as string[],
    skipped: [{ key, reason: result.reason }],
    adapter: adapter.name,
    breachedCount: listed.sla.breachedCount,
    thresholdHours: listed.sla.thresholdHours,
    increment: "I4.16" as const,
  };
}
