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

describe("PG.20 season shrink impact", () => {
  it("previews and reports linked rates outside shrunk season bounds without blocking", async () => {
    const store = seedStore("pg20-impact", TEST_BOOTSTRAP_SECRETS);
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
        supplierCode: "PG20-LODGE",
        legalName: "PG20 Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    const supplierId = supplier.json().supplier.id as string;

    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "WIDE",
        rateName: "Wide window",
        rateType: "per_room_per_night",
        amount: 120,
        currency: "USD",
        validFrom: "2026-06-01",
        validTo: "2026-08-31",
        seasonId,
        status: "active",
      },
    });
    expect(rate.statusCode).toBe(201);

    const preview = await app.inject({
      method: "POST",
      url: `/v1/suppliers/seasons/${seasonId}/impact-preview`,
      headers: { authorization: `Bearer ${token}` },
      payload: { validFrom: "2026-07-01", validTo: "2026-07-31" },
    });
    expect(preview.statusCode).toBe(200);
    expect(preview.json().increment).toBe("PG.22");
    expect(preview.json().impact.linkedRateCount).toBe(1);
    expect(preview.json().impact.outsideCount).toBe(1);
    expect(preview.json().impact.warning).toBe("season_shrink_affects_rates");
    expect(preview.json().impact.ratesOutsideBounds[0].rateCode).toBe("WIDE");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/suppliers/seasons/${seasonId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { validFrom: "2026-07-01", validTo: "2026-07-31" },
    });
    expect(patched.statusCode).toBe(200);
    expect(patched.json().season.validFrom).toBe("2026-07-01");
    expect(patched.json().impact.outsideCount).toBe(1);
    expect(patched.json().impact.warning).toBe("season_shrink_affects_rates");

    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.21");
  });
});
