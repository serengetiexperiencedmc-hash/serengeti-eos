import type { Classification } from "./types.js";

export type OpportunityStage =
  | "new_qualified"
  | "rfp_received"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost";

export type OpportunityStatus = "open" | "won" | "lost" | "archived";

export const OPPORTUNITY_STAGES = [
  "new_qualified",
  "rfp_received",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
] as const satisfies readonly OpportunityStage[];

export const OPPORTUNITY_STAGE_LABELS: Record<OpportunityStage, string> = {
  new_qualified: "New / Qualified",
  rfp_received: "RFP Received",
  proposal_sent: "Proposal Sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export function isValidOpportunityStage(stage: string): stage is OpportunityStage {
  return (OPPORTUNITY_STAGES as readonly string[]).includes(stage);
}

export const OPPORTUNITY_STAGE_TRANSITIONS: Record<
  Exclude<OpportunityStage, "won" | "lost">,
  readonly OpportunityStage[]
> = {
  new_qualified: ["rfp_received", "lost"],
  rfp_received: ["proposal_sent", "new_qualified", "lost"],
  proposal_sent: ["negotiation", "rfp_received", "lost"],
  negotiation: ["won", "proposal_sent", "lost"],
};

export function canTransitionOpportunityStage(from: OpportunityStage, to: OpportunityStage): boolean {
  if (from === "won" || from === "lost") return false;
  if (to === "won" || to === "lost") return true;
  return (OPPORTUNITY_STAGE_TRANSITIONS[from] as readonly string[]).includes(to);
}

export type OppOpportunity = {
  id: string;
  tenantId: string;
  opportunityCode: string;
  title: string;
  organizationId: string;
  accountId?: string;
  stage: OpportunityStage;
  status: OpportunityStatus;
  programmeSummary?: string;
  estimatedValue?: number;
  currency?: string;
  paxCount?: number;
  expectedCloseDate?: string;
  ownerPrincipalId: string;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type OppStageHistory = {
  id: string;
  tenantId: string;
  opportunityId: string;
  fromStage?: OpportunityStage;
  toStage: OpportunityStage;
  changedAt: string;
  changedByPrincipalId: string;
  notes?: string;
};

export function opportunityCodePattern(code: string): boolean {
  return /^OPP-[0-9]{4}-[0-9]{4,6}$/.test(code.trim());
}
