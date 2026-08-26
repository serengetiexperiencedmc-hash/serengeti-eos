import { eosFetch } from "./eos-client";

export type ErmKriStatus = "open" | "retired";

export type ErmKri = {
  id: string;
  kriCode: string;
  title: string;
  status: ErmKriStatus;
  notes?: string;
  ownerLabel?: string;
  riskId?: string;
  riskCode?: string;
};

export const KRI_STATUS_LABELS: Record<ErmKriStatus, string> = {
  open: "Open",
  retired: "Retired",
};

export async function getErmKrisHealth(token: string) {
  return eosFetch<{ increment: string; kris: number; openKris: number }>("/v1/erm/kris/health", {
    token,
  });
}

export async function listErmKris(token: string) {
  return eosFetch<{ items: ErmKri[] }>("/v1/erm/kris", { token });
}

export async function createErmKri(
  token: string,
  input: {
    title: string;
    notes?: string;
    ownerLabel?: string;
    riskId?: string;
  },
) {
  return eosFetch<{ kri: ErmKri }>("/v1/erm/kris", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchErmKri(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    ownerLabel?: string;
    riskId?: string | null;
    status?: ErmKriStatus;
  },
) {
  return eosFetch<{ kri: ErmKri }>(`/v1/erm/kris/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
