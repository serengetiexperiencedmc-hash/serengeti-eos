import { getAiDraftSummary } from "./ai-api";
import { getCommercialSummary } from "./analytics-api";
import { getUnreadCount } from "./notifications-api";
import { listRfps } from "./rfp-api";
import { listSyncConflicts } from "./field-sync-api";
import { eosFetch } from "./eos-client";

export type NavBadgeCounts = {
  pipeline: number;
  activeRfps: number;
  reconciliationExceptions: number;
  fieldSyncConflicts: number;
  notifications: number;
  aiDrafts: number;
};

export async function fetchNavBadges(token: string): Promise<NavBadgeCounts> {
  const [summary, rfps, conflicts, pipelineHealth, notifCount, drafts] = await Promise.all([
    getCommercialSummary(token),
    listRfps(token, { status: "active" }),
    listSyncConflicts(token).catch(() => ({ items: [] })),
    eosFetch<{ opportunities: number }>("/v1/pipeline/health", { token }).catch(() => ({ opportunities: 0 })),
    getUnreadCount(token).catch(() => ({ unreadCount: 0 })),
    getAiDraftSummary(token).catch(() => ({ pendingCount: 0 })),
  ]);

  return {
    pipeline: pipelineHealth.opportunities ?? summary.summary.totalOpportunities,
    activeRfps: summary.summary.activeRfps || rfps.items.length,
    reconciliationExceptions: summary.summary.reconciliationExceptions,
    fieldSyncConflicts: conflicts.items.length || summary.summary.fieldSyncConflicts,
    notifications: notifCount.unreadCount,
    aiDrafts: drafts.pendingCount,
  };
}
