import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { commitWithOutbox, publishPendingOutbox } from "../src/outbox.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { allPrincipals } from "../src/store.js";
import {
  countPendingOutboxEvents,
  insertOutboxEvent,
} from "../src/persistence/pg-repository.js";
import { checkDatabaseHealth, createPool, migrate } from "@sedmc/db";

const url = process.env.EOS_DATABASE_URL;
const enabled = process.env.EOS_RUN_PG_TESTS === "1" && Boolean(url);
const describePg = enabled ? describe : describe.skip;

describePg("PG.2 I4 outbox persistence", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";

  it("lists PG.2 migration", async () => {
    expect(listMigrationFiles().some((f) => f.includes("035_pg2_outbox"))).toBe(true);
    await migrate(pool);
    expect((await checkDatabaseHealth(pool)).ok).toBe(true);
  });

  it("inserts outbox on commit and updates on publish", async () => {
    await migrate(pool);
    const store = seedStore("pg-i4-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    store.eventCatalogue.push({
      eventType: "test.pg2.event",
      owner: "platform",
      purpose: "PG.2 test",
      schemaVersion: 1,
      classification: "Internal",
      producer: "platform",
      consumers: [],
      retentionDays: 30,
      compatibility: "backward",
      lifecycle: "active",
      requiredFields: [{ name: "msg", type: "string" }],
    });

    const principal = allPrincipals(store).find((p) => p.id === "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee")!;
    const before = await countPendingOutboxEvents(pool, tenantId);

    const result = commitWithOutbox(store, principal, {
      eventType: "test.pg2.event",
      payload: { msg: "pg2" },
      classification: "Internal",
      correlationId: crypto.randomUUID(),
      mutate: () => {},
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    await insertOutboxEvent(pool, result.outbox);
    const afterInsert = await countPendingOutboxEvents(pool, tenantId);
    expect(afterInsert).toBeGreaterThan(before);

    publishPendingOutbox(store);
    expect(result.outbox.status).toBe("published");
  });
});
