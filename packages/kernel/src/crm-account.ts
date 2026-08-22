import type { CrmAccountStatus } from "./crm.js";

export const CRM_ACCOUNT_STATUSES = [
  "Prospect",
  "Active",
  "OnHold",
  "Closed",
  "Archived",
] as const satisfies readonly CrmAccountStatus[];

export function isValidAccountStatus(status: string): status is CrmAccountStatus {
  return (CRM_ACCOUNT_STATUSES as readonly string[]).includes(status);
}

export const CRM_ACCOUNT_TRANSITIONS: Record<
  Exclude<CrmAccountStatus, "Archived">,
  readonly Exclude<CrmAccountStatus, "Archived">[]
> = {
  Prospect: ["Active", "Closed"],
  Active: ["OnHold", "Closed"],
  OnHold: ["Active", "Closed"],
  Closed: [],
};

export function canTransitionAccount(from: CrmAccountStatus, to: CrmAccountStatus): boolean {
  if (from === "Archived" || to === "Archived") return false;
  return (CRM_ACCOUNT_TRANSITIONS[from] as readonly string[]).includes(to);
}

export function canArchiveAccount(status: CrmAccountStatus): boolean {
  return status === "Active" || status === "OnHold" || status === "Closed";
}

export const CRM_ACCOUNT_PRIORITIES = ["low", "medium", "high", "strategic"] as const;

export function isValidAccountPriority(priority: string): boolean {
  return (CRM_ACCOUNT_PRIORITIES as readonly string[]).includes(priority);
}
