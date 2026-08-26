export const PROCUREMENT_RECORD_STATUSES = ["open", "cancelled"] as const;
export type ProcurementRecordStatus = (typeof PROCUREMENT_RECORD_STATUSES)[number];

export const PROCUREMENT_RECORD_STATUS_LABELS: Record<ProcurementRecordStatus, string> = {
  open: "Open",
  cancelled: "Cancelled",
};

export function isValidProcurementRecordStatus(value: string): value is ProcurementRecordStatus {
  return (PROCUREMENT_RECORD_STATUSES as readonly string[]).includes(value);
}

export function nextProcurementCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^PRC-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `PRC-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateProcurementRecord(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchProcurementRecordStatus(
  from: ProcurementRecordStatus,
  to: ProcurementRecordStatus,
): { allowed: true } | { allowed: false; reason: "cancelled" | "invalid_transition" } {
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "cancelled" || to === "open") return { allowed: true };
  return { allowed: false, reason: "invalid_transition" };
}

export type ProcurementRecord = {
  id: string;
  tenantId: string;
  procurementCode: string;
  title: string;
  status: ProcurementRecordStatus;
  notes?: string;
  ownerLabel?: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
