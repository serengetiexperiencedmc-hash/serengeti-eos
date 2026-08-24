import { eosFetch } from "./eos-client";

export type ErmRiskStatus = "open" | "mitigating" | "accepted" | "closed";

export type ErmRisk = {
  id: string;
  riskCode: string;
  title: string;
  likelihood: number;
  impact: number;
  status: ErmRiskStatus;
  summary?: string;
  ownerLabel?: string;
};

export const RISK_STATUS_LABELS: Record<ErmRiskStatus, string> = {
  open: "Open",
  mitigating: "Mitigating",
  accepted: "Accepted",
  closed: "Closed",
};

export async function getErmHealth(token: string) {
  return eosFetch<{ increment: string; risks: number; openRisks: number }>("/v1/erm/health", { token });
}

export async function listErmRisks(token: string, query?: { q?: string; status?: string }) {
  const params = new URLSearchParams();
  if (query?.q) params.set("q", query.q);
  if (query?.status) params.set("status", query.status);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return eosFetch<{ items: ErmRisk[] }>(`/v1/erm/risks${suffix}`, { token });
}

export async function createErmRisk(
  token: string,
  input: { title: string; summary?: string; likelihood?: number; impact?: number; ownerLabel?: string },
) {
  return eosFetch<{ risk: ErmRisk }>("/v1/erm/risks", { token, method: "POST", body: JSON.stringify(input) });
}

export async function patchErmRisk(
  token: string,
  id: string,
  input: { title?: string; summary?: string; likelihood?: number; impact?: number; ownerLabel?: string },
) {
  return eosFetch<{ risk: ErmRisk }>(`/v1/erm/risks/${id}`, { token, method: "PATCH", body: JSON.stringify(input) });
}

export async function transitionErmRisk(token: string, id: string, action: "mitigate" | "accept" | "close") {
  return eosFetch<{ risk: ErmRisk }>(`/v1/erm/risks/${id}/${action}`, { token, method: "POST", body: "{}" });
}
