import type { SecurityAlert } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { IT_SEED } from "../it/collections.js";

export const SOC_SEED = {
  sampleAlertId: "81818181-8181-4818-8818-818181818181",
} as const;

export function ensureSocCollections(store: Store): void {
  if (!store.securityAlerts) store.securityAlerts = [];
}

export function seedDefaultSoc(store: Store): void {
  ensureSocCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.securityAlerts.some((a) => a.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  const alert: SecurityAlert = {
    id: SOC_SEED.sampleAlertId,
    tenantId: tenant.id,
    alertCode: "ALT-0001",
    source: "devtest.webhook",
    title: "Sample Dev/Test webhook alert",
    summary: "Seeded ingest record — not a production SIEM finding.",
    severity: "medium",
    status: "open",
    ciId: IT_SEED.apiCiId,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  store.securityAlerts.push(alert);
}
