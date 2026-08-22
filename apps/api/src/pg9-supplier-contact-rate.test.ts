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

describe("PG.9 supplier contact and rate CRUD", () => {
  it("creates, updates, and archives contacts and rates", async () => {
    const store = seedStore("pg9-crud", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG9-LODGE",
        legalName: "PG9 Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    const contact = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/contacts`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        contactRole: "reservations",
        givenName: "Amina",
        familyName: "Mwangi",
        email: "amina@pg9.example",
        isPrimary: true,
      },
    });
    expect(contact.statusCode).toBe(201);
    expect(contact.json().contact.givenName).toBe("Amina");
    const contactId = contact.json().contact.id as string;

    const contactPatched = await app.inject({
      method: "PATCH",
      url: `/v1/suppliers/${supplierId}/contacts/${contactId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { telephone: "+255700000001" },
    });
    expect(contactPatched.statusCode).toBe(200);
    expect(contactPatched.json().contact.telephone).toBe("+255700000001");
    expect(contactPatched.json().contact.version).toBe(2);

    const rate = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/rates`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        rateCode: "STD-DBL",
        rateName: "Standard Double",
        rateType: "per_room_per_night",
        amount: 220,
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        status: "active",
      },
    });
    expect(rate.statusCode).toBe(201);
    expect(rate.json().rate.amount).toBe(220);
    const rateId = rate.json().rate.id as string;

    const ratePatched = await app.inject({
      method: "PATCH",
      url: `/v1/suppliers/${supplierId}/rates/${rateId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { amount: 240 },
    });
    expect(ratePatched.statusCode).toBe(200);
    expect(ratePatched.json().rate.amount).toBe(240);

    const archivedContact = await app.inject({
      method: "DELETE",
      url: `/v1/suppliers/${supplierId}/contacts/${contactId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archivedContact.statusCode).toBe(200);
    expect(store.supContacts.find((c) => c.id === contactId)?.archivedAt).toBeTruthy();

    const archivedRate = await app.inject({
      method: "DELETE",
      url: `/v1/suppliers/${supplierId}/rates/${rateId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archivedRate.statusCode).toBe(200);
    expect(store.supRates.find((r) => r.id === rateId)?.archivedAt).toBeTruthy();

    const detail = await app.inject({
      method: "GET",
      url: `/v1/suppliers/${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(detail.json().contacts).toHaveLength(0);
    expect(detail.json().rates).toHaveLength(0);
  });

  it("reports PG.10 on supplier health after contact/rate CRUD", async () => {
    const store = seedStore("pg9-health", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.19");
  });
});

