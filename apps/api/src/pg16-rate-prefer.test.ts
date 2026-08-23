import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
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

describe("PG.17 rate conflict prefer", () => {
  it("lists PG.17 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("053_pg16_rate_preferred_conflict"))).toBe(true);
  });

  it("prefers one overlapping rate and marks conflict resolved", async () => {
    const store = seedStore("pg16-prefer", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG16-LODGE",
        legalName: "Prefer Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    const supplierId = created.json().supplier.id as string;

    const a = await app.inject({
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
        status: "active",
      },
    });
    const b = await app.inject({
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
        status: "active",
      },
    });
    const rateAId = a.json().rate.id as string;
    const rateBId = b.json().rate.id as string;

    const before = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts?supplierId=${supplierId}&unresolvedOnly=1`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(before.statusCode).toBe(200);
    expect(before.json().increment).toBe("PG.25");
    expect(before.json().count).toBe(1);
    expect(before.json().conflicts[0].resolved).toBe(false);

    const preferred = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates/${rateAId}/prefer`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(preferred.statusCode).toBe(200);
    expect(preferred.json().increment).toBe("PG.21");
    expect(preferred.json().rate.preferredInConflict).toBe(true);

    const after = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts?supplierId=${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().conflicts[0].resolved).toBe(true);
    expect(after.json().conflicts[0].preferredRateId).toBe(rateAId);
    expect(after.json().unresolvedCount).toBe(0);

    const unresolvedOnly = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts?supplierId=${supplierId}&unresolvedOnly=1`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(unresolvedOnly.json().count).toBe(0);

    const preferB = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates/${rateBId}/prefer`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(preferB.json().rate.preferredInConflict).toBe(true);
    expect(preferB.json().clearedPeers).toBe(1);

    const switched = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts?supplierId=${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(switched.json().conflicts[0].preferredRateId).toBe(rateBId);

    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.21");
  });
});
