import type { DbPool } from "@sedmc/db";
import type {
  AiRecommendStaleAuditExportLastFilter,
  AiRecommendStaleAuditExportLastPreset,
  AiRecommendStaleAuditExportPreset,
  AiRecommendStaleAuditExportPresetUsage,
  AiRecommendStaleSuppression,
  AiRecommendStaleSuppressionAudit,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import {
  deleteAiRecommendStaleAuditExportPreset,
  deleteAiRecommendStaleSuppression,
  insertAiRecommendStaleAuditExportPresetUsage,
  insertAiRecommendStaleSuppressionAudit,
  loadAiRecommendStaleAuditExportLastFilters,
  loadAiRecommendStaleAuditExportLastPresets,
  loadAiRecommendStaleAuditExportPresets,
  loadAiRecommendStaleAuditExportPresetUsages,
  loadAiRecommendStaleSuppressionAudits,
  loadAiRecommendStaleSuppressions,
  upsertAiRecommendStaleAuditExportLastFilter,
  upsertAiRecommendStaleAuditExportLastPreset,
  upsertAiRecommendStaleAuditExportPreset,
  upsertAiRecommendStaleSuppression,
} from "./pg-repository.js";

export async function persistAiRecommendStaleSuppression(
  pool: DbPool | undefined,
  suppression: AiRecommendStaleSuppression,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertAiRecommendStaleSuppression(pool, suppression);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistDeleteAiRecommendStaleSuppression(
  pool: DbPool | undefined,
  tenantId: string,
  principalId: string,
): Promise<void> {
  if (!pool) return;
  try {
    await deleteAiRecommendStaleSuppression(pool, tenantId, principalId);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistAiRecommendStaleSuppressionAudit(
  pool: DbPool | undefined,
  entry: AiRecommendStaleSuppressionAudit,
): Promise<void> {
  if (!pool) return;
  try {
    await insertAiRecommendStaleSuppressionAudit(pool, entry);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateAiRecommendStaleSuppressionAudits(pool: DbPool, store: Store): Promise<number> {
  if (!store.aiRecommendStaleSuppressionAudits) store.aiRecommendStaleSuppressionAudits = [];
  const rows = await loadAiRecommendStaleSuppressionAudits(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.aiRecommendStaleSuppressionAudits.findIndex((a) => a.id === row.id);
    if (idx >= 0) {
      store.aiRecommendStaleSuppressionAudits[idx] = row;
    } else {
      store.aiRecommendStaleSuppressionAudits.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function persistAiRecommendStaleAuditExportLastFilter(
  pool: DbPool | undefined,
  row: AiRecommendStaleAuditExportLastFilter,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertAiRecommendStaleAuditExportLastFilter(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateAiRecommendStaleAuditExportLastFilters(pool: DbPool, store: Store): Promise<number> {
  if (!store.aiRecommendStaleAuditExportLastFilters) store.aiRecommendStaleAuditExportLastFilters = [];
  const rows = await loadAiRecommendStaleAuditExportLastFilters(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.aiRecommendStaleAuditExportLastFilters.findIndex(
      (f) => f.tenantId === row.tenantId && f.principalId === row.principalId,
    );
    if (idx >= 0) {
      store.aiRecommendStaleAuditExportLastFilters[idx] = row;
    } else {
      store.aiRecommendStaleAuditExportLastFilters.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function persistDeleteAiRecommendStaleAuditExportPreset(
  pool: DbPool | undefined,
  id: string,
): Promise<void> {
  if (!pool) return;
  try {
    await deleteAiRecommendStaleAuditExportPreset(pool, id);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistAiRecommendStaleAuditExportPresetUsage(
  pool: DbPool | undefined,
  row: AiRecommendStaleAuditExportPresetUsage,
): Promise<void> {
  if (!pool) return;
  try {
    await insertAiRecommendStaleAuditExportPresetUsage(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function persistAiRecommendStaleAuditExportLastPreset(
  pool: DbPool | undefined,
  row: AiRecommendStaleAuditExportLastPreset,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertAiRecommendStaleAuditExportLastPreset(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateAiRecommendStaleAuditExportPresetUsages(pool: DbPool, store: Store): Promise<number> {
  if (!store.aiRecommendStaleAuditExportPresetUsages) store.aiRecommendStaleAuditExportPresetUsages = [];
  const rows = await loadAiRecommendStaleAuditExportPresetUsages(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.aiRecommendStaleAuditExportPresetUsages.findIndex((u) => u.id === row.id);
    if (idx >= 0) {
      store.aiRecommendStaleAuditExportPresetUsages[idx] = row;
    } else {
      store.aiRecommendStaleAuditExportPresetUsages.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function hydrateAiRecommendStaleAuditExportLastPresets(pool: DbPool, store: Store): Promise<number> {
  if (!store.aiRecommendStaleAuditExportLastPresets) store.aiRecommendStaleAuditExportLastPresets = [];
  const rows = await loadAiRecommendStaleAuditExportLastPresets(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.aiRecommendStaleAuditExportLastPresets.findIndex(
      (p) => p.tenantId === row.tenantId && p.principalId === row.principalId,
    );
    if (idx >= 0) {
      store.aiRecommendStaleAuditExportLastPresets[idx] = row;
    } else {
      store.aiRecommendStaleAuditExportLastPresets.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function persistAiRecommendStaleAuditExportPreset(
  pool: DbPool | undefined,
  row: AiRecommendStaleAuditExportPreset,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertAiRecommendStaleAuditExportPreset(pool, row);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateAiRecommendStaleAuditExportPresets(pool: DbPool, store: Store): Promise<number> {
  if (!store.aiRecommendStaleAuditExportPresets) store.aiRecommendStaleAuditExportPresets = [];
  const rows = await loadAiRecommendStaleAuditExportPresets(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.aiRecommendStaleAuditExportPresets.findIndex((p) => p.id === row.id);
    if (idx >= 0) {
      store.aiRecommendStaleAuditExportPresets[idx] = row;
    } else {
      store.aiRecommendStaleAuditExportPresets.push(row);
      merged += 1;
    }
  }
  return merged;
}

export async function hydrateAiRecommendStaleSuppressions(pool: DbPool, store: Store): Promise<number> {
  if (!store.aiRecommendStaleSuppressions) store.aiRecommendStaleSuppressions = [];
  const rows = await loadAiRecommendStaleSuppressions(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.aiRecommendStaleSuppressions.findIndex(
      (s) => s.tenantId === row.tenantId && s.principalId === row.principalId,
    );
    if (idx >= 0) {
      store.aiRecommendStaleSuppressions[idx] = row;
    } else {
      store.aiRecommendStaleSuppressions.push(row);
      merged += 1;
    }
  }
  return merged;
}
