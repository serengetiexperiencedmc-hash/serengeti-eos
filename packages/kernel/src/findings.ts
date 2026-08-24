export const FINDING_STATUSES = ["open", "in_progress", "closed"] as const;
export type FindingStatus = (typeof FINDING_STATUSES)[number];

export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

export function isValidFindingStatus(value: string): value is FindingStatus {
  return (FINDING_STATUSES as readonly string[]).includes(value);
}

export function nextFindingCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^FND-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `FND-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateFinding(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canTransitionFinding(
  from: FindingStatus,
  action: "start" | "close",
): { allowed: true; next: FindingStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "start" && from === "open") return { allowed: true, next: "in_progress" };
  if (action === "close" && from !== "closed") return { allowed: true, next: "closed" };
  return { allowed: false, reason: "invalid_transition" };
}

export type FindingRecord = {
  id: string;
  tenantId: string;
  findingCode: string;
  title: string;
  status: FindingStatus;
  description?: string;
  ownerLabel?: string;
  controlId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
