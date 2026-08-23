import type { DbPool } from "@sedmc/db";
import type { AiRecommendStaleSuppression } from "@sedmc/kernel";
import type { Store } from "../store.js";
import {
  deleteAiRecommendStaleSuppression,
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
