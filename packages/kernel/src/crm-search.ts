export const CRM_SEARCH_ENTITY_TYPES = [
  "organization",
  "contact",
  "account",
  "activity",
  "task",
] as const;

export type CrmSearchEntityType = (typeof CRM_SEARCH_ENTITY_TYPES)[number];

export function isValidSearchEntityType(entityType: string): entityType is CrmSearchEntityType {
  return (CRM_SEARCH_ENTITY_TYPES as readonly string[]).includes(entityType);
}

export const CRM_SEARCH_MIN_QUERY_LENGTH = 2;
export const CRM_SEARCH_MAX_QUERY_LENGTH = 200;

export function normalizeSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ").toLowerCase();
}

export function searchQueryValid(query: string): boolean {
  const normalized = normalizeSearchQuery(query);
  return normalized.length >= CRM_SEARCH_MIN_QUERY_LENGTH && normalized.length <= CRM_SEARCH_MAX_QUERY_LENGTH;
}

/** 0 = exact, 1 = prefix, 2 = contains, null = no match */
export function searchMatchRank(normalizedQuery: string, normalizedField: string): number | null {
  if (!normalizedField) return null;
  if (normalizedField === normalizedQuery) return 0;
  if (normalizedField.startsWith(normalizedQuery)) return 1;
  if (normalizedField.includes(normalizedQuery)) return 2;
  return null;
}
