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

describe("PG.12 supplier restore", () => {
  it("restores archived supplier and cascaded children", async () => {
    const store = seedStore("pg12-restore", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG12-CAMP",
        legalName: "PG12 Camp",
        category: "accommodation",
        country: "TZ",
      },
    });
    const supplierId = created.json().supplier.id as string;

    await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/contacts`,
      headers: { authorization: `Bearer ${token}` },
      payload: { contactRole: "reservations", givenName: "Leah", familyName: "N" },
    });
    await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "TENT",
        rateName: "Tent",
        rateType: "per_person_per_night",
        amount: 80,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
      },
    });

    const archived = await app.inject({
      method: "DELETE",
      url: `/v1/suppliers/${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archived.statusCode).toBe(200);

    const archivedList = await app.inject({
      method: "GET",
      url: "/v1/suppliers?archived=1",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archivedList.json().items.some((s: { id: string }) => s.id === supplierId)).toBe(true);

    const restored = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/restore`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(restored.statusCode).toBe(200);
    expect(restored.json().restored).toEqual({ contacts: 1, rates: 1, contentBlocks: 0 });
    expect(store.supSuppliers.find((s) => s.id === supplierId)?.archivedAt).toBeUndefined();
    expect(store.supContacts.find((c) => c.supplierId === supplierId)?.archivedAt).toBeUndefined();
    expect(store.supRates.find((r) => r.supplierId === supplierId)?.archivedAt).toBeUndefined();

    const active = await app.inject({
      method: "GET",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(active.json().items.some((s: { id: string }) => s.id === supplierId)).toBe(true);
  });

  it("rejects restore when supplier code is reused", async () => {
    const store = seedStore("pg12-conflict", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const first = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG12-DUP",
        legalName: "First",
        category: "accommodation",
        country: "TZ",
      },
    });
    const firstId = first.json().supplier.id as string;
    await app.inject({
      method: "DELETE",
      url: `/v1/suppliers/${firstId}`,
      headers: { authorization: `Bearer ${token}` },
    });

    await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG12-DUP",
        legalName: "Second",
        category: "accommodation",
        country: "TZ",
      },
    });

    const conflict = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${firstId}/restore`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(conflict.statusCode).toBe(409);
    expect(conflict.json().reason).toBe("supplier_code_exists");
  });

  it("reports PG.12 on supplier health", async () => {
    const store = seedStore("pg12-health", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.15");
  });
});

