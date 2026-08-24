import { eosFetch } from "./eos-client";

export type ItsmProblemStatus = "open" | "done" | "cancelled";

export type ItsmProblem = {
  id: string;
  problemCode: string;
  title: string;
  status: ItsmProblemStatus;
  notes?: string;
  ticketId?: string;
  ticketCode?: string;
  ciId?: string;
  ciCode?: string;
};

export const ITSM_PROBLEM_STATUS_LABELS: Record<ItsmProblemStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getItsmProblemsHealth(token: string) {
  return eosFetch<{ increment: string; problems: number; openProblems: number }>("/v1/itsm/problems/health", {
    token,
  });
}

export async function listItsmProblems(token: string) {
  return eosFetch<{ items: ItsmProblem[] }>("/v1/itsm/problems", { token });
}

export async function createItsmProblem(
  token: string,
  input: {
    title: string;
    ticketId?: string;
    ciId?: string;
    notes?: string;
  },
) {
  return eosFetch<{ problem: ItsmProblem }>("/v1/itsm/problems", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchItsmProblem(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: ItsmProblemStatus;
  },
) {
  return eosFetch<{ problem: ItsmProblem }>(`/v1/itsm/problems/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
