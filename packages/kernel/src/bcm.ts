export const BACKUP_JOB_STATUSES = ["scheduled", "completed", "failed"] as const;
export type BackupJobStatus = (typeof BACKUP_JOB_STATUSES)[number];

export const RESTORE_PROBE_OUTCOMES = ["passed", "failed"] as const;
export type RestoreProbeOutcome = (typeof RESTORE_PROBE_OUTCOMES)[number];

export const BACKUP_JOB_STATUS_LABELS: Record<BackupJobStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  failed: "Failed",
};

export const RESTORE_PROBE_OUTCOME_LABELS: Record<RestoreProbeOutcome, string> = {
  passed: "Passed",
  failed: "Failed",
};

/** Africa/Nairobi is UTC+3 with no DST. 19:00 EAT = 16:00 UTC. */
export const BCM_BACKUP_HOUR_EAT = 19;
export const BCM_EAT_OFFSET_HOURS = 3;

export function isValidBackupJobStatus(value: string): value is BackupJobStatus {
  return (BACKUP_JOB_STATUSES as readonly string[]).includes(value);
}

export function isValidRestoreProbeOutcome(value: string): value is RestoreProbeOutcome {
  return (RESTORE_PROBE_OUTCOMES as readonly string[]).includes(value);
}

export function nextBackupJobCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^JOB-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `JOB-${String(max + 1).padStart(4, "0")}`;
}

export function nextRestoreProbeCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^PRP-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `PRP-${String(max + 1).padStart(4, "0")}`;
}

export function eatNineteenHundredIso(backupDate: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(backupDate.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcHour = BCM_BACKUP_HOUR_EAT - BCM_EAT_OFFSET_HOURS;
  const utc = new Date(Date.UTC(year, month - 1, day, utcHour, 0, 0, 0));
  if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) {
    return null;
  }
  return utc.toISOString();
}

export function canTransitionBackupJob(
  from: BackupJobStatus,
  action: "complete" | "fail",
): { allowed: true; next: BackupJobStatus } | { allowed: false; reason: "invalid_transition" } {
  if (from !== "scheduled") return { allowed: false, reason: "invalid_transition" };
  if (action === "complete") return { allowed: true, next: "completed" };
  return { allowed: true, next: "failed" };
}

export function canRecordRestoreProbe(jobStatus: BackupJobStatus): { allowed: true } | { allowed: false; reason: "not_completed" } {
  if (jobStatus !== "completed") return { allowed: false, reason: "not_completed" };
  return { allowed: true };
}

export function canRecordRestoreProbeBy(createdByPrincipalId: string, actorPrincipalId: string): { allowed: true } | { allowed: false; reason: "sod" } {
  if (createdByPrincipalId === actorPrincipalId) return { allowed: false, reason: "sod" };
  return { allowed: true };
}

export function isJobProven(jobStatus: BackupJobStatus, passedProbeCount: number): boolean {
  return jobStatus === "completed" && passedProbeCount > 0;
}

export type BcmBackupJob = {
  id: string;
  tenantId: string;
  jobCode: string;
  backupDate: string;
  scheduledFor: string;
  status: BackupJobStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type BcmRestoreProbe = {
  id: string;
  tenantId: string;
  jobId: string;
  probeCode: string;
  outcome: RestoreProbeOutcome;
  note?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
