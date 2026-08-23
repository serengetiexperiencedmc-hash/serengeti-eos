const DEFAULT_DIGEST_STALE_HOURS = 26;

export function digestStaleThresholdHours(
  envKey: "EOS_DLQ_SLA_DIGEST_STALE_HOURS" | "EOS_ALLOWLIST_DUAL_DIGEST_STALE_HOURS" = "EOS_DLQ_SLA_DIGEST_STALE_HOURS",
): number {
  const raw = Number(process.env[envKey]);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_DIGEST_STALE_HOURS;
}

/** I4.22/I3.25 — freshness SLA for last-run stamp (never-run counts as stale). */
export function digestLastRunFreshness(
  lastRunAt: string | undefined,
  nowMs = Date.now(),
  envKey: "EOS_DLQ_SLA_DIGEST_STALE_HOURS" | "EOS_ALLOWLIST_DUAL_DIGEST_STALE_HOURS" = "EOS_DLQ_SLA_DIGEST_STALE_HOURS",
) {
  const thresholdHours = digestStaleThresholdHours(envKey);
  if (!lastRunAt) {
    return { stale: true, neverRun: true, ageHours: null as number | null, thresholdHours };
  }
  const ageHours = Math.max(0, (nowMs - new Date(lastRunAt).getTime()) / 3_600_000);
  return {
    stale: ageHours >= thresholdHours,
    neverRun: false,
    ageHours: Number(ageHours.toFixed(2)),
    thresholdHours,
  };
}
