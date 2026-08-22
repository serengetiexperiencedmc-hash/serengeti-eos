import { afterAll, describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { commitWithOutbox, publishPendingOutbox } from "../src/outbox.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { allPrincipals } from "../src/store.js";
import {
  countPendingOutboxEvents,
  countProcessedEvents,
  insertOutboxEvent,
} from "../src/persistence/pg-repository.js";
import { consumeEventIdempotent } from "../src/outbox.js";
import { hydrateProcessedEvents } from "../src/persistence/processed-events.js";
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

describePg("I4.3 processed_events persistence", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";

  afterAll(async () => {
    await pool.end();
  });

  it("lists I4.3 migration", async () => {
    expect(listMigrationFiles().some((f) => f.includes("039_pg_i43"))).toBe(true);
    await migrate(pool);
    expect((await checkDatabaseHealth(pool)).ok).toBe(true);
  });

  it("persists processed_events on idempotent consume and hydrates on startup", async () => {
    await migrate(pool);
    const store = seedStore("pg-i43-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    const principal = allPrincipals(store).find((p) => p.id === "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee")!;

    const before = await countProcessedEvents(pool, tenantId, "platform-observer");
    consumeEventIdempotent(store, principal, {
      event: {
        eventId: crypto.randomUUID(),
        eventType: "platform.ping.v1",
        schemaVersion: 1,
        tenantId,
        producer: "platform",
        occurredAt: new Date().toISOString(),
        correlationId: crypto.randomUUID(),
        classification: "Internal",
        payload: { ping: true },
        eventVersion: 1,
      },
      consumer: "platform-observer",
      handler: () => undefined,
    });

    await new Promise((r) => setTimeout(r, 50));
    const after = await countProcessedEvents(pool, tenantId, "platform-observer");
    expect(after).toBeGreaterThan(before);

    const fresh = seedStore("pg-i43-hydrate", TEST_BOOTSTRAP_SECRETS);
    fresh.processedEvents = [];
    const merged = await hydrateProcessedEvents(pool, fresh);
    expect(merged).toBeGreaterThan(0);
    expect(fresh.processedEvents.some((p) => p.consumer === "platform-observer")).toBe(true);
  });
});
