import type { IaEngagement, IaWorkpaper } from "@sedmc/kernel";
import type { Store } from "../store.js";

export const AUDIT_IA_SEED = {
  sampleEngagementId: "85858585-8585-4858-8858-858585858585",
  sampleWorkpaperId: "86868686-8686-4868-8868-868686868686",
} as const;

export function ensureAuditIaCollections(store: Store): void {
  if (!store.iaEngagements) store.iaEngagements = [];
  if (!store.iaWorkpapers) store.iaWorkpapers = [];
}

export function seedDefaultAuditIa(store: Store): void {
  ensureAuditIaCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.iaEngagements.some((e) => e.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  const engagement: IaEngagement = {
    id: AUDIT_IA_SEED.sampleEngagementId,
    tenantId: tenant.id,
    engagementCode: "ENG-0001",
    title: "Sample Dev/Test internal audit engagement",
    objective: "Seeded engagement — not an external audit or opinion.",
    ownerLabel: "Head of Internal Audit (Dev/Test)",
    status: "planned",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  const workpaper: IaWorkpaper = {
    id: AUDIT_IA_SEED.sampleWorkpaperId,
    tenantId: tenant.id,
    engagementId: engagement.id,
    workpaperCode: "WP-0001",
    title: "Sample planning workpaper",
    body: "Draft notes only — not production evidence.",
    status: "draft",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  store.iaEngagements.push(engagement);
  store.iaWorkpapers.push(workpaper);
}
