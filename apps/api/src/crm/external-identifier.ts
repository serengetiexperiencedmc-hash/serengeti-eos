import {
  authorize,
  clearanceAllows,
  CRM_EVENT_TYPES,
  externalIdValid,
  isValidExternalIdEntityType,
  newId,
  normalizeExternalId,
  normalizeSystemKey,
  systemKeyValid,
  type Classification,
  type CrmExternalIdentifier,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";
import { contactResource } from "./contact.js";
import { orgResource } from "./organization.js";

function resolveEntity(
  store: Store,
  tenantId: string,
  entityType: string,
  entityId: string,
): { classification: Classification } | null {
  if (!isValidExternalIdEntityType(entityType)) return null;
  if (entityType === "organization") {
    const org = store.crmOrganizations.find((o) => o.id === entityId && o.tenantId === tenantId);
    if (!org || org.mergedIntoId) return null;
    return { classification: org.classification };
  }
  const contact = store.crmContacts.find((c) => c.id === entityId && c.tenantId === tenantId);
  if (!contact || contact.mergedIntoId) return null;
  return { classification: contact.classification };
}

function writePermission(entityType: string): string {
  return entityType === "organization" ? "crm:write:organization" : "crm:write:contact";
}

function readPermission(entityType: string): string {
  return entityType === "organization" ? "crm:read:organization" : "crm:read:contact";
}

export function findExternalIdentifierConflict(
  store: Store,
  tenantId: string,
  systemKey: string,
  externalId: string,
  excludeId?: string,
): CrmExternalIdentifier | undefined {
  const normalizedKey = normalizeSystemKey(systemKey);
  const normalizedId = normalizeExternalId(externalId);
  return store.crmExternalIdentifiers.find(
    (e) =>
      e.tenantId === tenantId &&
      e.id !== excludeId &&
      normalizeSystemKey(e.systemKey) === normalizedKey &&
      normalizeExternalId(e.externalId) === normalizedId,
  );
}

export function externalIdentifierMergeConflicts(
  store: Store,
  tenantId: string,
  survivorId: string,
  duplicateId: string,
  entityType: "organization" | "contact",
): boolean {
  const loserIds = store.crmExternalIdentifiers.filter(
    (e) => e.tenantId === tenantId && e.entityType === entityType && e.entityId === duplicateId,
  );
  for (const ext of loserIds) {
    const conflict = findExternalIdentifierConflict(store, tenantId, ext.systemKey, ext.externalId, ext.id);
    if (conflict && conflict.entityId === survivorId) continue;
    if (conflict && conflict.entityId !== duplicateId) return true;
  }
  return false;
}

export function createExternalIdentifier(
  store: Store,
  principal: Principal,
  input: { entityType: string; entityId: string; systemKey: string; externalId: string },
  correlationId: string,
) {
  ensureCrmCollections(store);
  if (!isValidExternalIdEntityType(input.entityType)) {
    return { error: "invalid_request" as const, reason: "invalid_entity_type" };
  }
  if (!systemKeyValid(input.systemKey ?? "")) return { error: "invalid_request" as const, reason: "invalid_system_key" };
  if (!externalIdValid(input.externalId ?? "")) return { error: "invalid_request" as const, reason: "invalid_external_id" };

  const entity = resolveEntity(store, principal.tenantId, input.entityType, input.entityId);
  if (!entity) return { error: "not_found" as const };

  const permission = writePermission(input.entityType);
  const resource =
    input.entityType === "organization"
      ? orgResource(store.crmOrganizations.find((o) => o.id === input.entityId)!)
      : contactResource(store.crmContacts.find((c) => c.id === input.entityId)!);

  const decision = authorize({
    principal,
    permission,
    action: "write:crm_external_identifier",
    resource,
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, permission, "crm_external_identifier", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (!clearanceAllows(principal.classificationClearance, entity.classification)) {
    return { error: "forbidden" as const, reason: "classification" };
  }

  const existing = findExternalIdentifierConflict(store, principal.tenantId, input.systemKey, input.externalId);
  if (existing) {
    if (existing.entityId === input.entityId && existing.entityType === input.entityType) {
      return { externalIdentifier: existing };
    }
    return { error: "conflict" as const, reason: "external_identifier_owned" };
  }

  const externalIdentifier: CrmExternalIdentifier = {
    id: newId(),
    tenantId: principal.tenantId,
    systemKey: normalizeSystemKey(input.systemKey),
    externalId: normalizeExternalId(input.externalId),
    entityType: input.entityType,
    entityId: input.entityId,
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
  };
  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.EXTERNAL_IDENTIFIER_CREATED,
    entityType: "external_identifier",
    entityId: externalIdentifier.id,
    classification: entity.classification,
    correlationId,
    payload: {
      externalIdentifierId: externalIdentifier.id,
      systemKey: externalIdentifier.systemKey,
      linkedEntityType: externalIdentifier.entityType,
      linkedEntityId: externalIdentifier.entityId,
    },
    mutate: () => {
      store.crmExternalIdentifiers.push(externalIdentifier);
      allowCrmAudit(store, principal, permission, "crm_external_identifier", externalIdentifier.id, correlationId, {
        id: externalIdentifier.id,
        systemKey: externalIdentifier.systemKey,
        entityType: externalIdentifier.entityType,
        entityId: externalIdentifier.entityId,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { externalIdentifier };
}

export function getExternalIdentifier(store: Store, principal: Principal, id: string) {
  ensureCrmCollections(store);
  const ext = store.crmExternalIdentifiers.find((e) => e.id === id);
  if (!ext || ext.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const entity = resolveEntity(store, principal.tenantId, ext.entityType, ext.entityId);
  if (!entity) return { error: "not_found" as const };
  if (!clearanceAllows(principal.classificationClearance, entity.classification)) {
    return { error: "not_found" as const };
  }

  const permission = readPermission(ext.entityType);
  const resource =
    ext.entityType === "organization"
      ? orgResource(store.crmOrganizations.find((o) => o.id === ext.entityId)!)
      : contactResource(store.crmContacts.find((c) => c.id === ext.entityId)!);

  const decision = authorize({ principal, permission, action: "read:crm_external_identifier", resource });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  return { externalIdentifier: ext };
}

export function lookupExternalIdentifier(
  store: Store,
  principal: Principal,
  systemKey: string,
  externalId: string,
) {
  ensureCrmCollections(store);
  if (!systemKeyValid(systemKey) || !externalIdValid(externalId)) {
    return { error: "invalid_request" as const, reason: "invalid_lookup_key" };
  }

  const ext = findExternalIdentifierConflict(store, principal.tenantId, systemKey, externalId);
  if (!ext) return { error: "not_found" as const };

  return getExternalIdentifier(store, principal, ext.id);
}

export function deleteExternalIdentifier(store: Store, principal: Principal, id: string, correlationId: string) {
  ensureCrmCollections(store);
  const idx = store.crmExternalIdentifiers.findIndex((e) => e.id === id && e.tenantId === principal.tenantId);
  if (idx < 0) return { error: "not_found" as const };

  const ext = store.crmExternalIdentifiers[idx]!;
  const entity = resolveEntity(store, principal.tenantId, ext.entityType, ext.entityId);
  if (!entity) return { error: "not_found" as const };

  const permission = writePermission(ext.entityType);
  const resource =
    ext.entityType === "organization"
      ? orgResource(store.crmOrganizations.find((o) => o.id === ext.entityId)!)
      : contactResource(store.crmContacts.find((c) => c.id === ext.entityId)!);

  const decision = authorize({ principal, permission, action: "delete:crm_external_identifier", resource });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (!clearanceAllows(principal.classificationClearance, entity.classification)) {
    return { error: "forbidden" as const, reason: "classification" };
  }

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.EXTERNAL_IDENTIFIER_DELETED,
    entityType: "external_identifier",
    entityId: id,
    classification: entity.classification,
    correlationId,
    payload: {
      externalIdentifierId: id,
      systemKey: ext.systemKey,
    },
    mutate: () => {
      store.crmExternalIdentifiers.splice(idx, 1);
      allowCrmAudit(store, principal, permission, "crm_external_identifier", id, correlationId, { deleted: true });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { removed: true };
}

export function repointExternalIdentifiers(
  store: Store,
  tenantId: string,
  entityType: "organization" | "contact",
  fromEntityId: string,
  toEntityId: string,
): { repointed: number; removed: number } {
  let repointed = 0;
  let removed = 0;
  for (const ext of store.crmExternalIdentifiers) {
    if (ext.tenantId !== tenantId || ext.entityType !== entityType || ext.entityId !== fromEntityId) continue;
    const conflict = findExternalIdentifierConflict(store, tenantId, ext.systemKey, ext.externalId, ext.id);
    if (conflict && conflict.entityId === toEntityId) {
      const removeIdx = store.crmExternalIdentifiers.findIndex((e) => e.id === ext.id);
      if (removeIdx >= 0) {
        store.crmExternalIdentifiers.splice(removeIdx, 1);
        removed += 1;
      }
      continue;
    }
    ext.entityId = toEntityId;
    repointed += 1;
  }
  return { repointed, removed };
}
