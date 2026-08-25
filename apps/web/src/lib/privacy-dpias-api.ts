import { eosFetch } from "./eos-client";

export type PrivacyDpiaStatus = "open" | "done" | "cancelled";

export type PrivacyDpia = {
  id: string;
  dpiaCode: string;
  title: string;
  status: PrivacyDpiaStatus;
  notes?: string;
};

export const PRIVACY_DPIA_STATUS_LABELS: Record<PrivacyDpiaStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getPrivacyDpiasHealth(token: string) {
  return eosFetch<{ increment: string; dpias: number; openDpias: number }>("/v1/privacy/dpias/health", {
    token,
  });
}

export async function listPrivacyDpias(token: string) {
  return eosFetch<{ items: PrivacyDpia[] }>("/v1/privacy/dpias", { token });
}

export async function createPrivacyDpia(
  token: string,
  input: {
    title: string;
    notes?: string;
  },
) {
  return eosFetch<{ dpia: PrivacyDpia }>("/v1/privacy/dpias", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchPrivacyDpia(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: PrivacyDpiaStatus;
  },
) {
  return eosFetch<{ dpia: PrivacyDpia }>(`/v1/privacy/dpias/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
