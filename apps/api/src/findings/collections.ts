import type { FindingRecord } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { GRC_SEED } from "../grc/collections.js";

export const FINDINGS_SEED = {
  sampleFindingId: "94949494-9494-4949-8949-949494949494",
} as const;

export function ensureFindingsCollections(store: Store): void {
  if (!store.findingRecords) store.findingRecords = [];
}

export function seedDefaultFindings(store: Store): void {
  ensureFindingsCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.findingRecords.some((f) => f.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  store.findingRecords.push({
    id: FINDINGS_SEED.sampleFindingId,
    tenantId: tenant.id,
    findingCode: "FND-0001",
    title: "Sample Dev/Test finding",
    status: "open",
    ownerLabel: "GRC (Dev/Test)",
    controlId: GRC_SEED.sampleControlId,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  });
}
