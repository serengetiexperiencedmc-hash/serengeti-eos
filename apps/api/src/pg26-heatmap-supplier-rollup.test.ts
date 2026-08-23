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

describe("PG.26 heatmap supplier rollup / multi-supplier export", () => {
  it("rolls up conflicts by supplier and exports a multi-supplier CSV", async () => {
    const store = seedStore("pg26-rollup", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const a = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: { supplierCode: "PG26-A", legalName: "Lodge A", category: "accommodation", country: "TZ" },
    });
    const b = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: { supplierCode: "PG26-B", legalName: "Lodge B", category: "accommodation", country: "TZ" },
    });
    const aId = a.json().supplier.id as string;
    const bId = b.json().supplier.id as string;
    await addOverlappingRates(app, token, aId, "A");
    await addOverlappingRates(app, token, bId, "B");

    const heatmap = await app.inject({
      method: "GET",
      url: "/v1/suppliers/rates/conflicts/heatmap?from=2026-01-01&to=2026-12-31",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(heatmap.statusCode).toBe(200);
    expect(heatmap.json().increment).toBe("PG.26");
    const suppliers = heatmap.json().heatmap.suppliers as Array<{
      supplierCode: string;
      conflictCount: number;
    }>;
    expect(suppliers.map((s) => s.supplierCode).sort()).toEqual(["PG26-A", "PG26-B"]);
    expect(suppliers.every((s) => s.conflictCount >= 1)).toBe(true);

    const csv = await app.inject({
      method: "GET",
      url: "/v1/suppliers/rates/conflicts/heatmap/export?from=2026-01-01&to=2026-12-31&format=csv&view=suppliers",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(csv.json().increment).toBe("PG.26");
    expect(csv.json().view).toBe("suppliers");
    expect(csv.json().csv).toContain("supplierId,supplierCode,legalName,conflictCount,unresolvedCount");
    expect(csv.json().csv).toContain("PG26-A");
    expect(csv.json().csv).toContain("PG26-B");
  });
});
