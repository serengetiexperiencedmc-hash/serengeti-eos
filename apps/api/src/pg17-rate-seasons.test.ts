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

describe("PG.17 rate seasons catalogue", () => {
  it("lists PG.17 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("055_pg17_rate_seasons"))).toBe(true);
  });

  it("creates seasons, rejects duplicates, and applies seasonId to rates", async () => {
    const store = seedStore("pg17-seasons", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
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
    expect(created.statusCode).toBe(201);
    expect(created.json().increment).toBe("PG.17");
    const seasonId = created.json().season.id as string;

    const dup = await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: { seasonCode: "high-2026", label: "Dup" },
    });
    expect(dup.statusCode).toBe(409);

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG17-LODGE",
        legalName: "Season Lodge",
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
        rateCode: "HIGH-ROOM",
        rateName: "High room",
        rateType: "per_room_per_night",
        amount: 400,
        currency: "USD",
        validFrom: "2026-06-01",
        validTo: "2026-08-31",
        seasonId,
        status: "active",
      },
    });
    expect(rate.statusCode).toBe(201);
    expect(rate.json().rate.seasonLabel).toBe("High Season 2026");
    expect(rate.json().rate.seasonId).toBe(seasonId);

    const archived = await app.inject({
      method: "DELETE",
      url: `/v1/suppliers/seasons/${seasonId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archived.statusCode).toBe(200);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.json().count).toBe(0);

    const archivedList = await app.inject({
      method: "GET",
      url: "/v1/suppliers/seasons?archived=1",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archivedList.json().count).toBe(1);

    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.17");
  });
});
