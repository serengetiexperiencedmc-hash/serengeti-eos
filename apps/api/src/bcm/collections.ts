import type { BcmBackupJob } from "@sedmc/kernel";
import type { Store } from "../store.js";

export const BCM_SEED = {
  sampleJobId: "87878787-8787-4878-8878-878787878787",
} as const;

export function ensureBcmCollections(store: Store): void {
  if (!store.bcmBackupJobs) store.bcmBackupJobs = [];
  if (!store.bcmRestoreProbes) store.bcmRestoreProbes = [];
}

export function seedDefaultBcm(store: Store): void {
  ensureBcmCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.bcmBackupJobs.some((j) => j.tenantId === tenant.id)) return;
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!carol) return;
  const now = "2026-08-20T09:00:00.000Z";
  const job: BcmBackupJob = {
    id: BCM_SEED.sampleJobId,
    tenantId: tenant.id,
    jobCode: "JOB-0001",
    backupDate: "2026-08-20",
    scheduledFor: "2026-08-20T16:00:00.000Z",
    status: "scheduled",
    note: "Seeded 19:00 EAT slot — not a production backup.",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  store.bcmBackupJobs.push(job);
}
