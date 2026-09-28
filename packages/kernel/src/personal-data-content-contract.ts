/**
 * H-140 — structural non-personal content contract.
 *
 * This is NOT a personal-data scanner. It rejects retired person-domain
 * object keys and explicit identity-document filename labels only.
 * Free-text bodies, JSON string values, and opaque file bytes are not inspected.
 */
export const PERSON_DOMAIN_OBJECT_KEYS = [
  "guestName",
  "guest_name",
  "guestId",
  "guest_id",
  "givenName",
  "familyName",
  "contactId",
  "supplierContact",
  "supplier_contact",
  "employeeId",
  "employeeName",
  "passport",
  "passportNumber",
  "nationalId",
  "dateOfBirth",
  "whatsapp",
  "dietary",
  "mobility",
  "guestList",
  "employeeRecord",
  "identityDocument",
  "subjectLabel",
  "personalEmail",
  "personalTelephone",
] as const;

const PERSON_DOMAIN_OBJECT_KEY_SET = new Set(
  PERSON_DOMAIN_OBJECT_KEYS.map((key) => key.toLowerCase()),
);

/** Incomplete filename labels. Not a document-content classifier. */
export const PERSON_DOMAIN_DOCUMENT_FILENAME_MARKERS = [
  "passport",
  "guest-list",
  "guest_list",
  "guestlist",
  "employee-record",
  "identity-doc",
  "visa-copy",
  "dietary-list",
] as const;

export function findPersonDomainObjectKeys(value: unknown): string[] {
  const found = new Set<string>();
  walk(value, found);
  return [...found];
}

function walk(value: unknown, found: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, found);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    if (PERSON_DOMAIN_OBJECT_KEY_SET.has(key.toLowerCase())) found.add(key);
    walk(nested, found);
  }
}

export function isPersonDomainDocumentFilename(filename: string): boolean {
  const normalized = filename.trim().toLowerCase();
  return PERSON_DOMAIN_DOCUMENT_FILENAME_MARKERS.some((marker) => normalized.includes(marker));
}
