import { createServer } from "node:net";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import { describe, expect, it } from "vitest";
import { seedStore } from "../src/app.js";
import {
  decideF2Dp01BoundedDevtestApiStartup,
  F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV,
  runF2Dp01BoundedDevtestApiStartup,
} from "../src/commercial-facts/bounded-startup.js";
import {
  F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME,
  installF2Dp01BoundedDevtestShutdown,
  runF2Dp01BoundedDevtestShutdown,
  type F2Dp01BoundedShutdownSignalHost,
} from "../src/commercial-facts/bounded-shutdown.js";
import type { Logger } from "../src/observability.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const APPROVED_URL = "postgres://eos:test-secret-do-not-print@127.0.0.1:5432/eos";
const DEVTEST_ENV = { EOS_ENV: "development", NODE_ENV: "test" };

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

function fakeSignalHost(): F2Dp01BoundedShutdownSignalHost & {
  emit(event: "SIGINT" | "SIGTERM"): void;
} {
  const listeners = new Map<"SIGINT" | "SIGTERM", Set<() => void>>();
  return {
    on(event, listener) {
      const set = listeners.get(event) ?? new Set();
      set.add(listener);
      listeners.set(event, set);
    },
    off(event, listener) {
      listeners.get(event)?.delete(listener);
    },
    emit(event) {
      for (const listener of listeners.get(event) ?? []) listener();
    },
  };
}

describe("F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY", () => {
  it("records initiation, Fastify close, completion, exit 0, and releases the listener", async () => {
    const app = Fastify({ logger: false });
    await app.listen({ host: "127.0.0.1", port: 0 });
    expect(app.server.listening).toBe(true);
    const { logger, lines } = recordingLogger();
    const exits: number[] = [];
    const pool = { ended: false, async end() { pool.ended = true; } };

    const result = await runF2Dp01BoundedDevtestShutdown({
      app,
      logger,
      signal: "SIGINT",
      pool,
      exit: (code) => {
        exits.push(code);
      },
    });

    expect(result.ok).toBe(true);
    expect(result.exitCode).toBe(0);
    expect(result.listenerReleased).toBe(true);
    expect(result.namedIncrement).toBe(F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME);
    expect(result.productionReady).toBe(false);
    expect(result.phases).toEqual([
      "signal_received",
      "initiated",
      "fastify_close_invoked",
      "pool_end_invoked",
      "completed",
    ]);
    expect(app.server.listening).toBe(false);
    expect(pool.ended).toBe(true);
    expect(exits).toEqual([0]);
    expect(lines.map((line) => line.msg)).toEqual([
      "shutdown_signal_received",
      "shutdown_started",
      "shutdown_fastify_close_invoked",
      "shutdown_pool_end_invoked",
      "shutdown_completed",
    ]);
    expect(JSON.stringify(lines)).not.toMatch(/test-secret-do-not-print/);
  });

  it("records shutdown failure and exits 1 when Fastify close throws", async () => {
    const { logger, lines } = recordingLogger();
    const exits: number[] = [];
    const result = await runF2Dp01BoundedDevtestShutdown({
      app: {
        async close() {
          throw new Error("close-failed");
        },
        server: { listening: true },
      },
      logger,
      signal: "SIGTERM",
      exit: (code) => {
        exits.push(code);
      },
    });
    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.phases).toContain("signal_received");
    expect(result.phases).toContain("initiated");
    expect(result.phases).toContain("fastify_close_invoked");
    expect(result.phases).toContain("failed");
    expect(result.phases).not.toContain("completed");
    expect(exits).toEqual([1]);
    expect(lines.some((line) => line.msg === "shutdown_failed")).toBe(true);
    expect(JSON.stringify(lines)).toContain("close-failed");
  });

  it("does not leave an unrelated listener running-state changed", async () => {
    const app = Fastify({ logger: false });
    const other = Fastify({ logger: false });
    await app.listen({ host: "127.0.0.1", port: 0 });
    await other.listen({ host: "127.0.0.1", port: 0 });
    const otherPort = (other.server.address() as { port: number }).port;
    const { logger } = recordingLogger();

    await runF2Dp01BoundedDevtestShutdown({
      app,
      logger,
      signal: "SIGINT",
      exit: () => {},
    });

    expect(app.server.listening).toBe(false);
    expect(other.server.listening).toBe(true);
    expect(otherPort).toBeGreaterThan(0);
    expect(otherPort).not.toBe(8080);
    await other.close();
  });

  it("installs catchable handlers on a fake signal host and ignores a second in-flight signal", async () => {
    const { logger, lines } = recordingLogger();
    const exits: number[] = [];
    const host = fakeSignalHost();
    let enteredClose!: () => void;
    let releaseClose!: () => void;
    const sawClose = new Promise<void>((resolve) => {
      enteredClose = resolve;
    });
    const gate = new Promise<void>((resolve) => {
      releaseClose = resolve;
    });
    const server = { listening: true };
    let finished!: () => void;
    const done = new Promise<void>((resolve) => {
      finished = resolve;
    });
    const installed = installF2Dp01BoundedDevtestShutdown({
      app: {
        server,
        async close() {
          enteredClose();
          await gate;
          server.listening = false;
        },
      },
      logger,
      signals: host,
      exit: (code) => {
        exits.push(code);
        finished();
      },
    });
    host.emit("SIGINT");
    await sawClose;
    host.emit("SIGINT");
    releaseClose();
    await done;
    installed.dispose();
    expect(exits).toEqual([0]);
    expect(server.listening).toBe(false);
    expect(lines.some((line) => line.msg === "f2_dp01_bounded_devtest_shutdown_handlers_installed")).toBe(true);
    expect(lines.some((line) => line.msg === "shutdown_signal_ignored_already_in_progress")).toBe(true);
  });

  it("keeps the bounded startup branch opt-in and fail-closed", () => {
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: APPROVED_URL,
        env: DEVTEST_ENV,
      }),
    ).toEqual({ mode: "default" });
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: APPROVED_URL,
        env: { ...DEVTEST_ENV, [F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV]: "true" },
      }).mode,
    ).toBe("bounded");
    expect(
      decideF2Dp01BoundedDevtestApiStartup({
        databaseUrl: "postgres://eos:x@127.0.0.1:5434/eos_gateb",
        env: { ...DEVTEST_ENV, [F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV]: "true" },
      }).mode,
    ).toBe("refuse");
  });

  it("does not change six-map hydration semantics", async () => {
    const store = seedStore("h98-shutdown-hydrate");
    const sql: string[] = [];
    const query = (async (text: string) => {
      sql.push(String(text));
      return { rows: [], rowCount: 0 };
    }) as import("@sedmc/db").DbPool["query"];
    const pool = {
      query,
      connect: async () => ({ query, release() {} }),
      options: { connectionString: APPROVED_URL },
    } as unknown as import("@sedmc/db").DbPool;
    const result = await runF2Dp01BoundedDevtestApiStartup({ store, pool });
    expect(result).toEqual({
      opportunities: 0,
      rfps: 0,
      pathB: 0,
      accounts: 0,
      rates: 0,
      programmes: 0,
    });
    expect(sql.join("\n").toLowerCase()).not.toContain("schema_migrations");
  });

  it("bounded shutdown source does not import migrations, mixed hydrates, or persist writes", () => {
    const source = readFileSync(join(root, "src/commercial-facts/bounded-shutdown.ts"), "utf8");
    expect(source).toContain("F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY");
    expect(source).not.toContain("listMigrationFiles");
    expect(source).not.toContain("shouldApplyStartupMigrations");
    expect(source).not.toContain("syncStoreToPostgres");
    expect(source).not.toContain("hydrateCrmFromPostgres");
    expect(source).not.toContain("hydrateF2CommercialFacts");
    expect(source).not.toMatch(/from ["']@sedmc\/db["']/);
  });

  it("main.ts installs bounded shutdown only on the bounded branch and keeps default handlers isolated", () => {
    const source = readFileSync(join(root, "src/main.ts"), "utf8");
    expect(source).toContain("installF2Dp01BoundedDevtestShutdown");
    const boundedInstallIdx = source.lastIndexOf("installF2Dp01BoundedDevtestShutdown");
    const boundedModeIdx = source.lastIndexOf('if (boundedStartup.mode === "bounded")', boundedInstallIdx);
    const defaultSigintIdx = source.lastIndexOf('process.on("SIGINT"');
    expect(boundedModeIdx).toBeGreaterThan(-1);
    expect(boundedInstallIdx).toBeGreaterThan(boundedModeIdx);
    expect(defaultSigintIdx).toBeGreaterThan(boundedInstallIdx);
    expect(source).toContain("shouldApplyStartupMigrations(databaseUrl)");
  });

  it("does not bind or disturb port 8080", async () => {
    const unrelated = createServer();
    await new Promise<void>((resolve, reject) => {
      unrelated.once("error", reject);
      unrelated.listen(0, "127.0.0.1", () => resolve());
    });
    const unrelatedPort = (unrelated.address() as { port: number }).port;
    const app = Fastify({ logger: false });
    await app.listen({ host: "127.0.0.1", port: 0 });
    const appPort = (app.server.address() as { port: number }).port;
    const { logger } = recordingLogger();
    await runF2Dp01BoundedDevtestShutdown({
      app,
      logger,
      signal: "SIGINT",
      exit: () => {},
    });
    expect(appPort).not.toBe(8080);
    expect(unrelatedPort).not.toBe(appPort);
    expect(unrelated.listening).toBe(true);
    await new Promise<void>((resolve, reject) => {
      unrelated.close((err) => (err ? reject(err) : resolve()));
    });
  });
});
