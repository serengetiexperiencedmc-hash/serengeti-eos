import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import type { AiRecommendStaleAuditExportLastFilter } from "@sedmc/kernel";
import {
  loadAiRecommendStaleAuditExportLastFilters,
  upsertAiRecommendStaleAuditExportLastFilter,
} from "./persistence/pg-repository.js";
import {
  hydrateAiRecommendStaleAuditExportLastFilters,
  persistAiRecommendStaleAuditExportLastFilter,
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

describe("I20.17 last-used stale recommend audit export filter", () => {
  it("lists I20.17 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("068_i2017_ai_recommend_stale_audit_export_last_filter"))).toBe(
      true,
    );
  });

  it("dual-writes last-used filter on export and hydrates", async () => {
    const store = seedStore("i2017-persist", TEST_BOOTSTRAP_SECRETS);
    const writes: AiRecommendStaleAuditExportLastFilter[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO ai_recommend_stale_audit_export_last_filter")) {
          writes.push({
            tenantId: params![0] as string,
            principalId: params![1] as string,
            ...(params![2] ? { action: params![2] as AiRecommendStaleAuditExportLastFilter["action"] } : {}),
            ...(params![3] ? { since: params![3] as string } : {}),
            ...(params![4] ? { until: params![4] as string } : {}),
            updatedAt: params![5] as string,
          });
        }
        if (text.includes("FROM ai_recommend_stale_audit_export_last_filter") && !text.includes("INSERT")) {
          const row = writes[writes.length - 1];
          return {
            rows: row
              ? [
                  {
                    tenant_id: row.tenantId,
                    principal_id: row.principalId,
                    action: row.action ?? null,
                    since_text: row.since ?? null,
                    until_text: row.until ?? null,
                    updated_at: row.updatedAt,
                  },
                ]
              : [],
            rowCount: row ? 1 : 0,
          };
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const empty = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.json().increment).toBe("I20.21");
    expect(empty.json().lastFilter).toBeNull();
    expect(store.aiRecommendRuns.length).toBe(0);

    const bad = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?action=merge",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(bad.statusCode).toBe(400);
    expect(writes.length).toBe(0);

    const exported = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?action=snooze&since=2026-08-23T00:00:00.000Z",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I20.21");
    expect(exported.json().lastFilter.action).toBe("snooze");
    expect(exported.json().lastFilter.since).toBe("2026-08-23T00:00:00.000Z");
    expect(exported.json().lastFilter).not.toHaveProperty("tenantId");
    expect(writes.length).toBeGreaterThanOrEqual(1);
    expect(store.aiRecommendRuns.length).toBe(0);

    const after = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().lastFilter.action).toBe("snooze");
    expect(store.aiRecommendRuns.length).toBe(0);

    const emptyStore = seedStore("i2017-hydrate", TEST_BOOTSTRAP_SECRETS);
    const merged = await hydrateAiRecommendStaleAuditExportLastFilters(store.dbPool!, emptyStore);
    expect(merged).toBe(1);
    expect(emptyStore.aiRecommendStaleAuditExportLastFilters[0]!.action).toBe("snooze");
    await persistAiRecommendStaleAuditExportLastFilter(store.dbPool, writes[0]!);
    expect(typeof upsertAiRecommendStaleAuditExportLastFilter).toBe("function");
    expect(typeof loadAiRecommendStaleAuditExportLastFilters).toBe("function");
  });
});
