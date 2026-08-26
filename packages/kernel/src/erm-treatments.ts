export const TREATMENT_STATUSES = ["open", "retired"] as const;
export type TreatmentStatus = (typeof TREATMENT_STATUSES)[number];

export const TREATMENT_STATUS_LABELS: Record<TreatmentStatus, string> = {
  open: "Open",
  retired: "Retired",
};

export function isValidTreatmentStatus(value: string): value is TreatmentStatus {
  return (TREATMENT_STATUSES as readonly string[]).includes(value);
}

export function nextTreatmentCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^TRT-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `TRT-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateTreatment(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchTreatmentStatus(
  from: TreatmentStatus,
  to: TreatmentStatus,
): { allowed: true } | { allowed: false; reason: "retired" | "invalid_transition" } {
  if (from === "retired") return { allowed: false, reason: "retired" };
  if (to === "open" || to === "retired") return { allowed: true };
  return { allowed: false, reason: "invalid_transition" };
}

export type ErmTreatment = {
  id: string;
  tenantId: string;
  treatmentCode: string;
  title: string;
  status: TreatmentStatus;
  notes?: string;
  ownerLabel?: string;
  riskId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
