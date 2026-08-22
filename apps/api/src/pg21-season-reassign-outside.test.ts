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

describe("PG.21 bulk reassign outside season rates", () => {
  it("clears and moves rates outside shrunk season bounds", async () => {
    const store = seedStore("pg21-reassign", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const high = await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        seasonCode: "HIGH-2026",
        label: "High 2026",
        validFrom: "2026-06-01",
        validTo: "2026-08-31",
      },
    });
    const highId = high.json().season.id as string;

    const shoulder = await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        seasonCode: "SHOULDER-2026",
        label: "Shoulder 2026",
        validFrom: "2026-05-01",
        validTo: "2026-09-30",
      },
    });
    const shoulderId = shoulder.json().season.id as string;

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG21-LODGE",
        legalName: "PG21 Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    const supplierId = supplier.json().supplier.id as string;

    const rateA = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "WIDE-A",
        rateName: "Wide A",
        rateType: "per_room_per_night",
        amount: 100,
        currency: "USD",
        validFrom: "2026-06-01",
        validTo: "2026-08-31",
        seasonId: highId,
        status: "active",
      },
    });
    const rateB = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "WIDE-B",
        rateName: "Wide B",
        rateType: "per_room_per_night",
        amount: 110,
        currency: "USD",
        validFrom: "2026-06-01",
        validTo: "2026-08-15",
        seasonId: highId,
        status: "active",
      },
    });
    expect(rateA.statusCode).toBe(201);
    expect(rateB.statusCode).toBe(201);
    const rateAId = rateA.json().rate.id as string;
    const rateBId = rateB.json().rate.id as string;

    await app.inject({
      method: "PATCH",
      url: `/v1/suppliers/seasons/${highId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { validFrom: "2026-07-01", validTo: "2026-07-31" },
    });

    const moved = await app.inject({
      method: "POST",
      url: `/v1/suppliers/seasons/${highId}/reassign-outside-rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: { mode: "move", targetSeasonId: shoulderId, rateIds: [rateAId] },
    });
    expect(moved.statusCode).toBe(200);
    expect(moved.json().increment).toBe("PG.21");
    expect(moved.json().updatedCount).toBe(1);
    expect(moved.json().updated[0].action).toBe("moved");
    expect(store.supRates.find((r) => r.id === rateAId)?.seasonId).toBe(shoulderId);

    const cleared = await app.inject({
      method: "POST",
      url: `/v1/suppliers/seasons/${highId}/reassign-outside-rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: { mode: "clear" },
    });
    expect(cleared.statusCode).toBe(200);
    expect(cleared.json().updatedCount).toBe(1);
    expect(cleared.json().updated[0].id).toBe(rateBId);
    expect(store.supRates.find((r) => r.id === rateBId)?.seasonId).toBeUndefined();
    expect(cleared.json().remainingImpact.outsideCount).toBe(0);

    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.21");
  });
});
