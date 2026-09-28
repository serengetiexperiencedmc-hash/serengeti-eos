import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createInMemoryDevTransport } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { listenHostFromEnv, validateDeploymentConfig } from "./deployment-config.js";
import { shouldApplyStartupMigrations, shouldSyncStoreToPostgresOnStartup } from "./persistence/startup-migrations.js";
import { shouldDrainOutboxOnStartup } from "./persistence/startup-outbox.js";
import {
  API_HEALTH_PATH,
  API_READY_PATH,
  COMPILED_API_ENTRYPOINT,
  DEFAULT_API_PORT,
  PRODUCTION_DEPLOYMENT_BOUNDARIES,
  PRODUCTION_DEPLOYMENT_CONTRACT,
  productionLikeListenBindForbiddenReason,
  repositoryHasProductionContainerManifest,
  resolveApiListenPort,
  SECRET_REFERENCE_CONTRACT,
  SEPARATE_MIGRATE_COMMAND,
} from "./production-deployment-package.js";

const apiRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(apiRoot, "../..");
const dbRoot = join(repoRoot, "packages/db");

function almostCompleteProductionEnv(overrides: Record<string, string> = {}) {
  return {
    EOS_ENV: "production",
    EOS_TOKEN_SECRET: "a-non-placeholder-secret-value",
    EOS_DATABASE_URL: "postgres://eos@db.example.invalid:5432/eos",
    EOS_DATABASE_TLS_MODE: "require",
    EOS_INFRASTRUCTURE_TARGET: "sedmc-owned-future",
    EOS_DOCUMENT_STORAGE: "future-object-store",
    EOS_EVENT_TRANSPORT: "nats-jetstream",
    EOS_NATS_URL: "tls://nats-user:redacted@broker.example.invalid:4222",
    EOS_EMAIL_ADAPTER: "smtp",
    EOS_SMTP_HOST: "mail.example.invalid",
    EOS_SMTP_FROM: "noreply@example.invalid",
    EOS_SMTP_SECURE: "true",
    EOS_PUBLIC_ORIGIN: "https://app.example.invalid",
    EOS_LISTEN_HOST: "0.0.0.0",
    ...overrides,
  };
}

describe("H-191 provider-neutral Production deployment package", () => {
  it("catalogues every deployment boundary without selecting a product or inventing sizing", () => {
    const ids = PRODUCTION_DEPLOYMENT_CONTRACT.map((row) => row.id);
    expect(ids).toEqual([...PRODUCTION_DEPLOYMENT_BOUNDARIES]);
    const joined = PRODUCTION_DEPLOYMENT_CONTRACT.map((row) => `${row.applicationContract} ${row.remainingExternalInput}`).join("\n");
    expect(joined).not.toMatch(/Cloud Run service/);
    expect(joined).not.toMatch(/\b(vCPU|GiB|min instances|max instances|autoscaling)\b/i);
    expect(PRODUCTION_DEPLOYMENT_CONTRACT.find((row) => row.id === "container")?.remainingExternalInput).toMatch(/UNSELECTED/);
    expect(COMPILED_API_ENTRYPOINT).toBe("node dist/main.js");
    expect(SEPARATE_MIGRATE_COMMAND).toContain("migrate");
    expect(API_HEALTH_PATH).toBe("/health");
    expect(API_READY_PATH).toBe("/ready");
    expect(SECRET_REFERENCE_CONTRACT).toMatch(/process env/);
  });

  it("keeps H-186 compiled workspace exports and the API start entrypoint", () => {
    const apiPkg = JSON.parse(readFileSync(join(apiRoot, "package.json"), "utf8")) as {
      scripts: { start: string; build: string };
    };
    const dbPkg = JSON.parse(readFileSync(join(dbRoot, "package.json"), "utf8")) as {
      exports: { ".": { import: string; default: string; source: string } };
      scripts: { migrate: string };
    };
    const kernelPkg = JSON.parse(readFileSync(join(repoRoot, "packages/kernel/package.json"), "utf8")) as {
      exports: { ".": { import: string; default: string } };
    };
    const rootPkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      engines: { node: string };
    };
    expect(apiPkg.scripts.start).toBe(COMPILED_API_ENTRYPOINT);
    expect(apiPkg.scripts.build).toBe("tsc -p tsconfig.json");
    expect(dbPkg.exports["."].import).toBe("./dist/index.js");
    expect(dbPkg.exports["."].default).toBe("./dist/index.js");
    expect(dbPkg.exports["."].source).toBe("./src/index.ts");
    expect(kernelPkg.exports["."].import).toBe("./dist/index.js");
    expect(rootPkg.engines.node).toBe(">=20");
    expect(dbPkg.scripts.migrate).toMatch(/migrate-cli/);
    const dbIndex = readFileSync(join(dbRoot, "src/index.ts"), "utf8");
    expect(dbIndex).toMatch(/join\(dirname\(fileURLToPath\(import\.meta\.url\)\), "\.\."\)/);
  });

  it("records that no Production container/IaC manifest exists and does not invent one", () => {
    expect(repositoryHasProductionContainerManifest(repoRoot)).toBe(false);
    expect(existsSync(join(repoRoot, "infra/compose/dev.yaml"))).toBe(true);
  });

  it("refuses silent loopback listen bind in Production and UAT while keeping Dev/Test isolation", () => {
    expect(listenHostFromEnv({})).toBe("127.0.0.1");
    expect(resolveApiListenPort({})).toBe(DEFAULT_API_PORT);
    expect(productionLikeListenBindForbiddenReason({ EOS_ENV: "development" })).toBeUndefined();
    expect(productionLikeListenBindForbiddenReason({ EOS_ENV: "production" })).toMatch(/EOS_LISTEN_HOST must be explicit/);
    expect(
      productionLikeListenBindForbiddenReason({ EOS_ENV: "uat", EOS_LISTEN_HOST: "127.0.0.1" }),
    ).toMatch(/must not be localhost/);
    expect(
      productionLikeListenBindForbiddenReason({ EOS_ENV: "production", EOS_LISTEN_HOST: "0.0.0.0" }),
    ).toBeUndefined();
    expect(validateDeploymentConfig(almostCompleteProductionEnv({ EOS_LISTEN_HOST: "" })).fatal.some((f) => f.includes("EOS_LISTEN_HOST"))).toBe(
      true,
    );
    expect(validateDeploymentConfig({ NODE_ENV: "test", EOS_ENV: "development" }).fatal).toEqual([]);
  });

  it("keeps H-187, H-188, H-189, and H-190 Production/UAT gates", () => {
    const url = "postgres://eos@db.example.invalid:5432/eos_h191";
    expect(shouldApplyStartupMigrations(url, { EOS_ENV: "production" })).toEqual({
      apply: false,
      reason: "production_gate_c_not_authorized",
    });
    expect(shouldSyncStoreToPostgresOnStartup({ EOS_ENV: "uat" }).apply).toBe(false);
    const store = seedStore("h191-drain", TEST_BOOTSTRAP_SECRETS);
    store.eventTransport = createInMemoryDevTransport(store.publishedBus);
    store.eventTransportKind = "in-memory-dev";
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "production" }).apply).toBe(false);
    expect(
      validateDeploymentConfig(almostCompleteProductionEnv({ EOS_EMAIL_ADAPTER: "dev-outbox" })).fatal.some((f) =>
        f.includes("dev-outbox"),
      ),
    ).toBe(true);
    expect(
      validateDeploymentConfig(almostCompleteProductionEnv({ EOS_PUBLIC_ORIGIN: "http://localhost:3000" })).fatal.some((f) =>
        f.includes("EOS_PUBLIC_ORIGIN"),
      ),
    ).toBe(true);
    const filled = validateDeploymentConfig(almostCompleteProductionEnv());
    expect(filled.productionReady).toBe(false);
    expect(filled.fatal.some((f) => f.includes("IdP") || f.includes("GAP-IDN-02"))).toBe(true);
    expect(filled.fatal.some((f) => f.includes("object-store") || f.includes("FUTURE PROVIDER"))).toBe(true);
    expect(filled.fatal.some((f) => f.includes("EOS_LISTEN_HOST"))).toBe(false);
  });

  it("uses a deterministic migration package that Production startup cannot apply", () => {
    const schema = join(dbRoot, "schema.sql");
    expect(existsSync(schema)).toBe(true);
    const files = readdirSync(join(dbRoot, "migrations")).filter((name) => name.endsWith(".sql")).sort();
    const numbers = files.map((name) => Number(name.slice(0, 3)));
    expect(numbers[0]).toBe(1);
    expect(numbers.at(-1)).toBe(125);
    expect(existsSync(join(dbRoot, "migrations/126_placeholder.sql"))).toBe(false);
    const missing = [];
    for (let n = 1; n <= 125; n += 1) {
      if (!numbers.includes(n)) missing.push(n);
    }
    expect(missing).toEqual([112, 113, 114, 115, 116]);
    const migrateCli = readFileSync(join(dbRoot, "src/migrate-cli.ts"), "utf8");
    expect(migrateCli).toContain("migrateTargetRefuseReason");
    const startup = readFileSync(join(apiRoot, "src/persistence/startup-migrations.ts"), "utf8");
    expect(startup).toContain("production_gate_c_not_authorized");
  });

  it("documents the compiled startup sequence and health/shutdown contract in main.ts", () => {
    const main = readFileSync(join(apiRoot, "src/main.ts"), "utf8");
    const validateIdx = main.indexOf("validateDeploymentConfig(process.env)");
    const poolIdx = main.indexOf("createPool(databaseUrl");
    const transportIdx = main.indexOf("await initEventTransport");
    const drainIdx = main.indexOf("shouldDrainOutboxOnStartup(store)");
    const consumerIdx = main.indexOf("await initEventConsumers");
    const listenIdx = main.indexOf("await app.listen");
    expect(validateIdx).toBeGreaterThan(0);
    expect(poolIdx).toBeGreaterThan(validateIdx);
    expect(transportIdx).toBeGreaterThan(poolIdx);
    expect(drainIdx).toBeGreaterThan(transportIdx);
    expect(consumerIdx).toBeGreaterThan(drainIdx);
    expect(listenIdx).toBeGreaterThan(consumerIdx);
    expect(main).toContain("resolveApiListenPort");
    expect(main.indexOf("await shutdownEventConsumers()")).toBeGreaterThan(0);
    expect(main.indexOf('process.on("SIGTERM"')).toBeGreaterThan(main.indexOf("await shutdownEventConsumers()"));
    const server = readFileSync(join(apiRoot, "src/server.ts"), "utf8");
    expect(server).toContain('app.get("/health"');
    expect(server).toContain('app.get("/ready"');
    expect(server).toContain("productionReady: false");
  });
});
