/**
 * GPTA-H-94 — F2-DP-01-BOUNDED-DEVTEST-API-STARTUP
 *
 * Opt-in, fail-closed Dev/Test API database startup branch.
 * Does not replace default startup. Does not wrap the global migration runner.
 */
import type { DbPool } from "@sedmc/db";
import { isProductionLikeEnv } from "../devtest-token-secret.js";
import type { Store } from "../store.js";
import { hydrateF2CommercialFacts } from "./persist.js";

export const F2_DP01_BOUNDED_DEVTEST_API_STARTUP_NAME = "F2-DP-01-BOUNDED-DEVTEST-API-STARTUP";
export const F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV = "EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP";

export const F2_DP01_BOUNDED_STARTUP_HOST = "127.0.0.1";
export const F2_DP01_BOUNDED_STARTUP_PORT = "5432";
export const F2_DP01_BOUNDED_STARTUP_DATABASE = "eos";
export const F2_DP01_BOUNDED_STARTUP_GATEB_DATABASE = "eos_gateb";
export const F2_DP01_BOUNDED_STARTUP_STANDIN_DATABASE = "eos_devtest_f2_dp01";

export type F2Dp01BoundedStartupRefuseReason =
  | "opt_in_ambiguous"
  | "unidentified_target"
  | "production_like_not_authorized"
  | "eos_gateb_not_authorized"
  | "stand_in_not_authorized"
  | "not_approved_devtest_target";

export type F2Dp01BoundedStartupDecision =
  | { mode: "default" }
  | { mode: "bounded"; redactedTarget: string }
  | { mode: "refuse"; reason: F2Dp01BoundedStartupRefuseReason; redactedTarget: string };

function redactDatabaseUrl(url: string | undefined): string {
  if (!url) return "(unset)";
  try {
    const parsed = new URL(url);
    const port = parsed.port ? `:${parsed.port}` : "";
    return `${parsed.protocol}//${parsed.hostname}${port}${parsed.pathname}`;
  } catch {
    return "(unparseable-redacted)";
  }
}

function parsedTarget(url: string): { hostname: string; port: string; database: string } | undefined {
  try {
    const parsed = new URL(url);
    const database = parsed.pathname.replace(/^\//, "");
    if (!database) return undefined;
    return {
      hostname: parsed.hostname,
      port: parsed.port || F2_DP01_BOUNDED_STARTUP_PORT,
      database,
    };
  } catch {
    return undefined;
  }
}

function optInState(raw: unknown): "absent" | "requested" | "ambiguous" {
  if (raw === undefined || raw === null) return "absent";
  const value = String(raw).trim();
  if (value.length === 0) return "absent";
  const lower = value.toLowerCase();
  if (lower === "0" || lower === "false" || lower === "off") return "absent";
  if (lower === "1" || lower === "true") return "requested";
  return "ambiguous";
}

function refuse(
  reason: F2Dp01BoundedStartupRefuseReason,
  databaseUrl: string | undefined,
): Extract<F2Dp01BoundedStartupDecision, { mode: "refuse" }> {
  return { mode: "refuse", reason, redactedTarget: redactDatabaseUrl(databaseUrl) };
}

/** Decide whether API database startup uses default path, bounded F2-DP-01 path, or fail-closed refuse. */
export function decideF2Dp01BoundedDevtestApiStartup(input: {
  databaseUrl: string | undefined;
  env?: NodeJS.Dict<string> | NodeJS.ProcessEnv;
}): F2Dp01BoundedStartupDecision {
  const env = input.env ?? {};
  const optIn = optInState(env[F2_DP01_BOUNDED_DEVTEST_API_STARTUP_ENV]);
  if (optIn === "absent") return { mode: "default" };
  if (optIn === "ambiguous") return refuse("opt_in_ambiguous", input.databaseUrl);

  if (!input.databaseUrl) return refuse("unidentified_target", input.databaseUrl);
  const target = parsedTarget(input.databaseUrl);
  if (!target) return refuse("unidentified_target", input.databaseUrl);
  if (isProductionLikeEnv(env)) return refuse("production_like_not_authorized", input.databaseUrl);
  if (target.database === F2_DP01_BOUNDED_STARTUP_GATEB_DATABASE) {
    return refuse("eos_gateb_not_authorized", input.databaseUrl);
  }
  if (target.database === F2_DP01_BOUNDED_STARTUP_STANDIN_DATABASE) {
    return refuse("stand_in_not_authorized", input.databaseUrl);
  }
  if (
    target.hostname !== F2_DP01_BOUNDED_STARTUP_HOST ||
    target.port !== F2_DP01_BOUNDED_STARTUP_PORT ||
    target.database !== F2_DP01_BOUNDED_STARTUP_DATABASE
  ) {
    return refuse("not_approved_devtest_target", input.databaseUrl);
  }
  return { mode: "bounded", redactedTarget: redactDatabaseUrl(input.databaseUrl) };
}

/**
 * Bounded-mode database attach + F2 hydration only.
 * Callers must not invoke the global migration runner or mixed startup hydrates.
 */
export async function runF2Dp01BoundedDevtestApiStartup(input: {
  store: Store;
  pool: DbPool;
}): Promise<{
  opportunities: number;
  rfps: number;
  pathB: number;
  accounts: number;
  rates: number;
  programmes: number;
}> {
  input.store.dbPool = input.pool;
  input.store.f2Dp01BoundedSidecarOnly = true;
  return hydrateF2CommercialFacts(input.pool, input.store);
}
