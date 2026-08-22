import {
  authorize,
  clearanceAllows,
  CRM_EVENT_TYPES,
  isValidTagEntityType,
  newId,
  normalizeTagKey,
  tagKeyValid,
  tagLabelValid,
  type Classification,
  type CrmEntityTag,
  type CrmTag,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";
import { contactResource } from "./contact.js";
import { orgResource } from "./organization.js";

const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 100;

function entityReadPermission(entityType: string): string {
  switch (entityType) {
    case "organization":
    case "organization_unit":
      return "crm:read:organization";
    case "contact":
      return "crm:read:contact";
    case "relationship":
      return "crm:read:relationship";
    case "account":
      return "crm:read:account";
    case "activity":
      return "crm:read:activity";
    case "task":
      return "crm:read:task";
    default:
      return "crm:read:organization";
  }
}

function entityWritePermission(entityType: string): string {
  switch (entityType) {
    case "organization":
    case "organization_unit":
      return "crm:write:organization";
    case "contact":
      return "crm:write:contact";
    case "relationship":
      return "crm:write:relationship";
    case "account":
      return "crm:write:account";
    case "activity":
      return "crm:write:activity";
    case "task":
      return "crm:write:task";
    default:
      return "crm:write:organization";
  }
}

function resolveEntityClassification(
  store: Store,
  tenantId: string,
  entityType: string,
  entityId: string,
): Classification | null {
  if (!isValidTagEntityType(entityType)) return null;
  switch (entityType) {
    case "organization": {
      const org = store.crmOrganizations.find((o) => o.id === entityId && o.tenantId === tenantId);
      if (!org || org.mergedIntoId) return null;
      return org.classification;
    }
    case "organization_unit": {
      const unit = store.crmOrganizationUnits.find((u) => u.id === entityId && u.tenantId === tenantId);
      if (!unit) return null;
      const org = store.crmOrganizations.find((o) => o.id === unit.organizationId);
      return org ? org.classification : "Internal";
    }
    case "contact": {
      const contact = store.crmContacts.find((c) => c.id === entityId && c.tenantId === tenantId);
      if (!contact || contact.mergedIntoId) return null;
      return contact.classification;
    }
    case "relationship": {
      const rel = store.crmRelationships.find((r) => r.id === entityId && r.tenantId === tenantId);
      return rel ? "Internal" : null;
    }
    case "account": {
      const account = store.crmAccounts.find((a) => a.id === entityId && a.tenantId === tenantId);
      if (!account || account.archivedAt) return null;
      return account.classification;
    }
    case "activity": {
      const activity = store.crmActivities.find((a) => a.id === entityId && a.tenantId === tenantId);
      if (!activity || activity.archivedAt) return null;
      return activity.classification;
    }
    case "task": {
      const task = store.crmTasks.find((t) => t.id === entityId && t.tenantId === tenantId);
      return task ? task.classification : null;
    }
    default:
      return null;
  }
}

function entityAuthorized(
  store: Store,
  principal: Principal,
  entityType: string,
  entityId: string,
  write: boolean,
): boolean {
  const classification = resolveEntityClassification(store, principal.tenantId, entityType, entityId);
  if (classification === null) return false;
  if (!clearanceAllows(principal.classificationClearance, classification)) return false;

  const permission = write ? entityWritePermission(entityType) : entityReadPermission(entityType);
  let resource: { tenantId: string; type: string; id: string; classification: Classification } | undefined;

  if (entityType === "organization") {
    const org = store.crmOrganizations.find((o) => o.id === entityId)!;
    resource = orgResource(org);
  } else if (entityType === "contact") {
    const contact = store.crmContacts.find((c) => c.id === entityId)!;
    resource = contactResource(contact);
  } else {
    resource = { tenantId: principal.tenantId, type: `crm_${entityType}`, id: entityId, classification };
  }

  const decision = authorize({
    principal,
    permission,
    action: `${write ? "write" : "read"}:crm_${entityType}`,
    resource,
  });
  return decision.result === "allow";
}

function duplicateTagKey(store: Store, tenantId: string, key: string, excludeId?: string): boolean {
  const normalized = normalizeTagKey(key);
  return store.crmTags.some(
    (t) => t.tenantId === tenantId && t.id !== excludeId && !t.archivedAt && normalizeTagKey(t.key) === normalized,
  );
}

export function listTags(store: Store, principal: Principal, query?: { includeArchived?: boolean }) {
  ensureCrmCollections(store);
  const decision = authorize({ principal, permission: "crm:read:tag", action: "read:crm_tag" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.crmTags.filter((t) => t.tenantId === principal.tenantId);
  if (!query?.includeArchived) items = items.filter((t) => t.active && !t.archivedAt);
  items.sort((a, b) => a.label.localeCompare(b.label));
  return { items };
}

export function getTag(store: Store, principal: Principal, tagId: string) {
  ensureCrmCollections(store);
  const tag = store.crmTags.find((t) => t.id === tagId);
  if (!tag || tag.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "crm:read:tag", action: "read:crm_tag" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { tag };
}

export function createTag(
  store: Store,
  principal: Principal,
  input: { key: string; label: string },
  correlationId: string,
) {
  ensureCrmCollections(store);
  const decision = authorize({ principal, permission: "crm:write:tag", action: "write:crm_tag" });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:tag", "crm_tag", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!tagKeyValid(input.key ?? "")) return { error: "invalid_request" as const, reason: "invalid_tag_key" };
  if (!tagLabelValid(input.label ?? "")) return { error: "invalid_request" as const, reason: "invalid_tag_label" };

  const key = normalizeTagKey(input.key);
  if (duplicateTagKey(store, principal.tenantId, key)) {
    return { error: "conflict" as const, reason: "duplicate_tag_key" };
  }

  const now = new Date().toISOString();
  const tag: CrmTag = {
    id: newId(),
    tenantId: principal.tenantId,
    key,
    label: input.label.trim(),
    active: true,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.TAG_CREATED,
    entityType: "tag",
    entityId: tag.id,
    classification: "Internal",
    correlationId,
    payload: { tagId: tag.id, key: tag.key },
    mutate: () => {
      store.crmTags.push(tag);
      allowCrmAudit(store, principal, "crm:write:tag", "crm_tag", tag.id, correlationId, { id: tag.id, key: tag.key });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { tag };
}

export function updateTag(
  store: Store,
  principal: Principal,
  tagId: string,
  input: { label?: string },
  correlationId: string,
  expectedVersion?: number,
) {
  ensureCrmCollections(store);
  const tag = store.crmTags.find((t) => t.id === tagId && t.tenantId === principal.tenantId);
  if (!tag) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "crm:write:tag", action: "write:crm_tag" });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:tag", "crm_tag", correlationId, decision.reason, tagId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (tag.archivedAt) return { error: "conflict" as const, reason: "tag_not_mutable" };
  if (expectedVersion !== undefined && tag.version !== expectedVersion) {
    return { error: "conflict" as const, reason: "version_mismatch" };
  }
  if (input.label !== undefined && !tagLabelValid(input.label)) {
    return { error: "invalid_request" as const, reason: "invalid_tag_label" };
  }

  if (input.label !== undefined) tag.label = input.label.trim();
  tag.version += 1;
  tag.updatedAt = new Date().toISOString();
  tag.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.TAG_UPDATED,
    entityType: "tag",
    entityId: tag.id,
    classification: "Internal",
    correlationId,
    payload: { tagId: tag.id },
    mutate: () => {
      allowCrmAudit(store, principal, "crm:write:tag", "crm_tag", tag.id, correlationId, { label: tag.label });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { tag };
}

export function archiveTag(store: Store, principal: Principal, tagId: string, correlationId: string) {
  ensureCrmCollections(store);
  const tag = store.crmTags.find((t) => t.id === tagId && t.tenantId === principal.tenantId);
  if (!tag) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "crm:write:tag", action: "archive:crm_tag" });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:tag", "crm_tag", correlationId, decision.reason, tagId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (tag.archivedAt) return { error: "conflict" as const, reason: "already_archived" };

  tag.active = false;
  tag.archivedAt = new Date().toISOString();
  tag.version += 1;
  tag.updatedAt = tag.archivedAt;
  tag.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.TAG_ARCHIVED,
    entityType: "tag",
    entityId: tag.id,
    classification: "Internal",
    correlationId,
    payload: { tagId: tag.id },
    mutate: () => {
      allowCrmAudit(store, principal, "crm:write:tag", "crm_tag", tag.id, correlationId, { archivedAt: tag.archivedAt });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { tag };
}

export function listTagAssignments(
  store: Store,
  principal: Principal,
  query?: { tagId?: string; entityType?: string; entityId?: string; limit?: number; cursor?: string },
) {
  ensureCrmCollections(store);
  const decision = authorize({ principal, permission: "crm:read:tag", action: "read:crm_entity_tag" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  if ((query?.entityType && !query.entityId) || (!query?.entityType && query?.entityId)) {
    return { error: "invalid_request" as const, reason: "entity_type_and_id_required" };
  }

  let items = store.crmEntityTags.filter((a) => a.tenantId === principal.tenantId);
  if (query?.tagId) items = items.filter((a) => a.tagId === query.tagId);
  if (query?.entityType && query?.entityId) {
    items = items.filter((a) => a.entityType === query.entityType && a.entityId === query.entityId);
  }

  items = items.filter((a) =>
    entityAuthorized(store, principal, a.entityType, a.entityId, false),
  );
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const limit = Math.min(Math.max(query?.limit ?? DEFAULT_LIST_LIMIT, 1), MAX_LIST_LIMIT);
  if (query?.cursor) {
    const idx = items.findIndex((a) => a.id === query.cursor);
    if (idx >= 0) items = items.slice(idx + 1);
  }
  const page = items.slice(0, limit);
  const nextCursor = page.length === limit && items.length > limit ? page[page.length - 1]?.id : undefined;
  return { items: page, ...(nextCursor !== undefined ? { nextCursor } : {}) };
}

export function assignTag(
  store: Store,
  principal: Principal,
  input: { tagId: string; entityType: string; entityId: string },
  correlationId: string,
) {
  ensureCrmCollections(store);
  if (!isValidTagEntityType(input.entityType)) {
    return { error: "invalid_request" as const, reason: "invalid_entity_type" };
  }

  const tag = store.crmTags.find((t) => t.id === input.tagId && t.tenantId === principal.tenantId);
  if (!tag || tag.archivedAt) return { error: "not_found" as const };

  const tagDecision = authorize({ principal, permission: "crm:write:tag", action: "write:crm_entity_tag" });
  if (tagDecision.result === "deny") {
    return { error: "forbidden" as const, reason: tagDecision.reason };
  }
  if (!entityAuthorized(store, principal, input.entityType, input.entityId, true)) {
    return { error: "forbidden" as const, reason: "entity_access" };
  }

  const exists = store.crmEntityTags.some(
    (a) =>
      a.tenantId === principal.tenantId &&
      a.tagId === input.tagId &&
      a.entityType === input.entityType &&
      a.entityId === input.entityId,
  );
  if (exists) return { error: "conflict" as const, reason: "duplicate_tag_assignment" };

  const assignment: CrmEntityTag = {
    id: newId(),
    tenantId: principal.tenantId,
    tagId: input.tagId,
    entityType: input.entityType,
    entityId: input.entityId,
    createdAt: new Date().toISOString(),
    createdByPrincipalId: principal.id,
  };
  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.TAG_ASSIGNED,
    entityType: "entity_tag",
    entityId: assignment.id,
    classification: "Internal",
    correlationId,
    payload: {
      assignmentId: assignment.id,
      tagId: assignment.tagId,
      linkedEntityType: assignment.entityType,
      linkedEntityId: assignment.entityId,
    },
    mutate: () => {
      store.crmEntityTags.push(assignment);
      allowCrmAudit(store, principal, "crm:write:tag", "crm_entity_tag", assignment.id, correlationId, {
        tagId: assignment.tagId,
        entityType: assignment.entityType,
        entityId: assignment.entityId,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { assignment };
}

export function removeTagAssignment(store: Store, principal: Principal, assignmentId: string, correlationId: string) {
  ensureCrmCollections(store);
  const idx = store.crmEntityTags.findIndex((a) => a.id === assignmentId && a.tenantId === principal.tenantId);
  if (idx < 0) return { error: "not_found" as const };

  const assignment = store.crmEntityTags[idx]!;
  const decision = authorize({ principal, permission: "crm:write:tag", action: "remove:crm_entity_tag" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (!entityAuthorized(store, principal, assignment.entityType, assignment.entityId, true)) {
    return { error: "forbidden" as const, reason: "entity_access" };
  }

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.TAG_REMOVED,
    entityType: "entity_tag",
    entityId: assignmentId,
    classification: "Internal",
    correlationId,
    payload: {
      assignmentId,
      tagId: assignment.tagId,
    },
    mutate: () => {
      store.crmEntityTags.splice(idx, 1);
      allowCrmAudit(store, principal, "crm:write:tag", "crm_entity_tag", assignmentId, correlationId, {
        removed: true,
        tagId: assignment.tagId,
        entityType: assignment.entityType,
        entityId: assignment.entityId,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { removed: true };
}

export function entityHasTag(store: Store, tenantId: string, entityType: string, entityId: string, tagId: string): boolean {
  return store.crmEntityTags.some(
    (a) => a.tenantId === tenantId && a.tagId === tagId && a.entityType === entityType && a.entityId === entityId,
  );
}
