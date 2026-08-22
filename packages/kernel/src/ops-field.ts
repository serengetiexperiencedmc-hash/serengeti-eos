import type { Classification } from "./types.js";

export type OpsAssignmentRole = "lead_coordinator" | "field_guide" | "logistics" | "guest_relations";

export type OpsAssignmentStatus = "active" | "completed";

export type OpsFieldTaskStatus = "pending" | "in_progress" | "complete";

export const OPS_FIELD_TASK_STATUSES = [
  "pending",
  "in_progress",
  "complete",
] as const satisfies readonly OpsFieldTaskStatus[];

export function canTransitionFieldTask(
  from: OpsFieldTaskStatus,
  to: OpsFieldTaskStatus,
): { allowed: boolean; reason?: string } {
  if (from === to) return { allowed: false, reason: "already_in_status" };
  if (from === "complete") return { allowed: false, reason: "terminal_status" };
  return { allowed: true };
}

export type OpsAssignment = {
  id: string;
  tenantId: string;
  bookingId: string;
  programmeId: string;
  principalId: string;
  role: OpsAssignmentRole;
  status: OpsAssignmentStatus;
  notes?: string;
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type OpsFieldTask = {
  id: string;
  tenantId: string;
  bookingId: string;
  assignmentId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: OpsFieldTaskStatus;
  completedAt?: string;
  completedByPrincipalId?: string;
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type OpsBrief = {
  id: string;
  tenantId: string;
  bookingId: string;
  programmeId: string;
  content: string;
  issuedAt?: string;
  issuedByPrincipalId?: string;
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export function canIssueOpsBrief(brief: Pick<OpsBrief, "issuedAt">): { allowed: boolean; reason?: string } {
  if (brief.issuedAt) return { allowed: false, reason: "brief_already_issued" };
  return { allowed: true };
}
