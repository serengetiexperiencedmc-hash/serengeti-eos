export const IT_ASSET_STATUSES = ["open", "done", "cancelled"] as const;
export type ItAssetStatus = (typeof IT_ASSET_STATUSES)[number];

export const IT_ASSET_STATUS_LABELS: Record<ItAssetStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export function isValidItAssetStatus(value: string): value is ItAssetStatus {
  return (IT_ASSET_STATUSES as readonly string[]).includes(value);
}

export function nextAssetCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^AST-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `AST-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateItAsset(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canPatchItAssetStatus(
  from: ItAssetStatus,
  to: ItAssetStatus,
): { allowed: true } | { allowed: false; reason: "done" | "cancelled" } {
  if (from === "done") return { allowed: false, reason: "done" };
  if (from === "cancelled") return { allowed: false, reason: "cancelled" };
  if (to === "open" || to === "done" || to === "cancelled") return { allowed: true };
  return { allowed: true };
}

export type ItAsset = {
  id: string;
  tenantId: string;
  assetCode: string;
  title: string;
  status: ItAssetStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
