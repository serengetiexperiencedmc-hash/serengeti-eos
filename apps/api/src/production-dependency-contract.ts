/**
 * H-190 — Provider-neutral Production dependency contract.
 * Names capabilities the compiled API requires. Does not select a company, product,
 * hostname, tenant, account, or secret value. ADR-0012 / ADR-0013 remain OPEN.
 */

import { isProductionLikeEnv } from "./devtest-token-secret.js";

export const PRODUCTION_DEPENDENCY_CLASSES = [
  "identity",
  "mfa",
  "postgresql",
  "postgresql_tls",
  "secrets",
  "kms",
  "document_storage",
  "event_transport",
  "nats_tls",
  "nats_authentication",
  "email",
  "public_origin",
  "cors",
  "observability",
  "process_supervision",
  "health_readiness",
] as const;

export type ProductionDependencyClass = (typeof PRODUCTION_DEPENDENCY_CLASSES)[number];

export type ProductionDependencyContractRow = {
  id: ProductionDependencyClass;
  requiredCapability: string;
  providerNeutralInputs: string;
  providerSpecificInputs: string;
  validationBoundary: string;
  runtimeConsumer: string;
  status: "fail-closed-unselected" | "implemented-devtest-only" | "implemented-with-unselected-product" | "application-emitted";
};

/** Catalog only. Not a provider selection. */
export const PRODUCTION_DEPENDENCY_CONTRACT: readonly ProductionDependencyContractRow[] = [
  {
    id: "identity",
    requiredCapability: "Federated subject mapping to an EOS principal (OIDC issuer + subject); password IdP is Dev/Test only",
    providerNeutralInputs: "IdentityProvider.authenticateFederated({ issuer, subject, tenantSlug })",
    providerSpecificInputs: "issuer URL, client id, JWKS/discovery — UNSELECTED (ADR-0013 OPEN)",
    validationBoundary: "local-password-dev forbidden in Production-like env",
    runtimeConsumer: "apps/api/src/ports/identity.ts, apps/api/src/app.ts login",
    status: "fail-closed-unselected",
  },
  {
    id: "mfa",
    requiredCapability: "MFA enforced for Human actors before a session is issued",
    providerNeutralInputs: "health/ready identity.mfaEnabled; GAP-IDN-02",
    providerSpecificInputs: "MFA product UNSELECTED",
    validationBoundary: "identity fatal names MFA not implemented",
    runtimeConsumer: "server.ts /health /ready",
    status: "fail-closed-unselected",
  },
  {
    id: "postgresql",
    requiredCapability: "Durable PostgreSQL SoR reachable by URL; no in-memory Production SoR",
    providerNeutralInputs: "EOS_DATABASE_URL (non-loopback)",
    providerSpecificInputs: "host, database name, account — UNSELECTED",
    validationBoundary: "missing / loopback fatal",
    runtimeConsumer: "packages/db createPool; main.ts",
    status: "implemented-with-unselected-product",
  },
  {
    id: "postgresql_tls",
    requiredCapability: "TLS with certificate verification",
    providerNeutralInputs: "EOS_DATABASE_TLS_MODE=require",
    providerSpecificInputs: "CA/client certificates UNSELECTED",
    validationBoundary: "mode !== require fatal",
    runtimeConsumer: "createPool ssl rejectUnauthorized:true",
    status: "implemented-with-unselected-product",
  },
  {
    id: "secrets",
    requiredCapability: "Resolve named secret references at process start",
    providerNeutralInputs: "SecretsProvider.get(reference)",
    providerSpecificInputs: "platform UNSELECTED (ADR-0012 OPEN); env-dev is Dev/Test only",
    validationBoundary: "EOS_TOKEN_SECRET required; placeholders refused",
    runtimeConsumer: "ports/secrets.ts createEnvSecretsProvider",
    status: "implemented-devtest-only",
  },
  {
    id: "kms",
    requiredCapability: "Process-level envelope encryption is not required by current field-cache code",
    providerNeutralInputs: "deriveFieldCacheKey(deviceId, principalId, salt) — device-local",
    providerSpecificInputs: "KMS product UNSELECTED; not a startup dependency",
    validationBoundary: "none (not consumed as process env)",
    runtimeConsumer: "packages/kernel/src/field-cache-crypto.ts",
    status: "fail-closed-unselected",
  },
  {
    id: "document_storage",
    requiredCapability: "put / get / exists / stat / delete of tenant-scoped bytes",
    providerNeutralInputs: "DocumentStorage port",
    providerSpecificInputs: "object-store product UNSELECTED",
    validationBoundary: "local-fs and unimplemented future both fatal",
    runtimeConsumer: "commercial-documents/storage.ts, service.ts",
    status: "fail-closed-unselected",
  },
  {
    id: "event_transport",
    requiredCapability: "Publish enterprise envelopes; health(); distinguish in-memory vs stub vs live",
    providerNeutralInputs: "EOS_EVENT_TRANSPORT=nats-jetstream; EventTransport.kind + health().ok",
    providerSpecificInputs: "NATS hosting product UNSELECTED",
    validationBoundary: "in-memory and stub refused in Production-like",
    runtimeConsumer: "events/transport-init.ts, nats-transport.ts",
    status: "implemented-with-unselected-product",
  },
  {
    id: "nats_tls",
    requiredCapability: "Authenticated NATS connection over TLS",
    providerNeutralInputs: "EOS_NATS_URL scheme tls:// or nats+tls://",
    providerSpecificInputs: "certificate/product UNSELECTED",
    validationBoundary: "plaintext nats:// refused in Production-like",
    runtimeConsumer: "nats.connect({ servers: url })",
    status: "implemented-with-unselected-product",
  },
  {
    id: "nats_authentication",
    requiredCapability: "Connection credentials (URL userinfo); product UNSELECTED",
    providerNeutralInputs: "userinfo on EOS_NATS_URL (username required)",
    providerSpecificInputs: "token/nkey/account UNSELECTED",
    validationBoundary: "missing URL userinfo fatal in Production-like",
    runtimeConsumer: "nats.connect servers URL",
    status: "implemented-with-unselected-product",
  },
  {
    id: "email",
    requiredCapability: "send() of transactional notifications; no Dev/Test sink",
    providerNeutralInputs: "EOS_EMAIL_ADAPTER ses|smtp + region/host + From (not .local)",
    providerSpecificInputs: "email product UNSELECTED",
    validationBoundary: "H-189 resolver + stubs/unknown/loopback/.local From",
    runtimeConsumer: "notifications/email.ts",
    status: "implemented-with-unselected-product",
  },
  {
    id: "public_origin",
    requiredCapability: "Explicit https public application origin",
    providerNeutralInputs: "EOS_PUBLIC_ORIGIN",
    providerSpecificInputs: "hostname UNSELECTED — value remains OPEN",
    validationBoundary: "missing / loopback / http / wildcard fatal in Production-like",
    runtimeConsumer: "origin-policy.ts CORS allow-list",
    status: "implemented-with-unselected-product",
  },
  {
    id: "cors",
    requiredCapability: "Allow-list the public origin; never wildcard",
    providerNeutralInputs: "EOS_PUBLIC_ORIGIN allow-list in Production-like; localhost HTTP in Dev/Test",
    providerSpecificInputs: "hostname UNSELECTED — same as public origin",
    validationBoundary: "wildcard and localhost refused in Production-like",
    runtimeConsumer: "server.ts onRequest hook",
    status: "implemented-with-unselected-product",
  },
  {
    id: "observability",
    requiredCapability: "Structured JSON logs, correlation ids, /health /ready",
    providerNeutralInputs: "EOS_LOG_LEVEL; createLogger; registerObservability",
    providerSpecificInputs: "APM/alerting vendor UNSELECTED; missing sink does not block startup",
    validationBoundary: "not a Production-like fatal",
    runtimeConsumer: "observability.ts",
    status: "application-emitted",
  },
  {
    id: "process_supervision",
    requiredCapability: "Single process listen; SIGINT/SIGTERM close Fastify, consumers, pool",
    providerNeutralInputs: "process.on SIGINT/SIGTERM; shutdownEventConsumers; app.close; pool.end",
    providerSpecificInputs: "orchestrator UNSELECTED",
    validationBoundary: "startup fatals exit 1 before listen",
    runtimeConsumer: "main.ts",
    status: "application-emitted",
  },
  {
    id: "health_readiness",
    requiredCapability: "Honest /health and /ready with productionReady=false until governance says otherwise",
    providerNeutralInputs: "none",
    providerSpecificInputs: "none",
    validationBoundary: "productionReady always false",
    runtimeConsumer: "server.ts",
    status: "application-emitted",
  },
];

const NATS_TLS_SCHEMES = new Set(["tls:", "nats+tls:"]);

function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

export function redactUrlUserinfo(value: string): string {
  const url = parseUrl(value);
  if (!url) return value;
  if (!url.username && !url.password) return value;
  url.username = "redacted";
  url.password = "";
  return url.toString();
}

export function natsUrlUsesTls(value: string): boolean {
  const url = parseUrl(value);
  if (!url) return false;
  return NATS_TLS_SCHEMES.has(url.protocol);
}

export function natsUrlHasUserinfo(value: string): boolean {
  const url = parseUrl(value);
  if (!url) return false;
  return url.username.trim() !== "";
}

export function productionLikePublicOriginForbiddenReason(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv,
): string | undefined {
  if (!isProductionLikeEnv(env)) return undefined;
  const raw = env.EOS_PUBLIC_ORIGIN?.trim();
  if (!raw) {
    return "EOS_PUBLIC_ORIGIN is required in Production-like environments; Production hostname remains UNSELECTED (no silent localhost CORS)";
  }
  if (raw === "*") {
    return "EOS_PUBLIC_ORIGIN must not be wildcard";
  }
  const url = parseUrl(raw);
  if (!url) {
    return "EOS_PUBLIC_ORIGIN must be an absolute URL";
  }
  if (url.protocol !== "https:") {
    return "EOS_PUBLIC_ORIGIN must use https in Production-like environments";
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
    return "EOS_PUBLIC_ORIGIN must not target localhost/127.0.0.1 in Production-like environments";
  }
  return undefined;
}

export function isProductionAllowedOrigin(
  origin: string,
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): boolean {
  const configured = env.EOS_PUBLIC_ORIGIN?.trim();
  if (!configured) return false;
  return origin === configured;
}

export function productionLikeNatsContractForbiddenReasons(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv,
): string[] {
  if (!isProductionLikeEnv(env)) return [];
  if ((env.EOS_EVENT_TRANSPORT ?? "in-memory-dev") !== "nats-jetstream") return [];
  const url = env.EOS_NATS_URL?.trim();
  if (!url) return [];
  const fatals: string[] = [];
  if (!natsUrlUsesTls(url)) {
    fatals.push(
      "EOS_NATS_URL must use tls:// or nats+tls:// in Production-like environments; plaintext nats:// is Dev/Test only (NATS product remains UNSELECTED)",
    );
  }
  if (!natsUrlHasUserinfo(url)) {
    fatals.push(
      "EOS_NATS_URL must include authentication userinfo in Production-like environments; credential product remains UNSELECTED",
    );
  }
  return fatals;
}

export function productionLikeSmtpTlsForbiddenReason(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv,
): string | undefined {
  if (!isProductionLikeEnv(env)) return undefined;
  if (env.EOS_EMAIL_ADAPTER?.trim() !== "smtp") return undefined;
  const host = env.EOS_SMTP_HOST?.trim();
  if (!host) return undefined;
  const port = Number(env.EOS_SMTP_PORT ?? 587);
  const secure = env.EOS_SMTP_SECURE === "true" || port === 465;
  if (!secure) {
    return "EOS_EMAIL_ADAPTER=smtp requires EOS_SMTP_SECURE=true or port 465 in Production-like environments (SMTP TLS; product remains UNSELECTED)";
  }
  return undefined;
}

export function providerNeutralContractFatals(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv,
): string[] {
  const fatals: string[] = [];
  const origin = productionLikePublicOriginForbiddenReason(env);
  if (origin) fatals.push(origin);
  fatals.push(...productionLikeNatsContractForbiddenReasons(env));
  const smtpTls = productionLikeSmtpTlsForbiddenReason(env);
  if (smtpTls) fatals.push(smtpTls);
  return fatals;
}
