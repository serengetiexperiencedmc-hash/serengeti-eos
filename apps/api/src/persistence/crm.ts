import type { DbPool } from "@sedmc/db";

import { ensureCrmCollections, seedCrmCatalogues } from "../crm/collections.js";

import type { Store } from "../store.js";

import {

  deleteCrmEntityTag,

  deleteCrmExternalIdentifier,

  loadCrmAccounts,

  loadCrmActivities,

  loadCrmContacts,

  loadCrmDuplicateCandidates,

  loadCrmEntityTags,

  loadCrmExternalIdentifiers,

  loadCrmImportBatches,

  loadCrmMergeRecords,

  loadCrmNotes,

  loadCrmOrganizations,

  loadCrmRelationships,

  loadCrmTags,

  loadCrmTasks,

  upsertCrmAccount,

  upsertCrmActivity,

  upsertCrmContact,

  upsertCrmDuplicateCandidate,

  upsertCrmEntityTag,

  upsertCrmExternalIdentifier,

  upsertCrmImportBatch,

  upsertCrmMergeRecord,

  upsertCrmNote,

  upsertCrmOrganization,

  upsertCrmOrganizationType,

  upsertCrmRelationship,

  upsertCrmRelationshipType,

  upsertCrmTag,

  upsertCrmTask,

} from "./pg-repository.js";



async function syncCatalogues(pool: DbPool, store: Store, tenantId: string): Promise<void> {

  seedCrmCatalogues(store, tenantId);

  for (const t of store.crmOrganizationTypes.filter((x) => x.tenantId === tenantId)) {

    await upsertCrmOrganizationType(pool, t);

  }

  for (const t of store.crmRelationshipTypes.filter((x) => x.tenantId === tenantId)) {

    await upsertCrmRelationshipType(pool, t);

  }

}



export async function persistCrmEntityAfterCommit(

  pool: DbPool | undefined,

  store: Store,

  entityType: string,

  entityId: string,

  tenantId: string,

): Promise<void> {

  if (!pool) return;

  try {

    if (entityType === "organization") {

      await syncCatalogues(pool, store, tenantId);

      const org = store.crmOrganizations.find((o) => o.id === entityId);

      if (org) await upsertCrmOrganization(pool, org);

      return;

    }

    if (entityType === "contact") {

      const contact = store.crmContacts.find((c) => c.id === entityId);

      if (contact) await upsertCrmContact(pool, contact);

      return;

    }

    if (entityType === "activity") {

      const activity = store.crmActivities.find((a) => a.id === entityId);

      if (activity) await upsertCrmActivity(pool, activity);

      return;

    }

    if (entityType === "account") {

      const account = store.crmAccounts.find((a) => a.id === entityId);

      if (account) await upsertCrmAccount(pool, account);

      return;

    }

    if (entityType === "note") {

      const note = store.crmNotes.find((n) => n.id === entityId);

      if (note) await upsertCrmNote(pool, note);

      return;

    }

    if (entityType === "relationship") {

      await syncCatalogues(pool, store, tenantId);

      const rel = store.crmRelationships.find((r) => r.id === entityId);

      if (rel) await upsertCrmRelationship(pool, rel);

      return;

    }

    if (entityType === "task") {

      const task = store.crmTasks.find((t) => t.id === entityId);

      if (task) await upsertCrmTask(pool, task);

      return;

    }

    if (entityType === "tag") {

      const tag = store.crmTags.find((t) => t.id === entityId);

      if (tag) await upsertCrmTag(pool, tag);

      return;

    }

    if (entityType === "entity_tag") {

      const assignment = store.crmEntityTags.find((a) => a.id === entityId);

      if (assignment) await upsertCrmEntityTag(pool, assignment);

      else await deleteCrmEntityTag(pool, entityId);

      return;

    }

    if (entityType === "external_identifier") {

      const ext = store.crmExternalIdentifiers.find((e) => e.id === entityId);

      if (ext) await upsertCrmExternalIdentifier(pool, ext);

      else await deleteCrmExternalIdentifier(pool, entityId);

      return;

    }

    if (entityType === "duplicate_candidate") {

      const candidate = store.crmDuplicateCandidates.find((c) => c.id === entityId);

      if (candidate) await upsertCrmDuplicateCandidate(pool, candidate);

      return;

    }

    if (entityType === "import") {

      const batch = store.crmImportBatches.find((b) => b.id === entityId);

      if (batch) await upsertCrmImportBatch(pool, batch);

      return;

    }

    if (entityType === "merge_record") {

      await persistCrmMergeAfterCommit(pool, store, entityId);

    }

  } catch {

    // Fire-and-forget dual-write; log hook can be added later.

  }

}



export async function persistCrmMergeAfterCommit(

  pool: DbPool,

  store: Store,

  mergeRecordId: string,

): Promise<void> {

  const record = store.crmMergeRecords.find((m) => m.id === mergeRecordId);

  if (!record) return;



  await upsertCrmMergeRecord(pool, record);

  const entityIds = [record.survivorId, ...record.mergedIds];



  if (record.entityType === "organization") {

    await syncCatalogues(pool, store, record.tenantId);

    for (const id of entityIds) {

      const org = store.crmOrganizations.find((o) => o.id === id);

      if (org) await upsertCrmOrganization(pool, org);

    }

    for (const account of store.crmAccounts.filter(

      (a) => a.tenantId === record.tenantId && a.organizationId === record.survivorId,

    )) {

      await upsertCrmAccount(pool, account);

    }

    for (const activity of store.crmActivities.filter(

      (a) => a.tenantId === record.tenantId && a.organizationId === record.survivorId,

    )) {

      await upsertCrmActivity(pool, activity);

    }

    for (const note of store.crmNotes.filter(

      (n) =>

        n.tenantId === record.tenantId &&

        n.entityType === "organization" &&

        n.entityId === record.survivorId,

    )) {

      await upsertCrmNote(pool, note);

    }

    return;

  }



  for (const id of entityIds) {

    const contact = store.crmContacts.find((c) => c.id === id);

    if (contact) await upsertCrmContact(pool, contact);

  }

  for (const activity of store.crmActivities.filter(

    (a) => a.tenantId === record.tenantId && a.contactId === record.survivorId,

  )) {

    await upsertCrmActivity(pool, activity);

  }

  for (const note of store.crmNotes.filter(

    (n) => n.tenantId === record.tenantId && n.entityType === "contact" && n.entityId === record.survivorId,

  )) {

    await upsertCrmNote(pool, note);

  }

}



function mergeById<T extends { id: string }>(target: T[], incoming: T[]): number {

  let merged = 0;

  for (const row of incoming) {

    if (target.some((x) => x.id === row.id)) continue;

    target.push(row);

    merged += 1;

  }

  return merged;

}



export async function hydrateCrmFromPostgres(pool: DbPool, store: Store): Promise<{

  organizations: number;

  contacts: number;

  activities: number;

  accounts: number;

  notes: number;

  mergeRecords: number;

  relationships: number;

  tasks: number;

  tags: number;

  entityTags: number;

  externalIdentifiers: number;

  duplicateCandidates: number;

  importBatches: number;

}> {

  ensureCrmCollections(store);

  for (const tenant of store.tenants.values()) {

    seedCrmCatalogues(store, tenant.id);

    await syncCatalogues(pool, store, tenant.id);

  }



  const [

    organizations,

    contacts,

    activities,

    accounts,

    notes,

    mergeRecords,

    relationships,

    tasks,

    tags,

    entityTags,

    externalIdentifiers,

    duplicateCandidates,

    importBatches,

  ] = await Promise.all([

    loadCrmOrganizations(pool),

    loadCrmContacts(pool),

    loadCrmActivities(pool),

    loadCrmAccounts(pool),

    loadCrmNotes(pool),

    loadCrmMergeRecords(pool),

    loadCrmRelationships(pool),

    loadCrmTasks(pool),

    loadCrmTags(pool),

    loadCrmEntityTags(pool),

    loadCrmExternalIdentifiers(pool),

    loadCrmDuplicateCandidates(pool),

    loadCrmImportBatches(pool),

  ]);



  return {

    organizations: mergeById(store.crmOrganizations, organizations),

    contacts: mergeById(store.crmContacts, contacts),

    activities: mergeById(store.crmActivities, activities),

    accounts: mergeById(store.crmAccounts, accounts),

    notes: mergeById(store.crmNotes, notes),

    mergeRecords: mergeById(store.crmMergeRecords, mergeRecords),

    relationships: mergeById(store.crmRelationships, relationships),

    tasks: mergeById(store.crmTasks, tasks),

    tags: mergeById(store.crmTags, tags),

    entityTags: mergeById(store.crmEntityTags, entityTags),

    externalIdentifiers: mergeById(store.crmExternalIdentifiers, externalIdentifiers),

    duplicateCandidates: mergeById(store.crmDuplicateCandidates, duplicateCandidates),

    importBatches: mergeById(store.crmImportBatches, importBatches),

  };

}


