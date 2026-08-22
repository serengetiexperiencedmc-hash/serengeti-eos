import type { DbPool } from "@sedmc/db";
import type { CrmActivity, CrmContact, CrmOrganization } from "@sedmc/kernel";
import { ensureCrmCollections, seedCrmCatalogues } from "../crm/collections.js";
import type { Store } from "../store.js";
import {
  loadCrmAccounts,
  loadCrmActivities,
  loadCrmContacts,
  loadCrmMergeRecords,
  loadCrmNotes,
  loadCrmOrganizations,
  upsertCrmAccount,
  upsertCrmActivity,
  upsertCrmContact,
  upsertCrmMergeRecord,
  upsertCrmNote,
  upsertCrmOrganization,
  upsertCrmOrganizationType,
} from "./pg-repository.js";
async function syncCatalogues(pool: DbPool, store: Store, tenantId: string): Promise<void> {
  seedCrmCatalogues(store, tenantId);
  for (const t of store.crmOrganizationTypes.filter((x) => x.tenantId === tenantId)) {
    await upsertCrmOrganizationType(pool, t);
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
}> {
  ensureCrmCollections(store);
  for (const tenant of store.tenants.values()) {
    seedCrmCatalogues(store, tenant.id);
    await syncCatalogues(pool, store, tenant.id);
  }

  const [organizations, contacts, activities, accounts, notes, mergeRecords] = await Promise.all([
    loadCrmOrganizations(pool),
    loadCrmContacts(pool),
    loadCrmActivities(pool),
    loadCrmAccounts(pool),
    loadCrmNotes(pool),
    loadCrmMergeRecords(pool),
  ]);

  return {
    organizations: mergeById(store.crmOrganizations, organizations),
    contacts: mergeById(store.crmContacts, contacts),
    activities: mergeById(store.crmActivities, activities),
    accounts: mergeById(store.crmAccounts, accounts),
    notes: mergeById(store.crmNotes, notes),
    mergeRecords: mergeById(store.crmMergeRecords, mergeRecords),
  };
}
