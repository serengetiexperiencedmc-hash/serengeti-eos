import {
  allMandatoryQualificationConditionsMet,
  authorize,
  emptyQualificationConditions,
  isCommercialChannel,
  isCommercialSource,
  isQualificationStatus,
  isRfpClarificationStatus,
  newId,
  validateClosedLostReasons,
  validateSourceChannelSet,
  type ClosedLostReasons,
  type CommercialChannel,
  type CommercialSource,
  type Principal,
  type QualificationConditionKey,
  type QualificationStatus,
  type RfpClarificationStatus,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import {
  defaultOpportunityFacts,
  defaultRfpFacts,
  type F2NextAction,
  type F2OpportunityFacts,
  type F2OwnershipTransfer,
  type F2RfpFacts,
  type F2ClarificationEvent,
} from "./memory.js";
import { c1AccountContextForOpportunity } from "./account.js";
import {
  f2Dp01DurablePreviewBlock,
  f2FactsPersistenceMeta,
  readAccountFacts,
  readOpportunityFacts,
  readRfpFacts,
  writeOpportunityFacts,
  writeRfpFacts,
} from "./persist.js";
import { lookupOpportunity, lookupRfp } from "./entity-lookup.js";
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";

const IN_MEMORY_ONLY = { error: "conflict" as const, reason: "f2_i2_in_memory_preview_only" };
const RFP_IN_MEMORY_ONLY = { error: "conflict" as const, reason: "f2_i8_in_memory_preview_only" };

const ISO_TIMESTAMP =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

function isIsoTimestamp(value: string): boolean {
  if (!ISO_TIMESTAMP.test(value)) return false;
  return Number.isFinite(Date.parse(value));
}

export const CLARIFICATION_EVENT_TYPES = ["requested", "answered"] as const;
export type ClarificationEventType = (typeof CLARIFICATION_EVENT_TYPES)[number];

function isClarificationEventType(value: string): value is ClarificationEventType {
  return (CLARIFICATION_EVENT_TYPES as readonly string[]).includes(value);
}

export function opportunityFactsView(
  opportunity: {
    id: string;
    stage: string;
    status: string;
    ownerPrincipalId: string;
    accountId?: string;
  },
  facts: F2OpportunityFacts,
  c1Account?: ReturnType<typeof c1AccountContextForOpportunity>,
) {
  return {
    opportunityId: opportunity.id,
    workflowStage: opportunity.stage,
    opportunityStatus: opportunity.status,
    qualificationStatus: facts.qualificationStatus,
    qualificationIsIndependentOfWorkflowStage: true,
    newQualifiedStageIsNotQualification: opportunity.stage === "new_qualified" && facts.qualificationStatus !== "qualified",
    or01Qualified: facts.qualificationStatus === "qualified",
    qualificationConditions: facts.qualificationConditions,
    qualificationEvidenceRefs: facts.qualificationEvidenceRefs,
    qualificationDecidedAt: facts.qualificationDecidedAt,
    qualificationDecidedByPrincipalId: facts.qualificationDecidedByPrincipalId,
    ownerPrincipalId: opportunity.ownerPrincipalId,
    intakeOwnerPrincipalId: facts.intakeOwnerPrincipalId,
    followUpOwnerPrincipalId: facts.followUpOwnerPrincipalId,
    nextAction: facts.nextAction,
    ownershipTransfers: facts.ownershipTransfers,
    closedLost: facts.closedLost,
    ownerExistsBeforeQualification: Boolean(facts.intakeOwnerPrincipalId),
    c1Account: c1Account ?? { linked: false as const },
  };
}

export function rfpFactsView(
  rfp: { id: string; source?: string; workflowStage: string; createdAt: string; receivedAt?: string },
  facts: F2RfpFacts,
) {
  const requested = (facts.clarificationEvents ?? []).filter((e) => e.eventType === "requested");
  const answered = (facts.clarificationEvents ?? []).filter((e) => e.eventType === "answered");
  const receivedAtObserved = Boolean(facts.receivedAt);
  const firstResponseAtObserved = Boolean(facts.firstResponseAt);
  return {
    rfpId: rfp.id,
    workflowStage: rfp.workflowStage,
    primarySource: facts.primarySource,
    secondarySources: facts.secondarySources,
    channel: facts.channel,
    clarificationStatus: facts.clarificationStatus,
    clarificationEvents: facts.clarificationEvents ?? [],
    sourceDistinctFromChannel: true,
    legacyCollapsedSource: rfp.source,
    legacyCollapsedSourceAuthoritativeForF2: false as const,
    receivedAt: facts.receivedAt,
    receivedAtProvenance: facts.receivedAtProvenance,
    receivedAtNote: facts.receivedAtNote,
    receivedAtObserved,
    receivedAtStatus: receivedAtObserved ? ("observed" as const) : ("unavailable" as const),
    firstResponseAt: facts.firstResponseAt,
    firstResponseAtProvenance: facts.firstResponseAtProvenance,
    firstResponseAtObserved,
    firstResponseAtStatus: firstResponseAtObserved ? ("observed" as const) : ("unavailable" as const),
    createdAtUsedAsReceivedAt: false as const,
    createdAtUsedAsFirstResponse: false as const,
    receivedAtUsedAsFirstResponse: false as const,
    legacyRfpRecordReceivedAt: rfp.receivedAt,
    legacyRfpRecordReceivedAtAuthoritativeForF2: false as const,
    rfpCreatedAt: rfp.createdAt,
    receivedAtIsNotCreatedAt: facts.receivedAt ? facts.receivedAt !== rfp.createdAt : true,
    responseTimeReadiness: {
      receivedAtObserved,
      firstResponseAtObserved,
      clarificationRequestedAtObserved: requested.length > 0,
      clarificationAnsweredAtObserved: answered.length > 0,
      proposalSentAtUsedAsFirstResponse: false as const,
      createdAtUsedAsReceivedAt: false as const,
      createdAtUsedAsFirstResponse: false as const,
      receivedAtUsedAsFirstResponse: false as const,
      status: receivedAtObserved && firstResponseAtObserved
        ? ("first_response_chain_ready" as const)
        : receivedAtObserved || requested.length > 0
          ? ("partially_ready" as const)
          : ("unavailable" as const),
    },
  };
}

export async function getOpportunityCommercialFacts(store: Store, principal: Principal, opportunityId: string) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const opportunity = await lookupOpportunity(store, principal.tenantId, opportunityId);
  if (!opportunity) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
    resource: {
      tenantId: opportunity.tenantId,
      type: "opportunity",
      id: opportunity.id,
      classification: opportunity.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const stored = await readOpportunityFacts(store, opportunity.tenantId, opportunityId);
  const facts =
    stored ??
    defaultOpportunityFacts({
      opportunityId: opportunity.id,
      tenantId: opportunity.tenantId,
      ownerPrincipalId: opportunity.ownerPrincipalId,
      now: opportunity.createdAt,
      actorPrincipalId: opportunity.createdByPrincipalId,
    });
  if (opportunity.accountId) {
    await readAccountFacts(store, opportunity.tenantId, opportunity.accountId);
  }
  return {
    facts: opportunityFactsView(opportunity, facts, c1AccountContextForOpportunity(store, opportunity)),
    persistence: f2FactsPersistenceMeta(store, Boolean(stored)),
  };
}

export type PutOpportunityFactsInput = {
  qualificationStatus?: QualificationStatus;
  qualificationConditions?: Partial<Record<QualificationConditionKey, boolean>>;
  qualificationEvidenceRefs?: string[];
  nextAction?: { description: string; dueAt?: string };
  closedLost?: ClosedLostReasons;
  /** Rejected unless equal to the path id — never used as a write target. */
  opportunityId?: string;
  id?: string;
  tenantId?: string;
};

export async function putOpportunityCommercialFacts(
  store: Store,
  principal: Principal,
  opportunityId: string,
  input: PutOpportunityFactsInput,
) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const opportunity = await lookupOpportunity(store, principal.tenantId, opportunityId);
  if (!opportunity) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "pipeline:write:opportunity",
    action: "update:opp_opportunity",
    resource: {
      tenantId: opportunity.tenantId,
      type: "opportunity",
      id: opportunity.id,
      classification: opportunity.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;
  if (input.opportunityId !== undefined && input.opportunityId !== opportunityId) {
    return { error: "conflict" as const, reason: "opportunityId_immutable" };
  }
  if (input.id !== undefined && input.id !== opportunityId) {
    return { error: "conflict" as const, reason: "opportunityId_immutable" };
  }
  if (input.tenantId !== undefined && input.tenantId !== opportunity.tenantId) {
    return { error: "conflict" as const, reason: "tenantId_immutable" };
  }
  if (!opportunity.ownerPrincipalId) {
    return { error: "invalid_request" as const, reason: "owner_required_before_qualification" };
  }

  const now = new Date().toISOString();
  const current =
    (await readOpportunityFacts(store, opportunity.tenantId, opportunityId)) ??
    defaultOpportunityFacts({
      opportunityId: opportunity.id,
      tenantId: opportunity.tenantId,
      ownerPrincipalId: opportunity.ownerPrincipalId,
      now,
      actorPrincipalId: principal.id,
    });

  const conditions = { ...emptyQualificationConditions(), ...current.qualificationConditions };
  if (input.qualificationConditions) {
    for (const [key, value] of Object.entries(input.qualificationConditions) as Array<
      [QualificationConditionKey, boolean]
    >) {
      if (key in conditions && typeof value === "boolean") conditions[key] = value;
    }
  }

  let qualificationStatus = current.qualificationStatus;
  if (input.qualificationStatus !== undefined) {
    if (!isQualificationStatus(input.qualificationStatus)) {
      return { error: "invalid_request" as const, reason: "invalid_qualification_status" };
    }
    qualificationStatus = input.qualificationStatus;
  }

  let nextAction: F2NextAction | undefined = current.nextAction;
  if (input.nextAction) {
    const description = input.nextAction.description?.trim();
    if (!description) return { error: "invalid_request" as const, reason: "next_action_required" };
    nextAction = {
      description,
      ownerPrincipalId: current.followUpOwnerPrincipalId,
      ...(input.nextAction.dueAt !== undefined ? { dueAt: input.nextAction.dueAt } : {}),
    };
  }

  if (qualificationStatus === "qualified") {
    if (!allMandatoryQualificationConditionsMet(conditions)) {
      return { error: "invalid_request" as const, reason: "or01_b_conditions_incomplete" };
    }
    if (!nextAction?.description) {
      return { error: "invalid_request" as const, reason: "next_action_required_when_qualified" };
    }
  }

  let closedLost = current.closedLost;
  if (input.closedLost) {
    if (opportunity.stage !== "lost" && opportunity.status !== "lost") {
      return { error: "conflict" as const, reason: "opportunity_not_closed_lost" };
    }
    const validated = validateClosedLostReasons(input.closedLost);
    if (!validated.ok) return { error: "invalid_request" as const, reason: validated.reason };
    closedLost = {
      primary: input.closedLost.primary,
      ...(input.closedLost.contributing !== undefined ? { contributing: [...input.closedLost.contributing] } : {}),
      ...(input.closedLost.otherExplanation !== undefined ? { otherExplanation: input.closedLost.otherExplanation } : {}),
    };
  }

  const next: F2OpportunityFacts = {
    ...current,
    qualificationStatus,
    qualificationConditions: conditions,
    qualificationEvidenceRefs: input.qualificationEvidenceRefs ?? current.qualificationEvidenceRefs,
    followUpOwnerPrincipalId: current.followUpOwnerPrincipalId,
    updatedAt: now,
    updatedByPrincipalId: principal.id,
    ownershipTransfers: current.ownershipTransfers,
  };
  if (nextAction) next.nextAction = nextAction;
  if (qualificationStatus !== current.qualificationStatus) {
    next.qualificationDecidedAt = now;
    next.qualificationDecidedByPrincipalId = principal.id;
  } else {
    if (current.qualificationDecidedAt) next.qualificationDecidedAt = current.qualificationDecidedAt;
    if (current.qualificationDecidedByPrincipalId) {
      next.qualificationDecidedByPrincipalId = current.qualificationDecidedByPrincipalId;
    }
  }
  if (closedLost) next.closedLost = closedLost;

  try {
    await writeOpportunityFacts(store, next);
  } catch {
    return { error: "conflict" as const, reason: "f2_sidecar_persist_failed" };
  }
  return {
    facts: opportunityFactsView(opportunity, next, c1AccountContextForOpportunity(store, opportunity)),
    persistence: f2FactsPersistenceMeta(store, true),
  };
}

export async function transferOpportunityFollowUp(
  store: Store,
  principal: Principal,
  opportunityId: string,
  input: { newOwnerPrincipalId: string; nextAction: string },
) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const opportunity = await lookupOpportunity(store, principal.tenantId, opportunityId);
  if (!opportunity) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "pipeline:write:opportunity",
    action: "update:opp_opportunity",
    resource: {
      tenantId: opportunity.tenantId,
      type: "opportunity",
      id: opportunity.id,
      classification: opportunity.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const newOwner = input.newOwnerPrincipalId?.trim();
  const nextActionText = input.nextAction?.trim();
  if (!newOwner) return { error: "invalid_request" as const, reason: "new_owner_required" };
  if (!nextActionText) return { error: "invalid_request" as const, reason: "next_action_required" };

  const now = new Date().toISOString();
  const current =
    (await readOpportunityFacts(store, opportunity.tenantId, opportunityId)) ??
    defaultOpportunityFacts({
      opportunityId: opportunity.id,
      tenantId: opportunity.tenantId,
      ownerPrincipalId: opportunity.ownerPrincipalId,
      now,
      actorPrincipalId: principal.id,
    });

  const transfer: F2OwnershipTransfer = {
    id: newId(),
    previousOwnerPrincipalId: opportunity.ownerPrincipalId,
    newOwnerPrincipalId: newOwner,
    transferredAt: now,
    transferredByPrincipalId: principal.id,
    nextAction: nextActionText,
  };

  opportunity.ownerPrincipalId = newOwner;
  opportunity.updatedAt = now;
  opportunity.updatedByPrincipalId = principal.id;

  const next: F2OpportunityFacts = {
    ...current,
    followUpOwnerPrincipalId: newOwner,
    ownershipTransfers: [...current.ownershipTransfers, transfer],
    nextAction: {
      description: nextActionText,
      ownerPrincipalId: newOwner,
    },
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  await writeOpportunityFacts(store, next);
  return {
    facts: opportunityFactsView(opportunity, next, c1AccountContextForOpportunity(store, opportunity)),
    transfer,
    persistence: f2FactsPersistenceMeta(store, true),
  };
}

export async function getRfpCommercialFacts(store: Store, principal: Principal, rfpId: string) {
  const blocked = f2Dp01DurablePreviewBlock(store, RFP_IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const rfp = await lookupRfp(store, principal.tenantId, rfpId);
  if (!rfp) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "rfp:read:rfp",
    action: "read:rfp",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const stored = await readRfpFacts(store, rfp.tenantId, rfpId);
  const facts =
    stored ??
    defaultRfpFacts({
      rfpId: rfp.id,
      tenantId: rfp.tenantId,
      now: rfp.createdAt,
      actorPrincipalId: rfp.createdByPrincipalId,
    });
  return { facts: rfpFactsView(rfp, facts), persistence: f2FactsPersistenceMeta(store, Boolean(stored)) };
}

export type PutRfpFactsInput = {
  primarySource?: CommercialSource;
  secondarySources?: CommercialSource[];
  channel?: CommercialChannel;
  clarificationStatus?: RfpClarificationStatus;
  receivedAt?: string;
  receivedAtNote?: string;
  firstResponseAt?: string;
  clarificationEvent?: {
    eventType: string;
    eventAt: string;
    note?: string;
  };
  /** Rejected unless equal to the path id — never used as a write target. */
  rfpId?: string;
  id?: string;
  tenantId?: string;
};

export async function putRfpCommercialFacts(
  store: Store,
  principal: Principal,
  rfpId: string,
  input: PutRfpFactsInput,
) {
  const blocked = f2Dp01DurablePreviewBlock(store, RFP_IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const rfp = await lookupRfp(store, principal.tenantId, rfpId);
  if (!rfp) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "rfp:write:rfp",
    action: "update:rfp",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;
  if (input.rfpId !== undefined && input.rfpId !== rfpId) {
    return { error: "conflict" as const, reason: "rfpId_immutable" };
  }
  if (input.id !== undefined && input.id !== rfpId) {
    return { error: "conflict" as const, reason: "rfpId_immutable" };
  }
  if (input.tenantId !== undefined && input.tenantId !== rfp.tenantId) {
    return { error: "conflict" as const, reason: "tenantId_immutable" };
  }

  const now = new Date().toISOString();
  const current =
    (await readRfpFacts(store, rfp.tenantId, rfpId)) ??
    defaultRfpFacts({
      rfpId: rfp.id,
      tenantId: rfp.tenantId,
      now,
      actorPrincipalId: principal.id,
    });

  const primarySource = input.primarySource ?? current.primarySource;
  const channel = input.channel ?? current.channel;
  const secondarySources = input.secondarySources ?? current.secondarySources;

  if (primarySource !== undefined && !isCommercialSource(primarySource)) {
    return { error: "invalid_request" as const, reason: "invalid_primary_source" };
  }
  if (channel !== undefined && !isCommercialChannel(channel)) {
    return { error: "invalid_request" as const, reason: "invalid_channel" };
  }
  if (primarySource && channel) {
    const validated = validateSourceChannelSet({ primarySource, channel, secondarySources });
    if (!validated.ok) return { error: "invalid_request" as const, reason: validated.reason };
  } else if (input.primarySource !== undefined || input.channel !== undefined || input.secondarySources !== undefined) {
    if (!primarySource || !channel) {
      return { error: "invalid_request" as const, reason: "primary_source_and_channel_required" };
    }
  }

  let clarificationStatus = current.clarificationStatus;
  if (input.clarificationStatus !== undefined) {
    if (!isRfpClarificationStatus(input.clarificationStatus)) {
      return { error: "invalid_request" as const, reason: "invalid_clarification_status" };
    }
    clarificationStatus = input.clarificationStatus;
  }

  let receivedAt = current.receivedAt;
  let receivedAtProvenance = current.receivedAtProvenance;
  let receivedAtNote = current.receivedAtNote;
  if (input.receivedAt !== undefined) {
    if (typeof input.receivedAt !== "string" || !isIsoTimestamp(input.receivedAt)) {
      return { error: "invalid_request" as const, reason: "invalid_receivedAt" };
    }
    if (current.receivedAt && current.receivedAt !== input.receivedAt) {
      return { error: "conflict" as const, reason: "receivedAt_already_observed" };
    }
    receivedAt = input.receivedAt;
    receivedAtProvenance = "explicit_business_fact";
    if (input.receivedAtNote !== undefined) receivedAtNote = input.receivedAtNote;
  } else if (input.receivedAtNote !== undefined) {
    receivedAtNote = input.receivedAtNote;
  }

  let firstResponseAt = current.firstResponseAt;
  let firstResponseAtProvenance = current.firstResponseAtProvenance;
  if (input.firstResponseAt !== undefined) {
    if (typeof input.firstResponseAt !== "string" || !isIsoTimestamp(input.firstResponseAt)) {
      return { error: "invalid_request" as const, reason: "invalid_firstResponseAt" };
    }
    if (current.firstResponseAt && current.firstResponseAt !== input.firstResponseAt) {
      return { error: "conflict" as const, reason: "firstResponseAt_already_observed" };
    }
    firstResponseAt = input.firstResponseAt;
    firstResponseAtProvenance = "explicit_business_fact";
  }

  if (receivedAt && firstResponseAt) {
    const durationMs = Date.parse(firstResponseAt) - Date.parse(receivedAt);
    if (!Number.isFinite(durationMs) || durationMs < 0) {
      return { error: "invalid_request" as const, reason: "negative_response_interval" };
    }
  }

  const clarificationEvents: F2ClarificationEvent[] = [...(current.clarificationEvents ?? [])];
  if (input.clarificationEvent !== undefined) {
    const eventType = input.clarificationEvent.eventType;
    const eventAt = input.clarificationEvent.eventAt;
    if (typeof eventType !== "string" || !isClarificationEventType(eventType)) {
      return { error: "invalid_request" as const, reason: "invalid_clarification_event_type" };
    }
    if (typeof eventAt !== "string" || !isIsoTimestamp(eventAt)) {
      return { error: "invalid_request" as const, reason: "invalid_clarification_timestamp" };
    }
    const event: F2ClarificationEvent = {
      id: newId(),
      eventType,
      eventAt,
      provenance: "explicit_business_fact",
    };
    if (input.clarificationEvent.note !== undefined) event.note = input.clarificationEvent.note;
    clarificationEvents.push(event);
  }

  const next: F2RfpFacts = {
    rfpId: rfp.id,
    tenantId: rfp.tenantId,
    secondarySources: [...secondarySources],
    clarificationStatus,
    clarificationEvents,
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  if (primarySource) next.primarySource = primarySource;
  if (channel) next.channel = channel;
  if (receivedAt) {
    next.receivedAt = receivedAt;
    if (receivedAtProvenance) next.receivedAtProvenance = receivedAtProvenance;
  }
  if (receivedAtNote) next.receivedAtNote = receivedAtNote;
  if (firstResponseAt) {
    next.firstResponseAt = firstResponseAt;
    if (firstResponseAtProvenance) next.firstResponseAtProvenance = firstResponseAtProvenance;
  }
  try {
    await writeRfpFacts(store, next);
  } catch {
    return { error: "conflict" as const, reason: "f2_sidecar_persist_failed" };
  }
  return { facts: rfpFactsView(rfp, next), persistence: f2FactsPersistenceMeta(store, true) };
}
