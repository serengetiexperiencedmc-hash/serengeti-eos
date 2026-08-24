import { eosFetch } from "./eos-client";

export type MappingStatus = "draft" | "active" | "retired";

export type RegulationControlMapping = {
  id: string;
  mappingCode: string;
  title: string;
  status: MappingStatus;
  description?: string;
  ownerLabel?: string;
  obligationId?: string;
  obligationCode?: string;
  controlId?: string;
  controlCode?: string;
};

export const MAPPING_STATUS_LABELS: Record<MappingStatus, string> = {
  draft: "Draft",
  active: "Active",
  retired: "Retired",
};

export async function getMappingsHealth(token: string) {
  return eosFetch<{ increment: string; mappings: number; openMappings: number }>("/v1/mappings/health", {
    token,
  });
}

export async function listMappings(token: string) {
  return eosFetch<{ items: RegulationControlMapping[] }>("/v1/mappings", { token });
}

export async function createMapping(
  token: string,
  input: {
    title: string;
    description?: string;
    ownerLabel?: string;
    obligationId?: string;
    controlId?: string;
  },
) {
  return eosFetch<{ mapping: RegulationControlMapping }>("/v1/mappings", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionMapping(token: string, id: string, action: "activate" | "retire") {
  return eosFetch<{ mapping: RegulationControlMapping }>(`/v1/mappings/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}
