import { authorize, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { denySupplierAudit } from "./audit.js";
import { ensureSupplierCollections } from "./collections.js";
import { personDomainRemoved } from "../personal-data-phase1.js";

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
  void input;
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_contact");
  if ("error" in auth) return auth;
  return personDomainRemoved();
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
  void contactId;
  void input;
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "write:sup_contact");
  if ("error" in auth) return auth;
  return personDomainRemoved();
}

export function archiveSupplierContact(
  store: Store,
  principal: Principal,
  supplierId: string,
  contactId: string,
  correlationId: string,
) {
  ensureSupplierCollections(store);
  void contactId;
  const auth = authorizeWrite(store, principal, supplierId, correlationId, "archive:sup_contact");
  if ("error" in auth) return auth;
  return personDomainRemoved();
}
