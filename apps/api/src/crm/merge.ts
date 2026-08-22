import {
  authorize,
  canonicalDuplicatePair,
  clearanceAllows,
  CRM_EVENT_TYPES,
  isAllowedContactMergeField,
  isAllowedOrgMergeField,
  isValidMergeEntityType,
  maxClassification,
  newId,
  type Classification,
  type CrmContact,
  type CrmMergeRecord,
  type CrmOrganization,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";
import { contactResource } from "./contact.js";
import {
  externalIdentifierMergeConflicts,
  repointExternalIdentifiers,
} from "./external-identifier.js";
import { orgResource } from "./organization.js";

export type ExecuteMergeInput = {
  entityType: string;
  survivorId: string;
  duplicateIds: string[];
  fieldResolutions?: Record<string, unknown>;
  reason: string;
  duplicateCandidateId?: string;
  expectedVersions?: Record<string, number>;
};

function mergeIdempotencyKey(tenantId: string, key: string): string {
  return `${tenantId}:${key}`;
}

function findConfirmedCandidate(
  store: Store,
  tenantId: string,
  entityType: "organization" | "contact",
  survivorId: string,
  duplicateId: string,
  candidateId?: string,
) {
  const [a, b] = canonicalDuplicatePair(survivorId, duplicateId);
  return store.crmDuplicateCandidates.find((c) => {
    if (c.tenantId !== tenantId || c.entityType !== entityType) return false;
    if (candidateId && c.id !== candidateId) return false;
    return c.entityIdA === a && c.entityIdB === b && c.status === "ConfirmedDuplicate";
  });
}

function isMergeableOrg(org: CrmOrganization): boolean {
  return !org.archivedAt && !org.mergedIntoId;
}

function isMergeableContact(contact: CrmContact): boolean {
  return !contact.archivedAt && !contact.mergedIntoId;
}

function applyOrgFieldResolutions(org: CrmOrganization, fieldResolutions: Record<string, unknown>) {
  for (const [field, value] of Object.entries(fieldResolutions)) {
    if (!isAllowedOrgMergeField(field)) continue;
    if (value === undefined || value === null) continue;
    switch (field) {
      case "legalName":
        org.legalName = String(value).trim();
        break;
      case "tradingName":
        org.tradingName = String(value).trim();
        break;
      case "country":
        org.country = String(value);
        break;
      case "region":
        org.region = String(value);
        break;
      case "market":
        org.market = String(value);
        break;
      case "website":
        org.website = String(value);
        break;
      case "domain":
        org.domain = String(value);
        break;
      case "primaryEmail":
        org.primaryEmail = String(value);
        break;
      case "primaryTelephone":
        org.primaryTelephone = String(value);
        break;
      case "classification":
        org.classification = value as Classification;
        break;
    }
  }
}

function applyContactFieldResolutions(contact: CrmContact, fieldResolutions: Record<string, unknown>) {
  for (const [field, value] of Object.entries(fieldResolutions)) {
    if (!isAllowedContactMergeField(field)) continue;
    if (value === undefined || value === null) continue;
    switch (field) {
      case "givenName":
        contact.givenName = String(value).trim();
        break;
      case "familyName":
        contact.familyName = String(value).trim();
        break;
      case "preferredName":
        contact.preferredName = String(value).trim();
        break;
      case "email":
        contact.email = String(value).trim();
        break;
      case "telephone":
        contact.telephone = String(value).trim();
        break;
      case "mobile":
        contact.mobile = String(value).trim();
        break;
      case "jobTitle":
        contact.jobTitle = String(value).trim();
        break;
      case "department":
        contact.department = String(value).trim();
        break;
      case "classification":
        contact.classification = value as Classification;
        break;
    }
  }
}

function repointEntityTags(
  store: Store,
  tenantId: string,
  entityType: string,
  fromId: string,
  toId: string,
): number {
  let repointed = 0;
  let removed = 0;
  const removeIds: string[] = [];

  for (const tag of store.crmEntityTags) {
    if (tag.tenantId !== tenantId || tag.entityType !== entityType || tag.entityId !== fromId) continue;
    const survivorHas = store.crmEntityTags.some(
      (a) =>
        a.tenantId === tenantId &&
        a.tagId === tag.tagId &&
        a.entityType === entityType &&
        a.entityId === toId &&
        a.id !== tag.id,
    );
    if (survivorHas) {
      removeIds.push(tag.id);
      removed += 1;
    } else {
      tag.entityId = toId;
      repointed += 1;
    }
  }

  if (removeIds.length > 0) {
    store.crmEntityTags = store.crmEntityTags.filter((a) => !removeIds.includes(a.id));
  }
  return repointed + removed;
}

function repointOrganizationReferences(store: Store, tenantId: string, fromId: string, toId: string): Record<string, number> {
  const counts: Record<string, number> = {
    organizationUnits: 0,
    relationships: 0,
    accounts: 0,
    activities: 0,
    notes: 0,
    tasks: 0,
    entityTags: 0,
    externalIdentifiers: 0,
    duplicateCandidates: 0,
  };

  for (const unit of store.crmOrganizationUnits) {
    if (unit.tenantId === tenantId && unit.organizationId === fromId) {
      unit.organizationId = toId;
      counts.organizationUnits! += 1;
    }
  }

  for (const rel of store.crmRelationships) {
    if (rel.tenantId !== tenantId) continue;
    if (rel.fromOrganizationId === fromId) {
      rel.fromOrganizationId = toId;
      counts.relationships! += 1;
    }
    if (rel.toOrganizationId === fromId) {
      rel.toOrganizationId = toId;
      counts.relationships! += 1;
    }
  }

  for (const account of store.crmAccounts) {
    if (account.tenantId === tenantId && account.organizationId === fromId) {
      account.organizationId = toId;
      counts.accounts! += 1;
    }
  }

  for (const activity of store.crmActivities) {
    if (activity.tenantId === tenantId && activity.organizationId === fromId) {
      activity.organizationId = toId;
      counts.activities! += 1;
    }
  }

  for (const note of store.crmNotes) {
    if (note.tenantId !== tenantId) continue;
    if (note.entityType === "organization" && note.entityId === fromId) {
      note.entityId = toId;
      counts.notes! += 1;
    }
    if (note.entityType === "organization_unit") {
      const unit = store.crmOrganizationUnits.find((u) => u.id === note.entityId);
      if (unit?.organizationId === toId || unit?.organizationId === fromId) {
        // units already repointed; note entityId unchanged
      }
    }
  }

  for (const task of store.crmTasks) {
    if (task.tenantId === tenantId && task.relatedOrganizationId === fromId) {
      task.relatedOrganizationId = toId;
      counts.tasks! += 1;
    }
  }

  counts.entityTags = repointEntityTags(store, tenantId, "organization", fromId, toId);

  const extResult = repointExternalIdentifiers(store, tenantId, "organization", fromId, toId);
  counts.externalIdentifiers = (counts.externalIdentifiers ?? 0) + extResult.repointed + extResult.removed;

  for (const candidate of store.crmDuplicateCandidates) {
    if (candidate.tenantId !== tenantId) continue;
    if (candidate.entityIdA === fromId) candidate.entityIdA = toId;
    if (candidate.entityIdB === fromId) candidate.entityIdB = toId;
    if (candidate.entityIdA === toId || candidate.entityIdB === toId) counts.duplicateCandidates! += 1;
  }

  return counts;
}

function repointContactReferences(store: Store, tenantId: string, fromId: string, toId: string): Record<string, number> {
  const counts: Record<string, number> = {
    relationships: 0,
    activities: 0,
    notes: 0,
    tasks: 0,
    entityTags: 0,
    externalIdentifiers: 0,
    duplicateCandidates: 0,
  };

  for (const rel of store.crmRelationships) {
    if (rel.tenantId !== tenantId) continue;
    if (rel.fromContactId === fromId) {
      rel.fromContactId = toId;
      counts.relationships! += 1;
    }
    if (rel.toContactId === fromId) {
      rel.toContactId = toId;
      counts.relationships! += 1;
    }
  }

  for (const activity of store.crmActivities) {
    if (activity.tenantId === tenantId && activity.contactId === fromId) {
      activity.contactId = toId;
      counts.activities! += 1;
    }
  }

  for (const note of store.crmNotes) {
    if (note.tenantId === tenantId && note.entityType === "contact" && note.entityId === fromId) {
      note.entityId = toId;
      counts.notes! += 1;
    }
  }

  for (const task of store.crmTasks) {
    if (task.tenantId === tenantId && task.relatedContactId === fromId) {
      task.relatedContactId = toId;
      counts.tasks! += 1;
    }
  }

  counts.entityTags = repointEntityTags(store, tenantId, "contact", fromId, toId);

  const extResult = repointExternalIdentifiers(store, tenantId, "contact", fromId, toId);
  counts.externalIdentifiers = (counts.externalIdentifiers ?? 0) + extResult.repointed + extResult.removed;

  for (const candidate of store.crmDuplicateCandidates) {
    if (candidate.tenantId !== tenantId) continue;
    if (candidate.entityIdA === fromId) candidate.entityIdA = toId;
    if (candidate.entityIdB === fromId) candidate.entityIdB = toId;
    if (candidate.entityIdA === toId || candidate.entityIdB === toId) counts.duplicateCandidates! += 1;
  }

  return counts;
}

export function getMergeRecord(store: Store, principal: Principal, mergeId: string) {
  ensureCrmCollections(store);
  const record = store.crmMergeRecords.find((m) => m.id === mergeId);
  if (!record || record.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:merge:record",
    action: "read:crm_merge_record",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { merge: record };
}

export function executeMerge(
  store: Store,
  principal: Principal,
  input: ExecuteMergeInput,
  correlationId: string,
  idempotencyKey?: string,
) {
  ensureCrmCollections(store);

  if (!idempotencyKey?.trim()) {
    return { error: "invalid_request" as const, reason: "idempotency_key_required" };
  }
  const idemKey = mergeIdempotencyKey(principal.tenantId, idempotencyKey.trim());
  const existingId = store.crmMergeIdempotency[idemKey];
  if (existingId) {
    const existing = store.crmMergeRecords.find((m) => m.id === existingId);
    if (existing) return { merge: existing, replay: true as const };
    return { error: "conflict" as const, reason: "idempotency_key_reuse" };
  }

  const decision = authorize({
    principal,
    permission: "crm:merge:record",
    action: "merge:crm_record",
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:merge:record", "crm_merge_record", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!isValidMergeEntityType(input.entityType)) {
    return { error: "invalid_request" as const, reason: "invalid_entity_type" };
  }
  if (!input.survivorId || !input.duplicateIds?.length) {
    return { error: "invalid_request" as const, reason: "survivor_and_duplicate_required" };
  }
  if (input.duplicateIds.length !== 1) {
    return { error: "invalid_request" as const, reason: "single_duplicate_supported" };
  }
  const duplicateId = input.duplicateIds[0]!;
  if (duplicateId === input.survivorId) {
    return { error: "invalid_request" as const, reason: "survivor_duplicate_same" };
  }
  const reason = input.reason?.trim();
  if (!reason) return { error: "invalid_request" as const, reason: "merge_reason_required" };

  const fieldResolutions = input.fieldResolutions ?? {};
  for (const field of Object.keys(fieldResolutions)) {
    const allowed =
      input.entityType === "organization" ? isAllowedOrgMergeField(field) : isAllowedContactMergeField(field);
    if (!allowed) return { error: "invalid_request" as const, reason: "invalid_field_resolution" };
  }

  const candidate = findConfirmedCandidate(
    store,
    principal.tenantId,
    input.entityType,
    input.survivorId,
    duplicateId,
    input.duplicateCandidateId,
  );
  if (!candidate) return { error: "conflict" as const, reason: "duplicate_not_confirmed" };

  if (input.entityType === "organization") {
    const survivor = store.crmOrganizations.find((o) => o.id === input.survivorId);
    const duplicate = store.crmOrganizations.find((o) => o.id === duplicateId);
    if (!survivor || !duplicate || survivor.tenantId !== principal.tenantId || duplicate.tenantId !== principal.tenantId) {
      return { error: "not_found" as const };
    }
    if (!isMergeableOrg(survivor) || !isMergeableOrg(duplicate)) {
      return { error: "conflict" as const, reason: "entity_not_mergeable" };
    }
    if (externalIdentifierMergeConflicts(store, principal.tenantId, survivor.id, duplicate.id, "organization")) {
      return { error: "conflict" as const, reason: "external_identifier_conflict" };
    }

    const survivorAuth = authorize({
      principal,
      permission: "crm:merge:record",
      action: "merge:crm_organization",
      resource: orgResource(survivor),
    });
    const duplicateAuth = authorize({
      principal,
      permission: "crm:merge:record",
      action: "merge:crm_organization",
      resource: orgResource(duplicate),
    });
    if (survivorAuth.result === "deny" || duplicateAuth.result === "deny") {
      return { error: "forbidden" as const, reason: "classification" };
    }
    if (
      !clearanceAllows(principal.classificationClearance, survivor.classification) ||
      !clearanceAllows(principal.classificationClearance, duplicate.classification)
    ) {
      return { error: "forbidden" as const, reason: "classification" };
    }

    const expected = input.expectedVersions ?? {};
    if (expected[survivor.id] !== undefined && expected[survivor.id] !== survivor.version) {
      return { error: "conflict" as const, reason: "concurrent_modification" };
    }
    if (expected[duplicate.id] !== undefined && expected[duplicate.id] !== duplicate.version) {
      return { error: "conflict" as const, reason: "concurrent_modification" };
    }

    applyOrgFieldResolutions(survivor, fieldResolutions);
    survivor.classification = maxClassification(survivor.classification, duplicate.classification);
    survivor.version += 1;
    survivor.updatedAt = new Date().toISOString();
    survivor.updatedByPrincipalId = principal.id;

    const affectedCounts = repointOrganizationReferences(store, principal.tenantId, duplicate.id, survivor.id);

    duplicate.mergedIntoId = survivor.id;
    duplicate.archivedAt = new Date().toISOString();
    duplicate.version += 1;
    duplicate.updatedAt = duplicate.archivedAt;
    duplicate.updatedByPrincipalId = principal.id;

    const mergeRecord: CrmMergeRecord = {
      id: newId(),
      tenantId: principal.tenantId,
      entityType: "organization",
      survivorId: survivor.id,
      mergedIds: [duplicate.id],
      duplicateCandidateId: candidate.id,
      fieldResolutions,
      reason,
      idempotencyKey: idempotencyKey.trim(),
      affectedCounts,
      mergedAt: new Date().toISOString(),
      mergedByPrincipalId: principal.id,
    };
    const committed = commitCrmWithOutbox(store, principal, {
      eventType: CRM_EVENT_TYPES.RECORD_MERGED,
      entityType: "merge_record",
      entityId: mergeRecord.id,
      classification: survivor.classification,
      correlationId,
      payload: {
        mergeRecordId: mergeRecord.id,
        entityType: mergeRecord.entityType,
        survivorId: mergeRecord.survivorId,
        mergedIds: mergeRecord.mergedIds,
        duplicateCandidateId: mergeRecord.duplicateCandidateId,
      },
      additionalEvents: [
        {
          eventType: CRM_EVENT_TYPES.ORGANIZATION_MERGED,
          entityType: "organization",
          entityId: duplicate.id,
          classification: duplicate.classification,
          correlationId,
          payload: {
            organizationId: duplicate.id,
            survivorId: survivor.id,
            mergedIntoId: survivor.id,
          },
        },
      ],
      mutate: () => {
        store.crmMergeRecords.push(mergeRecord);
        store.crmMergeIdempotency[idemKey] = mergeRecord.id;
        allowCrmAudit(store, principal, "crm:merge:record", "crm_merge_record", mergeRecord.id, correlationId, {
          entityType: mergeRecord.entityType,
          survivorId: mergeRecord.survivorId,
          mergedIds: mergeRecord.mergedIds,
          affectedCounts,
        });
      },
    });
    if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
    return { merge: mergeRecord };
  }

  const survivor = store.crmContacts.find((c) => c.id === input.survivorId);
  const duplicate = store.crmContacts.find((c) => c.id === duplicateId);
  if (!survivor || !duplicate || survivor.tenantId !== principal.tenantId || duplicate.tenantId !== principal.tenantId) {
    return { error: "not_found" as const };
  }
  if (!isMergeableContact(survivor) || !isMergeableContact(duplicate)) {
    return { error: "conflict" as const, reason: "entity_not_mergeable" };
  }
  if (externalIdentifierMergeConflicts(store, principal.tenantId, survivor.id, duplicate.id, "contact")) {
    return { error: "conflict" as const, reason: "external_identifier_conflict" };
  }

  const survivorAuth = authorize({
    principal,
    permission: "crm:merge:record",
    action: "merge:crm_contact",
    resource: contactResource(survivor),
  });
  const duplicateAuth = authorize({
    principal,
    permission: "crm:merge:record",
    action: "merge:crm_contact",
    resource: contactResource(duplicate),
  });
  if (survivorAuth.result === "deny" || duplicateAuth.result === "deny") {
    return { error: "forbidden" as const, reason: "classification" };
  }
  if (
    !clearanceAllows(principal.classificationClearance, survivor.classification) ||
    !clearanceAllows(principal.classificationClearance, duplicate.classification)
  ) {
    return { error: "forbidden" as const, reason: "classification" };
  }

  const expected = input.expectedVersions ?? {};
  if (expected[survivor.id] !== undefined && expected[survivor.id] !== survivor.version) {
    return { error: "conflict" as const, reason: "concurrent_modification" };
  }
  if (expected[duplicate.id] !== undefined && expected[duplicate.id] !== duplicate.version) {
    return { error: "conflict" as const, reason: "concurrent_modification" };
  }

  applyContactFieldResolutions(survivor, fieldResolutions);
  survivor.classification = maxClassification(survivor.classification, duplicate.classification);
  survivor.version += 1;
  survivor.updatedAt = new Date().toISOString();
  survivor.updatedByPrincipalId = principal.id;

  const affectedCounts = repointContactReferences(store, principal.tenantId, duplicate.id, survivor.id);

  duplicate.mergedIntoId = survivor.id;
  duplicate.archivedAt = new Date().toISOString();
  duplicate.version += 1;
  duplicate.updatedAt = duplicate.archivedAt;
  duplicate.updatedByPrincipalId = principal.id;

  const mergeRecord: CrmMergeRecord = {
    id: newId(),
    tenantId: principal.tenantId,
    entityType: "contact",
    survivorId: survivor.id,
    mergedIds: [duplicate.id],
    duplicateCandidateId: candidate.id,
    fieldResolutions,
    reason,
    idempotencyKey: idempotencyKey.trim(),
    affectedCounts,
    mergedAt: new Date().toISOString(),
    mergedByPrincipalId: principal.id,
  };
  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.RECORD_MERGED,
    entityType: "merge_record",
    entityId: mergeRecord.id,
    classification: survivor.classification,
    correlationId,
    payload: {
      mergeRecordId: mergeRecord.id,
      entityType: mergeRecord.entityType,
      survivorId: mergeRecord.survivorId,
      mergedIds: mergeRecord.mergedIds,
      duplicateCandidateId: mergeRecord.duplicateCandidateId,
    },
    additionalEvents: [
      {
        eventType: CRM_EVENT_TYPES.CONTACT_MERGED,
        entityType: "contact",
        entityId: duplicate.id,
        classification: duplicate.classification,
        correlationId,
        payload: {
          contactId: duplicate.id,
          survivorId: survivor.id,
          mergedIntoId: survivor.id,
        },
      },
    ],
    mutate: () => {
      store.crmMergeRecords.push(mergeRecord);
      store.crmMergeIdempotency[idemKey] = mergeRecord.id;
      allowCrmAudit(store, principal, "crm:merge:record", "crm_merge_record", mergeRecord.id, correlationId, {
        entityType: mergeRecord.entityType,
        survivorId: mergeRecord.survivorId,
        mergedIds: mergeRecord.mergedIds,
        affectedCounts,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { merge: mergeRecord };
}
