import type { Principal } from "@sedmc/kernel";
import { recordAudit, type Store } from "../store.js";

export function denyCrmAudit(
  store: Store,
  principal: Principal,
  action: string,
  resourceType: string,
  correlationId: string,
  reason: string,
  resourceId?: string,
): void {
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType,
    ...(resourceId !== undefined ? { resourceId } : {}),
    correlationId,
    authorization: "deny",
    evidence: { reason },
  });
}

export function allowCrmAudit(
  store: Store,
  principal: Principal,
  action: string,
  resourceType: string,
  resourceId: string,
  correlationId: string,
  newState: unknown,
  previousState?: unknown,
): void {
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType,
    resourceId,
    correlationId,
    authorization: "allow",
    newState,
    ...(previousState !== undefined ? { previousState } : {}),
  });
}
