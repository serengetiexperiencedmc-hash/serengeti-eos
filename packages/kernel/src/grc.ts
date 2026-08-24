export const CONTROL_STATUSES = ["draft", "active", "retired"] as const;
export type ControlStatus = (typeof CONTROL_STATUSES)[number];

export const CONTROL_STATUS_LABELS: Record<ControlStatus, string> = {
  draft: "Draft",
  active: "Active",
  retired: "Retired",
};

export function isValidControlStatus(value: string): value is ControlStatus {
  return (CONTROL_STATUSES as readonly string[]).includes(value);
}

export function nextControlCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^CTL-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `CTL-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateControl(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canTransitionControl(
  from: ControlStatus,
  action: "activate" | "retire",
): { allowed: true; next: ControlStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "activate" && from === "draft") return { allowed: true, next: "active" };
  if (action === "retire" && from === "active") return { allowed: true, next: "retired" };
  return { allowed: false, reason: "invalid_transition" };
}

export type GrcControl = {
  id: string;
  tenantId: string;
  controlCode: string;
  title: string;
  status: ControlStatus;
  description?: string;
  ownerLabel?: string;
  obligationId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
