import { eosFetch } from "./eos-client";

export type ClassificationRecordStatus = "open" | "done" | "cancelled";

export type ClassificationRecord = {
  id: string;
  classificationCode: string;
  title: string;
  status: ClassificationRecordStatus;
  notes?: string;
};

export const CLASSIFICATION_RECORD_STATUS_LABELS: Record<ClassificationRecordStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getClassificationsHealth(token: string) {
  return eosFetch<{ increment: string; classifications: number; openClassifications: number }>(
    "/v1/classifications/health",
    {
      token,
    },
  );
}

export async function listClassifications(token: string) {
  return eosFetch<{ items: ClassificationRecord[] }>("/v1/classifications", { token });
}

export async function createClassification(
  token: string,
  input: {
    title: string;
    notes?: string;
  },
) {
  return eosFetch<{ classification: ClassificationRecord }>("/v1/classifications", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchClassification(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: ClassificationRecordStatus;
  },
) {
  return eosFetch<{ classification: ClassificationRecord }>(`/v1/classifications/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
