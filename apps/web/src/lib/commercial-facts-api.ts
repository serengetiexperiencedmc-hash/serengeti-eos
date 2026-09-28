import { EosApiError, eosFetch } from "./eos-client";

export type F2FactsPersistence = {
  recorded: boolean;
  mode: "f2_dp01_sidecar" | "in_memory_preview";
  mixedSqlDurable: boolean;
};

export type OpportunityCommercialFacts = {
  opportunityId: string;
  workflowStage: string;
  opportunityStatus: string;
  qualificationStatus: string;
  qualificationIsIndependentOfWorkflowStage: boolean;
  newQualifiedStageIsNotQualification: boolean;
  or01Qualified: boolean;
  qualificationConditions: Record<string, boolean>;
  qualificationEvidenceRefs: string[];
  qualificationDecidedAt?: string;
  qualificationDecidedByPrincipalId?: string;
  ownerPrincipalId: string;
  intakeOwnerPrincipalId: string;
  followUpOwnerPrincipalId: string;
  nextAction?: { description: string; dueAt?: string; ownerPrincipalId: string };
  ownershipTransfers: Array<{
    id: string;
    previousOwnerPrincipalId: string;
    newOwnerPrincipalId: string;
    transferredAt: string;
    nextAction: string;
  }>;
  closedLost?: { primary: string; contributing?: string[]; otherExplanation?: string };
  ownerExistsBeforeQualification: boolean;
  c1Account: { linked: boolean; accountId?: string; accountName?: string; accountTypeLabel?: string; marketLabel?: string };
};

export type RfpCommercialFacts = {
  rfpId: string;
  workflowStage: string;
  primarySource?: string;
  secondarySources: string[];
  channel?: string;
  clarificationStatus: string;
  clarificationEvents: Array<{
    id: string;
    eventType: string;
    eventAt: string;
    note?: string;
    provenance?: string;
  }>;
  receivedAt?: string;
  receivedAtProvenance?: string;
  receivedAtStatus?: string;
  firstResponseAt?: string;
  firstResponseAtProvenance?: string;
  firstResponseAtStatus?: string;
  sourceDistinctFromChannel: boolean;
  legacyCollapsedSource?: string;
  legacyCollapsedSourceAuthoritativeForF2: boolean;
  createdAtUsedAsReceivedAt?: boolean;
  createdAtUsedAsFirstResponse?: boolean;
  receivedAtUsedAsFirstResponse?: boolean;
};

/** Kernel OR-07 SOURCE catalogue copied for UI labels. Not a new taxonomy. */
export const COMMERCIAL_SOURCE_LABELS: Record<string, string> = {
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

/** Kernel OR-07 CHANNEL catalogue copied for UI labels. Distinct from SOURCE. */
export const COMMERCIAL_CHANNEL_LABELS: Record<string, string> = {
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

export const RFP_CLARIFICATION_STATUS_LABELS: Record<string, string> = {
  not_started: "Not started",
  started: "Started",
  completed: "Completed",
  not_applicable: "Not applicable",
};

export const RFP_CLARIFICATION_EVENT_TYPE_LABELS: Record<string, string> = {
  requested: "Requested",
  answered: "Answered",
};

const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

function isIsoTimestamp(value: string): boolean {
  if (!ISO_TIMESTAMP.test(value)) return false;
  return Number.isFinite(Date.parse(value));
}

export function isCommercialSourceKey(value: string): boolean {
  return Object.prototype.hasOwnProperty.call(COMMERCIAL_SOURCE_LABELS, value);
}

export function isCommercialChannelKey(value: string): boolean {
  return Object.prototype.hasOwnProperty.call(COMMERCIAL_CHANNEL_LABELS, value);
}

export type RfpFactsDraft = {
  primarySource: string;
  channel: string;
  receivedAt: string;
  firstResponseAt: string;
  clarificationStatus: string;
  clarificationEventType: string;
  clarificationEventAt: string;
  clarificationEventNote: string;
};

export type PutRfpFactsPayload = {
  primarySource?: string;
  channel?: string;
  receivedAt?: string;
  firstResponseAt?: string;
  clarificationStatus?: string;
  clarificationEvent?: { eventType: string; eventAt: string; note?: string };
};

export function emptyRfpFactsDraft(): RfpFactsDraft {
  return {
    primarySource: "",
    channel: "",
    receivedAt: "",
    firstResponseAt: "",
    clarificationStatus: "not_started",
    clarificationEventType: "",
    clarificationEventAt: "",
    clarificationEventNote: "",
  };
}

export function draftFromRfpFacts(facts: RfpCommercialFacts | null): RfpFactsDraft {
  const draft = emptyRfpFactsDraft();
  if (!facts) return draft;
  draft.primarySource = facts.primarySource ?? "";
  draft.channel = facts.channel ?? "";
  draft.receivedAt = facts.receivedAt ?? "";
  draft.firstResponseAt = facts.firstResponseAt ?? "";
  draft.clarificationStatus = facts.clarificationStatus || "not_started";
  return draft;
}

/**
 * Builds a partial PUT body from an RFP facts draft.
 * SOURCE and CHANNEL are never copied into each other.
 * Empty timestamp fields are omitted (never stamped with now).
 */
export function buildRfpFactsPutPayload(
  draft: RfpFactsDraft,
  current: RfpCommercialFacts | null,
): { ok: true; payload: PutRfpFactsPayload } | { ok: false; error: string } {
  const payload: PutRfpFactsPayload = {};
  const currentSource = current?.primarySource ?? "";
  const currentChannel = current?.channel ?? "";
  const sourceChanged = draft.primarySource !== currentSource;
  const channelChanged = draft.channel !== currentChannel;

  if (sourceChanged || channelChanged) {
    if (!draft.primarySource || !draft.channel) {
      return { ok: false, error: "primary_source_and_channel_required" };
    }
    if (!isCommercialSourceKey(draft.primarySource)) {
      return { ok: false, error: "invalid_primary_source" };
    }
    if (!isCommercialChannelKey(draft.channel)) {
      return { ok: false, error: "invalid_channel" };
    }
    payload.primarySource = draft.primarySource;
    payload.channel = draft.channel;
  }

  const receivedAt = draft.receivedAt.trim();
  if (receivedAt) {
    if (!isIsoTimestamp(receivedAt)) return { ok: false, error: "invalid_receivedAt" };
    if (current?.receivedAt) {
      if (receivedAt !== current.receivedAt) return { ok: false, error: "receivedAt_already_observed" };
    } else {
      payload.receivedAt = receivedAt;
    }
  }

  const firstResponseAt = draft.firstResponseAt.trim();
  if (firstResponseAt) {
    if (!isIsoTimestamp(firstResponseAt)) return { ok: false, error: "invalid_firstResponseAt" };
    if (current?.firstResponseAt) {
      if (firstResponseAt !== current.firstResponseAt) {
        return { ok: false, error: "firstResponseAt_already_observed" };
      }
    } else {
      payload.firstResponseAt = firstResponseAt;
    }
  }

  if (
    draft.clarificationStatus &&
    draft.clarificationStatus !== (current?.clarificationStatus ?? "not_started")
  ) {
    if (!Object.prototype.hasOwnProperty.call(RFP_CLARIFICATION_STATUS_LABELS, draft.clarificationStatus)) {
      return { ok: false, error: "invalid_clarification_status" };
    }
    payload.clarificationStatus = draft.clarificationStatus;
  }

  const eventType = draft.clarificationEventType.trim();
  const eventAt = draft.clarificationEventAt.trim();
  if (eventType || eventAt || draft.clarificationEventNote.trim()) {
    if (!eventType || !eventAt) {
      return { ok: false, error: "clarification_event_requires_type_and_timestamp" };
    }
    if (!Object.prototype.hasOwnProperty.call(RFP_CLARIFICATION_EVENT_TYPE_LABELS, eventType)) {
      return { ok: false, error: "invalid_clarification_event_type" };
    }
    if (!isIsoTimestamp(eventAt)) return { ok: false, error: "invalid_clarification_timestamp" };
    payload.clarificationEvent = { eventType, eventAt };
    const note = draft.clarificationEventNote.trim();
    if (note) payload.clarificationEvent.note = note;
  }

  return { ok: true, payload };
}

export type PathBFacts = {
  rfpId: string;
  required: boolean;
  status: string;
  categories: string[];
  requestedByPrincipalId?: string;
  decidedAt?: string;
  decidedByPrincipalId?: string;
  decisionNotes?: string;
};

export type ProgrammeCommercialFacts = {
  programmeId: string;
  programmeCode: string;
  rfpId: string;
  opportunityId: string;
  rfpObserved: boolean;
  costingReferencesProgramme: boolean;
  proposalReferencesProgramme: boolean;
  recordedClientFacingVersionNumbers?: number[];
  observedClientFacingVersionNumber?: number;
  note?: string;
};

export type AccountCommercialFacts = {
  accountId: string;
  organizationId: string;
  accountName: string;
  accountType?: string;
  accountTypeLabel?: string;
  market?: string;
  marketLabel?: string;
  accountTypeIndependentOfMarket: boolean;
  marketIndependentOfAccountType: boolean;
  or03Authoritative: boolean;
  or03mAuthoritative: boolean;
  inferredFromName: boolean;
  inferredFromTelephone: boolean;
  inferredFromEmail: boolean;
};

/** Kernel OR-08 source-class labels copied for UI. Not a new taxonomy. */
export const SUPPLIER_RATE_SOURCE_CLASS_LABELS: Record<string, string> = {
  direct_supplier_contract: "Direct supplier contract/agreement",
  supplier_contracted_rate_sheet: "Supplier-issued contracted rate sheet",
  written_supplier_quotation: "Written supplier quotation",
  trade_partner_net_agreement: "Approved trade/net rate",
  public_benchmark: "Public benchmark, only where explicitly approved",
};

/** Kernel OR-08 rate-type labels copied for UI. Distinct from mixed C4 unit types. */
export const SUPPLIER_RATE_TYPE_LABELS: Record<string, string> = {
  negotiated_contracted: "Negotiated / Contracted",
  trade_net: "Trade / Net",
  public: "Public",
  promotional: "Promotional",
  quoted_ad_hoc: "Quoted / Ad hoc",
};

export type RateIdentityView = {
  identityId: string;
  rateId: string;
  supplierId: string;
  supplierCode: string;
  supplierLegalName: string;
  itemIdentity?: string;
  rateCode: string;
  rateName: string;
  versionIdentity: number;
  sourceClass: string;
  sourceClassLabel: string;
  rateType: string;
  rateTypeLabel: string;
  originalCurrency: string;
  seasonLabel?: string;
  seasonId?: string;
  validFrom: string;
  validTo: string;
  sourceDate?: string;
  verificationDate?: string;
  expiry?: string;
  currentlyValid: boolean;
  validityState: "current" | "future" | "expired";
  amountIsNotIdentity: true;
  legacyAmount: number;
  legacyUnitRateType: string;
  legacyUnitRateTypeAuthoritativeForF2: false;
  legacyCurrency: string;
  legacyCurrencyAuthoritativeForF2: false;
  fxProviderImplemented: false;
  overlapWinnerInvented: false;
  preferredInConflictAuthoritativeForF2: false;
  inferredFromWebsite: false;
  or08Authoritative: true;
};

export type RateCommercialFacts = {
  identities: RateIdentityView[];
  overlapResolution: "none";
  preferredInConflictAuthoritativeForF2: false;
  fxProviderImplemented: false;
  persistence?: F2FactsPersistence;
};

export type PutRateIdentityPayload = {
  versionIdentity: number;
  sourceClass: string;
  rateType: string;
  originalCurrency: string;
  validFrom: string;
  validTo: string;
  seasonLabel?: string;
  seasonId?: string;
  sourceDate?: string;
  verificationDate?: string;
  expiry?: string;
  itemIdentity?: string;
};

export type RateIdentityDraft = {
  sourceClass: string;
  rateType: string;
  originalCurrency: string;
  validFrom: string;
  validTo: string;
  seasonLabel: string;
  sourceDate: string;
  verificationDate: string;
  expiry: string;
  itemIdentity: string;
};

export function emptyRateIdentityDraft(): RateIdentityDraft {
  return {
    sourceClass: "",
    rateType: "",
    originalCurrency: "",
    validFrom: "",
    validTo: "",
    seasonLabel: "",
    sourceDate: "",
    verificationDate: "",
    expiry: "",
    itemIdentity: "",
  };
}

export function draftFromLatestRateIdentity(identities: RateIdentityView[]): RateIdentityDraft {
  const draft = emptyRateIdentityDraft();
  const latest = identities[identities.length - 1];
  if (!latest) return draft;
  draft.sourceClass = latest.sourceClass;
  draft.rateType = latest.rateType;
  draft.originalCurrency = latest.originalCurrency;
  draft.validFrom = latest.validFrom;
  draft.validTo = latest.validTo;
  draft.seasonLabel = latest.seasonLabel ?? "";
  draft.sourceDate = latest.sourceDate ?? "";
  draft.verificationDate = latest.verificationDate ?? "";
  draft.expiry = latest.expiry ?? "";
  draft.itemIdentity = latest.itemIdentity ?? latest.rateCode;
  return draft;
}

export function nextRateVersionIdentity(identities: RateIdentityView[]): number {
  if (identities.length === 0) return 1;
  return Math.max(...identities.map((row) => row.versionIdentity)) + 1;
}

export function buildRateIdentityPutPayload(
  draft: RateIdentityDraft,
  versionIdentity: number,
): { ok: true; payload: PutRateIdentityPayload } | { ok: false; error: string } {
  if (!draft.sourceClass) return { ok: false, error: "Select an OR-08 source class." };
  if (!draft.rateType) return { ok: false, error: "Select an OR-08 rate type." };
  if (!/^[A-Z]{3}$/.test(draft.originalCurrency.trim().toUpperCase())) {
    return { ok: false, error: "Original currency must be an ISO 4217 code." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.validFrom) || !/^\d{4}-\d{2}-\d{2}$/.test(draft.validTo)) {
    return { ok: false, error: "Validity observation requires ISO dates." };
  }
  if (draft.validFrom > draft.validTo) {
    return { ok: false, error: "validFrom must not be after validTo." };
  }
  const payload: PutRateIdentityPayload = {
    versionIdentity,
    sourceClass: draft.sourceClass,
    rateType: draft.rateType,
    originalCurrency: draft.originalCurrency.trim().toUpperCase(),
    validFrom: draft.validFrom,
    validTo: draft.validTo,
  };
  if (draft.seasonLabel.trim()) payload.seasonLabel = draft.seasonLabel.trim();
  if (draft.sourceDate.trim()) payload.sourceDate = draft.sourceDate.trim();
  if (draft.verificationDate.trim()) payload.verificationDate = draft.verificationDate.trim();
  if (draft.expiry.trim()) payload.expiry = draft.expiry.trim();
  if (draft.itemIdentity.trim()) payload.itemIdentity = draft.itemIdentity.trim();
  return { ok: true, payload };
}

/** Kernel OR-03 account-type catalogue copied for UI labels. Not a new taxonomy. */
export const COMMERCIAL_ACCOUNT_TYPE_LABELS: Record<string, string> = {
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

/** Kernel OR-03-M market catalogue copied for UI labels. Distinct from account type. */
export const COMMERCIAL_MARKET_LABELS: Record<string, string> = {
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

/** Kernel Path B qualitative categories. No sell-price or margin threshold. */
export const PATH_B_EXCEPTIONAL_APPROVAL_LABELS: Record<string, string> = {
  exceptional_discounting: "Exceptional discounting",
  margin_below_approved_floor: "Margin below approved floor",
  unusual_payment_credit: "Unusual payment/credit terms",
  non_standard_cancellation_liability: "Non-standard cancellation/liability terms",
  significant_contractual_commitments: "Significant contractual commitments",
  strategic_high_risk_accounts: "Strategic/high-risk accounts",
  unusually_large_complex_programmes: "Unusually large or complex programmes",
  deviation_from_supplier_commercial_policy: "Deviation from approved supplier/commercial policy",
};

export const QUALIFICATION_CONDITION_LABELS: Record<string, string> = {
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

export const QUALIFICATION_STATUS_LABELS: Record<string, string> = {
  not_yet_assessed: "Not yet assessed",
  qualified: "Qualified",
  not_qualified: "Not qualified",
};

const H91_RESIDUE = /H91-TEST/i;

export function isControlledDevtestResidue(...values: Array<string | undefined>): boolean {
  return values.some((value) => typeof value === "string" && H91_RESIDUE.test(value));
}

export function persistenceCaption(persistence: F2FactsPersistence | undefined): string {
  if (!persistence) return "Persistence status unavailable.";
  const recorded = persistence.recorded ? "F2 facts recorded" : "No F2 facts recorded yet";
  const mode =
    persistence.mode === "f2_dp01_sidecar"
      ? "F2-DP-01 sidecar (not mixed PostgreSQL C-spine)"
      : "in-memory preview (not durable sidecar)";
  const mixed = persistence.mixedSqlDurable
    ? "mixed SQL durable"
    : "mixed SQL not durable on this path";
  return `${recorded}. ${mode}. ${mixed}.`;
}

/**
 * Client Save visibility for the existing Opportunity/RFP F2 panels.
 * This is not authorization. Server authorize() remains authoritative.
 * GET success alone is not treated as a write grant; writeForbidden is set only
 * after an observed PUT 403 (already-available client state).
 */
export function commercialFactsCanWrite(args: {
  hasToken: boolean;
  factsLoaded: boolean;
  unauthorizedRead: boolean;
  writeForbidden: boolean;
}): boolean {
  return Boolean(args.hasToken && args.factsLoaded && !args.unauthorizedRead && !args.writeForbidden);
}

export type CommercialFactsWriteEntity =
  | "opportunity"
  | "rfp"
  | "account"
  | "programme"
  | "path_b"
  | "rate_identity";

export type CommercialFactsPutFailure = {
  writeForbidden: boolean;
  message: string;
};

/** Maps a rejected PUT to UI copy. Never treats 403 as success. Does not persist facts. */
export function mapCommercialFactsPutFailure(
  err: unknown,
  entity: CommercialFactsWriteEntity,
): CommercialFactsPutFailure {
  if (err instanceof EosApiError && err.status === 403) {
    return {
      writeForbidden: true,
      message:
        entity === "rfp"
          ? "Not authorized to update RFP commercial facts."
          : entity === "account"
            ? "Not authorized to update account commercial facts."
            : entity === "programme"
              ? "Not authorized to update programme commercial facts."
              : entity === "path_b"
                ? "Not authorized to update Path B."
                : entity === "rate_identity"
                  ? "Not authorized to update rate identity overlay."
                  : "Not authorized to update opportunity commercial facts.",
    };
  }
  if (err instanceof EosApiError && err.status === 409 && entity === "rate_identity") {
    return {
      writeForbidden: false,
      message: "versionIdentity already exists. Overlay versions are append-only.",
    };
  }
  return {
    writeForbidden: false,
    message:
      err instanceof EosApiError
        ? err.message
        : entity === "rfp"
          ? "Failed to save F2 RFP facts"
          : entity === "account"
            ? "Failed to save F2 account facts"
            : entity === "programme"
              ? "Failed to save F2 programme facts"
              : entity === "path_b"
                ? "Failed to save Path B"
                : entity === "rate_identity"
                  ? "Failed to save F2 rate identity overlay"
                  : "Failed to save F2 commercial facts",
  };
}

export async function getOpportunityCommercialFacts(token: string, opportunityId: string) {
  return eosFetch<{ facts: OpportunityCommercialFacts; persistence: F2FactsPersistence }>(
    `/v1/pipeline/opportunities/${opportunityId}/commercial-facts`,
    { token },
  );
}

export async function putOpportunityCommercialFacts(
  token: string,
  opportunityId: string,
  payload: {
    qualificationStatus?: string;
    qualificationConditions?: Record<string, boolean>;
    nextAction?: { description: string; dueAt?: string };
    qualificationEvidenceRefs?: string[];
  },
) {
  return eosFetch<{ facts: OpportunityCommercialFacts; persistence: F2FactsPersistence }>(
    `/v1/pipeline/opportunities/${opportunityId}/commercial-facts`,
    { token, method: "PUT", body: JSON.stringify(payload) },
  );
}

export async function getRfpCommercialFacts(token: string, rfpId: string) {
  return eosFetch<{ facts: RfpCommercialFacts; persistence: F2FactsPersistence }>(
    `/v1/rfps/${rfpId}/commercial-facts`,
    { token },
  );
}

export async function putRfpCommercialFacts(token: string, rfpId: string, payload: PutRfpFactsPayload) {
  return eosFetch<{ facts: RfpCommercialFacts; persistence: F2FactsPersistence }>(
    `/v1/rfps/${rfpId}/commercial-facts`,
    { token, method: "PUT", body: JSON.stringify(payload) },
  );
}

export async function getPathBApproval(token: string, rfpId: string) {
  return eosFetch<{ pathB: PathBFacts; persistence: F2FactsPersistence }>(
    `/v1/rfps/${rfpId}/path-b-approval`,
    { token },
  );
}

export async function putPathBCategories(token: string, rfpId: string, categories: string[]) {
  return eosFetch<{ pathB: PathBFacts; persistence: F2FactsPersistence }>(
    `/v1/rfps/${rfpId}/path-b-approval`,
    { token, method: "PUT", body: JSON.stringify({ categories }) },
  );
}

export async function decidePathBApproval(
  token: string,
  rfpId: string,
  payload: { outcome: "approved" | "rejected"; notes?: string },
) {
  return eosFetch<{ pathB: PathBFacts; persistence: F2FactsPersistence }>(
    `/v1/rfps/${rfpId}/path-b-approval/decision`,
    { token, method: "POST", body: JSON.stringify(payload) },
  );
}

export async function getAccountCommercialFacts(token: string, accountId: string) {
  return eosFetch<{ facts: AccountCommercialFacts; persistence: F2FactsPersistence }>(
    `/v1/crm/accounts/${accountId}/commercial-facts`,
    { token },
  );
}

export async function putAccountCommercialFacts(
  token: string,
  accountId: string,
  payload: { accountType?: string; market?: string },
) {
  return eosFetch<{ facts: AccountCommercialFacts; persistence: F2FactsPersistence }>(
    `/v1/crm/accounts/${accountId}/commercial-facts`,
    { token, method: "PUT", body: JSON.stringify(payload) },
  );
}

export async function getProgrammeCommercialFacts(token: string, programmeId: string) {
  return eosFetch<{ facts: ProgrammeCommercialFacts; persistence: F2FactsPersistence }>(
    `/v1/programmes/${programmeId}/commercial-facts`,
    { token },
  );
}

export async function putProgrammeCommercialFacts(
  token: string,
  programmeId: string,
  payload: { note?: string; observedClientFacingVersionNumber?: number },
) {
  return eosFetch<{ facts: ProgrammeCommercialFacts; persistence: F2FactsPersistence }>(
    `/v1/programmes/${programmeId}/commercial-facts`,
    { token, method: "PUT", body: JSON.stringify(payload) },
  );
}

export async function getRateCommercialFacts(token: string, supplierId: string, rateId: string) {
  return eosFetch<RateCommercialFacts>(
    `/v1/suppliers/${supplierId}/rates/${rateId}/commercial-facts`,
    { token },
  );
}

export async function putRateCommercialFacts(
  token: string,
  supplierId: string,
  rateId: string,
  payload: PutRateIdentityPayload,
) {
  return eosFetch<RateCommercialFacts & { identity: RateIdentityView }>(
    `/v1/suppliers/${supplierId}/rates/${rateId}/commercial-facts`,
    { token, method: "PUT", body: JSON.stringify(payload) },
  );
}
