export const CLASSIFICATION_RECORD_STATUSES = ["open", "done", "cancelled"] as const;
export type ClassificationRecordStatus = (typeof CLASSIFICATION_RECORD_STATUSES)[number];

export const CLASSIFICATION_RECORD_STATUS_LABELS: Record<ClassificationRecordStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidClassificationRecordStatus(value: string): value is ClassificationRecordStatus {
  return (CLASSIFICATION_RECORD_STATUSES as readonly string[]).includes(value);
}

export function nextClassificationCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^CLS-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `CLS-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateClassificationRecord(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchClassificationRecordStatus(
  from: ClassificationRecordStatus,
  to: ClassificationRecordStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type ClassificationRecord = {
  id: string;
  tenantId: string;
  classificationCode: string;
  title: string;
  status: ClassificationRecordStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
