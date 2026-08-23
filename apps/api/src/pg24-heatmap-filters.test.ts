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

describe("PG.24 heatmap unresolved / season filters", () => {
  it("filters heatmap by seasonLabel, seasonId, and unresolvedOnly", async () => {
    const store = seedStore("pg24-heat", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const season = await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        seasonCode: "HIGH-A",
        label: "High A",
        validFrom: "2026-06-01",
        validTo: "2026-08-31",
      },
    });
    expect(season.statusCode).toBe(201);
    const seasonId = season.json().season.id as string;

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG24-LODGE",
        legalName: "Filter Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    const supplierId = created.json().supplier.id as string;

    const rateA = await app.inject({
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
        seasonId,
        status: "active",
      },
    });
    const rateAId = rateA.json().rate.id as string;

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

    const byLabel = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts/heatmap?supplierId=${supplierId}&from=2026-01-01&to=2026-12-31&seasonLabel=High%20A`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(byLabel.statusCode).toBe(200);
    expect(byLabel.json().increment).toBe("PG.24");
    expect(byLabel.json().filters.seasonLabel).toBe("High A");
    expect(byLabel.json().conflictCount).toBe(1);
    expect(byLabel.json().heatmap.seasons.every((s: { label: string }) => s.label === "High A" || s.label === "High B")).toBe(true);

    const byId = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts/heatmap?supplierId=${supplierId}&from=2026-01-01&to=2026-12-31&seasonId=${seasonId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(byId.json().increment).toBe("PG.24");
    expect(byId.json().filters.seasonId).toBe(seasonId);
    expect(byId.json().conflictCount).toBe(1);
    expect(byId.json().heatmap.maxConflictCount).toBeGreaterThanOrEqual(1);

    await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates/${rateAId}/prefer`,
      headers: { authorization: `Bearer ${token}` },
    });

    const unresolved = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts/heatmap?supplierId=${supplierId}&from=2026-01-01&to=2026-12-31&unresolvedOnly=1`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(unresolved.json().increment).toBe("PG.24");
    expect(unresolved.json().filters.unresolvedOnly).toBe(true);
    expect(unresolved.json().conflictCount).toBe(0);
    expect(unresolved.json().heatmap.maxConflictCount).toBe(0);
  });
});
