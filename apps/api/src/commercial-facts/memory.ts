import type {
  ClosedLostReasons,
  CommercialAccountType,
  CommercialChannel,
  CommercialMarket,
  CommercialSource,
  PathBExceptionalApprovalCategory,
  QualificationConditionKey,
  SupplierRateSourceClass,
  SupplierRateTypeKey,
  QualificationStatus,
  RfpClarificationStatus,
} from "@sedmc/kernel";
import { emptyQualificationConditions } from "@sedmc/kernel";
import type { Store } from "../store.js";

export type F2NextAction = {
  description: string;
  dueAt?: string;
  ownerPrincipalId: string;
};

export type F2OwnershipTransfer = {
  id: string;
  previousOwnerPrincipalId: string;
  newOwnerPrincipalId: string;
  transferredAt: string;
  transferredByPrincipalId: string;
  nextAction: string;
};

export type F2OpportunityFacts = {
  opportunityId: string;
  tenantId: string;
  qualificationStatus: QualificationStatus;
  qualificationDecidedAt?: string;
  qualificationDecidedByPrincipalId?: string;
  qualificationConditions: Record<QualificationConditionKey, boolean>;
  qualificationEvidenceRefs: string[];
  nextAction?: F2NextAction;
  followUpOwnerPrincipalId: string;
  intakeOwnerPrincipalId: string;
  ownershipTransfers: F2OwnershipTransfer[];
  closedLost?: ClosedLostReasons;
  updatedAt: string;
  updatedByPrincipalId: string;
};

export type F2RfpFacts = {
  rfpId: string;
  tenantId: string;
  primarySource?: CommercialSource;
  secondarySources: CommercialSource[];
  channel?: CommercialChannel;
  clarificationStatus: RfpClarificationStatus;
  receivedAt?: string;
  receivedAtProvenance?: "explicit_business_fact";
  receivedAtNote?: string;
  firstResponseAt?: string;
  firstResponseAtProvenance?: "explicit_business_fact";
  clarificationEvents: F2ClarificationEvent[];
  updatedAt: string;
  updatedByPrincipalId: string;
};

export type F2ClarificationEvent = {
  id: string;
  eventType: "requested" | "answered";
  eventAt: string;
  provenance: "explicit_business_fact";
  note?: string;
};

export type F2AccountFacts = {
  accountId: string;
  tenantId: string;
  accountType?: CommercialAccountType;
  market?: CommercialMarket;
  updatedAt: string;
  updatedByPrincipalId: string;
};

export type F2PathBStatus = "not_required" | "pending" | "approved" | "rejected";

export type F2RateIdentity = {
  identityId: string;
  rateId: string;
  tenantId: string;
  supplierId: string;
  versionIdentity: number;
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
  itemIdentity?: string;
  updatedAt: string;
  updatedByPrincipalId: string;
};

export type F2ProgrammeFacts = {
  programmeId: string;
  tenantId: string;
  note?: string;
  observedClientFacingVersionNumber?: number;
  observedClientFacingVersionProvenance?: "explicit_business_fact";
  updatedAt: string;
  updatedByPrincipalId: string;
};

export type F2PathBApproval = {
  rfpId: string;
  tenantId: string;
  categories: PathBExceptionalApprovalCategory[];
  required: boolean;
  status: F2PathBStatus;
  requestedByPrincipalId?: string;
  decidedAt?: string;
  decidedByPrincipalId?: string;
  decisionNotes?: string;
  updatedAt: string;
  updatedByPrincipalId: string;
};

type F2Memory = {
  opportunities: Map<string, F2OpportunityFacts>;
  rfps: Map<string, F2RfpFacts>;
  pathB: Map<string, F2PathBApproval>;
  accounts: Map<string, F2AccountFacts>;
  rates: Map<string, F2RateIdentity[]>;
  programmes: Map<string, F2ProgrammeFacts>;
};

const memory = new WeakMap<Store, F2Memory>();

export function f2FactsMemory(store: Store): F2Memory {
  let facts = memory.get(store);
  if (!facts) {
    facts = {
      opportunities: new Map(),
      rfps: new Map(),
      pathB: new Map(),
      accounts: new Map(),
      rates: new Map(),
      programmes: new Map(),
    };
    memory.set(store, facts);
  }
  if (!facts.pathB) facts.pathB = new Map();
  if (!facts.accounts) facts.accounts = new Map();
  if (!facts.rates) facts.rates = new Map();
  if (!facts.programmes) facts.programmes = new Map();
  return facts;
}

export function defaultOpportunityFacts(input: {
  opportunityId: string;
  tenantId: string;
  ownerPrincipalId: string;
  now: string;
  actorPrincipalId: string;
}): F2OpportunityFacts {
  return {
    opportunityId: input.opportunityId,
    tenantId: input.tenantId,
    qualificationStatus: "not_yet_assessed",
    qualificationConditions: emptyQualificationConditions(),
    qualificationEvidenceRefs: [],
    followUpOwnerPrincipalId: input.ownerPrincipalId,
    intakeOwnerPrincipalId: input.ownerPrincipalId,
    ownershipTransfers: [],
    updatedAt: input.now,
    updatedByPrincipalId: input.actorPrincipalId,
  };
}

export function defaultRfpFacts(input: {
  rfpId: string;
  tenantId: string;
  now: string;
  actorPrincipalId: string;
}): F2RfpFacts {
  return {
    rfpId: input.rfpId,
    tenantId: input.tenantId,
    secondarySources: [],
    clarificationStatus: "not_started",
    clarificationEvents: [],
    updatedAt: input.now,
    updatedByPrincipalId: input.actorPrincipalId,
  };
}
