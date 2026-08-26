import { eosFetch } from "./eos-client";

export type ItEndpointStatus = "open" | "done" | "cancelled";

export type ItEndpoint = {
  id: string;
  endpointCode: string;
  title: string;
  status: ItEndpointStatus;
  notes?: string;
};

export const IT_ENDPOINT_STATUS_LABELS: Record<ItEndpointStatus, string> = {
  open: "Open",
  done: "Done",
  cancelled: "Cancelled",
};

export async function getItEndpointsHealth(token: string) {
  return eosFetch<{ increment: string; endpoints: number; openEndpoints: number }>("/v1/endpoints/health", {
    token,
  });
}

export async function listItEndpoints(token: string) {
  return eosFetch<{ items: ItEndpoint[] }>("/v1/endpoints", { token });
}

export async function createItEndpoint(
  token: string,
  input: {
    title: string;
    notes?: string;
  },
) {
  return eosFetch<{ endpoint: ItEndpoint }>("/v1/endpoints", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchItEndpoint(
  token: string,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: ItEndpointStatus;
  },
) {
  return eosFetch<{ endpoint: ItEndpoint }>(`/v1/endpoints/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
