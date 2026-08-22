import {
  authorize,
  CRM_EVENT_TYPES,
  isValidOrganizationUnitType,
  newId,
  type CrmOrganizationUnit,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";
import { orgResource } from "./organization.js";

function findOrganizationForTenant(store: Store, tenantId: string, id: string) {
  const org = store.crmOrganizations.find((o) => o.id === id);
  if (!org || org.tenantId !== tenantId) return undefined;
  return org;
}

function findUnitForTenant(store: Store, tenantId: string, unitId: string): CrmOrganizationUnit | undefined {
  const unit = store.crmOrganizationUnits.find((u) => u.id === unitId);
  if (!unit || unit.tenantId !== tenantId) return undefined;
  return unit;
}

function normalizeUnitName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

function duplicateUnitExists(
  store: Store,
  organizationId: string,
  name: string,
  parentUnitId: string | undefined,
  excludeId?: string,
): boolean {
  const normalized = normalizeUnitName(name);
  return store.crmOrganizationUnits.some(
    (u) =>
      u.organizationId === organizationId &&
      u.id !== excludeId &&
      normalizeUnitName(u.name) === normalized &&
      (u.parentUnitId ?? undefined) === (parentUnitId ?? undefined),
  );
}

function wouldCreateUnitCycle(
  store: Store,
  unitId: string,
  organizationId: string,
  newParentUnitId: string | undefined,
): boolean {
  if (!newParentUnitId) return false;
  if (newParentUnitId === unitId) return true;

  let cursor: string | undefined = newParentUnitId;
  const seen = new Set<string>();
  while (cursor) {
    if (cursor === unitId) return true;
    if (seen.has(cursor)) return true;
    seen.add(cursor);
    const parent = store.crmOrganizationUnits.find((u) => u.id === cursor && u.organizationId === organizationId);
    if (!parent) return true;
    cursor = parent.parentUnitId;
  }
  return false;
}

export function listOrganizationUnits(store: Store, principal: Principal, organizationId: string) {
  ensureCrmCollections(store);
  const decision = authorize({
    principal,
    permission: "crm:read:organization",
    action: "read:crm_organization_unit",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const org = findOrganizationForTenant(store, principal.tenantId, organizationId);
  if (!org) return { error: "not_found" as const };

  const items = store.crmOrganizationUnits
    .filter((u) => u.organizationId === organizationId && u.tenantId === principal.tenantId)
    .sort((a, b) => a.name.localeCompare(b.name));
  return { items };
}

export function getOrganizationUnit(store: Store, principal: Principal, unitId: string) {
  ensureCrmCollections(store);
  const unit = store.crmOrganizationUnits.find((u) => u.id === unitId);
  if (!unit || unit.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const org = findOrganizationForTenant(store, principal.tenantId, unit.organizationId);
  if (!org) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:organization",
    action: "read:crm_organization_unit",
    resource: orgResource(org),
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { unit };
}

export type CreateOrganizationUnitInput = {
  name: string;
  unitType: string;
  parentUnitId?: string;
};

export function createOrganizationUnit(
  store: Store,
  principal: Principal,
  organizationId: string,
  input: CreateOrganizationUnitInput,
  correlationId: string,
) {
  ensureCrmCollections(store);
  const org = findOrganizationForTenant(store, principal.tenantId, organizationId);
  if (!org) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:organization",
    action: "write:crm_organization_unit",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_organization",
      id: organizationId,
      classification: org.classification,
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:write:organization",
      "crm_organization_unit",
      correlationId,
      decision.reason,
      organizationId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (org.archivedAt || org.mergedIntoId) {
    return { error: "conflict" as const, reason: "organization_not_mutable" };
  }

  const name = input.name?.trim();
  if (!name) return { error: "invalid_request" as const, reason: "name_required" };
  if (!input.unitType || !isValidOrganizationUnitType(input.unitType)) {
    return { error: "invalid_request" as const, reason: "invalid_unit_type" };
  }

  if (input.parentUnitId) {
    const parent = store.crmOrganizationUnits.find(
      (u) => u.id === input.parentUnitId && u.organizationId === organizationId && u.tenantId === principal.tenantId,
    );
    if (!parent) return { error: "invalid_request" as const, reason: "invalid_parent_unit" };
  }

  if (duplicateUnitExists(store, organizationId, name, input.parentUnitId)) {
    return { error: "conflict" as const, reason: "duplicate_unit" };
  }

  const now = new Date().toISOString();
  const unit: CrmOrganizationUnit = {
    id: newId(),
    tenantId: principal.tenantId,
    organizationId,
    ...(input.parentUnitId !== undefined ? { parentUnitId: input.parentUnitId } : {}),
    name,
    unitType: input.unitType,
    createdAt: now,
    updatedAt: now,
  };

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ORGANIZATION_UNIT_CREATED,
    entityType: "organization_unit",
    entityId: unit.id,
    classification: org.classification,
    correlationId,
    payload: { organizationUnitId: unit.id, organizationId: unit.organizationId },
    mutate: () => {
      store.crmOrganizationUnits.push(unit);
      allowCrmAudit(
        store,
        principal,
        "crm:write:organization",
        "crm_organization_unit",
        unit.id,
        correlationId,
        unit,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { unit };
}

export type UpdateOrganizationUnitInput = {
  name?: string;
  unitType?: string;
  parentUnitId?: string | null;
};

export function updateOrganizationUnit(
  store: Store,
  principal: Principal,
  unitId: string,
  input: UpdateOrganizationUnitInput,
  correlationId: string,
) {
  ensureCrmCollections(store);
  const unit = findUnitForTenant(store, principal.tenantId, unitId);
  if (!unit) return { error: "not_found" as const };

  const org = findOrganizationForTenant(store, principal.tenantId, unit.organizationId);
  if (!org) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:organization",
    action: "write:crm_organization_unit",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_organization",
      id: unit.organizationId,
      classification: org.classification,
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:write:organization",
      "crm_organization_unit",
      correlationId,
      decision.reason,
      unitId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (org.archivedAt || org.mergedIntoId) {
    return { error: "conflict" as const, reason: "organization_not_mutable" };
  }

  const previousState = { ...unit };
  const nextParent = input.parentUnitId === null ? undefined : (input.parentUnitId ?? unit.parentUnitId);

  if (input.parentUnitId !== undefined) {
    if (input.parentUnitId) {
      const parent = store.crmOrganizationUnits.find(
        (u) =>
          u.id === input.parentUnitId && u.organizationId === unit.organizationId && u.tenantId === principal.tenantId,
      );
      if (!parent) return { error: "invalid_request" as const, reason: "invalid_parent_unit" };
    }
    if (wouldCreateUnitCycle(store, unit.id, unit.organizationId, nextParent)) {
      return { error: "invalid_request" as const, reason: "invalid_parent_unit_cycle" };
    }
    if (nextParent === undefined) {
      delete unit.parentUnitId;
    } else {
      unit.parentUnitId = nextParent;
    }
  }

  if (input.unitType !== undefined) {
    if (!isValidOrganizationUnitType(input.unitType)) {
      return { error: "invalid_request" as const, reason: "invalid_unit_type" };
    }
    unit.unitType = input.unitType;
  }

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) return { error: "invalid_request" as const, reason: "name_required" };
    if (duplicateUnitExists(store, unit.organizationId, name, nextParent, unit.id)) {
      return { error: "conflict" as const, reason: "duplicate_unit" };
    }
    unit.name = name;
  }

  unit.updatedAt = new Date().toISOString();
  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ORGANIZATION_UNIT_UPDATED,
    entityType: "organization_unit",
    entityId: unit.id,
    classification: org.classification,
    correlationId,
    payload: { organizationUnitId: unit.id },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:organization",
        "crm_organization_unit",
        unit.id,
        correlationId,
        unit,
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { unit };
}
