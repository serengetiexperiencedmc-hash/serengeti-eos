import type { ActorType, Principal } from "./types.js";

/**
 * Authentication port — IdP product is NOT selected (ADR-0013 OPEN).
 * Implementations map an authenticated subject to an EOS Principal id.
 * Authorization stays in EOS RBAC/ABAC.
 */
export type AuthenticatedSubject = {
  externalSubjectId: string;
  email?: string;
  displayName?: string;
  actorType: ActorType;
  tenantSlug: string;
};

export type IdentityProvider = {
  readonly name: string;
  authenticatePassword?(input: {
    email: string;
    password: string;
    tenantSlug: string;
  }): Promise<{ principalId: string } | { error: "invalid_credentials" }>;
};

/**
 * Secrets port — production platform NOT selected (ADR-0012 OPEN).
 * Code must only hold references, never commit secret values.
 */
export type SecretsProvider = {
  readonly name: string;
  get(reference: string): string | undefined;
};

export type SessionRecord = {
  id: string;
  tenantId: string;
  principalId: string;
  tokenId: string;
  issuedAt: string;
  expiresAt: string;
  revokedAt?: string;
};

export type OrgUnitRecord = {
  id: string;
  tenantId: string;
  organisationId: string;
  parentId?: string;
  code: string;
  name: string;
  departmentKey: string;
  unitType: "business_unit" | "department" | "team" | "desk";
  costCenterId?: string;
  locationId?: string;
};

export type LocationRecord = {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  countryCode?: string;
  city?: string;
};

export type CostCenterRecord = {
  id: string;
  tenantId: string;
  code: string;
  name: string;
};

export type GroupRecord = {
  id: string;
  tenantId: string;
  key: string;
  name: string;
  memberPrincipalIds: string[];
};

export type RoleRecord = {
  id: string;
  tenantId: string;
  key: string;
  name: string;
  description?: string;
  permissionKeys: string[];
};

export type RoleGrant = {
  id: string;
  tenantId: string;
  principalId: string;
  roleKey: string;
  scopeOrgUnitId?: string;
  grantedAt: string;
  expiresAt?: string;
  grantedByPrincipalId: string;
};

export type ConfigVersion = {
  id: string;
  tenantId: string;
  key: string;
  version: number;
  value: unknown;
  status: "draft" | "approved" | "retired";
  createdByPrincipalId: string;
  createdAt: string;
  approvedByPrincipalId?: string;
  approvedAt?: string;
  effectiveFrom?: string;
};

export type StoredPrincipal = Principal & {
  passwordHash?: string;
  externalSubjectId?: string;
  groupIds?: string[];
  attributes?: Record<string, string>;
};
