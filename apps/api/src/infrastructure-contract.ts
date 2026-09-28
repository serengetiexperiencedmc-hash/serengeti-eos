/**
 * Provider-neutral infrastructure contract (Dev/Test now; future SEDMC-owned or third-party later).
 * Does not select a provider, facility, geography, or Production architecture.
 * Local machine / local disk = DEV/TEST ONLY.
 */

import { tmpdir } from "node:os";
import { join } from "node:path";
import type { CreatePoolOptions } from "@sedmc/db";
import { isProductionLikeEnv } from "./devtest-token-secret.js";

export const INFRASTRUCTURE_TARGETS = ["local-devtest", "sedmc-owned-future", "third-party-future"] as const;
export type InfrastructureTarget = (typeof INFRASTRUCTURE_TARGETS)[number];

export const DOCUMENT_STORAGE_KINDS = ["local-fs", "future-object-store"] as const;
export type DocumentStorageKind = (typeof DOCUMENT_STORAGE_KINDS)[number];

export function resolveInfrastructureTarget(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): {
  target: InfrastructureTarget;
  label: "DEV/TEST ONLY" | "FUTURE PROVIDER IMPLEMENTATION";
  productionReady: false;
} {
  const raw = env.EOS_INFRASTRUCTURE_TARGET?.trim();
  const target: InfrastructureTarget =
    raw === "sedmc-owned-future" || raw === "third-party-future" ? raw : "local-devtest";
  return {
    target,
    label: target === "local-devtest" ? "DEV/TEST ONLY" : "FUTURE PROVIDER IMPLEMENTATION",
    productionReady: false,
  };
}

export function resolveDocumentStorageKind(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): DocumentStorageKind {
  const raw = env.EOS_DOCUMENT_STORAGE?.trim();
  if (raw === "future-object-store" || raw === "s3-compatible") return "future-object-store";
  return "local-fs";
}

export function resolveDocumentRoot(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): string {
  const configured = env.EOS_DOCUMENT_ROOT?.trim();
  if (configured) return configured;
  return join(tmpdir(), "serengeti-eos-documents");
}

export function resolveDatabasePoolOptions(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): CreatePoolOptions {
  const parsed = Number(env.EOS_DATABASE_POOL_SIZE);
  const max = Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
  const tlsMode = env.EOS_DATABASE_TLS_MODE === "require" ? "require" : "disable";
  return { max, tlsMode };
}

export function localFsDocumentStorageForbiddenReason(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): string | undefined {
  if (!isProductionLikeEnv(env)) return undefined;
  if (resolveDocumentStorageKind(env) === "local-fs") {
    return "local-fs DocumentStorage is DEV/TEST ONLY; Production object store is UNSELECTED (FUTURE PROVIDER IMPLEMENTATION)";
  }
  return "Production object-store adapter is FUTURE PROVIDER IMPLEMENTATION and is not implemented";
}

export function localInfrastructureTargetForbiddenReason(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): string | undefined {
  if (!isProductionLikeEnv(env)) return undefined;
  const { target } = resolveInfrastructureTarget(env);
  if (target === "local-devtest") {
    return "EOS_INFRASTRUCTURE_TARGET=local-devtest is DEV/TEST ONLY and must not be used as Production";
  }
  return "SEDMC-owned and third-party infrastructure targets remain FUTURE PROVIDER IMPLEMENTATION; not authorized";
}
