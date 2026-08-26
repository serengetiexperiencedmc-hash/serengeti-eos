export const KRI_STATUSES = ["open", "retired"] as const;
export type KriStatus = (typeof KRI_STATUSES)[number];

export const KRI_STATUS_LABELS: Record<KriStatus, string> = {
  open: "Open",
  retired: "Retired",
};

export function isValidKriStatus(value: string): value is KriStatus {
  return (KRI_STATUSES as readonly string[]).includes(value);
}

export function nextKriCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^KRI-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `KRI-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateKri(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchKriStatus(
  from: KriStatus,
  to: KriStatus,
): { allowed: true } | { allowed: false; reason: "retired" | "invalid_transition" } {
  if (from === "retired") return { allowed: false, reason: "retired" };
  if (to === "open" || to === "retired") return { allowed: true };
  return { allowed: false, reason: "invalid_transition" };
}

export type ErmKri = {
  id: string;
  tenantId: string;
  kriCode: string;
  title: string;
  status: KriStatus;
  notes?: string;
  ownerLabel?: string;
  riskId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
