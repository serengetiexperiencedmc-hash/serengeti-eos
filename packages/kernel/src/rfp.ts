import type { Classification } from "./types.js";

export type RfpWorkflowStage =
  | "intake"
  | "programme"
  | "costing"
  | "approval"
  | "proposal"
  | "sent"
  | "closed";

export type RfpStatus = "active" | "closed" | "cancelled";

export type RfpSlaStatus = "on_track" | "at_risk" | "breached";

export const RFP_WORKFLOW_STAGES = [
  "intake",
  "programme",
  "costing",
  "approval",
  "proposal",
  "sent",
  "closed",
] as const satisfies readonly RfpWorkflowStage[];

export const RFP_WORKFLOW_LABELS: Record<RfpWorkflowStage, string> = {
  intake: "RFP Intake",
  programme: "Programme",
  costing: "Costing",
  approval: "Approval",
  proposal: "Proposal",
  sent: "Sent",
  closed: "Closed",
};

export function isValidRfpWorkflowStage(stage: string): stage is RfpWorkflowStage {
  return (RFP_WORKFLOW_STAGES as readonly string[]).includes(stage);
}

export const RFP_WORKFLOW_TRANSITIONS: Record<
  Exclude<RfpWorkflowStage, "closed">,
  readonly RfpWorkflowStage[]
> = {
  intake: ["programme", "closed"],
  programme: ["costing", "intake"],
  costing: ["approval", "programme"],
  approval: ["proposal", "costing"],
  proposal: ["sent", "approval"],
  sent: ["closed", "proposal"],
};

export function canTransitionRfpStage(from: RfpWorkflowStage, to: RfpWorkflowStage): boolean {
  if (from === "closed") return false;
  const allowed = RFP_WORKFLOW_TRANSITIONS[from];
  if (!allowed) return false;
  return (allowed as readonly string[]).includes(to);
}

export function computeSlaStatus(slaDueAt: string, now = new Date()): RfpSlaStatus {
  const due = new Date(slaDueAt).getTime();
  const t = now.getTime();
  if (t >= due) return "breached";
  const hoursLeft = (due - t) / (1000 * 60 * 60);
  if (hoursLeft <= 24) return "at_risk";
  return "on_track";
}

export type RfpRecord = {
  id: string;
  tenantId: string;
  rfpCode: string;
  opportunityId: string;
  organizationId: string;
  title: string;
  workflowStage: RfpWorkflowStage;
  status: RfpStatus;
  programmeType?: string;
  paxCount?: number;
  travelDates?: string;
  destinations?: string;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  requirementsText?: string;
  /** CD Phase 1 — free-text commercial notes. */
  notes?: string;
  /** CD Phase 1 — intake channel (email, portal, advisor, other). */
  source?: string;
  /** CD Phase 1 — when the RFP was received (ISO). Distinct from createdAt. */
  receivedAt?: string;
  slaDueAt?: string;
  slaStatus?: RfpSlaStatus;
  assignedPrincipalId?: string;
  currentVersion: number;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type RfpVersion = {
  id: string;
  tenantId: string;
  rfpId: string;
  versionNumber: number;
  summary: string;
  createdAt: string;
  createdByPrincipalId: string;
};

export function rfpCodePattern(code: string): boolean {
  return /^RFP-[0-9]{4}-[0-9]{4,6}$/.test(code.trim());
}
