import type { ErmRisk } from "@sedmc/kernel";
import type { Store } from "../store.js";

export const ERM_SEED = {
  sampleRiskId: "83838383-8383-4838-8838-838383838383",
} as const;

export function ensureErmCollections(store: Store): void {
  if (!store.ermRisks) store.ermRisks = [];
}

export function seedDefaultErm(store: Store): void {
  ensureErmCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.ermRisks.some((r) => r.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  const risk: ErmRisk = {
    id: ERM_SEED.sampleRiskId,
    tenantId: tenant.id,
    riskCode: "RSK-0001",
    title: "Sample Dev/Test residual risk",
    summary: "Seeded register row — not a legal or privacy record.",
    likelihood: 3,
    impact: 3,
    status: "open",
    ownerLabel: "CRO (Dev/Test)",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  store.ermRisks.push(risk);
}
