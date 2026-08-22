import type { Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";

export function allowOpsAudit(
  store: Store,
  principal: Principal,
  permission: string,
  resourceType: string,
  resourceId: string,
  correlationId: string,
  detail?: unknown,
): void {
  store.actions.push({
    principalId: principal.id,
    action: `${permission}:${resourceType}`,
    objectId: resourceId,
  });
  void correlationId;
  void detail;
}

export function denyOpsAudit(
  store: Store,
  principal: Principal,
  permission: string,
  resourceType: string,
  correlationId: string,
  reason?: string,
  resourceId?: string,
): void {
  store.actions.push({
    principalId: principal.id,
    action: `deny:${permission}:${resourceType}:${reason ?? "unknown"}`,
    objectId: resourceId ?? correlationId,
  });
}
