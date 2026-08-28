export const SOURCING_EVENT_STATUSES = ["open", "retired"] as const;
export type SourcingEventStatus = (typeof SOURCING_EVENT_STATUSES)[number];

export const SOURCING_EVENT_STATUS_LABELS: Record<SourcingEventStatus, string> = {
  open: "Open",
  retired: "Retired",
};

export function isValidSourcingEventStatus(value: string): value is SourcingEventStatus {
  return (SOURCING_EVENT_STATUSES as readonly string[]).includes(value);
}

export function nextSourcingEventCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^SE-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `SE-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateSourcingEvent(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchSourcingEventStatus(
  from: SourcingEventStatus,
  to: SourcingEventStatus,
): { allowed: true } | { allowed: false; reason: "retired" | "invalid_transition" } {
  if (from === "retired") return { allowed: false, reason: "retired" };
  if (to === "open" || to === "retired") return { allowed: true };
  return { allowed: false, reason: "invalid_transition" };
}

export type SourcingEvent = {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  status: SourcingEventStatus;
  notes?: string;
  ownerLabel?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
