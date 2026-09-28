import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { replaceOrganizationTypesFromDurable, seedCrmCatalogues } from "../src/crm/collections.js";

describe("H-112 durable CRM organization-type identity", () => {
  it("replaces process-local catalogue IDs with durable PostgreSQL IDs", () => {
    const store = seedStore("h112-org-types", TEST_BOOTSTRAP_SECRETS);
    const tenantId = [...store.tenants.values()][0]!.id;
    seedCrmCatalogues(store, tenantId);
    const seeded = store.crmOrganizationTypes.find((row) => row.tenantId === tenantId && row.key === "corporate");
    expect(seeded).toBeDefined();
    const durableId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    replaceOrganizationTypesFromDurable(store, [
      {
        id: durableId,
        tenantId,
        key: "corporate",
        label: "Corporate",
        active: true,
      },
    ]);
    const adopted = store.crmOrganizationTypes.find((row) => row.tenantId === tenantId && row.key === "corporate");
    expect(adopted?.id).toBe(durableId);
    expect(adopted?.id).not.toBe(seeded?.id);
  });
});
