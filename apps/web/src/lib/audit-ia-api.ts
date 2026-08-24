import { eosFetch } from "./eos-client";

export type EngagementStatus = "planned" | "in_progress" | "closed";
export type WorkpaperStatus = "draft" | "finalized";

export type IaEngagement = {
  id: string;
  engagementCode: string;
  title: string;
  status: EngagementStatus;
  workpaperCount: number;
  draftWorkpaperCount: number;
  objective?: string;
  ownerLabel?: string;
};

export type IaWorkpaper = {
  id: string;
  workpaperCode: string;
  engagementId: string;
  engagementCode: string;
  title: string;
  status: WorkpaperStatus;
  body?: string;
};

export const ENGAGEMENT_STATUS_LABELS: Record<EngagementStatus, string> = {
  planned: "Planned",
  in_progress: "In progress",
  closed: "Closed",
};

export async function getAuditIaHealth(token: string) {
  return eosFetch<{ increment: string; engagements: number; openEngagements: number; workpapers: number; draftWorkpapers: number }>(
    "/v1/audit-ia/health",
    { token },
  );
}

export async function listEngagements(token: string) {
  return eosFetch<{ items: IaEngagement[] }>("/v1/audit-ia/engagements", { token });
}

export async function createEngagement(token: string, input: { title: string; objective?: string; ownerLabel?: string }) {
  return eosFetch<{ engagement: IaEngagement }>("/v1/audit-ia/engagements", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionEngagement(token: string, id: string, action: "start" | "close") {
  return eosFetch<{ engagement: IaEngagement }>(`/v1/audit-ia/engagements/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}

export async function listWorkpapers(token: string, engagementId: string) {
  return eosFetch<{ items: IaWorkpaper[] }>(`/v1/audit-ia/engagements/${engagementId}/workpapers`, { token });
}

export async function createWorkpaper(token: string, engagementId: string, input: { title: string; body?: string }) {
  return eosFetch<{ workpaper: IaWorkpaper }>(`/v1/audit-ia/engagements/${engagementId}/workpapers`, {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function finalizeWorkpaper(token: string, id: string) {
  return eosFetch<{ workpaper: IaWorkpaper }>(`/v1/audit-ia/workpapers/${id}/finalize`, {
    token,
    method: "POST",
    body: "{}",
  });
}
