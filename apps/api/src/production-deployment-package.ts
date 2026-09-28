/**
 * H-191 — Provider-neutral Production deployment package contract.
 * States how a future selected orchestrator/container must start the compiled
 * API. Does not select a cloud, base image, hostname, product, or sizing.
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isProductionLikeEnv } from "./devtest-token-secret.js";

export const PRODUCTION_DEPLOYMENT_BOUNDARIES = [
  "compiled_runtime",
  "container",
  "orchestrator",
  "postgresql",
  "migration",
  "secrets",
  "identity_mfa",
  "nats",
  "object_storage",
  "email",
  "public_origin_cors",
  "observability",
  "filesystem",
  "health_readiness",
  "shutdown",
] as const;

export type ProductionDeploymentBoundary = (typeof PRODUCTION_DEPLOYMENT_BOUNDARIES)[number];

export type ProductionDeploymentContractRow = {
  id: ProductionDeploymentBoundary;
  contractStatus: "closed" | "closed-with-limitations" | "open-external-input";
  applicationContract: string;
  remainingExternalInput: string;
};

/** Catalog only. Not a provider selection and not a Production Dockerfile. */
export const PRODUCTION_DEPLOYMENT_CONTRACT: readonly ProductionDeploymentContractRow[] = [
  {
    id: "compiled_runtime",
    contractStatus: "closed",
    applicationContract:
      "API: `node dist/main.js` from @sedmc/api after workspace tsc; @sedmc/db and @sedmc/kernel exports.import → dist/*.js. Web: `next start` after canonical next build. Runtime does not require TypeScript sources.",
    remainingExternalInput: "none for the Node entrypoint; web/API remain separate processes",
  },
  {
    id: "container",
    contractStatus: "open-external-input",
    applicationContract:
      "Minimum image contents: Node >=20; compiled apps/api/dist; packages/{db,kernel}/dist; production npm dependencies; process env injection. No Dockerfile in the repository.",
    remainingExternalInput: "base image, image registry, and container platform UNSELECTED",
  },
  {
    id: "orchestrator",
    contractStatus: "closed-with-limitations",
    applicationContract:
      "EOS_PORT (default 8080); explicit non-loopback EOS_LISTEN_HOST; SIGTERM/SIGINT graceful shutdown; process.exit(1) on startup fatal. Orchestrator PORT is not read — map PORT→EOS_PORT at injection if the platform injects PORT.",
    remainingExternalInput: "orchestrator product UNSELECTED (Cloud Run not configured)",
  },
  {
    id: "postgresql",
    contractStatus: "closed-with-limitations",
    applicationContract: "EOS_DATABASE_URL non-loopback; EOS_DATABASE_TLS_MODE=require; pool via createPool",
    remainingExternalInput: "PostgreSQL host/account/product UNSELECTED",
  },
  {
    id: "migration",
    contractStatus: "closed",
    applicationContract:
      "Separate operator command `npm run migrate -w @sedmc/db` (tsx migrate-cli). API Production-like startup must not call migrate(). Ledger schema_migrations; files schema.sql + migrations/001–125 with 112–116 unused numbers; 126 absent.",
    remainingExternalInput: "authorized migrate grant + target catalog (not this package)",
  },
  {
    id: "secrets",
    contractStatus: "closed-with-limitations",
    applicationContract: "SecretsProvider.get(reference) over process env names already consumed by code",
    remainingExternalInput: "secrets platform UNSELECTED (ADR-0012); inject raw values or replace the env-dev adapter later",
  },
  {
    id: "identity_mfa",
    contractStatus: "open-external-input",
    applicationContract: "local-password-dev fatal; authenticateFederated port exists; no OIDC env consumed",
    remainingExternalInput: "IdP/MFA product + issuer/JWKS/audience UNSELECTED",
  },
  {
    id: "nats",
    contractStatus: "closed-with-limitations",
    applicationContract:
      "EOS_EVENT_TRANSPORT=nats-jetstream; tls:// or nats+tls:// EOS_NATS_URL with userinfo; health().ok before outbox drain; consumers after drain",
    remainingExternalInput: "NATS hoster/credentials product UNSELECTED",
  },
  {
    id: "object_storage",
    contractStatus: "open-external-input",
    applicationContract: "DocumentStorage put/get/exists/stat/delete; local-fs and unimplemented future both fatal",
    remainingExternalInput: "object-store product, bucket/container, credentials UNSELECTED — no env names invented",
  },
  {
    id: "email",
    contractStatus: "closed-with-limitations",
    applicationContract: "ses or smtp only; H-189/H-190 TLS, loopback, placeholder, .local From refusals",
    remainingExternalInput: "email product UNSELECTED",
  },
  {
    id: "public_origin_cors",
    contractStatus: "closed-with-limitations",
    applicationContract: "EOS_PUBLIC_ORIGIN https allow-list; localhost and wildcard refused",
    remainingExternalInput: "actual hostname value OPEN; DNS UNSELECTED",
  },
  {
    id: "observability",
    contractStatus: "closed",
    applicationContract: "stdout/stderr structured JSON; /health; /ready; correlation/request ids; secret redaction",
    remainingExternalInput: "log sink / APM vendor UNSELECTED (not required to start)",
  },
  {
    id: "filesystem",
    contractStatus: "closed",
    applicationContract:
      "Production-like must not use local-fs DocumentStorage. No other process-required persistent local writes. Read-only root is compatible once object storage is selected.",
    remainingExternalInput: "object-store product UNSELECTED",
  },
  {
    id: "health_readiness",
    contractStatus: "closed",
    applicationContract:
      "GET /health liveness JSON productionReady:false. GET /ready 200 iff dbHealth ok (503 otherwise); memory mode is Dev/Test only",
    remainingExternalInput: "none",
  },
  {
    id: "shutdown",
    contractStatus: "closed",
    applicationContract:
      "Default path: SIGTERM/SIGINT → shutdownEventConsumers → app.close → pool.end → exit(0). Startup fatals exit 1 before listen.",
    remainingExternalInput: "supervisor product UNSELECTED",
  },
];

export const COMPILED_API_ENTRYPOINT = "node dist/main.js";
export const COMPILED_API_START_SCRIPT = "node dist/main.js";
export const API_HEALTH_PATH = "/health";
export const API_READY_PATH = "/ready";
export const DEFAULT_API_PORT = 8080;
export const SEPARATE_MIGRATE_COMMAND = "npm run migrate -w @sedmc/db";

export const SECRET_VALUE_ENV_NAMES = [
  "EOS_TOKEN_SECRET",
  "EOS_DATABASE_URL",
  "EOS_NATS_URL",
  "EOS_BOOTSTRAP_ALICE_PASSWORD",
  "EOS_BOOTSTRAP_BOB_PASSWORD",
  "EOS_BOOTSTRAP_CAROL_PASSWORD",
  "EOS_BOOTSTRAP_PARTNER_PASSWORD",
  "EOS_SMTP_USER",
  "EOS_SMTP_PASS",
  "EOS_SES_ACCESS_KEY_ID",
  "EOS_SES_SECRET_ACCESS_KEY",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
] as const;

export const SECRET_REFERENCE_CONTRACT =
  "createEnvSecretsProvider treats the reference string as a process env name and returns the raw value. No secret-manager URI scheme is implemented.";

export const NON_SECRET_CONFIG_ENV_NAMES = [
  "EOS_ENV",
  "NODE_ENV",
  "EOS_PORT",
  "EOS_LISTEN_HOST",
  "EOS_PUBLIC_ORIGIN",
  "EOS_DATABASE_TLS_MODE",
  "EOS_DATABASE_POOL_SIZE",
  "EOS_EVENT_TRANSPORT",
  "EOS_EMAIL_ADAPTER",
  "EOS_SMTP_HOST",
  "EOS_SMTP_PORT",
  "EOS_SMTP_SECURE",
  "EOS_SMTP_FROM",
  "EOS_SES_REGION",
  "EOS_SES_FROM",
  "EOS_LOG_LEVEL",
  "EOS_INFRASTRUCTURE_TARGET",
  "EOS_DOCUMENT_STORAGE",
] as const;

function isLoopbackListenHost(value: string): boolean {
  const host = value.trim().toLowerCase().replace(/^\[/, "").replace(/\]$/, "");
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

/**
 * Production-like must not silently bind Dev/Test loopback.
 * Does not select 0.0.0.0 as a Production architecture; it is a valid injected shape.
 */
export function productionLikeListenBindForbiddenReason(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): string | undefined {
  if (!isProductionLikeEnv(env)) return undefined;
  const raw = env.EOS_LISTEN_HOST?.trim();
  if (!raw) {
    return "EOS_LISTEN_HOST must be explicit in Production-like environments; silent 127.0.0.1 default is Dev/Test isolation";
  }
  if (isLoopbackListenHost(raw)) {
    return "EOS_LISTEN_HOST must not be localhost/127.0.0.1 in Production-like environments";
  }
  return undefined;
}

export function resolveApiListenPort(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): number {
  const parsed = Number(env.EOS_PORT ?? DEFAULT_API_PORT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_API_PORT;
}

export function repositoryHasProductionContainerManifest(repoRoot: string): boolean {
  return (
    existsSync(join(repoRoot, "Dockerfile")) ||
    existsSync(join(repoRoot, "docker-compose.yml")) ||
    existsSync(join(repoRoot, "compose.yaml")) ||
    existsSync(join(repoRoot, "apps/api/Dockerfile"))
  );
}

export function apiPackageRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..");
}
