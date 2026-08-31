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

describe("PG.22 season expand backfill", () => {
  it("suggests and links unlinked rates that fit expanded season bounds", async () => {
    const store = seedStore("pg22-backfill", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const season = await app.inject({
      method: "POST",
      url: "/v1/suppliers/seasons",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        seasonCode: "HIGH-2026",
        label: "High 2026",
        validFrom: "2026-07-01",
        validTo: "2026-07-31",
      },
    });
    const seasonId = season.json().season.id as string;

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG22-LODGE",
        legalName: "PG22 Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    const supplierId = supplier.json().supplier.id as string;

    const unlinked = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "ORPHAN",
        rateName: "Orphan rate",
        rateType: "per_room_per_night",
        amount: 90,
        currency: "USD",
        validFrom: "2026-06-15",
        validTo: "2026-08-15",
        status: "active",
      },
    });
    expect(unlinked.statusCode).toBe(201);
    const rateId = unlinked.json().rate.id as string;
    expect(unlinked.json().rate.seasonId).toBeUndefined();

    const beforeExpand = await app.inject({
      method: "POST",
      url: `/v1/suppliers/seasons/${seasonId}/expand-backfill-preview`,
      headers: { authorization: `Bearer ${token}` },
      payload: {},
    });
    expect(beforeExpand.statusCode).toBe(200);
    expect(beforeExpand.json().expandBackfill.suggestionCount).toBe(0);

    const preview = await app.inject({
      method: "POST",
      url: `/v1/suppliers/seasons/${seasonId}/expand-backfill-preview`,
      headers: { authorization: `Bearer ${token}` },
      payload: { validFrom: "2026-06-01", validTo: "2026-08-31" },
    });
    expect(preview.statusCode).toBe(200);
    expect(preview.json().increment).toBe("PG.22");
    expect(preview.json().expandBackfill.suggestionCount).toBe(1);
    expect(preview.json().expandBackfill.hint).toBe("season_expand_backfill_available");
    expect(preview.json().expandBackfill.suggestions[0].id).toBe(rateId);

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/suppliers/seasons/${seasonId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { validFrom: "2026-06-01", validTo: "2026-08-31" },
    });
    expect(patched.json().expandBackfill.suggestionCount).toBe(1);

    const backfilled = await app.inject({
      method: "POST",
      url: `/v1/suppliers/seasons/${seasonId}/backfill-rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {},
    });
    expect(backfilled.statusCode).toBe(200);
    expect(backfilled.json().linkedCount).toBe(1);
    expect(store.supRates.find((r) => r.id === rateId)?.seasonId).toBe(seasonId);
    expect(backfilled.json().expandBackfill.suggestionCount).toBe(0);

    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.21");
  });
});
