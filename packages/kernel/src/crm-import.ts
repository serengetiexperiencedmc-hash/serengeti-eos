import { isPlausibleEmail, isPlausiblePhone, normalizeEmail, normalizePersonName } from "./crm-contact.js";
import { normalizeOrganizationName } from "./crm-org.js";
import type { Classification } from "./types.js";

export const CRM_IMPORT_ENTITY_TYPES = ["organization", "contact"] as const;

export type CrmImportEntityType = (typeof CRM_IMPORT_ENTITY_TYPES)[number];

export const CRM_IMPORT_MAX_ROWS = 500;
export const CRM_IMPORT_MAX_BYTES = 1024 * 1024;

export function isValidImportEntityType(entityType: string): entityType is CrmImportEntityType {
  return (CRM_IMPORT_ENTITY_TYPES as readonly string[]).includes(entityType);
}

export type ParsedCsvRow = Record<string, string>;

export function parseCsv(content: string): { headers: string[]; rows: ParsedCsvRow[] } | { error: string } {
  const trimmed = content.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return { error: "empty_csv" };

  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) return { error: "csv_requires_header_and_row" };

  const headers = splitCsvLine(lines[0]!).map((h) => h.trim());
  if (headers.some((h) => h === "")) return { error: "invalid_csv_header" };
  if (new Set(headers).size !== headers.length) return { error: "duplicate_csv_header" };

  const rows: ParsedCsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]!);
    if (values.length !== headers.length) return { error: `row_${i + 1}_column_mismatch` };
    const row: ParsedCsvRow = {};
    for (let c = 0; c < headers.length; c++) {
      row[headers[c]!] = values[c] ?? "";
    }
    rows.push(row);
  }

  if (rows.length > CRM_IMPORT_MAX_ROWS) return { error: "import_row_limit_exceeded" };
  const byteLength = new TextEncoder().encode(trimmed).length;
  if (byteLength > CRM_IMPORT_MAX_BYTES) return { error: "import_size_limit_exceeded" };

  return { headers, rows };
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result;
}

const CLASSIFICATIONS = ["Public", "Internal", "Confidential", "Restricted"] as const;

export function parseImportClassification(value: string | undefined, fallback: Classification): Classification | { error: string } {
  if (value === undefined || value.trim() === "") return fallback;
  const normalized = value.trim();
  if (!(CLASSIFICATIONS as readonly string[]).includes(normalized)) return { error: "invalid_classification" };
  return normalized as Classification;
}

export type OrganizationImportRow = {
  legalName: string;
  organizationTypeKey: string;
  tradingName?: string;
  country?: string;
  classification?: Classification;
  sourceRecordId?: string;
};

export type ContactImportRow = {
  givenName: string;
  familyName: string;
  email?: string;
  telephone?: string;
  classification?: Classification;
  sourceRecordId?: string;
};

export function validateOrganizationImportRow(row: ParsedCsvRow): OrganizationImportRow | { errors: string[] } {
  const errors: string[] = [];
  const legalName = row.legalName?.trim();
  if (!legalName) errors.push("legalName_required");
  const organizationTypeKey = row.organizationTypeKey?.trim();
  if (!organizationTypeKey) errors.push("organizationTypeKey_required");
  if (row.email !== undefined && row.email.trim() !== "") errors.push("unsupported_field:email");
  if (errors.length > 0) return { errors };

  const classification = parseImportClassification(row.classification, "Internal");
  if (typeof classification === "object" && "error" in classification) {
    return { errors: [classification.error] };
  }

  return {
    legalName: legalName!,
    organizationTypeKey: organizationTypeKey!,
    ...(row.tradingName?.trim() ? { tradingName: row.tradingName.trim() } : {}),
    ...(row.country?.trim() ? { country: row.country.trim() } : {}),
    classification,
    ...(row.sourceRecordId?.trim() ? { sourceRecordId: row.sourceRecordId.trim() } : {}),
  };
}

export function validateContactImportRow(row: ParsedCsvRow): ContactImportRow | { errors: string[] } {
  const errors: string[] = [];
  const givenName = normalizePersonName(row.givenName ?? "");
  const familyName = normalizePersonName(row.familyName ?? "");
  if (!givenName) errors.push("givenName_required");
  if (!familyName) errors.push("familyName_required");
  if (row.email !== undefined && row.email.trim() !== "" && !isPlausibleEmail(row.email)) {
    errors.push("invalid_email");
  }
  if (row.telephone !== undefined && row.telephone.trim() !== "" && !isPlausiblePhone(row.telephone)) {
    errors.push("invalid_telephone");
  }
  if (errors.length > 0) return { errors };

  const classification = parseImportClassification(row.classification, "Confidential");
  if (typeof classification === "object" && "error" in classification) {
    return { errors: [classification.error] };
  }

  return {
    givenName,
    familyName,
    ...(row.email?.trim() ? { email: normalizeEmail(row.email) } : {}),
    ...(row.telephone?.trim() ? { telephone: row.telephone.trim() } : {}),
    classification,
    ...(row.sourceRecordId?.trim() ? { sourceRecordId: row.sourceRecordId.trim() } : {}),
  };
}

export function importRowDuplicateKey(entityType: CrmImportEntityType, row: OrganizationImportRow | ContactImportRow): string {
  if (entityType === "organization") {
    const org = row as OrganizationImportRow;
    return normalizeOrganizationName(org.legalName);
  }
  const contact = row as ContactImportRow;
  return contact.email ? normalizeEmail(contact.email) : `${contact.givenName}|${contact.familyName}`.toLowerCase();
}
