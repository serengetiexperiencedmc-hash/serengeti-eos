import { checkDatabaseHealth, createPool, listMigrationFiles, migrate } from "@sedmc/db";
import { afterAll, describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { syncStoreToPostgres } from "../src/persistence/sync.js";
import { buildServer } from "../src/server.js";

const url = process.env.EOS_DATABASE_URL;
const enabled = process.env.EOS_RUN_PG_TESTS === "1" && Boolean(url);
const describePg = enabled ? describe : describe.skip;

describe("C1.11 CRM integration (static)", () => {
  it("lists CRM migration sequence through 013", () => {
    const files = listMigrationFiles();
    for (const fragment of ["004_c1", "005_c1", "006_c1", "007_c1", "008_c1", "009_c1", "010_c1", "011_c1", "012_c1", "013_c1"]) {
      expect(files.some((f) => f.includes(fragment))).toBe(true);
    }
  });
});

describePg("C1.11 CRM PostgreSQL integration", () => {
  const pool = createPool(url!);

  afterAll(async () => {
    await pool.end();
  });

  it("applies migrations 004–013 and validates CRM schema objects", async () => {
    const migrated = await migrate(pool);
    expect(migrated).toBeTruthy();

    const files = listMigrationFiles();
    expect(files.some((f) => f.includes("004_c1_crm"))).toBe(true);
    expect(files.some((f) => f.includes("013_c1_hardening"))).toBe(true);

    const tables = await pool.query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'crm_%' ORDER BY tablename`,
    );
    const names = tables.rows.map((r) => r.tablename);
    expect(names).toContain("crm_organizations");
    expect(names).toContain("crm_contacts");
    expect(names).toContain("crm_merge_records");
    expect(names).toContain("crm_external_identifiers");
    expect(names).toContain("crm_duplicate_candidates");

    const registry = await pool.query<{ phase: number; status: string }>(
      `SELECT phase, status FROM schema_registry WHERE context_key = 'crm'`,
    );
    expect(registry.rows[0]?.phase).toBe(11);
    expect(registry.rows[0]?.status).toBe("active");

    const fkSample = await pool.query(
      `SELECT conname FROM pg_constraint WHERE conrelid = 'crm_organizations'::regclass AND contype = 'f'`,
    );
    expect(fkSample.rows.length).toBeGreaterThan(0);

    await expect(
      pool.query(
        `INSERT INTO crm_organizations (id, tenant_id, legal_name, organization_type_id, status, classification)
         VALUES ('11111111-1111-4111-8111-111111111111', '00000000-0000-4000-8000-000000000000', 'FK Test', '00000000-0000-4000-8000-000000000001', 'Prospect', 'Internal')`,
      ),
    ).rejects.toThrow();
  });

  it("runs API against live database health while CRM runtime remains in-memory", async () => {
    await migrate(pool);
    const health = await checkDatabaseHealth(pool);
    expect(health.ok).toBe(true);

    const store = seedStore("crm-pg-test", TEST_BOOTSTRAP_SECRETS);
    await syncStoreToPostgres(pool, store);
    const app = buildServer({ store, dbHealth: () => checkDatabaseHealth(pool) });

    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "carol.admin@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.carolPassword,
        tenantSlug: "sedmc",
      },
    });
    expect(login.statusCode).toBe(200);
    const token = login.json().accessToken as string;

    const types = await app.inject({
      method: "GET",
      url: "/v1/crm/organization-types",
      headers: { authorization: `Bearer ${token}` },
    });
    const typeId = types.json().items[0].id as string;

    const created = await app.inject({
      method: "POST",
      url: "/v1/crm/organizations",
      headers: { authorization: `Bearer ${token}` },
      payload: { legalName: "PG CRM Org Ltd", organizationTypeId: typeId },
    });
    expect(created.statusCode).toBe(201);

    const orgId = created.json().organization.id as string;
    const fetched = await app.inject({
      method: "GET",
      url: `/v1/crm/organizations/${orgId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(fetched.statusCode).toBe(200);
    expect(fetched.json().organization.legalName).toBe("PG CRM Org Ltd");

    const pgCount = await pool.query<{ count: string }>(
      `SELECT count(*)::text AS count FROM crm_organizations WHERE id = $1`,
      [orgId],
    );
    expect(Number(pgCount.rows[0]?.count ?? 0)).toBe(0);
  });
});
