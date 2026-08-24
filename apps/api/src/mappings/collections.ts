import type { RegulationControlMapping } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { COMPLIANCE_SEED } from "../compliance/collections.js";
import { GRC_SEED } from "../grc/collections.js";

export const MAPPING_SEED = {
  sampleMappingId: "96969696-9696-4969-8969-969696969696",
} as const;

export function ensureMappingCollections(store: Store): void {
  if (!store.mappingRecords) store.mappingRecords = [];
}

export function seedDefaultMappings(store: Store): void {
  ensureMappingCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.mappingRecords.some((m) => m.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  store.mappingRecords.push({
    id: MAPPING_SEED.sampleMappingId,
    tenantId: tenant.id,
    mappingCode: "MAP-0001",
    title: "Sample Dev/Test mapping",
    status: "draft",
    ownerLabel: "GRC (Dev/Test)",
    obligationId: COMPLIANCE_SEED.sampleObligationId,
    controlId: GRC_SEED.sampleControlId,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  });
}
