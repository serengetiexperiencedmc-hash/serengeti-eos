import { describe, expect, it } from "vitest";
import { seedStore } from "../src/app.js";
import {
  ENV_EXAMPLE_TOKEN_PLACEHOLDER,
  listenHostFromEnv,
  validateDeploymentConfig,
} from "../src/deployment-config.js";
import { DEV_ONLY_TOKEN_SECRET_FALLBACK } from "../src/devtest-token-secret.js";
import { initEventTransport } from "../src/events/transport-init.js";
import { createLogger } from "../src/observability.js";
import { buildServer } from "../src/server.js";

describe("E1-C provider-neutral deployment configuration", () => {
  it("allows Dev/Test defaults without claiming Production readiness", () => {
    const result = validateDeploymentConfig({
      NODE_ENV: "test",
      EOS_ENV: "development",
    });
    expect(result.productionLike).toBe(false);
    expect(result.productionReady).toBe(false);
    expect(result.fatal).toEqual([]);
    expect(result.warnings.some((w) => w.includes("memory-only"))).toBe(true);
    expect(listenHostFromEnv({})).toBe("127.0.0.1");
  });

  it("fails closed in Production-like env when Dev/Test services would otherwise be substituted", () => {
    const result = validateDeploymentConfig({
      EOS_ENV: "production",
      EOS_TOKEN_SECRET: ENV_EXAMPLE_TOKEN_PLACEHOLDER,
      EOS_SEED_DEMO: "true",
      EOS_BOOTSTRAP_CAROL_PASSWORD: "test-carol-not-for-prod",
    });
    expect(result.productionLike).toBe(true);
    expect(result.productionReady).toBe(false);
    expect(result.fatal.some((f) => f.includes("placeholder"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("EOS_DATABASE_URL"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("in-memory-dev"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("dev-outbox"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("EOS_SEED_DEMO"))).toBe(true);
    expect(result.fatal.some((f) => f.includes("local-password") || f.includes("GAP-IDN-02") || f.includes("IdP"))).toBe(
      true,
    );
    expect(result.fatal.some((f) => f.includes("EOS_BOOTSTRAP_CAROL_PASSWORD"))).toBe(true);
  });

  it("refuses the known Dev/Test token fallback as a Production secret", () => {
    const result = validateDeploymentConfig({
      EOS_ENV: "uat",
      EOS_TOKEN_SECRET: DEV_ONLY_TOKEN_SECRET_FALLBACK,
      EOS_DATABASE_URL: "postgres://example.invalid/eos",
      EOS_EVENT_TRANSPORT: "nats-jetstream",
      EOS_NATS_URL: "nats://example.invalid:4222",
      EOS_EMAIL_ADAPTER: "ses",
      EOS_SES_REGION: "REPLACE_WITH_PROVIDER_REGION_NOT_SELECTED",
    });
    expect(result.productionReady).toBe(false);
    expect(result.fatal.some((f) => f.includes("placeholder") || f.includes("Dev/Test"))).toBe(true);
  });

  it("still reports productionReady false when Production-like required fields are present", () => {
    const result = validateDeploymentConfig({
      EOS_ENV: "production",
      EOS_TOKEN_SECRET: "a-non-placeholder-secret-value",
      EOS_DATABASE_URL: "postgres://example.invalid/eos",
      EOS_EVENT_TRANSPORT: "nats-jetstream",
      EOS_NATS_URL: "nats://example.invalid:4222",
      EOS_EMAIL_ADAPTER: "ses",
      EOS_SES_REGION: "REPLACE_WITH_PROVIDER_REGION_NOT_SELECTED",
    });
    expect(result.productionReady).toBe(false);
    expect(result.fatal.some((f) => f.includes("IdP") || f.includes("GAP-IDN-02") || f.includes("MFA"))).toBe(true);
  });
});

describe("E1-C event transport fail-closed", () => {
  it("keeps in-memory-dev in non-Production-like env", async () => {
    const store = seedStore("e1c-dep-mem");
    await initEventTransport(store, createLogger("info"), { NODE_ENV: "test", EOS_ENV: "development" });
    expect(store.eventTransportKind).toBe("in-memory-dev");
  });

  it("refuses in-memory-dev substitution when Production-like flags are set", async () => {
    const store = seedStore("e1c-dep-prod-mem");
    await expect(
      initEventTransport(store, createLogger("info"), { EOS_ENV: "production" }),
    ).rejects.toThrow(/in-memory-dev/);
  });

  it("refuses NATS stub substitution when Production-like flags request nats-jetstream without URL", async () => {
    const store = seedStore("e1c-dep-prod-nats");
    await expect(
      initEventTransport(store, createLogger("info"), {
        EOS_ENV: "production",
        EOS_EVENT_TRANSPORT: "nats-jetstream",
      }),
    ).rejects.toThrow(/EOS_NATS_URL/);
  });
});

describe("E1-C readiness honesty after config validation", () => {
  it("reports productionReady false on /health and /ready", async () => {
    const app = buildServer({ store: seedStore("e1c-dep-ready") });
    const health = await app.inject({ method: "GET", url: "/health" });
    const ready = await app.inject({ method: "GET", url: "/ready" });
    expect(health.statusCode).toBe(200);
    expect(health.json().productionReady).toBe(false);
    expect(ready.json().productionReady).toBe(false);
    await app.close();
  });
});
