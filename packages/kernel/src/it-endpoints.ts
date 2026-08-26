export const IT_ENDPOINT_STATUSES = ["open", "done", "cancelled"] as const;
export type ItEndpointStatus = (typeof IT_ENDPOINT_STATUSES)[number];

export const IT_ENDPOINT_STATUS_LABELS: Record<ItEndpointStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidItEndpointStatus(value: string): value is ItEndpointStatus {
  return (IT_ENDPOINT_STATUSES as readonly string[]).includes(value);
}

export function nextEndpointCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^END-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `END-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateItEndpoint(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchItEndpointStatus(
  from: ItEndpointStatus,
  to: ItEndpointStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type ItEndpoint = {
  id: string;
  tenantId: string;
  endpointCode: string;
  title: string;
  status: ItEndpointStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
