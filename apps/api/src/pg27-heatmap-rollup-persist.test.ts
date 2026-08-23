import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { upsertSupHeatmapRollupSnapshot, loadSupHeatmapRollupSnapshots } from "./persistence/pg-repository.js";
import { persistSupHeatmapRollupSnapshot } from "./persistence/supplier.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import type { SupHeatmapRollupSnapshot } from "@sedmc/kernel";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

async function addOverlappingRates(
  app: ReturnType<typeof buildServer>,
  token: string,
  supplierId: string,
  prefix: string,
) {
  await app.inject({
    method: "POST",
    url: `/v1/suppliers/${supplierId}/rates`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rateCode: `${prefix}-A`,
      rateName: `${prefix} A`,
      rateType: "per_room_per_night",
      amount: 400,
      currency: "USD",
      validFrom: "2026-06-01",
      validTo: "2026-08-31",
      seasonLabel: "High A",
      status: "active",
    },
  });
  await app.inject({
    method: "POST",
    url: `/v1/suppliers/${supplierId}/rates`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      rateCode: `${prefix}-B`,
      rateName: `${prefix} B`,
      rateType: "per_room_per_night",
      amount: 420,
      currency: "USD",
      validFrom: "2026-07-01",
      validTo: "2026-09-30",
      seasonLabel: "High B",
      status: "active",
    },
  });
}

describe("PG.27 heatmap rollup persist / season catalogue export", () => {
  it("lists PG.27 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("061_pg27_heatmap_rollup_snapshot"))).toBe(true);
  });

  it("stamps a rollup snapshot, dual-writes, and exports the season catalogue", async () => {
    const store = seedStore("pg27-rollup", TEST_BOOTSTRAP_SECRETS);
    const writes: SupHeatmapRollupSnapshot[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        if (String(sql).includes("sup_heatmap_rollup_snapshot") && String(sql).includes("INSERT")) {
          writes.push({
            tenantId: params![0] as string,
            generatedAt: params![1] as string,
            generatedByPrincipalId: params![2] as string,
            ...(params![3] ? { from: params![3] as string } : {}),
            ...(params![4] ? { to: params![4] as string } : {}),
            conflictCount: params![5] as number,
            unresolvedCount: params![6] as number,
            supplierCount: params![7] as number,
            suppliers: JSON.parse(String(params![8] ?? "[]")),
          });
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: { supplierCode: "PG27-A", legalName: "Lodge A", category: "accommodation", country: "TZ" },
    });
    const supplierId = created.json().supplier.id as string;
    await addOverlappingRates(app, token, supplierId, "A");

    const heatmap = await app.inject({
      method: "GET",
      url: "/v1/suppliers/rates/conflicts/heatmap?from=2026-01-01&to=2026-12-31",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(heatmap.statusCode).toBe(200);
    expect(heatmap.json().increment).toBe("PG.27");
    expect(heatmap.json().lastSnapshot.supplierCount).toBeGreaterThanOrEqual(1);
    expect(writes.length).toBeGreaterThanOrEqual(1);

    const status = await app.inject({
      method: "GET",
      url: "/v1/suppliers/rates/conflicts/heatmap/rollup-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(status.json().increment).toBe("PG.27");
    expect(status.json().lastSnapshot.supplierCount).toBeGreaterThanOrEqual(1);

    await persistSupHeatmapRollupSnapshot(store.dbPool, writes[0]!);
    expect(typeof upsertSupHeatmapRollupSnapshot).toBe("function");
    expect(typeof loadSupHeatmapRollupSnapshots).toBe("function");

    await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        seasonCode: "HIGH-2026",
        label: "High Season 2026",
        validFrom: "2026-07-01",
        validTo: "2026-10-31",
      },
    });

    const csv = await app.inject({
      method: "GET",
      url: "/v1/suppliers/seasons/export?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(csv.statusCode).toBe(200);
    expect(csv.json().increment).toBe("PG.27");
    expect(csv.json().csv).toContain("id,seasonCode,label,validFrom,validTo");
    expect(csv.json().csv).toContain("HIGH-2026");
    expect(csv.json().csv).toContain("High Season 2026");
  });
});
