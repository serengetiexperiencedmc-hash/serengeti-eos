export const CRM_NOTE_ENTITY_TYPES = [
  "organization",
  "organization_unit",
  "contact",
  "relationship",
  "account",
  "activity",
] as const;

export type CrmNoteEntityType = (typeof CRM_NOTE_ENTITY_TYPES)[number];

export function isValidNoteEntityType(entityType: string): entityType is CrmNoteEntityType {
  return (CRM_NOTE_ENTITY_TYPES as readonly string[]).includes(entityType);
}

export function noteBodyValid(body: string): boolean {
  const trimmed = body.trim();
  return trimmed.length > 0 && trimmed.length <= 10000;
}
