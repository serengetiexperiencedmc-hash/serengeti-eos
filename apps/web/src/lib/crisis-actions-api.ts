import { eosFetch } from "./eos-client";

export type CrisisActionStatus = "open" | "done" | "cancelled";

export type CrisisAction = {
  id: string;
  actionCode: string;
  title: string;
  status: CrisisActionStatus;
  ownerLabel?: string;
  notes?: string;
  crisisId: string;
  crisisCode?: string;
};

export const CRISIS_ACTION_STATUS_LABELS: Record<CrisisActionStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getCrisisActionsHealth(token: string) {
  return eosFetch<{ increment: string; actions: number; openActions: number }>("/v1/crisis/actions/health", {
    token,
  });
}

export async function listCrisisActions(token: string) {
  return eosFetch<{ items: CrisisAction[] }>("/v1/crisis/actions", { token });
}

export async function createCrisisAction(
  token: string,
  input: {
    title: string;
    crisisId: string;
    ownerLabel?: string;
    notes?: string;
  },
) {
  return eosFetch<{ action: CrisisAction }>("/v1/crisis/actions", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionCrisisAction(token: string, id: string, action: "complete" | "cancel") {
  return eosFetch<{ action: CrisisAction }>(`/v1/crisis/actions/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}
