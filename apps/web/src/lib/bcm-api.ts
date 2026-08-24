import { eosFetch } from "./eos-client";

export type BackupJobStatus = "scheduled" | "completed" | "failed";
export type RestoreProbeOutcome = "passed" | "failed";

export type BcmBackupJob = {
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

export type BcmRestoreProbe = {
  id: string;
  probeCode: string;
  jobId: string;
  jobCode: string;
  outcome: RestoreProbeOutcome;
  note?: string;
};

export const BACKUP_JOB_STATUS_LABELS: Record<BackupJobStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  failed: "Failed",
};

export async function getBcmHealth(token: string) {
  return eosFetch<{ increment: string; jobs: number; unprovenCompletedJobs: number; probes: number }>(
    "/v1/bcm/health",
    { token },
  );
}

export async function listBackupJobs(token: string) {
  return eosFetch<{ items: BcmBackupJob[] }>("/v1/bcm/jobs", { token });
}

export async function createBackupJob(token: string, input: { backupDate: string; note?: string }) {
  return eosFetch<{ job: BcmBackupJob }>("/v1/bcm/jobs", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function transitionBackupJob(token: string, id: string, action: "complete" | "fail") {
  return eosFetch<{ job: BcmBackupJob }>(`/v1/bcm/jobs/${id}/${action}`, {
    token,
    method: "POST",
    body: "{}",
  });
}

export async function listRestoreProbes(token: string, jobId: string) {
  return eosFetch<{ items: BcmRestoreProbe[] }>(`/v1/bcm/jobs/${jobId}/probes`, { token });
}

export async function createRestoreProbe(
  token: string,
  jobId: string,
  input: { outcome: RestoreProbeOutcome; note?: string },
) {
  return eosFetch<{ probe: BcmRestoreProbe }>(`/v1/bcm/jobs/${jobId}/probes`, {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}
