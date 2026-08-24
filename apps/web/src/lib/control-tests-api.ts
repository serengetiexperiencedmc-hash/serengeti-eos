import { eosFetch } from "./eos-client";

export type CampaignStatus = "planned" | "in_progress" | "closed";

export type ControlTestCampaign = {
  id: string;
  campaignCode: string;
  title: string;
  status: CampaignStatus;
  description?: string;
  ownerLabel?: string;
  controlId?: string;
  controlCode?: string;
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  planned: "Planned",
  in_progress: "In progress",
  closed: "Closed",
};

export async function getCampaignsHealth(token: string) {
  return eosFetch<{ increment: string; campaigns: number; openCampaigns: number }>(
    "/v1/control-tests/health",
    { token },
  );
}

export async function listCampaigns(token: string) {
  return eosFetch<{ items: ControlTestCampaign[] }>("/v1/control-tests", { token });
}

export async function createCampaign(
  token: string,
  input: { title: string; description?: string; ownerLabel?: string; controlId?: string },
) {
  return eosFetch<{ campaign: ControlTestCampaign }>("/v1/control-tests", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionCampaign(token: string, id: string, action: "start" | "close") {
  return eosFetch<{ campaign: ControlTestCampaign }>(`/v1/control-tests/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}
