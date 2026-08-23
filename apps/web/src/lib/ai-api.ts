import { notifyAiDraftsChanged } from "./ai-draft-events";
import { eosFetch } from "./eos-client";

export type AiRecommendation = {
  id: string;
  key: string;
  title: string;
  reason: string;
  href: string;
  autonomyLevel: number;
  confidence: number;
  evidence: Array<{ kind: string; label: string; id?: string }>;
};

export type AiDraft = {
  id: string;
  recommendationKey: string;
  artefactType: string;
  title: string;
  body: string;
  status: "pending" | "accepted" | "discarded";
  autonomyLevel: number;
  createdAt?: string;
  appliedEntityType?: string;
  appliedEntityId?: string;
  appliedHref?: string;
};

export type AiDraftListQuery = {
  status?: string;
  artefactType?: string;
};

export type AiRecommendLastRun = {
  occurredAt: string;
  provider: string;
  count: number;
  keys: string[];
};

export type AiRecommendFreshness = {
  stale: boolean;
  neverRun: boolean;
  ageHours: number | null;
  thresholdHours: number;
};

export type AiRecommendSuppression = {
  snoozedUntil?: string;
  acknowledgedAt?: string;
  updatedAt: string;
};

export async function listAiRecommendations(token: string) {
  return eosFetch<{
    items: AiRecommendation[];
    provider: string;
    autonomyCeiling: number;
    lastRun: AiRecommendLastRun;
    freshness: AiRecommendFreshness;
    suppression: AiRecommendSuppression | null;
    suppressed: boolean;
    increment: string;
  }>("/v1/ai/recommendations", { token });
}

export async function getAiRecommendLastRun(token: string, key?: string) {
  const params = new URLSearchParams();
  if (key) params.set("key", key);
  const q = params.toString() ? `?${params.toString()}` : "";
  return eosFetch<{
    lastRun: AiRecommendLastRun | null;
    keys: string[];
    matchCount: number;
    filter: { key: string | null };
    freshness: AiRecommendFreshness;
    suppression: AiRecommendSuppression | null;
    suppressed: boolean;
    increment: string;
  }>(`/v1/ai/recommendations/last-run${q}`, { token });
}

export type AiRecommendStaleAudit = {
  id: string;
  action: "snooze" | "ack" | "cleared";
  snoozedUntil?: string;
  acknowledgedAt?: string;
  createdAt: string;
  createdByPrincipalId: string;
};

export async function exportAiRecommendLastRun(token: string, query?: { key?: string; format?: "json" | "csv" }) {
  const params = new URLSearchParams();
  if (query?.key) params.set("key", query.key);
  if (query?.format) params.set("format", query.format);
  const q = params.toString() ? `?${params.toString()}` : "";
  return eosFetch<{
    lastRun: AiRecommendLastRun | null;
    keys: string[];
    matchCount: number;
    format: "json" | "csv";
    csv?: string;
    generatedAt: string;
    freshness: AiRecommendFreshness;
    suppression: AiRecommendSuppression | null;
    suppressed: boolean;
    increment: string;
  }>(`/v1/ai/recommendations/last-run/export${q}`, { token });
}

export async function exportAiRecommendStaleSuppression(
  token: string,
  query?: { format?: "json" | "csv"; action?: string; since?: string; until?: string },
) {
  const params = new URLSearchParams();
  params.set("format", query?.format ?? "csv");
  if (query?.action) params.set("action", query.action);
  if (query?.since) params.set("since", query.since);
  if (query?.until) params.set("until", query.until);
  return eosFetch<{
    format: "json" | "csv";
    csv?: string;
    suppression: AiRecommendSuppression | null;
    suppressed: boolean;
    audits: AiRecommendStaleAudit[];
    count: number;
    filter: { action: string | null; since: string | null; until: string | null };
    generatedAt: string;
    increment: string;
  }>(`/v1/ai/recommendations/last-run/stale/export?${params.toString()}`, { token });
}

export async function snoozeAiRecommendStale(token: string, hours = 24) {
  return eosFetch<{
    suppression: AiRecommendSuppression;
    suppressed: boolean;
    increment: string;
  }>("/v1/ai/recommendations/last-run/stale/snooze", {
    token,
    method: "POST",
    body: JSON.stringify({ hours }),
  });
}

export async function acknowledgeAiRecommendStale(token: string) {
  return eosFetch<{
    suppression: AiRecommendSuppression;
    suppressed: boolean;
    increment: string;
  }>("/v1/ai/recommendations/last-run/stale/ack", { token, method: "POST", body: "{}" });
}

export async function listAiDrafts(token: string, query?: string | AiDraftListQuery) {
  const filters: AiDraftListQuery = typeof query === "string" ? { status: query } : (query ?? {});
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.artefactType) params.set("artefactType", filters.artefactType);
  const q = params.toString() ? `?${params.toString()}` : "";
  return eosFetch<{
    items: AiDraft[];
    pendingCount: number;
    filters: { status: string | null; artefactType: string | null };
    increment: string;
  }>(`/v1/ai/drafts${q}`, { token });
}

export async function getAiDraftSummary(token: string) {
  return eosFetch<{ pendingCount: number; increment: string }>("/v1/ai/drafts/summary", { token });
}

export async function createAiDraft(token: string, recommendationKey: string) {
  const result = await eosFetch<{ draft: AiDraft; increment: string }>("/v1/ai/drafts", {
    token,
    method: "POST",
    body: JSON.stringify({ recommendationKey }),
  });
  notifyAiDraftsChanged();
  return result;
}

export async function acceptAiDraft(token: string, id: string) {
  const result = await eosFetch<{
    draft: AiDraft;
    task?: { id: string; title: string };
    activity?: { id: string; subject: string };
    increment: string;
  }>(`/v1/ai/drafts/${id}/accept`, { token, method: "POST", body: "{}" });
  notifyAiDraftsChanged();
  return result;
}

export async function discardAiDraft(token: string, id: string) {
  const result = await eosFetch<{ draft: AiDraft; increment: string }>(`/v1/ai/drafts/${id}/discard`, {
    token,
    method: "POST",
    body: "{}",
  });
  notifyAiDraftsChanged();
  return result;
}
