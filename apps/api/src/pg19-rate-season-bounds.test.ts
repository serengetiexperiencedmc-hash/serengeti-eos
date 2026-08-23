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

describe("PG.19 rate season bounds", () => {
  it("rejects rates outside season dates and months; allows in-bounds", async () => {
    const store = seedStore("pg19-bounds", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const season = await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        seasonCode: "HIGH-2026",
        label: "High Season 2026",
        validFrom: "2026-06-01",
        validTo: "2026-08-31",
        monthFrom: 6,
        monthTo: 8,
      },
    });
    expect(season.statusCode).toBe(201);
    expect(season.json().increment).toBe("PG.28");
    const seasonId = season.json().season.id as string;

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG19-LODGE",
        legalName: "PG19 Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    const supplierId = supplier.json().supplier.id as string;

    const ok = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "IN",
        rateName: "In bounds",
        rateType: "per_room_per_night",
        amount: 100,
        currency: "USD",
        validFrom: "2026-06-15",
        validTo: "2026-07-15",
        seasonId,
        status: "active",
      },
    });
    expect(ok.statusCode).toBe(201);

    const early = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "EARLY",
        rateName: "Too early",
        rateType: "per_room_per_night",
        amount: 100,
        currency: "USD",
        validFrom: "2026-05-01",
        validTo: "2026-06-15",
        seasonId,
        status: "active",
      },
    });
    expect(early.statusCode).toBe(400);
    expect(early.json().reason).toBe("rate_outside_season_dates");

    const monthSpill = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "SPILL",
        rateName: "Month spill",
        rateType: "per_room_per_night",
        amount: 100,
        currency: "USD",
        validFrom: "2026-06-01",
        validTo: "2026-09-15",
        seasonId,
        status: "active",
      },
    });
    expect(monthSpill.statusCode).toBe(400);
    expect(["rate_outside_season_dates", "rate_outside_season_months"]).toContain(monthSpill.json().reason);
  });

  it("rejects import rows outside season bounds", async () => {
    const store = seedStore("pg19-import", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        seasonCode: "PEAK",
        label: "Peak",
        validFrom: "2026-07-01",
        validTo: "2026-07-31",
      },
    });
    await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG19-B",
        legalName: "PG19 B",
        category: "accommodation",
        country: "TZ",
      },
    });

    const csv = [
      "supplierCode,rateCode,rateName,rateType,amount,currency,validFrom,validTo,seasonCode,status",
      "PG19-B,R1,Room,per_room_per_night,100,USD,2026-06-01,2026-07-15,PEAK,active",
    ].join("\n");
    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: { sourceSystem: "pg19", entityType: "supplier_rate", csv },
    });
    expect(created.json().batch.increment).toBe("PG.21");
    const batchId = created.json().batch.id as string;
    const validated = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${batchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(validated.json().batch.status).toBe("failed");
    expect(validated.json().batch.validationResults[0].errors).toContain("rate_outside_season_dates");
  });
});
