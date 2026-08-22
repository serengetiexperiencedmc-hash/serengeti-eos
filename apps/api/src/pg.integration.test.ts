import { checkDatabaseHealth, createPool, migrate } from "@sedmc/db";
import { afterAll, describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import {
  assertTenantIsolation,
  countAuditEvents,
  insertAuditEvent,
  revokeSessionDb,
  withTransaction,
} from "../src/persistence/pg-repository.js";
import { syncStoreToPostgres } from "../src/persistence/sync.js";
import { buildServer } from "../src/server.js";
import { chainAudit } from "@sedmc/kernel";

const url = process.env.EOS_DATABASE_URL;
const enabled = process.env.EOS_RUN_PG_TESTS === "1" && Boolean(url);
const describePg = enabled ? describe : describe.skip;

describePg("I1 PostgreSQL persistence", () => {
  const pool = createPool(url!);

  afterAll(async () => {
    await pool.end();
  });

  it("migrates, syncs store, persists audit and enforces session revoke", async () => {
    const migrated = await migrate(pool);
    expect(migrated).toBeTruthy();
    const health = await checkDatabaseHealth(pool);
    expect(health.ok).toBe(true);

    const store = seedStore("pg-test-secret", TEST_BOOTSTRAP_SECRETS);
    await syncStoreToPostgres(pool, store);

    const tenantId = "11111111-1111-4111-8111-111111111111";
    const before = await countAuditEvents(pool, tenantId);

    const event = chainAudit({
      tenantId,
      occurredAt: new Date().toISOString(),
      actorType: "Human",
      actorPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      action: "org:write:location",
      resourceType: "location",
      resourceId: "loc-test",
      correlationId: crypto.randomUUID(),
      authorization: "allow",
      newState: { code: "TST" },
    });
    await insertAuditEvent(pool, event);
    const after = await countAuditEvents(pool, tenantId);
    expect(after).toBeGreaterThan(before);

    await expect(
      withTransaction(pool, async (client) => {
        await client.query("SELECT 1");
        throw new Error("force_rollback");
      }),
    ).rejects.toThrow("force_rollback");

    const app = buildServer({
      store,
      dbHealth: () => checkDatabaseHealth(pool),
    });
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
    await syncStoreToPostgres(pool, store);
    const session = store.sessions[0]!;
    const revoked = await revokeSessionDb(pool, session.id, session.tenantId);
    expect(revoked).toBe(true);

    const isolation = await assertTenantIsolation(
      pool,
      "11111111-1111-4111-8111-111111111111",
      "22222222-2222-4222-8222-222222222222",
    );
    expect(isolation.ok).toBe(true);

    const ready = await app.inject({ method: "GET", url: "/ready" });
    expect(ready.statusCode).toBe(200);
    expect(ready.json().database.ok).toBe(true);
    expect(ready.json().productionReady).toBe(false);
  });

  it("rejects UPDATE on audit_events (immutability)", async () => {
    await migrate(pool);
    await expect(
      pool.query(`UPDATE audit_events SET action = 'tampered' WHERE true`),
    ).rejects.toThrow(/insert-only|audit_events/i);
  });
});
