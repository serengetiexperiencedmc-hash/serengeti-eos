import {
  authorize,
  clearanceAllows,
  isValidSearchEntityType,
  normalizeEmail,
  normalizeOrganizationName,
  normalizePersonName,
  normalizeSearchQuery,
  searchMatchRank,
  searchQueryValid,
  type Classification,
  type CrmSearchEntityType,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureCrmCollections, seedCrmCatalogues } from "./collections.js";
import { orgResource } from "./organization.js";
import { contactResource } from "./contact.js";

const DEFAULT_SEARCH_LIMIT = 25;
const MAX_SEARCH_LIMIT = 50;

const SEARCH_PERMISSIONS: Record<CrmSearchEntityType, string> = {
  organization: "crm:read:organization",
  contact: "crm:read:contact",
  account: "crm:read:account",
  activity: "crm:read:activity",
  task: "crm:read:task",
};

export type CrmSearchResult = {
  entityType: CrmSearchEntityType;
  entityId: string;
  displayLabel: string;
  matchedField: string;
  classification: Classification;
  rank: number;
};

function encodeCursor(entityType: string, entityId: string): string {
  return `${entityType}:${entityId}`;
}

function decodeCursor(cursor: string): { entityType: string; entityId: string } | null {
  const idx = cursor.indexOf(":");
  if (idx <= 0) return null;
  const entityType = cursor.slice(0, idx);
  const entityId = cursor.slice(idx + 1);
  if (!entityType || !entityId) return null;
  return { entityType, entityId };
}

function permittedSearchTypes(principal: Principal, requested?: string[]): CrmSearchEntityType[] | { error: string } {
  const types = requested?.length
    ? requested
    : (["organization", "contact", "account", "activity", "task"] as CrmSearchEntityType[]);
  const allowed: CrmSearchEntityType[] = [];
  for (const type of types) {
    if (!isValidSearchEntityType(type)) return { error: "invalid_entity_type" };
    const permission = SEARCH_PERMISSIONS[type];
    const decision = authorize({ principal, permission, action: `search:crm_${type}` });
    if (decision.result === "allow") allowed.push(type);
  }
  return allowed;
}

function searchOrganizations(
  store: Store,
  principal: Principal,
  normalizedQuery: string,
  filters?: { status?: string; country?: string; type?: string; owner?: string },
): CrmSearchResult[] {
  const results: CrmSearchResult[] = [];
  for (const org of store.crmOrganizations) {
    if (org.tenantId !== principal.tenantId || org.archivedAt || org.mergedIntoId) continue;
    if (filters?.status && org.status !== filters.status) continue;
    if (filters?.country && org.country !== filters.country) continue;
    if (filters?.type && org.organizationTypeId !== filters.type) continue;
    if (filters?.owner && org.ownerPrincipalId !== filters.owner) continue;
    if (!clearanceAllows(principal.classificationClearance, org.classification)) continue;

    const decision = authorize({
      principal,
      permission: "crm:read:organization",
      action: "read:crm_organization",
      resource: orgResource(org),
    });
    if (decision.result === "deny") continue;

    const fields: Array<[string, string]> = [
      ["legalName", org.legalName],
      ...(org.tradingName ? ([["tradingName", org.tradingName]] as Array<[string, string]>) : []),
    ];
    let bestRank: number | null = null;
    let matchedField = "";
    for (const [field, value] of fields) {
      const rank = searchMatchRank(normalizedQuery, normalizeOrganizationName(value));
      if (rank !== null && (bestRank === null || rank < bestRank)) {
        bestRank = rank;
        matchedField = field;
      }
      const rawRank = searchMatchRank(normalizedQuery, value.toLowerCase());
      if (rawRank !== null && (bestRank === null || rawRank < bestRank)) {
        bestRank = rawRank;
        matchedField = field;
      }
    }
    if (bestRank === null) continue;

    results.push({
      entityType: "organization",
      entityId: org.id,
      displayLabel: org.tradingName ? `${org.legalName} (${org.tradingName})` : org.legalName,
      matchedField,
      classification: org.classification,
      rank: bestRank,
    });
  }
  return results;
}

function searchContacts(
  store: Store,
  principal: Principal,
  normalizedQuery: string,
  filters?: { status?: string },
): CrmSearchResult[] {
  const results: CrmSearchResult[] = [];
  for (const contact of store.crmContacts) {
    if (contact.tenantId !== principal.tenantId || contact.archivedAt || contact.mergedIntoId) continue;
    if (filters?.status && contact.status !== filters.status) continue;
    if (!clearanceAllows(principal.classificationClearance, contact.classification)) continue;

    const decision = authorize({
      principal,
      permission: "crm:read:contact",
      action: "read:crm_contact",
      resource: contactResource(contact),
    });
    if (decision.result === "deny") continue;

    const fields: Array<[string, string]> = [
      ["givenName", contact.givenName],
      ["familyName", contact.familyName],
      ...(contact.preferredName ? ([["preferredName", contact.preferredName]] as Array<[string, string]>) : []),
      ...(contact.email ? ([["email", contact.email]] as Array<[string, string]>) : []),
      ...(contact.telephone ? ([["telephone", contact.telephone]] as Array<[string, string]>) : []),
      ...(contact.mobile ? ([["mobile", contact.mobile]] as Array<[string, string]>) : []),
    ];
    let bestRank: number | null = null;
    let matchedField = "";
    for (const [field, value] of fields) {
      const normalized =
        field === "email"
          ? normalizeEmail(value)
          : field === "givenName" || field === "familyName" || field === "preferredName"
            ? normalizePersonName(value).toLowerCase()
            : value.toLowerCase();
      const rank = searchMatchRank(normalizedQuery, normalized);
      if (rank !== null && (bestRank === null || rank < bestRank)) {
        bestRank = rank;
        matchedField = field;
      }
    }
    if (bestRank === null) continue;

    results.push({
      entityType: "contact",
      entityId: contact.id,
      displayLabel: `${contact.givenName} ${contact.familyName}`,
      matchedField,
      classification: contact.classification,
      rank: bestRank,
    });
  }
  return results;
}

function searchAccounts(
  store: Store,
  principal: Principal,
  normalizedQuery: string,
  filters?: { status?: string; owner?: string },
): CrmSearchResult[] {
  const results: CrmSearchResult[] = [];
  for (const account of store.crmAccounts) {
    if (account.tenantId !== principal.tenantId || account.archivedAt) continue;
    if (filters?.status && account.status !== filters.status) continue;
    if (filters?.owner && account.ownerPrincipalId !== filters.owner) continue;
    if (!clearanceAllows(principal.classificationClearance, account.classification)) continue;

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
    if (decision.result === "deny") continue;

    const rank = searchMatchRank(normalizedQuery, account.accountName.trim().toLowerCase());
    if (rank === null) continue;

    results.push({
      entityType: "account",
      entityId: account.id,
      displayLabel: account.accountName,
      matchedField: "accountName",
      classification: account.classification,
      rank,
    });
  }
  return results;
}

function searchActivities(
  store: Store,
  principal: Principal,
  normalizedQuery: string,
): CrmSearchResult[] {
  const results: CrmSearchResult[] = [];
  for (const activity of store.crmActivities) {
    if (activity.tenantId !== principal.tenantId || activity.archivedAt) continue;
    if (!clearanceAllows(principal.classificationClearance, activity.classification)) continue;

    const decision = authorize({
      principal,
      permission: "crm:read:activity",
      action: "read:crm_activity",
      resource: {
        tenantId: activity.tenantId,
        type: "crm_activity",
        id: activity.id,
        classification: activity.classification,
      },
    });
    if (decision.result === "deny") continue;

    const fields: Array<[string, string]> = [
      ["subject", activity.subject],
      ...(activity.notes ? ([["notes", activity.notes]] as Array<[string, string]>) : []),
    ];
    let bestRank: number | null = null;
    let matchedField = "";
    for (const [field, value] of fields) {
      const rank = searchMatchRank(normalizedQuery, value.toLowerCase());
      if (rank !== null && (bestRank === null || rank < bestRank)) {
        bestRank = rank;
        matchedField = field;
      }
    }
    if (bestRank === null) continue;

    results.push({
      entityType: "activity",
      entityId: activity.id,
      displayLabel: activity.subject,
      matchedField,
      classification: activity.classification,
      rank: bestRank,
    });
  }
  return results;
}

function searchTasks(
  store: Store,
  principal: Principal,
  normalizedQuery: string,
  filters?: { status?: string; owner?: string },
): CrmSearchResult[] {
  const results: CrmSearchResult[] = [];
  for (const task of store.crmTasks) {
    if (task.tenantId !== principal.tenantId) continue;
    if (filters?.status && task.status !== filters.status) continue;
    if (filters?.owner && task.assigneePrincipalId !== filters.owner) continue;
    if (!clearanceAllows(principal.classificationClearance, task.classification)) continue;

    const decision = authorize({
      principal,
      permission: "crm:read:task",
      action: "read:crm_task",
      resource: {
        tenantId: task.tenantId,
        type: "crm_task",
        id: task.id,
        classification: task.classification,
      },
    });
    if (decision.result === "deny") continue;

    const fields: Array<[string, string]> = [
      ["title", task.title],
      ...(task.description ? ([["description", task.description]] as Array<[string, string]>) : []),
    ];
    let bestRank: number | null = null;
    let matchedField = "";
    for (const [field, value] of fields) {
      const rank = searchMatchRank(normalizedQuery, value.toLowerCase());
      if (rank !== null && (bestRank === null || rank < bestRank)) {
        bestRank = rank;
        matchedField = field;
      }
    }
    if (bestRank === null) continue;

    results.push({
      entityType: "task",
      entityId: task.id,
      displayLabel: task.title,
      matchedField,
      classification: task.classification,
      rank: bestRank,
    });
  }
  return results;
}

function sortResults(items: CrmSearchResult[]): CrmSearchResult[] {
  return [...items].sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    const typeCmp = a.entityType.localeCompare(b.entityType);
    if (typeCmp !== 0) return typeCmp;
    return a.displayLabel.localeCompare(b.displayLabel);
  });
}

export function searchCrm(
  store: Store,
  principal: Principal,
  query: {
    q: string;
    types?: string[];
    limit?: number;
    cursor?: string;
    status?: string;
    owner?: string;
    country?: string;
    type?: string;
  },
) {
  ensureCrmCollections(store);
  seedCrmCatalogues(store, principal.tenantId);

  if (!searchQueryValid(query.q ?? "")) {
    return { error: "invalid_request" as const, reason: "invalid_search_query" };
  }

  const typeResult = permittedSearchTypes(principal, query.types);
  if ("error" in typeResult) return { error: "invalid_request" as const, reason: typeResult.error };
  if (typeResult.length === 0) return { error: "forbidden" as const, reason: "no_searchable_types" };

  const normalizedQuery = normalizeSearchQuery(query.q);
  let items: CrmSearchResult[] = [];
  const filters = {
    ...(query.status !== undefined ? { status: query.status } : {}),
    ...(query.owner !== undefined ? { owner: query.owner } : {}),
    ...(query.country !== undefined ? { country: query.country } : {}),
    ...(query.type !== undefined ? { type: query.type } : {}),
  };

  for (const entityType of typeResult) {
    switch (entityType) {
      case "organization":
        items.push(...searchOrganizations(store, principal, normalizedQuery, filters));
        break;
      case "contact":
        items.push(...searchContacts(store, principal, normalizedQuery, filters));
        break;
      case "account":
        items.push(...searchAccounts(store, principal, normalizedQuery, filters));
        break;
      case "activity":
        items.push(...searchActivities(store, principal, normalizedQuery));
        break;
      case "task":
        items.push(...searchTasks(store, principal, normalizedQuery, filters));
        break;
    }
  }

  items = sortResults(items);

  if (query.cursor) {
    const decoded = decodeCursor(query.cursor);
    if (!decoded) return { error: "invalid_request" as const, reason: "invalid_cursor" };
    const idx = items.findIndex(
      (item) => item.entityType === decoded.entityType && item.entityId === decoded.entityId,
    );
    if (idx >= 0) items = items.slice(idx + 1);
  }

  const limit = Math.min(Math.max(query.limit ?? DEFAULT_SEARCH_LIMIT, 1), MAX_SEARCH_LIMIT);
  const page = items.slice(0, limit);
  const nextCursor =
    page.length === limit && items.length > limit
      ? encodeCursor(page[page.length - 1]!.entityType, page[page.length - 1]!.entityId)
      : undefined;

  return {
    items: page.map(({ rank: _rank, ...rest }) => rest),
    ...(nextCursor !== undefined ? { nextCursor } : {}),
  };
}
