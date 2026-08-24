import { eosFetch } from "./eos-client";

export type FindingStatus = "open" | "in_progress" | "closed";

export type FindingRecord = {
  id: string;
  findingCode: string;
  title: string;
  status: FindingStatus;
  description?: string;
  ownerLabel?: string;
  controlId?: string;
  controlCode?: string;
};

export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

export async function getFindingsHealth(token: string) {
  return eosFetch<{ increment: string; findings: number; openFindings: number }>("/v1/findings/health", {
    token,
  });
}

export async function listFindings(token: string) {
  return eosFetch<{ items: FindingRecord[] }>("/v1/findings", { token });
}

export async function createFinding(
  token: string,
  input: { title: string; description?: string; ownerLabel?: string; controlId?: string },
) {
  return eosFetch<{ finding: FindingRecord }>("/v1/findings", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionFinding(token: string, id: string, action: "start" | "close") {
  return eosFetch<{ finding: FindingRecord }>(`/v1/findings/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}
