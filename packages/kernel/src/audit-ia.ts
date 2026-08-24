export const ENGAGEMENT_STATUSES = ["planned", "in_progress", "closed"] as const;
export type EngagementStatus = (typeof ENGAGEMENT_STATUSES)[number];

export const WORKPAPER_STATUSES = ["draft", "finalized"] as const;
export type WorkpaperStatus = (typeof WORKPAPER_STATUSES)[number];

export const ENGAGEMENT_STATUS_LABELS: Record<EngagementStatus, string> = {
  planned: "Planned",
  in_progress: "In progress",
  closed: "Closed",
};

export const WORKPAPER_STATUS_LABELS: Record<WorkpaperStatus, string> = {
  draft: "Draft",
  finalized: "Finalized",
};

export function isValidEngagementStatus(value: string): value is EngagementStatus {
  return (ENGAGEMENT_STATUSES as readonly string[]).includes(value);
}

export function isValidWorkpaperStatus(value: string): value is WorkpaperStatus {
  return (WORKPAPER_STATUSES as readonly string[]).includes(value);
}

export function nextEngagementCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^ENG-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `ENG-${String(max + 1).padStart(4, "0")}`;
}

export function nextWorkpaperCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^WP-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `WP-${String(max + 1).padStart(4, "0")}`;
}

export function canTransitionEngagement(
  from: EngagementStatus,
  action: "start" | "close",
): { allowed: true; next: EngagementStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "start" && from === "planned") return { allowed: true, next: "in_progress" };
  if (action === "close" && from !== "closed") return { allowed: true, next: "closed" };
  return { allowed: false, reason: "invalid_transition" };
}

export function canCloseEngagement(draftWorkpaperCount: number): { allowed: true } | { allowed: false; reason: "open_workpapers" } {
  if (draftWorkpaperCount > 0) return { allowed: false, reason: "open_workpapers" };
  return { allowed: true };
}

export function canFinalizeWorkpaper(
  createdByPrincipalId: string,
  actorPrincipalId: string,
): { allowed: true } | { allowed: false; reason: "sod" } {
  if (createdByPrincipalId === actorPrincipalId) return { allowed: false, reason: "sod" };
  return { allowed: true };
}

export type IaEngagement = {
  id: string;
  tenantId: string;
  engagementCode: string;
  title: string;
  objective?: string;
  ownerLabel?: string;
  status: EngagementStatus;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type IaWorkpaper = {
  id: string;
  tenantId: string;
  engagementId: string;
  workpaperCode: string;
  title: string;
  body?: string;
  status: WorkpaperStatus;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
