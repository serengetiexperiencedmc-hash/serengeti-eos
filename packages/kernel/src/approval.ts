import type { ActorType, ApprovalTask } from "./types.js";

export type DecisionInput = {
  task: ApprovalTask;
  actorPrincipalId: string;
  actorType: ActorType;
  outcome: "approved" | "rejected";
};

export function canDecide(input: DecisionInput): { allow: boolean; reason: string } {
  if (input.task.status !== "pending") {
    return { allow: false, reason: "not_pending" };
  }
  if (input.actorType === "AiAgent") {
    return { allow: false, reason: "ai_cannot_approve" };
  }
  if (input.actorPrincipalId === input.task.requestedByPrincipalId) {
    return { allow: false, reason: "self_approval_forbidden" };
  }
  return { allow: true, reason: "human_counterparty" };
}
