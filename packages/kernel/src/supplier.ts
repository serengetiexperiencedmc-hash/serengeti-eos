import type { Classification } from "./types.js";
import type { SupplierCategory, SupplierImportEntityType } from "./supplier-import.js";

export type SupImportRowResult = {
  rowNumber: number;
  status: "valid" | "invalid" | "committed" | "skipped";
  errors?: string[];
  entityId?: string;
  warnings?: string[];
};

export type SupImportBatch = {
  id: string;
  tenantId: string;
  sourceSystem: string;
  entityType: SupplierImportEntityType;
  mode: "create_only" | "upsert";
  status: "pending" | "validated" | "committed" | "failed";
  rowCount: number;
  validCount?: number;
  invalidCount?: number;
  committedCount?: number;
  csvContent: string;
  validationResults?: SupImportRowResult[];
  executeIdempotencyKey?: string;
  createdAt: string;
  validatedAt?: string;
  committedAt?: string;
  createdByPrincipalId: string;
  committedByPrincipalId?: string;
};

export type SupSupplierStatus = "draft" | "pending_review" | "active" | "inactive" | "suspended";

export type SupSupplier = {
  id: string;
  tenantId: string;
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
  status: SupSupplierStatus;
  preferredPartner: boolean;
  paymentTermsDays?: number;
  defaultCurrency?: string;
  taxRegistrationNumber?: string;
  contractRef?: string;
  contractValidFrom?: string;
  contractValidTo?: string;
  notes?: string;
  dataQualityStatus: "Unverified" | "PartiallyVerified" | "Verified" | "NeedsReview" | "Archived";
  classification: Classification;
  sourceSystem?: string;
  sourceRecordId?: string;
  importBatchId?: string;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type SupContact = {
  id: string;
  tenantId: string;
  supplierId: string;
  contactRole: string;
  givenName: string;
  familyName: string;
  email?: string;
  telephone?: string;
  whatsapp?: string;
  isPrimary: boolean;
  notes?: string;
  importBatchId?: string;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type SupRate = {
  id: string;
  tenantId: string;
  supplierId: string;
  rateCode: string;
  rateName: string;
  rateType: string;
  unitDescription?: string;
  amount: number;
  currency: string;
  validFrom: string;
  validTo: string;
  seasonLabel?: string;
  minPax?: number;
  maxPax?: number;
  minNights?: number;
  commissionPercent?: number;
  includesTax: boolean;
  taxPercent?: number;
  cancellationPolicyRef?: string;
  notes?: string;
  status: string;
  importBatchId?: string;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type SupContentBlock = {
  id: string;
  tenantId: string;
  supplierId: string;
  blockCode: string;
  blockType: string;
  title?: string;
  body: string;
  language: string;
  assetFilename?: string;
  assetAltText?: string;
  tags?: string[];
  isDefault: boolean;
  status: string;
  importBatchId?: string;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export const SUPPLIER_EVENT_TYPES = {
  IMPORT_CREATED: "supplier.import.created.v1",
  IMPORT_VALIDATED: "supplier.import.validated.v1",
  IMPORT_COMMITTED: "supplier.import.committed.v1",
  IMPORT_FAILED: "supplier.import.failed.v1",
  SUPPLIER_CREATED: "supplier.supplier.created.v1",
  SUPPLIER_UPDATED: "supplier.supplier.updated.v1",
  CONTACT_CREATED: "supplier.contact.created.v1",
  CONTACT_UPDATED: "supplier.contact.updated.v1",
  CONTACT_ARCHIVED: "supplier.contact.archived.v1",
  RATE_CREATED: "supplier.rate.created.v1",
  RATE_UPDATED: "supplier.rate.updated.v1",
  RATE_ARCHIVED: "supplier.rate.archived.v1",
  CONTENT_BLOCK_CREATED: "supplier.content_block.created.v1",
  CONTENT_BLOCK_UPDATED: "supplier.content_block.updated.v1",
  CONTENT_BLOCK_ARCHIVED: "supplier.content_block.archived.v1",
} as const;
