import {
  verifyPassword,
  type IdentityProvider,
  type StoredPrincipal,
} from "@sedmc/kernel";
import { isProductionLikeEnv } from "../devtest-token-secret.js";

type PrincipalIndex = {
  byEmail: Map<string, StoredPrincipal>;
  byId: Map<string, StoredPrincipal>;
};

export const LOCAL_PASSWORD_IDP_NAME = "local-password-dev";

export function localPasswordIdentityForbiddenReason(
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): string | undefined {
  if (!isProductionLikeEnv(env)) return undefined;
  return "local-password-dev must not authenticate when EOS_ENV is production/uat or NODE_ENV is production; Production IdP is unselected (ADR-0013 OPEN; GAP-IDN-02 MFA not implemented in EOS)";
}

/**
 * Development local password IdP. Not a corporate IdP (ADR-0013 OPEN).
 * Maps credentials → EOS principal id only; does not grant permissions.
 * Must not be used as Production identity (GAP-IDN-02).
 */
export function createLocalPasswordIdentityProvider(
  resolve: (email: string, tenantSlug: string) => StoredPrincipal | undefined,
  tenantSlugOf: (tenantId: string) => string | undefined,
): IdentityProvider {
  return {
    name: LOCAL_PASSWORD_IDP_NAME,
    async authenticatePassword(input) {
      const principal = resolve(input.email, input.tenantSlug);
      if (!principal || principal.actorType !== "Human" || principal.status !== "active") {
        return { error: "invalid_credentials" };
      }
      const slug = tenantSlugOf(principal.tenantId);
      if (slug !== input.tenantSlug) return { error: "invalid_credentials" };
      if (!principal.passwordHash || !verifyPassword(input.password, principal.passwordHash)) {
        return { error: "invalid_credentials" };
      }
      return { principalId: principal.id };
    },
  };
}

export function buildPrincipalIndex(principals: Iterable<StoredPrincipal>): PrincipalIndex {
  const byEmail = new Map<string, StoredPrincipal>();
  const byId = new Map<string, StoredPrincipal>();
  for (const p of principals) {
    byId.set(p.id, p);
    if (p.email) {
      byEmail.set(p.email.toLowerCase(), p);
      byEmail.set(p.email, p);
    }
  }
  return { byEmail, byId };
}
