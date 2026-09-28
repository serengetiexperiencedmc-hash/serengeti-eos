/**
 * Provider-neutral deployment configuration validation.
 * Production-like environments fail closed. Dev/Test may continue with warnings.
 * Does not select a provider, geography, or Production architecture.
 * Does not create Production secrets.
 */

import { DEV_ONLY_TOKEN_SECRET_FALLBACK, isProductionLikeEnv } from "./devtest-token-secret.js";
import {
  localFsDocumentStorageForbiddenReason,
  localInfrastructureTargetForbiddenReason,
} from "./infrastructure-contract.js";
import { productionLikeEmailAdapterForbiddenReason } from "./notifications/email-config.js";
import { productionLikeListenBindForbiddenReason } from "./production-deployment-package.js";
import { providerNeutralContractFatals } from "./production-dependency-contract.js";
import { localPasswordIdentityForbiddenReason } from "./ports/identity.js";

export const ENV_EXAMPLE_TOKEN_PLACEHOLDER = "replace-with-long-random-dev-secret";

export type DeploymentConfigResult = {
  productionLike: boolean;
  productionReady: false;
  fatal: string[];
  warnings: string[];
};

const KNOWN_DEV_BOOTSTRAP_PASSWORDS = new Set([
  "test-alice-not-for-prod",
  "test-bob-not-for-prod",
  "test-carol-not-for-prod",
  "test-partner-not-for-prod",
]);

export function listenHostFromEnv(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): string {
  const host = env.EOS_LISTEN_HOST;
  if (host && host.trim() !== "") return host.trim();
  return "127.0.0.1";
}

function emailAdapterName(env: NodeJS.Dict<string> | NodeJS.ProcessEnv): string {
  return env.EOS_EMAIL_ADAPTER ?? "dev-outbox";
}

function eventTransportName(env: NodeJS.Dict<string> | NodeJS.ProcessEnv): string {
  return env.EOS_EVENT_TRANSPORT ?? "in-memory-dev";
}

function isLoopbackHostname(value: string): boolean {
  const host = value.trim().toLowerCase().replace(/^\[/, "").replace(/\]$/, "");
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

/** Loopback / documented Dev/Test hosts. Does not invent a Production hostname. */
export function isLoopbackNetworkTarget(value: string | undefined): boolean {
  if (!value || value.trim() === "") return false;
  const trimmed = value.trim();
  try {
    const url = trimmed.includes("://") ? new URL(trimmed) : new URL(`tcp://${trimmed}`);
    return isLoopbackHostname(url.hostname);
  } catch {
    return isLoopbackHostname(trimmed);
  }
}

export function validateDeploymentConfig(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): DeploymentConfigResult {
  const productionLike = isProductionLikeEnv(env);
  const fatal: string[] = [];
  const warnings: string[] = [];

  const token = env.EOS_TOKEN_SECRET;
  if (productionLike) {
    if (!token) {
      fatal.push("EOS_TOKEN_SECRET is required in Production-like environments; Dev/Test fallback is refused");
    } else if (token === DEV_ONLY_TOKEN_SECRET_FALLBACK || token === ENV_EXAMPLE_TOKEN_PLACEHOLDER) {
      fatal.push("EOS_TOKEN_SECRET must not be the documented Dev/Test placeholder in Production-like environments");
    }

    const identity = localPasswordIdentityForbiddenReason(env);
    if (identity) fatal.push(identity);

    const infraTarget = localInfrastructureTargetForbiddenReason(env);
    if (infraTarget) fatal.push(infraTarget);

    if (!env.EOS_DATABASE_URL) {
      fatal.push("EOS_DATABASE_URL is required in Production-like environments; in-memory persistence is refused");
    } else {
      if (isLoopbackNetworkTarget(env.EOS_DATABASE_URL)) {
        fatal.push("EOS_DATABASE_URL must not target localhost/127.0.0.1 in Production-like environments");
      }
      if (env.EOS_DATABASE_TLS_MODE !== "require") {
        fatal.push("EOS_DATABASE_TLS_MODE=require is required in Production-like environments; disable/default is Dev/Test only");
      }
    }

    const documentStorage = localFsDocumentStorageForbiddenReason(env);
    if (documentStorage) fatal.push(documentStorage);

    if (env.EOS_SEED_DEMO === "true") {
      fatal.push("EOS_SEED_DEMO is forbidden in Production-like environments");
    }

    const transport = eventTransportName(env);
    if (transport !== "nats-jetstream") {
      fatal.push("in-memory-dev event transport is forbidden in Production-like environments; refusing silent Dev/Test substitution");
    } else if (!env.EOS_NATS_URL) {
      fatal.push("EOS_NATS_URL is required when EOS_EVENT_TRANSPORT=nats-jetstream in Production-like environments; refusing NATS stub");
    } else if (isLoopbackNetworkTarget(env.EOS_NATS_URL)) {
      fatal.push("EOS_NATS_URL must not target localhost/127.0.0.1 in Production-like environments");
    }

    const emailReason = productionLikeEmailAdapterForbiddenReason(env);
    if (emailReason) fatal.push(emailReason);
    fatal.push(...providerNeutralContractFatals(env));
    const listenBind = productionLikeListenBindForbiddenReason(env);
    if (listenBind) fatal.push(listenBind);

    for (const key of [
      "EOS_BOOTSTRAP_ALICE_PASSWORD",
      "EOS_BOOTSTRAP_BOB_PASSWORD",
      "EOS_BOOTSTRAP_CAROL_PASSWORD",
      "EOS_BOOTSTRAP_PARTNER_PASSWORD",
    ] as const) {
      const value = env[key];
      if (value && KNOWN_DEV_BOOTSTRAP_PASSWORDS.has(value)) {
        fatal.push(`${key} must not use documented Dev/Test bootstrap passwords in Production-like environments`);
      }
    }
  } else {
    if (!env.EOS_DATABASE_URL) {
      warnings.push("EOS_DATABASE_URL unset: API will run memory-only (Dev/Test). Not a Production SoR.");
    }
    if (eventTransportName(env) !== "nats-jetstream") {
      warnings.push("event transport is in-memory-dev (Dev/Test). Production event product is unselected.");
    }
    if (emailAdapterName(env) === "dev-outbox") {
      warnings.push("email adapter is dev-outbox (Dev/Test). Production email product is unselected.");
    }
    if (listenHostFromEnv(env) === "127.0.0.1") {
      warnings.push("API listen host defaults to 127.0.0.1 (Dev/Test isolation). Production bind address is unselected.");
    }
  }

  return { productionLike, productionReady: false, fatal, warnings };
}
