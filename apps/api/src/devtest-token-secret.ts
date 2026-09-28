/**
 * E1-D Class A — token-secret fallback hygiene.
 * The known Dev/Test fallback must never be used when Production-like env flags are set.
 * This module does not create or persist a Production secret.
 */

export const DEV_ONLY_TOKEN_SECRET_FALLBACK = "dev-only-change-me";

export function isProductionLikeEnv(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): boolean {
  return env.EOS_ENV === "production" || env.EOS_ENV === "uat" || env.NODE_ENV === "production";
}

export function resolveDevTestTokenSecret(
  get: (reference: string) => string | undefined,
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): string {
  const fromEnv = get("EOS_TOKEN_SECRET");
  if (fromEnv !== undefined && fromEnv !== "") return fromEnv;
  if (isProductionLikeEnv(env)) {
    throw new Error(
      "EOS_TOKEN_SECRET is required when EOS_ENV is production/uat or NODE_ENV is production; the Dev/Test fallback must not be used",
    );
  }
  return DEV_ONLY_TOKEN_SECRET_FALLBACK;
}
