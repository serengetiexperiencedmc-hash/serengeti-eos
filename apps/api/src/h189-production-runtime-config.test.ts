import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { isDevTestAllowedOrigin } from "./devtest-http-controls.js";
import {
  isLoopbackNetworkTarget,
  validateDeploymentConfig,
} from "./deployment-config.js";
import { createEmailAdapter } from "./notifications/email.js";
import {
  productionLikeEmailAdapterForbiddenReason,
  resolveEmailAdapterName,
  SES_REGION_DEVTEST_PLACEHOLDER,
} from "./notifications/email-config.js";
import { shouldApplyStartupMigrations, shouldSyncStoreToPostgresOnStartup } from "./persistence/startup-migrations.js";
import { shouldDrainOutboxOnStartup } from "./persistence/startup-outbox.js";
import { allPrincipals } from "./store.js";
import { createInMemoryDevTransport } from "@sedmc/kernel";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function almostCompleteProductionEnv(overrides: Record<string, string> = {}) {
  return {
    EOS_ENV: "production",
    EOS_TOKEN_SECRET: "a-non-placeholder-secret-value",
    EOS_DATABASE_URL: "postgres://eos@db.example.invalid:5432/eos",
    EOS_DATABASE_TLS_MODE: "require",
    EOS_INFRASTRUCTURE_TARGET: "sedmc-owned-future",
    EOS_DOCUMENT_STORAGE: "future-object-store",
    EOS_EVENT_TRANSPORT: "nats-jetstream",
    EOS_NATS_URL: "nats://broker.example.invalid:4222",
    EOS_EMAIL_ADAPTER: "smtp",
    EOS_SMTP_HOST: "mail.example.invalid",
    EOS_SMTP_FROM: "noreply@example.invalid",
    EOS_LISTEN_HOST: "0.0.0.0",
    ...overrides,
  };
}

describe("H-189 Production runtime configuration closure", () => {
  it("keeps H-187 and H-188 Production/UAT write and drain gates", () => {
    const url = "postgres://eos@db.example.invalid:5432/eos_h189";
    expect(shouldApplyStartupMigrations(url, { EOS_ENV: "production" }).apply).toBe(false);
    expect(shouldSyncStoreToPostgresOnStartup({ EOS_ENV: "uat" }).apply).toBe(false);
    const store = seedStore("h189-drain", TEST_BOOTSTRAP_SECRETS);
    store.eventTransport = createInMemoryDevTransport(store.publishedBus);
    store.eventTransportKind = "in-memory-dev";
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "production" }).apply).toBe(false);
  });

  it("refuses ses-stub, smtp-stub, unknown adapters, and silent ses/smtp stub substitution", () => {
    expect(
      validateDeploymentConfig(almostCompleteProductionEnv({ EOS_EMAIL_ADAPTER: "ses-stub" })).fatal.some((f) =>
        f.includes("ses-stub"),
      ),
    ).toBe(true);
    expect(
      validateDeploymentConfig(almostCompleteProductionEnv({ EOS_EMAIL_ADAPTER: "smtp-stub" })).fatal.some((f) =>
        f.includes("smtp-stub"),
      ),
    ).toBe(true);
    expect(
      validateDeploymentConfig(almostCompleteProductionEnv({ EOS_EMAIL_ADAPTER: "sendgrid" })).fatal.some((f) =>
        f.includes("unknown EOS_EMAIL_ADAPTER"),
      ),
    ).toBe(true);
    expect(
      validateDeploymentConfig(
        almostCompleteProductionEnv({ EOS_EMAIL_ADAPTER: "ses", EOS_SES_REGION: "" }),
      ).fatal.some((f) => f.includes("ses-stub") || f.includes("silent")),
    ).toBe(true);
    expect(productionLikeEmailAdapterForbiddenReason({ EOS_ENV: "uat", EOS_EMAIL_ADAPTER: "ses" })).toMatch(
      /ses-stub|silent/,
    );
  });

  it("aligns validation with the runtime resolver instead of the raw env name", () => {
    const env = { EOS_ENV: "production" as const, EOS_EMAIL_ADAPTER: "ses" };
    expect(resolveEmailAdapterName(env)).toBe("ses-stub");
    expect(productionLikeEmailAdapterForbiddenReason(env)).toBeTruthy();
    expect(resolveEmailAdapterName({ EOS_EMAIL_ADAPTER: "ses-stub", NODE_ENV: "test" })).toBe("ses-stub");
    expect(resolveEmailAdapterName({ EOS_EMAIL_ADAPTER: "sendgrid", NODE_ENV: "test" })).toBe("dev-outbox");
    expect(resolveEmailAdapterName({ EOS_ENV: "production", EOS_EMAIL_ADAPTER: "sendgrid" })).toBe("sendgrid");
  });

  it("refuses loopback PostgreSQL, NATS, and SMTP targets in Production-like env", () => {
    expect(isLoopbackNetworkTarget("postgres://eos@127.0.0.1:5432/eos")).toBe(true);
    expect(isLoopbackNetworkTarget("nats://localhost:4222")).toBe(true);
    expect(isLoopbackNetworkTarget("postgres://eos@db.example.invalid:5432/eos")).toBe(false);

    const db = validateDeploymentConfig(
      almostCompleteProductionEnv({ EOS_DATABASE_URL: "postgres://eos@127.0.0.1:5432/eos" }),
    );
    expect(db.fatal.some((f) => f.includes("EOS_DATABASE_URL") && f.includes("localhost"))).toBe(true);

    const nats = validateDeploymentConfig(
      almostCompleteProductionEnv({ EOS_NATS_URL: "nats://127.0.0.1:4222" }),
    );
    expect(nats.fatal.some((f) => f.includes("EOS_NATS_URL") && f.includes("localhost"))).toBe(true);

    const smtp = validateDeploymentConfig(
      almostCompleteProductionEnv({ EOS_SMTP_HOST: "127.0.0.1" }),
    );
    expect(smtp.fatal.some((f) => f.includes("EOS_SMTP_HOST"))).toBe(true);
  });

  it("refuses documented SES region placeholder and Dev/Test .local/.invalid From addresses", () => {
    const region = validateDeploymentConfig(
      almostCompleteProductionEnv({
        EOS_EMAIL_ADAPTER: "ses",
        EOS_SES_REGION: SES_REGION_DEVTEST_PLACEHOLDER,
        EOS_SES_FROM: "noreply@customer.example",
      }),
    );
    expect(region.fatal.some((f) => f.includes("EOS_SES_REGION") && f.includes("placeholder"))).toBe(true);

    const from = validateDeploymentConfig(
      almostCompleteProductionEnv({
        EOS_EMAIL_ADAPTER: "smtp",
        EOS_SMTP_HOST: "mail.example.invalid",
        EOS_SMTP_FROM: "noreply@sedmc.local",
      }),
    );
    expect(from.fatal.some((f) => f.includes("EOS_SMTP_FROM"))).toBe(true);
  });

  it("still cannot claim Production readiness when remaining unselected products are present as fatals", () => {
    const result = validateDeploymentConfig(
      almostCompleteProductionEnv({
        EOS_EMAIL_ADAPTER: "ses",
        EOS_SES_REGION: "eu-west-1",
        EOS_SES_FROM: "noreply@customer.example",
      }),
    );
    expect(result.productionReady).toBe(false);
    expect(result.fatal.some((f) => f.includes("IdP") || f.includes("GAP-IDN-02"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("object-store") || f.includes("FUTURE PROVIDER"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("FUTURE PROVIDER IMPLEMENTATION") && f.includes("infrastructure"))).toBe(
      true,
    );
  });

  it("keeps Dev/Test stub substitution and does not throw createEmailAdapter outside Production-like env", () => {
    const store = seedStore("h189-email", TEST_BOOTSTRAP_SECRETS);
    const principal = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    const adapter = createEmailAdapter(store, principal, { NODE_ENV: "test", EOS_EMAIL_ADAPTER: "ses-stub" });
    expect(adapter.name).toBe("ses-stub");
    expect(() =>
      createEmailAdapter(store, principal, { EOS_ENV: "production", EOS_EMAIL_ADAPTER: "ses-stub" }),
    ).toThrow(/Dev\/Test email adapter/);
  });

  it("does not allow wildcard or non-localhost CORS origins", () => {
    expect(isDevTestAllowedOrigin("*")).toBe(false);
    expect(isDevTestAllowedOrigin("https://example.com")).toBe(false);
    expect(isDevTestAllowedOrigin("http://localhost:3000")).toBe(true);
    expect(isDevTestAllowedOrigin("https://127.0.0.1:3000")).toBe(false);
  });

  it("does not rewrite H-187/H-188 gates in source", () => {
    const migrations = readFileSync(join(root, "src/persistence/startup-migrations.ts"), "utf8");
    const outbox = readFileSync(join(root, "src/persistence/startup-outbox.ts"), "utf8");
    expect(migrations).toContain("production_gate_c_not_authorized");
    expect(outbox).toContain("production_like_in_memory_forbidden");
  });
});
