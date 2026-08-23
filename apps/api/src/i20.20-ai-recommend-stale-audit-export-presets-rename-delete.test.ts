import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { deleteAiRecommendStaleAuditExportPreset } from "./persistence/pg-repository.js";
import { persistDeleteAiRecommendStaleAuditExportPreset } from "./persistence/ai-recommend-stale-suppressions.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I20.20 rename and delete stale recommend audit export presets", () => {
  it("renames, rejects taken names, and deletes without recording a recommend run", async () => {
    const store = seedStore("i2020-rename", TEST_BOOTSTRAP_SECRETS);
    const deleted: string[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("DELETE FROM ai_recommend_stale_audit_export_preset")) {
          deleted.push(params![0] as string);
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const alice = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
    });
    const token = await loginCarol(app);

    const first = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });
    const second = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Acks only", action: "ack" },
    });
    const firstId = first.json().preset.id as string;
    const secondId = second.json().preset.id as string;

    const forbidden = await app.inject({
      method: "POST",
      url: `/v1/ai/recommendations/last-run/stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
      payload: { name: "Renamed" },
    });
    expect(forbidden.statusCode).toBe(403);

    const nameless = await app.inject({
      method: "POST",
      url: `/v1/ai/recommendations/last-run/stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "   " },
    });
    expect(nameless.statusCode).toBe(400);
    expect(nameless.json().reason).toBe("invalid_name");

    const missing = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/export/presets/00000000-0000-4000-8000-000000000000/rename",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Missing" },
    });
    expect(missing.statusCode).toBe(404);
    expect(missing.json().reason).toBe("preset_not_found");

    const clash = await app.inject({
      method: "POST",
      url: `/v1/ai/recommendations/last-run/stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "acks only" },
    });
    expect(clash.statusCode).toBe(409);
    expect(clash.json().reason).toBe("name_taken");

    const renamed = await app.inject({
      method: "POST",
      url: `/v1/ai/recommendations/last-run/stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "  Last  snoozes " },
    });
    expect(renamed.statusCode).toBe(200);
    expect(renamed.json().increment).toBe("I20.20");
    expect(renamed.json().preset.id).toBe(firstId);
    expect(renamed.json().preset.name).toBe("Last snoozes");
    expect(renamed.json().preset).not.toHaveProperty("tenantId");
    expect(store.aiRecommendRuns.length).toBe(0);

    const forbiddenDelete = await app.inject({
      method: "DELETE",
      url: `/v1/ai/recommendations/last-run/stale/export/presets/${secondId}`,
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
    });
    expect(forbiddenDelete.statusCode).toBe(403);

    const removed = await app.inject({
      method: "DELETE",
      url: `/v1/ai/recommendations/last-run/stale/export/presets/${secondId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(removed.statusCode).toBe(200);
    expect(removed.json().increment).toBe("I20.20");
    expect(removed.json().presets.map((row: { name: string }) => row.name)).toEqual(["Last snoozes"]);
    expect(deleted).toContain(secondId);
    expect(store.aiRecommendRuns.length).toBe(0);

    const lastRun = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(lastRun.json().presets).toHaveLength(1);
    expect(store.aiRecommendRuns.length).toBe(0);

    await persistDeleteAiRecommendStaleAuditExportPreset(store.dbPool, firstId);
    expect(typeof deleteAiRecommendStaleAuditExportPreset).toBe("function");
  });
});
