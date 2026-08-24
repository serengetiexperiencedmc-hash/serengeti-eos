import { eosFetch } from "./eos-client";

export type ProcessingActivityStatus = "open" | "retired";
export type DsrStatus = "open" | "in_progress" | "closed";
export type DsrRequestType = "access" | "erasure" | "rectification";

export type PrivacyProcessingActivity = {
  id: string;
  activityCode: string;
  title: string;
  status: ProcessingActivityStatus;
  purpose?: string;
  ownerLabel?: string;
};

export type PrivacyDsrCase = {
  id: string;
  dsrCode: string;
  requestType: DsrRequestType;
  status: DsrStatus;
  subjectLabel?: string;
  note?: string;
};

export const PROCESSING_ACTIVITY_STATUS_LABELS: Record<ProcessingActivityStatus, string> = {
  open: "Open",
  retired: "Retired",
};

export const DSR_STATUS_LABELS: Record<DsrStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

export const DSR_REQUEST_TYPE_LABELS: Record<DsrRequestType, string> = {
  access: "Access",
  erasure: "Erasure (case only)",
  rectification: "Rectification",
};

export async function getPrivacyHealth(token: string) {
  return eosFetch<{
    increment: string;
    activities: number;
    openActivities: number;
    dsrs: number;
    openDsrs: number;
  }>("/v1/privacy/health", { token });
}

export async function listProcessingActivities(token: string) {
  return eosFetch<{ items: PrivacyProcessingActivity[] }>("/v1/privacy/activities", { token });
}

export async function createProcessingActivity(
  token: string,
  input: { title: string; purpose?: string; ownerLabel?: string },
) {
  return eosFetch<{ activity: PrivacyProcessingActivity }>("/v1/privacy/activities", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function retireProcessingActivity(token: string, id: string) {
  return eosFetch<{ activity: PrivacyProcessingActivity }>(`/v1/privacy/activities/${id}/retire`, {
    token,
    method: "POST",
    body: "{}",
  });
}

export async function listDsrCases(token: string) {
  return eosFetch<{ items: PrivacyDsrCase[] }>("/v1/privacy/dsrs", { token });
}

export async function createDsrCase(
  token: string,
  input: { requestType: DsrRequestType; subjectLabel?: string; note?: string },
) {
  return eosFetch<{ dsr: PrivacyDsrCase }>("/v1/privacy/dsrs", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionDsrCase(token: string, id: string, action: "start" | "close") {
  return eosFetch<{ dsr: PrivacyDsrCase }>(`/v1/privacy/dsrs/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}
