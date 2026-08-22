import type { Classification } from "./types.js";
import type { EventCatalogueEntry } from "./events.js";

/** Authoritative CRM domain event type strings (v1). */
export const CRM_EVENT_TYPES = {
  ORGANIZATION_CREATED: "crm.organization.created.v1",
  ORGANIZATION_UPDATED: "crm.organization.updated.v1",
  ORGANIZATION_ARCHIVED: "crm.organization.archived.v1",
  ORGANIZATION_MERGED: "crm.organization.merged.v1",
  ORGANIZATION_UNIT_CREATED: "crm.organization_unit.created.v1",
  ORGANIZATION_UNIT_UPDATED: "crm.organization_unit.updated.v1",
  CONTACT_CREATED: "crm.contact.created.v1",
  CONTACT_UPDATED: "crm.contact.updated.v1",
  CONTACT_ARCHIVED: "crm.contact.archived.v1",
  CONTACT_MERGED: "crm.contact.merged.v1",
  RELATIONSHIP_CREATED: "crm.relationship.created.v1",
  RELATIONSHIP_UPDATED: "crm.relationship.updated.v1",
  RELATIONSHIP_TRANSITIONED: "crm.relationship.transitioned.v1",
  ACTIVITY_CREATED: "crm.activity.created.v1",
  ACTIVITY_UPDATED: "crm.activity.updated.v1",
  ACTIVITY_ARCHIVED: "crm.activity.archived.v1",
  ACCOUNT_CREATED: "crm.account.created.v1",
  ACCOUNT_UPDATED: "crm.account.updated.v1",
  ACCOUNT_TRANSITIONED: "crm.account.transitioned.v1",
  ACCOUNT_ARCHIVED: "crm.account.archived.v1",
  ACCOUNT_OWNER_REASSIGNED: "crm.account.owner_reassigned.v1",
  NOTE_CREATED: "crm.note.created.v1",
  NOTE_UPDATED: "crm.note.updated.v1",
  NOTE_ARCHIVED: "crm.note.archived.v1",
  TASK_CREATED: "crm.task.created.v1",
  TASK_UPDATED: "crm.task.updated.v1",
  TASK_COMPLETED: "crm.task.completed.v1",
  TASK_CANCELLED: "crm.task.cancelled.v1",
  DUPLICATE_CANDIDATE_CREATED: "crm.duplicate_candidate.created.v1",
  DUPLICATE_CANDIDATE_REVIEWED: "crm.duplicate_candidate.reviewed.v1",
  IMPORT_CREATED: "crm.import.created.v1",
  IMPORT_VALIDATED: "crm.import.validated.v1",
  IMPORT_COMMITTED: "crm.import.committed.v1",
  IMPORT_FAILED: "crm.import.failed.v1",
  RECORD_MERGED: "crm.record.merged.v1",
  TAG_CREATED: "crm.tag.created.v1",
  TAG_UPDATED: "crm.tag.updated.v1",
  TAG_ARCHIVED: "crm.tag.archived.v1",
  TAG_ASSIGNED: "crm.tag.assigned.v1",
  TAG_REMOVED: "crm.tag.removed.v1",
  EXTERNAL_IDENTIFIER_CREATED: "crm.external_identifier.created.v1",
  EXTERNAL_IDENTIFIER_DELETED: "crm.external_identifier.deleted.v1",
} as const;

export type CrmEventType = (typeof CRM_EVENT_TYPES)[keyof typeof CRM_EVENT_TYPES];

export const CRM_EVENT_TYPE_SET = new Set<string>(Object.values(CRM_EVENT_TYPES));

export function isCrmEventType(eventType: string): eventType is CrmEventType {
  return CRM_EVENT_TYPE_SET.has(eventType);
}

export type CrmEventEntityRef = {
  entityType: string;
  entityId: string;
};

export type CrmDomainEventPayload = CrmEventEntityRef & Record<string, unknown>;

const CRM_FORBIDDEN_PAYLOAD_KEYS = [
  "email",
  "phone",
  "telephone",
  "mobile",
  "passport",
  "password",
  "body",
  "csvContent",
  "csv",
  "nationalId",
  "ssn",
  "dateOfBirth",
  "address",
  "primaryEmail",
  "primaryTelephone",
];

const BASE_REQUIRED = [
  { name: "entityType", type: "string" },
  { name: "entityId", type: "string" },
] as const;

function crmCatalogueEntry(
  eventType: CrmEventType,
  purpose: string,
  classification: Classification,
  requiredFields: Array<{ name: string; type: string }>,
  optionalFields: Array<{ name: string; type: string }> = [],
  orderingKey: "aggregateId" | "tenantId" | "none" = "aggregateId",
): EventCatalogueEntry {
  return {
    eventType,
    owner: "crm",
    purpose,
    schemaVersion: 1,
    classification,
    producer: "serengeti-eos-crm",
    consumers: [],
    retentionDays: 365,
    compatibility: "backward",
    lifecycle: "active",
    orderingKey,
    requiredFields: [...BASE_REQUIRED.map((f) => ({ ...f })), ...requiredFields],
    optionalFields,
    forbiddenPayloadKeys: [...CRM_FORBIDDEN_PAYLOAD_KEYS],
    maxPayloadBytes: 8192,
    sensitiveDataPolicy: "reference_only",
  };
}

/** Full CRM event catalogue for Development/Test registration. */
export function buildCrmEventCatalogue(): EventCatalogueEntry[] {
  return [
    crmCatalogueEntry(CRM_EVENT_TYPES.ORGANIZATION_CREATED, "Organization created", "Internal", [
      { name: "organizationId", type: "string" },
      { name: "status", type: "string" },
    ], [{ name: "legalName", type: "string" }]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ORGANIZATION_UPDATED, "Organization updated", "Internal", [
      { name: "organizationId", type: "string" },
    ], [{ name: "status", type: "string" }, { name: "previousStatus", type: "string" }]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ORGANIZATION_ARCHIVED, "Organization archived", "Internal", [
      { name: "organizationId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ORGANIZATION_MERGED, "Organization merged into survivor", "Internal", [
      { name: "organizationId", type: "string" },
      { name: "survivorId", type: "string" },
      { name: "mergedIntoId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ORGANIZATION_UNIT_CREATED, "Organization unit created", "Internal", [
      { name: "organizationUnitId", type: "string" },
      { name: "organizationId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ORGANIZATION_UNIT_UPDATED, "Organization unit updated", "Internal", [
      { name: "organizationUnitId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.CONTACT_CREATED, "Contact created", "Confidential", [
      { name: "contactId", type: "string" },
    ], [{ name: "displayName", type: "string" }]),
    crmCatalogueEntry(CRM_EVENT_TYPES.CONTACT_UPDATED, "Contact updated", "Confidential", [
      { name: "contactId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.CONTACT_ARCHIVED, "Contact archived", "Confidential", [
      { name: "contactId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.CONTACT_MERGED, "Contact merged into survivor", "Confidential", [
      { name: "contactId", type: "string" },
      { name: "survivorId", type: "string" },
      { name: "mergedIntoId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.RELATIONSHIP_CREATED, "Relationship created", "Internal", [
      { name: "relationshipId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.RELATIONSHIP_UPDATED, "Relationship updated", "Internal", [
      { name: "relationshipId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.RELATIONSHIP_TRANSITIONED, "Relationship status changed", "Internal", [
      { name: "relationshipId", type: "string" },
      { name: "previousStatus", type: "string" },
      { name: "newStatus", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ACTIVITY_CREATED, "Activity created", "Confidential", [
      { name: "activityId", type: "string" },
    ], [{ name: "activityTypeId", type: "string" }]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ACTIVITY_UPDATED, "Activity updated", "Confidential", [
      { name: "activityId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ACTIVITY_ARCHIVED, "Activity archived", "Confidential", [
      { name: "activityId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ACCOUNT_CREATED, "Account created", "Internal", [
      { name: "accountId", type: "string" },
      { name: "organizationId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ACCOUNT_UPDATED, "Account updated", "Internal", [
      { name: "accountId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ACCOUNT_TRANSITIONED, "Account lifecycle changed", "Internal", [
      { name: "accountId", type: "string" },
      { name: "previousStatus", type: "string" },
      { name: "newStatus", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ACCOUNT_ARCHIVED, "Account archived", "Internal", [
      { name: "accountId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.ACCOUNT_OWNER_REASSIGNED, "Account owner reassigned", "Internal", [
      { name: "accountId", type: "string" },
      { name: "newOwnerPrincipalId", type: "string" },
    ], [{ name: "previousOwnerPrincipalId", type: "string" }]),
    crmCatalogueEntry(CRM_EVENT_TYPES.NOTE_CREATED, "Note created", "Confidential", [
      { name: "noteId", type: "string" },
      { name: "linkedEntityType", type: "string" },
      { name: "linkedEntityId", type: "string" },
    ], [{ name: "classification", type: "string" }]),
    crmCatalogueEntry(CRM_EVENT_TYPES.NOTE_UPDATED, "Note updated", "Confidential", [
      { name: "noteId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.NOTE_ARCHIVED, "Note archived", "Confidential", [
      { name: "noteId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.TASK_CREATED, "Task created", "Internal", [
      { name: "taskId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.TASK_UPDATED, "Task updated", "Internal", [
      { name: "taskId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.TASK_COMPLETED, "Task completed", "Internal", [
      { name: "taskId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.TASK_CANCELLED, "Task cancelled", "Internal", [
      { name: "taskId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.DUPLICATE_CANDIDATE_CREATED, "Duplicate candidate detected", "Internal", [
      { name: "duplicateCandidateId", type: "string" },
      { name: "matchedEntityType", type: "string" },
      { name: "entityIdA", type: "string" },
      { name: "entityIdB", type: "string" },
      { name: "score", type: "number" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.DUPLICATE_CANDIDATE_REVIEWED, "Duplicate candidate reviewed", "Internal", [
      { name: "duplicateCandidateId", type: "string" },
      { name: "decision", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.IMPORT_CREATED, "Import batch created", "Internal", [
      { name: "importBatchId", type: "string" },
      { name: "entityType", type: "string" },
      { name: "rowCount", type: "number" },
    ], [{ name: "sourceSystem", type: "string" }]),
    crmCatalogueEntry(CRM_EVENT_TYPES.IMPORT_VALIDATED, "Import batch validated", "Internal", [
      { name: "importBatchId", type: "string" },
      { name: "validCount", type: "number" },
      { name: "invalidCount", type: "number" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.IMPORT_COMMITTED, "Import batch committed", "Internal", [
      { name: "importBatchId", type: "string" },
      { name: "committedCount", type: "number" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.IMPORT_FAILED, "Import batch failed", "Internal", [
      { name: "importBatchId", type: "string" },
      { name: "reason", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.RECORD_MERGED, "Controlled merge completed", "Internal", [
      { name: "mergeRecordId", type: "string" },
      { name: "entityType", type: "string" },
      { name: "survivorId", type: "string" },
      { name: "mergedIds", type: "array" },
    ], [{ name: "duplicateCandidateId", type: "string" }]),
    crmCatalogueEntry(CRM_EVENT_TYPES.TAG_CREATED, "Tag created", "Internal", [
      { name: "tagId", type: "string" },
      { name: "key", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.TAG_UPDATED, "Tag updated", "Internal", [
      { name: "tagId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.TAG_ARCHIVED, "Tag archived", "Internal", [
      { name: "tagId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.TAG_ASSIGNED, "Tag assigned to entity", "Internal", [
      { name: "assignmentId", type: "string" },
      { name: "tagId", type: "string" },
      { name: "linkedEntityType", type: "string" },
      { name: "linkedEntityId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.TAG_REMOVED, "Tag assignment removed", "Internal", [
      { name: "assignmentId", type: "string" },
      { name: "tagId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.EXTERNAL_IDENTIFIER_CREATED, "External identifier created", "Internal", [
      { name: "externalIdentifierId", type: "string" },
      { name: "systemKey", type: "string" },
      { name: "linkedEntityType", type: "string" },
      { name: "linkedEntityId", type: "string" },
    ]),
    crmCatalogueEntry(CRM_EVENT_TYPES.EXTERNAL_IDENTIFIER_DELETED, "External identifier deleted", "Internal", [
      { name: "externalIdentifierId", type: "string" },
      { name: "systemKey", type: "string" },
    ]),
  ];
}

export function crmEventPayload(
  entityType: string,
  entityId: string,
  fields: Record<string, unknown>,
): CrmDomainEventPayload {
  return { entityType, entityId, ...fields };
}
