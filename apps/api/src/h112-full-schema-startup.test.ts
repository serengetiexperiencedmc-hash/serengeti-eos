import { describe, expect, it } from "vitest";
import { shouldApplyStartupMigrations } from "../src/persistence/startup-migrations.js";
import {
  decideH112FullSchemaDevtestApiStartup,
  H112_FULL_SCHEMA_DEVTEST_API_STARTUP_ENV,
} from "../src/persistence/h112-full-schema-startup.js";

const DEVTEST_ENV = { NODE_ENV: "test", EOS_ENV: "development" };

describe("H-112 full-schema Dev/Test startup decision", () => {
  it("enters full-schema mode for explicit opt-in and approved isolated catalog", () => {
    expect(
      decideH112FullSchemaDevtestApiStartup({
        databaseUrl: "postgres://eos_h112:x@127.0.0.1:5435/eos_h112_full",
        env: { ...DEVTEST_ENV, [H112_FULL_SCHEMA_DEVTEST_API_STARTUP_ENV]: "true" },
      }),
    ).toEqual({
      mode: "full_schema",
      redactedTarget: "postgres://127.0.0.1:5435/eos_h112_full",
    });
    expect(
      decideH112FullSchemaDevtestApiStartup({
        databaseUrl: "postgres://eos:eos-dev-only@127.0.0.1:5432/eos_h112_full",
        env: { ...DEVTEST_ENV, [H112_FULL_SCHEMA_DEVTEST_API_STARTUP_ENV]: "1" },
      }),
    ).toEqual({
      mode: "full_schema",
      redactedTarget: "postgres://127.0.0.1:5432/eos_h112_full",
    });
  });

  it("does not enter full-schema mode when opt-in is missing", () => {
    expect(
      decideH112FullSchemaDevtestApiStartup({
        databaseUrl: "postgres://eos_h112:x@127.0.0.1:5435/eos_h112_full",
        env: DEVTEST_ENV,
      }),
    ).toEqual({ mode: "default" });
  });

  it("refuses 124-only eos, Gate B, Production-like, mutual bounded opt-in, and wrong names", () => {
    const env = { ...DEVTEST_ENV, [H112_FULL_SCHEMA_DEVTEST_API_STARTUP_ENV]: "true" };
    expect(
      decideH112FullSchemaDevtestApiStartup({
        databaseUrl: "postgres://eos:eos-dev-only@127.0.0.1:5432/eos",
        env,
      }).mode,
    ).toBe("refuse");
    expect(
      decideH112FullSchemaDevtestApiStartup({
        databaseUrl: "postgres://eos_gateb:x@127.0.0.1:5434/eos_gateb",
        env,
      }),
    ).toMatchObject({ mode: "refuse", reason: "eos_gateb_not_authorized" });
    expect(
      decideH112FullSchemaDevtestApiStartup({
        databaseUrl: "postgres://eos_h112:x@127.0.0.1:5435/eos_h112_full",
        env: { EOS_ENV: "production", [H112_FULL_SCHEMA_DEVTEST_API_STARTUP_ENV]: "true" },
      }),
    ).toMatchObject({ mode: "refuse", reason: "production_like_not_authorized" });
    expect(
      decideH112FullSchemaDevtestApiStartup({
        databaseUrl: "postgres://eos_h112:x@127.0.0.1:5435/eos_h112_full",
        env,
        boundedRequested: true,
      }),
    ).toMatchObject({ mode: "refuse", reason: "bounded_and_full_schema_mutually_exclusive" });
    expect(
      decideH112FullSchemaDevtestApiStartup({
        databaseUrl: "postgres://eos_h112:x@127.0.0.1:5434/eos_h112_full",
        env,
      }),
    ).toMatchObject({ mode: "refuse", reason: "listen_port_not_approved" });
  });
});

describe("H-112 preserve 124-only eos from default migrate", () => {
  it("refuses startup migrate against database name eos", () => {
    expect(shouldApplyStartupMigrations("postgres://eos@127.0.0.1:5432/eos", DEVTEST_ENV)).toEqual({
      apply: false,
      reason: "h111_eos_124_only_preserved",
    });
  });

  it("still allows migrate on a distinct Dev/Test catalog name", () => {
    expect(shouldApplyStartupMigrations("postgres://eos@127.0.0.1:5432/eos_h112_full", DEVTEST_ENV)).toEqual({
      apply: true,
    });
    expect(shouldApplyStartupMigrations("postgres://eos@127.0.0.1:5432/eos_devtest", DEVTEST_ENV)).toEqual({
      apply: true,
    });
  });
});
