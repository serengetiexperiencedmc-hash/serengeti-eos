import { eosFetch } from "./eos-client";

export type ConsentRecordStatus = "open" | "done" | "cancelled";

export type ConsentRecord = {
  id: string;
  consentCode: string;
  title: string;
  status: ConsentRecordStatus;
  notes?: string;
};

export const CONSENT_RECORD_STATUS_LABELS: Record<ConsentRecordStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getConsentsHealth(token: string) {
  return eosFetch<{ increment: string; consents: number; openConsents: number }>("/v1/consents/health", {
    token,
  });
}

export async function listConsents(token: string) {
  return eosFetch<{ items: ConsentRecord[] }>("/v1/consents", { token });
}

export async function createConsent(
  token: string,
  input: {
    title: string;
    notes?: string;
  },
) {
  return eosFetch<{ consent: ConsentRecord }>("/v1/consents", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchConsent(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: ConsentRecordStatus;
  },
) {
  return eosFetch<{ consent: ConsentRecord }>(`/v1/consents/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
