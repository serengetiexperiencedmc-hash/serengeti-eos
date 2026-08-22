import {
  authorize,
  clearanceAllows,
  CRM_EVENT_TYPES,
  isValidNoteEntityType,
  maxClassification,
  newId,
  noteBodyValid,
  type Classification,
  type CrmNote,
  type CrmNoteEntityType,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";

const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 100;

function noteResource(note: CrmNote) {
  return {
    tenantId: note.tenantId,
    type: "crm_note" as const,
    id: note.id,
    classification: note.classification,
  };
}

function findNote(store: Store, tenantId: string, id: string): CrmNote | undefined {
  const note = store.crmNotes.find((n) => n.id === id);
  if (!note || note.tenantId !== tenantId) return undefined;
  return note;
}

function resolveEntityClassification(
  store: Store,
  tenantId: string,
  entityType: CrmNoteEntityType,
  entityId: string,
): Classification | { error: "invalid_request"; reason: string } {
  switch (entityType) {
    case "organization": {
      const org = store.crmOrganizations.find((o) => o.id === entityId && o.tenantId === tenantId);
      if (!org) return { error: "invalid_request", reason: "invalid_entity" };
      return org.classification;
    }
    case "organization_unit": {
      const unit = store.crmOrganizationUnits.find((u) => u.id === entityId && u.tenantId === tenantId);
      if (!unit) return { error: "invalid_request", reason: "invalid_entity" };
      const org = store.crmOrganizations.find((o) => o.id === unit.organizationId);
      return org ? org.classification : "Internal";
    }
    case "contact": {
      const contact = store.crmContacts.find((c) => c.id === entityId && c.tenantId === tenantId);
      if (!contact) return { error: "invalid_request", reason: "invalid_entity" };
      return contact.classification;
    }
    case "relationship": {
      const rel = store.crmRelationships.find((r) => r.id === entityId && r.tenantId === tenantId);
      if (!rel) return { error: "invalid_request", reason: "invalid_entity" };
      return "Internal";
    }
    case "account": {
      const account = store.crmAccounts.find((a) => a.id === entityId && a.tenantId === tenantId);
      if (!account) return { error: "invalid_request", reason: "invalid_entity" };
      return account.classification;
    }
    case "activity": {
      const activity = store.crmActivities.find((a) => a.id === entityId && a.tenantId === tenantId);
      if (!activity) return { error: "invalid_request", reason: "invalid_entity" };
      return activity.classification;
    }
    default:
      return { error: "invalid_request", reason: "invalid_entity_type" };
  }
}

function entityExists(store: Store, tenantId: string, entityType: string, entityId: string): boolean {
  if (!isValidNoteEntityType(entityType)) return false;
  const result = resolveEntityClassification(store, tenantId, entityType, entityId);
  return typeof result === "string";
}

export function listNotes(
  store: Store,
  principal: Principal,
  query?: {
    entityType?: string;
    entityId?: string;
    createdByPrincipalId?: string;
    limit?: number;
    cursor?: string;
    includeArchived?: boolean;
  },
) {
  ensureCrmCollections(store);
  const decision = authorize({
    principal,
    permission: "crm:read:activity",
    action: "read:crm_note",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  if ((query?.entityType && !query.entityId) || (!query?.entityType && query?.entityId)) {
    return { error: "invalid_request" as const, reason: "entity_type_and_id_required" };
  }
  if (query?.entityType && !isValidNoteEntityType(query.entityType)) {
    return { error: "invalid_request" as const, reason: "invalid_entity_type" };
  }

  let items = store.crmNotes.filter((n) => n.tenantId === principal.tenantId);
  if (!query?.includeArchived) items = items.filter((n) => !n.archivedAt);
  if (query?.entityType && query?.entityId) {
    items = items.filter((n) => n.entityType === query.entityType && n.entityId === query.entityId);
  }
  if (query?.createdByPrincipalId) {
    items = items.filter((n) => n.createdByPrincipalId === query.createdByPrincipalId);
  }
  items = items.filter((n) => clearanceAllows(principal.classificationClearance, n.classification));
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const limit = Math.min(Math.max(query?.limit ?? DEFAULT_LIST_LIMIT, 1), MAX_LIST_LIMIT);
  if (query?.cursor) {
    const idx = items.findIndex((n) => n.id === query.cursor);
    if (idx >= 0) items = items.slice(idx + 1);
  }
  const page = items.slice(0, limit);
  const nextCursor = page.length === limit && items.length > limit ? page[page.length - 1]?.id : undefined;
  return { items: page, ...(nextCursor !== undefined ? { nextCursor } : {}) };
}

export function getNote(store: Store, principal: Principal, noteId: string) {
  ensureCrmCollections(store);
  const note = store.crmNotes.find((n) => n.id === noteId);
  if (!note || note.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:activity",
    action: "read:crm_note",
    resource: noteResource(note),
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (!clearanceAllows(principal.classificationClearance, note.classification)) {
    return { error: "forbidden" as const, reason: "classification" };
  }
  return { note };
}

export type CreateNoteInput = {
  body: string;
  entityType: string;
  entityId: string;
  classification?: Classification;
};

export function createNote(store: Store, principal: Principal, input: CreateNoteInput, correlationId: string) {
  ensureCrmCollections(store);
  if (!noteBodyValid(input.body ?? "")) return { error: "invalid_request" as const, reason: "body_required" };
  if (!isValidNoteEntityType(input.entityType)) {
    return { error: "invalid_request" as const, reason: "invalid_entity_type" };
  }

  const entityClass = resolveEntityClassification(
    store,
    principal.tenantId,
    input.entityType,
    input.entityId,
  );
  if (typeof entityClass === "object" && "error" in entityClass) {
    return { error: "invalid_request" as const, reason: entityClass.reason };
  }

  const classification = maxClassification(input.classification ?? "Internal", entityClass);

  const decision = authorize({
    principal,
    permission: "crm:write:activity",
    action: "write:crm_note",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_note",
      id: "new",
      classification,
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:activity", "crm_note", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const now = new Date().toISOString();
  const note: CrmNote = {
    id: newId(),
    tenantId: principal.tenantId,
    body: input.body.trim(),
    entityType: input.entityType,
    entityId: input.entityId,
    classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.NOTE_CREATED,
    entityType: "note",
    entityId: note.id,
    classification: note.classification,
    correlationId,
    payload: {
      noteId: note.id,
      linkedEntityType: note.entityType,
      linkedEntityId: note.entityId,
      classification: note.classification,
    },
    mutate: () => {
      store.crmNotes.push(note);
      allowCrmAudit(store, principal, "crm:write:activity", "crm_note", note.id, correlationId, {
        id: note.id,
        entityType: note.entityType,
        entityId: note.entityId,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { note };
}

export function updateNote(
  store: Store,
  principal: Principal,
  noteId: string,
  input: { body?: string },
  correlationId: string,
  expectedVersion?: number,
) {
  ensureCrmCollections(store);
  const note = findNote(store, principal.tenantId, noteId);
  if (!note) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:activity",
    action: "write:crm_note",
    resource: noteResource(note),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:activity", "crm_note", correlationId, decision.reason, noteId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (note.archivedAt) return { error: "conflict" as const, reason: "note_not_mutable" };
  if (expectedVersion !== undefined && note.version !== expectedVersion) {
    return { error: "conflict" as const, reason: "version_mismatch" };
  }
  if (input.body !== undefined && !noteBodyValid(input.body)) {
    return { error: "invalid_request" as const, reason: "body_required" };
  }

  const previousState = { bodyLength: note.body.length };
  if (input.body !== undefined) note.body = input.body.trim();
  note.version += 1;
  note.updatedAt = new Date().toISOString();
  note.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.NOTE_UPDATED,
    entityType: "note",
    entityId: note.id,
    classification: note.classification,
    correlationId,
    payload: { noteId: note.id },
    mutate: () => {
      allowCrmAudit(store, principal, "crm:write:activity", "crm_note", note.id, correlationId, {
        id: note.id,
        bodyLength: note.body.length,
      }, previousState);
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { note };
}

export function archiveNote(store: Store, principal: Principal, noteId: string, correlationId: string) {
  ensureCrmCollections(store);
  const note = findNote(store, principal.tenantId, noteId);
  if (!note) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:activity",
    action: "archive:crm_note",
    resource: noteResource(note),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:activity", "crm_note", correlationId, decision.reason, noteId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (note.archivedAt) return { error: "conflict" as const, reason: "already_archived" };

  note.archivedAt = new Date().toISOString();
  note.version += 1;
  note.updatedAt = note.archivedAt;
  note.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.NOTE_ARCHIVED,
    entityType: "note",
    entityId: note.id,
    classification: note.classification,
    correlationId,
    payload: { noteId: note.id },
    mutate: () => {
      allowCrmAudit(store, principal, "crm:write:activity", "crm_note", note.id, correlationId, {
        archivedAt: note.archivedAt,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { note };
}

export function listEntityNotes(
  store: Store,
  principal: Principal,
  entityType: string,
  entityId: string,
  query?: { limit?: number; cursor?: string },
) {
  if (!isValidNoteEntityType(entityType)) return { error: "invalid_request" as const, reason: "invalid_entity_type" };
  if (!entityExists(store, principal.tenantId, entityType, entityId)) {
    return { error: "not_found" as const };
  }
  return listNotes(store, principal, {
    entityType,
    entityId,
    ...(query?.limit !== undefined ? { limit: query.limit } : {}),
    ...(query?.cursor !== undefined ? { cursor: query.cursor } : {}),
  });
}
