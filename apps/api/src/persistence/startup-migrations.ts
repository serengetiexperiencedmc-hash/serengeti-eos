import { isProductionLikeEnv } from "../devtest-token-secret.js";
import { databaseNameFromUrl, isGovernedGateBDatabaseName } from "./disposable-pg-recovery.js";

export type StartupMigrateDecision =
  | { apply: true }
  | {
      apply: false;
      reason:
        | "no_database_url"
        | "production_gate_c_not_authorized"
        | "gate_b_already_provisioned"
        | "h111_eos_124_only_preserved";
    };

/**
 * Gate C is OPEN. API startup must not apply migrations to Production-like
 * environments or to the governed Gate B database (eos_gateb / F1).
 * Dev/Test empty databases may still be migrated when explicitly configured.
 */
export function shouldApplyStartupMigrations(
  databaseUrl: string | undefined,
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): StartupMigrateDecision {
  if (!databaseUrl) return { apply: false, reason: "no_database_url" };
  if (isProductionLikeEnv(env)) {
    return { apply: false, reason: "production_gate_c_not_authorized" };
  }
  const name = databaseNameFromUrl(databaseUrl);
  if (name && isGovernedGateBDatabaseName(name)) {
    return { apply: false, reason: "gate_b_already_provisioned" };
  }
  if (name === "eos") {
    return { apply: false, reason: "h111_eos_124_only_preserved" };
  }
  return { apply: true };
}

export type StartupStoreSyncDecision =
  | { apply: true }
  | { apply: false; reason: "production_gate_c_not_authorized" };

/**
 * H-187: in-memory seed upsert (`syncStoreToPostgres`) and startup catalogue
 * dual-write are Development/Test bootstrap only. Production/UAT must not
 * fall through into those writes after migrate skip merely because an earlier
 * fail-closed validator exited the process.
 */
export function shouldSyncStoreToPostgresOnStartup(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): StartupStoreSyncDecision {
  if (isProductionLikeEnv(env)) {
    return { apply: false, reason: "production_gate_c_not_authorized" };
  }
  return { apply: true };
}
