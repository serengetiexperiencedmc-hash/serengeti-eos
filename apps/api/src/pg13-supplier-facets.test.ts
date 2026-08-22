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

describe("PG.13 supplier facets and search", () => {
  it("returns facets and filters by country / preferredPartner", async () => {
    const store = seedStore("pg13-facets", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG13-TZ",
        legalName: "TZ Lodge",
        category: "accommodation",
        country: "TZ",
        preferredPartner: true,
      },
    });
    await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG13-KE",
        legalName: "KE Fleet",
        category: "vehicle_hire",
        country: "KE",
        preferredPartner: false,
      },
    });

    const facets = await app.inject({
      method: "GET",
      url: "/v1/suppliers/facets",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(facets.statusCode).toBe(200);
    expect(facets.json().increment).toBe("PG.17");
    expect(facets.json().total).toBeGreaterThanOrEqual(2);
    expect(facets.json().facets.country.some((c: { value: string }) => c.value === "TZ")).toBe(true);
    expect(facets.json().facets.category.some((c: { value: string }) => c.value === "accommodation")).toBe(
      true,
    );

    const filtered = await app.inject({
      method: "GET",
      url: "/v1/suppliers?country=TZ&preferredPartner=1",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(filtered.statusCode).toBe(200);
    expect(filtered.json().increment).toBe("PG.17");
    expect(filtered.json().items.every((s: { country: string }) => s.country === "TZ")).toBe(true);
    expect(filtered.json().items.every((s: { preferredPartner: boolean }) => s.preferredPartner)).toBe(true);
  });

  it("reports PG.13 on supplier health", async () => {
    const store = seedStore("pg13-health", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.17");
  });
});

