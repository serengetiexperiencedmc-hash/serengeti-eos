/**
 * GPTA-H-88 — explicitly bounded Dev/Test application of F2-DP-01 migration 124 only.
 *
 * This module does NOT replace or wrap the global migrate runner.
 * This module does NOT authorize live execution of migration 124.
 * A later separate execution authorization is required before --execute / apply writes.
 */
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const F2_DP01_MIGRATION_124_FILENAME = "124_f2_dp01_commercial_facts.sql";

/** Hard allowlist. Not latest, not a wildcard, not the global catalogue enumerator. */
export const F2_DP01_ALLOWED_MIGRATION_BASENAMES = [F2_DP01_MIGRATION_124_FILENAME] as const;

export const F2_DP01_APPROVED_DEVTEST_DATABASE = "eos";
export const F2_DP01_APPROVED_DEVTEST_HOST = "127.0.0.1";
export const F2_DP01_APPROVED_DEVTEST_PORT = "5432";
export const F2_DP01_GATEB_DATABASE = "eos_gateb";
export const F2_DP01_STANDIN_DATABASE = "eos_devtest_f2_dp01";

export type F2Dp01Apply124RefuseReason =
  | "unidentified_target"
  | "production_like_not_authorized"
  | "eos_gateb_not_authorized"
  | "stand_in_not_authorized"
  | "not_approved_devtest_target"
  | "migration_file_not_authorized"
  | "migration_file_missing"
  | "execution_not_requested"
  | "execution_client_missing";

export type F2Dp01Apply124Decision =
  | {
      allow: true;
      migrationBasename: typeof F2_DP01_MIGRATION_124_FILENAME;
      migrationPath: string;
      redactedTarget: string;
    }
  | {
      allow: false;
      reason: F2Dp01Apply124RefuseReason;
      redactedTarget?: string;
      requestedBasename?: string;
    };

export type F2Dp01SqlClient = {
  query(sql: string): Promise<unknown>;
  release(): void;
};

export type F2Dp01SqlConnectable = {
  connect(): Promise<F2Dp01SqlClient>;
};

function packageRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..");
}

export function authorizedF2Dp01Migration124Path(): string {
  return resolve(join(packageRoot(), "migrations", F2_DP01_MIGRATION_124_FILENAME));
}

/** Aligned with apps/api isProductionLikeEnv. Duplicated so @sedmc/db does not import the API. */
export function isProductionLikeEnvForF2Dp01(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = {},
): boolean {
  return env.EOS_ENV === "production" || env.EOS_ENV === "uat" || env.NODE_ENV === "production";
}

export function redactDatabaseUrl(url: string | undefined): string {
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
      port: parsed.port || F2_DP01_APPROVED_DEVTEST_PORT,
      database,
    };
  } catch {
    return undefined;
  }
}

export function resolveAuthorizedF2Dp01Migration124(
  requestedMigrationFile?: string,
): { ok: true; path: string } | { ok: false; reason: "migration_file_not_authorized" | "migration_file_missing"; requestedBasename?: string } {
  const authorizedPath = authorizedF2Dp01Migration124Path();
  if (requestedMigrationFile === undefined) {
    if (!existsSync(authorizedPath)) return { ok: false, reason: "migration_file_missing" };
    return { ok: true, path: authorizedPath };
  }
  const requestedBasename = basename(requestedMigrationFile);
  if (
    requestedBasename !== F2_DP01_MIGRATION_124_FILENAME ||
    !((F2_DP01_ALLOWED_MIGRATION_BASENAMES as readonly string[]).includes(requestedBasename))
  ) {
    return { ok: false, reason: "migration_file_not_authorized", requestedBasename };
  }
  const requestedPath = resolve(requestedMigrationFile);
  const basenameOnly = requestedMigrationFile === requestedBasename;
  if (!basenameOnly && requestedPath !== authorizedPath) {
    return { ok: false, reason: "migration_file_not_authorized", requestedBasename };
  }
  if (!existsSync(authorizedPath)) return { ok: false, reason: "migration_file_missing", requestedBasename };
  return { ok: true, path: authorizedPath };
}

export function decideF2Dp01Apply124(input: {
  connectionString?: string;
  env?: NodeJS.Dict<string> | NodeJS.ProcessEnv;
  requestedMigrationFile?: string;
}): F2Dp01Apply124Decision {
  const env = input.env ?? {};
  const redactedTarget = redactDatabaseUrl(input.connectionString);

  const file = resolveAuthorizedF2Dp01Migration124(input.requestedMigrationFile);
  if (!file.ok) {
    const refused: Extract<F2Dp01Apply124Decision, { allow: false }> = {
      allow: false,
      reason: file.reason,
    };
    if (file.requestedBasename !== undefined) refused.requestedBasename = file.requestedBasename;
    if (input.connectionString !== undefined) refused.redactedTarget = redactedTarget;
    return refused;
  }

  if (!input.connectionString) {
    return { allow: false, reason: "unidentified_target", redactedTarget };
  }
  const target = parsedTarget(input.connectionString);
  if (!target) {
    return { allow: false, reason: "unidentified_target", redactedTarget };
  }
  if (isProductionLikeEnvForF2Dp01(env)) {
    return { allow: false, reason: "production_like_not_authorized", redactedTarget };
  }
  if (target.database === F2_DP01_GATEB_DATABASE) {
    return { allow: false, reason: "eos_gateb_not_authorized", redactedTarget };
  }
  if (target.database === F2_DP01_STANDIN_DATABASE) {
    return { allow: false, reason: "stand_in_not_authorized", redactedTarget };
  }
  if (
    target.hostname !== F2_DP01_APPROVED_DEVTEST_HOST ||
    target.port !== F2_DP01_APPROVED_DEVTEST_PORT ||
    target.database !== F2_DP01_APPROVED_DEVTEST_DATABASE
  ) {
    return { allow: false, reason: "not_approved_devtest_target", redactedTarget };
  }

  return {
    allow: true,
    migrationBasename: F2_DP01_MIGRATION_124_FILENAME,
    migrationPath: file.path,
    redactedTarget,
  };
}

export async function applyF2Dp01Migration124(input: {
  connectionString?: string;
  env?: NodeJS.Dict<string> | NodeJS.ProcessEnv;
  requestedMigrationFile?: string;
  execute: boolean;
  connectable?: F2Dp01SqlConnectable;
}): Promise<{
  applied: boolean;
  calledMigrate: false;
  decision: F2Dp01Apply124Decision;
  reason?: F2Dp01Apply124RefuseReason;
  statements?: string[];
}> {
  const decision = decideF2Dp01Apply124(input);
  if (!decision.allow) {
    return { applied: false, calledMigrate: false, decision, reason: decision.reason };
  }
  if (input.execute !== true) {
    return { applied: false, calledMigrate: false, decision, reason: "execution_not_requested" };
  }
  if (!input.connectable) {
    return { applied: false, calledMigrate: false, decision, reason: "execution_client_missing" };
  }

  const sql = readFileSync(decision.migrationPath, "utf8");
  const statements = ["BEGIN", sql, "COMMIT"] as const;
  const client = await input.connectable.connect();
  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    return { applied: true, calledMigrate: false, decision, statements: [...statements] };
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* preserve original error */
    }
    throw error;
  } finally {
    client.release();
  }
}
