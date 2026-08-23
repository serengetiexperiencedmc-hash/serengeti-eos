import type { DbPool } from "@sedmc/db";
import type { AiRecommendLastRun } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { loadAiRecommendRuns, upsertAiRecommendRun } from "./pg-repository.js";

export async function persistAiRecommendRun(
  pool: DbPool | undefined,
  run: AiRecommendLastRun,
): Promise<void> {
  if (!pool) return;
  try {
    await upsertAiRecommendRun(pool, run);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateAiRecommendRuns(pool: DbPool, store: Store): Promise<number> {
  if (!store.aiRecommendRuns) store.aiRecommendRuns = [];
  const rows = await loadAiRecommendRuns(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.aiRecommendRuns.findIndex(
      (r) => r.tenantId === row.tenantId && r.principalId === row.principalId,
    );
    if (idx >= 0) {
      store.aiRecommendRuns[idx] = row;
    } else {
      store.aiRecommendRuns.push(row);
      merged += 1;
    }
  }
  return merged;
}
