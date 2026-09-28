import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import pg from "pg";
import { createPool, migrate } from "@sedmc/db";

const execFileAsync = promisify(execFile);

export const DISPOSABLE_PG_RECOVERY_UNAVAILABLE =
  "BLOCKED — NO SAFE DISPOSABLE POSTGRESQL TARGET AVAILABLE";

export function databaseNameFromUrl(url: string): string | undefined {
  try {
    const name = new URL(url).pathname.replace(/^\//, "");
    return name || undefined;
  } catch {
    return undefined;
  }
}

export function isGovernedGateBDatabaseName(name: string): boolean {
  return name === "eos_gateb";
}

export type DisposableDumpRestoreResult =
  | {
      ok: true;
      dumped: true;
      restored: true;
      verified: true;
      databaseName: string;
      method: "pg_dump" | "sql-logical";
      elapsedMs: number;
      label: "DEV/TEST ONLY";
      productionRtoClaimed: false;
    }
  | {
      ok: false;
      blocked: true;
      reason: typeof DISPOSABLE_PG_RECOVERY_UNAVAILABLE;
      detail: string;
      label: "DEV/TEST ONLY";
      productionRtoClaimed: false;
    };

function adminUrlOnSameServer(sourceUrl: string, databaseName: string): string {
  const u = new URL(sourceUrl);
  u.pathname = `/${databaseName}`;
  return u.toString();
}

async function commandExists(bin: string): Promise<boolean> {
  try {
    await execFileAsync(bin, ["--version"], { timeout: 8000 });
    return true;
  } catch {
    return false;
  }
}

async function createDisposableDatabase(sourceUrl: string, name: string): Promise<void> {
  const client = new pg.Client({ connectionString: sourceUrl, connectionTimeoutMillis: 2000 });
  await client.connect();
  try {
    await client.query(`CREATE DATABASE ${quoteIdent(name)}`);
  } finally {
    await client.end();
  }
}

function quoteIdent(name: string): string {
  if (!/^[a-z][a-z0-9_]*$/.test(name)) {
    throw new Error("invalid_disposable_database_name");
  }
  return `"${name}"`;
}

async function dropDisposableDatabase(sourceUrl: string, name: string): Promise<void> {
  const client = new pg.Client({ connectionString: sourceUrl, connectionTimeoutMillis: 2000 });
  await client.connect();
  try {
    await client.query(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`,
      [name],
    );
    await client.query(`DROP DATABASE IF EXISTS ${quoteIdent(name)}`);
  } finally {
    await client.end();
  }
}

/**
 * Dev/Test only. Never targets eos_gateb. Never claims Production RTO/RPO.
 * migrate() is used only against a newly created empty disposable database.
 */
export async function runDisposablePgDumpRestoreDrill(env: NodeJS.ProcessEnv = process.env): Promise<DisposableDumpRestoreResult> {
  const sourceUrl = env.EOS_E1D_DISPOSABLE_DATABASE_URL ?? env.EOS_DATABASE_URL;
  if (env.EOS_RUN_PG_TESTS !== "1" || !sourceUrl) {
    return {
      ok: false,
      blocked: true,
      reason: DISPOSABLE_PG_RECOVERY_UNAVAILABLE,
      detail: "EOS_RUN_PG_TESTS or database URL not set for a disposable drill",
      label: "DEV/TEST ONLY",
      productionRtoClaimed: false,
    };
  }
  const sourceName = databaseNameFromUrl(sourceUrl);
  if (!sourceName) {
    return {
      ok: false,
      blocked: true,
      reason: DISPOSABLE_PG_RECOVERY_UNAVAILABLE,
      detail: "could not parse database name",
      label: "DEV/TEST ONLY",
      productionRtoClaimed: false,
    };
  }

  const explicitDisposable = env.EOS_E1D_DISPOSABLE_DATABASE_URL;
  if (explicitDisposable && isGovernedGateBDatabaseName(databaseNameFromUrl(explicitDisposable) ?? "")) {
    return {
      ok: false,
      blocked: true,
      reason: DISPOSABLE_PG_RECOVERY_UNAVAILABLE,
      detail: "refusing eos_gateb as disposable target",
      label: "DEV/TEST ONLY",
      productionRtoClaimed: false,
    };
  }

  const started = Date.now();
  const hasDumpTools = (await commandExists("pg_dump")) && (await commandExists("pg_restore"));
  const disposableName = `eos_e1d_b5_${Date.now().toString(36)}`;
  const adminSource = sourceUrl;
  let created = false;
  try {
    await createDisposableDatabase(adminSource, disposableName);
    created = true;
  } catch (error) {
    return {
      ok: false,
      blocked: true,
      reason: DISPOSABLE_PG_RECOVERY_UNAVAILABLE,
      detail: `CREATE DATABASE failed: ${error instanceof Error ? error.message : "unknown"}`,
      label: "DEV/TEST ONLY",
      productionRtoClaimed: false,
    };
  }

  const disposableUrl = adminUrlOnSameServer(adminSource, disposableName);
  const dumpDir = await mkdtemp(join(tmpdir(), "eos-e1d-b5-"));
  const dumpFile = join(dumpDir, "disp.dump");
  try {
    const method = hasDumpTools ? await dumpRestoreWithPgDump(disposableUrl, adminSource, disposableName, dumpFile) : await dumpRestoreWithSqlLogical(disposableUrl, adminSource, disposableName);
    return {
      ok: true,
      dumped: true,
      restored: true,
      verified: true,
      databaseName: disposableName,
      method,
      elapsedMs: Date.now() - started,
      label: "DEV/TEST ONLY",
      productionRtoClaimed: false,
    };
  } catch (error) {
    return {
      ok: false,
      blocked: true,
      reason: DISPOSABLE_PG_RECOVERY_UNAVAILABLE,
      detail: error instanceof Error ? error.message : "dump_restore_failed",
      label: "DEV/TEST ONLY",
      productionRtoClaimed: false,
    };
  } finally {
    await rm(dumpDir, { recursive: true, force: true });
    if (created) {
      try {
        await dropDisposableDatabase(adminSource, disposableName);
      } catch {
        /* best-effort disposable cleanup */
      }
    }
  }
}

const MARKER_SQL = `INSERT INTO tenants (id, slug, name, kind)
         VALUES ('11111111-1111-4111-8111-111111111111', 'e1d-b5-disp', 'E1-D B5 disposable', 'internal')
         ON CONFLICT (id) DO NOTHING`;

async function seedMarker(url: string): Promise<void> {
  const pool = createPool(url);
  try {
    await migrate(pool);
    await pool.query(MARKER_SQL);
  } finally {
    await pool.end();
  }
}

async function verifyMarker(url: string): Promise<void> {
  const verify = createPool(url);
  try {
    const tenants = await verify.query(`SELECT slug FROM tenants WHERE slug = 'e1d-b5-disp'`);
    if (tenants.rowCount !== 1) {
      throw new Error("restore_verification_failed");
    }
  } finally {
    await verify.end();
  }
}

async function dumpRestoreWithPgDump(
  disposableUrl: string,
  adminSource: string,
  disposableName: string,
  dumpFile: string,
): Promise<"pg_dump"> {
  await seedMarker(disposableUrl);
  await execFileAsync("pg_dump", ["-Fc", "-f", dumpFile, disposableUrl], { timeout: 60_000 });
  await dropDisposableDatabase(adminSource, disposableName);
  await createDisposableDatabase(adminSource, disposableName);
  await execFileAsync("pg_restore", ["--no-owner", "--dbname", disposableUrl, dumpFile], { timeout: 60_000 });
  await verifyMarker(disposableUrl);
  return "pg_dump";
}

/** Repository-native fallback when pg_dump/pg_restore are not on PATH. DEV/TEST ONLY. */
async function dumpRestoreWithSqlLogical(
  disposableUrl: string,
  adminSource: string,
  disposableName: string,
): Promise<"sql-logical"> {
  await seedMarker(disposableUrl);
  const source = createPool(disposableUrl);
  let rows: { id: string; slug: string; name: string; kind: string }[];
  try {
    const dumped = await source.query(`SELECT id, slug, name, kind FROM tenants WHERE slug = 'e1d-b5-disp'`);
    rows = dumped.rows as { id: string; slug: string; name: string; kind: string }[];
  } finally {
    await source.end();
  }
  if (rows.length !== 1) throw new Error("logical_dump_empty");

  await dropDisposableDatabase(adminSource, disposableName);
  await createDisposableDatabase(adminSource, disposableName);
  const restored = createPool(disposableUrl);
  try {
    await migrate(restored);
    const row = rows[0]!;
    await restored.query(`INSERT INTO tenants (id, slug, name, kind) VALUES ($1, $2, $3, $4)`, [
      row.id,
      row.slug,
      row.name,
      row.kind,
    ]);
  } finally {
    await restored.end();
  }
  await verifyMarker(disposableUrl);
  return "sql-logical";
}
