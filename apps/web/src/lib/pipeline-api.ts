import { eosFetch } from "./eos-client";

export type PipelineOpportunity = {
  id: string;
  opportunityCode: string;
  title: string;
  organizationId: string;
  stage: string;
  status: string;
  programmeSummary?: string;
  estimatedValue?: number;
  currency?: string;
  paxCount?: number;
  ownerPrincipalId: string;
  updatedAt: string;
};

export type PipelineBoardColumn = {
  stage: string;
  label: string;
  count: number;
  items: PipelineOpportunity[];
};

export function formatCurrency(value: number | undefined, currency = "USD"): string {
  if (value === undefined) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export async function fetchPipelineBoard(token: string) {
  return eosFetch<{ columns: PipelineBoardColumn[] }>("/v1/pipeline/board", { token });
}

export async function listOpportunities(token: string, query?: { stage?: string }) {
  const params = new URLSearchParams();
  if (query?.stage) params.set("stage", query.stage);
  const qs = params.toString();
  return eosFetch<{ items: PipelineOpportunity[] }>(`/v1/pipeline/opportunities${qs ? `?${qs}` : ""}`, { token });
}

export async function fetchPipelineHealth(token: string) {
  return eosFetch<{ opportunities: number }>("/v1/pipeline/health", { token });
}
