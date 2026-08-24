import { eosFetch } from "./eos-client";

export type OperationalIssueStatus = "open" | "in_progress" | "closed";

export type OperationalIssue = {
  id: string;
  issueCode: string;
  title: string;
  status: OperationalIssueStatus;
  description?: string;
  ownerLabel?: string;
  bookingId: string;
  bookingCode?: string;
};

export const OPERATIONAL_ISSUE_STATUS_LABELS: Record<OperationalIssueStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

export async function getOperationalIssuesHealth(token: string) {
  return eosFetch<{ increment: string; issues: number; openIssues: number }>("/v1/ops/issues/health", {
    token,
  });
}

export async function listOperationalIssues(token: string) {
  return eosFetch<{ items: OperationalIssue[] }>("/v1/ops/issues", { token });
}

export async function createOperationalIssue(
  token: string,
  input: { title: string; description?: string; ownerLabel?: string; bookingId: string },
) {
  return eosFetch<{ issue: OperationalIssue }>("/v1/ops/issues", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionOperationalIssue(token: string, id: string, action: "start" | "close") {
  return eosFetch<{ issue: OperationalIssue }>(`/v1/ops/issues/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}
