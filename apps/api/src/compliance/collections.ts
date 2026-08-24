import type { ComplianceObligation } from "@sedmc/kernel";
import type { Store } from "../store.js";

export const COMPLIANCE_SEED = {
  sampleObligationId: "90909090-9090-4909-8909-909090909090",
} as const;

export function ensureComplianceCollections(store: Store): void {
  if (!store.complianceObligations) store.complianceObligations = [];
}

export function seedDefaultCompliance(store: Store): void {
  ensureComplianceCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.complianceObligations.some((o) => o.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  store.complianceObligations.push({
    id: COMPLIANCE_SEED.sampleObligationId,
    tenantId: tenant.id,
    obligationCode: "OBL-0001",
    title: "Sample Dev/Test obligation",
    status: "open",
    ownerLabel: "Compliance (Dev/Test)",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  });
}
