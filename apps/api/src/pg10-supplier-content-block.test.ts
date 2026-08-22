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

describe("PG.10 supplier content-block CRUD", () => {
  it("creates, updates, and archives content blocks", async () => {
    const store = seedStore("pg10-crud", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const supplier = await app.inject({
      method: "POST",
      url: "/v1/suppliers",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        supplierCode: "PG10-LODGE",
        legalName: "PG10 Lodge",
        category: "accommodation",
        country: "TZ",
      },
    });
    expect(supplier.statusCode).toBe(201);
    const supplierId = supplier.json().supplier.id as string;

    const created = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/content-blocks`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        blockCode: "DESC-EN",
        blockType: "description",
        title: "About the lodge",
        body: "A riverside lodge on the Mara.",
        status: "draft",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().contentBlock.blockCode).toBe("DESC-EN");
    const blockId = created.json().contentBlock.id as string;

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/suppliers/${supplierId}/content-blocks/${blockId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: "reviewed", body: "Updated riverside lodge copy." },
    });
    expect(patched.statusCode).toBe(200);
    expect(patched.json().contentBlock.status).toBe("reviewed");
    expect(patched.json().contentBlock.version).toBe(2);

    const conflict = await app.inject({
      method: "POST",
      url: `/v1/suppliers/${supplierId}/content-blocks`,
      headers: { authorization: `Bearer ${token}` },
      payload: {
        blockCode: "DESC-EN",
        blockType: "description",
        body: "Duplicate code",
      },
    });
    expect(conflict.statusCode).toBe(409);

    const archived = await app.inject({
      method: "DELETE",
      url: `/v1/suppliers/${supplierId}/content-blocks/${blockId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(archived.statusCode).toBe(200);
    expect(store.supContentBlocks.find((b) => b.id === blockId)?.archivedAt).toBeTruthy();

    const detail = await app.inject({
      method: "GET",
      url: `/v1/suppliers/${supplierId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(detail.json().contentBlocks).toHaveLength(0);
  });

  it("reports PG.10 on supplier health", async () => {
    const store = seedStore("pg10-health", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const health = await app.inject({
      method: "GET",
      url: "/v1/suppliers/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("PG.13");
    expect(health.json()).toHaveProperty("contentBlocks");
  });
});
