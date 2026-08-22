import { authorize, newId, type NotifEmailSuppression, type NotifEmailSuppressionReason, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureNotificationCollections } from "./collections.js";
import { persistNotifEmailSuppression } from "../persistence/notifications.js";
import {
  createSesSuppressionClientFromEnv,
  type SesSuppressionClient,
} from "./ses-suppression-client.js";

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

function sesReasonForLocal(reason: NotifEmailSuppressionReason): "BOUNCE" | "COMPLAINT" | null {
  if (reason === "bounce" || reason === "reject") return "BOUNCE";
  if (reason === "complaint") return "COMPLAINT";
  return null;
}

export async function upsertEmailSuppression(
  store: Store,
  input: {
    tenantId: string;
    email: string;
    reason: NotifEmailSuppressionReason;
    sourceEventId?: string;
  },
  deps: { sesClient?: SesSuppressionClient | null } = {},
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

  const sesReason = sesReasonForLocal(input.reason);
  if (sesReason) {
    const client = deps.sesClient === undefined ? createSesSuppressionClientFromEnv() : deps.sesClient;
    if (client) {
      try {
        await client.put(normalized, sesReason);
      } catch {
        // Best-effort account sync.
      }
    }
  }

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
  return { items, increment: "I3.13" as const };
}

export function exportEmailSuppressions(
  store: Store,
  principal: Principal,
  options: { format?: "json" | "csv"; includeLifted?: boolean } = {},
) {
  const decision = authorize({
    principal,
    permission: "notification:read:email_outbox",
    action: "export:email_suppressions",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const includeLifted = options.includeLifted === true;
  const items = (store.notifEmailSuppressions ?? [])
    .filter((s) => s.tenantId === principal.tenantId && (includeLifted || !s.liftedAt))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((s) => ({
      id: s.id,
      email: s.email,
      reason: s.reason,
      createdAt: s.createdAt,
      ...(s.liftedAt ? { liftedAt: s.liftedAt } : {}),
      ...(s.sourceEventId ? { sourceEventId: s.sourceEventId } : {}),
    }));

  const generatedAt = new Date().toISOString();
  const format = options.format === "csv" ? "csv" : "json";
  if (format === "csv") {
    const header = "id,email,reason,createdAt,liftedAt,sourceEventId";
    const rows = items.map((row) =>
      [row.id, row.email, row.reason, row.createdAt, row.liftedAt ?? "", row.sourceEventId ?? ""]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    );
    return {
      format: "csv" as const,
      csv: [header, ...rows].join("\n"),
      count: items.length,
      generatedAt,
      increment: "I3.13" as const,
    };
  }

  return {
    format: "json" as const,
    items,
    count: items.length,
    generatedAt,
    increment: "I3.13" as const,
  };
}

export async function liftEmailSuppression(
  store: Store,
  principal: Principal,
  id: string,
  deps: { sesClient?: SesSuppressionClient | null } = {},
) {
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

  const client = deps.sesClient === undefined ? createSesSuppressionClientFromEnv() : deps.sesClient;
  if (client) {
    try {
      await client.remove(entry.email);
    } catch {
      // Best-effort account sync.
    }
  }

  return { suppression: entry, increment: "I3.13" as const };
}

export async function bulkLiftEmailSuppressions(
  store: Store,
  principal: Principal,
  input: { ids?: string[]; emails?: string[] },
  deps: { sesClient?: SesSuppressionClient | null } = {},
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "bulk_lift:email_suppressions",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const ids = new Set((input.ids ?? []).filter(Boolean));
  const emails = new Set((input.emails ?? []).map((e) => e.trim().toLowerCase()).filter(Boolean));
  if (ids.size === 0 && emails.size === 0) {
    return { error: "invalid_request" as const, reason: "ids_or_emails_required" };
  }

  const targets = (store.notifEmailSuppressions ?? []).filter(
    (s) =>
      s.tenantId === principal.tenantId &&
      !s.liftedAt &&
      (ids.has(s.id) || emails.has(normalizeEmail(s.email))),
  );

  let lifted = 0;
  const client = deps.sesClient === undefined ? createSesSuppressionClientFromEnv() : deps.sesClient;
  for (const entry of targets) {
    entry.liftedAt = new Date().toISOString();
    void persistNotifEmailSuppression(store.dbPool, entry);
    if (client) {
      try {
        await client.remove(entry.email);
      } catch {
        // Best-effort.
      }
    }
    lifted += 1;
  }

  const requested = ids.size + emails.size;
  return {
    lifted,
    notFound: Math.max(0, requested - lifted),
    increment: "I3.13" as const,
  };
}

export async function importEmailSuppressions(
  store: Store,
  principal: Principal,
  input: { items?: Array<{ email: string; reason?: string; sourceEventId?: string }>; csv?: string },
  deps: { sesClient?: SesSuppressionClient | null } = {},
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "import:email_suppressions",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const allowedReasons = new Set(["bounce", "complaint", "reject", "manual", "ses_account"]);
  const rows: Array<{ email: string; reason: string; sourceEventId?: string }> = [];

  if (input.csv?.trim()) {
    const lines = input.csv
      .trim()
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const start = lines[0]?.toLowerCase().includes("email") ? 1 : 0;
    for (let i = start; i < lines.length; i += 1) {
      const parts = lines[i]!.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
      const email = parts[0] ?? "";
      const reason = parts[1] || "manual";
      const sourceEventId = parts[2] || undefined;
      rows.push({ email, reason, ...(sourceEventId ? { sourceEventId } : {}) });
    }
  } else if (input.items?.length) {
    for (const item of input.items) {
      rows.push({
        email: item.email,
        reason: item.reason ?? "manual",
        ...(item.sourceEventId ? { sourceEventId: item.sourceEventId } : {}),
      });
    }
  } else {
    return { error: "invalid_request" as const, reason: "items_or_csv_required" };
  }

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  const errors: Array<{ row: number; reason: string }> = [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i]!;
    const email = row.email?.trim();
    if (!email || !email.includes("@")) {
      skipped += 1;
      errors.push({ row: i + 1, reason: "invalid_email" });
      continue;
    }
    if (!allowedReasons.has(row.reason)) {
      skipped += 1;
      errors.push({ row: i + 1, reason: "invalid_reason" });
      continue;
    }
    const existing = findActiveSuppression(store, principal.tenantId, email);
    await upsertEmailSuppression(
      store,
      {
        tenantId: principal.tenantId,
        email,
        reason: row.reason as NotifEmailSuppressionReason,
        ...(row.sourceEventId ? { sourceEventId: row.sourceEventId } : {}),
      },
      deps,
    );
    if (existing) updated += 1;
    else imported += 1;
  }

  return {
    imported,
    updated,
    skipped,
    errors,
    increment: "I3.13" as const,
  };
}

/** I3.10 — pull SES account suppressions into the tenant list. */
export async function syncEmailSuppressionsFromSes(
  store: Store,
  principal: Principal,
  deps: { sesClient?: SesSuppressionClient | null } = {},
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "sync:email_suppressions",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const client = deps.sesClient === undefined ? createSesSuppressionClientFromEnv() : deps.sesClient;
  if (!client) return { error: "invalid_request" as const, reason: "ses_suppression_sync_unavailable" };

  ensureNotificationCollections(store);
  let imported = 0;
  let updated = 0;
  try {
    const remote = await client.list();
    for (const row of remote) {
      const existing = findActiveSuppression(store, principal.tenantId, row.email);
      if (existing) {
        if (existing.reason !== row.reason) {
          existing.reason = row.reason;
          void persistNotifEmailSuppression(store.dbPool, existing);
          updated += 1;
        }
        continue;
      }
      await upsertEmailSuppression(
        store,
        {
          tenantId: principal.tenantId,
          email: row.email,
          reason: row.reason,
        },
        { sesClient: null },
      );
      imported += 1;
    }
  } catch (err) {
    return {
      error: "invalid_request" as const,
      reason: err instanceof Error ? err.message : "ses_suppression_sync_failed",
    };
  }

  return {
    imported,
    updated,
    activeCount: (store.notifEmailSuppressions ?? []).filter(
      (s) => s.tenantId === principal.tenantId && !s.liftedAt,
    ).length,
    increment: "I3.13" as const,
  };
}
