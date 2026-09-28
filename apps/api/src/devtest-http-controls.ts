/**
 * E1-D Class A — Dev/Test HTTP controls.
 * Not Production WAF/TLS/CORS/rate-limiting. No Helmet dependency. No Redis. No schema.
 */
import type { FastifyReply, FastifyRequest } from "fastify";
import { isProductionLikeEnv } from "./devtest-token-secret.js";
import type { Logger } from "./observability.js";
import { isProductionAllowedOrigin } from "./production-dependency-contract.js";

export const DEVTEST_LOGIN_RATE_LIMIT = {
  maxAttempts: 10,
  windowMs: 60_000,
  note: "Process-local in-memory Dev/Test limiter only. Restart clears state. Not a Production distributed rate-limit solution.",
} as const;

const DEVTEST_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'";

export function isDevTestAllowedOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    if (url.protocol !== "http:") return false;
    if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return false;
    return true;
  } catch {
    return false;
  }
}

export function applyDevTestSecurityHeaders(reply: FastifyReply): void {
  reply.header("X-Content-Type-Options", "nosniff");
  reply.header("X-Frame-Options", "DENY");
  reply.header("Referrer-Policy", "no-referrer");
  reply.header("Content-Security-Policy", DEVTEST_CSP);
  reply.header("Cache-Control", "no-store");
  reply.header("X-EOS-DevTest", "1");
}

export function applyDevTestCors(
  req: FastifyRequest,
  reply: FastifyReply,
  logger: Logger,
): { preflight: boolean; allowed: boolean } {
  const originHeader = req.headers.origin;
  const origin = typeof originHeader === "string" ? originHeader : undefined;
  if (!origin) {
    return { preflight: req.method === "OPTIONS", allowed: true };
  }
  if (origin === "*") {
    logger.warn("cors_origin_rejected", { origin, reason: "wildcard" });
    return { preflight: req.method === "OPTIONS", allowed: false };
  }
  if (!isDevTestAllowedOrigin(origin)) {
    logger.warn("cors_origin_rejected", { origin, reason: "not_devtest_localhost" });
    return { preflight: req.method === "OPTIONS", allowed: false };
  }
  reply.header("Access-Control-Allow-Origin", origin);
  reply.header("Access-Control-Allow-Credentials", "true");
  reply.header("Vary", "Origin");
  reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  reply.header(
    "Access-Control-Allow-Headers",
    "authorization,content-type,idempotency-key,x-correlation-id,if-match",
  );
  return { preflight: req.method === "OPTIONS", allowed: true };
}

export function applyCors(
  req: FastifyRequest,
  reply: FastifyReply,
  logger: Logger,
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): { preflight: boolean; allowed: boolean } {
  if (isProductionLikeEnv(env)) {
    return applyProductionOriginCors(req, reply, logger, env);
  }
  return applyDevTestCors(req, reply, logger);
}

function applyProductionOriginCors(
  req: FastifyRequest,
  reply: FastifyReply,
  logger: Logger,
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv,
): { preflight: boolean; allowed: boolean } {
  const originHeader = req.headers.origin;
  const origin = typeof originHeader === "string" ? originHeader : undefined;
  if (!origin) {
    return { preflight: req.method === "OPTIONS", allowed: true };
  }
  if (origin === "*" || !isProductionAllowedOrigin(origin, env)) {
    logger.warn("cors_origin_rejected", { origin, reason: "not_configured_public_origin" });
    return { preflight: req.method === "OPTIONS", allowed: false };
  }
  reply.header("Access-Control-Allow-Origin", origin);
  reply.header("Access-Control-Allow-Credentials", "true");
  reply.header("Vary", "Origin");
  reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  reply.header(
    "Access-Control-Allow-Headers",
    "authorization,content-type,idempotency-key,x-correlation-id,if-match",
  );
  return { preflight: req.method === "OPTIONS", allowed: true };
}

export type InMemoryLoginRateLimiter = {
  check(key: string): { limited: boolean; remaining: number };
};

export function createInMemoryLoginRateLimiter(
  opts: { maxAttempts: number; windowMs: number } = DEVTEST_LOGIN_RATE_LIMIT,
): InMemoryLoginRateLimiter {
  const hits = new Map<string, number[]>();
  return {
    check(key: string) {
      const now = Date.now();
      const windowStart = now - opts.windowMs;
      const recent = (hits.get(key) ?? []).filter((ts) => ts > windowStart);
      if (recent.length >= opts.maxAttempts) {
        hits.set(key, recent);
        return { limited: true, remaining: 0 };
      }
      recent.push(now);
      hits.set(key, recent);
      return { limited: false, remaining: opts.maxAttempts - recent.length };
    },
  };
}

export function loginRateLimitKey(req: FastifyRequest, email: string): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : undefined) ||
    req.ip ||
    "127.0.0.1";
  return `${ip}|${email.trim().toLowerCase()}`;
}
