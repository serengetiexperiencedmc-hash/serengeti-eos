import type { ControlTestCampaign } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { GRC_SEED } from "../grc/collections.js";

export const CAMPAIGN_SEED = {
  sampleCampaignId: "95959595-9595-4959-8959-959595959595",
} as const;

export function ensureCampaignCollections(store: Store): void {
  if (!store.controlTestCampaigns) store.controlTestCampaigns = [];
}

export function seedDefaultCampaigns(store: Store): void {
  ensureCampaignCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.controlTestCampaigns.some((c) => c.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  store.controlTestCampaigns.push({
    id: CAMPAIGN_SEED.sampleCampaignId,
    tenantId: tenant.id,
    campaignCode: "CTC-0001",
    title: "Sample Dev/Test campaign",
    status: "planned",
    ownerLabel: "GRC (Dev/Test)",
    controlId: GRC_SEED.sampleControlId,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  });
}
