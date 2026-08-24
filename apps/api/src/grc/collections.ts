import type { GrcControl } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { COMPLIANCE_SEED } from "../compliance/collections.js";

export const GRC_SEED = {
  sampleControlId: "93939393-9393-4939-8939-939393939393",
} as const;

export function ensureGrcCollections(store: Store): void {
  if (!store.grcControls) store.grcControls = [];
}

export function seedDefaultGrc(store: Store): void {
  ensureGrcCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.grcControls.some((c) => c.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  store.grcControls.push({
    id: GRC_SEED.sampleControlId,
    tenantId: tenant.id,
    controlCode: "CTL-0001",
    title: "Sample Dev/Test control",
    status: "draft",
    ownerLabel: "GRC (Dev/Test)",
    obligationId: COMPLIANCE_SEED.sampleObligationId,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  });
}
