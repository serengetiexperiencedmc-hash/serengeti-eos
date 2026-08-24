export const ITSM_RELEASE_STATUSES = ["open", "done", "cancelled"] as const;
export type ItsmReleaseStatus = (typeof ITSM_RELEASE_STATUSES)[number];

export const ITSM_RELEASE_STATUS_LABELS: Record<ItsmReleaseStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidItsmReleaseStatus(value: string): value is ItsmReleaseStatus {
  return (ITSM_RELEASE_STATUSES as readonly string[]).includes(value);
}

export function nextReleaseCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^REL-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `REL-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateItsmRelease(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchItsmReleaseStatus(
  from: ItsmReleaseStatus,
  to: ItsmReleaseStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type ItsmRelease = {
  id: string;
  tenantId: string;
  releaseCode: string;
  title: string;
  status: ItsmReleaseStatus;
  notes?: string;
  ciId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
