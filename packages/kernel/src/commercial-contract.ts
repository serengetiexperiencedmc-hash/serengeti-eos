/**
 * F2-I1 additive commercial-domain contract (GPTA-H-44 / H-45 / H-46).
 *
 * Catalogues and validators only. No persistence, schema, UI, FX, ingest,
 * DR-008 engine, or numerical CPR thresholds.
 *
 * Existing persisted types (`OppOpportunity`, `RfpRecord`, `CrmAccount`,
 * `ComApprovalRequest`, `SupRate`) are intentionally unchanged so mixed
 * Class A/B callers are not forced to serialize new fields.
 */

/** Maximum optional secondary SOURCE values (H-27). Exactly one primary is required. */
export const MAX_SECONDARY_COMMERCIAL_SOURCES = 2;

// ---------------------------------------------------------------------------
// OR-03 — account / buyer type (distinct from market)
// ---------------------------------------------------------------------------

export const COMMERCIAL_ACCOUNT_TYPE_KEYS = [
  "incentive_house_agency",
  "event_agency",
  "pco",
  "corporate_end_client",
  "corporate_travel_tmc",
  "travel_agency_advisor",
  "tour_operator_wholesale",
  "destination_event_specialist",
  "association_non_profit",
  "government_public_sector",
  "other_strategic_partner",
] as const;

export type CommercialAccountType = (typeof COMMERCIAL_ACCOUNT_TYPE_KEYS)[number];

export const PCO_ACCOUNT_TYPE = "pco" as const satisfies CommercialAccountType;

export const COMMERCIAL_ACCOUNT_TYPE_LABELS: Record<CommercialAccountType, string> = {
  incentive_house_agency: "Incentive House / Incentive Agency",
  event_agency: "Event Agency",
  pco: "PCO",
  corporate_end_client: "Corporate / End Client",
  corporate_travel_tmc: "Corporate Travel Company / TMC",
  travel_agency_advisor: "Travel Agency / Travel Advisor",
  tour_operator_wholesale: "Tour Operator / Wholesale Partner",
  destination_event_specialist: "Destination / Event Specialist",
  association_non_profit: "Association / Non-Profit",
  government_public_sector: "Government / Public Sector",
  other_strategic_partner: "Other Strategic Partner",
};

export function isCommercialAccountType(value: string): value is CommercialAccountType {
  return (COMMERCIAL_ACCOUNT_TYPE_KEYS as readonly string[]).includes(value);
}

export function isPcoAccountType(value: string): boolean {
  return value === PCO_ACCOUNT_TYPE;
}

// ---------------------------------------------------------------------------
// OR-03-M — market / geographic origin (distinct from account type)
// ---------------------------------------------------------------------------

export const COMMERCIAL_MARKET_KEYS = [
  "south_africa",
  "united_kingdom",
  "germany",
  "france",
  "switzerland",
  "netherlands",
  "italy",
  "spain",
  "rest_of_europe",
  "united_states",
  "canada",
  "middle_east",
  "latin_america",
  "asia_pacific",
  "other",
] as const;

export type CommercialMarket = (typeof COMMERCIAL_MARKET_KEYS)[number];

export const COMMERCIAL_MARKET_LABELS: Record<CommercialMarket, string> = {
  south_africa: "South Africa",
  united_kingdom: "United Kingdom",
  germany: "Germany",
  france: "France",
  switzerland: "Switzerland",
  netherlands: "Netherlands",
  italy: "Italy",
  spain: "Spain",
  rest_of_europe: "Rest of Europe",
  united_states: "United States",
  canada: "Canada",
  middle_east: "Middle East",
  latin_america: "Latin America",
  asia_pacific: "Asia-Pacific",
  other: "Other",
};

export function isCommercialMarket(value: string): value is CommercialMarket {
  return (COMMERCIAL_MARKET_KEYS as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// OR-01 — qualification (independent of workflow stage)
// ---------------------------------------------------------------------------

export const QUALIFICATION_STATUSES = ["not_yet_assessed", "qualified", "not_qualified"] as const;

export type QualificationStatus = (typeof QUALIFICATION_STATUSES)[number];

export const QUALIFICATION_STATUS_LABELS: Record<QualificationStatus, string> = {
  not_yet_assessed: "Not yet assessed",
  qualified: "Qualified",
  not_qualified: "Not qualified",
};

export function isQualificationStatus(value: string): value is QualificationStatus {
  return (QUALIFICATION_STATUSES as readonly string[]).includes(value);
}

export function isOr01Qualified(status: QualificationStatus): boolean {
  return status === "qualified";
}

/** Workflow stage `new_qualified` is not an OR-01 qualification value. */
export const OPPORTUNITY_STAGE_NEW_QUALIFIED = "new_qualified";

export const QUALIFICATION_CONDITION_KEYS = [
  "buyer_account_fit",
  "genuine_requirement",
  "destination_service_fit",
  "approximate_dates_decision_window",
  "sufficient_scope",
  "approximate_group_size_profile",
  "buying_process_known_active",
  "commercial_viability_credible",
  "defined_next_action",
] as const;

export type QualificationConditionKey = (typeof QUALIFICATION_CONDITION_KEYS)[number];

export const QUALIFICATION_CONDITION_LABELS: Record<QualificationConditionKey, string> = {
  buyer_account_fit: "Buyer/account fit",
  genuine_requirement: "Genuine requirement",
  destination_service_fit: "Destination/service fit",
  approximate_dates_decision_window: "Approximate dates or credible decision window",
  sufficient_scope: "Sufficient programme scope",
  approximate_group_size_profile: "Approximate group size or participant profile",
  buying_process_known_active: "Buying process known or actively being established",
  commercial_viability_credible: "Commercial viability credible",
  defined_next_action: "Defined next action",
};

export function isQualificationConditionKey(value: string): value is QualificationConditionKey {
  return (QUALIFICATION_CONDITION_KEYS as readonly string[]).includes(value);
}

export type QualificationDecision = {
  status: QualificationStatus;
  decidedAt?: string;
  decidedByPrincipalId?: string;
  conditions: Record<QualificationConditionKey, boolean>;
  evidenceRefs?: readonly string[];
};

export function emptyQualificationConditions(): Record<QualificationConditionKey, boolean> {
  return {
    buyer_account_fit: false,
    genuine_requirement: false,
    destination_service_fit: false,
    approximate_dates_decision_window: false,
    sufficient_scope: false,
    approximate_group_size_profile: false,
    buying_process_known_active: false,
    commercial_viability_credible: false,
    defined_next_action: false,
  };
}

export function allMandatoryQualificationConditionsMet(
  conditions: Record<QualificationConditionKey, boolean>,
): boolean {
  return QUALIFICATION_CONDITION_KEYS.every((key) => conditions[key] === true);
}

// ---------------------------------------------------------------------------
// OR-02 — loss catalogue
// ---------------------------------------------------------------------------

export const LOSS_REASON_CODES = [
  "LR-01",
  "LR-02",
  "LR-03",
  "LR-04",
  "LR-05",
  "LR-06",
  "LR-07",
  "LR-08",
  "LR-09",
  "LR-10",
  "LR-11",
  "LR-12",
] as const;

export type LossReasonCode = (typeof LOSS_REASON_CODES)[number];

export const LOSS_REASON_LABELS: Record<LossReasonCode, string> = {
  "LR-01": "Price / Budget",
  "LR-02": "Competitor Selected",
  "LR-03": "Dates / Availability / Capacity",
  "LR-04": "Client Cancelled / Event Cancelled",
  "LR-05": "No Decision / Buyer Did Not Proceed",
  "LR-06": "Timing / Deferred",
  "LR-07": "Programme / Scope / Destination Fit",
  "LR-08": "Commercial Terms / Contract Conditions",
  "LR-09": "Supplier / Operational Confidence",
  "LR-10": "Relationship / Incumbent Supplier",
  "LR-11": "SEDMC Response / Process Issue",
  "LR-12": "Other",
};

export function isLossReasonCode(value: string): value is LossReasonCode {
  return (LOSS_REASON_CODES as readonly string[]).includes(value);
}

export type ClosedLostReasons = {
  primary: LossReasonCode;
  contributing?: readonly LossReasonCode[];
  otherExplanation?: string;
};

export function validateClosedLostReasons(
  input: ClosedLostReasons,
): { ok: true } | { ok: false; reason: string } {
  if (!isLossReasonCode(input.primary)) {
    return { ok: false, reason: "invalid_primary_loss_reason" };
  }
  const contributing = input.contributing ?? [];
  for (const code of contributing) {
    if (!isLossReasonCode(code)) {
      return { ok: false, reason: "invalid_contributing_loss_reason" };
    }
    if (code === input.primary) {
      return { ok: false, reason: "contributing_duplicates_primary" };
    }
  }
  const usesOther = input.primary === "LR-12" || contributing.includes("LR-12");
  if (usesOther && !input.otherExplanation?.trim()) {
    return { ok: false, reason: "lr12_explanation_required" };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// OR-07 — SOURCE (origin) ≠ CHANNEL (intake path)
// ---------------------------------------------------------------------------

export const COMMERCIAL_SOURCE_KEYS = [
  "existing_client_repeat",
  "existing_partner_agency",
  "referral",
  "trade_show_industry_event",
  "sales_prospecting",
  "website_organic",
  "linkedin",
  "google_ads_paid_search",
  "other_digital",
  "consortium_industry_network",
  "corporate_direct",
  "other",
] as const;

export type CommercialSource = (typeof COMMERCIAL_SOURCE_KEYS)[number];

export const COMMERCIAL_SOURCE_LABELS: Record<CommercialSource, string> = {
  existing_client_repeat: "Existing Client / Repeat Business",
  existing_partner_agency: "Existing Partner / Agency Relationship",
  referral: "Referral",
  trade_show_industry_event: "Trade Show / Industry Event",
  sales_prospecting: "Sales Prospecting",
  website_organic: "Website / Organic",
  linkedin: "LinkedIn",
  google_ads_paid_search: "Google Ads / Paid Search",
  other_digital: "Other Digital Marketing",
  consortium_industry_network: "Consortium / Industry Network",
  corporate_direct: "Corporate Direct",
  other: "Other",
};

export const COMMERCIAL_CHANNEL_KEYS = [
  "email",
  "website_web_form",
  "linkedin",
  "phone",
  "whatsapp",
  "trade_show_in_person",
  "referral_introduction",
  "partner_introduction",
  "other",
] as const;

export type CommercialChannel = (typeof COMMERCIAL_CHANNEL_KEYS)[number];

export const COMMERCIAL_CHANNEL_LABELS: Record<CommercialChannel, string> = {
  email: "Email",
  website_web_form: "Website / Web Form",
  linkedin: "LinkedIn",
  phone: "Phone",
  whatsapp: "WhatsApp",
  trade_show_in_person: "Trade Show / In-person",
  referral_introduction: "Referral Introduction",
  partner_introduction: "Partner Introduction",
  other: "Other",
};

export function isCommercialSource(value: string): value is CommercialSource {
  return (COMMERCIAL_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isCommercialChannel(value: string): value is CommercialChannel {
  return (COMMERCIAL_CHANNEL_KEYS as readonly string[]).includes(value);
}

export type CommercialSourceChannelSet = {
  primarySource: CommercialSource;
  secondarySources?: readonly CommercialSource[];
  channel: CommercialChannel;
};

export function validateSourceChannelSet(
  input: CommercialSourceChannelSet,
): { ok: true } | { ok: false; reason: string } {
  if (!isCommercialSource(input.primarySource)) {
    return { ok: false, reason: "invalid_primary_source" };
  }
  if (!isCommercialChannel(input.channel)) {
    return { ok: false, reason: "invalid_channel" };
  }
  const secondaries = input.secondarySources ?? [];
  if (secondaries.length > MAX_SECONDARY_COMMERCIAL_SOURCES) {
    return { ok: false, reason: "too_many_secondary_sources" };
  }
  for (const source of secondaries) {
    if (!isCommercialSource(source)) {
      return { ok: false, reason: "invalid_secondary_source" };
    }
    if (source === input.primarySource) {
      return { ok: false, reason: "secondary_duplicates_primary" };
    }
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// C3 clarification stamps (F1; no persistence in I1)
// ---------------------------------------------------------------------------

export const RFP_CLARIFICATION_STATUSES = [
  "not_started",
  "started",
  "completed",
  "not_applicable",
] as const;

export type RfpClarificationStatus = (typeof RFP_CLARIFICATION_STATUSES)[number];

export function isRfpClarificationStatus(value: string): value is RfpClarificationStatus {
  return (RFP_CLARIFICATION_STATUSES as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// OR-04-FU / OR-05 — ownership and send authority (type-level)
// ---------------------------------------------------------------------------

export function defaultFollowUpOwnerPrincipalId(opportunityOwnerPrincipalId: string): string {
  return opportunityOwnerPrincipalId;
}

export function canSendProposalAsOwner(input: {
  senderPrincipalId: string;
  opportunityOwnerPrincipalId: string;
  exceptionalApprovalRequired: boolean;
  exceptionalApprovalGranted: boolean;
}): boolean {
  if (input.senderPrincipalId !== input.opportunityOwnerPrincipalId) return false;
  if (input.exceptionalApprovalRequired && !input.exceptionalApprovalGranted) return false;
  return true;
}

// ---------------------------------------------------------------------------
// OR-06 Path B — qualitative exceptional approval (no numerical CPR)
// ---------------------------------------------------------------------------

export const PATH_B_EXCEPTIONAL_APPROVAL_CATEGORIES = [
  "exceptional_discounting",
  "margin_below_approved_floor",
  "unusual_payment_credit",
  "non_standard_cancellation_liability",
  "significant_contractual_commitments",
  "strategic_high_risk_accounts",
  "unusually_large_complex_programmes",
  "deviation_from_supplier_commercial_policy",
] as const;

export type PathBExceptionalApprovalCategory = (typeof PATH_B_EXCEPTIONAL_APPROVAL_CATEGORIES)[number];

export const PATH_B_EXCEPTIONAL_APPROVAL_LABELS: Record<PathBExceptionalApprovalCategory, string> = {
  exceptional_discounting: "Exceptional discounting",
  margin_below_approved_floor: "Margin below approved floor",
  unusual_payment_credit: "Unusual payment/credit terms",
  non_standard_cancellation_liability: "Non-standard cancellation/liability terms",
  significant_contractual_commitments: "Significant contractual commitments",
  strategic_high_risk_accounts: "Strategic/high-risk accounts",
  unusually_large_complex_programmes: "Unusually large or complex programmes",
  deviation_from_supplier_commercial_policy: "Deviation from approved supplier/commercial policy",
};

export function isPathBExceptionalApprovalCategory(
  value: string,
): value is PathBExceptionalApprovalCategory {
  return (PATH_B_EXCEPTIONAL_APPROVAL_CATEGORIES as readonly string[]).includes(value);
}

export type PathBApprovalRequirement = {
  required: boolean;
  categories: PathBExceptionalApprovalCategory[];
};

/**
 * Path B: approval is required only when one or more qualitative categories apply.
 * No sell-price threshold, margin percentage, or CPR numeric value is consulted.
 */
export function evaluatePathBApprovalRequirement(
  categories: readonly PathBExceptionalApprovalCategory[],
): PathBApprovalRequirement {
  const unique: PathBExceptionalApprovalCategory[] = [];
  for (const category of categories) {
    if (isPathBExceptionalApprovalCategory(category) && !unique.includes(category)) {
      unique.push(category);
    }
  }
  return { required: unique.length > 0, categories: unique };
}

// ---------------------------------------------------------------------------
// OR-08 — supplier-rate identity (no FX, no persistence)
// ---------------------------------------------------------------------------

export const SUPPLIER_RATE_SOURCE_CLASSES = [
  "direct_supplier_contract",
  "supplier_contracted_rate_sheet",
  "written_supplier_quotation",
  "trade_partner_net_agreement",
  "public_benchmark",
] as const;

export type SupplierRateSourceClass = (typeof SUPPLIER_RATE_SOURCE_CLASSES)[number];

export const SUPPLIER_RATE_TYPE_KEYS = [
  "negotiated_contracted",
  "trade_net",
  "public",
  "promotional",
  "quoted_ad_hoc",
] as const;

export type SupplierRateTypeKey = (typeof SUPPLIER_RATE_TYPE_KEYS)[number];

export const SUPPLIER_RATE_TYPE_LABELS: Record<SupplierRateTypeKey, string> = {
  negotiated_contracted: "Negotiated / Contracted",
  trade_net: "Trade / Net",
  public: "Public",
  promotional: "Promotional",
  quoted_ad_hoc: "Quoted / Ad hoc",
};

export function isSupplierRateSourceClass(value: string): value is SupplierRateSourceClass {
  return (SUPPLIER_RATE_SOURCE_CLASSES as readonly string[]).includes(value);
}

export function isSupplierRateTypeKey(value: string): value is SupplierRateTypeKey {
  return (SUPPLIER_RATE_TYPE_KEYS as readonly string[]).includes(value);
}

export type SupplierRateIdentityFacts = {
  rateId: string;
  versionIdentity: number;
  snapshotIdentity?: string;
  sourceClass: SupplierRateSourceClass;
  rateType: SupplierRateTypeKey;
  originalCurrency: string;
  seasonLabel?: string;
  seasonId?: string;
  validFrom: string;
  validTo: string;
  sourceDate?: string;
  verificationDate?: string;
  expiry?: string;
};

export function isSupplierRateValidityCurrent(
  facts: Pick<SupplierRateIdentityFacts, "validFrom" | "validTo">,
  atIso: string,
): boolean {
  return atIso >= facts.validFrom && atIso <= facts.validTo;
}
