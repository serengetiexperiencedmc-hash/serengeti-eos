import {
  authorize,
  canDecide,
  newId,
  sodViolation,
  type ActorType,
  type Classification,
  type Principal,
  type StoredPrincipal,
} from "@sedmc/kernel";
import {
  allPrincipals,
  principalById,
  rebuildPrincipalPermissions,
  recordAudit,
  type Store,
} from "./store.js";

function denyAudit(
  store: Store,
  principal: Principal,
  action: string,
  resourceType: string,
  correlationId: string,
  reason: string,
  resourceId?: string,
) {
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

export function listOrganisations(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "org:read:unit",
    action: "read:organisation",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return {
    items: [...store.organisations.values()].filter((o) => o.tenantId === principal.tenantId),
  };
}

export function listLocations(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "org:read:unit",
    action: "read:location",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { items: store.locations.filter((l) => l.tenantId === principal.tenantId) };
}

export function createLocation(
  store: Store,
  principal: Principal,
  input: { code: string; name: string; countryCode?: string; city?: string },
  correlationId: string,
) {
  const decision = authorize({
    principal,
    permission: "org:write:location",
    action: "write:location",
    resource: { tenantId: principal.tenantId, type: "location", id: "new", classification: "Internal" },
  });
  if (decision.result === "deny") {
    denyAudit(store, principal, "org:write:location", "location", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (store.locations.some((l) => l.tenantId === principal.tenantId && l.code === input.code)) {
    return { error: "conflict" as const, reason: "code_exists" };
  }
  const location = {
    id: newId(),
    tenantId: principal.tenantId,
    code: input.code,
    name: input.name,
    ...(input.countryCode !== undefined ? { countryCode: input.countryCode } : {}),
    ...(input.city !== undefined ? { city: input.city } : {}),
  };
  store.locations.push(location);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "org:write:location",
    resourceType: "location",
    resourceId: location.id,
    correlationId,
    authorization: "allow",
    newState: location,
  });
  return { location };
}

export function createOrgUnit(
  store: Store,
  principal: Principal,
  input: {
    organisationId: string;
    code: string;
    name: string;
    departmentKey: string;
    unitType: "business_unit" | "department" | "team" | "desk";
    parentId?: string;
    locationId?: string;
    costCenterId?: string;
  },
  correlationId: string,
) {
  const decision = authorize({
    principal,
    permission: "org:write:unit",
    action: "write:org_unit",
    resource: { tenantId: principal.tenantId, type: "org_unit", id: "new", classification: "Internal" },
  });
  if (decision.result === "deny") {
    denyAudit(store, principal, "org:write:unit", "org_unit", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const org = store.organisations.get(input.organisationId);
  if (!org || org.tenantId !== principal.tenantId) return { error: "not_found" as const };
  if (store.orgUnits.some((u) => u.tenantId === principal.tenantId && u.code === input.code)) {
    return { error: "conflict" as const, reason: "code_exists" };
  }
  const unit = {
    id: newId(),
    tenantId: principal.tenantId,
    organisationId: input.organisationId,
    ...(input.parentId !== undefined ? { parentId: input.parentId } : {}),
    code: input.code,
    name: input.name,
    departmentKey: input.departmentKey,
    unitType: input.unitType,
    ...(input.locationId !== undefined ? { locationId: input.locationId } : {}),
    ...(input.costCenterId !== undefined ? { costCenterId: input.costCenterId } : {}),
  };
  store.orgUnits.push(unit);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "org:write:unit",
    resourceType: "org_unit",
    resourceId: unit.id,
    correlationId,
    authorization: "allow",
    newState: unit,
  });
  return { unit };
}

export function createCostCenter(
  store: Store,
  principal: Principal,
  input: { code: string; name: string },
  correlationId: string,
) {
  const decision = authorize({
    principal,
    permission: "org:write:cost_center",
    action: "write:cost_center",
    resource: { tenantId: principal.tenantId, type: "cost_center", id: "new", classification: "Internal" },
  });
  if (decision.result === "deny") {
    denyAudit(store, principal, "org:write:cost_center", "cost_center", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (store.costCenters.some((c) => c.tenantId === principal.tenantId && c.code === input.code)) {
    return { error: "conflict" as const, reason: "code_exists" };
  }
  const costCenter = { id: newId(), tenantId: principal.tenantId, code: input.code, name: input.name };
  store.costCenters.push(costCenter);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "org:write:cost_center",
    resourceType: "cost_center",
    resourceId: costCenter.id,
    correlationId,
    authorization: "allow",
    newState: costCenter,
  });
  return { costCenter };
}

export function listPrincipalsAdmin(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "identity:read:principal",
    action: "read:principal",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return {
    items: allPrincipals(store)
      .filter((p) => p.tenantId === principal.tenantId)
      .map((p) => sanitizePrincipal(p)),
  };
}

function sanitizePrincipal(p: StoredPrincipal) {
  const { passwordHash: _omit, ...safe } = p;
  void _omit;
  return safe;
}

export function createPrincipal(
  store: Store,
  principal: Principal,
  input: {
    actorType: ActorType;
    email?: string;
    displayName: string;
    orgUnitId?: string;
    classificationClearance: Classification;
    attributes?: Record<string, string>;
  },
  correlationId: string,
) {
  const decision = authorize({
    principal,
    permission: "identity:write:principal",
    action: "write:principal",
    resource: { tenantId: principal.tenantId, type: "principal", id: "new", classification: "Confidential" },
  });
  if (decision.result === "deny") {
    denyAudit(store, principal, "identity:write:principal", "principal", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (principal.actorType === "AiAgent") {
    denyAudit(store, principal, "identity:write:principal", "principal", correlationId, "ai_cannot_admin");
    return { error: "forbidden" as const, reason: "ai_cannot_admin" };
  }
  const created: StoredPrincipal = {
    id: newId(),
    tenantId: principal.tenantId,
    actorType: input.actorType,
    ...(input.email !== undefined ? { email: input.email } : {}),
    displayName: input.displayName,
    status: "active",
    ...(input.orgUnitId !== undefined ? { orgUnitId: input.orgUnitId } : {}),
    classificationClearance: input.classificationClearance,
    roles: [],
    permissions: [],
    attributes: input.attributes ?? {},
  };
  if (created.email) store.principals.set(created.email, created);
  else store.principals.set(created.id, created);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "identity:write:principal",
    resourceType: "principal",
    resourceId: created.id,
    correlationId,
    authorization: "allow",
    newState: sanitizePrincipal(created),
  });
  return { principal: sanitizePrincipal(created) };
}

export function setPrincipalStatus(
  store: Store,
  principal: Principal,
  targetId: string,
  status: "active" | "suspended" | "deprovisioned",
  correlationId: string,
) {
  const decision = authorize({
    principal,
    permission: "identity:suspend:principal",
    action: "suspend:principal",
    resource: {
      tenantId: principal.tenantId,
      type: "principal",
      id: targetId,
      classification: "Confidential",
    },
  });
  if (decision.result === "deny") {
    denyAudit(store, principal, "identity:suspend:principal", "principal", correlationId, decision.reason, targetId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const target = principalById(store, targetId);
  if (!target || target.tenantId !== principal.tenantId) return { error: "not_found" as const };
  if (target.id === principal.id) {
    denyAudit(store, principal, "identity:suspend:principal", "principal", correlationId, "self_suspend_forbidden", targetId);
    return { error: "forbidden" as const, reason: "self_suspend_forbidden" };
  }
  const previous = { status: target.status };
  target.status = status;
  if (status !== "active") {
    for (const session of store.sessions) {
      if (session.principalId === target.id && !session.revokedAt) {
        session.revokedAt = new Date().toISOString();
      }
    }
  }
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "identity:suspend:principal",
    resourceType: "principal",
    resourceId: target.id,
    correlationId,
    authorization: "allow",
    previousState: previous,
    newState: { status },
  });
  return { principal: sanitizePrincipal(target) };
}

export function listRoles(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "authz:read:role",
    action: "read:role",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { items: store.roles.filter((r) => r.tenantId === principal.tenantId) };
}

export function grantRole(
  store: Store,
  principal: Principal,
  input: { principalId: string; roleKey: string; scopeOrgUnitId?: string; expiresAt?: string },
  correlationId: string,
) {
  const decision = authorize({
    principal,
    permission: "identity:grant:role",
    action: "grant:role",
    resource: {
      tenantId: principal.tenantId,
      type: "principal",
      id: input.principalId,
      classification: "Confidential",
    },
  });
  if (decision.result === "deny") {
    denyAudit(store, principal, "identity:grant:role", "role_grant", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (input.principalId === principal.id && (input.roleKey === "platform.admin" || input.roleKey === "platform.break_glass")) {
    denyAudit(store, principal, "identity:grant:role", "role_grant", correlationId, "self_privilege_escalation");
    return { error: "forbidden" as const, reason: "self_privilege_escalation" };
  }
  const target = principalById(store, input.principalId);
  if (!target || target.tenantId !== principal.tenantId) return { error: "not_found" as const };
  const role = store.roles.find((r) => r.tenantId === principal.tenantId && r.key === input.roleKey);
  if (!role) return { error: "not_found" as const, reason: "role_missing" };
  const grant = {
    id: newId(),
    tenantId: principal.tenantId,
    principalId: target.id,
    roleKey: input.roleKey,
    ...(input.scopeOrgUnitId !== undefined ? { scopeOrgUnitId: input.scopeOrgUnitId } : {}),
    grantedAt: new Date().toISOString(),
    ...(input.expiresAt !== undefined ? { expiresAt: input.expiresAt } : {}),
    grantedByPrincipalId: principal.id,
  };
  store.roleGrants.push(grant);
  rebuildPrincipalPermissions(store, target);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "identity:grant:role",
    resourceType: "role_grant",
    resourceId: grant.id,
    correlationId,
    authorization: "allow",
    newState: grant,
  });
  return { grant, principal: sanitizePrincipal(target) };
}

export function draftConfig(
  store: Store,
  principal: Principal,
  input: { key: string; value: unknown; effectiveFrom?: string },
  correlationId: string,
) {
  const decision = authorize({
    principal,
    permission: "config:write:item",
    action: "write:config",
    resource: {
      tenantId: principal.tenantId,
      type: "config",
      id: input.key,
      classification: "Confidential",
    },
  });
  if (decision.result === "deny") {
    denyAudit(store, principal, "config:write:item", "config", correlationId, decision.reason, input.key);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const existing = store.configVersions.filter(
    (c) => c.tenantId === principal.tenantId && c.key === input.key,
  );
  const version = (existing.reduce((max, c) => Math.max(max, c.version), 0) || 0) + 1;
  const draft = {
    id: newId(),
    tenantId: principal.tenantId,
    key: input.key,
    version,
    value: input.value,
    status: "draft" as const,
    createdByPrincipalId: principal.id,
    createdAt: new Date().toISOString(),
    ...(input.effectiveFrom !== undefined ? { effectiveFrom: input.effectiveFrom } : {}),
  };
  store.configVersions.push(draft);
  store.actions.push({
    principalId: principal.id,
    action: "config:write:item",
    objectId: `${input.key}:v${version}`,
  });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "config:write:item",
    resourceType: "config",
    resourceId: draft.id,
    correlationId,
    authorization: "allow",
    newState: draft,
  });
  return { version: draft };
}

export function approveConfig(
  store: Store,
  principal: Principal,
  versionId: string,
  correlationId: string,
) {
  const draft = store.configVersions.find((c) => c.id === versionId);
  if (!draft || draft.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "config:approve:item",
    action: "approve:config",
    resource: {
      tenantId: principal.tenantId,
      type: "config",
      id: draft.key,
      classification: "Confidential",
    },
  });
  if (decision.result === "deny") {
    denyAudit(store, principal, "config:approve:item", "config", correlationId, decision.reason, draft.id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const gate = canDecide({
    task: {
      id: draft.id,
      tenantId: draft.tenantId,
      actionClass: "config.approve",
      resourceType: "config",
      resourceId: `${draft.key}:v${draft.version}`,
      status: draft.status === "draft" ? "pending" : "approved",
      requestedByPrincipalId: draft.createdByPrincipalId,
    },
    actorPrincipalId: principal.id,
    actorType: principal.actorType,
    outcome: "approved",
  });
  if (!gate.allow) {
    denyAudit(store, principal, "config:approve:item", "config", correlationId, gate.reason, draft.id);
    return { error: "forbidden" as const, reason: gate.reason };
  }

  const sod = sodViolation(store.sodRules, store.actions, {
    principalId: principal.id,
    action: "config:approve:item",
    objectId: `${draft.key}:v${draft.version}`,
  });
  if (sod) {
    denyAudit(store, principal, "config:approve:item", "config", correlationId, "sod", draft.id);
    return { error: "forbidden" as const, reason: "sod" };
  }

  if (draft.status !== "draft") return { error: "conflict" as const, reason: "not_draft" };

  for (const other of store.configVersions) {
    if (
      other.tenantId === draft.tenantId &&
      other.key === draft.key &&
      other.status === "approved" &&
      other.id !== draft.id
    ) {
      other.status = "retired";
    }
  }
  draft.status = "approved";
  draft.approvedByPrincipalId = principal.id;
  draft.approvedAt = new Date().toISOString();
  draft.effectiveFrom = draft.effectiveFrom ?? draft.approvedAt;
  store.actions.push({
    principalId: principal.id,
    action: "config:approve:item",
    objectId: `${draft.key}:v${draft.version}`,
  });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "config:approve:item",
    resourceType: "config",
    resourceId: draft.id,
    correlationId,
    authorization: "allow",
    newState: draft,
  });
  return { version: draft };
}

export function rollbackConfig(
  store: Store,
  principal: Principal,
  input: { key: string; toVersion: number },
  correlationId: string,
) {
  const target = store.configVersions.find(
    (c) =>
      c.tenantId === principal.tenantId &&
      c.key === input.key &&
      c.version === input.toVersion &&
      (c.status === "approved" || c.status === "retired"),
  );
  if (!target) return { error: "not_found" as const };
  return draftConfig(
    store,
    principal,
    { key: input.key, value: target.value, effectiveFrom: new Date().toISOString() },
    correlationId,
  );
}

export function listConfigHistory(store: Store, principal: Principal, key: string) {
  const decision = authorize({
    principal,
    permission: "config:read:item",
    action: "read:config",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return {
    items: store.configVersions
      .filter((c) => c.tenantId === principal.tenantId && c.key === key)
      .sort((a, b) => b.version - a.version),
  };
}

export function listSessions(store: Store, principal: Principal, targetPrincipalId: string) {
  const decision = authorize({
    principal,
    permission: "session:read:principal",
    action: "read:session",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const target = principalById(store, targetPrincipalId);
  if (!target || target.tenantId !== principal.tenantId) return { error: "not_found" as const };
  return {
    items: store.sessions.filter((s) => s.principalId === targetPrincipalId && s.tenantId === principal.tenantId),
  };
}

export function revokeSession(
  store: Store,
  principal: Principal,
  sessionId: string,
  correlationId: string,
) {
  const decision = authorize({
    principal,
    permission: "session:revoke:principal",
    action: "revoke:session",
  });
  if (decision.result === "deny") {
    denyAudit(store, principal, "session:revoke:principal", "session", correlationId, decision.reason, sessionId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session || session.tenantId !== principal.tenantId) return { error: "not_found" as const };
  session.revokedAt = new Date().toISOString();
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "session:revoke:principal",
    resourceType: "session",
    resourceId: session.id,
    correlationId,
    authorization: "allow",
    newState: { revokedAt: session.revokedAt },
  });
  return { session };
}

export function listSodRules(store: Store, principal: Principal) {
  const decision = authorize({
    principal,
    permission: "authz:write:sod",
    action: "read:sod",
  });
  // Prefer read permission; platform admin has write which implies manage — allow if write or audit
  if (decision.result === "deny") {
    const read = authorize({ principal, permission: "audit:read:event", action: "read:sod" });
    if (read.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  }
  return { items: store.sodRules };
}
