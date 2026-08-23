import { describe, expect, it } from "vitest";
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

describe("PG.23 season calendar conflict heatmap", () => {
  it("aggregates overlapping conflicts by month and season", async () => {
    const store = seedStore("pg23-heat", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG23-LODGE",
        legalName: "Heatmap Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    const supplierId = created.json().supplier.id as string;

    await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "A-HIGH",
        rateName: "A high",
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
        rateCode: "B-HIGH",
        rateName: "B high",
        rateType: "per_room_per_night",
        amount: 420,
        currency: "USD",
        validFrom: "2026-07-01",
        validTo: "2026-09-30",
        seasonLabel: "High B",
        status: "active",
      },
    });

    const calendar = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/calendar?from=2026-01-01&to=2026-12-31&supplierId=${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(calendar.statusCode).toBe(200);
    expect(calendar.json().increment).toBe("PG.24");
    expect(calendar.json().heatmap.maxConflictCount).toBeGreaterThanOrEqual(1);
    expect(calendar.json().heatmap.months.some((m: { month: string }) => m.month === "2026-07")).toBe(true);
    expect(calendar.json().heatmap.seasons.map((s: { label: string }) => s.label).sort()).toEqual([
      "High A",
      "High B",
    ]);
    expect(
      calendar.json().heatmap.cells.some(
        (c: { month: string; seasonLabel: string }) => c.month === "2026-07" && c.seasonLabel === "High A",
      ),
    ).toBe(true);

    const heatmap = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts/heatmap?supplierId=${supplierId}&from=2026-01-01&to=2026-12-31`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(heatmap.statusCode).toBe(200);
    expect(heatmap.json().increment).toBe("PG.24");
    expect(heatmap.json().conflictCount).toBe(1);
    expect(heatmap.json().heatmap.months.find((m: { month: string }) => m.month === "2026-07").conflictCount).toBe(1);

    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.21");
  });
});
