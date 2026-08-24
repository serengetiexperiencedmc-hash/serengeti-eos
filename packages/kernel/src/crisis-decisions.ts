export const CRISIS_DECISION_STATUSES = ["recorded", "superseded"] as const;
export type CrisisDecisionStatus = (typeof CRISIS_DECISION_STATUSES)[number];

export const CRISIS_DECISION_STATUS_LABELS: Record<CrisisDecisionStatus, string> = {
  recorded: "Recorded",
  superseded: "Superseded",
};

export function isValidCrisisDecisionStatus(value: string): value is CrisisDecisionStatus {
  return (CRISIS_DECISION_STATUSES as readonly string[]).includes(value);
}

export function nextCrisisDecisionCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^DEC-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `DEC-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateCrisisDecision(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canTransitionCrisisDecision(
  from: CrisisDecisionStatus,
  action: "supersede",
): { allowed: true; next: CrisisDecisionStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "supersede" && from === "recorded") return { allowed: true, next: "superseded" };
  return { allowed: false, reason: "invalid_transition" };
}

export type CrisisDecision = {
  id: string;
  tenantId: string;
  decisionCode: string;
  title: string;
  status: CrisisDecisionStatus;
  options?: string;
  chosenAction?: string;
  rationale?: string;
  authorityLabel?: string;
  crisisId: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
