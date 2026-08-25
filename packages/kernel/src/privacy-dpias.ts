export const PRIVACY_DPIA_STATUSES = ["open", "done", "cancelled"] as const;
export type PrivacyDpiaStatus = (typeof PRIVACY_DPIA_STATUSES)[number];

export const PRIVACY_DPIA_STATUS_LABELS: Record<PrivacyDpiaStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidPrivacyDpiaStatus(value: string): value is PrivacyDpiaStatus {
  return (PRIVACY_DPIA_STATUSES as readonly string[]).includes(value);
}

export function nextDpiaCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^DPI-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `DPI-${String(max + 1).padStart(4, "0")}`;
}

export function canMutatePrivacyDpia(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchPrivacyDpiaStatus(
  from: PrivacyDpiaStatus,
  to: PrivacyDpiaStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type PrivacyDpia = {
  id: string;
  tenantId: string;
  dpiaCode: string;
  title: string;
  status: PrivacyDpiaStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
