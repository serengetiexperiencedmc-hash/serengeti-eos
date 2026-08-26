export const DATASET_RECORD_STATUSES = ["open", "done", "cancelled"] as const;
export type DatasetRecordStatus = (typeof DATASET_RECORD_STATUSES)[number];

export const DATASET_RECORD_STATUS_LABELS: Record<DatasetRecordStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidDatasetRecordStatus(value: string): value is DatasetRecordStatus {
  return (DATASET_RECORD_STATUSES as readonly string[]).includes(value);
}

export function nextDatasetCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^DST-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `DST-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateDatasetRecord(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchDatasetRecordStatus(
  from: DatasetRecordStatus,
  to: DatasetRecordStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type DatasetRecord = {
  id: string;
  tenantId: string;
  datasetCode: string;
  title: string;
  status: DatasetRecordStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
