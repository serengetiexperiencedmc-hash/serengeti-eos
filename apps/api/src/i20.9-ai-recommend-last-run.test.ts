import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { hydrateAiRecommendRuns, persistAiRecommendRun } from "./persistence/ai-recommend-runs.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I20.9 AI recommend last run", () => {
  it("lists I20.9 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("065_i209_ai_recommend_runs"))).toBe(true);
  });

  it("stores last-run on recommend and reads it without recording again", async () => {
    const store = seedStore("i209-last-run", TEST_BOOTSTRAP_SECRETS);
    const writes: unknown[][] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO ai_recommend_runs")) {
          writes.push(params ?? []);
        }
        if (text.includes("FROM ai_recommend_runs")) {
          const row = writes[writes.length - 1];
          return {
            rows: row
              ? [
                  {
                    tenant_id: row[0],
                    principal_id: row[1],
                    occurred_at: row[2],
                    provider: row[3],
                    item_count: row[4],
                    keys: row[5],
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

    const empty = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.statusCode).toBe(200);
    expect(empty.json().increment).toBe("I20.16");
    expect(empty.json().lastRun).toBeNull();

    const listed = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().lastRun).toBeTruthy();
    expect(listed.json().lastRun.provider).toBe("dev-rules");
    expect(Array.isArray(listed.json().lastRun.keys)).toBe(true);
    expect(writes.length).toBeGreaterThanOrEqual(1);

    const beforeCount = store.aiRecommendRuns.length;
    const lastRun = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(lastRun.json().lastRun.occurredAt).toBe(listed.json().lastRun.occurredAt);
    expect(lastRun.json().lastRun.keys).toEqual(listed.json().lastRun.keys);
    expect(store.aiRecommendRuns.length).toBe(beforeCount);

    const emptyStore = seedStore("i209-hydrate", TEST_BOOTSTRAP_SECRETS);
    const merged = await hydrateAiRecommendRuns(store.dbPool!, emptyStore);
    expect(merged).toBe(1);
    expect(emptyStore.aiRecommendRuns[0]!.provider).toBe("dev-rules");
    await persistAiRecommendRun(store.dbPool, emptyStore.aiRecommendRuns[0]!);
  });
});
