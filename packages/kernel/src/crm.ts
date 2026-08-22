import type { Classification } from "./types.js";

export type CrmOrganizationStatus =
  | "Prospect"
  | "Engaged"
  | "Qualified"
  | "Active"
  | "Dormant"
  | "Disqualified"
  | "Archived";

export type CrmDataQualityStatus =
  | "Unverified"
  | "PartiallyVerified"
  | "Verified"
  | "NeedsReview"
  | "DuplicateSuspected"
  | "Archived";

export type CrmRelationshipStatus =
  | "Unknown"
  | "Identified"
  | "Contacted"
  | "Engaged"
  | "Partner"
  | "Strategic"
  | "Dormant"
  | "Disqualified";

export type CrmContactStatus = "Active" | "Inactive" | "Archived";

export type CrmAccountStatus = "Prospect" | "Active" | "OnHold" | "Closed" | "Archived";

export type CrmTaskStatus = "Open" | "InProgress" | "Completed" | "Cancelled" | "Deferred";

export type CrmDuplicateStatus = "PotentialDuplicate" | "UnderReview" | "ConfirmedDuplicate" | "NotDuplicate";

export type CrmOrganizationType = {
  id: string;
  tenantId: string;
  key: string;
  label: string;
  active: boolean;
};

export type CrmRelationshipType = {
  id: string;
  tenantId: string;
  key: string;
  label: string;
  active: boolean;
};

export type CrmActivityType = {
  id: string;
  tenantId: string;
  key: string;
  label: string;
  active: boolean;
};

export type CrmOrganization = {
  id: string;
  tenantId: string;
  legalName: string;
  tradingName?: string;
  organizationTypeId: string;
  country?: string;
  region?: string;
  market?: string;
  website?: string;
  domain?: string;
  primaryEmail?: string;
  primaryTelephone?: string;
  address?: Record<string, unknown>;
  status: CrmOrganizationStatus;
  dataQualityStatus: CrmDataQualityStatus;
  classification: Classification;
  ownerPrincipalId?: string;
  source?: string;
  sourceSystem?: string;
  sourceRecordId?: string;
  importBatchId?: string;
  version: number;
  mergedIntoId?: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CrmOrganizationUnit = {
  id: string;
  tenantId: string;
  organizationId: string;
  parentUnitId?: string;
  name: string;
  unitType: string;
  createdAt: string;
  updatedAt: string;
};

export type CrmContact = {
  id: string;
  tenantId: string;
  givenName: string;
  familyName: string;
  preferredName?: string;
  jobTitle?: string;
  department?: string;
  email?: string;
  telephone?: string;
  mobile?: string;
  country?: string;
  timezone?: string;
  language?: string;
  status: CrmContactStatus;
  dataQualityStatus: CrmDataQualityStatus;
  classification: Classification;
  communicationPreferences?: Record<string, unknown>;
  source?: string;
  mergedIntoId?: string;
  archivedAt?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CrmRelationship = {
  id: string;
  tenantId: string;
  relationshipTypeId: string;
  status: CrmRelationshipStatus;
  fromOrganizationId?: string;
  toOrganizationId?: string;
  fromContactId?: string;
  toContactId?: string;
  organizationUnitId?: string;
  notes?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CrmAccount = {
  id: string;
  tenantId: string;
  organizationId: string;
  relationshipId?: string;
  accountName: string;
  ownerPrincipalId: string;
  market?: string;
  strategicClassification?: string;
  priority?: string;
  nextAction?: string;
  status: CrmAccountStatus;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CrmActivity = {
  id: string;
  tenantId: string;
  activityType: string;
  subject: string;
  occurredAt: string;
  organizationId?: string;
  organizationUnitId?: string;
  contactId?: string;
  relationshipId?: string;
  ownerPrincipalId: string;
  outcome?: string;
  notes?: string;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CrmNote = {
  id: string;
  tenantId: string;
  body: string;
  entityType: string;
  entityId: string;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CrmTask = {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  assigneePrincipalId: string;
  priority?: string;
  dueAt?: string;
  status: CrmTaskStatus;
  relatedOrganizationId?: string;
  relatedContactId?: string;
  relatedAccountId?: string;
  relatedActivityId?: string;
  classification: Classification;
  version: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CrmTag = {
  id: string;
  tenantId: string;
  key: string;
  label: string;
  active: boolean;
  archivedAt?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CrmEntityTag = {
  id: string;
  tenantId: string;
  tagId: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  createdByPrincipalId: string;
};

export type CrmExternalIdentifier = {
  id: string;
  tenantId: string;
  systemKey: string;
  externalId: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  createdByPrincipalId: string;
};

export type CrmDuplicateCandidate = {
  id: string;
  tenantId: string;
  entityType: "organization" | "contact";
  entityIdA: string;
  entityIdB: string;
  score: number;
  detectionRule?: string;
  matchReason?: string;
  status: CrmDuplicateStatus;
  detectedAt: string;
  reviewedAt?: string;
  reviewedByPrincipalId?: string;
  reviewReason?: string;
};

export type CrmImportRowResult = {
  rowNumber: number;
  status: "valid" | "invalid" | "committed" | "skipped";
  errors?: string[];
  entityId?: string;
  warnings?: string[];
};

export type CrmMergeRecord = {
  id: string;
  tenantId: string;
  entityType: "organization" | "contact";
  survivorId: string;
  mergedIds: string[];
  duplicateCandidateId?: string;
  fieldResolutions: Record<string, unknown>;
  reason: string;
  idempotencyKey?: string;
  affectedCounts: Record<string, number>;
  mergedAt: string;
  mergedByPrincipalId: string;
};

export type CrmImportBatch = {
  id: string;
  tenantId: string;
  sourceSystem: string;
  entityType: "organization" | "contact";
  mode: "create_only";
  status: "pending" | "validated" | "committed" | "failed";
  rowCount: number;
  validCount?: number;
  invalidCount?: number;
  committedCount?: number;
  csvContent: string;
  validationResults?: CrmImportRowResult[];
  executeIdempotencyKey?: string;
  createdAt: string;
  validatedAt?: string;
  committedAt?: string;
  createdByPrincipalId: string;
  committedByPrincipalId?: string;
};

/** Default organization type keys for Dev/Test seed — configurable per tenant. */
export const DEFAULT_CRM_ORGANIZATION_TYPE_KEYS = [
  "incentive_house",
  "corporate_travel_agency",
  "travel_advisor",
  "mice_agency",
  "corporate",
  "association",
  "dmc_partner",
  "tour_operator",
  "wholesaler",
  "consortium",
  "supplier",
  "media_partner",
  "other",
] as const;

export const DEFAULT_CRM_RELATIONSHIP_TYPE_KEYS = [
  "employee_of",
  "decision_maker_at",
  "buyer_at",
  "procurement_contact_at",
  "mice_planner_at",
  "preferred_partner_of",
  "referral_partner_of",
  "supplier_of",
  "subsidiary_of",
  "parent_organization_of",
] as const;

/** Default activity type keys from approved C1 domain model (Dev/Test seed). */
export const DEFAULT_CRM_ACTIVITY_TYPE_KEYS = [
  "email",
  "telephone",
  "meeting",
  "video_meeting",
  "message",
  "trade_show",
  "site_inspection",
  "sales_call",
  "presentation",
  "follow_up",
  "proposal_discussion",
  "other",
] as const;
