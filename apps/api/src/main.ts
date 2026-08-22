import { checkDatabaseHealth, createPool, migrate } from "@sedmc/db";
import { bootstrapSecretsFromEnv, seedStore } from "./app.js";
import { seedDemoCommercialData } from "./dev/seed-demo-data.js";
import { createLogger } from "./observability.js";
import { createEnvSecretsProvider } from "./ports/secrets.js";
import { syncStoreToPostgres } from "./persistence/sync.js";
import { buildServer } from "./server.js";

const logger = createLogger((process.env.EOS_LOG_LEVEL as "info") ?? "info");
const secrets = createEnvSecretsProvider();
const tokenSecret = secrets.get("EOS_TOKEN_SECRET") ?? "dev-only-change-me";

let bootstrap;
try {
  bootstrap = bootstrapSecretsFromEnv((ref) => secrets.get(ref));
} catch (error) {
  logger.error("bootstrap_secrets_missing", {
    err: error instanceof Error ? error.message : "unknown",
  });
  process.exit(1);
}

const store = seedStore(tokenSecret, bootstrap);
const databaseUrl = secrets.get("EOS_DATABASE_URL");
let dbHealth: (() => Promise<{ ok: boolean; error?: string }>) | undefined;

if (databaseUrl) {
  const pool = createPool(databaseUrl);
  const migrated = await migrate(pool);
  logger.info("database_migrated", { applied: migrated.applied });
  await syncStoreToPostgres(pool, store);
  store.dbPool = pool;
  logger.info("database_seed_synced", { mode: "development_bootstrap", pgDualWrite: "I3-PG.1" });
  dbHealth = () => checkDatabaseHealth(pool);
} else {
  logger.warn("database_url_missing", {
    mode: "memory_only",
    note: "Set EOS_DATABASE_URL for PostgreSQL persistence",
  });
}

const port = Number(process.env.EOS_PORT ?? 8080);
const app = buildServer({
  store,
  logger,
  ...(dbHealth ? { dbHealth } : {}),
});

if (process.env.EOS_SEED_DEMO === "true") {
  try {
    const summary = await seedDemoCommercialData(app, store);
    logger.info("demo_seed_complete", summary);
  } catch (error) {
    logger.error("demo_seed_failed", {
      err: error instanceof Error ? error.message : "unknown",
    });
    process.exit(1);
  }
}

await app.listen({ port, host: "127.0.0.1" });
logger.info("api_listening", {
  url: `http://127.0.0.1:${port}`,
  productionReady: false,
  increment: "I1",
});
