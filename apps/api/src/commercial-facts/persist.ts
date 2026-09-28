import type { DbPool } from "@sedmc/db";
import { isProductionLikeEnv } from "../devtest-token-secret.js";
import { databaseNameFromUrl, isGovernedGateBDatabaseName } from "../persistence/disposable-pg-recovery.js";
import { isDurableSoR, isMixedSqlDurable, runDurableTx } from "../persistence/durable.js";
import {
  listAllF2AccountFacts,
  listAllF2OpportunityFacts,
  listAllF2PathB,
  listAllF2ProgrammeFacts,
  listAllF2RateIdentities,
  listAllF2RfpFacts,
  selectF2AccountFacts,
  selectF2OpportunityFacts,
  selectF2PathB,
  selectF2ProgrammeFacts,
  selectF2RateIdentities,
  selectF2RfpFacts,
  upsertF2AccountFacts,
  upsertF2OpportunityFacts,
  upsertF2PathB,
  upsertF2ProgrammeFacts,
  upsertF2RateIdentity,
  upsertF2RfpFacts,
} from "../persistence/f2-commercial-facts-repository.js";
import type { Store } from "../store.js";
import {
  f2FactsMemory,
  type F2AccountFacts,
  type F2OpportunityFacts,
  type F2PathBApproval,
  type F2ProgrammeFacts,
  type F2RateIdentity,
  type F2RfpFacts,
} from "./memory.js";

export type F2Dp01PersistDecision =
  | { persist: true }
  | {
      persist: false;
      reason: "not_durable" | "production_not_authorized" | "eos_gateb_not_authorized";
    };

function connectionStringOf(store: Store, env: NodeJS.Dict<string> | NodeJS.ProcessEnv): string | undefined {
  const fromPool = store.dbPool && "options" in store.dbPool ? store.dbPool.options?.connectionString : undefined;
  if (typeof fromPool === "string" && fromPool.length > 0) return fromPool;
  const fromEnv = env.EOS_DATABASE_URL;
  return typeof fromEnv === "string" && fromEnv.length > 0 ? fromEnv : undefined;
}

/** F2-DP-01 persist is Dev/Test coexistence only. Production and eos_gateb remain unauthorized. */
export function f2Dp01PersistDecision(
  store: Store,
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): F2Dp01PersistDecision {
  if (!isDurableSoR(store)) return { persist: false, reason: "not_durable" };
  if (isProductionLikeEnv(env)) return { persist: false, reason: "production_not_authorized" };
  const url = connectionStringOf(store, env);
  const name = url ? databaseNameFromUrl(url) : undefined;
  if (name && isGovernedGateBDatabaseName(name)) {
    return { persist: false, reason: "eos_gateb_not_authorized" };
  }
  return { persist: true };
}

export function isF2Dp01PersistEnabled(
  store: Store,
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): boolean {
  return f2Dp01PersistDecision(store, env).persist;
}

export type F2FactsPersistence = {
  recorded: boolean;
  mode: "f2_dp01_sidecar" | "in_memory_preview";
  mixedSqlDurable: boolean;
};

/** Observability only — not a commercial rule. Distinguishes sidecar persist from mixed SQL and unrecorded defaults. */
export function f2FactsPersistenceMeta(store: Store, recorded: boolean): F2FactsPersistence {
  return {
    recorded,
    mode: isF2Dp01PersistEnabled(store) ? "f2_dp01_sidecar" : "in_memory_preview",
    mixedSqlDurable: isMixedSqlDurable(store),
  };
}

export function f2Dp01DurablePreviewBlock(
  store: Store,
  reason: string,
): { error: "conflict"; reason: string } | undefined {
  if (isDurableSoR(store) && !isF2Dp01PersistEnabled(store)) {
    return { error: "conflict", reason };
  }
  return undefined;
}

export async function readOpportunityFacts(
  store: Store,
  tenantId: string,
  opportunityId: string,
): Promise<F2OpportunityFacts | undefined> {
  const cached = f2FactsMemory(store).opportunities.get(opportunityId);
  if (cached) return cached;
  if (!isF2Dp01PersistEnabled(store) || !store.dbPool) return undefined;
  const loaded = await selectF2OpportunityFacts(store.dbPool, tenantId, opportunityId);
  if (loaded) f2FactsMemory(store).opportunities.set(opportunityId, loaded);
  return loaded;
}

export async function writeOpportunityFacts(store: Store, facts: F2OpportunityFacts): Promise<void> {
  if (isF2Dp01PersistEnabled(store)) {
    await runDurableTx(store, (client) => upsertF2OpportunityFacts(client, facts));
  }
  f2FactsMemory(store).opportunities.set(facts.opportunityId, facts);
}

export async function readRfpFacts(store: Store, tenantId: string, rfpId: string): Promise<F2RfpFacts | undefined> {
  const cached = f2FactsMemory(store).rfps.get(rfpId);
  if (cached) return cached;
  if (!isF2Dp01PersistEnabled(store) || !store.dbPool) return undefined;
  const loaded = await selectF2RfpFacts(store.dbPool, tenantId, rfpId);
  if (loaded) f2FactsMemory(store).rfps.set(rfpId, loaded);
  return loaded;
}

export async function writeRfpFacts(store: Store, facts: F2RfpFacts): Promise<void> {
  if (isF2Dp01PersistEnabled(store)) {
    await runDurableTx(store, (client) => upsertF2RfpFacts(client, facts));
  }
  f2FactsMemory(store).rfps.set(facts.rfpId, facts);
}

export async function readPathB(store: Store, tenantId: string, rfpId: string): Promise<F2PathBApproval | undefined> {
  const cached = f2FactsMemory(store).pathB.get(rfpId);
  if (cached) return cached;
  if (!isF2Dp01PersistEnabled(store) || !store.dbPool) return undefined;
  const loaded = await selectF2PathB(store.dbPool, tenantId, rfpId);
  if (loaded) f2FactsMemory(store).pathB.set(rfpId, loaded);
  return loaded;
}

export async function writePathB(store: Store, facts: F2PathBApproval): Promise<void> {
  if (isF2Dp01PersistEnabled(store)) {
    await runDurableTx(store, (client) => upsertF2PathB(client, facts));
  }
  f2FactsMemory(store).pathB.set(facts.rfpId, facts);
}

export async function readAccountFacts(
  store: Store,
  tenantId: string,
  accountId: string,
): Promise<F2AccountFacts | undefined> {
  const cached = f2FactsMemory(store).accounts.get(accountId);
  if (cached) return cached;
  if (!isF2Dp01PersistEnabled(store) || !store.dbPool) return undefined;
  const loaded = await selectF2AccountFacts(store.dbPool, tenantId, accountId);
  if (loaded) f2FactsMemory(store).accounts.set(accountId, loaded);
  return loaded;
}

export async function writeAccountFacts(store: Store, facts: F2AccountFacts): Promise<void> {
  if (isF2Dp01PersistEnabled(store)) {
    await runDurableTx(store, (client) => upsertF2AccountFacts(client, facts));
  }
  f2FactsMemory(store).accounts.set(facts.accountId, facts);
}

export async function readRateIdentities(
  store: Store,
  tenantId: string,
  rateId: string,
): Promise<F2RateIdentity[]> {
  const cached = f2FactsMemory(store).rates.get(rateId);
  if (cached) return cached;
  if (!isF2Dp01PersistEnabled(store) || !store.dbPool) return [];
  const loaded = await selectF2RateIdentities(store.dbPool, tenantId, rateId);
  if (loaded.length > 0) f2FactsMemory(store).rates.set(rateId, loaded);
  return loaded;
}

export async function writeRateIdentity(
  store: Store,
  rateId: string,
  identities: F2RateIdentity[],
  written: F2RateIdentity,
): Promise<void> {
  if (isF2Dp01PersistEnabled(store)) {
    await runDurableTx(store, (client) => upsertF2RateIdentity(client, written));
  }
  f2FactsMemory(store).rates.set(rateId, identities);
}

export async function readProgrammeFacts(
  store: Store,
  tenantId: string,
  programmeId: string,
): Promise<F2ProgrammeFacts | undefined> {
  const cached = f2FactsMemory(store).programmes.get(programmeId);
  if (cached) return cached;
  if (!isF2Dp01PersistEnabled(store) || !store.dbPool) return undefined;
  const loaded = await selectF2ProgrammeFacts(store.dbPool, tenantId, programmeId);
  if (loaded) f2FactsMemory(store).programmes.set(programmeId, loaded);
  return loaded;
}

export async function writeProgrammeFacts(store: Store, facts: F2ProgrammeFacts): Promise<void> {
  if (isF2Dp01PersistEnabled(store)) {
    await runDurableTx(store, (client) => upsertF2ProgrammeFacts(client, facts));
  }
  f2FactsMemory(store).programmes.set(facts.programmeId, facts);
}

export async function hydrateF2CommercialFacts(
  pool: DbPool,
  store: Store,
): Promise<{
  opportunities: number;
  rfps: number;
  pathB: number;
  accounts: number;
  rates: number;
  programmes: number;
}> {
  const mem = f2FactsMemory(store);
  const opportunities = await listAllF2OpportunityFacts(pool);
  for (const facts of opportunities) mem.opportunities.set(facts.opportunityId, facts);
  const rfps = await listAllF2RfpFacts(pool);
  for (const facts of rfps) mem.rfps.set(facts.rfpId, facts);
  const pathB = await listAllF2PathB(pool);
  for (const facts of pathB) mem.pathB.set(facts.rfpId, facts);
  const accounts = await listAllF2AccountFacts(pool);
  for (const facts of accounts) mem.accounts.set(facts.accountId, facts);
  const rates = await listAllF2RateIdentities(pool);
  const byRate = new Map<string, F2RateIdentity[]>();
  for (const identity of rates) {
    const list = byRate.get(identity.rateId) ?? [];
    list.push(identity);
    byRate.set(identity.rateId, list);
  }
  for (const [rateId, list] of byRate) mem.rates.set(rateId, list);
  const programmes = await listAllF2ProgrammeFacts(pool);
  for (const facts of programmes) mem.programmes.set(facts.programmeId, facts);
  return {
    opportunities: opportunities.length,
    rfps: rfps.length,
    pathB: pathB.length,
    accounts: accounts.length,
    rates: rates.length,
    programmes: programmes.length,
  };
}
