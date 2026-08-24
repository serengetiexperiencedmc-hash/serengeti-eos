export const CRISIS_ACTION_STATUSES = ["open", "done", "cancelled"] as const;
export type CrisisActionStatus = (typeof CRISIS_ACTION_STATUSES)[number];

export const CRISIS_ACTION_STATUS_LABELS: Record<CrisisActionStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidCrisisActionStatus(value: string): value is CrisisActionStatus {
  return (CRISIS_ACTION_STATUSES as readonly string[]).includes(value);
}

export function nextCrisisActionCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^ACT-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `ACT-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateCrisisAction(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canTransitionCrisisAction(
  from: CrisisActionStatus,
  action: "complete" | "cancel",
): { allowed: true; next: CrisisActionStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "complete" && from === "open") return { allowed: true, next: "done" };
  if (action === "cancel" && from === "open") return { allowed: true, next: "cancelled" };
  return { allowed: false, reason: "invalid_transition" };
}

export type CrisisAction = {
  id: string;
  tenantId: string;
  actionCode: string;
  title: string;
  status: CrisisActionStatus;
  ownerLabel?: string;
  notes?: string;
  crisisId: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
