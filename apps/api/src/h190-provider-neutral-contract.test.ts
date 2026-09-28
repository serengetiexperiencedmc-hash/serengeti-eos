import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createInMemoryDevTransport } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { validateDeploymentConfig } from "./deployment-config.js";
import { applyCors, isDevTestAllowedOrigin } from "./devtest-http-controls.js";
import { createLogger } from "./observability.js";
import { shouldApplyStartupMigrations, shouldSyncStoreToPostgresOnStartup } from "./persistence/startup-migrations.js";
import { shouldDrainOutboxOnStartup } from "./persistence/startup-outbox.js";
import {
  natsUrlHasUserinfo,
  natsUrlUsesTls,
  PRODUCTION_DEPENDENCY_CLASSES,
  PRODUCTION_DEPENDENCY_CONTRACT,
  productionLikeNatsContractForbiddenReasons,
  productionLikePublicOriginForbiddenReason,
  productionLikeSmtpTlsForbiddenReason,
  redactUrlUserinfo,
} from "./production-dependency-contract.js";

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

function fakeReq(origin?: string) {
  return {
    method: "OPTIONS",
    headers: origin ? { origin } : {},
  } as never;
}

function fakeReply() {
  const headers: Record<string, string> = {};
  return {
    headers,
    header(name: string, value: string) {
      headers[name.toLowerCase()] = value;
      return this;
    },
  } as never;
}

describe("H-190 provider-neutral Production dependency contract", () => {
  it("catalogues every declared dependency class without selecting a product", () => {
    const ids = PRODUCTION_DEPENDENCY_CONTRACT.map((row) => row.id);
    expect(ids).toEqual([...PRODUCTION_DEPENDENCY_CLASSES]);
    expect(PRODUCTION_DEPENDENCY_CONTRACT.every((row) => row.providerSpecificInputs.includes("UNSELECTED") || row.status === "application-emitted")).toBe(
      true,
    );
  });

  it("keeps H-187, H-188, and H-189 Production/UAT gates", () => {
    const url = "postgres://eos@db.example.invalid:5432/eos_h190";
    expect(shouldApplyStartupMigrations(url, { EOS_ENV: "production" }).apply).toBe(false);
    expect(shouldSyncStoreToPostgresOnStartup({ EOS_ENV: "uat" }).apply).toBe(false);
    const store = seedStore("h190-drain", TEST_BOOTSTRAP_SECRETS);
    store.eventTransport = createInMemoryDevTransport(store.publishedBus);
    store.eventTransportKind = "in-memory-dev";
    expect(shouldDrainOutboxOnStartup(store, { EOS_ENV: "production" }).apply).toBe(false);
    expect(
      validateDeploymentConfig(almostCompleteProductionEnv({ EOS_EMAIL_ADAPTER: "ses-stub" })).fatal.some((f) =>
        f.includes("ses-stub"),
      ),
    ).toBe(true);
  });

  it("requires a https non-loopback public origin in Production-like env without inventing a hostname", () => {
    expect(productionLikePublicOriginForbiddenReason({ EOS_ENV: "production" })).toMatch(/EOS_PUBLIC_ORIGIN/);
    expect(
      productionLikePublicOriginForbiddenReason({ EOS_ENV: "uat", EOS_PUBLIC_ORIGIN: "http://localhost:3000" }),
    ).toMatch(/https|localhost/);
    expect(
      productionLikePublicOriginForbiddenReason({ EOS_ENV: "production", EOS_PUBLIC_ORIGIN: "*" }),
    ).toMatch(/wildcard/);
    expect(
      productionLikePublicOriginForbiddenReason({
        EOS_ENV: "production",
        EOS_PUBLIC_ORIGIN: "https://app.example.invalid",
      }),
    ).toBeUndefined();
    expect(productionLikePublicOriginForbiddenReason({ NODE_ENV: "test" })).toBeUndefined();
  });

  it("requires NATS TLS scheme and URL userinfo in Production-like env", () => {
    expect(natsUrlUsesTls("nats://broker.example.invalid:4222")).toBe(false);
    expect(natsUrlUsesTls("tls://nats-user:x@broker.example.invalid:4222")).toBe(true);
    expect(natsUrlHasUserinfo("tls://broker.example.invalid:4222")).toBe(false);
    expect(natsUrlHasUserinfo("tls://nats-user:x@broker.example.invalid:4222")).toBe(true);
    const plain = productionLikeNatsContractForbiddenReasons({
      EOS_ENV: "production",
      EOS_EVENT_TRANSPORT: "nats-jetstream",
      EOS_NATS_URL: "nats://broker.example.invalid:4222",
    });
    expect(plain.some((f) => f.includes("tls://"))).toBe(true);
    expect(plain.some((f) => f.includes("userinfo"))).toBe(true);
    expect(
      productionLikeNatsContractForbiddenReasons({
        EOS_ENV: "production",
        EOS_EVENT_TRANSPORT: "nats-jetstream",
        EOS_NATS_URL: "tls://nats-user:x@broker.example.invalid:4222",
      }),
    ).toEqual([]);
  });

  it("requires SMTP TLS for Production-like smtp adapter and redacts NATS userinfo", () => {
    expect(
      productionLikeSmtpTlsForbiddenReason({
        EOS_ENV: "production",
        EOS_EMAIL_ADAPTER: "smtp",
        EOS_SMTP_HOST: "mail.example.invalid",
      }),
    ).toMatch(/EOS_SMTP_SECURE/);
    expect(
      productionLikeSmtpTlsForbiddenReason({
        EOS_ENV: "production",
        EOS_EMAIL_ADAPTER: "smtp",
        EOS_SMTP_HOST: "mail.example.invalid",
        EOS_SMTP_SECURE: "true",
      }),
    ).toBeUndefined();
    expect(redactUrlUserinfo("tls://nats-user:super-secret@broker.example.invalid:4222")).not.toContain("super-secret");
  });

  it("consumes EOS_PUBLIC_ORIGIN for Production-like CORS and keeps Dev/Test localhost policy", () => {
    const logger = createLogger("error");
    const prodEnv = { EOS_ENV: "production", EOS_PUBLIC_ORIGIN: "https://app.example.invalid" };
    const allowed = applyCors(fakeReq("https://app.example.invalid"), fakeReply(), logger, prodEnv);
    expect(allowed.allowed).toBe(true);
    const localhost = applyCors(fakeReq("http://localhost:3000"), fakeReply(), logger, prodEnv);
    expect(localhost.allowed).toBe(false);
    const wildcard = applyCors(fakeReq("*"), fakeReply(), logger, prodEnv);
    expect(wildcard.allowed).toBe(false);
    expect(isDevTestAllowedOrigin("http://localhost:3000")).toBe(true);
    const dev = applyCors(fakeReq("http://localhost:3000"), fakeReply(), logger, { NODE_ENV: "test" });
    expect(dev.allowed).toBe(true);
  });

  it("still reports productionReady false and unselected IdP/object-store when the contract shape is filled", () => {
    const result = validateDeploymentConfig(almostCompleteProductionEnv());
    expect(result.productionReady).toBe(false);
    expect(result.fatal.some((f) => f.includes("IdP") || f.includes("GAP-IDN-02"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("object-store") || f.includes("FUTURE PROVIDER"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("EOS_PUBLIC_ORIGIN"))).toBe(false);
    expect(result.fatal.some((f) => f.includes("tls://"))).toBe(false);
  });

  it("wires consumer shutdown into the default SIGTERM path without rewriting H-187/H-188", () => {
    const main = readFileSync(join(root, "src/main.ts"), "utf8");
    const shutdownIdx = main.indexOf("await shutdownEventConsumers()");
    const closeIdx = main.indexOf("await app.close()");
    expect(shutdownIdx).toBeGreaterThan(0);
    expect(closeIdx).toBeGreaterThan(shutdownIdx);
    const migrations = readFileSync(join(root, "src/persistence/startup-migrations.ts"), "utf8");
    const outbox = readFileSync(join(root, "src/persistence/startup-outbox.ts"), "utf8");
    expect(migrations).toContain("production_gate_c_not_authorized");
    expect(outbox).toContain("production_like_in_memory_forbidden");
  });
});
