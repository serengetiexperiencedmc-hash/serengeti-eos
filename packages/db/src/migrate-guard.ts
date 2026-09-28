/**
 * H-112 — refuse global migrate() against preserved or unauthorized databases.
 * Dev/Test only. Not Production authorization.
 */

export type MigrateTargetRefuseReason =
  | "unparseable_database_url"
  | "eos_gateb_not_authorized"
  | "h111_eos_124_only_preserved";

export function databaseNameFromConnectionString(url: string): string | undefined {
  try {
    const name = new URL(url).pathname.replace(/^\//, "");
    return name || undefined;
  } catch {
    return undefined;
  }
}

/** CLI/global migrate must not touch Gate B or the validated 124-only `eos` catalog. */
export function migrateTargetRefuseReason(url: string): MigrateTargetRefuseReason | undefined {
  let name: string | undefined;
  try {
    name = databaseNameFromConnectionString(url);
  } catch {
    return "unparseable_database_url";
  }
  if (!name) return "unparseable_database_url";
  if (name === "eos_gateb") return "eos_gateb_not_authorized";
  if (name === "eos") return "h111_eos_124_only_preserved";
  return undefined;
}
