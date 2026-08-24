import { eosFetch } from "./eos-client";

export type CrisisSeverity = "l2" | "l3";
export type CrisisStatus = "open" | "closed";

export type CrisisCase = {
  id: string;
  crisisCode: string;
  title: string;
  severity: CrisisSeverity;
  status: CrisisStatus;
  timelineCount: number;
  commanderLabel?: string;
  summary?: string;
};

export type CrisisTimelineEntry = {
  id: string;
  entryCode: string;
  crisisId: string;
  crisisCode: string;
  body: string;
  createdAt: string;
};

export const CRISIS_SEVERITY_LABELS: Record<CrisisSeverity, string> = {
  l2: "L2 Major incident",
  l3: "L3 Crisis",
};

export const CRISIS_STATUS_LABELS: Record<CrisisStatus, string> = {
  open: "Open",
  closed: "Closed",
};

export async function getCrisisHealth(token: string) {
  return eosFetch<{ increment: string; cases: number; openCases: number; timelineEntries: number }>(
    "/v1/crisis/health",
    { token },
  );
}

export async function listCrisisCases(token: string) {
  return eosFetch<{ items: CrisisCase[] }>("/v1/crisis/cases", { token });
}

export async function createCrisisCase(
  token: string,
  input: { title: string; severity: CrisisSeverity; commanderLabel?: string; summary?: string },
) {
  return eosFetch<{ crisis: CrisisCase }>("/v1/crisis/cases", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function closeCrisisCase(token: string, id: string) {
  return eosFetch<{ crisis: CrisisCase }>(`/v1/crisis/cases/${id}/close`, {
    token,
    method: "POST",
    body: "{}",
  });
}

export async function listCrisisTimeline(token: string, crisisId: string) {
  return eosFetch<{ items: CrisisTimelineEntry[] }>(`/v1/crisis/cases/${crisisId}/timeline`, { token });
}

export async function createCrisisTimelineEntry(token: string, crisisId: string, input: { body: string }) {
  return eosFetch<{ entry: CrisisTimelineEntry }>(`/v1/crisis/cases/${crisisId}/timeline`, {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}
