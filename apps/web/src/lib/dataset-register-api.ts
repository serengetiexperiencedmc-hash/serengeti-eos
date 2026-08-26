import { eosFetch } from "./eos-client";

export type DatasetRecordStatus = "open" | "done" | "cancelled";

export type DatasetRecord = {
  id: string;
  datasetCode: string;
  title: string;
  status: DatasetRecordStatus;
  notes?: string;
};

export const DATASET_RECORD_STATUS_LABELS: Record<DatasetRecordStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getDatasetsHealth(token: string) {
  return eosFetch<{ increment: string; datasets: number; openDatasets: number }>("/v1/datasets/health", {
    token,
  });
}

export async function listDatasets(token: string) {
  return eosFetch<{ items: DatasetRecord[] }>("/v1/datasets", { token });
}

export async function createDataset(
  token: string,
  input: {
    title: string;
    notes?: string;
  },
) {
  return eosFetch<{ dataset: DatasetRecord }>("/v1/datasets", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchDataset(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: DatasetRecordStatus;
  },
) {
  return eosFetch<{ dataset: DatasetRecord }>(`/v1/datasets/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
