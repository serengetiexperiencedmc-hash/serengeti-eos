import { eosFetch } from "./eos-client";

export type CrisisDecisionStatus = "recorded" | "superseded";

export type CrisisDecision = {
  id: string;
  decisionCode: string;
  title: string;
  status: CrisisDecisionStatus;
  options?: string;
  chosenAction?: string;
  rationale?: string;
  authorityLabel?: string;
  crisisId: string;
  crisisCode?: string;
};

export const CRISIS_DECISION_STATUS_LABELS: Record<CrisisDecisionStatus, string> = {
  recorded: "Recorded",
  superseded: "Superseded",
};

export async function getCrisisDecisionsHealth(token: string) {
  return eosFetch<{ increment: string; decisions: number; recordedDecisions: number }>(
    "/v1/crisis/decisions/health",
    { token },
  );
}

export async function listCrisisDecisions(token: string) {
  return eosFetch<{ items: CrisisDecision[] }>("/v1/crisis/decisions", { token });
}

export async function createCrisisDecision(
  token: string,
  input: {
    title: string;
    crisisId: string;
    options?: string;
    chosenAction?: string;
    rationale?: string;
    authorityLabel?: string;
  },
) {
  return eosFetch<{ decision: CrisisDecision }>("/v1/crisis/decisions", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function supersedeCrisisDecision(token: string, id: string) {
  return eosFetch<{ decision: CrisisDecision }>(`/v1/crisis/decisions/${id}/supersede`, {
    token,
    method: "POST",
    body: "{}",
  });
}
