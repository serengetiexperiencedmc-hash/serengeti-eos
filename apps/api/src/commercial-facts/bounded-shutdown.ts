/**
 * GPTA-H-98 — F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY
 *
 * Isolated shutdown-lifecycle observability for the already-authorized
 * F2-DP-01 bounded Dev/Test API startup path.
 *
 * Does not replace default (non-bounded) shutdown. Does not change
 * persistence, hydration, or migration behavior.
 *
 * Investigation (H-96 / H-97 Finding 2):
 * - Fastify in this API does not register SIGINT/SIGTERM itself.
 * - Only the process-level handlers in main.ts close the app.
 * - Missing `shutdown_started` does not prove Fastify close never began.
 * - On Windows, `process.kill(pid, 'SIGINT'|'SIGTERM')` from another
 *   process is not a catchable Node signal; it can terminate without
 *   running JS handlers. Port release after such a kill is not proof of
 *   graceful Fastify shutdown. Tests must invoke this runner directly
 *   (or a fake signal host), not `process.kill`.
 */
import type { Logger } from "../observability.js";

export const F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME = "F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY";

export type F2Dp01BoundedShutdownPhase =
  | "signal_received"
  | "initiated"
  | "fastify_close_invoked"
  | "pool_end_invoked"
  | "completed"
  | "failed";

export type F2Dp01BoundedShutdownResult = {
  ok: boolean;
  exitCode: 0 | 1;
  signal: string;
  phases: F2Dp01BoundedShutdownPhase[];
  listenerReleased: boolean;
  namedIncrement: typeof F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME;
  productionReady: false;
};

export type F2Dp01BoundedShutdownApp = {
  close(): Promise<unknown>;
  server?: { listening: boolean };
};

export type F2Dp01BoundedShutdownPool = {
  end(): Promise<unknown>;
};

export type F2Dp01BoundedShutdownSignalHost = {
  on(event: "SIGINT" | "SIGTERM", listener: () => void): void;
  off(event: "SIGINT" | "SIGTERM", listener: () => void): void;
};

function commonFields(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    increment: "F2-DP-01",
    namedIncrement: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME,
    productionReady: false,
    platform: process.platform,
    ...extra,
  };
}

function listenerIsOpen(app: F2Dp01BoundedShutdownApp): boolean {
  return Boolean(app.server?.listening);
}

/**
 * Run one bounded Dev/Test shutdown attempt.
 * Does not invoke the global migration runner, hydration, or mixed initialization.
 */
export async function runF2Dp01BoundedDevtestShutdown(input: {
  app: F2Dp01BoundedShutdownApp;
  logger: Logger;
  signal: string;
  pool?: F2Dp01BoundedShutdownPool;
  exit?: (code: number) => void;
}): Promise<F2Dp01BoundedShutdownResult> {
  const phases: F2Dp01BoundedShutdownPhase[] = [];
  const mark = (phase: F2Dp01BoundedShutdownPhase): void => {
    phases.push(phase);
  };

  mark("signal_received");
  input.logger.info("shutdown_signal_received", commonFields({ signal: input.signal }));

  mark("initiated");
  input.logger.info("shutdown_started", commonFields({ signal: input.signal }));

  try {
    mark("fastify_close_invoked");
    input.logger.info("shutdown_fastify_close_invoked", commonFields({ signal: input.signal }));
    await input.app.close();

    if (input.pool) {
      mark("pool_end_invoked");
      input.logger.info("shutdown_pool_end_invoked", commonFields({ signal: input.signal }));
      await input.pool.end();
    }

    const listenerReleased = !listenerIsOpen(input.app);
    mark("completed");
    input.logger.info("shutdown_completed", commonFields({ signal: input.signal, listenerReleased }));
    input.exit?.(0);
    return {
      ok: true,
      exitCode: 0,
      signal: input.signal,
      phases,
      listenerReleased,
      namedIncrement: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME,
      productionReady: false,
    };
  } catch (error) {
    const listenerReleased = !listenerIsOpen(input.app);
    mark("failed");
    input.logger.error("shutdown_failed", commonFields({
      signal: input.signal,
      err: error instanceof Error ? error.message : "unknown",
      listenerReleased,
    }));
    input.exit?.(1);
    return {
      ok: false,
      exitCode: 1,
      signal: input.signal,
      phases,
      listenerReleased,
      namedIncrement: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME,
      productionReady: false,
    };
  }
}

export function installF2Dp01BoundedDevtestShutdown(input: {
  app: F2Dp01BoundedShutdownApp;
  logger: Logger;
  pool?: F2Dp01BoundedShutdownPool;
  exit?: (code: number) => void;
  signals?: F2Dp01BoundedShutdownSignalHost;
}): {
  dispose: () => void;
  requestShutdown: (signal: string) => Promise<F2Dp01BoundedShutdownResult> | undefined;
} {
  const host: F2Dp01BoundedShutdownSignalHost = input.signals ?? {
    on(event, listener) {
      process.on(event, listener);
    },
    off(event, listener) {
      process.off(event, listener);
    },
  };
  let inFlight: Promise<F2Dp01BoundedShutdownResult> | undefined;

  input.logger.info(
    "f2_dp01_bounded_devtest_shutdown_handlers_installed",
    commonFields({
      signals: ["SIGINT", "SIGTERM"],
      windowsExternalKillIsNotCatchable: process.platform === "win32",
    }),
  );

  const requestShutdown = (signal: string): Promise<F2Dp01BoundedShutdownResult> | undefined => {
    if (inFlight) {
      input.logger.info(
        "shutdown_signal_ignored_already_in_progress",
        commonFields({ signal }),
      );
      return inFlight;
    }
    const runInput: Parameters<typeof runF2Dp01BoundedDevtestShutdown>[0] = {
      app: input.app,
      logger: input.logger,
      signal,
      ...(input.exit ? { exit: input.exit } : { exit: (code: number) => process.exit(code) }),
      ...(input.pool ? { pool: input.pool } : {}),
    };
    inFlight = runF2Dp01BoundedDevtestShutdown(runInput);
    void inFlight;
    return inFlight;
  };

  const onSigint = () => {
    void requestShutdown("SIGINT");
  };
  const onSigterm = () => {
    void requestShutdown("SIGTERM");
  };
  host.on("SIGINT", onSigint);
  host.on("SIGTERM", onSigterm);

  return {
    dispose: () => {
      host.off("SIGINT", onSigint);
      host.off("SIGTERM", onSigterm);
    },
    requestShutdown,
  };
}
