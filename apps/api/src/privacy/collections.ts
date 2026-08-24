import type { PrivacyDsrCase, PrivacyProcessingActivity } from "@sedmc/kernel";
import type { Store } from "../store.js";

export const PRIVACY_SEED = {
  sampleActivityId: "91919191-9191-4919-8919-919191919191",
  sampleDsrId: "92929292-9292-4929-8929-929292929292",
} as const;

export function ensurePrivacyCollections(store: Store): void {
  if (!store.privacyProcessingActivities) store.privacyProcessingActivities = [];
  if (!store.privacyDsrCases) store.privacyDsrCases = [];
}

export function seedDefaultPrivacy(store: Store): void {
  ensurePrivacyCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  if (!store.privacyProcessingActivities.some((a) => a.tenantId === tenant.id)) {
    store.privacyProcessingActivities.push({
      id: PRIVACY_SEED.sampleActivityId,
      tenantId: tenant.id,
      activityCode: "RPA-0001",
      title: "Sample Dev/Test processing activity",
      status: "open",
      purpose: "Guest booking operations (Dev/Test)",
      ownerLabel: "DPO (Dev/Test)",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: carol.id,
      updatedByPrincipalId: carol.id,
    });
  }
  if (!store.privacyDsrCases.some((d) => d.tenantId === tenant.id)) {
    store.privacyDsrCases.push({
      id: PRIVACY_SEED.sampleDsrId,
      tenantId: tenant.id,
      dsrCode: "DSR-0001",
      requestType: "access",
      status: "open",
      subjectLabel: "Guest A (Dev/Test label)",
      note: "Register only — not live access fulfilment",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: carol.id,
      updatedByPrincipalId: carol.id,
    });
  }
}
