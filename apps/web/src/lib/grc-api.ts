import { eosFetch } from "./eos-client";

export type ControlStatus = "draft" | "active" | "retired";

export type GrcControl = {
  id: string;
  controlCode: string;
  title: string;
  status: ControlStatus;
  description?: string;
  ownerLabel?: string;
  obligationId?: string;
  obligationCode?: string;
};

export const CONTROL_STATUS_LABELS: Record<ControlStatus, string> = {
  draft: "Draft",
  active: "Active",
  retired: "Retired",
};

export async function getGrcHealth(token: string) {
  return eosFetch<{ increment: string; controls: number; openControls: number }>("/v1/grc/health", {
    token,
  });
}

export async function listControls(token: string) {
  return eosFetch<{ items: GrcControl[] }>("/v1/grc/controls", { token });
}

export async function createControl(
  token: string,
  input: { title: string; description?: string; ownerLabel?: string; obligationId?: string },
) {
  return eosFetch<{ control: GrcControl }>("/v1/grc/controls", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionControl(token: string, id: string, action: "activate" | "retire") {
  return eosFetch<{ control: GrcControl }>(`/v1/grc/controls/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}
