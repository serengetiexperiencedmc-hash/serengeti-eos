import type { DbPool } from "@sedmc/db";
import { allPrincipals, type Store } from "../store.js";
import {
  insertAuditEvent,
  insertConfigVersion,
  insertSession,
  revokeSessionDb,
  upsertCostCenter,
  upsertLocation,
  upsertOrganisation,
  upsertOrgUnit,
  upsertPrincipal,
  upsertTenant,
} from "./pg-repository.js";

/** Persist an in-memory store snapshot to PostgreSQL (Development/Test). */
export async function syncStoreToPostgres(pool: DbPool, store: Store): Promise<void> {
  for (const tenant of store.tenants.values()) {
    await upsertTenant(pool, {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      kind: tenant.slug === "partner-demo" ? "partner" : "internal",
    });
  }
  for (const org of store.organisations.values()) {
    await upsertOrganisation(pool, org);
  }
  for (const loc of store.locations) {
    await upsertLocation(pool, loc);
  }
  for (const cc of store.costCenters) {
    await upsertCostCenter(pool, cc);
  }
  for (const unit of store.orgUnits) {
    await upsertOrgUnit(pool, unit);
  }
  for (const principal of allPrincipals(store)) {
    await upsertPrincipal(pool, principal);
  }
  for (const session of store.sessions) {
    await insertSession(pool, session);
  }
  for (const event of store.audit) {
    await insertAuditEvent(pool, event);
  }
  for (const version of store.configVersions) {
    await insertConfigVersion(pool, version);
  }
}

export async function persistSessionRevocation(
  pool: DbPool | undefined,
  sessionId: string,
  tenantId: string,
): Promise<void> {
  if (!pool) return;
  await revokeSessionDb(pool, sessionId, tenantId);
}
