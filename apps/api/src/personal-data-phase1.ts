/**
 * H-137 Phase B — deterministic retirement of removed person-data APIs.
 *
 * Classification: RETAIN — legitimate compatibility requirement.
 * Routes remain registered so authentication still applies and UI compile
 * compatibility is preserved until Phase C. This module is not a replacement
 * person-data layer: it never writes, hydrates, or reconstructs person records.
 *
 * Mutations and reads of retired person surfaces return this reason after authorize.
 */
export const PERSON_DOMAIN_REMOVED = "person_domain_removed" as const;

export function personDomainRemoved() {
  return { error: "invalid_request" as const, reason: PERSON_DOMAIN_REMOVED };
}
