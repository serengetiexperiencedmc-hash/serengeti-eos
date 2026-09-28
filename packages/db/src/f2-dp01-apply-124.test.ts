/// <reference types="vitest" />
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as dbIndex from "./index.js";
import {
  F2_DP01_ALLOWED_MIGRATION_BASENAMES,
  F2_DP01_MIGRATION_124_FILENAME,
  applyF2Dp01Migration124,
  authorizedF2Dp01Migration124Path,
  decideF2Dp01Apply124,
  redactDatabaseUrl,
  resolveAuthorizedF2Dp01Migration124,
} from "./f2-dp01-apply-124.js";

const APPROVED_URL = "postgres://eos:supersecret-do-not-leak@127.0.0.1:5432/eos";
const DEVTEST_ENV = { EOS_ENV: "development", NODE_ENV: "test" };

function mockConnectable(recorder: string[]) {
  return {
    connect: async () => ({
      async query(sql: string) {
        recorder.push(sql);
        return { rowCount: 0, rows: [] };
      },
      release() {},
    }),
  };
}

describe("GPTA-H-88 F2-DP-01 124-only apply mechanism (safety only; not live PG)", () => {
  it("TEST A — exact file selection: allowlist is only 124 and default resolve is that file", () => {
    expect(F2_DP01_ALLOWED_MIGRATION_BASENAMES).toEqual([F2_DP01_MIGRATION_124_FILENAME]);
    const resolved = resolveAuthorizedF2Dp01Migration124();
    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      expect(resolved.path).toBe(authorizedF2Dp01Migration124Path());
      expect(resolved.path.endsWith(`migrations/${F2_DP01_MIGRATION_124_FILENAME}`) || resolved.path.endsWith(`migrations\\${F2_DP01_MIGRATION_124_FILENAME}`)).toBe(true);
    }
    const byName = resolveAuthorizedF2Dp01Migration124(F2_DP01_MIGRATION_124_FILENAME);
    expect(byName.ok).toBe(true);
    const decision = decideF2Dp01Apply124({ connectionString: APPROVED_URL, env: DEVTEST_ENV });
    expect(decision.allow).toBe(true);
    if (decision.allow) {
      expect(decision.migrationBasename).toBe(F2_DP01_MIGRATION_124_FILENAME);
      expect(decision.migrationPath).toBe(authorizedF2Dp01Migration124Path());
    }
  });

  it("TEST B — earlier migration rejection (123)", () => {
    const resolved = resolveAuthorizedF2Dp01Migration124("123_cd_rfp_programme_relationship_constraints.sql");
    expect(resolved).toMatchObject({ ok: false, reason: "migration_file_not_authorized", requestedBasename: "123_cd_rfp_programme_relationship_constraints.sql" });
    const decision = decideF2Dp01Apply124({
      connectionString: APPROVED_URL,
      env: DEVTEST_ENV,
      requestedMigrationFile: "123_cd_rfp_programme_relationship_constraints.sql",
    });
    expect(decision.allow).toBe(false);
    if (!decision.allow) expect(decision.reason).toBe("migration_file_not_authorized");
  });

  it("TEST C — schema.sql rejection", () => {
    const resolved = resolveAuthorizedF2Dp01Migration124("schema.sql");
    expect(resolved).toMatchObject({ ok: false, reason: "migration_file_not_authorized", requestedBasename: "schema.sql" });
    const decision = decideF2Dp01Apply124({
      connectionString: APPROVED_URL,
      env: DEVTEST_ENV,
      requestedMigrationFile: "schema.sql",
    });
    expect(decision.allow).toBe(false);
    if (!decision.allow) expect(decision.reason).toBe("migration_file_not_authorized");
  });

  it("TEST D — arbitrary migration rejection", () => {
    const resolved = resolveAuthorizedF2Dp01Migration124("001_i1_admin_shell.sql");
    expect(resolved).toMatchObject({ ok: false, reason: "migration_file_not_authorized", requestedBasename: "001_i1_admin_shell.sql" });
    const decision = decideF2Dp01Apply124({
      connectionString: APPROVED_URL,
      env: DEVTEST_ENV,
      requestedMigrationFile: "122_cd_programme_item_extensions.sql",
    });
    expect(decision.allow).toBe(false);
    if (!decision.allow) expect(decision.reason).toBe("migration_file_not_authorized");
  });

  it("TEST E — production-like target rejection", () => {
    for (const env of [{ EOS_ENV: "production" }, { EOS_ENV: "uat" }, { NODE_ENV: "production" }]) {
      const decision = decideF2Dp01Apply124({ connectionString: APPROVED_URL, env });
      expect(decision.allow).toBe(false);
      if (!decision.allow) expect(decision.reason).toBe("production_like_not_authorized");
    }
  });

  it("TEST F — eos_gateb rejection", () => {
    const decision = decideF2Dp01Apply124({
      connectionString: "postgres://eos:supersecret-do-not-leak@127.0.0.1:5434/eos_gateb",
      env: DEVTEST_ENV,
    });
    expect(decision.allow).toBe(false);
    if (!decision.allow) expect(decision.reason).toBe("eos_gateb_not_authorized");
  });

  it("TEST G — unidentified target rejection", () => {
    expect(decideF2Dp01Apply124({ env: DEVTEST_ENV }).allow).toBe(false);
    const missing = decideF2Dp01Apply124({ env: DEVTEST_ENV });
    if (!missing.allow) expect(missing.reason).toBe("unidentified_target");

    const unparseable = decideF2Dp01Apply124({ connectionString: "not-a-url", env: DEVTEST_ENV });
    expect(unparseable.allow).toBe(false);
    if (!unparseable.allow) expect(unparseable.reason).toBe("unidentified_target");

    const noDatabase = decideF2Dp01Apply124({ connectionString: "postgres://127.0.0.1:5432/", env: DEVTEST_ENV });
    expect(noDatabase.allow).toBe(false);
    if (!noDatabase.allow) expect(noDatabase.reason).toBe("unidentified_target");
  });

  it("TEST H — bounded mechanism does not call global migrate()", async () => {
    const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "f2-dp01-apply-124.ts"), "utf8");
    const sourceNoComments = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(sourceNoComments).not.toMatch(/import\s*\{[^}]*\bmigrate\b/);
    expect(sourceNoComments).not.toMatch(/\bmigrate\s*\(/);
    expect(sourceNoComments).not.toMatch(/from ["']\.\/index\.js["']/);
    expect(sourceNoComments).not.toMatch(/listMigrationFiles/);

    const spy = vi.spyOn(dbIndex, "migrate");
    const recorder: string[] = [];
    const result = await applyF2Dp01Migration124({
      connectionString: APPROVED_URL,
      env: DEVTEST_ENV,
      execute: true,
      connectable: mockConnectable(recorder),
    });
    expect(spy).not.toHaveBeenCalled();
    expect(result.calledMigrate).toBe(false);
    expect(result.applied).toBe(true);
    expect(recorder[0]).toBe("BEGIN");
    expect(recorder[1]).toContain("CREATE TABLE IF NOT EXISTS f2_opportunity_facts");
    expect(recorder[1]).not.toContain("ALTER TABLE rfp_rfps");
    expect(recorder.at(-1)).toBe("COMMIT");
    expect(recorder.some((sql) => /schema_migrations/i.test(sql))).toBe(false);
    spy.mockRestore();
  });

  it("TEST I — credential redaction in safety/error output", () => {
    expect(redactDatabaseUrl(APPROVED_URL)).toBe("postgres://127.0.0.1:5432/eos");
    expect(redactDatabaseUrl(APPROVED_URL)).not.toContain("supersecret-do-not-leak");
    expect(redactDatabaseUrl(APPROVED_URL)).not.toContain("eos:supersecret");

    const refused = decideF2Dp01Apply124({
      connectionString: APPROVED_URL,
      env: { EOS_ENV: "production" },
    });
    const dumped = JSON.stringify(refused);
    expect(dumped).not.toContain("supersecret-do-not-leak");
    expect(dumped).not.toContain("eos:supersecret");
    if (!refused.allow) {
      expect(refused.redactedTarget).toBe("postgres://127.0.0.1:5432/eos");
    }
  });

  it("does not apply without execute, and does not create a live client when execute lacks connectable", async () => {
    const dry = await applyF2Dp01Migration124({
      connectionString: APPROVED_URL,
      env: DEVTEST_ENV,
      execute: false,
    });
    expect(dry.applied).toBe(false);
    expect(dry.reason).toBe("execution_not_requested");

    const noClient = await applyF2Dp01Migration124({
      connectionString: APPROVED_URL,
      env: DEVTEST_ENV,
      execute: true,
    });
    expect(noClient.applied).toBe(false);
    expect(noClient.reason).toBe("execution_client_missing");
  });

  it("rejects the in-process stand-in database name", () => {
    const decision = decideF2Dp01Apply124({
      connectionString: "postgres://127.0.0.1/eos_devtest_f2_dp01",
      env: DEVTEST_ENV,
    });
    expect(decision.allow).toBe(false);
    if (!decision.allow) expect(decision.reason).toBe("stand_in_not_authorized");
  });

  it("rolls back the 124 transaction on query failure without calling migrate()", async () => {
    const spy = vi.spyOn(dbIndex, "migrate");
    const recorder: string[] = [];
    const connectable = {
      connect: async () => ({
        async query(sql: string) {
          recorder.push(sql);
          if (sql.startsWith("CREATE TABLE") || sql.includes("f2_opportunity_facts")) {
            throw new Error("injected_failure");
          }
          return { rowCount: 0, rows: [] };
        },
        release() {},
      }),
    };
    await expect(
      applyF2Dp01Migration124({
        connectionString: APPROVED_URL,
        env: DEVTEST_ENV,
        execute: true,
        connectable,
      }),
    ).rejects.toThrow("injected_failure");
    expect(recorder).toContain("BEGIN");
    expect(recorder).toContain("ROLLBACK");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
