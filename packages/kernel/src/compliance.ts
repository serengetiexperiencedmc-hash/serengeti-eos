export const OBLIGATION_STATUSES = ["open", "in_force", "closed"] as const;
export type ObligationStatus = (typeof OBLIGATION_STATUSES)[number];

export const OBLIGATION_STATUS_LABELS: Record<ObligationStatus, string> = {
  open: "Open",
  in_force: "In force",
  closed: "Closed",
};

export function isValidObligationStatus(value: string): value is ObligationStatus {
  return (OBLIGATION_STATUSES as readonly string[]).includes(value);
}

export function nextObligationCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^OBL-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `OBL-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateObligation(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canTransitionObligation(
  from: ObligationStatus,
  action: "activate" | "close",
): { allowed: true; next: ObligationStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "activate" && from === "open") return { allowed: true, next: "in_force" };
  if (action === "close" && from !== "closed") return { allowed: true, next: "closed" };
  return { allowed: false, reason: "invalid_transition" };
}

export type ComplianceObligation = {
  id: string;
  tenantId: string;
  obligationCode: string;
  title: string;
  status: ObligationStatus;
  ownerLabel?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
