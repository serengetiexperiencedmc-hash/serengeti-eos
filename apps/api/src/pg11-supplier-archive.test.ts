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

describe("PG.11 supplier archive cascade", () => {
  it("archives supplier and cascades to contacts, rates, and content blocks", async () => {
    const store = seedStore("pg11-archive", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG11-LODGE",
        legalName: "PG11 Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/contacts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { contactRole: "reservations", givenName: "Asha", familyName: "Kim" },
    });
    await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "STD",
        rateName: "Standard",
        rateType: "per_room_per_night",
        amount: 100,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
      },
    });
    await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/content-blocks`,
      headers: { authorization: `Bearer ${token}` },
      payload: { blockCode: "DESC", blockType: "description", body: "Hello" },
    });

    const archived = await app.inject({
      method: "DELETE",
      url: `/v1/suppliers/${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archived.statusCode).toBe(200);
    expect(archived.json().cascaded).toEqual({ contacts: 1, rates: 1, contentBlocks: 1 });
    expect(store.supSuppliers.find((s) => s.id === supplierId)?.archivedAt).toBeTruthy();
    expect(store.supContacts.every((c) => c.supplierId !== supplierId || c.archivedAt)).toBe(true);
    expect(store.supRates.every((r) => r.supplierId !== supplierId || r.archivedAt)).toBe(true);
    expect(store.supContentBlocks.every((b) => b.supplierId !== supplierId || b.archivedAt)).toBe(true);

    const recreate = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG11-LODGE",
        legalName: "PG11 Lodge Reborn",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(recreate.statusCode).toBe(201);

    const list = await app.inject({
      method: "GET",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(list.json().items.some((s: { id: string }) => s.id === supplierId)).toBe(false);
  });

  it("reports PG.11 on supplier health", async () => {
    const store = seedStore("pg11-health", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.12");
    expect(health.json()).toHaveProperty("archivedSuppliers");
  });
});
