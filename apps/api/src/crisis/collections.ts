import type { CrisisCase, CrisisTimelineEntry } from "@sedmc/kernel";
import type { Store } from "../store.js";

export const CRISIS_SEED = {
  sampleCaseId: "88888888-8888-4888-8888-888888888888",
  sampleTimelineId: "89898989-8989-4898-8898-898989898989",
} as const;

export function ensureCrisisCollections(store: Store): void {
  if (!store.crisisCases) store.crisisCases = [];
  if (!store.crisisTimelineEntries) store.crisisTimelineEntries = [];
}

export function seedDefaultCrisis(store: Store): void {
  ensureCrisisCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.crisisCases.some((c) => c.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  const crisis: CrisisCase = {
    id: CRISIS_SEED.sampleCaseId,
    tenantId: tenant.id,
    crisisCode: "CRS-0001",
    title: "Sample Dev/Test L2 overlay",
    severity: "l2",
    status: "open",
    commanderLabel: "Duty manager (Dev/Test)",
    summary: "Seeded command overlay — not a live crisis and not an I11 ticket.",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  const entry: CrisisTimelineEntry = {
    id: CRISIS_SEED.sampleTimelineId,
    tenantId: tenant.id,
    crisisId: crisis.id,
    entryCode: "TLN-0001",
    body: "Seeded timeline note — immutable append only.",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  store.crisisCases.push(crisis);
  store.crisisTimelineEntries.push(entry);
}
