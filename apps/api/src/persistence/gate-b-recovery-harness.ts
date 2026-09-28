import type { DbPool } from "@sedmc/db";
import { seedStore, type Store } from "../store.js";

/**
 * GB-14 Dev/Test recovery harness.
 * Does not perform Production backup, restore, PITR, or claim RTO/RPO evidence.
 * Does not import or call migrate(). Schema remains an external prerequisite.
 */
export function attachDurablePool(store: Store, pool: DbPool): void {
  store.dbPool = pool;
}

/** Simulate a new API process attached to the same Dev/Test database. */
export function newProcessAgainstPool(pool: DbPool, tokenSecret: string): Store {
  const store = seedStore(tokenSecret);
  store.dbPool = pool;
  return store;
}
