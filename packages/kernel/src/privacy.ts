export const PROCESSING_ACTIVITY_STATUSES = ["open", "retired"] as const;
export type ProcessingActivityStatus = (typeof PROCESSING_ACTIVITY_STATUSES)[number];

export const PROCESSING_ACTIVITY_STATUS_LABELS: Record<ProcessingActivityStatus, string> = {
  open: "Open",
  retired: "Retired",
};

export const DSR_STATUSES = ["open", "in_progress", "closed"] as const;
export type DsrStatus = (typeof DSR_STATUSES)[number];

export const DSR_STATUS_LABELS: Record<DsrStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

export const DSR_REQUEST_TYPES = ["access", "erasure", "rectification"] as const;
export type DsrRequestType = (typeof DSR_REQUEST_TYPES)[number];

export const DSR_REQUEST_TYPE_LABELS: Record<DsrRequestType, string> = {
  access: "Access",
  erasure: "Erasure (case only)",
  rectification: "Rectification",
};

export function isValidProcessingActivityStatus(value: string): value is ProcessingActivityStatus {
  return (PROCESSING_ACTIVITY_STATUSES as readonly string[]).includes(value);
}

export function isValidDsrStatus(value: string): value is DsrStatus {
  return (DSR_STATUSES as readonly string[]).includes(value);
}

export function isValidDsrRequestType(value: string): value is DsrRequestType {
  return (DSR_REQUEST_TYPES as readonly string[]).includes(value);
}

export function nextProcessingActivityCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^RPA-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `RPA-${String(max + 1).padStart(4, "0")}`;
}

export function nextDsrCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^DSR-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `DSR-${String(max + 1).padStart(4, "0")}`;
}

export function canMutatePrivacy(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canRetireProcessingActivity(
  from: ProcessingActivityStatus,
): { allowed: true; next: ProcessingActivityStatus } | { allowed: false; reason: "invalid_transition" } {
  if (from === "open") return { allowed: true, next: "retired" };
  return { allowed: false, reason: "invalid_transition" };
}

export function canTransitionDsr(
  from: DsrStatus,
  action: "start" | "close",
): { allowed: true; next: DsrStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "start" && from === "open") return { allowed: true, next: "in_progress" };
  if (action === "close" && from === "in_progress") return { allowed: true, next: "closed" };
  return { allowed: false, reason: "invalid_transition" };
}

export function canCloseDsrBy(
  createdByPrincipalId: string,
  actorPrincipalId: string,
): { allowed: true } | { allowed: false; reason: "sod" } {
  if (createdByPrincipalId === actorPrincipalId) return { allowed: false, reason: "sod" };
  return { allowed: true };
}

export type PrivacyProcessingActivity = {
  id: string;
  tenantId: string;
  activityCode: string;
  title: string;
  status: ProcessingActivityStatus;
  purpose?: string;
  ownerLabel?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type PrivacyDsrCase = {
  id: string;
  tenantId: string;
  dsrCode: string;
  requestType: DsrRequestType;
  status: DsrStatus;
  subjectLabel?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
