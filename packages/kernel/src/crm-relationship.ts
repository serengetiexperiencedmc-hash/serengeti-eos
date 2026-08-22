import type { CrmRelationshipStatus } from "./crm.js";

export const CRM_RELATIONSHIP_STATUSES = [
  "Unknown",
  "Identified",
  "Contacted",
  "Engaged",
  "Partner",
  "Strategic",
  "Dormant",
  "Disqualified",
] as const satisfies readonly CrmRelationshipStatus[];

export function isValidRelationshipStatus(status: string): status is CrmRelationshipStatus {
  return (CRM_RELATIONSHIP_STATUSES as readonly string[]).includes(status);
}

const FORWARD: Record<string, readonly CrmRelationshipStatus[]> = {
  Unknown: ["Identified", "Dormant", "Disqualified"],
  Identified: ["Contacted", "Dormant", "Disqualified"],
  Contacted: ["Engaged", "Dormant", "Disqualified"],
  Engaged: ["Partner", "Dormant", "Disqualified"],
  Partner: ["Strategic", "Dormant", "Disqualified"],
  Strategic: ["Dormant", "Disqualified"],
  Dormant: ["Identified", "Contacted", "Engaged", "Partner", "Strategic", "Disqualified"],
  Disqualified: ["Identified"],
};

const BACKWARD_FROM = new Set<CrmRelationshipStatus>(["Partner", "Strategic", "Engaged", "Contacted"]);

export function canTransitionRelationship(
  from: CrmRelationshipStatus,
  to: CrmRelationshipStatus,
  reason?: string,
): boolean {
  if (from === to) return false;
  const allowed = FORWARD[from];
  if (!allowed?.includes(to)) return false;
  if (BACKWARD_FROM.has(from) && to !== "Dormant" && to !== "Disqualified") {
    const rank: Record<CrmRelationshipStatus, number> = {
      Unknown: 0,
      Identified: 1,
      Contacted: 2,
      Engaged: 3,
      Partner: 4,
      Strategic: 5,
      Dormant: 6,
      Disqualified: 7,
    };
    if (rank[to] < rank[from] && !reason?.trim()) return false;
  }
  return true;
}
