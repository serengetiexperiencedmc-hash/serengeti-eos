import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import type {
  AiRecommendStaleAuditExportLastPreset,
  AiRecommendStaleAuditExportPresetUsage,
} from "@sedmc/kernel";
import {
  insertAiRecommendStaleAuditExportPresetUsage,
  loadAiRecommendStaleAuditExportLastPresets,
  loadAiRecommendStaleAuditExportPresetUsages,
  upsertAiRecommendStaleAuditExportLastPreset,
} from "./persistence/pg-repository.js";
import {
  hydrateAiRecommendStaleAuditExportLastPresets,
  hydrateAiRecommendStaleAuditExportPresetUsages,
  persistAiRecommendStaleAuditExportLastPreset,
  persistAiRecommendStaleAuditExportPresetUsage,
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

describe("I20.22 persist preset usage and last-used preset", () => {
  it("lists I20.22 migration", () => {
    expect(
      listMigrationFiles().some((f) => f.includes("070_i2022_ai_recommend_stale_audit_export_preset_usage")),
    ).toBe(true);
  });

  it("dual-writes usage and last preset on export and hydrates", async () => {
    const store = seedStore("i2022-persist", TEST_BOOTSTRAP_SECRETS);
    const usageWrites: AiRecommendStaleAuditExportPresetUsage[] = [];
    const lastWrites: AiRecommendStaleAuditExportLastPreset[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO ai_recommend_stale_audit_export_preset_usage")) {
          usageWrites.push({
            id: params![0] as string,
            tenantId: params![1] as string,
            principalId: params![2] as string,
            presetId: params![3] as string,
            presetName: params![4] as string,
            createdAt: params![5] as string,
            createdByPrincipalId: params![6] as string,
          });
        }
        if (text.includes("INSERT INTO ai_recommend_stale_audit_export_last_preset")) {
          lastWrites.push({
            tenantId: params![0] as string,
            principalId: params![1] as string,
            presetId: params![2] as string,
            presetName: params![3] as string,
            usedAt: params![4] as string,
          });
        }
        if (text.includes("FROM ai_recommend_stale_audit_export_preset_usage") && !text.includes("INSERT")) {
          return {
            rows: usageWrites.map((row) => ({
              id: row.id,
              tenant_id: row.tenantId,
              principal_id: row.principalId,
              preset_id: row.presetId,
              preset_name: row.presetName,
              created_at: row.createdAt,
              created_by_principal_id: row.createdByPrincipalId,
            })),
            rowCount: usageWrites.length,
          };
        }
        if (text.includes("FROM ai_recommend_stale_audit_export_last_preset") && !text.includes("INSERT")) {
          return {
            rows: lastWrites.map((row) => ({
              tenant_id: row.tenantId,
              principal_id: row.principalId,
              preset_id: row.presetId,
              preset_name: row.presetName,
              used_at: row.usedAt,
            })),
            rowCount: lastWrites.length,
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
    expect(empty.json().lastPreset).toBeNull();
    expect(empty.json().usages).toEqual([]);
    expect(store.aiRecommendRuns.length).toBe(0);

    const plain = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(plain.statusCode).toBe(200);
    expect(usageWrites.length).toBe(0);
    expect(lastWrites.length).toBe(0);
    expect(store.aiRecommendRuns.length).toBe(0);

    const bad = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?action=merge",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(bad.statusCode).toBe(400);
    expect(usageWrites.length).toBe(0);
    expect(lastWrites.length).toBe(0);

    await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });
    expect(usageWrites.length).toBe(0);
    expect(lastWrites.length).toBe(0);

    const exported = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?preset=Snoozes%20only",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I20.22");
    expect(exported.json().lastPreset.presetName).toBe("Snoozes only");
    expect(exported.json().lastPreset).not.toHaveProperty("tenantId");
    expect(usageWrites.length).toBeGreaterThanOrEqual(1);
    expect(lastWrites.length).toBeGreaterThanOrEqual(1);
    expect(usageWrites[0]!.presetName).toBe("Snoozes only");
    expect(lastWrites[0]!.presetName).toBe("Snoozes only");
    expect(store.aiRecommendRuns.length).toBe(0);

    const after = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().lastPreset.presetName).toBe("Snoozes only");
    expect(after.json().usages).toHaveLength(1);
    expect(store.aiRecommendRuns.length).toBe(0);
    expect(usageWrites.length).toBe(1);
    expect(lastWrites.length).toBe(1);

    const usageExport = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export/presets/usage",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(usageExport.statusCode).toBe(200);
    expect(usageExport.json().count).toBe(1);
    expect(store.aiRecommendRuns.length).toBe(0);
    expect(usageWrites.length).toBe(1);

    const emptyStore = seedStore("i2022-hydrate", TEST_BOOTSTRAP_SECRETS);
    const mergedUsages = await hydrateAiRecommendStaleAuditExportPresetUsages(store.dbPool!, emptyStore);
    const mergedLast = await hydrateAiRecommendStaleAuditExportLastPresets(store.dbPool!, emptyStore);
    expect(mergedUsages).toBe(1);
    expect(mergedLast).toBe(1);
    expect(emptyStore.aiRecommendStaleAuditExportPresetUsages[0]!.presetName).toBe("Snoozes only");
    expect(emptyStore.aiRecommendStaleAuditExportLastPresets[0]!.presetName).toBe("Snoozes only");
    await persistAiRecommendStaleAuditExportPresetUsage(store.dbPool, usageWrites[0]!);
    await persistAiRecommendStaleAuditExportLastPreset(store.dbPool, lastWrites[0]!);
    expect(typeof insertAiRecommendStaleAuditExportPresetUsage).toBe("function");
    expect(typeof upsertAiRecommendStaleAuditExportLastPreset).toBe("function");
    expect(typeof loadAiRecommendStaleAuditExportPresetUsages).toBe("function");
    expect(typeof loadAiRecommendStaleAuditExportLastPresets).toBe("function");
  });
});
