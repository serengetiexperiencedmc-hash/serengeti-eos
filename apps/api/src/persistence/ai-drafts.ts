import type { DbPool } from "@sedmc/db";
import type { AiDraft } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { loadAiDrafts, upsertAiDraft } from "./pg-repository.js";

export async function persistAiDraft(pool: DbPool | undefined, draft: AiDraft): Promise<void> {
  if (!pool) return;
  try {
    await upsertAiDraft(pool, draft);
  } catch {
    // Fire-and-forget dual-write.
  }
}

export async function hydrateAiDrafts(pool: DbPool, store: Store): Promise<number> {
  if (!store.aiDrafts) store.aiDrafts = [];
  const rows = await loadAiDrafts(pool);
  let merged = 0;
  for (const row of rows) {
    const idx = store.aiDrafts.findIndex((d) => d.id === row.id);
    if (idx >= 0) {
      store.aiDrafts[idx] = row;
    } else {
      store.aiDrafts.push(row);
      merged += 1;
    }
  }
  return merged;
}
