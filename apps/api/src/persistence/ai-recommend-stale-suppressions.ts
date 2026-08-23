import type { DbPool } from "@sedmc/db";
import type { AiRecommendStaleSuppression, AiRecommendStaleSuppressionAudit } from "@sedmc/kernel";
import type { Store } from "../store.js";
import {
  deleteAiRecommendStaleSuppression,
  insertAiRecommendStaleSuppressionAudit,
  loadAiRecommendStaleSuppressionAudits,
  loadAiRecommendStaleSuppressions,
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
