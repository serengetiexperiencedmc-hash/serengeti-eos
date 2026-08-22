import { authorize, type Principal } from "@sedmc/kernel";
import { ensureCrmCollections, seedCrmCatalogues, type CrmStoreSlice } from "./collections.js";
import type { Store } from "../store.js";

export function getCrmModuleHealth(store: Store) {
  ensureCrmCollections(store);
  return {
    module: "crm",
    increment: "C1.11",
    environment: "Development/Test",
    productionReady: false as const,
    entities: {
      organizationTypes: store.crmOrganizationTypes.length,
      relationshipTypes: store.crmRelationshipTypes.length,
      activityTypes: store.crmActivityTypes.length,
      organizations: store.crmOrganizations.length,
      organizationUnits: store.crmOrganizationUnits.length,
      contacts: store.crmContacts.length,
      relationships: store.crmRelationships.length,
      accounts: store.crmAccounts.length,
      activities: store.crmActivities.length,
      notes: store.crmNotes.length,
      tasks: store.crmTasks.length,
      tags: store.crmTags.length,
      duplicateCandidates: store.crmDuplicateCandidates.length,
      mergeRecords: store.crmMergeRecords.length,
    },
    note: "CRM bounded context — customer/partner orgs distinct from I1 internal org shell",
  };
}

export function listOrganizationTypes(store: Store, principal: Principal) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);
  const decision = authorize({
    principal,
    permission: "crm:read:organization",
    action: "read:crm_organization_type",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return {
    items: store.crmOrganizationTypes.filter((t) => t.tenantId === principal.tenantId && t.active),
  };
}

export function listRelationshipTypes(store: Store, principal: Principal) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);
  const decision = authorize({
    principal,
    permission: "crm:read:relationship",
    action: "read:crm_relationship_type",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return {
    items: store.crmRelationshipTypes.filter((t) => t.tenantId === principal.tenantId && t.active),
  };
}

export function listActivityTypes(store: Store, principal: Principal) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);
  const decision = authorize({
    principal,
    permission: "crm:read:activity",
    action: "read:crm_activity_type",
  });
  if (decision.result === "deny") {
    return { error: "forbidden" as const, reason: decision.reason };
  }
  return {
    items: store.crmActivityTypes.filter((t) => t.tenantId === principal.tenantId && t.active),
  };
}

export type { CrmStoreSlice };
