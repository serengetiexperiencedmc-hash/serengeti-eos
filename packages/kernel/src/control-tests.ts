export const CAMPAIGN_STATUSES = ["planned", "in_progress", "closed"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  planned: "Planned",
  in_progress: "In progress",
  closed: "Closed",
};

export function isValidCampaignStatus(value: string): value is CampaignStatus {
  return (CAMPAIGN_STATUSES as readonly string[]).includes(value);
}

export function nextCampaignCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^CTC-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `CTC-${String(max + 1).padStart(4, "0")}`;
}

export function canMutateCampaign(
  actorType: string,
): { allowed: true } | { allowed: false; reason: "ai_actor" } {
  if (actorType !== "Human") return { allowed: false, reason: "ai_actor" };
  return { allowed: true };
}

export function canTransitionCampaign(
  from: CampaignStatus,
  action: "start" | "close",
): { allowed: true; next: CampaignStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "start" && from === "planned") return { allowed: true, next: "in_progress" };
  if (action === "close" && from !== "closed") return { allowed: true, next: "closed" };
  return { allowed: false, reason: "invalid_transition" };
}

export type ControlTestCampaign = {
  id: string;
  tenantId: string;
  campaignCode: string;
  title: string;
  status: CampaignStatus;
  description?: string;
  ownerLabel?: string;
  controlId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
