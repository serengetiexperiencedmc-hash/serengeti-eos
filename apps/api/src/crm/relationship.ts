import {
  authorize,
  canTransitionRelationship,
  CRM_EVENT_TYPES,
  isValidRelationshipStatus,
  newId,
  type CrmRelationship,
  type CrmRelationshipStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections, seedCrmCatalogues } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";
import { orgResource } from "./organization.js";

function findOrganizationForTenant(store: Store, tenantId: string, id: string) {
  const org = store.crmOrganizations.find((o) => o.id === id);
  if (!org || org.tenantId !== tenantId) return undefined;
  return org;
}

function findContactForTenant(store: Store, tenantId: string, id: string) {
  const contact = store.crmContacts.find((c) => c.id === id);
  if (!contact || contact.tenantId !== tenantId) return undefined;
  return contact;
}

function orgIsMutable(org: { archivedAt?: string; mergedIntoId?: string }): boolean {
  return !org.archivedAt && !org.mergedIntoId;
}

function relationshipEndpointsKey(rel: {
  fromContactId?: string;
  toOrganizationId?: string;
  fromOrganizationId?: string;
  organizationUnitId?: string;
  relationshipTypeId: string;
}): string {
  return [
    rel.fromContactId ?? "",
    rel.toOrganizationId ?? "",
    rel.fromOrganizationId ?? "",
    rel.organizationUnitId ?? "",
    rel.relationshipTypeId,
  ].join(":");
}

function duplicateRelationshipExists(
  store: Store,
  tenantId: string,
  candidate: Parameters<typeof relationshipEndpointsKey>[0],
  excludeId?: string,
): boolean {
  const key = relationshipEndpointsKey(candidate);
  return store.crmRelationships.some(
    (r) => r.tenantId === tenantId && r.id !== excludeId && relationshipEndpointsKey(r) === key,
  );
}

export function listRelationships(
  store: Store,
  principal: Principal,
  query?: {
    contactId?: string;
    organizationId?: string;
    organizationUnitId?: string;
    status?: string;
  },
) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);
  const decision = authorize({
    principal,
    permission: "crm:read:relationship",
    action: "read:crm_relationship",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.crmRelationships.filter((r) => r.tenantId === principal.tenantId);

  if (query?.contactId) {
    items = items.filter((r) => r.fromContactId === query.contactId || r.toContactId === query.contactId);
  }
  if (query?.organizationId) {
    items = items.filter(
      (r) => r.toOrganizationId === query.organizationId || r.fromOrganizationId === query.organizationId,
    );
  }
  if (query?.organizationUnitId) {
    items = items.filter((r) => r.organizationUnitId === query.organizationUnitId);
  }
  if (query?.status) {
    if (!isValidRelationshipStatus(query.status)) {
      return { error: "invalid_request" as const, reason: "invalid_status" };
    }
    items = items.filter((r) => r.status === query.status);
  }

  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { items };
}

export function getRelationship(store: Store, principal: Principal, relationshipId: string) {
  ensureCrmCollections(store);
  const relationship = store.crmRelationships.find((r) => r.id === relationshipId);
  if (!relationship || relationship.tenantId !== principal.tenantId) {
    return { error: "not_found" as const };
  }

  const decision = authorize({
    principal,
    permission: "crm:read:relationship",
    action: "read:crm_relationship",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { relationship };
}

export type CreateRelationshipInput = {
  relationshipTypeId: string;
  contactId?: string;
  organizationId?: string;
  organizationUnitId?: string;
  fromOrganizationId?: string;
  toOrganizationId?: string;
  notes?: string;
  status?: CrmRelationshipStatus;
};

export function createRelationship(
  store: Store,
  principal: Principal,
  input: CreateRelationshipInput,
  correlationId: string,
) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);

  const decision = authorize({
    principal,
    permission: "crm:write:relationship",
    action: "write:crm_relationship",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_relationship",
      id: "new",
      classification: "Internal",
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:relationship", "crm_relationship", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!input.relationshipTypeId) {
    return { error: "invalid_request" as const, reason: "relationship_type_required" };
  }

  const relType = store.crmRelationshipTypes.find(
    (t) => t.id === input.relationshipTypeId && t.tenantId === principal.tenantId && t.active,
  );
  if (!relType) return { error: "invalid_request" as const, reason: "invalid_relationship_type" };

  const isContactOrg = Boolean(input.contactId && input.organizationId);
  const isOrgOrg = Boolean(input.fromOrganizationId && input.toOrganizationId);

  if (isContactOrg === isOrgOrg) {
    return { error: "invalid_request" as const, reason: "invalid_relationship_endpoints" };
  }

  if (input.status !== undefined && !isValidRelationshipStatus(input.status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }

  const now = new Date().toISOString();
  let relationship: CrmRelationship;

  if (isContactOrg) {
    const contact = findContactForTenant(store, principal.tenantId, input.contactId!);
    if (!contact) return { error: "invalid_request" as const, reason: "invalid_contact" };
    if (contact.archivedAt || contact.mergedIntoId) {
      return { error: "conflict" as const, reason: "contact_not_mutable" };
    }

    const org = findOrganizationForTenant(store, principal.tenantId, input.organizationId!);
    if (!org) return { error: "invalid_request" as const, reason: "invalid_organization" };
    if (!orgIsMutable(org)) {
      return { error: "conflict" as const, reason: "organization_not_mutable" };
    }

    if (input.organizationUnitId) {
      const unit = store.crmOrganizationUnits.find(
        (u) =>
          u.id === input.organizationUnitId &&
          u.organizationId === org.id &&
          u.tenantId === principal.tenantId,
      );
      if (!unit) return { error: "invalid_request" as const, reason: "invalid_organization_unit" };
    }

    const endpoints = {
      fromContactId: contact.id,
      toOrganizationId: org.id,
      ...(input.organizationUnitId !== undefined ? { organizationUnitId: input.organizationUnitId } : {}),
      relationshipTypeId: input.relationshipTypeId,
    };
    if (duplicateRelationshipExists(store, principal.tenantId, endpoints)) {
      return { error: "conflict" as const, reason: "duplicate_relationship" };
    }

    relationship = {
      id: newId(),
      tenantId: principal.tenantId,
      relationshipTypeId: input.relationshipTypeId,
      status: input.status ?? "Unknown",
      fromContactId: contact.id,
      toOrganizationId: org.id,
      ...(input.organizationUnitId !== undefined ? { organizationUnitId: input.organizationUnitId } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: principal.id,
      updatedByPrincipalId: principal.id,
    };
  } else {
    const fromOrg = findOrganizationForTenant(store, principal.tenantId, input.fromOrganizationId!);
    const toOrg = findOrganizationForTenant(store, principal.tenantId, input.toOrganizationId!);
    if (!fromOrg) return { error: "invalid_request" as const, reason: "invalid_from_organization" };
    if (!toOrg) return { error: "invalid_request" as const, reason: "invalid_to_organization" };
    if (fromOrg.id === toOrg.id) {
      return { error: "invalid_request" as const, reason: "invalid_relationship_endpoints" };
    }
    if (!orgIsMutable(fromOrg) || !orgIsMutable(toOrg)) {
      return { error: "conflict" as const, reason: "organization_not_mutable" };
    }

    const endpoints = {
      fromOrganizationId: fromOrg.id,
      toOrganizationId: toOrg.id,
      relationshipTypeId: input.relationshipTypeId,
    };
    if (duplicateRelationshipExists(store, principal.tenantId, endpoints)) {
      return { error: "conflict" as const, reason: "duplicate_relationship" };
    }

    relationship = {
      id: newId(),
      tenantId: principal.tenantId,
      relationshipTypeId: input.relationshipTypeId,
      status: input.status ?? "Unknown",
      fromOrganizationId: fromOrg.id,
      toOrganizationId: toOrg.id,
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: principal.id,
      updatedByPrincipalId: principal.id,
    };
  }

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.RELATIONSHIP_CREATED,
    entityType: "relationship",
    entityId: relationship.id,
    classification: "Internal",
    correlationId,
    payload: { relationshipId: relationship.id },
    mutate: () => {
      store.crmRelationships.push(relationship);
      allowCrmAudit(
        store,
        principal,
        "crm:write:relationship",
        "crm_relationship",
        relationship.id,
        correlationId,
        relationship,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { relationship };
}

export type UpdateRelationshipInput = {
  notes?: string;
  organizationUnitId?: string | null;
};

export function updateRelationship(
  store: Store,
  principal: Principal,
  relationshipId: string,
  input: UpdateRelationshipInput,
  correlationId: string,
  expectedVersion?: number,
) {
  ensureCrmCollections(store);
  const relationship = store.crmRelationships.find((r) => r.id === relationshipId);
  if (!relationship || relationship.tenantId !== principal.tenantId) {
    return { error: "not_found" as const };
  }

  const decision = authorize({
    principal,
    permission: "crm:write:relationship",
    action: "write:crm_relationship",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_relationship",
      id: relationship.id,
      classification: "Internal",
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:write:relationship",
      "crm_relationship",
      correlationId,
      decision.reason,
      relationshipId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (expectedVersion !== undefined && relationship.version !== expectedVersion) {
    return { error: "conflict" as const, reason: "version_mismatch" };
  }

  if (!relationship.fromContactId || !relationship.toOrganizationId) {
    if (input.organizationUnitId !== undefined) {
      return { error: "invalid_request" as const, reason: "organization_unit_not_applicable" };
    }
  }

  const previousState = { ...relationship };

  if (input.organizationUnitId !== undefined && relationship.fromContactId && relationship.toOrganizationId) {
    if (input.organizationUnitId === null) {
      delete relationship.organizationUnitId;
    } else {
      const unit = store.crmOrganizationUnits.find(
        (u) =>
          u.id === input.organizationUnitId &&
          u.organizationId === relationship.toOrganizationId &&
          u.tenantId === principal.tenantId,
      );
      if (!unit) return { error: "invalid_request" as const, reason: "invalid_organization_unit" };

      const endpoints = {
        fromContactId: relationship.fromContactId,
        toOrganizationId: relationship.toOrganizationId,
        organizationUnitId: input.organizationUnitId,
        relationshipTypeId: relationship.relationshipTypeId,
      };
      if (duplicateRelationshipExists(store, principal.tenantId, endpoints, relationship.id)) {
        return { error: "conflict" as const, reason: "duplicate_relationship" };
      }
      relationship.organizationUnitId = input.organizationUnitId;
    }
  }

  if (input.notes !== undefined) relationship.notes = input.notes;

  relationship.version += 1;
  relationship.updatedAt = new Date().toISOString();
  relationship.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.RELATIONSHIP_UPDATED,
    entityType: "relationship",
    entityId: relationship.id,
    classification: "Internal",
    correlationId,
    payload: { relationshipId: relationship.id },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:relationship",
        "crm_relationship",
        relationship.id,
        correlationId,
        relationship,
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { relationship };
}

export function transitionRelationship(
  store: Store,
  principal: Principal,
  relationshipId: string,
  input: { to: CrmRelationshipStatus; reason?: string },
  correlationId: string,
) {
  ensureCrmCollections(store);
  const relationship = store.crmRelationships.find((r) => r.id === relationshipId);
  if (!relationship || relationship.tenantId !== principal.tenantId) {
    return { error: "not_found" as const };
  }

  const decision = authorize({
    principal,
    permission: "crm:write:relationship",
    action: "transition:crm_relationship",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_relationship",
      id: relationship.id,
      classification: "Internal",
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:write:relationship",
      "crm_relationship",
      correlationId,
      decision.reason,
      relationshipId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!isValidRelationshipStatus(input.to)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }

  if (!canTransitionRelationship(relationship.status, input.to, input.reason)) {
    return { error: "conflict" as const, reason: "invalid_transition" };
  }

  const previousState = { status: relationship.status };
  relationship.status = input.to;
  relationship.version += 1;
  relationship.updatedAt = new Date().toISOString();
  relationship.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.RELATIONSHIP_TRANSITIONED,
    entityType: "relationship",
    entityId: relationship.id,
    classification: "Internal",
    correlationId,
    payload: {
      relationshipId: relationship.id,
      previousStatus: previousState.status,
      newStatus: relationship.status,
    },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:relationship",
        "crm_relationship",
        relationship.id,
        correlationId,
        { status: relationship.status, reason: input.reason },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { relationship };
}

export function listOrganizationRelationships(
  store: Store,
  principal: Principal,
  organizationId: string,
  query?: { contactId?: string; status?: string },
) {
  const org = store.crmOrganizations.find((o) => o.id === organizationId);
  if (!org || org.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:relationship",
    action: "read:crm_relationship",
    resource: orgResource(org),
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  return listRelationships(store, principal, {
    organizationId,
    ...(query?.contactId !== undefined ? { contactId: query.contactId } : {}),
    ...(query?.status !== undefined ? { status: query.status } : {}),
  });
}

export function listContactRelationships(
  store: Store,
  principal: Principal,
  contactId: string,
  query?: { organizationId?: string; status?: string },
) {
  const contact = store.crmContacts.find((c) => c.id === contactId);
  if (!contact || contact.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:relationship",
    action: "read:crm_relationship",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  return listRelationships(store, principal, {
    contactId,
    ...(query?.organizationId !== undefined ? { organizationId: query.organizationId } : {}),
    ...(query?.status !== undefined ? { status: query.status } : {}),
  });
}
