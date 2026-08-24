export const ITSM_CHANGE_STATUSES = ["open", "done", "cancelled"] as const;
export type ItsmChangeStatus = (typeof ITSM_CHANGE_STATUSES)[number];

export const ITSM_CHANGE_STATUS_LABELS: Record<ItsmChangeStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidItsmChangeStatus(value: string): value is ItsmChangeStatus {
  return (ITSM_CHANGE_STATUSES as readonly string[]).includes(value);
}

export function nextChangeCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^CHG-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `CHG-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateItsmChange(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchItsmChangeStatus(
  from: ItsmChangeStatus,
  to: ItsmChangeStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type ItsmChange = {
  id: string;
  tenantId: string;
  changeCode: string;
  title: string;
  status: ItsmChangeStatus;
  notes?: string;
  ciId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
