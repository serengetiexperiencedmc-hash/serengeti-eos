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

export async function listAiRecommendations(token: string) {
  return eosFetch<{
    items: AiRecommendation[];
    provider: string;
    autonomyCeiling: number;
    increment: string;
  }>("/v1/ai/recommendations", { token });
}
