import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

export type DbPool = pg.Pool;

export function createPool(connectionString: string): DbPool {
  return new Pool({ connectionString, max: 10 });
}

export async function checkDatabaseHealth(pool: DbPool): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await pool.query("SELECT 1 AS ok");
    return { ok: result.rows[0]?.ok === 1 };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "db_unreachable" };
  }
}

function packageRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..");
}

export function listMigrationFiles(): string[] {
  const root = packageRoot();
  const base = join(root, "schema.sql");
  const migrationsDir = join(root, "migrations");
  const extras = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((f) => join(migrationsDir, f));
  return [base, ...extras];
}

export async function migrate(pool: DbPool): Promise<{ applied: string[] }> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  const applied: string[] = [];
  for (const file of listMigrationFiles()) {
    const id = file.split(/[/\\]/).slice(-2).join("/");
    const existing = await pool.query("SELECT 1 FROM schema_migrations WHERE id = $1", [id]);
    if (existing.rowCount) continue;
    const sql = readFileSync(file, "utf8");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [id]);
      await client.query("COMMIT");
      applied.push(id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  return { applied };
}

export { pg };
