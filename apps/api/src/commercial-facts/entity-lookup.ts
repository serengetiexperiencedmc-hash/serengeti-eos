import type { OppOpportunity, PrgProgramme, RfpRecord, SupRate, SupSupplier } from "@sedmc/kernel";
import { isMixedSqlDurable } from "../persistence/durable.js";
import { getOpportunityById } from "../persistence/opportunity-repository.js";
import { getProgrammeById } from "../persistence/programme-repository.js";
import { getRfpById } from "../persistence/rfp-repository.js";
import { getSupRateById, getSupSupplierById } from "../persistence/pg-repository.js";
import type { Store } from "../store.js";

/**
 * Mixed SQL SoR entities are not copied into process-local Store on create.
 * Commercial-facts must look up the same durable loaders as C2/C3/C5.
 * Bounded sidecar-only continues to use process-local collections.
 */
export async function lookupOpportunity(
  store: Store,
  tenantId: string,
  id: string,
): Promise<OppOpportunity | undefined> {
  if (isMixedSqlDurable(store)) {
    const durable = await getOpportunityById(store.dbPool, tenantId, id);
    if (durable) return durable;
  }
  return store.oppOpportunities.find((row) => row.id === id && row.tenantId === tenantId && !row.archivedAt);
}

export async function lookupRfp(store: Store, tenantId: string, id: string): Promise<RfpRecord | undefined> {
  if (isMixedSqlDurable(store)) {
    const durable = await getRfpById(store.dbPool, tenantId, id);
    if (durable) return durable;
  }
  return store.rfpRfps.find((row) => row.id === id && row.tenantId === tenantId && !row.archivedAt);
}

export async function lookupProgramme(
  store: Store,
  tenantId: string,
  id: string,
): Promise<PrgProgramme | undefined> {
  if (isMixedSqlDurable(store)) {
    const durable = await getProgrammeById(store.dbPool, tenantId, id);
    if (durable) return durable;
  }
  return store.prgProgrammes?.find((row) => row.id === id && row.tenantId === tenantId && !row.archivedAt);
}

/**
 * Mixed C4 parent row lookup for F2 overlay attachment.
 * Does not promote mixed amount, unit type, or preferredInConflict to OR-08 identity.
 */
export async function lookupSupplier(
  store: Store,
  tenantId: string,
  id: string,
): Promise<SupSupplier | undefined> {
  if (isMixedSqlDurable(store)) {
    const durable = await getSupSupplierById(store.dbPool, tenantId, id);
    if (durable) return durable;
  }
  return store.supSuppliers.find((row) => row.id === id && row.tenantId === tenantId && !row.archivedAt);
}

export async function lookupRate(
  store: Store,
  tenantId: string,
  supplierId: string,
  rateId: string,
): Promise<SupRate | undefined> {
  if (isMixedSqlDurable(store)) {
    const durable = await getSupRateById(store.dbPool, tenantId, supplierId, rateId);
    if (durable) return durable;
  }
  return store.supRates.find(
    (row) =>
      row.id === rateId && row.supplierId === supplierId && row.tenantId === tenantId && !row.archivedAt,
  );
}
