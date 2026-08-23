import type { DbPool } from "@sedmc/db";
import type {
  NotifDismissal,
  NotifEmailDeliveryEvent,
  NotifEmailOutboxEntry,
  NotifEmailSuppression,
  NotifEmailAllowlistEntry,
  NotifDlqSlaDigestLastRun,
  NotifDlqSlaDigestStaleAuditExportLastFilter,
  NotifDlqSlaDigestStaleAuditExportLastPreset,
  NotifDlqSlaDigestStaleAuditExportPreset,
  NotifDlqSlaDigestStaleAuditExportPresetUsage,
  NotifDlqSlaDigestStaleSuppression,
  NotifDlqSlaDigestStaleSuppressionAudit,
  NotifAllowlistDualDigestLastRun,
  NotifAllowlistDualDigestStaleAuditExportLastFilter,
  NotifAllowlistDualDigestStaleAuditExportPreset,
  NotifAllowlistDualDigestStaleSuppression,
  NotifAllowlistDualDigestStaleSuppressionAudit,
} from "@sedmc/kernel";
import { ensureNotificationCollections } from "../notifications/collections.js";
import type { Store } from "../store.js";
import {
  insertNotifDismissal,
  insertNotifEmailDeliveryEvent,
  insertNotifEmailOutbox,
  insertNotifAllowlistDualDigestStaleSuppressionAudit,
  loadNotifAllowlistDualDigestLastRuns,
  loadNotifAllowlistDualDigestStaleAuditExportLastFilters,
  loadNotifAllowlistDualDigestStaleAuditExportPresets,
  loadNotifAllowlistDualDigestStaleSuppressionAudits,
  loadNotifAllowlistDualDigestStaleSuppressions,
  upsertNotifAllowlistDualDigestStaleAuditExportLastFilter,
  upsertNotifAllowlistDualDigestStaleAuditExportPreset,
  deleteNotifAllowlistDualDigestStaleAuditExportPreset,
  loadNotifDlqSlaDigestLastRuns,
  insertNotifDlqSlaDigestStaleSuppressionAudit,
  loadNotifDlqSlaDigestStaleAuditExportLastFilters,
  loadNotifDlqSlaDigestStaleAuditExportLastPresets,
  loadNotifDlqSlaDigestStaleAuditExportPresets,
  loadNotifDlqSlaDigestStaleAuditExportPresetUsages,
  loadNotifDlqSlaDigestStaleSuppressionAudits,
  loadNotifDlqSlaDigestStaleSuppressions,
  insertNotifDlqSlaDigestStaleAuditExportPresetUsage,
  upsertNotifDlqSlaDigestStaleAuditExportLastFilter,
  upsertNotifDlqSlaDigestStaleAuditExportLastPreset,
  upsertNotifDlqSlaDigestStaleAuditExportPreset,
  deleteNotifDlqSlaDigestStaleAuditExportPreset,
  loadNotifEmailAllowlist,
  loadNotifEmailSuppressions,
  loadNotifEmailTemplates,
  upsertNotifAllowlistDualDigestLastRun,
  upsertNotifAllowlistDualDigestStaleSuppression,
  deleteNotifAllowlistDualDigestStaleSuppression,
  upsertNotifDlqSlaDigestLastRun,
  upsertNotifDlqSlaDigestStaleSuppression,
  deleteNotifDlqSlaDigestStaleSuppression,
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

export async function persistNotifAllowlistDualDigestLastRun(
  pool: DbPool | undefined,
  run: NotifAllowlistDualDigestLastRun,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifAllowlistDualDigestLastRun(pool, run);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifAllowlistDualDigestLastRuns(pool: DbPool, store: Store): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifAllowlistDualDigestLastRuns(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifAllowlistDualDigestLastRuns.findIndex((r) => r.tenantId === row.tenantId);
    if (idx >= 0) {
      store.notifAllowlistDualDigestLastRuns[idx] = row;
    } else {
      store.notifAllowlistDualDigestLastRuns.push(row);
      merged += 1;
    }
  }
  return merged;
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

export async function persistNotifDlqSlaDigestStaleSuppression(
  pool: DbPool | undefined,
  suppression: NotifDlqSlaDigestStaleSuppression,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifDlqSlaDigestStaleSuppression(pool, suppression);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistDeleteNotifDlqSlaDigestStaleSuppression(
  pool: DbPool | undefined,
  tenantId: string,
): Promise<void> {
  if (!pool) return;
  try {
    await deleteNotifDlqSlaDigestStaleSuppression(pool, tenantId);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifDlqSlaDigestStaleSuppressions(pool: DbPool, store: Store): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifDlqSlaDigestStaleSuppressions(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifDlqSlaDigestStaleSuppressions.findIndex((s) => s.tenantId === row.tenantId);
    if (idx >= 0) {
      store.notifDlqSlaDigestStaleSuppressions[idx] = row;
    } else {
      store.notifDlqSlaDigestStaleSuppressions.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function persistNotifDlqSlaDigestStaleSuppressionAudit(
  pool: DbPool | undefined,
  entry: NotifDlqSlaDigestStaleSuppressionAudit,
): Promise<void> {
  if (!pool) return;
  try {
    await insertNotifDlqSlaDigestStaleSuppressionAudit(pool, entry);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifDlqSlaDigestStaleSuppressionAudits(pool: DbPool, store: Store): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifDlqSlaDigestStaleSuppressionAudits(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifDlqSlaDigestStaleSuppressionAudits.findIndex((a) => a.id === row.id);
    if (idx >= 0) {
      store.notifDlqSlaDigestStaleSuppressionAudits[idx] = row;
    } else {
      store.notifDlqSlaDigestStaleSuppressionAudits.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function persistNotifDlqSlaDigestStaleAuditExportLastFilter(
  pool: DbPool | undefined,
  row: NotifDlqSlaDigestStaleAuditExportLastFilter,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifDlqSlaDigestStaleAuditExportLastFilter(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifDlqSlaDigestStaleAuditExportLastFilters(
  pool: DbPool,
  store: Store,
): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifDlqSlaDigestStaleAuditExportLastFilters(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifDlqSlaDigestStaleAuditExportLastFilters.findIndex(
      (f) => f.tenantId === row.tenantId && f.principalId === row.principalId,
    );
    if (idx >= 0) {
      store.notifDlqSlaDigestStaleAuditExportLastFilters[idx] = row;
    } else {
      store.notifDlqSlaDigestStaleAuditExportLastFilters.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function persistNotifDlqSlaDigestStaleAuditExportPreset(
  pool: DbPool | undefined,
  row: NotifDlqSlaDigestStaleAuditExportPreset,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifDlqSlaDigestStaleAuditExportPreset(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistDeleteNotifDlqSlaDigestStaleAuditExportPreset(
  pool: DbPool | undefined,
  id: string,
): Promise<void> {
  if (!pool) return;
  try {
    await deleteNotifDlqSlaDigestStaleAuditExportPreset(pool, id);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifDlqSlaDigestStaleAuditExportPresets(
  pool: DbPool,
  store: Store,
): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifDlqSlaDigestStaleAuditExportPresets(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifDlqSlaDigestStaleAuditExportPresets.findIndex((p) => p.id === row.id);
    if (idx >= 0) {
      store.notifDlqSlaDigestStaleAuditExportPresets[idx] = row;
    } else {
      store.notifDlqSlaDigestStaleAuditExportPresets.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function persistNotifDlqSlaDigestStaleAuditExportPresetUsage(
  pool: DbPool | undefined,
  row: NotifDlqSlaDigestStaleAuditExportPresetUsage,
): Promise<void> {
  if (!pool) return;
  try {
    await insertNotifDlqSlaDigestStaleAuditExportPresetUsage(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistNotifDlqSlaDigestStaleAuditExportLastPreset(
  pool: DbPool | undefined,
  row: NotifDlqSlaDigestStaleAuditExportLastPreset,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifDlqSlaDigestStaleAuditExportLastPreset(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifDlqSlaDigestStaleAuditExportPresetUsages(
  pool: DbPool,
  store: Store,
): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifDlqSlaDigestStaleAuditExportPresetUsages(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifDlqSlaDigestStaleAuditExportPresetUsages.findIndex((u) => u.id === row.id);
    if (idx >= 0) {
      store.notifDlqSlaDigestStaleAuditExportPresetUsages[idx] = row;
    } else {
      store.notifDlqSlaDigestStaleAuditExportPresetUsages.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function hydrateNotifDlqSlaDigestStaleAuditExportLastPresets(
  pool: DbPool,
  store: Store,
): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifDlqSlaDigestStaleAuditExportLastPresets(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifDlqSlaDigestStaleAuditExportLastPresets.findIndex(
      (p) => p.tenantId === row.tenantId && p.principalId === row.principalId,
    );
    if (idx >= 0) {
      store.notifDlqSlaDigestStaleAuditExportLastPresets[idx] = row;
    } else {
      store.notifDlqSlaDigestStaleAuditExportLastPresets.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function persistNotifAllowlistDualDigestStaleSuppression(
  pool: DbPool | undefined,
  suppression: NotifAllowlistDualDigestStaleSuppression,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifAllowlistDualDigestStaleSuppression(pool, suppression);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistDeleteNotifAllowlistDualDigestStaleSuppression(
  pool: DbPool | undefined,
  tenantId: string,
): Promise<void> {
  if (!pool) return;
  try {
    await deleteNotifAllowlistDualDigestStaleSuppression(pool, tenantId);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistNotifAllowlistDualDigestStaleSuppressionAudit(
  pool: DbPool | undefined,
  entry: NotifAllowlistDualDigestStaleSuppressionAudit,
): Promise<void> {
  if (!pool) return;
  try {
    await insertNotifAllowlistDualDigestStaleSuppressionAudit(pool, entry);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistNotifAllowlistDualDigestStaleAuditExportLastFilter(
  pool: DbPool | undefined,
  row: NotifAllowlistDualDigestStaleAuditExportLastFilter,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifAllowlistDualDigestStaleAuditExportLastFilter(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifAllowlistDualDigestStaleAuditExportLastFilters(
  pool: DbPool,
  store: Store,
): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifAllowlistDualDigestStaleAuditExportLastFilters(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifAllowlistDualDigestStaleAuditExportLastFilters.findIndex(
      (f) => f.tenantId === row.tenantId && f.principalId === row.principalId,
    );
    if (idx >= 0) {
      store.notifAllowlistDualDigestStaleAuditExportLastFilters[idx] = row;
    } else {
      store.notifAllowlistDualDigestStaleAuditExportLastFilters.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function persistNotifAllowlistDualDigestStaleAuditExportPreset(
  pool: DbPool | undefined,
  row: NotifAllowlistDualDigestStaleAuditExportPreset,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertNotifAllowlistDualDigestStaleAuditExportPreset(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistDeleteNotifAllowlistDualDigestStaleAuditExportPreset(
  pool: DbPool | undefined,
  id: string,
): Promise<void> {
  if (!pool) return;
  try {
    await deleteNotifAllowlistDualDigestStaleAuditExportPreset(pool, id);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateNotifAllowlistDualDigestStaleAuditExportPresets(
  pool: DbPool,
  store: Store,
): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifAllowlistDualDigestStaleAuditExportPresets(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifAllowlistDualDigestStaleAuditExportPresets.findIndex((p) => p.id === row.id);
    if (idx >= 0) {
      store.notifAllowlistDualDigestStaleAuditExportPresets[idx] = row;
    } else {
      store.notifAllowlistDualDigestStaleAuditExportPresets.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function hydrateNotifAllowlistDualDigestStaleSuppressionAudits(pool: DbPool, store: Store): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifAllowlistDualDigestStaleSuppressionAudits(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifAllowlistDualDigestStaleSuppressionAudits.findIndex((a) => a.id === row.id);
    if (idx >= 0) {
      store.notifAllowlistDualDigestStaleSuppressionAudits[idx] = row;
    } else {
      store.notifAllowlistDualDigestStaleSuppressionAudits.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function hydrateNotifAllowlistDualDigestStaleSuppressions(pool: DbPool, store: Store): Promise<number> {
  ensureNotificationCollections(store);
  const rows = await loadNotifAllowlistDualDigestStaleSuppressions(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.notifAllowlistDualDigestStaleSuppressions.findIndex((s) => s.tenantId === row.tenantId);
    if (idx >= 0) {
      store.notifAllowlistDualDigestStaleSuppressions[idx] = row;
    } else {
      store.notifAllowlistDualDigestStaleSuppressions.push(row);
      merged += 1;
    }
  }
  return merged;
}
