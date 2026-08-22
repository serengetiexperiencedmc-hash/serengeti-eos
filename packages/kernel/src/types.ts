export type ActorType = "Human" | "Service" | "AiAgent";
export type Classification =
  | "Public"
  | "Internal"
  | "Confidential"
  | "Restricted"
  | "HighlyRestricted";
export type AuthorizationResult = "allow" | "deny";

export type Principal = {
  id: string;
  tenantId: string;
  actorType: ActorType;
  email?: string;
  displayName: string;
  status: "active" | "suspended" | "deprovisioned";
  orgUnitId?: string;
  classificationClearance: Classification;
  roles: string[];
  permissions: string[];
  programmeIds?: string[];
};

export type Resource = {
  tenantId: string;
  type: string;
  id: string;
  classification: Classification;
  ownerPrincipalId?: string;
  programmeId?: string;
};

export type AuthzRequest = {
  principal: Principal;
  permission: string;
  action: string;
  resource?: Resource;
  purpose?: string;
};

export type AuthzDecision = {
  result: AuthorizationResult;
  reason: string;
};

export type AuditRecord = {
  tenantId: string;
  occurredAt: string;
  actorType: ActorType;
  actorPrincipalId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  correlationId: string;
  authorization: AuthorizationResult;
  previousState?: unknown;
  newState?: unknown;
  evidence?: unknown;
};

export type ChainedAuditRecord = AuditRecord & {
  prevHash: string;
  rowHash: string;
};

export type SodRule = {
  key: string;
  actionA: string;
  actionB: string;
  sameObject: boolean;
};

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "escalated"
  | "expired";

export type ApprovalTask = {
  id: string;
  tenantId: string;
  actionClass: string;
  resourceType: string;
  resourceId: string;
  status: ApprovalStatus;
  requestedByPrincipalId: string;
  assignedToPrincipalId?: string;
};

export const GENESIS_HASH = "0".repeat(64);

export const CLASSIFICATION_RANK: Record<Classification, number> = {
  Public: 0,
  Internal: 1,
  Confidential: 2,
  Restricted: 3,
  HighlyRestricted: 4,
};
