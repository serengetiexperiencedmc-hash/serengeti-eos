import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { DbPool } from "@sedmc/db";
import { seedStore } from "../src/app.js";
import {
  decideF2Dp01BoundedDevtestApiStartup,
  F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV,
  F2_DP01_BOUNDED_DEVTEST_API_STARTUP_NAME,
  runF2Dp01BoundedDevtestApiStartup,
} from "../src/commercial-facts/bounded-startup.js";
import { f2FactsMemory } from "../src/commercial-facts/memory.js";
import { shouldApplyStartupMigrations } from "../src/persistence/startup-migrations.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_URL = "postgres://eos:test-secret-do-not-print@127.0.0.1:5432/eos";
const DEVTEST_ENV = { EOS_ENV: "development", NODE_ENV: "test" };
const OPT_IN = { [F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV]: "true" };

function env(extra: NodeJS.Dict<string> = {}) {
  return { ...DEVTEST_ENV, ...OPT_IN, ...extra };
}

function recordingPool(connectionString = APPROVED_URL) {
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
      options: { connectionString },
    } as unknown as DbPool,
  };
}

describe("F2-DP-01-BOUNDED-DEVTEST-API-STARTUP decision", () => {
  it("enters bounded mode for explicit opt-in and exact authorized target", () => {
    const decision = decideF2Dp01BoundedDevtestApiStartup({
      databaseUrl: APPROVED_URL,
      env: env(),
    });
    expect(decision).toEqual({
      mode: "bounded",
      redactedTarget: "postgres://127.0.0.1:5432/eos",
    });
    expect(JSON.stringify(decision)).not.toMatch(/test-secret-do-not-print/);
    expect(F2_DP01_BOUNDED_DEVTEST_API_STARTUP_NAME).toBe("F2-DP-01-BOUNDED-DEVTEST-API-STARTUP");
  });

  it("does not enter bounded mode when opt-in is missing", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: APPROVED_URL,
        env: DEVTEST_ENV,
      }),
    ).toEqual({ mode: "default" });
  });

  it("does not enter bounded mode when opt-in is explicitly off", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: APPROVED_URL,
        env: { ...DEVTEST_ENV, [F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV]: "false" },
      }),
    ).toEqual({ mode: "default" });
  });

  it("refuses wrong host instead of falling through to default", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: "postgres://eos:x@localhost:5432/eos",
        env: env(),
      }).mode,
    ).toBe("refuse");
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: "postgres://eos:x@localhost:5432/eos",
        env: env(),
      }),
    ).toMatchObject({ mode: "refuse", reason: "not_approved_devtest_target" });
  });

  it("refuses wrong port instead of falling through to default", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: "postgres://eos:x@127.0.0.1:5434/eos",
        env: env(),
      }),
    ).toMatchObject({ mode: "refuse", reason: "not_approved_devtest_target" });
  });

  it("refuses wrong database instead of falling through to default", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: "postgres://eos:x@127.0.0.1:5432/eos_other",
        env: env(),
      }),
    ).toMatchObject({ mode: "refuse", reason: "not_approved_devtest_target" });
  });

  it("refuses production-like environment", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: APPROVED_URL,
        env: env({ EOS_ENV: "production" }),
      }),
    ).toMatchObject({ mode: "refuse", reason: "production_like_not_authorized" });
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: APPROVED_URL,
        env: env({ NODE_ENV: "production" }),
      }),
    ).toMatchObject({ mode: "refuse", reason: "production_like_not_authorized" });
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: APPROVED_URL,
        env: env({ EOS_ENV: "uat" }),
      }),
    ).toMatchObject({ mode: "refuse", reason: "production_like_not_authorized" });
  });

  it("refuses Gate B / eos_gateb", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: "postgres://eos:x@127.0.0.1:5434/eos_gateb",
        env: env(),
      }),
    ).toMatchObject({ mode: "refuse", reason: "eos_gateb_not_authorized" });
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: "postgres://eos:x@127.0.0.1:5432/eos_gateb",
        env: env(),
      }),
    ).toMatchObject({ mode: "refuse", reason: "eos_gateb_not_authorized" });
  });

  it("refuses stand-in database and missing/unparseable URL", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: "postgres://127.0.0.1/eos_devtest_f2_dp01",
        env: env(),
      }),
    ).toMatchObject({ mode: "refuse", reason: "stand_in_not_authorized" });
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: undefined,
        env: env(),
      }),
    ).toMatchObject({ mode: "refuse", reason: "unidentified_target" });
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: "not-a-url",
        env: env(),
      }),
    ).toMatchObject({ mode: "refuse", reason: "unidentified_target" });
  });

  it("refuses ambiguous opt-in instead of defaulting to the broad path", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: APPROVED_URL,
        env: { ...DEVTEST_ENV, [F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV]: "yes" },
      }),
    ).toMatchObject({ mode: "refuse", reason: "opt_in_ambiguous" });
  });
});

describe("F2-DP-01-BOUNDED-DEVTEST-API-STARTUP control flow", () => {
  it("bounded runner hydrates F2 maps and does not emit mixed or schema-history SQL", async () => {
    const store = seedStore("h94-bounded-startup");
    const recorded = recordingPool();
    const result = await runF2Dp01BoundedDevtestApiStartup({ store, pool: recorded.pool });
    expect(store.dbPool).toBe(recorded.pool);
    expect(store.f2Dp01BoundedSidecarOnly).toBe(true);
    expect(result).toEqual({
      opportunities: 0,
      rfps: 0,
      pathB: 0,
      accounts: 0,
      rates: 0,
      programmes: 0,
    });
    expect(f2FactsMemory(store).opportunities.size).toBe(0);
    const joined = recorded.sql.join("\n").toLowerCase();
    expect(recorded.sql.some((text) => /from\s+f2_opportunity_facts/i.test(text))).toBe(true);
    expect(recorded.sql.some((text) => /from\s+f2_rfp_facts/i.test(text))).toBe(true);
    expect(recorded.sql.some((text) => /from\s+f2_path_b/i.test(text))).toBe(true);
    expect(recorded.sql.some((text) => /from\s+f2_account_facts/i.test(text))).toBe(true);
    expect(recorded.sql.some((text) => /from\s+f2_rate_identities/i.test(text))).toBe(true);
    expect(recorded.sql.some((text) => /from\s+f2_programme_facts/i.test(text))).toBe(true);
    expect(joined).not.toContain("schema_migrations");
    expect(joined).not.toContain("insert into tenants");
    expect(joined).not.toMatch(/create table/i);
  });

  it("default startup migrate refuses 124-only eos and still skips Gate B / Production", () => {
    expect(shouldApplyStartupMigrations("postgres://eos@127.0.0.1:5432/eos", DEVTEST_ENV)).toEqual({
      apply: false,
      reason: "h111_eos_124_only_preserved",
    });
    expect(shouldApplyStartupMigrations("postgres://eos_gateb:x@127.0.0.1:5434/eos_gateb")).toEqual({
      apply: false,
      reason: "gate_b_already_provisioned",
    });
    expect(
      shouldApplyStartupMigrations("postgres://eos@127.0.0.1:5432/eos", { EOS_ENV: "production" }),
    ).toEqual({ apply: false, reason: "production_gate_c_not_authorized" });
  });

  it("bounded helper source does not import the global migration runner or mixed startup hydrates", () => {
    const source = readFileSync(join(root, "src/commercial-facts/bounded-startup.ts"), "utf8");
    expect(source).toContain("hydrateF2CommercialFacts");
    expect(source).not.toContain("listMigrationFiles");
    expect(source).not.toContain("shouldApplyStartupMigrations");
    expect(source).not.toContain("syncStoreToPostgres");
    expect(source).not.toContain("hydrateCrmFromPostgres");
    expect(source).not.toContain("hydratePendingOutbox");
    expect(source).not.toContain("hydrateSupFromPostgres");
    expect(source).not.toContain("hydrateAiDrafts");
  });

  it("main.ts keeps default database startup isolated from the named bounded branch", () => {
    const source = readFileSync(join(root, "src/main.ts"), "utf8");
    expect(source).toContain("decideF2Dp01BoundedDevtestApiStartup");
    expect(source).toContain("runF2Dp01BoundedDevtestApiStartup");
    expect(source).toContain("shouldApplyStartupMigrations");
    expect(source).toContain("shouldSyncStoreToPostgresOnStartup");
    expect(source).toContain("syncStoreToPostgres");
    expect(source).toContain('if (boundedStartup.mode === "refuse")');
    expect(source).toContain('if (boundedStartup.mode === "bounded")');
    const refuseIdx = source.indexOf('if (boundedStartup.mode === "refuse")');
    const boundedIdx = source.indexOf('if (boundedStartup.mode === "bounded")');
    const defaultMigrateIdx = source.indexOf("shouldApplyStartupMigrations(databaseUrl)");
    expect(refuseIdx).toBeGreaterThan(-1);
    expect(boundedIdx).toBeGreaterThan(refuseIdx);
    expect(defaultMigrateIdx).toBeGreaterThan(boundedIdx);
  });
});

