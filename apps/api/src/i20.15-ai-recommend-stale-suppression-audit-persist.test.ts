import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import type { AiRecommendStaleSuppressionAudit } from "@sedmc/kernel";
import {
  insertAiRecommendStaleSuppressionAudit,
  loadAiRecommendStaleSuppressionAudits,
} from "./persistence/pg-repository.js";
import {
  hydrateAiRecommendStaleSuppressionAudits,
  persistAiRecommendStaleSuppressionAudit,
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

describe("I20.15 stale recommend suppression audit persistence", () => {
  it("lists I20.15 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("067_i2015_ai_recommend_stale_suppression_audit"))).toBe(true);
  });

  it("dual-writes snooze/ack/clear audit and hydrates", async () => {
    const store = seedStore("i2015-persist", TEST_BOOTSTRAP_SECRETS);
    const writes: AiRecommendStaleSuppressionAudit[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO ai_recommend_stale_suppression_audit")) {
          writes.push({
            id: params![0] as string,
            tenantId: params![1] as string,
            principalId: params![2] as string,
            action: params![3] as AiRecommendStaleSuppressionAudit["action"],
            ...(params![4] ? { snoozedUntil: params![4] as string } : {}),
            ...(params![5] ? { acknowledgedAt: params![5] as string } : {}),
            createdAt: params![6] as string,
            createdByPrincipalId: params![7] as string,
          });
        }
        if (text.includes("FROM ai_recommend_stale_suppression_audit") && !text.includes("INSERT")) {
          return {
            rows: writes.map((row) => ({
              id: row.id,
              tenant_id: row.tenantId,
              principal_id: row.principalId,
              action: row.action,
              snoozed_until: row.snoozedUntil ?? null,
              acknowledged_at: row.acknowledgedAt ?? null,
              created_at: row.createdAt,
              created_by_principal_id: row.createdByPrincipalId,
            })),
            rowCount: writes.length,
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
    expect(snoozed.json().increment).toBe("I20.16");
    expect(writes.some((row) => row.action === "snooze")).toBe(true);

    await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/ack",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(writes.some((row) => row.action === "ack")).toBe(true);

    await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(writes.some((row) => row.action === "cleared")).toBe(true);

    const emptyStore = seedStore("i2015-hydrate", TEST_BOOTSTRAP_SECRETS);
    const merged = await hydrateAiRecommendStaleSuppressionAudits(store.dbPool!, emptyStore);
    expect(merged).toBeGreaterThanOrEqual(3);
    expect(emptyStore.aiRecommendStaleSuppressionAudits.map((a) => a.action)).toEqual(
      expect.arrayContaining(["snooze", "ack", "cleared"]),
    );
    await persistAiRecommendStaleSuppressionAudit(store.dbPool, writes[0]!);
    expect(typeof insertAiRecommendStaleSuppressionAudit).toBe("function");
    expect(typeof loadAiRecommendStaleSuppressionAudits).toBe("function");
  });
});
