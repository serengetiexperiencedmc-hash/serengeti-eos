import type { Classification } from "./types.js";

export type ProposalStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "sent"
  | "accepted"
  | "rejected";

export const PROPOSAL_STATUSES = [
  "draft",
  "pending_approval",
  "approved",
  "sent",
  "accepted",
  "rejected",
] as const satisfies readonly ProposalStatus[];

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
};

export function isValidProposalStatus(status: string): status is ProposalStatus {
  return (PROPOSAL_STATUSES as readonly string[]).includes(status);
}

export const PROPOSAL_STATUS_TRANSITIONS: Record<
  Exclude<ProposalStatus, "accepted" | "rejected">,
  readonly ProposalStatus[]
> = {
  draft: ["approved", "rejected"],
  pending_approval: ["approved", "rejected"],
  approved: ["sent", "rejected"],
  sent: ["accepted", "rejected"],
};

export function canTransitionProposalStatus(from: ProposalStatus, to: ProposalStatus): boolean {
  if (from === "accepted" || from === "rejected") return false;
  if (to === "accepted" || to === "rejected") {
    return from === "approved" || from === "sent" || from === "draft" || from === "pending_approval";
  }
  return (PROPOSAL_STATUS_TRANSITIONS[from] as readonly string[]).includes(to);
}

export type PropProposal = {
  id: string;
  tenantId: string;
  proposalCode: string;
  rfpId: string;
  programmeId: string;
  costSheetId: string;
  approvalRequestId: string;
  organizationId: string;
  title: string;
  status: ProposalStatus;
  currency: string;
  totalCost: number;
  sellPrice: number;
  marginPercent: number;
  paxCount?: number;
  programmeSummary?: string;
  itineraryDayCount: number;
  sentAt?: string;
  clientViewedAt?: string;
  currentVersion: number;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type PropProposalSnapshot = {
  programmeTitle: string;
  itineraryDayCount: number;
  itineraryItemCount: number;
  totalCost: number;
  sellPrice: number;
  marginPercent: number;
  currency: string;
  categoryTotals?: Record<string, number>;
};

export type PropProposalVersion = {
  id: string;
  tenantId: string;
  proposalId: string;
  versionNumber: number;
  summary: string;
  snapshot: PropProposalSnapshot;
  createdAt: string;
  createdByPrincipalId: string;
};

export function buildProposalCode(rfpCode: string): string {
  return rfpCode.replace(/^RFP-/i, "PROP-");
}

export function canGenerateProposal(input: {
  hasProgramme: boolean;
  hasCostSheet: boolean;
  approvalStatus?: string;
}): { allowed: boolean; reason?: string } {
  if (!input.hasProgramme) return { allowed: false, reason: "programme_required" };
  if (!input.hasCostSheet) return { allowed: false, reason: "cost_sheet_required" };
  if (input.approvalStatus !== "approved") {
    return { allowed: false, reason: "commercial_approval_required" };
  }
  return { allowed: true };
}
