import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createInMemoryDevTransport,
  createNatsJetStreamTransportStub,
  type EventTransport,
} from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { validateDeploymentConfig } from "./deployment-config.js";
import { hydrateCrmFromPostgres } from "./persistence/crm.js";
import {
  shouldApplyStartupMigrations,
  shouldSyncStoreToPostgresOnStartup,
} from "./persistence/startup-migrations.js";
import { shouldDrainOutboxOnStartup } from "./persistence/startup-outbox.js";
import type { DbPool } from "@sedmc/db";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function recordingPool() {
  const sql: string[] = [];
  const query = (async (text: string) => {
    sql.push(String(text));
    return { rows: [], rowCount: 0 };
  }) as DbPool["query"];
  return {
    sql,
    pool: {
      query,
      connect: async () => ({ query, release() {} }),
    } as unknown as DbPool,
  };
}

function healthyNats(): EventTransport {
  return {
    kind: "nats-jetstream",
    publish() {},
    health() {
      return { ok: true, detail: "nats://127.0.0.1:4222" };
    },
  };
}

describe("H-188 Production/UAT startup outbox drain", () => {
  it("keeps H-187 migrate and store-sync skipped in production and uat", () => {
    const url = "postgres://eos@127.0.0.1:5432/eos_h188";
    expect(shouldApplyStartupMigrations(url, { EOS_ENV: "production" }).apply).toBe(false);
    expect(shouldApplyStartupMigrations(url, { EOS_ENV: "uat" }).apply).toBe(false);
    expect(shouldSyncStoreToPostgresOnStartup({ EOS_ENV: "production" }).apply).toBe(false);
    expect(shouldSyncStoreToPostgresOnStartup({ EOS_ENV: "uat" }).apply).toBe(false);
  });

  it("forbids demo seed in Production-like deployment validation", () => {
    const result = validateDeploymentConfig({ EOS_ENV: "production", EOS_SEED_DEMO: "true" });
    expect(result.fatal.some((f) => f.includes("EOS_SEED_DEMO"))).toBe(true);
  });

  it("does not drain Production/UAT through in-memory or uninitialized transport", () => {
    const store = seedStore("h188-mem", TEST_BOOTSTRAP_SECRETS);
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "production" })).toEqual({
      apply: false,
      reason: "production_like_transport_not_ready",
    });
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "uat" })).toEqual({
      apply: false,
      reason: "production_like_transport_not_ready",
    });
    store.eventTransport = createInMemoryDevTransport(store.publishedBus);
    store.eventTransportKind = "in-memory-dev";
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "production" })).toEqual({
      apply: false,
      reason: "production_like_in_memory_forbidden",
    });
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "uat" })).toEqual({
      apply: false,
      reason: "production_like_in_memory_forbidden",
    });
  });

  it("does not drain Production/UAT through the NATS stub", () => {
    const store = seedStore("h188-stub", TEST_BOOTSTRAP_SECRETS);
    store.eventTransportKind = "nats-jetstream";
    store.eventTransport = createNatsJetStreamTransportStub();
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "production" })).toEqual({
      apply: false,
      reason: "production_like_transport_unhealthy",
    });
  });

  it("permits Production/UAT drain only through a healthy NATS transport", () => {
    const store = seedStore("h188-nats", TEST_BOOTSTRAP_SECRETS);
    store.eventTransportKind = "nats-jetstream";
    store.eventTransport = healthyNats();
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "production" })).toEqual({
      apply: true,
      transportKind: "nats-jetstream",
    });
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "uat" })).toEqual({
      apply: true,
      transportKind: "nats-jetstream",
    });
  });

  it("keeps Dev/Test in-memory drain after transport init", () => {
    const store = seedStore("h188-dev", TEST_BOOTSTRAP_SECRETS);
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "development", NODE_ENV: "test" })).toEqual({
      apply: false,
      reason: "event_transport_not_initialized",
    });
    store.eventTransport = createInMemoryDevTransport(store.publishedBus);
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "development", NODE_ENV: "test" })).toEqual({
      apply: true,
      transportKind: "in-memory-dev",
    });
  });

  it("does not persist CRM catalogues when H-187 store sync is skipped", async () => {
    const store = seedStore("h188-crm", TEST_BOOTSTRAP_SECRETS);
    const recorded = recordingPool();
    await hydrateCrmFromPostgres(recorded.pool, store, { persistCatalogues: false });
    const joined = recorded.sql.join("\n").toLowerCase();
    expect(joined).not.toContain("insert into crm_organization_types");
  });

  it("main.ts drains outbox only after transport init and before consumers", () => {
    const source = readFileSync(join(root, "src/main.ts"), "utf8");
    expect(source).toContain("shouldDrainOutboxOnStartup(store)");
    expect(source).toContain("outbox_startup_drain_skipped");
    const transportIdx = source.indexOf("await initEventTransport(store, logger)");
    const drainDecisionIdx = source.indexOf("shouldDrainOutboxOnStartup(store)");
    const drainCallIdx = source.indexOf("const drain = publishPendingOutbox(store)");
    const consumersIdx = source.indexOf("await initEventConsumers(store, logger)");
    expect(transportIdx).toBeGreaterThan(-1);
    expect(drainDecisionIdx).toBeGreaterThan(transportIdx);
    expect(drainCallIdx).toBeGreaterThan(drainDecisionIdx);
    expect(consumersIdx).toBeGreaterThan(drainCallIdx);
    expect(source.split("const drain = publishPendingOutbox(store)").length).toBe(2);
    expect(source).toContain('boundedStartup.mode !== "bounded"');
    expect(source.slice(drainDecisionIdx, consumersIdx)).toMatch(/if \(drainDecision\.apply\)/);
  });
});
