import {
  activitySubjectValid,
  authorize,
  clearanceAllows,
  CRM_EVENT_TYPES,
  isValidActivityTypeKey,
  maxClassification,
  newId,
  parseOccurredAt,
  type Classification,
  type CrmActivity,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections, seedCrmCatalogues } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";

const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 100;

type ActivityResource = {
  tenantId: string;
  type: "crm_activity";
  id: string;
  classification: Classification;
};

export function activityResource(activity: CrmActivity): ActivityResource {
  return {
    tenantId: activity.tenantId,
    type: "crm_activity",
    id: activity.id,
    classification: activity.classification,
  };
}

function findActivityForTenant(store: Store, tenantId: string, id: string): CrmActivity | undefined {
  const activity = store.crmActivities.find((a) => a.id === id);
  if (!activity || activity.tenantId !== tenantId) return undefined;
  return activity;
}

function principalCanReadActivity(principal: Principal, activity: CrmActivity): boolean {
  return clearanceAllows(principal.classificationClearance, activity.classification);
}

function resolveClassification(
  store: Store,
  tenantId: string,
  input: {
    classification?: Classification;
    contactId?: string;
    organizationId?: string;
  },
): Classification | { error: "invalid_request"; reason: string } {
  let classification: Classification = input.classification ?? "Internal";
  if (input.contactId) {
    const contact = store.crmContacts.find((c) => c.id === input.contactId && c.tenantId === tenantId);
    if (!contact) return { error: "invalid_request", reason: "invalid_contact" };
    classification = maxClassification(classification, contact.classification);
  }
  if (input.organizationId) {
    const org = store.crmOrganizations.find((o) => o.id === input.organizationId && o.tenantId === tenantId);
    if (!org) return { error: "invalid_request", reason: "invalid_organization" };
    classification = maxClassification(classification, org.classification);
  }
  return classification;
}

function sortActivities(items: CrmActivity[]): CrmActivity[] {
  return [...items].sort((a, b) => {
    const t = b.occurredAt.localeCompare(a.occurredAt);
    if (t !== 0) return t;
    return b.id.localeCompare(a.id);
  });
}

export type ListActivitiesQuery = {
  activityType?: string;
  contactId?: string;
  organizationId?: string;
  organizationUnitId?: string;
  relationshipId?: string;
  occurredFrom?: string;
  occurredTo?: string;
  includeArchived?: boolean;
  limit?: number;
  cursor?: string;
};

export function listActivities(store: Store, principal: Principal, query: ListActivitiesQuery = {}) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);
  const decision = authorize({
    principal,
    permission: "crm:read:activity",
    action: "read:crm_activity",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.crmActivities.filter((a) => a.tenantId === principal.tenantId);
  if (!query.includeArchived) items = items.filter((a) => !a.archivedAt);

  if (query.activityType) {
    if (!isValidActivityTypeKey(query.activityType)) {
      return { error: "invalid_request" as const, reason: "invalid_activity_type" };
    }
    items = items.filter((a) => a.activityType === query.activityType);
  }
  if (query.contactId) items = items.filter((a) => a.contactId === query.contactId);
  if (query.organizationId) items = items.filter((a) => a.organizationId === query.organizationId);
  if (query.organizationUnitId) items = items.filter((a) => a.organizationUnitId === query.organizationUnitId);
  if (query.relationshipId) items = items.filter((a) => a.relationshipId === query.relationshipId);

  if (query.occurredFrom) {
    const from = parseOccurredAt(query.occurredFrom);
    if (!from.ok) return { error: "invalid_request" as const, reason: "invalid_occurred_from" };
    items = items.filter((a) => a.occurredAt >= from.iso);
  }
  if (query.occurredTo) {
    const to = parseOccurredAt(query.occurredTo);
    if (!to.ok) return { error: "invalid_request" as const, reason: "invalid_occurred_to" };
    items = items.filter((a) => a.occurredAt <= to.iso);
  }

  items = items.filter((a) => principalCanReadActivity(principal, a));
  items = sortActivities(items);

  const limit = Math.min(Math.max(query.limit ?? DEFAULT_LIST_LIMIT, 1), MAX_LIST_LIMIT);
  if (query.cursor) {
    const idx = items.findIndex((a) => a.id === query.cursor);
    if (idx >= 0) items = items.slice(idx + 1);
  }

  const page = items.slice(0, limit);
  const nextCursor = page.length === limit && items.length > limit ? page[page.length - 1]?.id : undefined;
  return {
    items: page,
    ...(nextCursor !== undefined ? { nextCursor } : {}),
  };
}

export function getActivity(store: Store, principal: Principal, activityId: string) {
  ensureCrmCollections(store);
  const activity = store.crmActivities.find((a) => a.id === activityId);
  if (!activity || activity.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:activity",
    action: "read:crm_activity",
    resource: activityResource(activity),
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (!principalCanReadActivity(principal, activity)) {
    return { error: "forbidden" as const, reason: "classification" };
  }
  return { activity };
}

export type CreateActivityInput = {
  activityType: string;
  subject: string;
  occurredAt: string;
  contactId?: string;
  organizationId?: string;
  organizationUnitId?: string;
  relationshipId?: string;
  ownerPrincipalId?: string;
  outcome?: string;
  notes?: string;
  classification?: Classification;
};

export function createActivity(
  store: Store,
  principal: Principal,
  input: CreateActivityInput,
  correlationId: string,
) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);

  if (!input.activityType || !isValidActivityTypeKey(input.activityType)) {
    return { error: "invalid_request" as const, reason: "invalid_activity_type" };
  }
  const typeActive = store.crmActivityTypes.some(
    (t) => t.tenantId === principal.tenantId && t.key === input.activityType && t.active,
  );
  if (!typeActive) return { error: "invalid_request" as const, reason: "invalid_activity_type" };

  if (!activitySubjectValid(input.subject ?? "")) {
    return { error: "invalid_request" as const, reason: "subject_required" };
  }

  const occurred = parseOccurredAt(input.occurredAt);
  if (!occurred.ok) return { error: "invalid_request" as const, reason: "invalid_occurred_at" };

  let contactId = input.contactId;
  let organizationId = input.organizationId;
  let organizationUnitId = input.organizationUnitId;
  let relationshipId = input.relationshipId;

  if (relationshipId) {
    const rel = store.crmRelationships.find(
      (r) => r.id === relationshipId && r.tenantId === principal.tenantId,
    );
    if (!rel) return { error: "invalid_request" as const, reason: "invalid_relationship" };
    if (rel.fromContactId) contactId = contactId ?? rel.fromContactId;
    if (rel.toOrganizationId) organizationId = organizationId ?? rel.toOrganizationId;
    if (contactId && rel.fromContactId && contactId !== rel.fromContactId) {
      return { error: "invalid_request" as const, reason: "relationship_contact_mismatch" };
    }
    if (organizationId && rel.toOrganizationId && organizationId !== rel.toOrganizationId) {
      return { error: "invalid_request" as const, reason: "relationship_organization_mismatch" };
    }
  }

  if (!contactId && !organizationId && !relationshipId) {
    return { error: "invalid_request" as const, reason: "association_required" };
  }

  if (contactId) {
    const contact = store.crmContacts.find((c) => c.id === contactId && c.tenantId === principal.tenantId);
    if (!contact) return { error: "invalid_request" as const, reason: "invalid_contact" };
  }
  if (organizationId) {
    const org = store.crmOrganizations.find((o) => o.id === organizationId && o.tenantId === principal.tenantId);
    if (!org) return { error: "invalid_request" as const, reason: "invalid_organization" };
  }
  if (organizationUnitId) {
    if (!organizationId) {
      return { error: "invalid_request" as const, reason: "organization_required_for_unit" };
    }
    const unit = store.crmOrganizationUnits.find(
      (u) =>
        u.id === organizationUnitId &&
        u.organizationId === organizationId &&
        u.tenantId === principal.tenantId,
    );
    if (!unit) return { error: "invalid_request" as const, reason: "invalid_organization_unit" };
  }

  const classificationResult = resolveClassification(store, principal.tenantId, {
    ...(input.classification !== undefined ? { classification: input.classification } : {}),
    ...(contactId !== undefined ? { contactId } : {}),
    ...(organizationId !== undefined ? { organizationId } : {}),
  });
  if (typeof classificationResult === "object" && "error" in classificationResult) {
    return { error: "invalid_request" as const, reason: classificationResult.reason };
  }

  const ownerId = input.ownerPrincipalId ?? principal.id;
  const owner = [...store.principals.values()].find((p) => p.id === ownerId && p.tenantId === principal.tenantId);
  if (!owner) return { error: "invalid_request" as const, reason: "invalid_owner" };

  const decision = authorize({
    principal,
    permission: "crm:write:activity",
    action: "write:crm_activity",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_activity",
      id: "new",
      classification: classificationResult,
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:activity", "crm_activity", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const now = new Date().toISOString();
  const activity: CrmActivity = {
    id: newId(),
    tenantId: principal.tenantId,
    activityType: input.activityType,
    subject: input.subject.trim(),
    occurredAt: occurred.iso,
    ownerPrincipalId: ownerId,
    classification: classificationResult,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
    ...(contactId !== undefined ? { contactId } : {}),
    ...(organizationId !== undefined ? { organizationId } : {}),
    ...(organizationUnitId !== undefined ? { organizationUnitId } : {}),
    ...(relationshipId !== undefined ? { relationshipId } : {}),
    ...(input.outcome !== undefined ? { outcome: input.outcome } : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
  };

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ACTIVITY_CREATED,
    entityType: "activity",
    entityId: activity.id,
    classification: activity.classification,
    correlationId,
    payload: { activityId: activity.id, activityTypeId: activity.activityType },
    mutate: () => {
      store.crmActivities.push(activity);
      allowCrmAudit(store, principal, "crm:write:activity", "crm_activity", activity.id, correlationId, {
        id: activity.id,
        activityType: activity.activityType,
        subject: activity.subject,
        occurredAt: activity.occurredAt,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { activity };
}

export type UpdateActivityInput = {
  activityType?: string;
  subject?: string;
  occurredAt?: string;
  outcome?: string;
  notes?: string;
};

export function updateActivity(
  store: Store,
  principal: Principal,
  activityId: string,
  input: UpdateActivityInput,
  correlationId: string,
  expectedVersion?: number,
) {
  ensureCrmCollections(store);
  const activity = findActivityForTenant(store, principal.tenantId, activityId);
  if (!activity) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:activity",
    action: "write:crm_activity",
    resource: activityResource(activity),
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:write:activity",
      "crm_activity",
      correlationId,
      decision.reason,
      activityId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (activity.archivedAt) {
    return { error: "conflict" as const, reason: "activity_not_mutable" };
  }

  if (expectedVersion !== undefined && activity.version !== expectedVersion) {
    return { error: "conflict" as const, reason: "version_mismatch" };
  }

  const previousState = { ...activity };

  if (input.activityType !== undefined) {
    if (!isValidActivityTypeKey(input.activityType)) {
      return { error: "invalid_request" as const, reason: "invalid_activity_type" };
    }
    const typeActive = store.crmActivityTypes.some(
      (t) => t.tenantId === principal.tenantId && t.key === input.activityType && t.active,
    );
    if (!typeActive) return { error: "invalid_request" as const, reason: "invalid_activity_type" };
    activity.activityType = input.activityType;
  }

  if (input.subject !== undefined) {
    if (!activitySubjectValid(input.subject)) {
      return { error: "invalid_request" as const, reason: "subject_required" };
    }
    activity.subject = input.subject.trim();
  }

  if (input.occurredAt !== undefined) {
    const occurred = parseOccurredAt(input.occurredAt);
    if (!occurred.ok) return { error: "invalid_request" as const, reason: "invalid_occurred_at" };
    activity.occurredAt = occurred.iso;
  }

  if (input.outcome !== undefined) activity.outcome = input.outcome;
  if (input.notes !== undefined) activity.notes = input.notes;

  activity.version += 1;
  activity.updatedAt = new Date().toISOString();
  activity.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ACTIVITY_UPDATED,
    entityType: "activity",
    entityId: activity.id,
    classification: activity.classification,
    correlationId,
    payload: { activityId: activity.id },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:activity",
        "crm_activity",
        activity.id,
        correlationId,
        {
          id: activity.id,
          activityType: activity.activityType,
          subject: activity.subject,
          occurredAt: activity.occurredAt,
        },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { activity };
}

export function archiveActivity(store: Store, principal: Principal, activityId: string, correlationId: string) {
  ensureCrmCollections(store);
  const activity = findActivityForTenant(store, principal.tenantId, activityId);
  if (!activity) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:activity",
    action: "archive:crm_activity",
    resource: activityResource(activity),
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:write:activity",
      "crm_activity",
      correlationId,
      decision.reason,
      activityId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (activity.archivedAt) return { error: "conflict" as const, reason: "already_archived" };

  const previousState = { archivedAt: activity.archivedAt };
  activity.archivedAt = new Date().toISOString();
  activity.version += 1;
  activity.updatedAt = activity.archivedAt;
  activity.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ACTIVITY_ARCHIVED,
    entityType: "activity",
    entityId: activity.id,
    classification: activity.classification,
    correlationId,
    payload: { activityId: activity.id },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:activity",
        "crm_activity",
        activity.id,
        correlationId,
        { archivedAt: activity.archivedAt },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { activity };
}

export function listContactActivities(
  store: Store,
  principal: Principal,
  contactId: string,
  query: Omit<ListActivitiesQuery, "contactId"> = {},
) {
  const contact = store.crmContacts.find((c) => c.id === contactId);
  if (!contact || contact.tenantId !== principal.tenantId) return { error: "not_found" as const };
  return listActivities(store, principal, { ...query, contactId });
}

export function listOrganizationActivities(
  store: Store,
  principal: Principal,
  organizationId: string,
  query: Omit<ListActivitiesQuery, "organizationId"> = {},
) {
  const org = store.crmOrganizations.find((o) => o.id === organizationId);
  if (!org || org.tenantId !== principal.tenantId) return { error: "not_found" as const };
  return listActivities(store, principal, { ...query, organizationId });
}

export function listRelationshipActivities(
  store: Store,
  principal: Principal,
  relationshipId: string,
  query: Omit<ListActivitiesQuery, "relationshipId"> = {},
) {
  const rel = store.crmRelationships.find((r) => r.id === relationshipId);
  if (!rel || rel.tenantId !== principal.tenantId) return { error: "not_found" as const };
  return listActivities(store, principal, { ...query, relationshipId });
}

export function listOrganizationUnitActivities(
  store: Store,
  principal: Principal,
  unitId: string,
  query: Omit<ListActivitiesQuery, "organizationUnitId"> = {},
) {
  const unit = store.crmOrganizationUnits.find((u) => u.id === unitId);
  if (!unit || unit.tenantId !== principal.tenantId) return { error: "not_found" as const };
  return listActivities(store, principal, { ...query, organizationUnitId: unitId });
}
