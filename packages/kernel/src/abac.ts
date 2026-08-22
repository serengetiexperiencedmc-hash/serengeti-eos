import type { AuthzRequest, Classification } from "./types.js";
import { CLASSIFICATION_RANK } from "./types.js";

export function tenantAllows(req: AuthzRequest): boolean {
  if (!req.resource) return true;
  return req.resource.tenantId === req.principal.tenantId;
}

export function clearanceAllows(clearance: Classification, resource: Classification): boolean {
  return CLASSIFICATION_RANK[clearance] >= CLASSIFICATION_RANK[resource];
}

export function abacAllows(req: AuthzRequest): { allow: boolean; reason: string } {
  if (req.principal.actorType === "AiAgent" && req.action.startsWith("approve:")) {
    return { allow: false, reason: "ai_cannot_approve" };
  }
  if (req.resource && !tenantAllows(req)) {
    return { allow: false, reason: "tenant_isolation" };
  }
  if (req.resource && !clearanceAllows(req.principal.classificationClearance, req.resource.classification)) {
    return { allow: false, reason: "classification" };
  }
  if (
    req.resource?.programmeId &&
    req.principal.programmeIds &&
    req.principal.programmeIds.length > 0 &&
    !req.principal.programmeIds.includes(req.resource.programmeId) &&
    !req.principal.permissions.includes("exec:read:command_center")
  ) {
    return { allow: false, reason: "programme_scope" };
  }
  if (
    req.resource &&
    (req.resource.classification === "Restricted" || req.resource.classification === "HighlyRestricted") &&
    req.principal.actorType === "AiAgent"
  ) {
    return { allow: false, reason: "ai_restricted_data" };
  }
  return { allow: true, reason: "abac_allow" };
}
