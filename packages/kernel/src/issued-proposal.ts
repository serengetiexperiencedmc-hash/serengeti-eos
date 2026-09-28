import {
  CLIENT_FACING_FORBIDDEN,
  principalMayAuthorizeMarginFloorException,
  programmeNightCount,
  toClientFacingCommercialView,
  type ProgrammePaymentMilestone,
} from "./h203-commercial-policy.js";
import { newId } from "./crypto.js";
import { programmeIsCommerciallyLocked, type PrgDay, type PrgItem, type PrgProgramme } from "./programme.js";
import type { Principal } from "./types.js";

/** Distinct from C8 `PropProposal`. Internal Dev/Test issued identity only — not a delivered client document. */
export const ISSUED_PROPOSAL_KIND = "issued_proposal" as const;
export type IssuedProposalKind = typeof ISSUED_PROPOSAL_KIND;

export const ISSUING_ENTITY_SEDMC = "Serengeti Experience DMC" as const;

/** PDF / email / dispatch / client GET are not implemented and remain unauthorized. */
export const ISSUED_PROPOSAL_DELIVERY = {
  implemented: false,
  pdf: false,
  email: false,
  dispatch: false,
  clientAccess: false,
} as const;

export type ClientIssueApprovalAuthority = "ceo_md" | "commercial_director" | "platform.admin";

export const ISSUED_CLIENT_SAFE_KEYS = [
  "issuingEntity",
  "programmeCode",
  "programmeTitle",
  "commercialVersionLabel",
  "programmeVersionNumber",
  "startDate",
  "endDate",
  "nights",
  "paxCount",
  "destinations",
  "inclusionsText",
  "exclusionsText",
  "depositPercent",
  "paymentMilestones",
  "itinerary",
  "currency",
  "clientSellingPrice",
] as const;

export type IssuedClientSafeItineraryItem = {
  title: string;
  description?: string;
  startTime?: string;
  itemType?: string;
};

export type IssuedClientSafeItineraryDay = {
  dayNumber: number;
  title: string;
  location?: string;
  calendarDate?: string;
  description?: string;
  items: IssuedClientSafeItineraryItem[];
};

export type IssuedClientSafeRepresentation = {
  issuingEntity: typeof ISSUING_ENTITY_SEDMC;
  programmeCode: string;
  programmeTitle: string;
  commercialVersionLabel: "final";
  programmeVersionNumber?: number;
  startDate?: string;
  endDate?: string;
  nights?: number;
  paxCount?: number;
  destinations?: string;
  inclusionsText?: string;
  exclusionsText?: string;
  depositPercent?: number;
  paymentMilestones?: ProgrammePaymentMilestone[];
  itinerary: IssuedClientSafeItineraryDay[];
  currency: string;
  clientSellingPrice: number;
};

export type IssuedProposal = {
  id: string;
  issuedCode: string;
  kind: IssuedProposalKind;
  tenantId: string;
  programmeId: string;
  rfpId: string;
  /** Optional internal C8 workflow link. Never the issued identity. */
  c8ProposalId?: string;
  programmeCommercialVersionLabel: "final";
  programmeVersionNumber?: number;
  /** Optional FK to prg_programme_versions when a numeric snapshot row exists. */
  programmeVersionId?: string;
  clientSafe: IssuedClientSafeRepresentation;
  issuedAt: string;
  issuedByPrincipalId: string;
  approvalAuthority: ClientIssueApprovalAuthority;
  /** Optional FK to com_approval_requests. Internal metadata — never copied into clientSafe. */
  approvalRequestId?: string;
  approvalRecordedAt: string;
  immutable: true;
  createdAt: string;
};

export const ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS = [
  ...CLIENT_FACING_FORBIDDEN,
  "approvalRequestId",
  "costLines",
  "costLineItems",
  "snapshot",
  "internalSnapshot",
  "workflow",
  "audit",
  "sentAt",
  "clientViewedAt",
  "marginFloorExceptionReason",
  "marginFloorExceptionByPrincipalId",
  "marginFloorExceptionAt",
  "approvalAuthority",
  "issuedByPrincipalId",
  "c8ProposalId",
  "tenantId",
  "totalCost",
  "sellPrice",
  "marginPercent",
  "marginAmount",
  "fileFeeAmount",
  "supplierId",
  "supplierRateId",
  "costSheetId",
] as const;

export function buildIssuedProposalCode(): string {
  return `ISS-${newId()}`;
}

export function issuedIdentityDistinctFromC8(issuedId: string, c8ProposalId: string | undefined): boolean {
  if (!c8ProposalId) return true;
  return issuedId !== c8ProposalId;
}

export function programmeEligibleForClientIssue(
  label: string | undefined,
): { allowed: true } | { allowed: false; reason: "programme_not_final" } {
  if (label === "final" && programmeIsCommerciallyLocked(label)) {
    return { allowed: true };
  }
  return { allowed: false, reason: "programme_not_final" };
}

/** Reuses the existing Dev/Test commercial-authority stand-in (CEO/MD, Commercial Director, platform.admin). */
export function principalMayAuthorizeClientIssue(principal: Principal): boolean {
  return principalMayAuthorizeMarginFloorException(principal);
}

export function clientIssueApprovalAuthority(principal: Principal): ClientIssueApprovalAuthority | undefined {
  const roles = principal.roles.map((r) => r.toLowerCase());
  if (roles.includes("ceo_md")) return "ceo_md";
  if (roles.includes("commercial_director")) return "commercial_director";
  if (roles.includes("platform.admin")) return "platform.admin";
  return undefined;
}

function isClientVisibleItem(item: PrgItem): boolean {
  return item.visibility !== "internal";
}

function clientSafeItem(item: PrgItem): IssuedClientSafeItineraryItem {
  const out: IssuedClientSafeItineraryItem = { title: item.title };
  if (item.description !== undefined) out.description = item.description;
  if (item.startTime !== undefined) out.startTime = item.startTime;
  if (item.itemType !== undefined) out.itemType = item.itemType;
  return out;
}

function clientSafeDay(day: PrgDay, items: PrgItem[]): IssuedClientSafeItineraryDay {
  const out: IssuedClientSafeItineraryDay = {
    dayNumber: day.dayNumber,
    title: day.title,
    items: items
      .filter((i) => i.dayId === day.id && isClientVisibleItem(i))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(clientSafeItem),
  };
  if (day.location !== undefined) out.location = day.location;
  if (day.calendarDate !== undefined) out.calendarDate = day.calendarDate;
  if (day.description !== undefined) out.description = day.description;
  return out;
}

export function buildIssuedClientSafeRepresentation(input: {
  programme: PrgProgramme;
  days: PrgDay[];
  items: PrgItem[];
  currency: string;
  clientSellingPrice: number;
  programmeVersionNumber?: number;
}): IssuedClientSafeRepresentation {
  const commercial = toClientFacingCommercialView({
    currency: input.currency,
    clientSellingPrice: input.clientSellingPrice,
  });
  const nights = programmeNightCount(input.programme.startDate, input.programme.endDate);
  const itinerary = [...input.days]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.dayNumber - b.dayNumber)
    .map((day) => clientSafeDay(day, input.items));

  const view: IssuedClientSafeRepresentation = {
    issuingEntity: ISSUING_ENTITY_SEDMC,
    programmeCode: input.programme.programmeCode,
    programmeTitle: input.programme.title,
    commercialVersionLabel: "final",
    itinerary,
    currency: commercial.currency,
    clientSellingPrice: commercial.clientSellingPrice,
  };
  if (input.programmeVersionNumber !== undefined) view.programmeVersionNumber = input.programmeVersionNumber;
  if (input.programme.startDate !== undefined) view.startDate = input.programme.startDate;
  if (input.programme.endDate !== undefined) view.endDate = input.programme.endDate;
  if (nights !== undefined) view.nights = nights;
  if (input.programme.paxCount !== undefined) view.paxCount = input.programme.paxCount;
  if (input.programme.destinations !== undefined) view.destinations = input.programme.destinations;
  if (input.programme.inclusionsText !== undefined) view.inclusionsText = input.programme.inclusionsText;
  if (input.programme.exclusionsText !== undefined) view.exclusionsText = input.programme.exclusionsText;
  if (input.programme.depositPercent !== undefined) view.depositPercent = input.programme.depositPercent;
  if (input.programme.paymentMilestones !== undefined) {
    view.paymentMilestones = input.programme.paymentMilestones.map((m) => ({ ...m }));
  }
  return pickIssuedClientSafe(view);
}

export function pickIssuedClientSafe(view: Record<string, unknown>): IssuedClientSafeRepresentation {
  const out: Record<string, unknown> = {};
  for (const key of ISSUED_CLIENT_SAFE_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(view, key)) continue;
    const value = view[key];
    if (value !== undefined) out[key] = value;
  }
  return out as IssuedClientSafeRepresentation;
}

export function issuedClientSafeContainsForbidden(view: Record<string, unknown>): boolean {
  return ISSUED_CLIENT_SAFE_FORBIDDEN_KEYS.some((key) => Object.prototype.hasOwnProperty.call(view, key));
}

export function freezeIssuedClientSafe(view: IssuedClientSafeRepresentation): IssuedClientSafeRepresentation {
  const cloned = JSON.parse(JSON.stringify(view)) as IssuedClientSafeRepresentation;
  deepFreeze(cloned);
  return cloned;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.freeze(value);
    for (const nested of Object.values(value as Record<string, unknown>)) {
      deepFreeze(nested);
    }
  }
  return value;
}

export function createIssuedProposal(input: {
  tenantId: string;
  programme: PrgProgramme;
  days: PrgDay[];
  items: PrgItem[];
  currency: string;
  clientSellingPrice: number;
  issuedBy: Principal;
  approvalAuthority: ClientIssueApprovalAuthority;
  programmeVersionNumber?: number;
  programmeVersionId?: string;
  c8ProposalId?: string;
  approvalRequestId?: string;
  issuedAt?: string;
}): IssuedProposal | { error: "programme_not_final" } | { error: "commercial_issue_approval_required" } {
  const eligibility = programmeEligibleForClientIssue(input.programme.commercialVersionLabel);
  if (!eligibility.allowed) return { error: eligibility.reason };
  if (!principalMayAuthorizeClientIssue(input.issuedBy)) {
    return { error: "commercial_issue_approval_required" };
  }
  const now = input.issuedAt ?? new Date().toISOString();
  const id = newId();
  const clientSafe = freezeIssuedClientSafe(
    buildIssuedClientSafeRepresentation({
      programme: input.programme,
      days: input.days,
      items: input.items,
      currency: input.currency,
      clientSellingPrice: input.clientSellingPrice,
      ...(input.programmeVersionNumber !== undefined
        ? { programmeVersionNumber: input.programmeVersionNumber }
        : {}),
    }),
  );
  const record: IssuedProposal = {
    id,
    issuedCode: buildIssuedProposalCode(),
    kind: ISSUED_PROPOSAL_KIND,
    tenantId: input.tenantId,
    programmeId: input.programme.id,
    rfpId: input.programme.rfpId,
    programmeCommercialVersionLabel: "final",
    clientSafe,
    issuedAt: now,
    issuedByPrincipalId: input.issuedBy.id,
    approvalAuthority: input.approvalAuthority,
    approvalRecordedAt: now,
    immutable: true,
    createdAt: now,
  };
  if (input.programmeVersionNumber !== undefined) record.programmeVersionNumber = input.programmeVersionNumber;
  if (input.programmeVersionId !== undefined) record.programmeVersionId = input.programmeVersionId;
  if (input.c8ProposalId !== undefined) record.c8ProposalId = input.c8ProposalId;
  if (input.approvalRequestId !== undefined) record.approvalRequestId = input.approvalRequestId;
  Object.freeze(record);
  return record;
}
