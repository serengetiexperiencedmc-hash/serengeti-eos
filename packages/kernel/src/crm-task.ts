import type { CrmTaskStatus } from "./crm.js";

export const CRM_TASK_STATUSES = [
  "Open",
  "InProgress",
  "Completed",
  "Cancelled",
  "Deferred",
] as const satisfies readonly CrmTaskStatus[];

export const CRM_TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export function isValidTaskStatus(status: string): status is CrmTaskStatus {
  return (CRM_TASK_STATUSES as readonly string[]).includes(status);
}

export function isValidTaskPriority(priority: string): boolean {
  return (CRM_TASK_PRIORITIES as readonly string[]).includes(priority);
}

export const CRM_TASK_TRANSITIONS: Record<
  Exclude<CrmTaskStatus, "Completed" | "Cancelled">,
  readonly CrmTaskStatus[]
> = {
  Open: ["InProgress", "Deferred", "Cancelled"],
  InProgress: ["Open", "Completed", "Deferred", "Cancelled"],
  Deferred: ["Open", "InProgress", "Cancelled"],
};

export function canTransitionTask(from: CrmTaskStatus, to: CrmTaskStatus): boolean {
  if (from === "Completed" || from === "Cancelled") return false;
  if (to === "Completed" || to === "Cancelled") return true;
  return (CRM_TASK_TRANSITIONS[from] as readonly string[]).includes(to);
}

export function canCompleteTask(status: CrmTaskStatus): boolean {
  return status === "Open" || status === "InProgress" || status === "Deferred";
}

export function canCancelTask(status: CrmTaskStatus): boolean {
  return status !== "Completed" && status !== "Cancelled";
}
