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

describe("PG.17 supplier rate conflicts", () => {
  it("detects overlapping same-type rates and banners PG.17", async () => {
    const store = seedStore("pg15-conf", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG15-LODGE",
        legalName: "Conflict Lodge",
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

    const conflicts = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/conflicts?supplierId=${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(conflicts.statusCode).toBe(200);
    expect(conflicts.json().increment).toBe("PG.17");
    expect(conflicts.json().count).toBe(1);
    expect(conflicts.json().conflicts[0].overlapFrom).toBe("2026-07-01");
    expect(conflicts.json().conflicts[0].overlapTo).toBe("2026-08-31");

    const calendar = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/calendar?from=2026-01-01&to=2026-12-31&supplierId=${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(calendar.json().increment).toBe("PG.17");
    expect(calendar.json().conflicts).toHaveLength(1);

    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.17");
  });
});
