import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import type { AiRecommendStaleSuppression } from "@sedmc/kernel";
import {
  deleteAiRecommendStaleSuppression,
  loadAiRecommendStaleSuppressions,
  upsertAiRecommendStaleSuppression,
} from "./persistence/pg-repository.js";
import {
  hydrateAiRecommendStaleSuppressions,
  persistAiRecommendStaleSuppression,
} from "./persistence/ai-recommend-stale-suppressions.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I20.13 stale recommend suppression persistence", () => {
  it("lists I20.13 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("066_i2013_ai_recommend_stale_suppression"))).toBe(true);
  });

  it("dual-writes snooze and deletes the row when recommend restamps", async () => {
    const store = seedStore("i2013-persist", TEST_BOOTSTRAP_SECRETS);
    const writes: AiRecommendStaleSuppression[] = [];
    const deletes: string[][] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO ai_recommend_stale_suppression")) {
          writes.push({
            tenantId: params![0] as string,
            principalId: params![1] as string,
            ...(params![2] ? { acknowledgedAt: params![2] as string } : {}),
            ...(params![3] ? { snoozedUntil: params![3] as string } : {}),
            updatedAt: params![4] as string,
            updatedByPrincipalId: params![5] as string,
          });
        }
        if (text.includes("DELETE FROM ai_recommend_stale_suppression")) {
          deletes.push([params![0] as string, params![1] as string]);
        }
        if (text.includes("FROM ai_recommend_stale_suppression") && !text.includes("DELETE")) {
          const row = writes[writes.length - 1];
          return {
            rows: row
              ? [
                  {
                    tenant_id: row.tenantId,
                    principal_id: row.principalId,
                    acknowledged_at: row.acknowledgedAt ?? null,
                    snoozed_until: row.snoozedUntil ?? null,
                    updated_at: row.updatedAt,
                    updated_by_principal_id: row.updatedByPrincipalId,
                  },
                ]
              : [],
            rowCount: writes.length ? 1 : 0,
          };
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const snoozed = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I20.22");
    expect(writes.length).toBeGreaterThanOrEqual(1);
    expect(writes[0]!.snoozedUntil).toBeTruthy();

    await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(deletes.length).toBeGreaterThanOrEqual(1);

    const emptyStore = seedStore("i2013-hydrate", TEST_BOOTSTRAP_SECRETS);
    const merged = await hydrateAiRecommendStaleSuppressions(store.dbPool!, emptyStore);
    expect(merged).toBe(1);
    expect(emptyStore.aiRecommendStaleSuppressions[0]!.snoozedUntil).toBeTruthy();
    await persistAiRecommendStaleSuppression(store.dbPool, writes[0]!);
    expect(typeof upsertAiRecommendStaleSuppression).toBe("function");
    expect(typeof loadAiRecommendStaleSuppressions).toBe("function");
    expect(typeof deleteAiRecommendStaleSuppression).toBe("function");
  });
});
