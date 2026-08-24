import { eosFetch } from "./eos-client";

export type ItsmChangeStatus = "open" | "done" | "cancelled";

export type ItsmChange = {
  id: string;
  changeCode: string;
  title: string;
  status: ItsmChangeStatus;
  notes?: string;
  ciId?: string;
  ciCode?: string;
};

export const ITSM_CHANGE_STATUS_LABELS: Record<ItsmChangeStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getItsmChangesHealth(token: string) {
  return eosFetch<{ increment: string; changes: number; openChanges: number }>("/v1/itsm/changes/health", {
    token,
  });
}

export async function listItsmChanges(token: string) {
  return eosFetch<{ items: ItsmChange[] }>("/v1/itsm/changes", { token });
}

export async function createItsmChange(
  token: string,
  input: {
    title: string;
    ciId?: string;
    notes?: string;
  },
) {
  return eosFetch<{ change: ItsmChange }>("/v1/itsm/changes", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchItsmChange(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: ItsmChangeStatus;
  },
) {
  return eosFetch<{ change: ItsmChange }>(`/v1/itsm/changes/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
