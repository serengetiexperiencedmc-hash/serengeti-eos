import {
  DEFAULT_CRM_ACTIVITY_TYPE_KEYS,
  DEFAULT_CRM_ORGANIZATION_TYPE_KEYS,
  DEFAULT_CRM_RELATIONSHIP_TYPE_KEYS,
  newId,
  type CrmAccount,
  type CrmActivity,
  type CrmActivityType,
  type CrmContact,
  type CrmDuplicateCandidate,
  type CrmEntityTag,
  type CrmExternalIdentifier,
  type CrmImportBatch,
  type CrmMergeRecord,
  type CrmNote,
  type CrmOrganization,
  type CrmOrganizationType,
  type CrmOrganizationUnit,
  type CrmRelationship,
  type CrmRelationshipType,
  type CrmTag,
  type CrmTask,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureCrmEventCatalogue } from "./events.js";

export function ensureCrmCollections(store: Store): void {
  if (!store.crmOrganizationTypes) store.crmOrganizationTypes = [];
  if (!store.crmRelationshipTypes) store.crmRelationshipTypes = [];
  if (!store.crmActivityTypes) store.crmActivityTypes = [];
  if (!store.crmOrganizations) store.crmOrganizations = [];
  if (!store.crmOrganizationUnits) store.crmOrganizationUnits = [];
  if (!store.crmContacts) store.crmContacts = [];
  if (!store.crmRelationships) store.crmRelationships = [];
  if (!store.crmAccounts) store.crmAccounts = [];
  if (!store.crmActivities) store.crmActivities = [];
  if (!store.crmNotes) store.crmNotes = [];
  if (!store.crmTasks) store.crmTasks = [];
  if (!store.crmTags) store.crmTags = [];
  if (!store.crmEntityTags) store.crmEntityTags = [];
  if (!store.crmExternalIdentifiers) store.crmExternalIdentifiers = [];
  if (!store.crmDuplicateCandidates) store.crmDuplicateCandidates = [];
  if (!store.crmMergeRecords) store.crmMergeRecords = [];
  if (!store.crmImportBatches) store.crmImportBatches = [];
  ensureCrmEventCatalogue(store);
}

export function seedCrmCatalogues(store: Store, tenantId: string): void {
  ensureCrmCollections(store);
  if (store.crmOrganizationTypes.some((t) => t.tenantId === tenantId)) return;

  for (const key of DEFAULT_CRM_ORGANIZATION_TYPE_KEYS) {
    const label = key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    store.crmOrganizationTypes.push({
      id: newId(),
      tenantId,
      key,
      label,
      active: true,
    });
  }

  for (const key of DEFAULT_CRM_RELATIONSHIP_TYPE_KEYS) {
    const label = key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    store.crmRelationshipTypes.push({
      id: newId(),
      tenantId,
      key,
      label,
      active: true,
    });
  }

  for (const key of DEFAULT_CRM_ACTIVITY_TYPE_KEYS) {
    const label = key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    store.crmActivityTypes.push({
      id: newId(),
      tenantId,
      key,
      label,
      active: true,
    });
  }
}

export type CrmStoreSlice = {
  crmOrganizationTypes: CrmOrganizationType[];
  crmRelationshipTypes: CrmRelationshipType[];
  crmActivityTypes: CrmActivityType[];
  crmOrganizations: CrmOrganization[];
  crmOrganizationUnits: CrmOrganizationUnit[];
  crmContacts: CrmContact[];
  crmRelationships: CrmRelationship[];
  crmAccounts: CrmAccount[];
  crmActivities: CrmActivity[];
  crmNotes: CrmNote[];
  crmTasks: CrmTask[];
  crmTags: CrmTag[];
  crmEntityTags: CrmEntityTag[];
  crmExternalIdentifiers: CrmExternalIdentifier[];
  crmDuplicateCandidates: CrmDuplicateCandidate[];
  crmMergeRecords: CrmMergeRecord[];
  crmImportBatches: CrmImportBatch[];
};
