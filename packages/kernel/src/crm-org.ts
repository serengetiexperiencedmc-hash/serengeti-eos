import type { CrmOrganizationStatus } from "./crm.js";

export const CRM_ORGANIZATION_STATUSES = [
  "Prospect",
  "Engaged",
  "Qualified",
  "Active",
  "Dormant",
  "Disqualified",
  "Archived",
] as const satisfies readonly CrmOrganizationStatus[];

export const CRM_ORGANIZATION_UNIT_TYPES = [
  "division",
  "department",
  "branch",
  "regional_office",
  "subsidiary",
  "business_unit",
] as const;

const ORG_SUFFIXES = /\b(ltd|limited|llc|inc|plc|gmbh|sa|bv|co)\b\.?$/gi;

export function normalizeOrganizationName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(ORG_SUFFIXES, "")
    .trim()
    .toLowerCase();
}

export function isValidOrganizationStatus(status: string): status is CrmOrganizationStatus {
  return (CRM_ORGANIZATION_STATUSES as readonly string[]).includes(status);
}

export function isValidOrganizationUnitType(unitType: string): boolean {
  return (CRM_ORGANIZATION_UNIT_TYPES as readonly string[]).includes(unitType);
}

/** Approved organization lifecycle transitions (excludes Archived — use archive). */
export const CRM_ORGANIZATION_TRANSITIONS: Record<
  Exclude<CrmOrganizationStatus, "Archived">,
  readonly CrmOrganizationStatus[]
> = {
  Prospect: ["Engaged", "Disqualified"],
  Engaged: ["Qualified", "Dormant", "Disqualified"],
  Qualified: ["Active", "Dormant", "Disqualified"],
  Active: ["Dormant"],
  Dormant: ["Engaged", "Active", "Disqualified"],
  Disqualified: ["Prospect"],
};

export function canTransitionOrganization(from: CrmOrganizationStatus, to: CrmOrganizationStatus): boolean {
  if (from === "Archived" || to === "Archived") return false;
  return (CRM_ORGANIZATION_TRANSITIONS[from] as readonly string[]).includes(to);
}

export function canArchiveOrganization(status: CrmOrganizationStatus): boolean {
  return status === "Active" || status === "Dormant";
}

export const CRM_ORGANIZATION_LEGAL_NAME_MAX_LENGTH = 200;

const UNSAFE_TEXT_PATTERN = /<[^>]*>|script/i;

export function validateOrganizationLegalName(
  name: string,
): { ok: true; value: string } | { ok: false; reason: string } {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, reason: "legal_name_required" };
  if (trimmed.length > CRM_ORGANIZATION_LEGAL_NAME_MAX_LENGTH) {
    return { ok: false, reason: "legal_name_too_long" };
  }
  if (UNSAFE_TEXT_PATTERN.test(trimmed)) {
    return { ok: false, reason: "legal_name_unsafe" };
  }
  return { ok: true, value: trimmed };
}
