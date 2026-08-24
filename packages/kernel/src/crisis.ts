export const CRISIS_SEVERITIES = ["l2", "l3"] as const;
export type CrisisSeverity = (typeof CRISIS_SEVERITIES)[number];

export const CRISIS_STATUSES = ["open", "closed"] as const;
export type CrisisStatus = (typeof CRISIS_STATUSES)[number];

export const CRISIS_SEVERITY_LABELS: Record<CrisisSeverity, string> = {
  l2: "L2 Major incident",
  l3: "L3 Crisis",
};

export const CRISIS_STATUS_LABELS: Record<CrisisStatus, string> = {
  open: "Open",
  closed: "Closed",
};

export function isValidCrisisSeverity(value: string): value is CrisisSeverity {
  return (CRISIS_SEVERITIES as readonly string[]).includes(value);
}

export function isValidCrisisStatus(value: string): value is CrisisStatus {
  return (CRISIS_STATUSES as readonly string[]).includes(value);
}

export function nextCrisisCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^CRS-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `CRS-${String(max + 1).padStart(4, "0")}`;
}

export function nextTimelineCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^TLN-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `TLN-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateCrisis(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canCloseCrisis(
  from: CrisisStatus,
): { allowed: true; next: "closed" } | { allowed: false; reason: "already_closed" } {
  if (from === "closed") return { allowed: false, reason: "already_closed" };
  return { allowed: true, next: "closed" };
}

export function canCloseCrisisBy(
  createdByPrincipalId: string,
  actorPrincipalId: string,
): { allowed: true } | { allowed: false; reason: "sod" } {
  if (createdByPrincipalId === actorPrincipalId) return { allowed: false, reason: "sod" };
  return { allowed: true };
}

export function canWriteOpenCrisis(
  status: CrisisStatus,
): { allowed: true } | { allowed: false; reason: "case_closed" } {
  if (status === "closed") return { allowed: false, reason: "case_closed" };
  return { allowed: true };
}

export type CrisisCase = {
  id: string;
  tenantId: string;
  crisisCode: string;
  title: string;
  severity: CrisisSeverity;
  status: CrisisStatus;
  commanderLabel?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CrisisTimelineEntry = {
  id: string;
  tenantId: string;
  crisisId: string;
  entryCode: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
