export const PROPOSAL_EVENT_TYPES = [
  "proposal.generated.v1",
  "proposal.sent.v1",
  "proposal.accepted.v1",
  "proposal.rejected.v1",
  "proposal.version.created.v1",
] as const;

export type ProposalEventType = (typeof PROPOSAL_EVENT_TYPES)[number];
