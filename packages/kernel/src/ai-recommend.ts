/** I20.1 — advisory recommendations only. Autonomy ceiling is 1 (Recommend). */

export const AI_RECOMMEND_AUTONOMY_CEILING = 1 as const;

export type AiRecommendSignalKind =
  | "crm_duplicate"
  | "allowlist_digest_stale"
  | "dlq_digest_stale"
  | "org_missing_owner"
  | "crm_task_overdue";

export type AiRecommendSignal = {
  kind: AiRecommendSignalKind;
  count?: number;
  ageHours?: number | null;
};

export type AiRecommendationEvidence = {
  kind: string;
  label: string;
  id?: string;
};

export type AiRecommendation = {
  id: string;
  key: string;
  title: string;
  reason: string;
  href: string;
  autonomyLevel: typeof AI_RECOMMEND_AUTONOMY_CEILING;
  confidence: number;
  evidence: AiRecommendationEvidence[];
};

export type AiRecommendRequest = {
  tenantId: string;
  principalId: string;
  signals: AiRecommendSignal[];
};

export type AiRecommendProvider = {
  readonly name: string;
  readonly autonomyCeiling: typeof AI_RECOMMEND_AUTONOMY_CEILING;
  recommend(request: AiRecommendRequest): AiRecommendation[];
};

export type AiRecommendLastRun = {
  tenantId: string;
  principalId: string;
  occurredAt: string;
  provider: string;
  count: number;
  keys: string[];
};

export type AiRecommendStaleSuppression = {
  tenantId: string;
  principalId: string;
  snoozedUntil?: string;
  acknowledgedAt?: string;
  updatedAt: string;
  updatedByPrincipalId: string;
};

export type AiRecommendStaleSuppressionAudit = {
  id: string;
  tenantId: string;
  principalId: string;
  action: "snooze" | "ack" | "cleared";
  snoozedUntil?: string;
  acknowledgedAt?: string;
  createdAt: string;
  createdByPrincipalId: string;
};

export type AiRecommendStaleAuditExportLastFilter = {
  tenantId: string;
  principalId: string;
  action?: "snooze" | "ack" | "cleared";
  since?: string;
  until?: string;
  updatedAt: string;
};

export function sanitizeAiRecommendStaleAuditExportLastFilter(row: AiRecommendStaleAuditExportLastFilter) {
  return {
    ...(row.action ? { action: row.action } : {}),
    ...(row.since ? { since: row.since } : {}),
    ...(row.until ? { until: row.until } : {}),
    updatedAt: row.updatedAt,
  };
}

export type AiRecommendStaleAuditExportPreset = {
  id: string;
  tenantId: string;
  name: string;
  action?: "snooze" | "ack" | "cleared";
  since?: string;
  until?: string;
  createdAt: string;
  createdByPrincipalId: string;
  updatedAt: string;
};

export function sanitizeAiRecommendStaleAuditExportPreset(row: AiRecommendStaleAuditExportPreset) {
  return {
    id: row.id,
    name: row.name,
    ...(row.action ? { action: row.action } : {}),
    ...(row.since ? { since: row.since } : {}),
    ...(row.until ? { until: row.until } : {}),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function normalizeAiRecommendStaleAuditExportPresetName(name?: string): string | null {
  const trimmed = name?.trim().replace(/\s+/g, " ") ?? "";
  if (!trimmed || trimmed.length > 80) return null;
  return trimmed;
}

export type AiRecommendStaleAuditExportPresetUsage = {
  id: string;
  tenantId: string;
  principalId: string;
  presetId: string;
  presetName: string;
  createdAt: string;
  createdByPrincipalId: string;
};

export function sanitizeAiRecommendStaleAuditExportPresetUsage(row: AiRecommendStaleAuditExportPresetUsage) {
  return {
    id: row.id,
    presetId: row.presetId,
    presetName: row.presetName,
    createdAt: row.createdAt,
  };
}

export function formatAiRecommendStaleAuditExportPresetUsageCsv(
  rows: ReadonlyArray<ReturnType<typeof sanitizeAiRecommendStaleAuditExportPresetUsage>>,
): string {
  const header = "presetId,presetName,createdAt";
  const lines = rows.map((row) => [row.presetId, row.presetName, row.createdAt].join(","));
  return [header, ...lines].join("\n");
}

export type AiRecommendStaleAuditExportLastPreset = {
  tenantId: string;
  principalId: string;
  presetId: string;
  presetName: string;
  usedAt: string;
};

export function sanitizeAiRecommendStaleAuditExportLastPreset(row: AiRecommendStaleAuditExportLastPreset) {
  return {
    presetId: row.presetId,
    presetName: row.presetName,
    usedAt: row.usedAt,
  };
}

export function sanitizeAiRecommendLastRun(run: AiRecommendLastRun) {
  return {
    occurredAt: run.occurredAt,
    provider: run.provider,
    count: run.count,
    keys: [...run.keys],
  };
}

export function sanitizeAiRecommendStaleSuppression(suppression: AiRecommendStaleSuppression) {
  return {
    ...(suppression.snoozedUntil ? { snoozedUntil: suppression.snoozedUntil } : {}),
    ...(suppression.acknowledgedAt ? { acknowledgedAt: suppression.acknowledgedAt } : {}),
    updatedAt: suppression.updatedAt,
  };
}

export function sanitizeAiRecommendStaleSuppressionAudit(entry: AiRecommendStaleSuppressionAudit) {
  return {
    id: entry.id,
    action: entry.action,
    ...(entry.snoozedUntil ? { snoozedUntil: entry.snoozedUntil } : {}),
    ...(entry.acknowledgedAt ? { acknowledgedAt: entry.acknowledgedAt } : {}),
    createdAt: entry.createdAt,
    createdByPrincipalId: entry.createdByPrincipalId,
  };
}

export function formatAiRecommendStaleSuppressionAuditCsv(
  audits: ReadonlyArray<ReturnType<typeof sanitizeAiRecommendStaleSuppressionAudit>>,
): string {
  const header = "action,snoozedUntil,acknowledgedAt,createdAt,createdByPrincipalId";
  const rows = audits.map((row) =>
    [row.action, row.snoozedUntil ?? "", row.acknowledgedAt ?? "", row.createdAt, row.createdByPrincipalId].join(","),
  );
  return [header, ...rows].join("\n");
}

export const AI_RECOMMEND_STALE_AUDIT_ACTIONS = ["snooze", "ack", "cleared"] as const;
export type AiRecommendStaleAuditAction = (typeof AI_RECOMMEND_STALE_AUDIT_ACTIONS)[number];

export type AiRecommendStaleAuditExportFilter = {
  action: AiRecommendStaleAuditAction | null;
  since: string | null;
  until: string | null;
  sinceMs: number | null;
  untilMs: number | null;
};

function parseOptionalIso(value?: string): { ok: true; raw: string | null; ms: number | null } | { ok: false } {
  const raw = value?.trim() ?? "";
  if (!raw) return { ok: true, raw: null, ms: null };
  const ms = Date.parse(raw);
  if (!Number.isFinite(ms)) return { ok: false };
  return { ok: true, raw, ms };
}

export function parseAiRecommendStaleAuditExportFilter(query?: {
  action?: string;
  since?: string;
  until?: string;
}): AiRecommendStaleAuditExportFilter | { error: "invalid_action" | "invalid_window" } {
  const actionRaw = query?.action?.trim() ?? "";
  if (actionRaw && !AI_RECOMMEND_STALE_AUDIT_ACTIONS.includes(actionRaw as AiRecommendStaleAuditAction)) {
    return { error: "invalid_action" };
  }
  const since = parseOptionalIso(query?.since);
  const until = parseOptionalIso(query?.until);
  if (!since.ok || !until.ok) return { error: "invalid_window" };
  if (since.ms !== null && until.ms !== null && since.ms > until.ms) return { error: "invalid_window" };
  return {
    action: actionRaw ? (actionRaw as AiRecommendStaleAuditAction) : null,
    since: since.raw,
    until: until.raw,
    sinceMs: since.ms,
    untilMs: until.ms,
  };
}

export function filterAiRecommendStaleSuppressionAudits<T extends { action: string; createdAt: string }>(
  audits: readonly T[],
  filter: Pick<AiRecommendStaleAuditExportFilter, "action" | "sinceMs" | "untilMs">,
): T[] {
  return audits.filter((row) => {
    if (filter.action && row.action !== filter.action) return false;
    const createdMs = Date.parse(row.createdAt);
    if (filter.sinceMs !== null && !(Number.isFinite(createdMs) && createdMs >= filter.sinceMs)) return false;
    if (filter.untilMs !== null && !(Number.isFinite(createdMs) && createdMs <= filter.untilMs)) return false;
    return true;
  });
}

export function isAiRecommendStaleSuppressed(
  suppression: AiRecommendStaleSuppression | null | undefined,
  nowMs = Date.now(),
): boolean {
  if (!suppression) return false;
  if (suppression.acknowledgedAt) return true;
  if (suppression.snoozedUntil && new Date(suppression.snoozedUntil).getTime() > nowMs) return true;
  return false;
}

export function filterAiRecommendLastRunKeys(keys: readonly string[], query?: string): string[] {
  const needle = query?.trim() ?? "";
  if (!needle) return [...keys];
  return keys.filter((key) => key === needle || key.startsWith(needle));
}

export const AI_RECOMMEND_STALE_HOURS_DEFAULT = 26;

export function aiRecommendLastRunFreshness(
  lastRunAt: string | undefined,
  nowMs = Date.now(),
  thresholdHours = AI_RECOMMEND_STALE_HOURS_DEFAULT,
) {
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

export function formatAiRecommendLastRunCsv(input: {
  occurredAt: string;
  provider: string;
  count: number;
  keys: readonly string[];
  stale: boolean;
  neverRun: boolean;
  ageHours: number | null;
  thresholdHours: number;
}): string {
  const header = "occurredAt,provider,count,key,stale,neverRun,ageHours,thresholdHours";
  const freshness = [
    String(input.stale),
    String(input.neverRun),
    input.ageHours === null ? "" : String(input.ageHours),
    String(input.thresholdHours),
  ];
  if (input.keys.length === 0) {
    return [header, ["", input.provider, String(input.count), "", ...freshness].join(",")].join("\n");
  }
  const rows = input.keys.map((key) =>
    [input.occurredAt, input.provider, String(input.count), key, ...freshness].join(","),
  );
  return [header, ...rows].join("\n");
}

const INTERNAL_HREF = /^\/commercial\/(crm|notifications|events)(\/|\?|$)/;

export function isAllowedAiRecommendHref(href: string): boolean {
  return INTERNAL_HREF.test(href);
}

export function assertSafeAiRecommendations(items: AiRecommendation[]): AiRecommendation[] {
  for (const item of items) {
    if (item.autonomyLevel > AI_RECOMMEND_AUTONOMY_CEILING) {
      throw new Error("ai_autonomy_ceiling_exceeded");
    }
    if (!isAllowedAiRecommendHref(item.href)) {
      throw new Error("ai_recommend_href_rejected");
    }
  }
  return items;
}

/** Dev/Test rules provider — maps EOS signals to recommendations. No vendor SDK. */
export function createDevRulesRecommendProvider(): AiRecommendProvider {
  return {
    name: "dev-rules",
    autonomyCeiling: AI_RECOMMEND_AUTONOMY_CEILING,
    recommend(request) {
      const items: AiRecommendation[] = [];
      for (const signal of request.signals) {
        const rec = recommendationForSignal(signal, request.principalId);
        if (rec) items.push(rec);
      }
      return assertSafeAiRecommendations(items);
    },
  };
}

function recommendationForSignal(
  signal: AiRecommendSignal,
  principalId: string,
): AiRecommendation | undefined {
  const idPrefix = `${principalId}:${signal.kind}`;
  switch (signal.kind) {
    case "crm_duplicate":
      if (!signal.count || signal.count < 1) return undefined;
      return {
        id: `${idPrefix}:duplicate`,
        key: "crm.duplicate.review",
        title: "Review possible duplicate CRM records",
        reason: `${signal.count} candidate pair${signal.count === 1 ? "" : "s"} need a human review. EOS will not merge them automatically.`,
        href: "/commercial/crm",
        autonomyLevel: 1,
        confidence: 0.95,
        evidence: [{ kind: "crm_duplicate", label: `${signal.count} open candidate(s)` }],
      };
    case "crm_task_overdue":
      if (!signal.count || signal.count < 1) return undefined;
      return {
        id: `${idPrefix}:task`,
        key: "crm.task.overdue",
        title: "Complete overdue CRM tasks",
        reason: `${signal.count} open task${signal.count === 1 ? "" : "s"} are past due.`,
        href: "/commercial/crm",
        autonomyLevel: 1,
        confidence: 0.9,
        evidence: [{ kind: "crm_task_overdue", label: `${signal.count} overdue` }],
      };
    case "dlq_digest_stale":
      return {
        id: `${idPrefix}:dlq`,
        key: "events.dlq_digest.stale",
        title: "DLQ SLA digest is stale",
        reason:
          signal.ageHours == null
            ? "The DLQ SLA digest has never been run for this tenant."
            : `Last DLQ SLA digest is ${signal.ageHours}h old.`,
        href: "/commercial/events",
        autonomyLevel: 1,
        confidence: 0.85,
        evidence: [{ kind: "dlq_digest_stale", label: signal.ageHours == null ? "never run" : `${signal.ageHours}h` }],
      };
    case "allowlist_digest_stale":
      return {
        id: `${idPrefix}:allowlist`,
        key: "notifications.allowlist_digest.stale",
        title: "Allowlist dual-control digest is stale",
        reason:
          signal.ageHours == null
            ? "The allowlist dual-control digest has never been run for this tenant."
            : `Last allowlist digest is ${signal.ageHours}h old.`,
        href: "/commercial/notifications",
        autonomyLevel: 1,
        confidence: 0.8,
        evidence: [
          { kind: "allowlist_digest_stale", label: signal.ageHours == null ? "never run" : `${signal.ageHours}h` },
        ],
      };
    case "org_missing_owner":
      if (!signal.count || signal.count < 1) return undefined;
      return {
        id: `${idPrefix}:owner`,
        key: "crm.organization.missing_owner",
        title: "Assign owners on active organizations",
        reason: `${signal.count} active organization${signal.count === 1 ? "" : "s"} have no owner principal.`,
        href: "/commercial/crm",
        autonomyLevel: 1,
        confidence: 0.7,
        evidence: [{ kind: "org_missing_owner", label: `${signal.count} without owner` }],
      };
  }
}
