import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { DbPool } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { validateDeploymentConfig } from "./deployment-config.js";
import { hydrateCrmFromPostgres } from "./persistence/crm.js";
import {
  shouldApplyStartupMigrations,
  shouldSyncStoreToPostgresOnStartup,
} from "./persistence/startup-migrations.js";

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

describe("H-187 Production/UAT startup write safety", () => {
  it("does not apply startup migrations in production or uat", () => {
    const url = "postgres://eos@127.0.0.1:5432/eos_h187";
    expect(shouldApplyStartupMigrations(url, { EOS_ENV: "production" })).toEqual({
      apply: false,
      reason: "production_gate_c_not_authorized",
    });
    expect(shouldApplyStartupMigrations(url, { EOS_ENV: "uat" })).toEqual({
      apply: false,
      reason: "production_gate_c_not_authorized",
    });
    expect(shouldApplyStartupMigrations(url, { NODE_ENV: "production" })).toEqual({
      apply: false,
      reason: "production_gate_c_not_authorized",
    });
  });

  it("does not apply in-memory store sync in production or uat", () => {
    expect(shouldSyncStoreToPostgresOnStartup({ EOS_ENV: "production" })).toEqual({
      apply: false,
      reason: "production_gate_c_not_authorized",
    });
    expect(shouldSyncStoreToPostgresOnStartup({ EOS_ENV: "uat" })).toEqual({
      apply: false,
      reason: "production_gate_c_not_authorized",
    });
    expect(shouldSyncStoreToPostgresOnStartup({ NODE_ENV: "production" })).toEqual({
      apply: false,
      reason: "production_gate_c_not_authorized",
    });
  });

  it("keeps Dev/Test startup migrate and store sync enabled on an isolated catalog", () => {
    const url = "postgres://eos@127.0.0.1:5432/eos_h187";
    const env = { EOS_ENV: "development", NODE_ENV: "test" };
    expect(shouldApplyStartupMigrations(url, env)).toEqual({ apply: true });
    expect(shouldSyncStoreToPostgresOnStartup(env)).toEqual({ apply: true });
  });

  it("keeps deployment validation fail-closed and forbids demo seed in Production-like env", () => {
    const result = validateDeploymentConfig({
      EOS_ENV: "production",
      EOS_SEED_DEMO: "true",
    });
    expect(result.productionLike).toBe(true);
    expect(result.productionReady).toBe(false);
    expect(result.fatal.length).toBeGreaterThan(0);
    expect(result.fatal.some((f) => f.includes("EOS_SEED_DEMO"))).toBe(true);
  });

  it("main.ts gates syncStoreToPostgres on the explicit Production/UAT decision", () => {
    const source = readFileSync(join(root, "src/main.ts"), "utf8");
    expect(source).toContain("shouldApplyStartupMigrations(databaseUrl)");
    expect(source).toContain("shouldSyncStoreToPostgresOnStartup()");
    expect(source).toContain("database_startup_store_sync_skipped");
    expect(source).toContain("demo_seed_forbidden_production_like");
    const migrateIdx = source.indexOf("shouldApplyStartupMigrations(databaseUrl)");
    const syncDecisionIdx = source.indexOf("shouldSyncStoreToPostgresOnStartup()");
    const syncCallIdx = source.indexOf("await syncStoreToPostgres(pool, store)");
    const skippedIdx = source.indexOf("database_startup_store_sync_skipped");
    const seedSyncedIdx = source.indexOf("database_seed_synced");
    expect(migrateIdx).toBeGreaterThan(-1);
    expect(syncDecisionIdx).toBeGreaterThan(migrateIdx);
    expect(syncCallIdx).toBeGreaterThan(syncDecisionIdx);
    expect(skippedIdx).toBeGreaterThan(syncDecisionIdx);
    expect(seedSyncedIdx).toBeGreaterThan(syncCallIdx);
    const syncBlock = source.slice(syncDecisionIdx, seedSyncedIdx + 80);
    expect(syncBlock).toMatch(/if \(storeSyncDecision\.apply\)/);
    expect(syncBlock).toContain("await syncStoreToPostgres(pool, store)");
    expect(source).toContain("persistCatalogues: storeSyncDecision.apply");
  });

  it("skips CRM catalogue upserts when persistCatalogues is false", async () => {
    const store = seedStore("h187-crm-skip", TEST_BOOTSTRAP_SECRETS);
    const recorded = recordingPool();
    await hydrateCrmFromPostgres(recorded.pool, store, { persistCatalogues: false });
    const joined = recorded.sql.join("\n").toLowerCase();
    expect(joined).not.toContain("insert into crm_organization_types");
    expect(joined).not.toContain("insert into crm_relationship_types");
    expect(joined).toMatch(/from\s+crm_organization_types/);
  });

  it("Dev/Test CRM hydrate still persists catalogues by default", async () => {
    const store = seedStore("h187-crm-write", TEST_BOOTSTRAP_SECRETS);
    const recorded = recordingPool();
    await hydrateCrmFromPostgres(recorded.pool, store);
    const joined = recorded.sql.join("\n").toLowerCase();
    expect(joined).toContain("insert into crm_organization_types");
    expect(joined).toContain("insert into crm_relationship_types");
  });
});
