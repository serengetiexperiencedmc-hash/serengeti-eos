export const CRM_EXTERNAL_ID_ENTITY_TYPES = ["organization", "contact"] as const;

export type CrmExternalIdEntityType = (typeof CRM_EXTERNAL_ID_ENTITY_TYPES)[number];

export function isValidExternalIdEntityType(entityType: string): entityType is CrmExternalIdEntityType {
  return (CRM_EXTERNAL_ID_ENTITY_TYPES as readonly string[]).includes(entityType);
}

const SYSTEM_KEY_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function normalizeSystemKey(systemKey: string): string {
  return systemKey.trim().toLowerCase().replace(/\s+/g, "_");
}

export function normalizeExternalId(externalId: string): string {
  return externalId.trim();
}

export function systemKeyValid(systemKey: string): boolean {
  const normalized = normalizeSystemKey(systemKey);
  return normalized.length > 0 && SYSTEM_KEY_PATTERN.test(normalized);
}

export function externalIdValid(externalId: string): boolean {
  const normalized = normalizeExternalId(externalId);
  return normalized.length > 0 && normalized.length <= 256;
}

export function externalIdentifierKey(systemKey: string, externalId: string): string {
  return `${normalizeSystemKey(systemKey)}::${normalizeExternalId(externalId)}`;
}
