import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import type { AiRecommendStaleAuditExportPreset } from "@sedmc/kernel";
import {
  loadAiRecommendStaleAuditExportPresets,
  upsertAiRecommendStaleAuditExportPreset,
} from "./persistence/pg-repository.js";
import {
  hydrateAiRecommendStaleAuditExportPresets,
  persistAiRecommendStaleAuditExportPreset,
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

describe("I20.19 persist named stale recommend audit export presets", () => {
  it("lists I20.19 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("069_i2019_ai_recommend_stale_audit_export_preset"))).toBe(true);
  });

  it("dual-writes presets on save and hydrates", async () => {
    const store = seedStore("i2019-persist", TEST_BOOTSTRAP_SECRETS);
    const writes: AiRecommendStaleAuditExportPreset[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO ai_recommend_stale_audit_export_preset")) {
          writes.push({
            id: params![0] as string,
            tenantId: params![1] as string,
            name: params![2] as string,
            ...(params![3] ? { action: params![3] as AiRecommendStaleAuditExportPreset["action"] } : {}),
            ...(params![4] ? { since: params![4] as string } : {}),
            ...(params![5] ? { until: params![5] as string } : {}),
            createdAt: params![6] as string,
            createdByPrincipalId: params![7] as string,
            updatedAt: params![8] as string,
          });
        }
        if (text.includes("FROM ai_recommend_stale_audit_export_preset") && !text.includes("INSERT")) {
          return {
            rows: writes.map((row) => ({
              id: row.id,
              tenant_id: row.tenantId,
              name: row.name,
              action: row.action ?? null,
              since_text: row.since ?? null,
              until_text: row.until ?? null,
              created_at: row.createdAt,
              created_by_principal_id: row.createdByPrincipalId,
              updated_at: row.updatedAt,
            })),
            rowCount: writes.length,
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
    expect(empty.json().increment).toBe("I20.22");
    expect(empty.json().presets).toEqual([]);
    expect(store.aiRecommendRuns.length).toBe(0);

    const bad = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "   " },
    });
    expect(bad.statusCode).toBe(400);
    expect(writes.length).toBe(0);

    const saved = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });
    expect(saved.statusCode).toBe(200);
    expect(saved.json().increment).toBe("I20.22");
    expect(saved.json().preset.name).toBe("Snoozes only");
    expect(saved.json().preset).not.toHaveProperty("tenantId");
    expect(writes.length).toBeGreaterThanOrEqual(1);
    expect(store.aiRecommendRuns.length).toBe(0);

    const after = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().presets[0].name).toBe("Snoozes only");
    expect(store.aiRecommendRuns.length).toBe(0);

    const emptyStore = seedStore("i2019-hydrate", TEST_BOOTSTRAP_SECRETS);
    const merged = await hydrateAiRecommendStaleAuditExportPresets(store.dbPool!, emptyStore);
    expect(merged).toBe(1);
    expect(emptyStore.aiRecommendStaleAuditExportPresets[0]!.name).toBe("Snoozes only");
    await persistAiRecommendStaleAuditExportPreset(store.dbPool, writes[0]!);
    expect(typeof upsertAiRecommendStaleAuditExportPreset).toBe("function");
    expect(typeof loadAiRecommendStaleAuditExportPresets).toBe("function");
  });
});
