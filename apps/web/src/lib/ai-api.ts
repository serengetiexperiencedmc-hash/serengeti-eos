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
  appliedEntityId?: string;
};

export async function listAiRecommendations(token: string) {
  return eosFetch<{
    items: AiRecommendation[];
    provider: string;
    autonomyCeiling: number;
    increment: string;
  }>("/v1/ai/recommendations", { token });
}

export async function listAiDrafts(token: string, status?: string) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  return eosFetch<{ items: AiDraft[]; increment: string }>(`/v1/ai/drafts${q}`, { token });
}

export async function createAiDraft(token: string, recommendationKey: string) {
  return eosFetch<{ draft: AiDraft; increment: string }>("/v1/ai/drafts", {
    token,
    method: "POST",
    body: JSON.stringify({ recommendationKey }),
  });
}

export async function acceptAiDraft(token: string, id: string) {
  return eosFetch<{
    draft: AiDraft;
    task?: { id: string; title: string };
    activity?: { id: string; subject: string };
    increment: string;
  }>(`/v1/ai/drafts/${id}/accept`, { token, method: "POST", body: "{}" });
}

export async function discardAiDraft(token: string, id: string) {
  return eosFetch<{ draft: AiDraft; increment: string }>(`/v1/ai/drafts/${id}/discard`, {
    token,
    method: "POST",
    body: "{}",
  });
}
