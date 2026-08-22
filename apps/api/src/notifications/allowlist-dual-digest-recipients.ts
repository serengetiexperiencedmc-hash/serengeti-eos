import { authorize, newId, type NotifAllowlistDualDigestRecipient, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureNotificationCollections } from "./collections.js";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function parseEnvAllowlistDualDigestRecipients(env: NodeJS.ProcessEnv = process.env): string[] {
  return (env.EOS_ALLOWLIST_DUAL_DIGEST_RECIPIENTS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((e) => e.includes("@"));
}

function sanitize(r: NotifAllowlistDualDigestRecipient) {
  return {
    id: r.id,
    email: r.email,
    note: r.note,
    source: r.source,
    createdAt: r.createdAt,
    createdByPrincipalId: r.createdByPrincipalId,
    revokedAt: r.revokedAt,
  };
}

/** Resolve unique digest emails: caller + active store aliases + env. */
export function resolveAllowlistDualDigestRecipientEmails(
  store: Store,
  principal: Principal,
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  ensureNotificationCollections(store);
  const emails = new Set<string>();
  if (principal.email) emails.add(normalizeEmail(principal.email));
  for (const row of store.notifAllowlistDualDigestRecipients ?? []) {
    if (row.tenantId !== principal.tenantId || row.revokedAt) continue;
    emails.add(normalizeEmail(row.email));
  }
  for (const email of parseEnvAllowlistDualDigestRecipients(env)) {
    emails.add(email);
  }
  return [...emails];
}

export function listAllowlistDualDigestRecipients(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "read:allowlist_dual_digest_recipients",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const storeItems = (store.notifAllowlistDualDigestRecipients ?? [])
    .filter((r) => r.tenantId === principal.tenantId && !r.revokedAt)
    .map(sanitize);
  const envItems = parseEnvAllowlistDualDigestRecipients().map((email) => ({
    id: `env:${email}`,
    email,
    source: "env" as const,
    createdAt: new Date(0).toISOString(),
  }));
  return {
    items: [...storeItems, ...envItems],
    count: storeItems.length + envItems.length,
    increment: "I3.22" as const,
  };
}

export function addAllowlistDualDigestRecipient(
  store: Store,
  principal: Principal,
  input: { email: string; note?: string },
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "write:allowlist_dual_digest_recipients",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const email = normalizeEmail(input.email ?? "");
  if (!email.includes("@")) return { error: "invalid_request" as const, reason: "invalid_email" };

  ensureNotificationCollections(store);
  const existing = (store.notifAllowlistDualDigestRecipients ?? []).find(
    (r) => r.tenantId === principal.tenantId && !r.revokedAt && normalizeEmail(r.email) === email,
  );
  if (existing) {
    if (input.note !== undefined) {
      if (!input.note.trim()) delete existing.note;
      else existing.note = input.note.trim();
    }
    return { recipient: sanitize(existing), updated: true, increment: "I3.22" as const };
  }

  const recipient: NotifAllowlistDualDigestRecipient = {
    id: newId(),
    tenantId: principal.tenantId,
    email,
    source: "store",
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
    ...(input.note?.trim() ? { note: input.note.trim() } : {}),
  };
  store.notifAllowlistDualDigestRecipients.push(recipient);
  return { recipient: sanitize(recipient), updated: false, increment: "I3.22" as const };
}

export function revokeAllowlistDualDigestRecipient(store: Store, principal: Principal, id: string) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "revoke:allowlist_dual_digest_recipients",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const entry = (store.notifAllowlistDualDigestRecipients ?? []).find(
    (r) => r.id === id && r.tenantId === principal.tenantId && !r.revokedAt,
  );
  if (!entry) return { error: "not_found" as const };
  entry.revokedAt = new Date().toISOString();
  return { recipient: sanitize(entry), increment: "I3.22" as const };
}
