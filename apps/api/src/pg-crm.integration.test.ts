import { checkDatabaseHealth, createPool, migrate } from "@sedmc/db";
import { afterAll, describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { createOrganization } from "../src/crm/organization.js";
import { countCrmOrganizations } from "../src/persistence/pg-repository.js";
import { syncStoreToPostgres } from "../src/persistence/sync.js";
import { allPrincipals } from "../src/store.js";

const url = process.env.EOS_DATABASE_URL;
const enabled = process.env.EOS_RUN_PG_TESTS === "1" && Boolean(url);
const describePg = enabled ? describe : describe.skip;

describePg("PG.3 CRM dual-write", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

  afterAll(async () => {
    await pool.end();
  });

  it("persists organizations when dbPool is set", async () => {
    await migrate(pool);
    expect((await checkDatabaseHealth(pool)).ok).toBe(true);

    const store = seedStore("pg-crm-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;
    const types = store.crmOrganizationTypes.filter((t) => t.tenantId === tenantId);
    expect(types.length).toBeGreaterThan(0);

    const before = await countCrmOrganizations(pool, tenantId);
    const result = createOrganization(
      store,
      principal,
      { legalName: "PG.3 Persistence Org", organizationTypeId: types[0]!.id },
      "pg-crm-test",
    );
    expect("organization" in result).toBe(true);

    await new Promise((r) => setTimeout(r, 50));
    const after = await countCrmOrganizations(pool, tenantId);
    expect(after).toBeGreaterThan(before);
  });
});
