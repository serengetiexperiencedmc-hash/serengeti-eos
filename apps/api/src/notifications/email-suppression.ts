import { authorize, newId, type NotifEmailSuppression, type NotifEmailSuppressionReason, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureNotificationCollections } from "./collections.js";
import { persistNotifEmailSuppression } from "../persistence/notifications.js";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function findActiveSuppression(
  store: Store,
  tenantId: string,
  email: string,
): NotifEmailSuppression | undefined {
  ensureNotificationCollections(store);
  const normalized = normalizeEmail(email);
  return (store.notifEmailSuppressions ?? []).find(
    (s) => s.tenantId === tenantId && !s.liftedAt && normalizeEmail(s.email) === normalized,
  );
}

export function isEmailSuppressed(store: Store, tenantId: string, email: string): boolean {
  return Boolean(findActiveSuppression(store, tenantId, email));
}

export async function upsertEmailSuppression(
  store: Store,
  input: {
    tenantId: string;
    email: string;
    reason: NotifEmailSuppressionReason;
    sourceEventId?: string;
  },
): Promise<NotifEmailSuppression> {
  ensureNotificationCollections(store);
  const normalized = normalizeEmail(input.email);
  const existing = findActiveSuppression(store, input.tenantId, normalized);
  if (existing) {
    existing.reason = input.reason;
    if (input.sourceEventId) existing.sourceEventId = input.sourceEventId;
    void persistNotifEmailSuppression(store.dbPool, existing);
    return existing;
  }

  const entry: NotifEmailSuppression = {
    id: newId(),
    tenantId: input.tenantId,
    email: normalized,
    reason: input.reason,
    ...(input.sourceEventId ? { sourceEventId: input.sourceEventId } : {}),
    createdAt: new Date().toISOString(),
  };
  store.notifEmailSuppressions.push(entry);
  void persistNotifEmailSuppression(store.dbPool, entry);
  return entry;
}

export function listEmailSuppressions(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "notification:read:email_outbox",
    action: "read:email_suppressions",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const items = (store.notifEmailSuppressions ?? [])
    .filter((s) => s.tenantId === principal.tenantId && !s.liftedAt)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { items, increment: "I3.9" as const };
}

export async function liftEmailSuppression(store: Store, principal: Principal, id: string) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "lift:email_suppression",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const entry = (store.notifEmailSuppressions ?? []).find(
    (s) => s.id === id && s.tenantId === principal.tenantId && !s.liftedAt,
  );
  if (!entry) return { error: "not_found" as const };

  entry.liftedAt = new Date().toISOString();
  void persistNotifEmailSuppression(store.dbPool, entry);
  return { suppression: entry, increment: "I3.9" as const };
}
