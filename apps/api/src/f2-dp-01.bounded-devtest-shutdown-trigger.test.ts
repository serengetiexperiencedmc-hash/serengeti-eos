import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import { describe, expect, it } from "vitest";
import {
  decideF2Dp01BoundedDevtestApiStartup,
  F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV,
} from "../src/commercial-facts/bounded-startup.js";
import {
  F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME,
  installF2Dp01BoundedDevtestShutdown,
  runF2Dp01BoundedDevtestShutdown,
} from "../src/commercial-facts/bounded-shutdown.js";
import {
  decideF2Dp01BoundedDevtestShutdownTrigger,
  F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_NAME,
  F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_PATH,
  F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_SIGNAL,
  registerF2Dp01BoundedDevtestShutdownTrigger,
} from "../src/commercial-facts/bounded-shutdown-trigger.js";
import type { Logger } from "../src/observability.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_URL = "postgres://eos:test-secret-do-not-print@127.0.0.1:5432/eos";
const DEVTEST_ENV = { EOS_ENV: "development", NODE_ENV: "test" };
const OPT_IN = { [F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV]: "true" };

function recordingLogger() {
  const lines: Array<{ level: string; msg: string; fields?: Record<string, unknown> }> = [];
  const logger: Logger = {
    child: () => logger,
    debug: (msg, fields) => {
      lines.push({ level: "debug", msg, ...(fields ? { fields } : {}) });
    },
    info: (msg, fields) => {
      lines.push({ level: "info", msg, ...(fields ? { fields } : {}) });
    },
    warn: (msg, fields) => {
      lines.push({ level: "warn", msg, ...(fields ? { fields } : {}) });
    },
    error: (msg, fields) => {
      lines.push({ level: "error", msg, ...(fields ? { fields } : {}) });
    },
  };
  return { logger, lines };
}

describe("F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER decision", () => {
  it("refuses when bounded Dev/Test mode is not enabled", () => {
    expect(
      decideF2Dp01BoundedDevtestShutdownTrigger({
        databaseUrl: APPROVED_URL,
        listenHost: "127.0.0.1",
        env: DEVTEST_ENV,
      }),
    ).toEqual({ allow: false, reason: "not_bounded_mode" });
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: APPROVED_URL,
        env: DEVTEST_ENV,
      }).mode,
    ).toBe("default");
  });

  it("refuses production-like, UAT, Gate B, and non-loopback listen host", () => {
    const boundedEnv = { ...DEVTEST_ENV, ...OPT_IN };
    expect(
      decideF2Dp01BoundedDevtestShutdownTrigger({
        databaseUrl: APPROVED_URL,
        listenHost: "127.0.0.1",
        env: { ...boundedEnv, EOS_ENV: "production" },
      }),
    ).toMatchObject({ allow: false, reason: "production_like_not_authorized" });
    expect(
      decideF2Dp01BoundedDevtestShutdownTrigger({
        databaseUrl: APPROVED_URL,
        listenHost: "127.0.0.1",
        env: { ...boundedEnv, EOS_ENV: "uat" },
      }),
    ).toMatchObject({ allow: false, reason: "production_like_not_authorized" });
    expect(
      decideF2Dp01BoundedDevtestShutdownTrigger({
        databaseUrl: "postgres://eos:x@127.0.0.1:5434/eos_gateb",
        listenHost: "127.0.0.1",
        env: boundedEnv,
      }),
    ).toMatchObject({ allow: false, reason: "not_bounded_mode" });
    expect(
      decideF2Dp01BoundedDevtestShutdownTrigger({
        databaseUrl: APPROVED_URL,
        listenHost: "0.0.0.0",
        env: boundedEnv,
      }),
    ).toMatchObject({ allow: false, reason: "listen_host_not_loopback" });
  });

  it("allows only bounded opt-in plus loopback listen and remote", () => {
    expect(
      decideF2Dp01BoundedDevtestShutdownTrigger({
        databaseUrl: APPROVED_URL,
        listenHost: "127.0.0.1",
        env: { ...DEVTEST_ENV, ...OPT_IN },
        remoteAddress: "127.0.0.1",
      }),
    ).toEqual({ allow: true });
    expect(
      decideF2Dp01BoundedDevtestShutdownTrigger({
        databaseUrl: APPROVED_URL,
        listenHost: "127.0.0.1",
        env: { ...DEVTEST_ENV, ...OPT_IN },
        remoteAddress: "10.0.0.8",
      }),
    ).toMatchObject({ allow: false, reason: "remote_not_loopback" });
  });
});

describe("F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER runner wiring", () => {
  it("requestShutdown invokes the existing runner without duplicating close/end", async () => {
    const { logger, lines } = recordingLogger();
    const exits: number[] = [];
    const server = { listening: true };
    const installed = installF2Dp01BoundedDevtestShutdown({
      app: {
        server,
        async close() {
          server.listening = false;
        },
      },
      logger,
      pool: { async end() {} },
      exit: (code) => {
        exits.push(code);
      },
      signals: { on() {}, off() {} },
    });
    const result = await installed.requestShutdown(F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_SIGNAL);
    expect(result?.ok).toBe(true);
    expect(result?.signal).toBe(F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_SIGNAL);
    expect(result?.namedIncrement).toBe(F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME);
    expect(result?.phases).toEqual([
      "signal_received",
      "initiated",
      "fastify_close_invoked",
      "pool_end_invoked",
      "completed",
    ]);
    expect(exits).toEqual([0]);
    expect(lines.map((line) => line.msg)).toContain("shutdown_started");
    expect(lines.map((line) => line.msg)).toContain("shutdown_completed");
    installed.dispose();
  });

  it("registers the loopback POST only in bounded mode and the route calls requestShutdown", async () => {
    const bounded = Fastify({ logger: false });
    const { logger: boundedLog, lines } = recordingLogger();
    const signals: string[] = [];
    const registered = registerF2Dp01BoundedDevtestShutdownTrigger({
      app: bounded,
      logger: boundedLog,
      requestShutdown: (signal) => {
        signals.push(signal);
      },
      databaseUrl: APPROVED_URL,
      listenHost: "127.0.0.1",
      env: { ...DEVTEST_ENV, ...OPT_IN },
    });
    expect(registered.registered).toBe(true);
    const accepted = await bounded.inject({
      method: "POST",
      url: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_PATH,
      remoteAddress: "127.0.0.1",
    });
    expect(accepted.statusCode).toBe(202);
    expect(accepted.json().productionReady).toBe(false);
    expect(accepted.json().signal).toBe(F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_SIGNAL);
    expect(signals).toEqual([F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_SIGNAL]);
    expect(lines.some((line) => line.msg === "f2_dp01_bounded_devtest_shutdown_trigger_accepted")).toBe(true);

    const refusedRemote = await bounded.inject({
      method: "POST",
      url: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_PATH,
      remoteAddress: "203.0.113.9",
    });
    expect(refusedRemote.statusCode).toBe(403);
    await bounded.close();

    const unbound = Fastify({ logger: false });
    const { logger: defaultLog } = recordingLogger();
    const defaultReg = registerF2Dp01BoundedDevtestShutdownTrigger({
      app: unbound,
      logger: defaultLog,
      requestShutdown: () => {
        throw new Error("must-not-run");
      },
      databaseUrl: APPROVED_URL,
      listenHost: "127.0.0.1",
      env: DEVTEST_ENV,
    });
    expect(defaultReg.registered).toBe(false);
    const missing = await unbound.inject({
      method: "POST",
      url: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_PATH,
      remoteAddress: "127.0.0.1",
    });
    expect(missing.statusCode).toBe(404);
    await unbound.close();
  });

  it("does not duplicate the shutdown runner and keeps default SIGINT handling in main.ts", () => {
    const triggerSrc = readFileSync(join(root, "src/commercial-facts/bounded-shutdown-trigger.ts"), "utf8");
    expect(triggerSrc).toContain(F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_NAME);
    expect(triggerSrc).toContain("requestShutdown");
    expect(triggerSrc).not.toContain("app.close()");
    expect(triggerSrc).not.toContain("pool.end()");
    expect(triggerSrc).not.toContain("listMigrationFiles");
    expect(triggerSrc).not.toContain("hydrateF2CommercialFacts");
    expect(triggerSrc).not.toMatch(/from ["']@sedmc\/db["']/);

    const mainSrc = readFileSync(join(root, "src/main.ts"), "utf8");
    expect(mainSrc).toContain("registerF2Dp01BoundedDevtestShutdownTrigger");
    expect(mainSrc).toContain("installF2Dp01BoundedDevtestShutdown");
    const triggerIdx = mainSrc.lastIndexOf("registerF2Dp01BoundedDevtestShutdownTrigger");
    const boundedIdx = mainSrc.lastIndexOf('if (boundedStartup.mode === "bounded")', triggerIdx);
    const defaultSigintIdx = mainSrc.lastIndexOf('process.on("SIGINT"');
    expect(boundedIdx).toBeGreaterThan(-1);
    expect(triggerIdx).toBeGreaterThan(boundedIdx);
    expect(defaultSigintIdx).toBeGreaterThan(triggerIdx);
    expect(mainSrc).toContain('if (boundedStartup.mode !== "bounded")');
  });

  it("existing runner still accepts SIGINT and remains the single close/end implementation", async () => {
    const { logger } = recordingLogger();
    const result = await runF2Dp01BoundedDevtestShutdown({
      app: { async close() {}, server: { listening: false } },
      logger,
      signal: "SIGINT",
      exit: () => {},
    });
    expect(result.ok).toBe(true);
    expect(result.signal).toBe("SIGINT");
  });
});
