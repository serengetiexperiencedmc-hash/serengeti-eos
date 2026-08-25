import {
  authorize,
  canArchiveOrganization,
  canTransitionOrganization,
  CRM_EVENT_TYPES,
  isValidOrganizationStatus,
  isValidUuid,
  newId,
  normalizeOrganizationName,
  validateOrganizationLegalName,
  type Classification,
  type CrmOrganization,
  type CrmOrganizationStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections, seedCrmCatalogues } from "./collections.js";
import { registerDuplicateCandidatesForOrganization } from "./duplicate.js";
import { commitCrmWithOutbox } from "./events.js";

type OrgResource = {
  tenantId: string;
  type: "crm_organization";
  id: string;
  classification: Classification;
};

export function orgResource(org: CrmOrganization): OrgResource {
  return {
    tenantId: org.tenantId,
    type: "crm_organization",
    id: org.id,
    classification: org.classification,
  };
}

function sanitizeOrganization(o: CrmOrganization) {
  return {
    id: o.id,
    legalName: o.legalName,
    ...(o.tradingName !== undefined ? { tradingName: o.tradingName } : {}),
    organizationTypeId: o.organizationTypeId,
    ...(o.country !== undefined ? { country: o.country } : {}),
    ...(o.region !== undefined ? { region: o.region } : {}),
    ...(o.market !== undefined ? { market: o.market } : {}),
    ...(o.website !== undefined ? { website: o.website } : {}),
    ...(o.domain !== undefined ? { domain: o.domain } : {}),
    ...(o.primaryEmail !== undefined ? { primaryEmail: o.primaryEmail } : {}),
    ...(o.primaryTelephone !== undefined ? { primaryTelephone: o.primaryTelephone } : {}),
    ...(o.address !== undefined ? { address: o.address } : {}),
    status: o.status,
    dataQualityStatus: o.dataQualityStatus,
    classification: o.classification,
    ...(o.ownerPrincipalId !== undefined ? { ownerPrincipalId: o.ownerPrincipalId } : {}),
    ...(o.source !== undefined ? { source: o.source } : {}),
    ...(o.sourceSystem !== undefined ? { sourceSystem: o.sourceSystem } : {}),
    ...(o.sourceRecordId !== undefined ? { sourceRecordId: o.sourceRecordId } : {}),
    ...(o.importBatchId !== undefined ? { importBatchId: o.importBatchId } : {}),
    version: o.version,
    ...(o.mergedIntoId !== undefined ? { mergedIntoId: o.mergedIntoId } : {}),
    ...(o.archivedAt !== undefined ? { archivedAt: o.archivedAt } : {}),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    createdByPrincipalId: o.createdByPrincipalId,
    updatedByPrincipalId: o.updatedByPrincipalId,
  };
}

function findOrganizationForTenant(store: Store, tenantId: string, id: string): CrmOrganization | undefined {
  const org = store.crmOrganizations.find((o) => o.id === id);
  if (!org || org.tenantId !== tenantId) return undefined;
  return org;
}

function duplicateOrganizationExists(store: Store, tenantId: string, legalName: string, excludeId?: string): boolean {
  const normalized = normalizeOrganizationName(legalName);
  return store.crmOrganizations.some(
    (o) =>
      o.tenantId === tenantId &&
      o.id !== excludeId &&
      !o.archivedAt &&
      !o.mergedIntoId &&
      normalizeOrganizationName(o.legalName) === normalized,
  );
}

export function listOrganizations(
  store: Store,
  principal: Principal,
  query?: { status?: string; organizationTypeId?: string },
) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);
  const decision = authorize({
    principal,
    permission: "crm:read:organization",
    action: "read:crm_organization",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.crmOrganizations.filter((o) => o.tenantId === principal.tenantId && !o.mergedIntoId);
  if (query?.status) {
    if (!isValidOrganizationStatus(query.status)) {
      return { error: "invalid_request" as const, reason: "invalid_status" };
    }
    items = items.filter((o) => o.status === query.status);
  }
  if (query?.organizationTypeId) {
    items = items.filter((o) => o.organizationTypeId === query.organizationTypeId);
  }
  items.sort((a, b) => a.legalName.localeCompare(b.legalName));
  return { items: items.map(sanitizeOrganization) };
}

export function getOrganization(store: Store, principal: Principal, organizationId: string) {
  ensureCrmCollections(store);
  if (!isValidUuid(organizationId)) return { error: "invalid_request" as const, reason: "invalid_uuid" };
  const org = store.crmOrganizations.find((o) => o.id === organizationId);
  if (!org || org.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:organization",
    action: "read:crm_organization",
    resource: orgResource(org),
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { organization: sanitizeOrganization(org) };
}

export type CreateOrganizationInput = {
  legalName: string;
  tradingName?: string;
  organizationTypeId: string;
  country?: string;
  region?: string;
  market?: string;
  website?: string;
  domain?: string;
  primaryEmail?: string;
  primaryTelephone?: string;
  address?: Record<string, unknown>;
  classification?: Classification;
  ownerPrincipalId?: string;
  source?: string;
};

export function createOrganization(
  store: Store,
  principal: Principal,
  input: CreateOrganizationInput,
  correlationId: string,
) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);

  const decision = authorize({
    principal,
    permission: "crm:write:organization",
    action: "write:crm_organization",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_organization",
      id: "new",
      classification: input.classification ?? "Internal",
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:organization", "crm_organization", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const legalNameResult = validateOrganizationLegalName(input.legalName ?? "");
  if (!legalNameResult.ok) {
    return { error: "invalid_request" as const, reason: legalNameResult.reason };
  }
  const legalName = legalNameResult.value;
  if (!input.organizationTypeId) {
    return { error: "invalid_request" as const, reason: "organization_type_required" };
  }

  const orgType = store.crmOrganizationTypes.find(
    (t) => t.id === input.organizationTypeId && t.tenantId === principal.tenantId && t.active,
  );
  if (!orgType) return { error: "invalid_request" as const, reason: "invalid_organization_type" };

  if (duplicateOrganizationExists(store, principal.tenantId, legalName)) {
    return { error: "conflict" as const, reason: "duplicate_organization" };
  }

  if (input.ownerPrincipalId) {
    const owner = [...store.principals.values()].find(
      (p) => p.id === input.ownerPrincipalId && p.tenantId === principal.tenantId,
    );
    if (!owner) return { error: "invalid_request" as const, reason: "invalid_owner" };
  }

  const now = new Date().toISOString();
  const organization: CrmOrganization = {
    id: newId(),
    tenantId: principal.tenantId,
    legalName,
    ...(input.tradingName !== undefined ? { tradingName: input.tradingName.trim() } : {}),
    organizationTypeId: input.organizationTypeId,
    ...(input.country !== undefined ? { country: input.country } : {}),
    ...(input.region !== undefined ? { region: input.region } : {}),
    ...(input.market !== undefined ? { market: input.market } : {}),
    ...(input.website !== undefined ? { website: input.website } : {}),
    ...(input.domain !== undefined ? { domain: input.domain } : {}),
    ...(input.primaryEmail !== undefined ? { primaryEmail: input.primaryEmail } : {}),
    ...(input.primaryTelephone !== undefined ? { primaryTelephone: input.primaryTelephone } : {}),
    ...(input.address !== undefined ? { address: input.address } : {}),
    status: "Prospect",
    dataQualityStatus: "Unverified",
    classification: input.classification ?? "Internal",
    ...(input.ownerPrincipalId !== undefined ? { ownerPrincipalId: input.ownerPrincipalId } : {}),
    ...(input.source !== undefined ? { source: input.source } : {}),
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ORGANIZATION_CREATED,
    entityType: "organization",
    entityId: organization.id,
    classification: organization.classification,
    correlationId,
    payload: {
      organizationId: organization.id,
      status: organization.status,
      legalName: organization.legalName,
    },
    mutate: () => {
      store.crmOrganizations.push(organization);
      allowCrmAudit(
        store,
        principal,
        "crm:write:organization",
        "crm_organization",
        organization.id,
        correlationId,
        organization,
      );
      registerDuplicateCandidatesForOrganization(store, principal.tenantId, organization.id, {
        principal,
        correlationId,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { organization: sanitizeOrganization(organization) };
}

export type UpdateOrganizationInput = Partial<
  Pick<
    CreateOrganizationInput,
    | "legalName"
    | "tradingName"
    | "organizationTypeId"
    | "country"
    | "region"
    | "market"
    | "website"
    | "domain"
    | "primaryEmail"
    | "primaryTelephone"
    | "address"
    | "classification"
    | "ownerPrincipalId"
    | "source"
  >
>;

export function updateOrganization(
  store: Store,
  principal: Principal,
  organizationId: string,
  input: UpdateOrganizationInput,
  correlationId: string,
  expectedVersion?: number,
) {
  ensureCrmCollections(store);
  const org = findOrganizationForTenant(store, principal.tenantId, organizationId);
  if (!org) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:organization",
    action: "write:crm_organization",
    resource: orgResource(org),
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:write:organization",
      "crm_organization",
      correlationId,
      decision.reason,
      organizationId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (org.archivedAt || org.mergedIntoId) {
    return { error: "conflict" as const, reason: "organization_not_mutable" };
  }

  if (expectedVersion !== undefined && org.version !== expectedVersion) {
    return { error: "conflict" as const, reason: "version_mismatch" };
  }

  const previousState = { ...org };

  if (input.legalName !== undefined) {
    const legalNameResult = validateOrganizationLegalName(input.legalName);
    if (!legalNameResult.ok) {
      return { error: "invalid_request" as const, reason: legalNameResult.reason };
    }
    const legalName = legalNameResult.value;
    if (duplicateOrganizationExists(store, principal.tenantId, legalName, org.id)) {
      return { error: "conflict" as const, reason: "duplicate_organization" };
    }
    org.legalName = legalName;
  }

  if (input.organizationTypeId !== undefined) {
    const orgType = store.crmOrganizationTypes.find(
      (t) => t.id === input.organizationTypeId && t.tenantId === principal.tenantId && t.active,
    );
    if (!orgType) return { error: "invalid_request" as const, reason: "invalid_organization_type" };
    org.organizationTypeId = input.organizationTypeId;
  }

  if (input.ownerPrincipalId !== undefined) {
    const owner = [...store.principals.values()].find(
      (p) => p.id === input.ownerPrincipalId && p.tenantId === principal.tenantId,
    );
    if (!owner) return { error: "invalid_request" as const, reason: "invalid_owner" };
    org.ownerPrincipalId = input.ownerPrincipalId;
  }

  if (input.tradingName !== undefined) org.tradingName = input.tradingName.trim();
  if (input.country !== undefined) org.country = input.country;
  if (input.region !== undefined) org.region = input.region;
  if (input.market !== undefined) org.market = input.market;
  if (input.website !== undefined) org.website = input.website;
  if (input.domain !== undefined) org.domain = input.domain;
  if (input.primaryEmail !== undefined) org.primaryEmail = input.primaryEmail;
  if (input.primaryTelephone !== undefined) org.primaryTelephone = input.primaryTelephone;
  if (input.address !== undefined) org.address = input.address;
  if (input.classification !== undefined) org.classification = input.classification;
  if (input.source !== undefined) org.source = input.source;

  org.version += 1;
  org.updatedAt = new Date().toISOString();
  org.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ORGANIZATION_UPDATED,
    entityType: "organization",
    entityId: org.id,
    classification: org.classification,
    correlationId,
    payload: { organizationId: org.id },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:organization",
        "crm_organization",
        org.id,
        correlationId,
        org,
        previousState,
      );
      registerDuplicateCandidatesForOrganization(store, principal.tenantId, org.id, {
        principal,
        correlationId,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { organization: sanitizeOrganization(org) };
}

export function transitionOrganization(
  store: Store,
  principal: Principal,
  organizationId: string,
  input: { to: CrmOrganizationStatus; reason?: string },
  correlationId: string,
) {
  ensureCrmCollections(store);
  const org = findOrganizationForTenant(store, principal.tenantId, organizationId);
  if (!org) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:transition:organization",
    action: "transition:crm_organization",
    resource: orgResource(org),
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:transition:organization",
      "crm_organization",
      correlationId,
      decision.reason,
      organizationId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (org.archivedAt || org.mergedIntoId) {
    return { error: "conflict" as const, reason: "organization_not_mutable" };
  }

  if (!isValidOrganizationStatus(input.to)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }

  if (input.to === "Archived") {
    return { error: "invalid_request" as const, reason: "use_archive_endpoint" };
  }

  if (!canTransitionOrganization(org.status, input.to)) {
    return { error: "conflict" as const, reason: "invalid_transition" };
  }

  if (org.status === "Disqualified" && input.to === "Prospect" && !input.reason?.trim()) {
    return { error: "invalid_request" as const, reason: "reason_required" };
  }

  const previousState = { status: org.status };
  org.status = input.to;
  org.version += 1;
  org.updatedAt = new Date().toISOString();
  org.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ORGANIZATION_UPDATED,
    entityType: "organization",
    entityId: org.id,
    classification: org.classification,
    correlationId,
    payload: {
      organizationId: org.id,
      status: org.status,
      previousStatus: previousState.status,
    },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:transition:organization",
        "crm_organization",
        org.id,
        correlationId,
        { status: org.status, reason: input.reason },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { organization: sanitizeOrganization(org) };
}

export function archiveOrganization(store: Store, principal: Principal, organizationId: string, correlationId: string) {
  ensureCrmCollections(store);
  const org = findOrganizationForTenant(store, principal.tenantId, organizationId);
  if (!org) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:archive:organization",
    action: "archive:crm_organization",
    resource: orgResource(org),
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:archive:organization",
      "crm_organization",
      correlationId,
      decision.reason,
      organizationId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (org.archivedAt || org.mergedIntoId) {
    return { error: "conflict" as const, reason: "already_archived" };
  }

  if (!canArchiveOrganization(org.status)) {
    return { error: "conflict" as const, reason: "invalid_archive_state" };
  }

  const previousState = { status: org.status, archivedAt: org.archivedAt };
  org.status = "Archived";
  org.archivedAt = new Date().toISOString();
  org.version += 1;
  org.updatedAt = org.archivedAt;
  org.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ORGANIZATION_ARCHIVED,
    entityType: "organization",
    entityId: org.id,
    classification: org.classification,
    correlationId,
    payload: { organizationId: org.id },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:archive:organization",
        "crm_organization",
        org.id,
        correlationId,
        { status: org.status, archivedAt: org.archivedAt },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { organization: sanitizeOrganization(org) };
}
