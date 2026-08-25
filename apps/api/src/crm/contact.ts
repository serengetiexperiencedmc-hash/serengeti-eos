import {
  authorize,
  canArchiveContact,
  canTransitionContact,
  CRM_EVENT_TYPES,
  isPlausibleEmail,
  isPlausiblePhone,
  isValidContactStatus,
  newId,
  normalizeEmail,
  normalizePersonName,
  type Classification,
  type CrmContact,
  type CrmContactStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { registerDuplicateCandidatesForContact } from "./duplicate.js";
import { commitCrmWithOutbox } from "./events.js";

type ContactResource = {
  tenantId: string;
  type: "crm_contact";
  id: string;
  classification: Classification;
};

export function contactResource(contact: CrmContact): ContactResource {
  return {
    tenantId: contact.tenantId,
    type: "crm_contact",
    id: contact.id,
    classification: contact.classification,
  };
}

function sanitizeContact(c: CrmContact) {
  return {
    id: c.id,
    givenName: c.givenName,
    familyName: c.familyName,
    ...(c.preferredName !== undefined ? { preferredName: c.preferredName } : {}),
    ...(c.jobTitle !== undefined ? { jobTitle: c.jobTitle } : {}),
    ...(c.department !== undefined ? { department: c.department } : {}),
    ...(c.email !== undefined ? { email: c.email } : {}),
    ...(c.telephone !== undefined ? { telephone: c.telephone } : {}),
    ...(c.mobile !== undefined ? { mobile: c.mobile } : {}),
    ...(c.country !== undefined ? { country: c.country } : {}),
    ...(c.timezone !== undefined ? { timezone: c.timezone } : {}),
    ...(c.language !== undefined ? { language: c.language } : {}),
    status: c.status,
    dataQualityStatus: c.dataQualityStatus,
    classification: c.classification,
    ...(c.communicationPreferences !== undefined
      ? { communicationPreferences: c.communicationPreferences }
      : {}),
    ...(c.source !== undefined ? { source: c.source } : {}),
    ...(c.mergedIntoId !== undefined ? { mergedIntoId: c.mergedIntoId } : {}),
    ...(c.archivedAt !== undefined ? { archivedAt: c.archivedAt } : {}),
    version: c.version,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    createdByPrincipalId: c.createdByPrincipalId,
    updatedByPrincipalId: c.updatedByPrincipalId,
  };
}

function findContactForTenant(store: Store, tenantId: string, id: string): CrmContact | undefined {
  const contact = store.crmContacts.find((c) => c.id === id);
  if (!contact || contact.tenantId !== tenantId) return undefined;
  return contact;
}

function duplicateContactEmailExists(
  store: Store,
  tenantId: string,
  email: string,
  excludeId?: string,
): boolean {
  const normalized = normalizeEmail(email);
  return store.crmContacts.some(
    (c) =>
      c.tenantId === tenantId &&
      c.id !== excludeId &&
      !c.archivedAt &&
      !c.mergedIntoId &&
      c.email !== undefined &&
      normalizeEmail(c.email) === normalized,
  );
}

export function listContacts(
  store: Store,
  principal: Principal,
  query?: { status?: string; organizationId?: string; email?: string },
) {
  ensureCrmCollections(store);
  const decision = authorize({
    principal,
    permission: "crm:read:contact",
    action: "read:crm_contact",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.crmContacts.filter((c) => c.tenantId === principal.tenantId && !c.mergedIntoId);

  if (query?.status) {
    if (!isValidContactStatus(query.status)) {
      return { error: "invalid_request" as const, reason: "invalid_status" };
    }
    items = items.filter((c) => c.status === query.status);
  }

  if (query?.email) {
    const normalized = normalizeEmail(query.email);
    items = items.filter((c) => c.email !== undefined && normalizeEmail(c.email) === normalized);
  }

  if (query?.organizationId) {
    const linkedContactIds = new Set(
      store.crmRelationships
        .filter(
          (r) =>
            r.tenantId === principal.tenantId &&
            r.toOrganizationId === query.organizationId &&
            r.fromContactId !== undefined,
        )
        .map((r) => r.fromContactId as string),
    );
    items = items.filter((c) => linkedContactIds.has(c.id));
  }

  items.sort((a, b) => {
    const nameA = `${a.familyName} ${a.givenName}`;
    const nameB = `${b.familyName} ${b.givenName}`;
    return nameA.localeCompare(nameB);
  });
  return { items: items.map(sanitizeContact) };
}

export function getContact(store: Store, principal: Principal, contactId: string) {
  ensureCrmCollections(store);
  const contact = store.crmContacts.find((c) => c.id === contactId);
  if (!contact || contact.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:contact",
    action: "read:crm_contact",
    resource: contactResource(contact),
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { contact: sanitizeContact(contact) };
}

export type CreateContactInput = {
  givenName: string;
  familyName: string;
  preferredName?: string;
  jobTitle?: string;
  department?: string;
  email?: string;
  telephone?: string;
  mobile?: string;
  country?: string;
  timezone?: string;
  language?: string;
  classification?: Classification;
  communicationPreferences?: Record<string, unknown>;
  source?: string;
};

export function createContact(
  store: Store,
  principal: Principal,
  input: CreateContactInput,
  correlationId: string,
) {
  ensureCrmCollections(store);
  const decision = authorize({
    principal,
    permission: "crm:write:contact",
    action: "write:crm_contact",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_contact",
      id: "new",
      classification: input.classification ?? "Confidential",
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:contact", "crm_contact", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const givenName = normalizePersonName(input.givenName ?? "");
  const familyName = normalizePersonName(input.familyName ?? "");
  if (!givenName) return { error: "invalid_request" as const, reason: "given_name_required" };
  if (!familyName) return { error: "invalid_request" as const, reason: "family_name_required" };

  if (input.email !== undefined && input.email.trim() !== "") {
    if (!isPlausibleEmail(input.email)) {
      return { error: "invalid_request" as const, reason: "invalid_email" };
    }
    if (duplicateContactEmailExists(store, principal.tenantId, input.email)) {
      return { error: "conflict" as const, reason: "duplicate_contact_email" };
    }
  }

  if (input.telephone !== undefined && input.telephone.trim() !== "" && !isPlausiblePhone(input.telephone)) {
    return { error: "invalid_request" as const, reason: "invalid_telephone" };
  }
  if (input.mobile !== undefined && input.mobile.trim() !== "" && !isPlausiblePhone(input.mobile)) {
    return { error: "invalid_request" as const, reason: "invalid_mobile" };
  }

  const now = new Date().toISOString();
  const contact: CrmContact = {
    id: newId(),
    tenantId: principal.tenantId,
    givenName,
    familyName,
    ...(input.preferredName !== undefined ? { preferredName: normalizePersonName(input.preferredName) } : {}),
    ...(input.jobTitle !== undefined ? { jobTitle: input.jobTitle.trim() } : {}),
    ...(input.department !== undefined ? { department: input.department.trim() } : {}),
    ...(input.email !== undefined && input.email.trim() !== "" ? { email: normalizeEmail(input.email) } : {}),
    ...(input.telephone !== undefined ? { telephone: input.telephone.trim() } : {}),
    ...(input.mobile !== undefined ? { mobile: input.mobile.trim() } : {}),
    ...(input.country !== undefined ? { country: input.country } : {}),
    ...(input.timezone !== undefined ? { timezone: input.timezone } : {}),
    ...(input.language !== undefined ? { language: input.language } : {}),
    status: "Active",
    dataQualityStatus: "Unverified",
    classification: input.classification ?? "Confidential",
    ...(input.communicationPreferences !== undefined
      ? { communicationPreferences: input.communicationPreferences }
      : {}),
    ...(input.source !== undefined ? { source: input.source } : {}),
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.CONTACT_CREATED,
    entityType: "contact",
    entityId: contact.id,
    classification: contact.classification,
    correlationId,
    payload: {
      contactId: contact.id,
      displayName: `${contact.givenName} ${contact.familyName}`.trim(),
    },
    mutate: () => {
      store.crmContacts.push(contact);
      allowCrmAudit(store, principal, "crm:write:contact", "crm_contact", contact.id, correlationId, contact);
      registerDuplicateCandidatesForContact(store, principal.tenantId, contact.id, {
        principal,
        correlationId,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { contact: sanitizeContact(contact) };
}

export type UpdateContactInput = Partial<
  Omit<CreateContactInput, never>
> & {
  status?: CrmContactStatus;
};

export function updateContact(
  store: Store,
  principal: Principal,
  contactId: string,
  input: UpdateContactInput,
  correlationId: string,
  expectedVersion?: number,
) {
  ensureCrmCollections(store);
  const contact = findContactForTenant(store, principal.tenantId, contactId);
  if (!contact) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:contact",
    action: "write:crm_contact",
    resource: contactResource(contact),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:contact", "crm_contact", correlationId, decision.reason, contactId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (contact.archivedAt || contact.mergedIntoId) {
    return { error: "conflict" as const, reason: "contact_not_mutable" };
  }

  if (expectedVersion !== undefined && contact.version !== expectedVersion) {
    return { error: "conflict" as const, reason: "version_mismatch" };
  }

  const previousState = { ...contact };

  if (input.givenName !== undefined) {
    const givenName = normalizePersonName(input.givenName);
    if (!givenName) return { error: "invalid_request" as const, reason: "given_name_required" };
    contact.givenName = givenName;
  }
  if (input.familyName !== undefined) {
    const familyName = normalizePersonName(input.familyName);
    if (!familyName) return { error: "invalid_request" as const, reason: "family_name_required" };
    contact.familyName = familyName;
  }
  if (input.preferredName !== undefined) contact.preferredName = normalizePersonName(input.preferredName);
  if (input.jobTitle !== undefined) contact.jobTitle = input.jobTitle.trim();
  if (input.department !== undefined) contact.department = input.department.trim();

  if (input.email !== undefined) {
    if (input.email.trim() === "") {
      delete contact.email;
    } else {
      if (!isPlausibleEmail(input.email)) {
        return { error: "invalid_request" as const, reason: "invalid_email" };
      }
      if (duplicateContactEmailExists(store, principal.tenantId, input.email, contact.id)) {
        return { error: "conflict" as const, reason: "duplicate_contact_email" };
      }
      contact.email = normalizeEmail(input.email);
    }
  }

  if (input.telephone !== undefined) {
    if (input.telephone.trim() === "") delete contact.telephone;
    else {
      if (!isPlausiblePhone(input.telephone)) {
        return { error: "invalid_request" as const, reason: "invalid_telephone" };
      }
      contact.telephone = input.telephone.trim();
    }
  }
  if (input.mobile !== undefined) {
    if (input.mobile.trim() === "") delete contact.mobile;
    else {
      if (!isPlausiblePhone(input.mobile)) {
        return { error: "invalid_request" as const, reason: "invalid_mobile" };
      }
      contact.mobile = input.mobile.trim();
    }
  }

  if (input.country !== undefined) contact.country = input.country;
  if (input.timezone !== undefined) contact.timezone = input.timezone;
  if (input.language !== undefined) contact.language = input.language;
  if (input.classification !== undefined) contact.classification = input.classification;
  if (input.communicationPreferences !== undefined) {
    contact.communicationPreferences = input.communicationPreferences;
  }
  if (input.source !== undefined) contact.source = input.source;

  if (input.status !== undefined) {
    if (!isValidContactStatus(input.status) || input.status === "Archived") {
      return { error: "invalid_request" as const, reason: "invalid_status" };
    }
    if (!canTransitionContact(contact.status, input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    contact.status = input.status;
  }

  contact.version += 1;
  contact.updatedAt = new Date().toISOString();
  contact.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.CONTACT_UPDATED,
    entityType: "contact",
    entityId: contact.id,
    classification: contact.classification,
    correlationId,
    payload: { contactId: contact.id },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:contact",
        "crm_contact",
        contact.id,
        correlationId,
        contact,
        previousState,
      );
      registerDuplicateCandidatesForContact(store, principal.tenantId, contact.id, {
        principal,
        correlationId,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { contact: sanitizeContact(contact) };
}

export function archiveContact(store: Store, principal: Principal, contactId: string, correlationId: string) {
  ensureCrmCollections(store);
  const contact = findContactForTenant(store, principal.tenantId, contactId);
  if (!contact) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:contact",
    action: "archive:crm_contact",
    resource: contactResource(contact),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:contact", "crm_contact", correlationId, decision.reason, contactId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (contact.archivedAt || contact.mergedIntoId) {
    return { error: "conflict" as const, reason: "already_archived" };
  }
  if (!canArchiveContact(contact.status)) {
    return { error: "conflict" as const, reason: "invalid_archive_state" };
  }

  const previousState = { status: contact.status, archivedAt: contact.archivedAt };
  contact.status = "Archived";
  contact.archivedAt = new Date().toISOString();
  contact.version += 1;
  contact.updatedAt = contact.archivedAt;
  contact.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.CONTACT_ARCHIVED,
    entityType: "contact",
    entityId: contact.id,
    classification: contact.classification,
    correlationId,
    payload: { contactId: contact.id },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:contact",
        "crm_contact",
        contact.id,
        correlationId,
        { status: contact.status, archivedAt: contact.archivedAt },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { contact: sanitizeContact(contact) };
}
