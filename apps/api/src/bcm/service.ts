import {
  authorize,
  canRecordRestoreProbe,
  canRecordRestoreProbeBy,
  canTransitionBackupJob,
  eatNineteenHundredIso,
  isJobProven,
  isValidBackupJobStatus,
  isValidRestoreProbeOutcome,
  newId,
  nextBackupJobCode,
  nextRestoreProbeCode,
  type BackupJobStatus,
  type BcmBackupJob,
  type BcmRestoreProbe,
  type Principal,
  type RestoreProbeOutcome,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureBcmCollections } from "./collections.js";

const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

export type BcmBackupJobView = {
  id: string;
  jobCode: string;
  backupDate: string;
  scheduledFor: string;
  status: BackupJobStatus;
  proven: boolean;
  probeCount: number;
  passedProbeCount: number;
  note?: string;
};

export type BcmRestoreProbeView = {
  id: string;
  probeCode: string;
  jobId: string;
  jobCode: string;
  outcome: RestoreProbeOutcome;
  note?: string;
};

function probeStats(store: Store, jobId: string, tenantId: string) {
  const probes = store.bcmRestoreProbes.filter((p) => p.tenantId === tenantId && p.jobId === jobId);
  return {
    probeCount: probes.length,
    passedProbeCount: probes.filter((p) => p.outcome === "passed").length,
  };
}

function sanitizeJob(store: Store, job: BcmBackupJob): BcmBackupJobView {
  const stats = probeStats(store, job.id, job.tenantId);
  const view: BcmBackupJobView = {
    id: job.id,
    jobCode: job.jobCode,
    backupDate: job.backupDate,
    scheduledFor: job.scheduledFor,
    status: job.status,
    proven: isJobProven(job.status, stats.passedProbeCount),
    probeCount: stats.probeCount,
    passedProbeCount: stats.passedProbeCount,
  };
  if (job.note) view.note = job.note;
  return view;
}

function sanitizeProbe(store: Store, probe: BcmRestoreProbe): BcmRestoreProbeView | { error: "not_found" } {
  const job = store.bcmBackupJobs.find((j) => j.id === probe.jobId && j.tenantId === probe.tenantId);
  if (!job) return { error: "not_found" };
  const view: BcmRestoreProbeView = {
    id: probe.id,
    probeCode: probe.probeCode,
    jobId: probe.jobId,
    jobCode: job.jobCode,
    outcome: probe.outcome,
  };
  if (probe.note) view.note = probe.note;
  return view;
}

export function getBcmHealth(store: Store, principal: Principal) {
  ensureBcmCollections(store);
  const decision = authorize({
    principal,
    permission: "bcm:read:job",
    action: "read:bcm_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const jobs = store.bcmBackupJobs.filter((j) => j.tenantId === principal.tenantId);
  const probes = store.bcmRestoreProbes.filter((p) => p.tenantId === principal.tenantId);
  const unprovenCompletedJobs = jobs.filter((j) => {
    const stats = probeStats(store, j.id, principal.tenantId);
    return j.status === "completed" && stats.passedProbeCount === 0;
  }).length;
  return {
    module: "bcm",
    increment: "I17" as const,
    status: "ok" as const,
    jobs: jobs.length,
    unprovenCompletedJobs,
    probes: probes.length,
  };
}

export function listBackupJobs(store: Store, principal: Principal, query?: { q?: string; status?: string }) {
  ensureBcmCollections(store);
  const decision = authorize({
    principal,
    permission: "bcm:read:job",
    action: "list:bcm_job",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidBackupJobStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.bcmBackupJobs
    .filter((j) => j.tenantId === principal.tenantId)
    .filter((j) => !query?.status || j.status === query.status)
    .filter((j) => !q || `${j.jobCode} ${j.backupDate} ${j.note ?? ""}`.toLowerCase().includes(q))
    .map((j) => sanitizeJob(store, j));
  return { items };
}

export function getBackupJob(store: Store, principal: Principal, id: string) {
  ensureBcmCollections(store);
  const decision = authorize({
    principal,
    permission: "bcm:read:job",
    action: "get:bcm_job",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const job = store.bcmBackupJobs.find((j) => j.id === id && j.tenantId === principal.tenantId);
  if (!job) return { error: "not_found" as const };
  return { job: sanitizeJob(store, job) };
}

export function createBackupJob(store: Store, principal: Principal, input: { backupDate?: string; note?: string }) {
  ensureBcmCollections(store);
  const decision = authorize({
    principal,
    permission: "bcm:write:job",
    action: "create:bcm_job",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const backupDate = input.backupDate?.trim() ?? "";
  const scheduledFor = eatNineteenHundredIso(backupDate);
  if (!scheduledFor) return { error: "invalid" as const, reason: "invalid_date" };
  if (store.bcmBackupJobs.some((j) => j.tenantId === principal.tenantId && j.backupDate === backupDate)) {
    return { error: "conflict" as const, reason: "duplicate_date" };
  }
  const note = input.note?.trim();
  if (note && note.length > TEXT_MAX) return { error: "invalid" as const, reason: "note_too_long" };
  const now = new Date().toISOString();
  const job: BcmBackupJob = {
    id: newId(),
    tenantId: principal.tenantId,
    jobCode: nextBackupJobCode(
      store.bcmBackupJobs.filter((j) => j.tenantId === principal.tenantId).map((j) => j.jobCode),
    ),
    backupDate,
    scheduledFor,
    status: "scheduled",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (note) job.note = note;
  store.bcmBackupJobs.push(job);
  return { job: sanitizeJob(store, job) };
}

export function patchBackupJob(store: Store, principal: Principal, id: string, input: { note?: string }) {
  ensureBcmCollections(store);
  const decision = authorize({
    principal,
    permission: "bcm:write:job",
    action: "patch:bcm_job",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const job = store.bcmBackupJobs.find((j) => j.id === id && j.tenantId === principal.tenantId);
  if (!job) return { error: "not_found" as const };
  if (job.status !== "scheduled") return { error: "conflict" as const, reason: "invalid_transition" };
  if (input.note !== undefined) {
    const note = input.note.trim();
    if (note.length > TEXT_MAX) return { error: "invalid" as const, reason: "note_too_long" };
    if (note) job.note = note;
    else delete job.note;
  }
  job.updatedAt = new Date().toISOString();
  job.updatedByPrincipalId = principal.id;
  return { job: sanitizeJob(store, job) };
}

export function transitionBackupJob(
  store: Store,
  principal: Principal,
  id: string,
  action: "complete" | "fail",
) {
  ensureBcmCollections(store);
  const decision = authorize({
    principal,
    permission: "bcm:write:job",
    action: `transition:bcm_job:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const job = store.bcmBackupJobs.find((j) => j.id === id && j.tenantId === principal.tenantId);
  if (!job) return { error: "not_found" as const };
  const next = canTransitionBackupJob(job.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  job.status = next.next;
  job.updatedAt = new Date().toISOString();
  job.updatedByPrincipalId = principal.id;
  return { job: sanitizeJob(store, job) };
}

export function listRestoreProbes(store: Store, principal: Principal, jobId: string) {
  ensureBcmCollections(store);
  const decision = authorize({
    principal,
    permission: "bcm:read:probe",
    action: "list:bcm_probe",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const job = store.bcmBackupJobs.find((j) => j.id === jobId && j.tenantId === principal.tenantId);
  if (!job) return { error: "not_found" as const };
  const items = store.bcmRestoreProbes
    .filter((p) => p.tenantId === principal.tenantId && p.jobId === jobId)
    .map((p) => sanitizeProbe(store, p))
    .filter((row): row is BcmRestoreProbeView => !("error" in row));
  return { items };
}

export function getRestoreProbe(store: Store, principal: Principal, id: string) {
  ensureBcmCollections(store);
  const decision = authorize({
    principal,
    permission: "bcm:read:probe",
    action: "get:bcm_probe",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const probe = store.bcmRestoreProbes.find((p) => p.id === id && p.tenantId === principal.tenantId);
  if (!probe) return { error: "not_found" as const };
  const view = sanitizeProbe(store, probe);
  if ("error" in view) return view;
  return { probe: view };
}

export function createRestoreProbe(
  store: Store,
  principal: Principal,
  jobId: string,
  input: { outcome?: string; note?: string },
) {
  ensureBcmCollections(store);
  const decision = authorize({
    principal,
    permission: "bcm:write:probe",
    action: "create:bcm_probe",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const job = store.bcmBackupJobs.find((j) => j.id === jobId && j.tenantId === principal.tenantId);
  if (!job) return { error: "not_found" as const };
  const allowed = canRecordRestoreProbe(job.status);
  if (!allowed.allowed) return { error: "conflict" as const, reason: allowed.reason };
  const sod = canRecordRestoreProbeBy(job.createdByPrincipalId, principal.id);
  if (!sod.allowed) return deny(sod.reason);
  const outcome = input.outcome?.trim() ?? "";
  if (!isValidRestoreProbeOutcome(outcome)) return { error: "invalid" as const, reason: "invalid_outcome" };
  const note = input.note?.trim();
  if (note && note.length > TEXT_MAX) return { error: "invalid" as const, reason: "note_too_long" };
  const now = new Date().toISOString();
  const probe: BcmRestoreProbe = {
    id: newId(),
    tenantId: principal.tenantId,
    jobId: job.id,
    probeCode: nextRestoreProbeCode(
      store.bcmRestoreProbes.filter((p) => p.tenantId === principal.tenantId).map((p) => p.probeCode),
    ),
    outcome,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (note) probe.note = note;
  store.bcmRestoreProbes.push(probe);
  const view = sanitizeProbe(store, probe);
  if ("error" in view) return view;
  return { probe: view };
}
