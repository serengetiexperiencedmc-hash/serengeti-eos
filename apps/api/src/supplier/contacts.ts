import {
  authorize,
  newId,
  SUPPLIER_CONTACT_ROLES,
  SUPPLIER_EVENT_TYPES,
  type Principal,
  type SupContact,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowSupplierAudit, denySupplierAudit } from "./audit.js";
import { ensureSupplierCollections } from "./collections.js";
import { persistSupEntityAfterCommit } from "../persistence/supplier.js";

function sanitizeContact(c: SupContact) {
  return {
    id: c.id,
    supplierId: c.supplierId,
    contactRole: c.contactRole,
    givenName: c.givenName,
    familyName: c.familyName,
    email: c.email,
    telephone: c.telephone,
    whatsapp: c.whatsapp,
    isPrimary: c.isPrimary,
    notes: c.notes,
    version: c.version,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

function findSupplier(store: Store, tenantId: string, supplierId: string) {
  return store.supSuppliers.find((s) => s.id === supplierId && s.tenantId === tenantId && !s.archivedAt);
}

function authorizeWrite(store: Store, principal: Principal, supplierId: string, correlationId: string, action: string) {
  const supplier = findSupplier(store, principal.tenantId, supplierId);
  if (!supplier) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "supplier:write:supplier",
    action,
    resource: {
      tenantId: supplier.tenantId,
      type: "supplier",
      id: supplier.id,
      classification: supplier.classification,
    },
  });
  if (decision.result === "deny") {
    denySupplierAudit(store, principal, "supplier:write:supplier", "sup_contact", correlationId, decision.reason, supplierId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return { supplier };
}

export type CreateContactInput = {
  contactRole: string;
  givenName: string;
  familyName: string;
  email?: string;
  telephone?: string;
  whatsapp?: string;
  isPrimary?: boolean;
  notes?: string;
};

export type UpdateContactInput = {
  contactRole?: string;
  givenName?: string;
  familyName?: string;
  email?: string | null;
  telephone?: string | null;
  whatsapp?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
};

export function createSupplierContact(
  store: Store,
  principal: Principal,
  supplierId: string,
  input: CreateContactInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_contact");
  if ("error" in auth) return auth;

  if (!(SUPPLIER_CONTACT_ROLES as readonly string[]).includes(input.contactRole)) {
    return { error: "invalid_request" as const, reason: "invalid_contact_role" };
  }
  if (!input.givenName?.trim() || !input.familyName?.trim()) {
    return { error: "invalid_request" as const, reason: "name_required" };
  }

  const now = new Date().toISOString();
  const contact: SupContact = {
    id: newId(),
    tenantId: principal.tenantId,
    supplierId,
    contactRole: input.contactRole,
    givenName: input.givenName.trim(),
    familyName: input.familyName.trim(),
    ...(input.email?.trim() ? { email: input.email.trim() } : {}),
    ...(input.telephone?.trim() ? { telephone: input.telephone.trim() } : {}),
    ...(input.whatsapp?.trim() ? { whatsapp: input.whatsapp.trim() } : {}),
    isPrimary: input.isPrimary ?? false,
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  if (contact.isPrimary) {
    for (const c of store.supContacts) {
      if (c.supplierId === supplierId && !c.archivedAt && c.isPrimary) c.isPrimary = false;
    }
  }

  store.supContacts.push(contact);
  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_contact", contact.id, correlationId, {
    supplierId,
    eventType: SUPPLIER_EVENT_TYPES.CONTACT_CREATED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_contact", contact.id);
  return { contact: sanitizeContact(contact) };
}

export function updateSupplierContact(
  store: Store,
  principal: Principal,
  supplierId: string,
  contactId: string,
  input: UpdateContactInput,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_contact");
  if ("error" in auth) return auth;

  const contact = store.supContacts.find(
    (c) => c.id === contactId && c.supplierId === supplierId && c.tenantId === principal.tenantId && !c.archivedAt,
  );
  if (!contact) return { error: "not_found" as const };

  if (input.contactRole !== undefined) {
    if (!(SUPPLIER_CONTACT_ROLES as readonly string[]).includes(input.contactRole)) {
      return { error: "invalid_request" as const, reason: "invalid_contact_role" };
    }
    contact.contactRole = input.contactRole;
  }
  if (input.givenName !== undefined) {
    if (!input.givenName.trim()) return { error: "invalid_request" as const, reason: "name_required" };
    contact.givenName = input.givenName.trim();
  }
  if (input.familyName !== undefined) {
    if (!input.familyName.trim()) return { error: "invalid_request" as const, reason: "name_required" };
    contact.familyName = input.familyName.trim();
  }
  if (input.email !== undefined) {
    if (input.email === null || input.email.trim() === "") delete contact.email;
    else contact.email = input.email.trim();
  }
  if (input.telephone !== undefined) {
    if (input.telephone === null || input.telephone.trim() === "") delete contact.telephone;
    else contact.telephone = input.telephone.trim();
  }
  if (input.whatsapp !== undefined) {
    if (input.whatsapp === null || input.whatsapp.trim() === "") delete contact.whatsapp;
    else contact.whatsapp = input.whatsapp.trim();
  }
  if (input.notes !== undefined) {
    if (input.notes === null || input.notes.trim() === "") delete contact.notes;
    else contact.notes = input.notes.trim();
  }
  if (input.isPrimary !== undefined) {
    contact.isPrimary = input.isPrimary;
    if (contact.isPrimary) {
      for (const c of store.supContacts) {
        if (c.id !== contact.id && c.supplierId === supplierId && !c.archivedAt) c.isPrimary = false;
      }
    }
  }

  contact.version += 1;
  contact.updatedAt = new Date().toISOString();
  contact.updatedByPrincipalId = principal.id;

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_contact", contact.id, correlationId, {
    supplierId,
    version: contact.version,
    eventType: SUPPLIER_EVENT_TYPES.CONTACT_UPDATED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_contact", contact.id);
  return { contact: sanitizeContact(contact) };
}

export function archiveSupplierContact(
  store: Store,
  principal: Principal,
  supplierId: string,
  contactId: string,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "archive:sup_contact");
  if ("error" in auth) return auth;

  const contact = store.supContacts.find(
    (c) => c.id === contactId && c.supplierId === supplierId && c.tenantId === principal.tenantId && !c.archivedAt,
  );
  if (!contact) return { error: "not_found" as const };

  contact.archivedAt = new Date().toISOString();
  contact.version += 1;
  contact.updatedAt = contact.archivedAt;
  contact.updatedByPrincipalId = principal.id;

  allowSupplierAudit(store, principal, "supplier:write:supplier", "sup_contact", contact.id, correlationId, {
    supplierId,
    eventType: SUPPLIER_EVENT_TYPES.CONTACT_ARCHIVED,
  });
  void persistSupEntityAfterCommit(store.dbPool, store, "supplier_contact", contact.id);
  return { contact: sanitizeContact(contact) };
}
