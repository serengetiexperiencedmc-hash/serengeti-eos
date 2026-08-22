import type { DbPool } from "@sedmc/db";
import type { CrmActivity, CrmContact, CrmOrganization } from "@sedmc/kernel";
import { ensureCrmCollections, seedCrmCatalogues } from "../crm/collections.js";
import type { Store } from "../store.js";
import {
  loadCrmAccounts,
  loadCrmActivities,
  loadCrmContacts,
  loadCrmNotes,
  loadCrmOrganizations,
  upsertCrmAccount,
  upsertCrmActivity,
  upsertCrmContact,
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
    }
  } catch {
    // Fire-and-forget dual-write; log hook can be added later.
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
}> {
  ensureCrmCollections(store);
  for (const tenant of store.tenants.values()) {
    seedCrmCatalogues(store, tenant.id);
    await syncCatalogues(pool, store, tenant.id);
  }

  const [organizations, contacts, activities, accounts, notes] = await Promise.all([
    loadCrmOrganizations(pool),
    loadCrmContacts(pool),
    loadCrmActivities(pool),
    loadCrmAccounts(pool),
    loadCrmNotes(pool),
  ]);

  return {
    organizations: mergeById(store.crmOrganizations, organizations),
    contacts: mergeById(store.crmContacts, contacts),
    activities: mergeById(store.crmActivities, activities),
    accounts: mergeById(store.crmAccounts, accounts),
    notes: mergeById(store.crmNotes, notes),
  };
}
