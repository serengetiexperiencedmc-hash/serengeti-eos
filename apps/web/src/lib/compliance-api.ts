import { eosFetch } from "./eos-client";

export type ObligationStatus = "open" | "in_force" | "closed";

export type ComplianceObligation = {
  id: string;
  obligationCode: string;
  title: string;
  status: ObligationStatus;
  ownerLabel?: string;
};

export const OBLIGATION_STATUS_LABELS: Record<ObligationStatus, string> = {
  open: "Open",
  in_force: "In force",
  closed: "Closed",
};

export async function getComplianceHealth(token: string) {
  return eosFetch<{ increment: string; obligations: number; openObligations: number }>(
    "/v1/compliance/health",
    { token },
  );
}

export async function listObligations(token: string) {
  return eosFetch<{ items: ComplianceObligation[] }>("/v1/compliance/obligations", { token });
}

export async function createObligation(token: string, input: { title: string; ownerLabel?: string }) {
  return eosFetch<{ obligation: ComplianceObligation }>("/v1/compliance/obligations", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionObligation(token: string, id: string, action: "activate" | "close") {
  return eosFetch<{ obligation: ComplianceObligation }>(`/v1/compliance/obligations/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}
