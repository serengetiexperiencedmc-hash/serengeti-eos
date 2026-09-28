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
import { hydrateNotifEmailTemplates, hydrateNotifEmailSuppressions, hydrateNotifEmailAllowlist, hydrateNotifDlqSlaDigestLastRuns, hydrateNotifAllowlistDualDigestLastRuns, hydrateNotifDlqSlaDigestStaleSuppressions, hydrateNotifDlqSlaDigestStaleSuppressionAudits, hydrateNotifDlqSlaDigestStaleAuditExportLastFilters, hydrateNotifDlqSlaDigestStaleAuditExportPresets, hydrateNotifDlqSlaDigestStaleAuditExportPresetUsages, hydrateNotifDlqSlaDigestStaleAuditExportLastPresets, hydrateNotifAllowlistDualDigestStaleSuppressions, hydrateNotifAllowlistDualDigestStaleSuppressionAudits, hydrateNotifAllowlistDualDigestStaleAuditExportLastFilters, hydrateNotifAllowlistDualDigestStaleAuditExportPresets, hydrateNotifAllowlistDualDigestStaleAuditExportPresetUsages, hydrateNotifAllowlistDualDigestStaleAuditExportLastPresets } from "./persistence/notifications.js";
import { hydratePendingOutbox } from "./persistence/outbox.js";
import { hydrateProcessedEvents } from "./persistence/processed-events.js";
import { hydrateNatsConsumerOffsets } from "./persistence/nats-offsets.js";
import { hydrateSupImportBatchesFromPostgres, hydrateSupFromPostgres, hydrateSupImportExecuteIdempotenciesFromPostgres, hydrateSupHeatmapRollupSnapshots } from "./persistence/supplier.js";
import {
  decideF2Dp01BoundedDevtestApiStartup,
  F2_DP01_BOUNDED_DEVTEST_API_STARTUP_NAME,
  runF2Dp01BoundedDevtestApiStartup,
} from "./commercial-facts/bounded-startup.js";
import { installF2Dp01BoundedDevtestShutdown } from "./commercial-facts/bounded-shutdown.js";
import { registerF2Dp01BoundedDevtestShutdownTrigger } from "./commercial-facts/bounded-shutdown-trigger.js";
import { hydrateF2CommercialFacts, isF2Dp01PersistEnabled } from "./commercial-facts/persist.js";
import { initEventTransport } from "./events/transport-init.js";
import { initEventConsumers, shutdownEventConsumers } from "./events/consumer-init.js";
import { publishPendingOutbox } from "./outbox.js";
import { buildServer } from "./server.js";
import { resolveDevTestTokenSecret } from "./devtest-token-secret.js";
import { listenHostFromEnv, validateDeploymentConfig } from "./deployment-config.js";
import { resolveDatabasePoolOptions } from "./infrastructure-contract.js";
import { localPasswordIdentityForbiddenReason } from "./ports/identity.js";
import { resolveApiListenPort } from "./production-deployment-package.js";
import {
  shouldApplyStartupMigrations,
  shouldSyncStoreToPostgresOnStartup,
} from "./persistence/startup-migrations.js";
import { shouldDrainOutboxOnStartup } from "./persistence/startup-outbox.js";
import {
  decideH112FullSchemaDevtestApiStartup,
  H112_FULL_SCHEMA_DEVTEST_API_STARTUP_NAME,
} from "./persistence/h112-full-schema-startup.js";

const logger = createLogger((process.env.EOS_LOG_LEVEL as "info") ?? "info");
const secrets = createEnvSecretsProvider();
const isProduction =
  process.env.EOS_ENV === "production" ||
  process.env.EOS_ENV === "uat" ||
  process.env.NODE_ENV === "production";

const deploymentConfig = validateDeploymentConfig(process.env);
for (const warning of deploymentConfig.warnings) {
  logger.warn("deployment_config_warning", { warning, productionReady: false });
}
if (deploymentConfig.fatal.length > 0) {
  for (const err of deploymentConfig.fatal) {
    logger.error("deployment_config_refused", { err, productionReady: false });
  }
  process.exit(1);
}

let tokenSecret: string;
try {
  tokenSecret = resolveDevTestTokenSecret((key) => secrets.get(key));
} catch (error) {
  logger.error("token_secret_missing_production_like", {
    err: error instanceof Error ? error.message : "unknown",
  });
  process.exit(1);
}

const identityBoundary = localPasswordIdentityForbiddenReason();
if (identityBoundary) {
  logger.error("identity_boundary_refused", {
    err: identityBoundary,
    productionReady: false,
    mfaImplemented: false,
    idp: "local-password-dev",
  });
  process.exit(1);
}

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

const boundedStartup = decideF2Dp01BoundedDevtestApiStartup({
  databaseUrl,
  env: process.env,
});
if (boundedStartup.mode === "refuse") {
  logger.error("f2_dp01_bounded_devtest_api_startup_refused", {
    reason: boundedStartup.reason,
    redactedTarget: boundedStartup.redactedTarget,
    namedBranch: F2_DP01_BOUNDED_DEVTEST_API_STARTUP_NAME,
    productionReady: false,
  });
  process.exit(1);
}

const fullSchemaStartup = decideH112FullSchemaDevtestApiStartup({
  databaseUrl,
  env: process.env,
  boundedRequested: boundedStartup.mode === "bounded",
});
if (fullSchemaStartup.mode === "refuse") {
  logger.error("h112_full_schema_devtest_api_startup_refused", {
    reason: fullSchemaStartup.reason,
    redactedTarget: fullSchemaStartup.redactedTarget,
    namedBranch: H112_FULL_SCHEMA_DEVTEST_API_STARTUP_NAME,
    productionReady: false,
  });
  process.exit(1);
}

if (databaseUrl) {
  const pool = createPool(databaseUrl, resolveDatabasePoolOptions());
  if (boundedStartup.mode === "bounded") {
    const f2Hydrated = await runF2Dp01BoundedDevtestApiStartup({ store, pool });
    logger.info("f2_dp01_bounded_devtest_api_startup", {
      ...f2Hydrated,
      increment: "F2-DP-01",
      namedBranch: F2_DP01_BOUNDED_DEVTEST_API_STARTUP_NAME,
      mixedSqlDurable: false,
      globalMigrateInvoked: false,
      productionReady: false,
    });
    dbHealth = () => checkDatabaseHealth(pool);
  } else {
  const migrateDecision = shouldApplyStartupMigrations(databaseUrl);
  if (migrateDecision.apply === false && migrateDecision.reason === "h111_eos_124_only_preserved") {
    logger.error("database_startup_refused_124_only_eos", {
      reason: migrateDecision.reason,
      namedBranch: fullSchemaStartup.mode === "full_schema" ? H112_FULL_SCHEMA_DEVTEST_API_STARTUP_NAME : undefined,
      hint: "Use EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true for the validated sidecar slice, or EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP against eos_h112_full. Do not apply 001–123 onto 127.0.0.1:5432/eos.",
      productionReady: false,
    });
    process.exit(1);
  }
  if (migrateDecision.apply) {
    const migrated = await migrate(pool);
    logger.info("database_migrated", {
      applied: migrated.applied,
      productionReady: false,
      ...(fullSchemaStartup.mode === "full_schema"
        ? { namedBranch: H112_FULL_SCHEMA_DEVTEST_API_STARTUP_NAME, mixedSqlDurable: true }
        : {}),
    });
  } else {
    logger.warn("database_startup_migrate_skipped", {
      reason: migrateDecision.reason,
      productionReady: false,
      gateC: "OPEN / NOT AUTHORIZED FOR PRODUCTION",
      note: "F1: do not call migrate() against eos_gateb or Production",
    });
  }
  const storeSyncDecision = shouldSyncStoreToPostgresOnStartup();
  if (storeSyncDecision.apply) {
    await syncStoreToPostgres(pool, store);
    logger.info("database_seed_synced", { mode: "development_bootstrap", pgDualWrite: "I3-PG.1" });
  } else {
    logger.warn("database_startup_store_sync_skipped", {
      reason: storeSyncDecision.reason,
      productionReady: false,
      note: "H-187: in-memory seed must not upsert into PostgreSQL on Production/UAT startup",
    });
  }
  store.dbPool = pool;
  logger.info("gate_b_durable_sor", {
    modules: ["opportunity", "rfp", "programme", "costing", "commercial-approval", "commercial-documents"],
    mode: "per_request_sql",
    note: "Process-local Store is not SoR for jointly critical Commercial/RFP/Programme when dbPool is set",
  });
  const crmHydrated = await hydrateCrmFromPostgres(pool, store, {
    persistCatalogues: storeSyncDecision.apply,
  });
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
  const digestStaleAuditExportPresetsHydrated = await hydrateNotifDlqSlaDigestStaleAuditExportPresets(pool, store);
  const digestStaleAuditExportPresetUsagesHydrated = await hydrateNotifDlqSlaDigestStaleAuditExportPresetUsages(
    pool,
    store,
  );
  const digestStaleAuditExportLastPresetsHydrated = await hydrateNotifDlqSlaDigestStaleAuditExportLastPresets(
    pool,
    store,
  );
  const allowlistStaleSuppressionsHydrated = await hydrateNotifAllowlistDualDigestStaleSuppressions(pool, store);
  const allowlistStaleSuppressionAuditsHydrated = await hydrateNotifAllowlistDualDigestStaleSuppressionAudits(pool, store);
  const allowlistStaleAuditExportLastFiltersHydrated = await hydrateNotifAllowlistDualDigestStaleAuditExportLastFilters(
    pool,
    store,
  );
  const allowlistStaleAuditExportPresetsHydrated = await hydrateNotifAllowlistDualDigestStaleAuditExportPresets(
    pool,
    store,
  );
  const allowlistStaleAuditExportPresetUsagesHydrated = await hydrateNotifAllowlistDualDigestStaleAuditExportPresetUsages(
    pool,
    store,
  );
  const allowlistStaleAuditExportLastPresetsHydrated = await hydrateNotifAllowlistDualDigestStaleAuditExportLastPresets(
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
  logger.info("i431_dlq_sla_digest_stale_audit_export_preset_hydrate", {
    merged: digestStaleAuditExportPresetsHydrated,
  });
  logger.info("i434_dlq_sla_digest_stale_audit_export_preset_usage_hydrate", {
    merged: digestStaleAuditExportPresetUsagesHydrated,
  });
  logger.info("i434_dlq_sla_digest_stale_audit_export_last_preset_hydrate", {
    merged: digestStaleAuditExportLastPresetsHydrated,
  });
  logger.info("i328_allowlist_dual_digest_stale_suppression_hydrate", { merged: allowlistStaleSuppressionsHydrated });
  logger.info("i330_allowlist_dual_digest_stale_suppression_audit_hydrate", { merged: allowlistStaleSuppressionAuditsHydrated });
  logger.info("i332_allowlist_dual_digest_stale_audit_export_last_filter_hydrate", {
    merged: allowlistStaleAuditExportLastFiltersHydrated,
  });
  logger.info("i334_allowlist_dual_digest_stale_audit_export_preset_hydrate", {
    merged: allowlistStaleAuditExportPresetsHydrated,
  });
  logger.info("i337_allowlist_dual_digest_stale_audit_export_preset_usage_hydrate", {
    merged: allowlistStaleAuditExportPresetUsagesHydrated,
  });
  logger.info("i337_allowlist_dual_digest_stale_audit_export_last_preset_hydrate", {
    merged: allowlistStaleAuditExportLastPresetsHydrated,
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
  logger.info("outbox_startup_hydrate", {
    mergedFromPg: merged,
    processedMerged,
    natsOffsetsMerged,
    supImportsMerged,
    supEntitiesMerged,
    supIdempotencyMerged,
  });
  if (isF2Dp01PersistEnabled(store)) {
    const f2Hydrated = await hydrateF2CommercialFacts(pool, store);
    logger.info("f2_dp01_commercial_facts_hydrate", {
      ...f2Hydrated,
      increment: "F2-DP-01",
      productionReady: false,
    });
  }
  dbHealth = () => checkDatabaseHealth(pool);
  }
} else {
  if (isProduction) {
    logger.error("database_url_missing_production_like", {
      mode: "memory_refused",
      productionReady: false,
    });
    process.exit(1);
  }
  logger.warn("database_url_missing", {
    mode: "memory_only",
    note: "Set EOS_DATABASE_URL for PostgreSQL persistence",
    productionReady: false,
  });
}

try {
  await initEventTransport(store, logger);
} catch (error) {
  logger.error("event_transport_refused", {
    err: error instanceof Error ? error.message : "unknown",
    productionReady: false,
  });
  process.exit(1);
}
if (store.dbPool && boundedStartup.mode !== "bounded") {
  const drainDecision = shouldDrainOutboxOnStartup(store);
  if (drainDecision.apply) {
    const drain = publishPendingOutbox(store);
    logger.info("outbox_startup_drain", {
      ...drain,
      transportKind: drainDecision.transportKind,
      productionReady: false,
    });
  } else {
    logger.warn("outbox_startup_drain_skipped", {
      reason: drainDecision.reason,
      productionReady: false,
      note: "H-188: startup drain is I4 recovery; Production/UAT must not mark outbox published against in-memory or stub transport",
    });
  }
}
await initEventConsumers(store, logger);

const port = resolveApiListenPort();
const app = buildServer({
  store,
  logger,
  ...(dbHealth ? { dbHealth } : {}),
});

if (process.env.EOS_SEED_DEMO === "true") {
  if (boundedStartup.mode === "bounded") {
    logger.error("demo_seed_forbidden_f2_dp01_bounded_startup", {
      namedBranch: F2_DP01_BOUNDED_DEVTEST_API_STARTUP_NAME,
      productionReady: false,
    });
    process.exit(1);
  }
  if (isProduction) {
    logger.error("demo_seed_forbidden_production_like", { productionReady: false });
    process.exit(1);
  }
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

const listenHost = listenHostFromEnv();

if (boundedStartup.mode === "bounded") {
  const installed = installF2Dp01BoundedDevtestShutdown({
    app,
    logger,
    ...(store.dbPool ? { pool: store.dbPool } : {}),
  });
  registerF2Dp01BoundedDevtestShutdownTrigger({
    app,
    logger,
    requestShutdown: installed.requestShutdown,
    databaseUrl,
    listenHost,
    env: process.env,
  });
}

await app.listen({ port, host: listenHost });
logger.info("api_listening", {
  url: `http://${listenHost}:${port}`,
  productionReady: false,
  increment: "I1",
});

if (boundedStartup.mode !== "bounded") {
  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info("shutdown_started", { signal, productionReady: false });
    try {
      await shutdownEventConsumers();
      await app.close();
      if (store.dbPool) await store.dbPool.end();
    } catch (error) {
      logger.error("shutdown_failed", {
        err: error instanceof Error ? error.message : "unknown",
        productionReady: false,
      });
      process.exit(1);
    }
    process.exit(0);
  };
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
}
