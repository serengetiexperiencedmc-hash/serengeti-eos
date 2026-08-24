export const OPERATIONAL_ISSUE_STATUSES = ["open", "in_progress", "closed"] as const;
export type OperationalIssueStatus = (typeof OPERATIONAL_ISSUE_STATUSES)[number];

export const OPERATIONAL_ISSUE_STATUS_LABELS: Record<OperationalIssueStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

export function isValidOperationalIssueStatus(value: string): value is OperationalIssueStatus {
  return (OPERATIONAL_ISSUE_STATUSES as readonly string[]).includes(value);
}

export function nextOperationalIssueCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^ISS-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `ISS-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateOperationalIssue(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canTransitionOperationalIssue(
  from: OperationalIssueStatus,
  action: "start" | "close",
): { allowed: true; next: OperationalIssueStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "start" && from === "open") return { allowed: true, next: "in_progress" };
  if (action === "close" && from !== "closed") return { allowed: true, next: "closed" };
  return { allowed: false, reason: "invalid_transition" };
}

export type OperationalIssue = {
  id: string;
  tenantId: string;
  issueCode: string;
  title: string;
  status: OperationalIssueStatus;
  description?: string;
  ownerLabel?: string;
  bookingId: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
