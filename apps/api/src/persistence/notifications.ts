import type { DbPool } from "@sedmc/db";
import type {
  NotifDismissal,
  NotifEmailDeliveryEvent,
  NotifEmailOutboxEntry,
  NotifEmailSuppression,
  NotifEmailAllowlistEntry,
  NotifDlqSlaDigestLastRun,
} from "@sedmc/kernel";
import { ensureNotificationCollections } from "../notifications/collections.js";
import type { Store } from "../store.js";
import {
  insertNotifDismissal,
  insertNotifEmailDeliveryEvent,
  insertNotifEmailOutbox,
  loadNotifDlqSlaDigestLastRuns,
  loadNotifEmailAllowlist,
  loadNotifEmailSuppressions,
  loadNotifEmailTemplates,
  upsertNotifDlqSlaDigestLastRun,
  upsertNotifEmailAllowlist,
  upsertNotifEmailSuppression,
  upsertNotifEmailTemplate,
} from "./pg-repository.js";

export async function persistNotifDismissal(
  pool: DbPool | undefined,
  entry: NotifDismissal,
): Promise<void> {
  if (!pool) return;
  await insertNotifDismissal(pool, entry);
}

export async function persistNotifEmailOutbox(
  pool: DbPool | undefined,
  entry: NotifEmailOutboxEntry,
): Promise<void> {
  if (!pool) return;
  await insertNotifEmailOutbox(pool, entry);
}

export async function persistNotifEmailDeliveryEvent(
  pool: DbPool | undefined,
  entry: NotifEmailDeliveryEvent,
  payload: Record<string, unknown>,
): Promise<void> {
  if (!pool) return;
  await insertNotifEmailDeliveryEvent(pool, entry, payload);
}

export async function persistNotifEmailTemplate(
  pool: DbPool | undefined,
  entry: { id: string; tenantId: string; key: string; subject: string; bodyText: string; bodyHtml?: string },
): Promise<void> {
  if (!pool) return;
  await upsertNotifEmailTemplate(pool, {
    id: entry.id,
    tenantId: entry.tenantId,
    templateKey: entry.key,
    subject: entry.subject,
    bodyText: entry.bodyText,
    ...(entry.bodyHtml !== undefined ? { bodyHtml: entry.bodyHtml } : {}),
  });
}

export async function persistNotifEmailSuppression(
  pool: DbPool | undefined,
  entry: NotifEmailSuppression,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifEmailSuppression(pool, entry);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistNotifEmailAllowlist(
  pool: DbPool | undefined,
  entry: NotifEmailAllowlistEntry,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifEmailAllowlist(pool, entry);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifEmailTemplates(pool: DbPool, store: Store): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifEmailTemplates(pool);
  let merged = 0;
  for (const row of rows) {
    const exists = store.notifEmailTemplates.some(
      (t) => t.tenantId === row.tenantId && t.key === row.templateKey,
    );
    if (exists) continue;
    store.notifEmailTemplates.push({
      tenantId: row.tenantId,
      key: row.templateKey,
      subject: row.subject,
      bodyText: row.bodyText,
      ...(row.bodyHtml !== undefined ? { bodyHtml: row.bodyHtml } : {}),
    });
    merged += 1;
  }
  return merged;
}

export async function hydrateNotifEmailSuppressions(pool: DbPool, store: Store): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifEmailSuppressions(pool);
  let merged = 0;
  for (const row of rows) {
    if (store.notifEmailSuppressions.some((s) => s.id === row.id)) continue;
    store.notifEmailSuppressions.push(row);
    merged += 1;
  }
  return merged;
}

export async function hydrateNotifEmailAllowlist(pool: DbPool, store: Store): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifEmailAllowlist(pool);
  let merged = 0;
  for (const row of rows) {
    if (store.notifEmailAllowlist.some((e) => e.id === row.id)) continue;
    store.notifEmailAllowlist.push(row);
    merged += 1;
  }
  return merged;
}

export async function persistNotifDlqSlaDigestLastRun(
  pool: DbPool | undefined,
  run: NotifDlqSlaDigestLastRun,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifDlqSlaDigestLastRun(pool, run);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifDlqSlaDigestLastRuns(pool: DbPool, store: Store): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifDlqSlaDigestLastRuns(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifDlqSlaDigestLastRuns.findIndex((r) => r.tenantId === row.tenantId);
    if (idx >= 0) {
      store.notifDlqSlaDigestLastRuns[idx] = row;
    } else {
      store.notifDlqSlaDigestLastRuns.push(row);
      merged += 1;
    }
  }
  return merged;
}
