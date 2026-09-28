/**
 * GPTA-H-102 — F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER
 *
 * Minimum fail-closed Dev/Test trigger that invokes the existing bounded
 * shutdown runner from the live Fastify process.
 *
 * Architecture inspection: the live process exposes Fastify as its
 * out-of-process control surface; the test-only fake signal host is not
 * wired into main.ts; Windows process.kill(SIGINT) is not catchable.
 * stdin/IPC/file-watch are not present in this API. A loopback-only POST
 * registered solely in bounded mode is therefore the smallest safe
 * live-process invocation path.
 *
 * Does not duplicate Fastify close or pool end. Does not replace SIGINT/SIGTERM.
 */
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { Logger } from "../observability.js";
import { isProductionLikeEnv } from "../devtest-token-secret.js";
import {
  decideF2Dp01BoundedDevtestApiStartup,
  F2_DP01_BOUNDED_STARTUP_HOST,
} from "./bounded-startup.js";
import { F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME } from "./bounded-shutdown.js";

export const F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_NAME =
  "F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER";
export const F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_PATH = "/eos-devtest/f2-dp-01/bounded-shutdown";
export const F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_SIGNAL = "deterministic-trigger";
export const F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_METHOD = "POST";

export type F2Dp01BoundedShutdownTriggerRefuseReason =
  | "not_bounded_mode"
  | "production_like_not_authorized"
  | "listen_host_not_loopback"
  | "remote_not_loopback";

export type F2Dp01BoundedShutdownTriggerDecision =
  | { allow: true }
  | { allow: false; reason: F2Dp01BoundedShutdownTriggerRefuseReason };

function isExactLoopback(address: string): boolean {
  const host = address.trim().replace(/^::ffff:/i, "");
  return host === F2_DP01_BOUNDED_STARTUP_HOST;
}

function remoteOf(req: FastifyRequest): string {
  return req.ip ?? req.socket.remoteAddress ?? "";
}

export function decideF2Dp01BoundedDevtestShutdownTrigger(input: {
  databaseUrl: string | undefined;
  listenHost: string;
  env?: NodeJS.Dict<string> | NodeJS.ProcessEnv;
  remoteAddress?: string;
}): F2Dp01BoundedShutdownTriggerDecision {
  const env = input.env ?? {};
  if (isProductionLikeEnv(env)) {
    return { allow: false, reason: "production_like_not_authorized" };
  }
  const startup = decideF2Dp01BoundedDevtestApiStartup({
    databaseUrl: input.databaseUrl,
    env,
  });
  if (startup.mode !== "bounded") {
    return { allow: false, reason: "not_bounded_mode" };
  }
  if (!isExactLoopback(input.listenHost)) {
    return { allow: false, reason: "listen_host_not_loopback" };
  }
  if (input.remoteAddress !== undefined && !isExactLoopback(input.remoteAddress)) {
    return { allow: false, reason: "remote_not_loopback" };
  }
  return { allow: true };
}

function commonFields(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    increment: "F2-DP-01",
    namedIncrement: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_NAME,
    shutdownRunner: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_NAME,
    productionReady: false,
    ...extra,
  };
}

/**
 * Register the loopback POST only when bounded Dev/Test conditions already hold.
 * Request-time checks fail closed again. Invokes existing requestShutdown.
 */
export function registerF2Dp01BoundedDevtestShutdownTrigger(input: {
  app: FastifyInstance;
  logger: Logger;
  requestShutdown: (signal: string) => unknown;
  databaseUrl: string | undefined;
  listenHost: string;
  env?: NodeJS.Dict<string> | NodeJS.ProcessEnv;
}): { registered: boolean } {
  const atRegister = decideF2Dp01BoundedDevtestShutdownTrigger({
    databaseUrl: input.databaseUrl,
    listenHost: input.listenHost,
    ...(input.env ? { env: input.env } : {}),
  });
  if (!atRegister.allow) {
    input.logger.info(
      "f2_dp01_bounded_devtest_shutdown_trigger_not_registered",
      commonFields({ reason: atRegister.reason }),
    );
    return { registered: false };
  }

  input.app.post(F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_PATH, async (req, reply) => {
    const atRequest = decideF2Dp01BoundedDevtestShutdownTrigger({
      databaseUrl: input.databaseUrl,
      listenHost: input.listenHost,
      ...(input.env ? { env: input.env } : {}),
      remoteAddress: remoteOf(req),
    });
    if (!atRequest.allow) {
      input.logger.warn(
        "f2_dp01_bounded_devtest_shutdown_trigger_refused",
        commonFields({ reason: atRequest.reason }),
      );
      return reply.code(403).send({
        error: "f2_dp01_bounded_devtest_shutdown_trigger_refused",
        reason: atRequest.reason,
        productionReady: false,
      });
    }
    input.logger.info(
      "f2_dp01_bounded_devtest_shutdown_trigger_accepted",
      commonFields({
        signal: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_SIGNAL,
        path: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_PATH,
      }),
    );
    void input.requestShutdown(F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_SIGNAL);
    return reply.code(202).send({
      accepted: true,
      signal: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_SIGNAL,
      namedIncrement: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_NAME,
      productionReady: false,
    });
  });

  input.logger.info(
    "f2_dp01_bounded_devtest_shutdown_trigger_registered",
    commonFields({
      method: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_METHOD,
      path: F2_DP01_BOUNDED_DEVTEST_SHUTDOWN_TRIGGER_PATH,
    }),
  );
  return { registered: true };
}
