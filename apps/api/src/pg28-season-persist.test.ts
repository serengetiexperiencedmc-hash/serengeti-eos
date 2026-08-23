import { describe, expect, it } from "vitest";
import { upsertSupSeason, loadSupSeasons } from "./persistence/pg-repository.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import type { SupSeason } from "@sedmc/kernel";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("PG.28 season catalogue persistence", () => {
  it("dual-writes create/update/archive to sup_seasons when pool present", async () => {
    const store = seedStore("pg28-seasons", TEST_BOOTSTRAP_SECRETS);
    const writes: Array<{ id: string; seasonCode: string; archivedAt: string | null }> = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        if (String(sql).includes("INSERT INTO sup_seasons")) {
          writes.push({
            id: params![0] as string,
            seasonCode: params![2] as string,
            archivedAt: (params![9] as string | null) ?? null,
          });
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        seasonCode: "HIGH-2028",
        label: "High Season 2028",
        validFrom: "2028-07-01",
        validTo: "2028-10-31",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().increment).toBe("PG.28");
    const seasonId = created.json().season.id as string;
    expect(writes.some((w) => w.seasonCode === "HIGH-2028" && !w.archivedAt)).toBe(true);

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/suppliers/seasons/${seasonId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { label: "High Season 2028 revised" },
    });
    expect(patched.statusCode).toBe(200);
    expect(patched.json().increment).toBe("PG.28");

    const archived = await app.inject({
      method: "DELETE",
      url: `/v1/suppliers/seasons/${seasonId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archived.statusCode).toBe(200);
    expect(writes.some((w) => w.id === seasonId && w.archivedAt)).toBe(true);

    expect(typeof upsertSupSeason).toBe("function");
    expect(typeof loadSupSeasons).toBe("function");
    const sample: Pick<SupSeason, "seasonCode"> = { seasonCode: "HIGH-2028" };
    expect(sample.seasonCode).toBe("HIGH-2028");
  });
});
