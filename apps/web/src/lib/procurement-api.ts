import { eosFetch } from "./eos-client";

export type ProcurementRecordStatus = "open" | "cancelled";

export type ProcurementRecord = {
  id: string;
  procurementCode: string;
  title: string;
  status: ProcurementRecordStatus;
  notes?: string;
  ownerLabel?: string;
  supplierId?: string;
  supplierCode?: string;
};

export const PROCUREMENT_RECORD_STATUS_LABELS: Record<ProcurementRecordStatus, string> = {
  open: "Open",
  cancelled: "Cancelled",
};

export async function getProcurementHealth(token: string) {
  return eosFetch<{ increment: string; records: number; openRecords: number }>("/v1/procurement/health", {
    token,
  });
}

export async function listProcurementRecords(token: string) {
  return eosFetch<{ items: ProcurementRecord[] }>("/v1/procurement", { token });
}

export async function createProcurementRecord(
  token: string,
  input: {
    title: string;
    notes?: string;
    ownerLabel?: string;
    supplierId?: string;
  },
) {
  return eosFetch<{ record: ProcurementRecord }>("/v1/procurement", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchProcurementRecord(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    ownerLabel?: string;
    supplierId?: string | null;
    status?: ProcurementRecordStatus;
  },
) {
  return eosFetch<{ record: ProcurementRecord }>(`/v1/procurement/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
