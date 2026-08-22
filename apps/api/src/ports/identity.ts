import {
  verifyPassword,
  type IdentityProvider,
  type StoredPrincipal,
} from "@sedmc/kernel";

type PrincipalIndex = {
  byEmail: Map<string, StoredPrincipal>;
  byId: Map<string, StoredPrincipal>;
};

/**
 * Development local password IdP. Not a corporate IdP (ADR-0013 OPEN).
 * Maps credentials → EOS principal id only; does not grant permissions.
 */
export function createLocalPasswordIdentityProvider(
  resolve: (email: string, tenantSlug: string) => StoredPrincipal | undefined,
  tenantSlugOf: (tenantId: string) => string | undefined,
): IdentityProvider {
  return {
    name: "local-password-dev",
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
