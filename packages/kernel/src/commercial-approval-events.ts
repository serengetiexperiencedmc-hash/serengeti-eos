export const COMMERCIAL_APPROVAL_EVENT_TYPES = [
  "commercial.approval.requested.v1",
  "commercial.approval.approved.v1",
  "commercial.approval.rejected.v1",
] as const;

export type CommercialApprovalEventType = (typeof COMMERCIAL_APPROVAL_EVENT_TYPES)[number];
