import type { PamJitGrant, PamSecretRef } from "@sedmc/kernel";
import type { Store } from "../store.js";

export const PAM_SEED = {
  sampleRefId: "82828282-8282-4828-8828-828282828282",
} as const;

export function ensurePamCollections(store: Store): void {
  if (!store.pamSecretRefs) store.pamSecretRefs = [];
  if (!store.pamJitGrants) store.pamJitGrants = [];
}

export function seedDefaultPam(store: Store): void {
  ensurePamCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.pamSecretRefs.some((r) => r.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  const ref: PamSecretRef = {
    id: PAM_SEED.sampleRefId,
    tenantId: tenant.id,
    refCode: "SRF-0001",
    label: "Dev/Test OLTP credential reference",
    secretRef: "ref://devtest/oltp/credentials",
    status: "active",
    purpose: "Opaque pointer only — no secret value stored.",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  store.pamSecretRefs.push(ref);
}

export function activeJitPermissionKeys(store: Store, tenantId: string, principalId: string, now = Date.now()): string[] {
  ensurePamCollections(store);
  const keys: string[] = [];
  for (const grant of store.pamJitGrants) {
    if (grant.tenantId !== tenantId || grant.subjectPrincipalId !== principalId) continue;
    if (grant.revokedAt) continue;
    if (new Date(grant.expiresAt).getTime() <= now) continue;
    keys.push(grant.permissionKey);
  }
  return keys;
}
