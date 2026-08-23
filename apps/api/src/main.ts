import { checkDatabaseHealth, createPool, migrate } from "@sedmc/db";
import { bootstrapSecretsFromEnv, seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { seedDemoCommercialData } from "./dev/seed-demo-data.js";
import { createLogger } from "./observability.js";
import { createEnvSecretsProvider } from "./ports/secrets.js";
import { syncStoreToPostgres } from "./persistence/sync.js";
import { hydrateAiDrafts } from "./persistence/ai-drafts.js";
import { hydrateAiRecommendRuns } from "./persistence/ai-recommend-runs.js";
import {
  hydrateAiRecommendStaleAuditExportLastFilters,
  hydrateAiRecommendStaleAuditExportLastPresets,
  hydrateAiRecommendStaleAuditExportPresets,
  hydrateAiRecommendStaleAuditExportPresetUsages,
  hydrateAiRecommendStaleSuppressionAudits,
  hydrateAiRecommendStaleSuppressions,
} from "./persistence/ai-recommend-stale-suppressions.js";
import { hydrateCrmFromPostgres } from "./persistence/crm.js";
import { hydrateNotifEmailTemplates, hydrateNotifEmailSuppressions, hydrateNotifEmailAllowlist, hydrateNotifDlqSlaDigestLastRuns, hydrateNotifAllowlistDualDigestLastRuns, hydrateNotifDlqSlaDigestStaleSuppressions, hydrateNotifDlqSlaDigestStaleSuppressionAudits, hydrateNotifDlqSlaDigestStaleAuditExportLastFilters, hydrateNotifAllowlistDualDigestStaleSuppressions, hydrateNotifAllowlistDualDigestStaleSuppressionAudits, hydrateNotifAllowlistDualDigestStaleAuditExportLastFilters } from "./persistence/notifications.js";
import { hydratePendingOutbox } from "./persistence/outbox.js";
import { hydrateProcessedEvents } from "./persistence/processed-events.js";
import { hydrateNatsConsumerOffsets } from "./persistence/nats-offsets.js";
import { hydrateSupImportBatchesFromPostgres, hydrateSupFromPostgres, hydrateSupImportExecuteIdempotenciesFromPostgres, hydrateSupHeatmapRollupSnapshots } from "./persistence/supplier.js";
import { initEventTransport } from "./events/transport-init.js";
import { initEventConsumers } from "./events/consumer-init.js";
import { publishPendingOutbox } from "./outbox.js";
import { buildServer } from "./server.js";

const logger = createLogger((process.env.EOS_LOG_LEVEL as "info") ?? "info");
const secrets = createEnvSecretsProvider();
const tokenSecret = secrets.get("EOS_TOKEN_SECRET") ?? "dev-only-change-me";
const isProduction =
  process.env.EOS_ENV === "production" ||
  process.env.EOS_ENV === "uat" ||
  process.env.NODE_ENV === "production";

let bootstrap;
try {
  bootstrap = bootstrapSecretsFromEnv((ref) => secrets.get(ref));
} catch (error) {
  if (isProduction) {
    logger.error("bootstrap_secrets_missing", {
      err: error instanceof Error ? error.message : "unknown",
    });
    process.exit(1);
  }
  // Local `npm run dev -w @sedmc/api` without env: use documented test passwords
  // (carol.admin@sedmc.local / test-carol-not-for-prod). Never used in UAT/Prod.
  logger.warn("bootstrap_secrets_missing_using_dev_defaults", {
    err: error instanceof Error ? error.message : "unknown",
    carolEmail: "carol.admin@sedmc.local",
  });
  bootstrap = TEST_BOOTSTRAP_SECRETS;
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
  const crmHydrated = await hydrateCrmFromPostgres(pool, store);
  const templatesHydrated = await hydrateNotifEmailTemplates(pool, store);
  const suppressionsHydrated = await hydrateNotifEmailSuppressions(pool, store);
  const allowlistHydrated = await hydrateNotifEmailAllowlist(pool, store);
  const digestLastRunsHydrated = await hydrateNotifDlqSlaDigestLastRuns(pool, store);
  const allowlistDigestLastRunsHydrated = await hydrateNotifAllowlistDualDigestLastRuns(pool, store);
  const digestStaleSuppressionsHydrated = await hydrateNotifDlqSlaDigestStaleSuppressions(pool, store);
  const digestStaleSuppressionAuditsHydrated = await hydrateNotifDlqSlaDigestStaleSuppressionAudits(pool, store);
  const digestStaleAuditExportLastFiltersHydrated = await hydrateNotifDlqSlaDigestStaleAuditExportLastFilters(
    pool,
    store,
  );
  const allowlistStaleSuppressionsHydrated = await hydrateNotifAllowlistDualDigestStaleSuppressions(pool, store);
  const allowlistStaleSuppressionAuditsHydrated = await hydrateNotifAllowlistDualDigestStaleSuppressionAudits(pool, store);
  const allowlistStaleAuditExportLastFiltersHydrated = await hydrateNotifAllowlistDualDigestStaleAuditExportLastFilters(
    pool,
    store,
  );
  const heatmapRollupsHydrated = await hydrateSupHeatmapRollupSnapshots(pool, store);
  const aiDraftsHydrated = await hydrateAiDrafts(pool, store);
  const aiRecommendRunsHydrated = await hydrateAiRecommendRuns(pool, store);
  const aiRecommendStaleSuppressionsHydrated = await hydrateAiRecommendStaleSuppressions(pool, store);
  const aiRecommendStaleSuppressionAuditsHydrated = await hydrateAiRecommendStaleSuppressionAudits(pool, store);
  const aiRecommendStaleAuditExportLastFiltersHydrated = await hydrateAiRecommendStaleAuditExportLastFilters(pool, store);
  const aiRecommendStaleAuditExportPresetsHydrated = await hydrateAiRecommendStaleAuditExportPresets(pool, store);
  const aiRecommendStaleAuditExportPresetUsagesHydrated = await hydrateAiRecommendStaleAuditExportPresetUsages(pool, store);
  const aiRecommendStaleAuditExportLastPresetsHydrated = await hydrateAiRecommendStaleAuditExportLastPresets(pool, store);
  logger.info("pg3_crm_hydrate", crmHydrated);
  logger.info("i3_email_templates_hydrate", { merged: templatesHydrated });
  logger.info("i39_email_suppressions_hydrate", { merged: suppressionsHydrated });
  logger.info("i314_email_allowlist_hydrate", { merged: allowlistHydrated });
  logger.info("i420_dlq_sla_digest_last_run_hydrate", { merged: digestLastRunsHydrated });
  logger.info("i324_allowlist_dual_digest_last_run_hydrate", { merged: allowlistDigestLastRunsHydrated });
  logger.info("i425_dlq_sla_digest_stale_suppression_hydrate", { merged: digestStaleSuppressionsHydrated });
  logger.info("i427_dlq_sla_digest_stale_suppression_audit_hydrate", { merged: digestStaleSuppressionAuditsHydrated });
  logger.info("i429_dlq_sla_digest_stale_audit_export_last_filter_hydrate", {
    merged: digestStaleAuditExportLastFiltersHydrated,
  });
  logger.info("i328_allowlist_dual_digest_stale_suppression_hydrate", { merged: allowlistStaleSuppressionsHydrated });
  logger.info("i330_allowlist_dual_digest_stale_suppression_audit_hydrate", { merged: allowlistStaleSuppressionAuditsHydrated });
  logger.info("i332_allowlist_dual_digest_stale_audit_export_last_filter_hydrate", {
    merged: allowlistStaleAuditExportLastFiltersHydrated,
  });
  logger.info("pg27_heatmap_rollup_snapshot_hydrate", { merged: heatmapRollupsHydrated });
  logger.info("i204_ai_drafts_hydrate", { merged: aiDraftsHydrated });
  logger.info("i209_ai_recommend_runs_hydrate", { merged: aiRecommendRunsHydrated });
  logger.info("i2013_ai_recommend_stale_suppression_hydrate", { merged: aiRecommendStaleSuppressionsHydrated });
  logger.info("i2015_ai_recommend_stale_suppression_audit_hydrate", { merged: aiRecommendStaleSuppressionAuditsHydrated });
  logger.info("i2017_ai_recommend_stale_audit_export_last_filter_hydrate", {
    merged: aiRecommendStaleAuditExportLastFiltersHydrated,
  });
  logger.info("i2019_ai_recommend_stale_audit_export_preset_hydrate", {
    merged: aiRecommendStaleAuditExportPresetsHydrated,
  });
  logger.info("i2022_ai_recommend_stale_audit_export_preset_usage_hydrate", {
    merged: aiRecommendStaleAuditExportPresetUsagesHydrated,
  });
  logger.info("i2022_ai_recommend_stale_audit_export_last_preset_hydrate", {
    merged: aiRecommendStaleAuditExportLastPresetsHydrated,
  });
  const merged = await hydratePendingOutbox(pool, store);
  const processedMerged = await hydrateProcessedEvents(pool, store);
  const natsOffsetsMerged = await hydrateNatsConsumerOffsets(pool, store);
  const supImportsMerged = await hydrateSupImportBatchesFromPostgres(pool, store);
  const supEntitiesMerged = await hydrateSupFromPostgres(pool, store);
  const supIdempotencyMerged = await hydrateSupImportExecuteIdempotenciesFromPostgres(pool, store);
  const drain = publishPendingOutbox(store);
  logger.info("outbox_startup_drain", {
    mergedFromPg: merged,
    processedMerged,
    natsOffsetsMerged,
    supImportsMerged,
    supEntitiesMerged,
    supIdempotencyMerged,
    ...drain,
  });
  dbHealth = () => checkDatabaseHealth(pool);
} else {
  logger.warn("database_url_missing", {
    mode: "memory_only",
    note: "Set EOS_DATABASE_URL for PostgreSQL persistence",
  });
}

await initEventTransport(store, logger);
await initEventConsumers(store, logger);

const port = Number(process.env.EOS_PORT ?? 8080);
const app = buildServer({
  store,
  logger,
  ...(dbHealth ? { dbHealth } : {}),
});

if (process.env.EOS_SEED_DEMO === "true") {
  try {
    const summary = await seedDemoCommercialData(app, store, bootstrap);
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
