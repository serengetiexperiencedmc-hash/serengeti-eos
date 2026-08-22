import type { DbPool } from "@sedmc/db";
import type { NotifDismissal, NotifEmailDeliveryEvent, NotifEmailOutboxEntry } from "@sedmc/kernel";
import { ensureNotificationCollections } from "../notifications/collections.js";
import type { Store } from "../store.js";
import {
  insertNotifDismissal,
  insertNotifEmailDeliveryEvent,
  insertNotifEmailOutbox,
  loadNotifEmailTemplates,
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
