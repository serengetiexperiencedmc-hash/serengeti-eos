export const CONSENT_RECORD_STATUSES = ["open", "done", "cancelled"] as const;
export type ConsentRecordStatus = (typeof CONSENT_RECORD_STATUSES)[number];

export const CONSENT_RECORD_STATUS_LABELS: Record<ConsentRecordStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidConsentRecordStatus(value: string): value is ConsentRecordStatus {
  return (CONSENT_RECORD_STATUSES as readonly string[]).includes(value);
}

export function nextConsentCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^CNS-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `CNS-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateConsentRecord(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchConsentRecordStatus(
  from: ConsentRecordStatus,
  to: ConsentRecordStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type ConsentRecord = {
  id: string;
  tenantId: string;
  consentCode: string;
  title: string;
  status: ConsentRecordStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
