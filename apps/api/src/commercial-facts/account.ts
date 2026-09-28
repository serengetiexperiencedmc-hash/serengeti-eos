import {
  authorize,
  COMMERCIAL_ACCOUNT_TYPE_KEYS,
  COMMERCIAL_ACCOUNT_TYPE_LABELS,
  COMMERCIAL_MARKET_KEYS,
  COMMERCIAL_MARKET_LABELS,
  isCommercialAccountType,
  isCommercialMarket,
  isPcoAccountType,
  type CommercialAccountType,
  type CommercialMarket,
  type CrmAccount,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { f2FactsMemory, type F2AccountFacts } from "./memory.js";
import { f2Dp01DurablePreviewBlock, f2FactsPersistenceMeta, readAccountFacts, writeAccountFacts } from "./persist.js";
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";

const IN_MEMORY_ONLY = { error: "conflict" as const, reason: "f2_i5_in_memory_preview_only" };

function findAccount(store: Store, tenantId: string, id: string): CrmAccount | undefined {
  return store.crmAccounts.find((a) => a.id === id && a.tenantId === tenantId && !a.archivedAt);
}

function resolveAccountType(value: string): CommercialAccountType | undefined {
  if (isCommercialAccountType(value)) return value;
  return COMMERCIAL_ACCOUNT_TYPE_KEYS.find((key) => COMMERCIAL_ACCOUNT_TYPE_LABELS[key] === value);
}

function resolveMarket(value: string): CommercialMarket | undefined {
  if (isCommercialMarket(value)) return value;
  return COMMERCIAL_MARKET_KEYS.find((key) => COMMERCIAL_MARKET_LABELS[key] === value);
}

export function accountFactsView(account: CrmAccount, facts?: F2AccountFacts) {
  const accountType = facts?.accountType;
  const market = facts?.market;
  return {
    accountId: account.id,
    organizationId: account.organizationId,
    accountName: account.accountName,
    accountType,
    accountTypeLabel: accountType ? COMMERCIAL_ACCOUNT_TYPE_LABELS[accountType] : undefined,
    isPco: accountType ? isPcoAccountType(accountType) : false,
    pcoIsDistinctFromEventAgency: accountType !== "event_agency",
    market,
    marketLabel: market ? COMMERCIAL_MARKET_LABELS[market] : undefined,
    accountTypeIndependentOfMarket: true,
    marketIndependentOfAccountType: true,
    or03Authoritative: true as const,
    or03mAuthoritative: true as const,
    legacyCrmMarket: account.market,
    legacyCrmMarketAuthoritativeForF2: false as const,
    inferredFromName: false as const,
    inferredFromTelephone: false as const,
    inferredFromEmail: false as const,
  };
}

export async function getAccountCommercialFacts(store: Store, principal: Principal, accountId: string) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const account = findAccount(store, principal.tenantId, accountId);
  if (!account) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "crm:read:account",
    action: "read:crm_account",
    resource: {
      tenantId: account.tenantId,
      type: "crm_account",
      id: account.id,
      classification: account.classification,
      ownerPrincipalId: account.ownerPrincipalId,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const stored = await readAccountFacts(store, account.tenantId, accountId);
  return { facts: accountFactsView(account, stored), persistence: f2FactsPersistenceMeta(store, Boolean(stored)) };
}

export type PutAccountFactsInput = {
  accountType?: string;
  market?: string;
  /** Rejected unless equal to the path id — never used as a write target. */
  accountId?: string;
  id?: string;
  tenantId?: string;
};

export async function putAccountCommercialFacts(
  store: Store,
  principal: Principal,
  accountId: string,
  input: PutAccountFactsInput,
) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const account = findAccount(store, principal.tenantId, accountId);
  if (!account) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "crm:write:account",
    action: "write:crm_account",
    resource: {
      tenantId: account.tenantId,
      type: "crm_account",
      id: account.id,
      classification: account.classification,
      ownerPrincipalId: account.ownerPrincipalId,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;
  if (input.accountId !== undefined && input.accountId !== accountId) {
    return { error: "conflict" as const, reason: "accountId_immutable" };
  }
  if (input.id !== undefined && input.id !== accountId) {
    return { error: "conflict" as const, reason: "accountId_immutable" };
  }
  if (input.tenantId !== undefined && input.tenantId !== account.tenantId) {
    return { error: "conflict" as const, reason: "tenantId_immutable" };
  }

  const existing = await readAccountFacts(store, account.tenantId, accountId);
  let accountType = existing?.accountType;
  let market = existing?.market;

  if (input.accountType !== undefined) {
    if (typeof input.accountType !== "string" || !input.accountType.trim()) {
      return { error: "invalid_request" as const, reason: "invalid_account_type" };
    }
    const resolved = resolveAccountType(input.accountType.trim());
    if (!resolved) return { error: "invalid_request" as const, reason: "invalid_account_type" };
    accountType = resolved;
  }

  if (input.market !== undefined) {
    if (typeof input.market !== "string" || !input.market.trim()) {
      return { error: "invalid_request" as const, reason: "invalid_market" };
    }
    const resolved = resolveMarket(input.market.trim());
    if (!resolved) return { error: "invalid_request" as const, reason: "invalid_market" };
    market = resolved;
  }

  if (input.accountType === undefined && input.market === undefined) {
    return { error: "invalid_request" as const, reason: "account_type_or_market_required" };
  }

  const now = new Date().toISOString();
  const record: F2AccountFacts = {
    accountId: account.id,
    tenantId: account.tenantId,
    ...(accountType !== undefined ? { accountType } : {}),
    ...(market !== undefined ? { market } : {}),
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  try {
    await writeAccountFacts(store, record);
  } catch {
    return { error: "conflict" as const, reason: "f2_sidecar_persist_failed" };
  }
  return { facts: accountFactsView(account, record), persistence: f2FactsPersistenceMeta(store, true) };
}

export function c1AccountContextForOpportunity(
  store: Store,
  opportunity: { accountId?: string; tenantId: string },
) {
  if (!opportunity.accountId) {
    return { linked: false as const };
  }
  const account = findAccount(store, opportunity.tenantId, opportunity.accountId);
  if (!account) {
    return { linked: true as const, accountId: opportunity.accountId };
  }
  const facts = f2FactsMemory(store).accounts.get(account.id);
  return {
    linked: true as const,
    accountId: account.id,
    organizationId: account.organizationId,
    accountType: facts?.accountType,
    accountTypeLabel: facts?.accountType ? COMMERCIAL_ACCOUNT_TYPE_LABELS[facts.accountType] : undefined,
    market: facts?.market,
    marketLabel: facts?.market ? COMMERCIAL_MARKET_LABELS[facts.market] : undefined,
  };
}
