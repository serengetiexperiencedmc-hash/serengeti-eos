import { isSesConfigured, isSmtpConfigured } from "@sedmc/kernel";
import { isProductionLikeEnv } from "../devtest-token-secret.js";

export const DEVTEST_EMAIL_ADAPTERS = ["dev-outbox", "smtp-stub", "ses-stub"] as const;
export const PRODUCTION_PATH_EMAIL_ADAPTERS = ["ses", "smtp"] as const;
export const SES_REGION_DEVTEST_PLACEHOLDER = "REPLACE_WITH_PROVIDER_REGION_NOT_SELECTED";

function requestedEmailAdapter(env: NodeJS.Dict<string> | NodeJS.ProcessEnv): string {
  return env.EOS_EMAIL_ADAPTER?.trim() || "dev-outbox";
}

function isDevTestMailbox(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v.endsWith(".local") || v.includes("sedmc.local");
}

function isLoopbackHostname(value: string): boolean {
  const host = value.trim().toLowerCase().replace(/^\[/, "").replace(/\]$/, "");
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

/** Hostname/URL loopback check used by email Production-like validation. */
export function isEmailLoopbackTarget(value: string): boolean {
  const trimmed = value.trim();
  try {
    const url = trimmed.includes("://") ? new URL(trimmed) : new URL(`tcp://${trimmed}`);
    return isLoopbackHostname(url.hostname);
  } catch {
    return isLoopbackHostname(trimmed);
  }
}

/**
 * Resolves the adapter that createEmailAdapter will actually construct.
 * Dev/Test may substitute stubs when SES/SMTP config is incomplete.
 * Production-like callers must not treat a stub as a selected Production product.
 */
export function resolveEmailAdapterName(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): string {
  const adapter = requestedEmailAdapter(env);
  if (adapter === "ses") return isSesConfigured(env as NodeJS.ProcessEnv) ? "ses" : "ses-stub";
  if (adapter === "smtp") return isSmtpConfigured(env as NodeJS.ProcessEnv) ? "smtp" : "smtp-stub";
  if (adapter === "smtp-stub") return "smtp-stub";
  if (adapter === "ses-stub") return "ses-stub";
  if (adapter === "dev-outbox") return "dev-outbox";
  if (isProductionLikeEnv(env)) return adapter;
  return "dev-outbox";
}

export function productionLikeEmailAdapterForbiddenReason(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv,
): string | undefined {
  if (!isProductionLikeEnv(env)) return undefined;
  const requested = env.EOS_EMAIL_ADAPTER?.trim();
  if (!requested) {
    return "EOS_EMAIL_ADAPTER is required in Production-like environments; refusing silent Dev/Test substitution (dev-outbox / smtp-stub / ses-stub)";
  }
  const resolved = resolveEmailAdapterName(env);
  if (DEVTEST_EMAIL_ADAPTERS.includes(resolved as (typeof DEVTEST_EMAIL_ADAPTERS)[number])) {
    return "dev-outbox / smtp-stub / ses-stub email adapters are forbidden in Production-like environments (no silent substitution)";
  }
  if (resolved !== "ses" && resolved !== "smtp") {
    return "unknown EOS_EMAIL_ADAPTER is refused in Production-like environments; Production email product remains UNSELECTED";
  }
  if (resolved === "ses") {
    const region = env.EOS_SES_REGION?.trim();
    if (!region) {
      return "EOS_EMAIL_ADAPTER=ses without EOS_SES_REGION is refused in Production-like environments (no ses-stub)";
    }
    if (region === SES_REGION_DEVTEST_PLACEHOLDER) {
      return "EOS_SES_REGION must not be the documented Dev/Test placeholder in Production-like environments";
    }
    const from = (env.EOS_SES_FROM ?? env.EOS_SMTP_FROM)?.trim();
    if (!from || isDevTestMailbox(from)) {
      return "EOS_EMAIL_ADAPTER=ses requires EOS_SES_FROM (or EOS_SMTP_FROM) that is not a Dev/Test .local address";
    }
  }
  if (resolved === "smtp") {
    const host = env.EOS_SMTP_HOST?.trim();
    if (!host) {
      return "EOS_EMAIL_ADAPTER=smtp without EOS_SMTP_HOST is refused in Production-like environments (no smtp-stub)";
    }
    if (isEmailLoopbackTarget(host)) {
      return "EOS_SMTP_HOST must not target localhost/127.0.0.1 in Production-like environments";
    }
    const from = env.EOS_SMTP_FROM?.trim();
    if (!from || isDevTestMailbox(from)) {
      return "EOS_EMAIL_ADAPTER=smtp requires EOS_SMTP_FROM that is not a Dev/Test .local address";
    }
  }
  return undefined;
}
