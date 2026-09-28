/**
 * GPTA-H-112 — H-112-FULL-SCHEMA-DEVTEST-API-STARTUP
 *
 * Opt-in, fail-closed Dev/Test API path for an isolated full C-spine database.
 * Does not replace bounded F2-DP-01 startup. Does not target 127.0.0.1:5432/eos.
 * Does not authorize Production, UAT, Gate B, or eos_gateb.
 */
import { isProductionLikeEnv } from "../devtest-token-secret.js";

export const H112_FULL_SCHEMA_DEVTEST_API_STARTUP_NAME = "H-112-FULL-SCHEMA-DEVTEST-API-STARTUP";
export const H112_FULL_SCHEMA_DEVTEST_API_STARTUP_ENV = "EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP";

export const H112_FULL_SCHEMA_STARTUP_HOST = "127.0.0.1";
export const H112_FULL_SCHEMA_STARTUP_DATABASE = "eos_h112_full";
export const H112_FULL_SCHEMA_STARTUP_ALLOWED_PORTS = ["5432", "5435"] as const;

export type H112FullSchemaStartupRefuseReason =
  | "opt_in_ambiguous"
  | "unidentified_target"
  | "production_like_not_authorized"
  | "eos_gateb_not_authorized"
  | "bounded_eos_not_authorized"
  | "bounded_and_full_schema_mutually_exclusive"
  | "listen_port_not_approved"
  | "not_approved_devtest_target";

export type H112FullSchemaStartupDecision =
  | { mode: "default" }
  | { mode: "full_schema"; redactedTarget: string }
  | { mode: "refuse"; reason: H112FullSchemaStartupRefuseReason; redactedTarget: string };

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
      port: parsed.port || "5432",
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
  reason: H112FullSchemaStartupRefuseReason,
  databaseUrl: string | undefined,
): Extract<H112FullSchemaStartupDecision, { mode: "refuse" }> {
  return { mode: "refuse", reason, redactedTarget: redactDatabaseUrl(databaseUrl) };
}

export function decideH112FullSchemaDevtestApiStartup(input: {
  databaseUrl: string | undefined;
  env?: NodeJS.Dict<string> | NodeJS.ProcessEnv;
  boundedRequested?: boolean;
}): H112FullSchemaStartupDecision {
  const env = input.env ?? {};
  const optIn = optInState(env[H112_FULL_SCHEMA_DEVTEST_API_STARTUP_ENV]);
  if (optIn === "absent") return { mode: "default" };
  if (optIn === "ambiguous") return refuse("opt_in_ambiguous", input.databaseUrl);
  if (input.boundedRequested) return refuse("bounded_and_full_schema_mutually_exclusive", input.databaseUrl);
  if (isProductionLikeEnv(env)) return refuse("production_like_not_authorized", input.databaseUrl);
  if (!input.databaseUrl) return refuse("unidentified_target", input.databaseUrl);
  const target = parsedTarget(input.databaseUrl);
  if (!target) return refuse("unidentified_target", input.databaseUrl);
  if (target.database === "eos_gateb") return refuse("eos_gateb_not_authorized", input.databaseUrl);
  if (target.database === "eos") return refuse("bounded_eos_not_authorized", input.databaseUrl);
  if (target.hostname !== H112_FULL_SCHEMA_STARTUP_HOST) {
    return refuse("not_approved_devtest_target", input.databaseUrl);
  }
  if (!(H112_FULL_SCHEMA_STARTUP_ALLOWED_PORTS as readonly string[]).includes(target.port)) {
    return refuse("listen_port_not_approved", input.databaseUrl);
  }
  if (target.database !== H112_FULL_SCHEMA_STARTUP_DATABASE) {
    return refuse("not_approved_devtest_target", input.databaseUrl);
  }
  return { mode: "full_schema", redactedTarget: redactDatabaseUrl(input.databaseUrl) };
}
