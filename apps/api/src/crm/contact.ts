import { authorize, type Classification, type CrmContact, type CrmContactStatus, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { personDomainRemoved } from "../personal-data-phase1.js";

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

export function listContacts(
  store: Store,
  principal: Principal,
  query?: { status?: string; organizationId?: string; email?: string },
) {
  ensureCrmCollections(store);
  void query;
  const decision = authorize({
    principal,
    permission: "crm:read:contact",
    action: "read:crm_contact",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return personDomainRemoved();
}

export function getContact(store: Store, principal: Principal, contactId: string) {
  ensureCrmCollections(store);
  void contactId;
  const decision = authorize({
    principal,
    permission: "crm:read:contact",
    action: "read:crm_contact",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return personDomainRemoved();
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

export async function createContact(
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
  return personDomainRemoved();
}

export type UpdateContactInput = Partial<Omit<CreateContactInput, never>> & {
  status?: CrmContactStatus;
};

export async function updateContact(
  store: Store,
  principal: Principal,
  contactId: string,
  input: UpdateContactInput,
  correlationId: string,
  expectedVersion?: number,
) {
  ensureCrmCollections(store);
  void contactId;
  void input;
  void expectedVersion;
  const decision = authorize({
    principal,
    permission: "crm:write:contact",
    action: "write:crm_contact",
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:contact", "crm_contact", correlationId, decision.reason, contactId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return personDomainRemoved();
}

export async function archiveContact(store: Store, principal: Principal, contactId: string, correlationId: string) {
  ensureCrmCollections(store);
  const decision = authorize({
    principal,
    permission: "crm:write:contact",
    action: "archive:crm_contact",
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:contact", "crm_contact", correlationId, decision.reason, contactId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return personDomainRemoved();
}
