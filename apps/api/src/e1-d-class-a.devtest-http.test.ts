import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import {
  DEVTEST_LOGIN_RATE_LIMIT,
  isDevTestAllowedOrigin,
} from "../src/devtest-http-controls.js";

const P = TEST_BOOTSTRAP_SECRETS;

const REQUIRED_HEADERS = [
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "content-security-policy",
  "x-eos-devtest",
];

describe("E1-D Class A Dev/Test HTTP controls", () => {
  it("emits security headers on /health and login without HSTS or wildcard CORS", async () => {
    const app = buildServer({ store: seedStore("e1d-headers") });
    const health = await app.inject({ method: "GET", url: "/health" });
    expect(health.statusCode).toBe(200);
    expect(health.json().productionReady).toBe(false);
    for (const name of REQUIRED_HEADERS) {
      expect(health.headers[name], name).toBeTruthy();
    }
    expect(health.headers["x-content-type-options"]).toBe("nosniff");
    expect(health.headers["x-frame-options"]).toBe("DENY");
    expect(health.headers["strict-transport-security"]).toBeUndefined();
    expect(health.headers["access-control-allow-origin"]).toBeUndefined();

    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    expect(login.statusCode).toBe(200);
    expect(login.json().accessToken).toBeTruthy();
    for (const name of REQUIRED_HEADERS) {
      expect(login.headers[name], name).toBeTruthy();
    }
  });

  it("allows Dev/Test localhost origins and rejects others including *", async () => {
    expect(isDevTestAllowedOrigin("http://localhost:3000")).toBe(true);
    expect(isDevTestAllowedOrigin("http://127.0.0.1:8080")).toBe(true);
    expect(isDevTestAllowedOrigin("*")).toBe(false);
    expect(isDevTestAllowedOrigin("https://evil.example")).toBe(false);
    expect(isDevTestAllowedOrigin("http://example.com")).toBe(false);

    const app = buildServer({ store: seedStore("e1d-cors") });
    const allowed = await app.inject({
      method: "OPTIONS",
      url: "/v1/auth/login",
      headers: {
        origin: "http://localhost:3000",
        "access-control-request-method": "POST",
      },
    });
    expect(allowed.statusCode).toBe(204);
    expect(allowed.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(allowed.headers["access-control-allow-origin"]).not.toBe("*");

    const denied = await app.inject({
      method: "OPTIONS",
      url: "/v1/auth/login",
      headers: {
        origin: "https://evil.example",
        "access-control-request-method": "POST",
      },
    });
    expect(denied.statusCode).toBe(403);
    expect(denied.headers["access-control-allow-origin"]).toBeUndefined();

    const wildcard = await app.inject({
      method: "OPTIONS",
      url: "/health",
      headers: { origin: "*" },
    });
    expect(wildcard.statusCode).toBe(403);
    expect(wildcard.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("rate-limits burst login in-memory and a new process-local limiter allows login again", async () => {
    const app = buildServer({ store: seedStore("e1d-rate") });
    const payload = {
      email: "carol.admin@sedmc.local",
      password: "wrong-password",
      tenantSlug: "sedmc",
    };
    const codes: number[] = [];
    for (let i = 0; i < DEVTEST_LOGIN_RATE_LIMIT.maxAttempts + 1; i += 1) {
      const res = await app.inject({ method: "POST", url: "/v1/auth/login", payload });
      codes.push(res.statusCode);
    }
    expect(codes[0]).toBe(401);
    expect(codes.at(-1)).toBe(429);
    expect(codes.filter((c) => c === 429).length).toBeGreaterThanOrEqual(1);
    const limited = await app.inject({ method: "POST", url: "/v1/auth/login", payload });
    expect(limited.json().productionReady).toBe(false);
    expect(limited.json().scope).toBe("dev-test-in-memory");

    const restarted = buildServer({ store: seedStore("e1d-rate-restart") });
    const ok = await restarted.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    expect(ok.statusCode).toBe(200);
    expect(ok.json().accessToken).toBeTruthy();
  });

  it("does not import Helmet as a runtime dependency", async () => {
    const { createRequire } = await import("node:module");
    const require = createRequire(import.meta.url);
    const json = require("../package.json") as { dependencies?: Record<string, string> };
    expect(json.dependencies?.["@fastify/helmet"]).toBeUndefined();
    expect(json.dependencies?.helmet).toBeUndefined();
    expect(json.dependencies?.["@fastify/cors"]).toBeUndefined();
    expect(json.dependencies?.["@fastify/rate-limit"]).toBeUndefined();
  });
});
