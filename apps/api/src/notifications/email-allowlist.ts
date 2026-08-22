import { authorize, newId, type NotifEmailAllowlistEntry, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { persistNotifEmailAllowlist } from "../persistence/notifications.js";
import { ensureNotificationCollections } from "./collections.js";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function findActiveAllowlistEntry(
  store: Store,
  tenantId: string,
  email: string,
): NotifEmailAllowlistEntry | undefined {
  ensureNotificationCollections(store);
  const normalized = normalizeEmail(email);
  return (store.notifEmailAllowlist ?? []).find(
    (e) => e.tenantId === tenantId && !e.revokedAt && normalizeEmail(e.email) === normalized,
  );
}

export function isEmailAllowlisted(store: Store, tenantId: string, email: string): boolean {
  return Boolean(findActiveAllowlistEntry(store, tenantId, email));
}

export function listEmailAllowlist(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "read:email_allowlist",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const items = (store.notifEmailAllowlist ?? [])
    .filter((e) => e.tenantId === principal.tenantId && !e.revokedAt)
    .map((e) => ({
      id: e.id,
      email: e.email,
      note: e.note,
      createdAt: e.createdAt,
    }))
    .sort((a, b) => a.email.localeCompare(b.email));

  return { items, increment: "I3.14" as const };
}

export async function addEmailAllowlistEntry(
  store: Store,
  principal: Principal,
  input: { email: string; note?: string },
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "write:email_allowlist",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const email = normalizeEmail(input.email ?? "");
  if (!email || !email.includes("@")) {
    return { error: "invalid_request" as const, reason: "invalid_email" };
  }

  ensureNotificationCollections(store);
  const existing = findActiveAllowlistEntry(store, principal.tenantId, email);
  if (existing) {
    if (input.note !== undefined) {
      if (!input.note.trim()) delete existing.note;
      else existing.note = input.note.trim();
      void persistNotifEmailAllowlist(store.dbPool, existing);
    }
    return { entry: existing, updated: true, increment: "I3.14" as const };
  }

  const entry: NotifEmailAllowlistEntry = {
    id: newId(),
    tenantId: principal.tenantId,
    email,
    ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
  };
  store.notifEmailAllowlist.push(entry);
  void persistNotifEmailAllowlist(store.dbPool, entry);
  return { entry, updated: false, increment: "I3.14" as const };
}

export async function revokeEmailAllowlistEntry(store: Store, principal: Principal, id: string) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "revoke:email_allowlist",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const entry = (store.notifEmailAllowlist ?? []).find(
    (e) => e.id === id && e.tenantId === principal.tenantId && !e.revokedAt,
  );
  if (!entry) return { error: "not_found" as const };

  entry.revokedAt = new Date().toISOString();
  void persistNotifEmailAllowlist(store.dbPool, entry);
  return { entry, increment: "I3.14" as const };
}
