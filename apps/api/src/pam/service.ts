import {
  authorize,
  isProtectedPamGrantKey,
  isValidJitTtl,
  isValidSecretRefString,
  jitGrantStatus,
  newId,
  nextJitGrantCode,
  nextSecretRefCode,
  type PamJitGrant,
  type PamSecretRef,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allPrincipals, principalById } from "../store.js";
import { activeJitPermissionKeys, ensurePamCollections } from "./collections.js";

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function catalogPermissions(store: Store, tenantId: string): Set<string> {
  const keys = new Set<string>();
  for (const role of store.roles) {
    if (role.tenantId !== tenantId) continue;
    for (const key of role.permissionKeys) keys.add(key);
  }
  return keys;
}

export type PamSecretRefView = {
  id: string;
  refCode: string;
  label: string;
  secretRef: string;
  status: PamSecretRef["status"];
  purpose?: string;
};

export type PamJitGrantView = {
  id: string;
  grantCode: string;
  subjectEmail: string;
  permissionKey: string;
  expiresAt: string;
  status: ReturnType<typeof jitGrantStatus>;
  reason?: string;
};

function sanitizeRef(ref: PamSecretRef): PamSecretRefView {
  const view: PamSecretRefView = {
    id: ref.id,
    refCode: ref.refCode,
    label: ref.label,
    secretRef: ref.secretRef,
    status: ref.status,
  };
  if (ref.purpose) view.purpose = ref.purpose;
  return view;
}

function sanitizeGrant(store: Store, grant: PamJitGrant): PamJitGrantView {
  const subject = principalById(store, grant.subjectPrincipalId);
  const view: PamJitGrantView = {
    id: grant.id,
    grantCode: grant.grantCode,
    subjectEmail: subject?.email ?? "unknown",
    permissionKey: grant.permissionKey,
    expiresAt: grant.expiresAt,
    status: jitGrantStatus(grant),
  };
  if (grant.reason) view.reason = grant.reason;
  return view;
}

export function getPamHealth(store: Store, principal: Principal) {
  ensurePamCollections(store);
  const decision = authorize({ principal, permission: "pam:read:ref", action: "read:pam_health" });
  if (decision.result === "deny") return deny(decision.reason);
  const refs = store.pamSecretRefs.filter((r) => r.tenantId === principal.tenantId);
  const grants = store.pamJitGrants.filter((g) => g.tenantId === principal.tenantId);
  return {
    module: "pam",
    increment: "I14" as const,
    status: "ok" as const,
    refs: refs.length,
    activeRefs: refs.filter((r) => r.status === "active").length,
    activeGrants: grants.filter((g) => jitGrantStatus(g) === "active").length,
  };
}

export function listSecretRefs(store: Store, principal: Principal) {
  ensurePamCollections(store);
  const decision = authorize({ principal, permission: "pam:read:ref", action: "list:pam_ref" });
  if (decision.result === "deny") return deny(decision.reason);
  return {
    items: store.pamSecretRefs.filter((r) => r.tenantId === principal.tenantId).map(sanitizeRef),
  };
}

export function getSecretRef(store: Store, principal: Principal, id: string) {
  ensurePamCollections(store);
  const decision = authorize({ principal, permission: "pam:read:ref", action: "get:pam_ref" });
  if (decision.result === "deny") return deny(decision.reason);
  const ref = store.pamSecretRefs.find((r) => r.id === id && r.tenantId === principal.tenantId);
  if (!ref) return { error: "not_found" as const };
  return { ref: sanitizeRef(ref) };
}

export function createSecretRef(
  store: Store,
  principal: Principal,
  input: { label?: string; secretRef?: string; purpose?: string },
) {
  ensurePamCollections(store);
  const decision = authorize({ principal, permission: "pam:write:ref", action: "create:pam_ref" });
  if (decision.result === "deny") return deny(decision.reason);
  const label = input.label?.trim() ?? "";
  const secretRef = input.secretRef?.trim() ?? "";
  if (!label) return { error: "invalid" as const, reason: "label_required" };
  if (!isValidSecretRefString(secretRef)) return { error: "invalid" as const, reason: "invalid_secret_ref" };
  const purpose = input.purpose?.trim();
  if (purpose && purpose.length > 500) return { error: "invalid" as const, reason: "purpose_too_long" };
  const duplicate = store.pamSecretRefs.find(
    (r) => r.tenantId === principal.tenantId && r.status === "active" && r.secretRef.toLowerCase() === secretRef.toLowerCase(),
  );
  if (duplicate) return { error: "conflict" as const, reason: "duplicate_secret_ref" };
  const now = new Date().toISOString();
  const row: PamSecretRef = {
    id: newId(),
    tenantId: principal.tenantId,
    refCode: nextSecretRefCode(store.pamSecretRefs.filter((r) => r.tenantId === principal.tenantId).map((r) => r.refCode)),
    label,
    secretRef,
    status: "active",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (purpose) row.purpose = purpose;
  store.pamSecretRefs.push(row);
  return { ref: sanitizeRef(row) };
}

export function retireSecretRef(store: Store, principal: Principal, id: string) {
  ensurePamCollections(store);
  const decision = authorize({ principal, permission: "pam:write:ref", action: "retire:pam_ref" });
  if (decision.result === "deny") return deny(decision.reason);
  const ref = store.pamSecretRefs.find((r) => r.id === id && r.tenantId === principal.tenantId);
  if (!ref) return { error: "not_found" as const };
  if (ref.status === "retired") return { error: "conflict" as const, reason: "already_retired" };
  ref.status = "retired";
  ref.updatedAt = new Date().toISOString();
  ref.updatedByPrincipalId = principal.id;
  return { ref: sanitizeRef(ref) };
}

export function listJitGrants(store: Store, principal: Principal) {
  ensurePamCollections(store);
  const decision = authorize({ principal, permission: "pam:read:grant", action: "list:pam_grant" });
  if (decision.result === "deny") return deny(decision.reason);
  return {
    items: store.pamJitGrants.filter((g) => g.tenantId === principal.tenantId).map((g) => sanitizeGrant(store, g)),
  };
}

export function createJitGrant(
  store: Store,
  principal: Principal,
  input: { subjectEmail?: string; permissionKey?: string; ttlSeconds?: number; reason?: string },
) {
  ensurePamCollections(store);
  const decision = authorize({ principal, permission: "pam:write:grant", action: "create:pam_grant" });
  if (decision.result === "deny") return deny(decision.reason);
  const email = input.subjectEmail?.trim().toLowerCase() ?? "";
  const permissionKey = input.permissionKey?.trim() ?? "";
  const ttlSeconds = input.ttlSeconds ?? 0;
  if (!email) return { error: "invalid" as const, reason: "subject_email_required" };
  if (!permissionKey) return { error: "invalid" as const, reason: "permission_required" };
  if (!isValidJitTtl(ttlSeconds)) return { error: "invalid" as const, reason: "invalid_ttl" };
  if (isProtectedPamGrantKey(permissionKey)) return { error: "invalid" as const, reason: "protected_permission" };
  if (!catalogPermissions(store, principal.tenantId).has(permissionKey)) {
    return { error: "invalid" as const, reason: "unknown_permission" };
  }
  const reason = input.reason?.trim();
  if (reason && reason.length > 500) return { error: "invalid" as const, reason: "reason_too_long" };
  const subject = allPrincipals(store).find(
    (p) => p.tenantId === principal.tenantId && p.email?.toLowerCase() === email,
  );
  if (!subject) return { error: "not_found" as const };
  const now = Date.now();
  const row: PamJitGrant = {
    id: newId(),
    tenantId: principal.tenantId,
    grantCode: nextJitGrantCode(store.pamJitGrants.filter((g) => g.tenantId === principal.tenantId).map((g) => g.grantCode)),
    subjectPrincipalId: subject.id,
    permissionKey,
    expiresAt: new Date(now + ttlSeconds * 1000).toISOString(),
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString(),
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (reason) row.reason = reason;
  store.pamJitGrants.push(row);
  return { grant: sanitizeGrant(store, row) };
}

export function revokeJitGrant(store: Store, principal: Principal, id: string) {
  ensurePamCollections(store);
  const decision = authorize({ principal, permission: "pam:revoke:grant", action: "revoke:pam_grant" });
  if (decision.result === "deny") return deny(decision.reason);
  const grant = store.pamJitGrants.find((g) => g.id === id && g.tenantId === principal.tenantId);
  if (!grant) return { error: "not_found" as const };
  if (jitGrantStatus(grant) !== "active") return { error: "conflict" as const, reason: "not_active" };
  const now = new Date().toISOString();
  grant.revokedAt = now;
  grant.updatedAt = now;
  grant.updatedByPrincipalId = principal.id;
  return { grant: sanitizeGrant(store, grant) };
}

export function withJitPermissions(store: Store, principal: Principal): Principal {
  const extra = activeJitPermissionKeys(store, principal.tenantId, principal.id);
  if (extra.length === 0) return principal;
  return { ...principal, permissions: [...new Set([...principal.permissions, ...extra])] };
}
