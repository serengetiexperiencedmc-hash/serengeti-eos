import {
  authorize,
  canArchiveAccount,
  canTransitionAccount,
  clearanceAllows,
  CRM_EVENT_TYPES,
  isValidAccountPriority,
  isValidAccountStatus,
  maxClassification,
  newId,
  type Classification,
  type CrmAccount,
  type CrmAccountStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";
import { orgResource } from "./organization.js";

const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 100;

function accountResource(account: CrmAccount) {
  return {
    tenantId: account.tenantId,
    type: "crm_account" as const,
    id: account.id,
    classification: account.classification,
    ownerPrincipalId: account.ownerPrincipalId,
  };
}

function findAccount(store: Store, tenantId: string, id: string): CrmAccount | undefined {
  const account = store.crmAccounts.find((a) => a.id === id);
  if (!account || account.tenantId !== tenantId) return undefined;
  return account;
}

function duplicateAccountName(
  store: Store,
  tenantId: string,
  organizationId: string,
  accountName: string,
  excludeId?: string,
): boolean {
  const normalized = accountName.trim().toLowerCase();
  return store.crmAccounts.some(
    (a) =>
      a.tenantId === tenantId &&
      a.organizationId === organizationId &&
      a.id !== excludeId &&
      !a.archivedAt &&
      a.accountName.trim().toLowerCase() === normalized,
  );
}

export function listAccounts(
  store: Store,
  principal: Principal,
  query?: { organizationId?: string; status?: string; ownerPrincipalId?: string; limit?: number; cursor?: string },
) {
  ensureCrmCollections(store);
  const decision = authorize({
    principal,
    permission: "crm:read:account",
    action: "read:crm_account",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.crmAccounts.filter((a) => a.tenantId === principal.tenantId && !a.archivedAt);
  if (query?.organizationId) items = items.filter((a) => a.organizationId === query.organizationId);
  if (query?.status) {
    if (!isValidAccountStatus(query.status)) return { error: "invalid_request" as const, reason: "invalid_status" };
    items = items.filter((a) => a.status === query.status);
  }
  if (query?.ownerPrincipalId) items = items.filter((a) => a.ownerPrincipalId === query.ownerPrincipalId);
  items = items.filter((a) => clearanceAllows(principal.classificationClearance, a.classification));
  items.sort((a, b) => a.accountName.localeCompare(b.accountName));

  const limit = Math.min(Math.max(query?.limit ?? DEFAULT_LIST_LIMIT, 1), MAX_LIST_LIMIT);
  if (query?.cursor) {
    const idx = items.findIndex((a) => a.id === query.cursor);
    if (idx >= 0) items = items.slice(idx + 1);
  }
  const page = items.slice(0, limit);
  const nextCursor = page.length === limit && items.length > limit ? page[page.length - 1]?.id : undefined;
  return { items: page, ...(nextCursor !== undefined ? { nextCursor } : {}) };
}

export function getAccount(store: Store, principal: Principal, accountId: string) {
  ensureCrmCollections(store);
  const account = store.crmAccounts.find((a) => a.id === accountId);
  if (!account || account.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:account",
    action: "read:crm_account",
    resource: accountResource(account),
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (!clearanceAllows(principal.classificationClearance, account.classification)) {
    return { error: "forbidden" as const, reason: "classification" };
  }
  return { account };
}

export type CreateAccountInput = {
  organizationId: string;
  accountName: string;
  relationshipId?: string;
  ownerPrincipalId?: string;
  market?: string;
  strategicClassification?: string;
  priority?: string;
  nextAction?: string;
  classification?: Classification;
};

export function createAccount(store: Store, principal: Principal, input: CreateAccountInput, correlationId: string) {
  ensureCrmCollections(store);
  if (!input.organizationId || !input.accountName?.trim()) {
    return { error: "invalid_request" as const, reason: "organization_and_name_required" };
  }

  const org = store.crmOrganizations.find((o) => o.id === input.organizationId && o.tenantId === principal.tenantId);
  if (!org) return { error: "invalid_request" as const, reason: "invalid_organization" };

  if (input.relationshipId) {
    const rel = store.crmRelationships.find(
      (r) => r.id === input.relationshipId && r.tenantId === principal.tenantId,
    );
    if (!rel) return { error: "invalid_request" as const, reason: "invalid_relationship" };
  }

  if (input.priority && !isValidAccountPriority(input.priority)) {
    return { error: "invalid_request" as const, reason: "invalid_priority" };
  }

  if (duplicateAccountName(store, principal.tenantId, input.organizationId, input.accountName)) {
    return { error: "conflict" as const, reason: "duplicate_account" };
  }

  const ownerId = input.ownerPrincipalId ?? principal.id;
  const owner = [...store.principals.values()].find((p) => p.id === ownerId && p.tenantId === principal.tenantId);
  if (!owner) return { error: "invalid_request" as const, reason: "invalid_owner" };

  const classification = maxClassification(input.classification ?? "Internal", org.classification);

  const decision = authorize({
    principal,
    permission: "crm:write:account",
    action: "write:crm_account",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_account",
      id: "new",
      classification,
      ownerPrincipalId: ownerId,
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:account", "crm_account", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const now = new Date().toISOString();
  const account: CrmAccount = {
    id: newId(),
    tenantId: principal.tenantId,
    organizationId: input.organizationId,
    accountName: input.accountName.trim(),
    ownerPrincipalId: ownerId,
    status: "Prospect",
    classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
    ...(input.relationshipId !== undefined ? { relationshipId: input.relationshipId } : {}),
    ...(input.market !== undefined ? { market: input.market } : {}),
    ...(input.strategicClassification !== undefined ? { strategicClassification: input.strategicClassification } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.nextAction !== undefined ? { nextAction: input.nextAction } : {}),
  };

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ACCOUNT_CREATED,
    entityType: "account",
    entityId: account.id,
    classification: account.classification,
    correlationId,
    payload: { accountId: account.id, organizationId: account.organizationId },
    mutate: () => {
      store.crmAccounts.push(account);
      allowCrmAudit(store, principal, "crm:write:account", "crm_account", account.id, correlationId, {
        id: account.id,
        organizationId: account.organizationId,
        accountName: account.accountName,
        status: account.status,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { account };
}

export type UpdateAccountInput = Partial<
  Pick<
    CreateAccountInput,
    "accountName" | "market" | "strategicClassification" | "priority" | "nextAction" | "classification"
  >
>;

export function updateAccount(
  store: Store,
  principal: Principal,
  accountId: string,
  input: UpdateAccountInput,
  correlationId: string,
  expectedVersion?: number,
) {
  ensureCrmCollections(store);
  const account = findAccount(store, principal.tenantId, accountId);
  if (!account) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:account",
    action: "write:crm_account",
    resource: accountResource(account),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:account", "crm_account", correlationId, decision.reason, accountId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (account.archivedAt) return { error: "conflict" as const, reason: "account_not_mutable" };
  if (expectedVersion !== undefined && account.version !== expectedVersion) {
    return { error: "conflict" as const, reason: "version_mismatch" };
  }

  const previousState = { ...account };
  if (input.accountName !== undefined) {
    const name = input.accountName.trim();
    if (!name) return { error: "invalid_request" as const, reason: "account_name_required" };
    if (duplicateAccountName(store, principal.tenantId, account.organizationId, name, account.id)) {
      return { error: "conflict" as const, reason: "duplicate_account" };
    }
    account.accountName = name;
  }
  if (input.priority !== undefined) {
    if (input.priority && !isValidAccountPriority(input.priority)) {
      return { error: "invalid_request" as const, reason: "invalid_priority" };
    }
    account.priority = input.priority;
  }
  if (input.market !== undefined) account.market = input.market;
  if (input.strategicClassification !== undefined) account.strategicClassification = input.strategicClassification;
  if (input.nextAction !== undefined) account.nextAction = input.nextAction;
  if (input.classification !== undefined) account.classification = input.classification;

  account.version += 1;
  account.updatedAt = new Date().toISOString();
  account.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ACCOUNT_UPDATED,
    entityType: "account",
    entityId: account.id,
    classification: account.classification,
    correlationId,
    payload: { accountId: account.id },
    mutate: () => {
      allowCrmAudit(store, principal, "crm:write:account", "crm_account", account.id, correlationId, account, previousState);
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { account };
}

export function transitionAccount(
  store: Store,
  principal: Principal,
  accountId: string,
  input: { to: CrmAccountStatus },
  correlationId: string,
) {
  ensureCrmCollections(store);
  const account = findAccount(store, principal.tenantId, accountId);
  if (!account) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:account",
    action: "transition:crm_account",
    resource: accountResource(account),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:account", "crm_account", correlationId, decision.reason, accountId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (account.archivedAt) return { error: "conflict" as const, reason: "account_not_mutable" };
  if (!isValidAccountStatus(input.to) || input.to === "Archived") {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }
  if (!canTransitionAccount(account.status, input.to)) {
    return { error: "conflict" as const, reason: "invalid_transition" };
  }

  const previousState = { status: account.status };
  account.status = input.to;
  account.version += 1;
  account.updatedAt = new Date().toISOString();
  account.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ACCOUNT_TRANSITIONED,
    entityType: "account",
    entityId: account.id,
    classification: account.classification,
    correlationId,
    payload: {
      accountId: account.id,
      previousStatus: previousState.status,
      newStatus: account.status,
    },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:account",
        "crm_account",
        account.id,
        correlationId,
        { status: account.status },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { account };
}

export function archiveAccount(store: Store, principal: Principal, accountId: string, correlationId: string) {
  ensureCrmCollections(store);
  const account = findAccount(store, principal.tenantId, accountId);
  if (!account) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:account",
    action: "archive:crm_account",
    resource: accountResource(account),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:account", "crm_account", correlationId, decision.reason, accountId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (account.archivedAt) return { error: "conflict" as const, reason: "already_archived" };
  if (!canArchiveAccount(account.status)) {
    return { error: "conflict" as const, reason: "invalid_archive_state" };
  }

  const previousState = { status: account.status, archivedAt: account.archivedAt };
  account.status = "Archived";
  account.archivedAt = new Date().toISOString();
  account.version += 1;
  account.updatedAt = account.archivedAt;
  account.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ACCOUNT_ARCHIVED,
    entityType: "account",
    entityId: account.id,
    classification: account.classification,
    correlationId,
    payload: { accountId: account.id },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:write:account",
        "crm_account",
        account.id,
        correlationId,
        { status: account.status, archivedAt: account.archivedAt },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { account };
}

export function reassignAccountOwner(
  store: Store,
  principal: Principal,
  accountId: string,
  input: { ownerPrincipalId: string },
  correlationId: string,
) {
  ensureCrmCollections(store);
  const account = findAccount(store, principal.tenantId, accountId);
  if (!account) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:reassign:account_owner",
    action: "reassign:crm_account_owner",
    resource: accountResource(account),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:reassign:account_owner", "crm_account", correlationId, decision.reason, accountId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (account.archivedAt) return { error: "conflict" as const, reason: "account_not_mutable" };

  const owner = [...store.principals.values()].find(
    (p) => p.id === input.ownerPrincipalId && p.tenantId === principal.tenantId,
  );
  if (!owner) return { error: "invalid_request" as const, reason: "invalid_owner" };

  const previousState = { ownerPrincipalId: account.ownerPrincipalId };
  account.ownerPrincipalId = input.ownerPrincipalId;
  account.version += 1;
  account.updatedAt = new Date().toISOString();
  account.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.ACCOUNT_OWNER_REASSIGNED,
    entityType: "account",
    entityId: account.id,
    classification: account.classification,
    correlationId,
    payload: {
      accountId: account.id,
      newOwnerPrincipalId: account.ownerPrincipalId,
      previousOwnerPrincipalId: previousState.ownerPrincipalId,
    },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:reassign:account_owner",
        "crm_account",
        account.id,
        correlationId,
        { ownerPrincipalId: account.ownerPrincipalId },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { account };
}

export function listOrganizationAccounts(store: Store, principal: Principal, organizationId: string) {
  const org = store.crmOrganizations.find((o) => o.id === organizationId);
  if (!org || org.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:account",
    action: "read:crm_account",
    resource: orgResource(org),
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  return listAccounts(store, principal, { organizationId });
}
