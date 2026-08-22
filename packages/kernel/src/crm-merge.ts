export const CRM_MERGE_ENTITY_TYPES = ["organization", "contact"] as const;

export type CrmMergeEntityType = (typeof CRM_MERGE_ENTITY_TYPES)[number];

export function isValidMergeEntityType(entityType: string): entityType is CrmMergeEntityType {
  return (CRM_MERGE_ENTITY_TYPES as readonly string[]).includes(entityType);
}

/** Survivor fields that may be set explicitly via fieldResolutions during merge. */
export const CRM_ORG_MERGE_FIELDS = [
  "legalName",
  "tradingName",
  "country",
  "region",
  "market",
  "website",
  "domain",
  "primaryEmail",
  "primaryTelephone",
  "classification",
] as const;

export const CRM_CONTACT_MERGE_FIELDS = [
  "givenName",
  "familyName",
  "preferredName",
  "email",
  "telephone",
  "mobile",
  "jobTitle",
  "department",
  "classification",
] as const;

export function isAllowedOrgMergeField(field: string): boolean {
  return (CRM_ORG_MERGE_FIELDS as readonly string[]).includes(field);
}

export function isAllowedContactMergeField(field: string): boolean {
  return (CRM_CONTACT_MERGE_FIELDS as readonly string[]).includes(field);
}
