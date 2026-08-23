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

describe("PG.25 heatmap CSV/JSON export", () => {
  it("exports heatmap cells as JSON and CSV", async () => {
    const store = seedStore("pg25-export", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG25-LODGE",
        legalName: "Export Lodge",
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

    const json = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts/heatmap/export?supplierId=${supplierId}&from=2026-01-01&to=2026-12-31`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(json.statusCode).toBe(200);
    expect(json.json().increment).toBe("PG.25");
    expect(json.json().format).toBe("json");
    expect(json.json().count).toBeGreaterThanOrEqual(1);
    expect(json.json().items.some((r: { month: string }) => r.month === "2026-07")).toBe(true);

    const csv = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts/heatmap/export?supplierId=${supplierId}&from=2026-01-01&to=2026-12-31&format=csv`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(csv.json().format).toBe("csv");
    expect(csv.json().csv).toContain("month,seasonLabel,conflictCount,unresolvedCount");
    expect(csv.json().csv).toContain("2026-07");
  });
});
