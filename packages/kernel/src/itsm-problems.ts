export const ITSM_PROBLEM_STATUSES = ["open", "done", "cancelled"] as const;
export type ItsmProblemStatus = (typeof ITSM_PROBLEM_STATUSES)[number];

export const ITSM_PROBLEM_STATUS_LABELS: Record<ItsmProblemStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidItsmProblemStatus(value: string): value is ItsmProblemStatus {
  return (ITSM_PROBLEM_STATUSES as readonly string[]).includes(value);
}

export function nextProblemCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^PRB-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `PRB-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateItsmProblem(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchItsmProblemStatus(
  from: ItsmProblemStatus,
  to: ItsmProblemStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type ItsmProblem = {
  id: string;
  tenantId: string;
  problemCode: string;
  title: string;
  status: ItsmProblemStatus;
  notes?: string;
  ticketId?: string;
  ciId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
