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

describe("PG.14 supplier rate calendar", () => {
  it("groups overlapping rates by season and month", async () => {
    const store = seedStore("pg14-cal", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG14-LODGE",
        legalName: "Calendar Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(created.statusCode).toBe(201);
    const supplierId = created.json().supplier.id as string;

    await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "HIGH-26",
        rateName: "High season",
        rateType: "per_room_per_night",
        amount: 450,
        currency: "USD",
        validFrom: "2026-06-01",
        validTo: "2026-08-31",
        seasonLabel: "High Season",
        status: "active",
      },
    });
    await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "LOW-26",
        rateName: "Low season",
        rateType: "per_room_per_night",
        amount: 280,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-03-31",
        seasonLabel: "Low Season",
        status: "active",
      },
    });

    const calendar = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/calendar?from=2026-02-01&to=2026-07-31&supplierId=${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(calendar.statusCode).toBe(200);
    expect(calendar.json().increment).toBe("PG.25");
    expect(calendar.json().items).toHaveLength(2);
    expect(calendar.json().seasons.map((s: { label: string }) => s.label).sort()).toEqual([
      "High Season",
      "Low Season",
    ]);
    expect(calendar.json().months.some((m: { month: string }) => m.month === "2026-02")).toBe(true);
    expect(calendar.json().months.some((m: { month: string }) => m.month === "2026-07")).toBe(true);

    const filtered = await app.inject({
      method: "GET",
      url: `/v1/suppliers/rates/calendar?from=2026-01-01&to=2026-12-31&supplierId=${supplierId}&seasonLabel=High%20Season`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(filtered.json().items).toHaveLength(1);
    expect(filtered.json().items[0].rateCode).toBe("HIGH-26");
  });

  it("reports PG.14 on supplier health", async () => {
    const store = seedStore("pg14-health", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.21");
  });
});

