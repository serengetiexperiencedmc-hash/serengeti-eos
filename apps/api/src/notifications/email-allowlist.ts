import { authorize, newId, type NotifEmailAllowlistEntry, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { persistNotifEmailAllowlist } from "../persistence/notifications.js";
import { ensureNotificationCollections } from "./collections.js";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isAllowlistActive(entry: NotifEmailAllowlistEntry, now = Date.now()): boolean {
  if (entry.revokedAt) return false;
  if (entry.expiresAt && new Date(entry.expiresAt).getTime() <= now) return false;
  return true;
}

/** SES-noted VIP overrides require second-principal approval before bypass (I3.17). */
function passesSesDualControl(entry: NotifEmailAllowlistEntry): boolean {
  if (!entry.sesNotedAt) return true;
  return entry.sesDualControlStatus === "approved";
}

export function findActiveAllowlistEntry(
  store: Store,
  tenantId: string,
  email: string,
): NotifEmailAllowlistEntry | undefined {
  ensureNotificationCollections(store);
  const normalized = normalizeEmail(email);
  return (store.notifEmailAllowlist ?? []).find(
    (e) => e.tenantId === tenantId && isAllowlistActive(e) && normalizeEmail(e.email) === normalized,
  );
}

export function isEmailAllowlisted(store: Store, tenantId: string, email: string): boolean {
  const entry = findActiveAllowlistEntry(store, tenantId, email);
  if (!entry) return false;
  return passesSesDualControl(entry);
}

function sanitizeAllowlistEntry(e: NotifEmailAllowlistEntry) {
  return {
    id: e.id,
    email: e.email,
    note: e.note,
    createdAt: e.createdAt,
    ...(e.expiresAt ? { expiresAt: e.expiresAt } : {}),
    ...(e.revokedAt ? { revokedAt: e.revokedAt } : {}),
    ...(e.sesNotedAt ? { sesNotedAt: e.sesNotedAt } : {}),
    ...(e.sesSyncNote ? { sesSyncNote: e.sesSyncNote } : {}),
    ...(e.sesDualControlStatus ? { sesDualControlStatus: e.sesDualControlStatus } : {}),
    ...(e.sesApprovedAt ? { sesApprovedAt: e.sesApprovedAt } : {}),
    ...(e.sesApprovedByPrincipalId ? { sesApprovedByPrincipalId: e.sesApprovedByPrincipalId } : {}),
    ...(e.sesApprovalRequestedByPrincipalId
      ? { sesApprovalRequestedByPrincipalId: e.sesApprovalRequestedByPrincipalId }
      : {}),
  };
}

/** I3.16/I3.17 — stamp allowlist entries that also appear on the SES account suppression list. */
export function noteAllowlistSesOverlap(
  store: Store,
  tenantId: string,
  remote: Array<{ email: string; reason: string }>,
): Array<{ email: string; sesSyncNote: string }> {
  ensureNotificationCollections(store);
  const noted: Array<{ email: string; sesSyncNote: string }> = [];
  const now = new Date().toISOString();
  for (const row of remote) {
    const entry = findActiveAllowlistEntry(store, tenantId, row.email);
    if (!entry) continue;
    const sesSyncNote = `SES account suppression (${row.reason}) observed at sync`;
    entry.sesNotedAt = now;
    entry.sesSyncNote = sesSyncNote;
    if (entry.sesDualControlStatus !== "approved") {
      entry.sesDualControlStatus = "pending";
      entry.sesApprovalRequestedByPrincipalId = entry.createdByPrincipalId ?? entry.sesApprovalRequestedByPrincipalId;
      delete entry.sesApprovedAt;
      delete entry.sesApprovedByPrincipalId;
    }
    void persistNotifEmailAllowlist(store.dbPool, entry);
    noted.push({ email: entry.email, sesSyncNote });
  }
  return noted;
}

export function listEmailAllowlist(
  store: Store,
  principal: Principal,
  options: { includeExpired?: boolean; includeRevoked?: boolean } = {},
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "read:email_allowlist",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const now = Date.now();
  const items = (store.notifEmailAllowlist ?? [])
    .filter((e) => {
      if (e.tenantId !== principal.tenantId) return false;
      if (e.revokedAt) return options.includeRevoked === true;
      if (e.expiresAt && new Date(e.expiresAt).getTime() <= now) return options.includeExpired === true;
      return true;
    })
    .map(sanitizeAllowlistEntry)
    .sort((a, b) => a.email.localeCompare(b.email));

  return { items, increment: "I3.17" as const };
}

export function exportEmailAllowlist(
  store: Store,
  principal: Principal,
  options: { format?: "json" | "csv"; includeExpired?: boolean; includeRevoked?: boolean } = {},
) {
  const decision = authorize({
    principal,
    permission: "notification:read:email_outbox",
    action: "export:email_allowlist",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const now = Date.now();
  const items = (store.notifEmailAllowlist ?? [])
    .filter((e) => {
      if (e.tenantId !== principal.tenantId) return false;
      if (e.revokedAt) return options.includeRevoked === true;
      if (e.expiresAt && new Date(e.expiresAt).getTime() <= now) return options.includeExpired === true;
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((e) => ({
      id: e.id,
      email: e.email,
      note: e.note ?? "",
      createdAt: e.createdAt,
      expiresAt: e.expiresAt ?? "",
      revokedAt: e.revokedAt ?? "",
      createdByPrincipalId: e.createdByPrincipalId ?? "",
      sesNotedAt: e.sesNotedAt ?? "",
      sesSyncNote: e.sesSyncNote ?? "",
      sesDualControlStatus: e.sesDualControlStatus ?? "",
      sesApprovedAt: e.sesApprovedAt ?? "",
      sesApprovedByPrincipalId: e.sesApprovedByPrincipalId ?? "",
    }));

  const generatedAt = new Date().toISOString();
  const format = options.format === "csv" ? "csv" : "json";
  if (format === "csv") {
    const header =
      "id,email,note,createdAt,expiresAt,revokedAt,createdByPrincipalId,sesNotedAt,sesSyncNote,sesDualControlStatus,sesApprovedAt,sesApprovedByPrincipalId";
    const rows = items.map((row) =>
      [
        row.id,
        row.email,
        row.note,
        row.createdAt,
        row.expiresAt,
        row.revokedAt,
        row.createdByPrincipalId,
        row.sesNotedAt,
        row.sesSyncNote,
        row.sesDualControlStatus,
        row.sesApprovedAt,
        row.sesApprovedByPrincipalId,
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    );
    return {
      format: "csv" as const,
      csv: [header, ...rows].join("\n"),
      count: items.length,
      generatedAt,
      increment: "I3.17" as const,
    };
  }

  return {
    format: "json" as const,
    items,
    count: items.length,
    generatedAt,
    increment: "I3.17" as const,
  };
}

export async function addEmailAllowlistEntry(
  store: Store,
  principal: Principal,
  input: { email: string; note?: string; expiresAt?: string | null },
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
  if (input.expiresAt) {
    const exp = new Date(input.expiresAt).getTime();
    if (Number.isNaN(exp)) return { error: "invalid_request" as const, reason: "invalid_expires_at" };
  }

  ensureNotificationCollections(store);
  const existing = findActiveAllowlistEntry(store, principal.tenantId, email);
  if (existing) {
    if (input.note !== undefined) {
      if (!input.note.trim()) delete existing.note;
      else existing.note = input.note.trim();
    }
    if (input.expiresAt !== undefined) {
      if (input.expiresAt === null || input.expiresAt.trim() === "") delete existing.expiresAt;
      else existing.expiresAt = new Date(input.expiresAt).toISOString();
    }
    void persistNotifEmailAllowlist(store.dbPool, existing);
    return { entry: sanitizeAllowlistEntry(existing), updated: true, increment: "I3.17" as const };
  }

  const entry: NotifEmailAllowlistEntry = {
    id: newId(),
    tenantId: principal.tenantId,
    email,
    ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    ...(input.expiresAt?.trim() ? { expiresAt: new Date(input.expiresAt).toISOString() } : {}),
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
    sesDualControlStatus: "not_required",
  };
  store.notifEmailAllowlist.push(entry);
  void persistNotifEmailAllowlist(store.dbPool, entry);
  return { entry: sanitizeAllowlistEntry(entry), updated: false, increment: "I3.17" as const };
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
  return { entry: sanitizeAllowlistEntry(entry), increment: "I3.17" as const };
}

/** I3.17 — second principal approves SES-noted VIP allowlist override. */
export async function approveSesNotedAllowlistEntry(store: Store, principal: Principal, id: string) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "approve:email_allowlist_ses",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (principal.actorType === "AiAgent") {
    return { error: "forbidden" as const, reason: "ai_cannot_approve" };
  }

  ensureNotificationCollections(store);
  const entry = (store.notifEmailAllowlist ?? []).find(
    (e) => e.id === id && e.tenantId === principal.tenantId && !e.revokedAt,
  );
  if (!entry) return { error: "not_found" as const };
  if (!entry.sesNotedAt) {
    return { error: "invalid_request" as const, reason: "ses_note_required" };
  }
  if (entry.sesDualControlStatus === "approved") {
    return { entry: sanitizeAllowlistEntry(entry), increment: "I3.17" as const };
  }

  const requesterId = entry.sesApprovalRequestedByPrincipalId ?? entry.createdByPrincipalId;
  if (requesterId && requesterId === principal.id) {
    return { error: "forbidden" as const, reason: "self_approval_forbidden" };
  }

  entry.sesDualControlStatus = "approved";
  entry.sesApprovedAt = new Date().toISOString();
  entry.sesApprovedByPrincipalId = principal.id;
  void persistNotifEmailAllowlist(store.dbPool, entry);
  return { entry: sanitizeAllowlistEntry(entry), increment: "I3.17" as const };
}
