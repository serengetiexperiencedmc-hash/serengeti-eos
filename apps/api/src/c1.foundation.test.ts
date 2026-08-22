import { describe, expect, it } from "vitest";
import { DEFAULT_CRM_ORGANIZATION_TYPE_KEYS } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { ensureCrmCollections, getCrmModuleHealth } from "../src/crm/index.js";

describe("C1.1 CRM database/domain foundation", () => {
  it("initializes in-memory CRM collections and seeds catalogues", () => {
    const store = seedStore("test-secret");
    ensureCrmCollections(store);
    expect(store.crmOrganizations).toEqual([]);
    expect(store.crmOrganizationTypes.length).toBe(DEFAULT_CRM_ORGANIZATION_TYPE_KEYS.length);
    expect(store.crmRelationshipTypes.length).toBeGreaterThan(0);
    const health = getCrmModuleHealth(store);
    expect(health.productionReady).toBe(false);
    expect(health.entities.organizationTypes).toBe(DEFAULT_CRM_ORGANIZATION_TYPE_KEYS.length);
  });

  it("exposes CRM health and organization types via API with auth", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "carol.admin@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.carolPassword,
        tenantSlug: "sedmc",
      },
    });
    const token = login.json().accessToken;

    const health = await app.inject({
      method: "GET",
      url: "/v1/crm/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().module).toBe("crm");

    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(types.statusCode).toBe(200);
    expect(types.json().items.some((t: { key: string }) => t.key === "mice_agency")).toBe(true);
  });

  it("denies CRM catalogue read without permission", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "alice.finance@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.alicePassword,
        tenantSlug: "sedmc",
      },
    });
    const token = login.json().accessToken;
    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(types.statusCode).toBe(403);
  });
});
