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

describe("PG.8 supplier CRUD API", () => {
  it("creates and updates a supplier via REST", async () => {
    const store = seedStore("pg8-crud", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "pg8-lodge-01",
        legalName: "PG8 Test Lodge",
        category: "accommodation",
        country: "tz",
        defaultCurrency: "usd",
      },
    });
    expect(created.statusCode).toBe(201);
    const body = created.json();
    expect(body.supplier.supplierCode).toBe("PG8-LODGE-01");
    expect(body.supplier.status).toBe("pending_review");
    expect(body.supplier.country).toBe("TZ");
    expect(body.supplier.defaultCurrency).toBe("USD");
    expect(store.supSuppliers).toHaveLength(1);

    const updated = await app.inject({
      method: "PATCH",
      url: `/v1/suppliers/${body.supplier.id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        legalName: "PG8 Lodge Updated",
        status: "active",
        preferredPartner: true,
      },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().supplier.legalName).toBe("PG8 Lodge Updated");
    expect(updated.json().supplier.status).toBe("active");
    expect(updated.json().supplier.preferredPartner).toBe(true);
    expect(updated.json().supplier.version).toBe(2);

    const duplicate = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG8-LODGE-01",
        legalName: "Dup",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(duplicate.statusCode).toBe(409);
    expect(duplicate.json().reason).toBe("supplier_code_exists");
  });

  it("rejects invalid create payloads", async () => {
    const store = seedStore("pg8-invalid", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const bad = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "x",
        legalName: "Bad",
        category: "not-a-category",
        country: "ZZZ",
      },
    });
    expect(bad.statusCode).toBe(400);
  });

  it("reports PG.8 on supplier health", async () => {
    const store = seedStore("pg8-health", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("PG.13");
  });
});
