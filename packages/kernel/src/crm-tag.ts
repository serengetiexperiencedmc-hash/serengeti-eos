export const CRM_TAG_ENTITY_TYPES = [
  "organization",
  "organization_unit",
  "contact",
  "relationship",
  "account",
  "activity",
  "task",
] as const;

export type CrmTagEntityType = (typeof CRM_TAG_ENTITY_TYPES)[number];

export function isValidTagEntityType(entityType: string): entityType is CrmTagEntityType {
  return (CRM_TAG_ENTITY_TYPES as readonly string[]).includes(entityType);
}

const TAG_KEY_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function normalizeTagKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, "_");
}

export function tagKeyValid(key: string): boolean {
  const normalized = normalizeTagKey(key);
  return normalized.length > 0 && TAG_KEY_PATTERN.test(normalized);
}

export function tagLabelValid(label: string): boolean {
  const trimmed = label.trim();
  return trimmed.length > 0 && trimmed.length <= 128;
}
