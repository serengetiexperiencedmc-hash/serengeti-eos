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

describe("PG.18 season-aware rate import", () => {
  it("maps seasonCode on import to seasonId + canonical label", async () => {
    const store = seedStore("pg18-import", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const season = await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: { seasonCode: "HIGH-2026", label: "High Season 2026" },
    });
    expect(season.statusCode).toBe(201);
    const seasonId = season.json().season.id as string;

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG18-LODGE",
        legalName: "PG18 Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(supplier.statusCode).toBe(201);

    const csv = [
      "supplierCode,rateCode,rateName,rateType,amount,currency,validFrom,validTo,seasonCode,status",
      "PG18-LODGE,HIGH-ROOM,High room,per_room_per_night,400,USD,2026-06-01,2026-08-31,HIGH-2026,active",
    ].join("\n");

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: { sourceSystem: "pg18-test", entityType: "supplier_rate", csv },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().batch.increment).toBe("PG.18");
    const batchId = created.json().batch.id as string;

    const validated = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${batchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(validated.statusCode).toBe(200);
    expect(validated.json().batch.status).toBe("validated");

    const executed = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${batchId}/execute`,
      headers: { authorization: `Bearer ${token}`, "idempotency-key": "pg18-1" },
    });
    expect(executed.statusCode).toBe(200);

    const rate = store.supRates.find((r) => r.rateCode === "HIGH-ROOM");
    expect(rate?.seasonId).toBe(seasonId);
    expect(rate?.seasonLabel).toBe("High Season 2026");
  });

  it("rejects unknown seasonCode at validate", async () => {
    const store = seedStore("pg18-missing", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG18-B",
        legalName: "PG18 B",
        category: "accommodation",
        country: "TZ",
      },
    });

    const csv = [
      "supplierCode,rateCode,rateName,rateType,amount,currency,validFrom,validTo,seasonCode,status",
      "PG18-B,R1,Room,per_room_per_night,100,USD,2026-01-01,2026-12-31,NOPE,active",
    ].join("\n");

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers/imports",
      headers: { authorization: `Bearer ${token}` },
      payload: { sourceSystem: "pg18-test", entityType: "supplier_rate", csv },
    });
    const batchId = created.json().batch.id as string;
    const validated = await app.inject({
      method: "POST",
      url: `/v1/suppliers/imports/${batchId}/validate`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(validated.json().batch.status).toBe("failed");
    expect(validated.json().batch.validationResults[0].errors).toContain("season_not_found");
  });
});
