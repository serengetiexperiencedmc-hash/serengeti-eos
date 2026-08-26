import { eosFetch } from "./eos-client";

export type ErmTreatmentStatus = "open" | "retired";

export type ErmTreatment = {
  id: string;
  treatmentCode: string;
  title: string;
  status: ErmTreatmentStatus;
  notes?: string;
  ownerLabel?: string;
  riskId?: string;
  riskCode?: string;
};

export const TREATMENT_STATUS_LABELS: Record<ErmTreatmentStatus, string> = {
  open: "Open",
  retired: "Retired",
};

export async function getErmTreatmentsHealth(token: string) {
  return eosFetch<{ increment: string; treatments: number; openTreatments: number }>(
    "/v1/erm/treatments/health",
    { token },
  );
}

export async function listErmTreatments(token: string) {
  return eosFetch<{ items: ErmTreatment[] }>("/v1/erm/treatments", { token });
}

export async function createErmTreatment(
  token: string,
  input: {
    title: string;
    notes?: string;
    ownerLabel?: string;
    riskId?: string;
  },
) {
  return eosFetch<{ treatment: ErmTreatment }>("/v1/erm/treatments", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchErmTreatment(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    ownerLabel?: string;
    riskId?: string | null;
    status?: ErmTreatmentStatus;
  },
) {
  return eosFetch<{ treatment: ErmTreatment }>(`/v1/erm/treatments/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
