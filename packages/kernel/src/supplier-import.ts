import { parseCsv, parseImportClassification, type ParsedCsvRow } from "./crm-import.js";
import type { Classification } from "./types.js";

export { parseCsv, type ParsedCsvRow };

export const SUPPLIER_IMPORT_ENTITY_TYPES = [
  "supplier",
  "supplier_contact",
  "supplier_rate",
  "supplier_content_block",
  "supplier_season",
] as const;

export type SupplierImportEntityType = (typeof SUPPLIER_IMPORT_ENTITY_TYPES)[number];

export const SUPPLIER_IMPORT_MAX_ROWS = 5000;
export const SUPPLIER_RATE_IMPORT_MAX_ROWS = 20000;

export const SUPPLIER_CATEGORIES = [
  "accommodation",
  "vehicle_hire",
  "excursion",
  "av_entertainment",
  "decor",
  "catering",
  "venue",
  "guide_staff",
  "air_charter",
  "miscellaneous",
] as const;

export type SupplierCategory = (typeof SUPPLIER_CATEGORIES)[number];

export const SUPPLIER_STATUSES = [
  "draft",
  "pending_review",
  "active",
  "inactive",
  "suspended",
] as const;

export const SUPPLIER_CONTACT_ROLES = [
  "reservations",
  "operations",
  "finance",
  "management",
  "sales",
  "emergency",
  "other",
] as const;

export const SUPPLIER_RATE_TYPES = [
  "per_room_per_night",
  "per_person_per_night",
  "per_vehicle_per_day",
  "per_person",
  "flat_fee",
  "per_hour",
  "per_km",
  "percentage",
] as const;

export const SUPPLIER_RATE_STATUSES = ["draft", "active", "expired", "superseded"] as const;

export const SUPPLIER_CONTENT_BLOCK_TYPES = [
  "description",
  "highlights",
  "room_type",
  "inclusions",
  "exclusions",
  "location",
  "programme_snippet",
  "image_caption",
  "terms",
] as const;

export const SUPPLIER_CONTENT_BLOCK_STATUSES = ["draft", "reviewed", "approved", "archived"] as const;

const SUPPLIER_CODE_PATTERN = /^[A-Z0-9_-]{2,32}$/;
const ISO_COUNTRY_PATTERN = /^[A-Z]{2}$/;
const ISO_CURRENCY_PATTERN = /^[A-Z]{3}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidSupplierImportEntityType(entityType: string): entityType is SupplierImportEntityType {
  return (SUPPLIER_IMPORT_ENTITY_TYPES as readonly string[]).includes(entityType);
}

export function normalizeSupplierCode(code: string): string {
  return code.trim().toUpperCase();
}

function parseOptionalBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return undefined;
}

function parseOptionalInt(value: string | undefined): number | undefined | { error: string } {
  if (value === undefined || value.trim() === "") return undefined;
  const parsed = Number.parseInt(value.trim(), 10);
  if (Number.isNaN(parsed)) return { error: "invalid_integer" };
  return parsed;
}

function parseOptionalDecimal(value: string | undefined): number | undefined | { error: string } {
  if (value === undefined || value.trim() === "") return undefined;
  const parsed = Number.parseFloat(value.trim());
  if (Number.isNaN(parsed)) return { error: "invalid_decimal" };
  return parsed;
}

function parseRequiredEnum<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  field: string,
): T | { error: string } {
  const normalized = value?.trim();
  if (!normalized) return { error: `${field}_required` };
  if (!(allowed as readonly string[]).includes(normalized)) return { error: `invalid_${field}` };
  return normalized as T;
}

export type SupplierImportRow = {
  supplierCode: string;
  legalName: string;
  tradingName?: string;
  category: SupplierCategory;
  subcategory?: string;
  country: string;
  region?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  telephone?: string;
  email?: string;
  website?: string;
  status: (typeof SUPPLIER_STATUSES)[number];
  preferredPartner?: boolean;
  paymentTermsDays?: number;
  defaultCurrency?: string;
  taxRegistrationNumber?: string;
  contractRef?: string;
  contractValidFrom?: string;
  contractValidTo?: string;
  maintainedByEmail?: string;
  notes?: string;
  sourceRecordId?: string;
  classification?: Classification;
};

export type SupplierContactImportRow = {
  supplierCode: string;
  contactRole: (typeof SUPPLIER_CONTACT_ROLES)[number];
  givenName: string;
  familyName: string;
  email?: string;
  telephone?: string;
  whatsapp?: string;
  isPrimary?: boolean;
  notes?: string;
};

export type SupplierRateImportRow = {
  supplierCode: string;
  rateCode: string;
  rateName: string;
  rateType: (typeof SUPPLIER_RATE_TYPES)[number];
  unitDescription?: string;
  amount: number;
  currency: string;
  validFrom: string;
  validTo: string;
  seasonCode?: string;
  seasonLabel?: string;
  minPax?: number;
  maxPax?: number;
  minNights?: number;
  commissionPercent?: number;
  includesTax?: boolean;
  taxPercent?: number;
  cancellationPolicyRef?: string;
  notes?: string;
  status: (typeof SUPPLIER_RATE_STATUSES)[number];
};

/** PG.29 — season catalogue import (idempotent on seasonCode). */
export type SupplierSeasonImportRow = {
  seasonCode: string;
  label: string;
  validFrom?: string;
  validTo?: string;
  monthFrom?: number;
  monthTo?: number;
};

export type SupplierContentBlockImportRow = {
  supplierCode: string;
  blockCode: string;
  blockType: (typeof SUPPLIER_CONTENT_BLOCK_TYPES)[number];
  title?: string;
  body: string;
  language?: string;
  assetFilename?: string;
  assetAltText?: string;
  tags?: string[];
  isDefault?: boolean;
  status: (typeof SUPPLIER_CONTENT_BLOCK_STATUSES)[number];
};

export function supplierImportHeaders(entityType: SupplierImportEntityType): string[] {
  switch (entityType) {
    case "supplier":
      return [
        "supplierCode",
        "legalName",
        "tradingName",
        "category",
        "subcategory",
        "country",
        "region",
        "city",
        "address",
        "latitude",
        "longitude",
        "telephone",
        "email",
        "website",
        "status",
        "preferredPartner",
        "paymentTermsDays",
        "defaultCurrency",
        "taxRegistrationNumber",
        "contractRef",
        "contractValidFrom",
        "contractValidTo",
        "maintainedByEmail",
        "notes",
        "sourceRecordId",
        "classification",
      ];
    case "supplier_contact":
      return [
        "supplierCode",
        "contactRole",
        "givenName",
        "familyName",
        "email",
        "telephone",
        "whatsapp",
        "isPrimary",
        "notes",
      ];
    case "supplier_rate":
      return [
        "supplierCode",
        "rateCode",
        "rateName",
        "rateType",
        "unitDescription",
        "amount",
        "currency",
        "validFrom",
        "validTo",
        "seasonCode",
        "seasonLabel",
        "minPax",
        "maxPax",
        "minNights",
        "commissionPercent",
        "includesTax",
        "taxPercent",
        "cancellationPolicyRef",
        "notes",
        "status",
      ];
    case "supplier_content_block":
      return [
        "supplierCode",
        "blockCode",
        "blockType",
        "title",
        "body",
        "language",
        "assetFilename",
        "assetAltText",
        "tags",
        "isDefault",
        "status",
      ];
    case "supplier_season":
      return ["seasonCode", "label", "validFrom", "validTo", "monthFrom", "monthTo"];
  }
}

export function isAllowedSupplierImportHeader(
  entityType: SupplierImportEntityType,
  header: string,
): boolean {
  return supplierImportHeaders(entityType).includes(header);
}

export function validateSupplierImportRow(row: ParsedCsvRow): SupplierImportRow | { errors: string[] } {
  const errors: string[] = [];

  const supplierCodeRaw = row.supplierCode?.trim();
  if (!supplierCodeRaw) errors.push("supplierCode_required");
  else if (!SUPPLIER_CODE_PATTERN.test(normalizeSupplierCode(supplierCodeRaw))) {
    errors.push("invalid_supplierCode");
  }

  const legalName = row.legalName?.trim();
  if (!legalName || legalName.length < 2) errors.push("legalName_required");

  const categoryResult = parseRequiredEnum(row.category, SUPPLIER_CATEGORIES, "category");
  if (typeof categoryResult === "object") errors.push(categoryResult.error);

  const country = row.country?.trim().toUpperCase();
  if (!country) errors.push("country_required");
  else if (!ISO_COUNTRY_PATTERN.test(country)) errors.push("invalid_country");

  const statusResult = parseRequiredEnum(row.status, SUPPLIER_STATUSES, "status");
  if (typeof statusResult === "object") errors.push(statusResult.error);

  if (row.defaultCurrency?.trim() && !ISO_CURRENCY_PATTERN.test(row.defaultCurrency.trim().toUpperCase())) {
    errors.push("invalid_defaultCurrency");
  }

  if (row.contractValidFrom?.trim() && !ISO_DATE_PATTERN.test(row.contractValidFrom.trim())) {
    errors.push("invalid_contractValidFrom");
  }
  if (row.contractValidTo?.trim() && !ISO_DATE_PATTERN.test(row.contractValidTo.trim())) {
    errors.push("invalid_contractValidTo");
  }

  const paymentTerms = parseOptionalInt(row.paymentTermsDays);
  if (typeof paymentTerms === "object") errors.push(paymentTerms.error);

  const latitude = parseOptionalDecimal(row.latitude);
  if (typeof latitude === "object") errors.push(latitude.error);
  const longitude = parseOptionalDecimal(row.longitude);
  if (typeof longitude === "object") errors.push(longitude.error);

  if (errors.length > 0) return { errors };

  const classification = parseImportClassification(row.classification, "Confidential");
  if (typeof classification === "object") return { errors: [classification.error] };

  return {
    supplierCode: normalizeSupplierCode(supplierCodeRaw!),
    legalName: legalName!,
    category: categoryResult as SupplierCategory,
    country: country!,
    status: statusResult as (typeof SUPPLIER_STATUSES)[number],
    classification,
    ...(row.tradingName?.trim() ? { tradingName: row.tradingName.trim() } : {}),
    ...(row.subcategory?.trim() ? { subcategory: row.subcategory.trim() } : {}),
    ...(row.region?.trim() ? { region: row.region.trim() } : {}),
    ...(row.city?.trim() ? { city: row.city.trim() } : {}),
    ...(row.address?.trim() ? { address: row.address.trim() } : {}),
    ...(typeof latitude === "number" ? { latitude } : {}),
    ...(typeof longitude === "number" ? { longitude } : {}),
    ...(row.telephone?.trim() ? { telephone: row.telephone.trim() } : {}),
    ...(row.email?.trim() ? { email: row.email.trim().toLowerCase() } : {}),
    ...(row.website?.trim() ? { website: row.website.trim() } : {}),
    ...(parseOptionalBoolean(row.preferredPartner) !== undefined
      ? { preferredPartner: parseOptionalBoolean(row.preferredPartner) }
      : {}),
    ...(typeof paymentTerms === "number" ? { paymentTermsDays: paymentTerms } : {}),
    ...(row.defaultCurrency?.trim()
      ? { defaultCurrency: row.defaultCurrency.trim().toUpperCase() }
      : {}),
    ...(row.taxRegistrationNumber?.trim()
      ? { taxRegistrationNumber: row.taxRegistrationNumber.trim() }
      : {}),
    ...(row.contractRef?.trim() ? { contractRef: row.contractRef.trim() } : {}),
    ...(row.contractValidFrom?.trim() ? { contractValidFrom: row.contractValidFrom.trim() } : {}),
    ...(row.contractValidTo?.trim() ? { contractValidTo: row.contractValidTo.trim() } : {}),
    ...(row.maintainedByEmail?.trim()
      ? { maintainedByEmail: row.maintainedByEmail.trim().toLowerCase() }
      : {}),
    ...(row.notes?.trim() ? { notes: row.notes.trim() } : {}),
    ...(row.sourceRecordId?.trim() ? { sourceRecordId: row.sourceRecordId.trim() } : {}),
  };
}

export function validateSupplierContactImportRow(
  row: ParsedCsvRow,
): SupplierContactImportRow | { errors: string[] } {
  const errors: string[] = [];

  const supplierCodeRaw = row.supplierCode?.trim();
  if (!supplierCodeRaw) errors.push("supplierCode_required");
  else if (!SUPPLIER_CODE_PATTERN.test(normalizeSupplierCode(supplierCodeRaw))) {
    errors.push("invalid_supplierCode");
  }

  const roleResult = parseRequiredEnum(row.contactRole, SUPPLIER_CONTACT_ROLES, "contactRole");
  if (typeof roleResult === "object") errors.push(roleResult.error);

  const givenName = row.givenName?.trim();
  if (!givenName) errors.push("givenName_required");
  const familyName = row.familyName?.trim();
  if (!familyName) errors.push("familyName_required");

  if (errors.length > 0) return { errors };

  return {
    supplierCode: normalizeSupplierCode(supplierCodeRaw!),
    contactRole: roleResult as (typeof SUPPLIER_CONTACT_ROLES)[number],
    givenName: givenName!,
    familyName: familyName!,
    ...(row.email?.trim() ? { email: row.email.trim().toLowerCase() } : {}),
    ...(row.telephone?.trim() ? { telephone: row.telephone.trim() } : {}),
    ...(row.whatsapp?.trim() ? { whatsapp: row.whatsapp.trim() } : {}),
    ...(parseOptionalBoolean(row.isPrimary) !== undefined
      ? { isPrimary: parseOptionalBoolean(row.isPrimary) }
      : {}),
    ...(row.notes?.trim() ? { notes: row.notes.trim() } : {}),
  };
}

export function validateSupplierRateImportRow(row: ParsedCsvRow): SupplierRateImportRow | { errors: string[] } {
  const errors: string[] = [];

  const supplierCodeRaw = row.supplierCode?.trim();
  if (!supplierCodeRaw) errors.push("supplierCode_required");
  else if (!SUPPLIER_CODE_PATTERN.test(normalizeSupplierCode(supplierCodeRaw))) {
    errors.push("invalid_supplierCode");
  }

  const rateCodeRaw = row.rateCode?.trim();
  if (!rateCodeRaw) errors.push("rateCode_required");
  else if (!SUPPLIER_CODE_PATTERN.test(normalizeSupplierCode(rateCodeRaw))) errors.push("invalid_rateCode");

  const rateName = row.rateName?.trim();
  if (!rateName) errors.push("rateName_required");

  const rateTypeResult = parseRequiredEnum(row.rateType, SUPPLIER_RATE_TYPES, "rateType");
  if (typeof rateTypeResult === "object") errors.push(rateTypeResult.error);

  const amountRaw = row.amount?.trim();
  if (!amountRaw) errors.push("amount_required");
  else if (Number.isNaN(Number.parseFloat(amountRaw)) || Number.parseFloat(amountRaw) < 0) {
    errors.push("invalid_amount");
  }

  const currency = row.currency?.trim().toUpperCase();
  if (!currency) errors.push("currency_required");
  else if (!ISO_CURRENCY_PATTERN.test(currency)) errors.push("invalid_currency");

  const validFrom = row.validFrom?.trim();
  const validTo = row.validTo?.trim();
  if (!validFrom || !ISO_DATE_PATTERN.test(validFrom)) errors.push("invalid_validFrom");
  if (!validTo || !ISO_DATE_PATTERN.test(validTo)) errors.push("invalid_validTo");
  if (validFrom && validTo && validTo < validFrom) errors.push("validTo_before_validFrom");

  const statusResult = parseRequiredEnum(row.status, SUPPLIER_RATE_STATUSES, "status");
  if (typeof statusResult === "object") errors.push(statusResult.error);

  const seasonCodeRaw = row.seasonCode?.trim();
  if (seasonCodeRaw && !SUPPLIER_CODE_PATTERN.test(normalizeSupplierCode(seasonCodeRaw))) {
    errors.push("invalid_seasonCode");
  }

  if (errors.length > 0) return { errors };

  return {
    supplierCode: normalizeSupplierCode(supplierCodeRaw!),
    rateCode: normalizeSupplierCode(rateCodeRaw!),
    rateName: rateName!,
    rateType: rateTypeResult as (typeof SUPPLIER_RATE_TYPES)[number],
    amount: Number.parseFloat(amountRaw!),
    currency: currency!,
    validFrom: validFrom!,
    validTo: validTo!,
    status: statusResult as (typeof SUPPLIER_RATE_STATUSES)[number],
    ...(row.unitDescription?.trim() ? { unitDescription: row.unitDescription.trim() } : {}),
    ...(seasonCodeRaw ? { seasonCode: normalizeSupplierCode(seasonCodeRaw) } : {}),
    ...(row.seasonLabel?.trim() ? { seasonLabel: row.seasonLabel.trim() } : {}),
    ...(row.cancellationPolicyRef?.trim()
      ? { cancellationPolicyRef: row.cancellationPolicyRef.trim() }
      : {}),
    ...(row.notes?.trim() ? { notes: row.notes.trim() } : {}),
    ...(parseOptionalBoolean(row.includesTax) !== undefined
      ? { includesTax: parseOptionalBoolean(row.includesTax) }
      : {}),
  };
}

export function validateSupplierContentBlockImportRow(
  row: ParsedCsvRow,
): SupplierContentBlockImportRow | { errors: string[] } {
  const errors: string[] = [];

  const supplierCodeRaw = row.supplierCode?.trim();
  if (!supplierCodeRaw) errors.push("supplierCode_required");
  else if (!SUPPLIER_CODE_PATTERN.test(normalizeSupplierCode(supplierCodeRaw))) {
    errors.push("invalid_supplierCode");
  }

  const blockCodeRaw = row.blockCode?.trim();
  if (!blockCodeRaw) errors.push("blockCode_required");
  else if (!SUPPLIER_CODE_PATTERN.test(normalizeSupplierCode(blockCodeRaw))) errors.push("invalid_blockCode");

  const blockTypeResult = parseRequiredEnum(row.blockType, SUPPLIER_CONTENT_BLOCK_TYPES, "blockType");
  if (typeof blockTypeResult === "object") errors.push(blockTypeResult.error);

  const body = row.body?.trim();
  if (!body) errors.push("body_required");

  const statusResult = parseRequiredEnum(row.status, SUPPLIER_CONTENT_BLOCK_STATUSES, "status");
  if (typeof statusResult === "object") errors.push(statusResult.error);

  if (errors.length > 0) return { errors };

  const tags = row.tags?.trim()
    ? row.tags.split("|").map((t) => t.trim()).filter(Boolean)
    : undefined;

  return {
    supplierCode: normalizeSupplierCode(supplierCodeRaw!),
    blockCode: normalizeSupplierCode(blockCodeRaw!),
    blockType: blockTypeResult as (typeof SUPPLIER_CONTENT_BLOCK_TYPES)[number],
    body: body!,
    status: statusResult as (typeof SUPPLIER_CONTENT_BLOCK_STATUSES)[number],
    ...(row.title?.trim() ? { title: row.title.trim() } : {}),
    ...(row.language?.trim() ? { language: row.language.trim().toLowerCase() } : {}),
    ...(row.assetFilename?.trim() ? { assetFilename: row.assetFilename.trim() } : {}),
    ...(row.assetAltText?.trim() ? { assetAltText: row.assetAltText.trim() } : {}),
    ...(tags && tags.length > 0 ? { tags } : {}),
    ...(parseOptionalBoolean(row.isDefault) !== undefined
      ? { isDefault: parseOptionalBoolean(row.isDefault) }
      : {}),
  };
}

export function validateSupplierSeasonImportRow(row: ParsedCsvRow): SupplierSeasonImportRow | { errors: string[] } {
  const errors: string[] = [];

  const seasonCodeRaw = row.seasonCode?.trim();
  if (!seasonCodeRaw) errors.push("seasonCode_required");
  else if (!SUPPLIER_CODE_PATTERN.test(normalizeSupplierCode(seasonCodeRaw))) {
    errors.push("invalid_seasonCode");
  }

  const label = row.label?.trim();
  if (!label) errors.push("label_required");

  const validFrom = row.validFrom?.trim();
  const validTo = row.validTo?.trim();
  if (validFrom && !ISO_DATE_PATTERN.test(validFrom)) errors.push("invalid_validFrom");
  if (validTo && !ISO_DATE_PATTERN.test(validTo)) errors.push("invalid_validTo");
  if (validFrom && validTo && validTo < validFrom) errors.push("validTo_before_validFrom");

  const monthFromResult = parseOptionalInt(row.monthFrom);
  if (monthFromResult && typeof monthFromResult === "object") errors.push("invalid_monthFrom");
  else if (typeof monthFromResult === "number" && (monthFromResult < 1 || monthFromResult > 12)) {
    errors.push("invalid_monthFrom");
  }

  const monthToResult = parseOptionalInt(row.monthTo);
  if (monthToResult && typeof monthToResult === "object") errors.push("invalid_monthTo");
  else if (typeof monthToResult === "number" && (monthToResult < 1 || monthToResult > 12)) {
    errors.push("invalid_monthTo");
  }

  if (errors.length > 0) return { errors };

  return {
    seasonCode: normalizeSupplierCode(seasonCodeRaw!),
    label: label!,
    ...(validFrom ? { validFrom } : {}),
    ...(validTo ? { validTo } : {}),
    ...(typeof monthFromResult === "number" ? { monthFrom: monthFromResult } : {}),
    ...(typeof monthToResult === "number" ? { monthTo: monthToResult } : {}),
  };
}

export function supplierImportRowDuplicateKey(
  entityType: SupplierImportEntityType,
  row:
    | SupplierImportRow
    | SupplierContactImportRow
    | SupplierRateImportRow
    | SupplierContentBlockImportRow
    | SupplierSeasonImportRow,
): string {
  switch (entityType) {
    case "supplier":
      return (row as SupplierImportRow).supplierCode;
    case "supplier_contact":
      return `${(row as SupplierContactImportRow).supplierCode}|${(row as SupplierContactImportRow).contactRole}|${(row as SupplierContactImportRow).givenName}|${(row as SupplierContactImportRow).familyName}`;
    case "supplier_rate":
      return `${(row as SupplierRateImportRow).supplierCode}|${(row as SupplierRateImportRow).rateCode}`;
    case "supplier_content_block":
      return `${(row as SupplierContentBlockImportRow).supplierCode}|${(row as SupplierContentBlockImportRow).blockCode}`;
    case "supplier_season":
      return (row as SupplierSeasonImportRow).seasonCode;
  }
}

export function validateSupplierImportRowByEntityType(
  entityType: SupplierImportEntityType,
  row: ParsedCsvRow,
):
  | SupplierImportRow
  | SupplierContactImportRow
  | SupplierRateImportRow
  | SupplierContentBlockImportRow
  | SupplierSeasonImportRow
  | { errors: string[] } {
  switch (entityType) {
    case "supplier":
      return validateSupplierImportRow(row);
    case "supplier_contact":
      return validateSupplierContactImportRow(row);
    case "supplier_rate":
      return validateSupplierRateImportRow(row);
    case "supplier_content_block":
      return validateSupplierContentBlockImportRow(row);
    case "supplier_season":
      return validateSupplierSeasonImportRow(row);
  }
}

export function requiredSupplierImportHeaders(entityType: SupplierImportEntityType): string[] {
  switch (entityType) {
    case "supplier":
      return ["supplierCode", "legalName", "category", "country", "status"];
    case "supplier_contact":
      return ["supplierCode", "contactRole", "givenName", "familyName"];
    case "supplier_rate":
      return [
        "supplierCode",
        "rateCode",
        "rateName",
        "rateType",
        "amount",
        "currency",
        "validFrom",
        "validTo",
        "status",
      ];
    case "supplier_content_block":
      return ["supplierCode", "blockCode", "blockType", "body", "status"];
    case "supplier_season":
      return ["seasonCode", "label"];
  }
}
