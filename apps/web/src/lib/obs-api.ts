import { eosFetch } from "./eos-client";

export type HealthStatus = "ok" | "degraded" | "unavailable" | "unknown";

export type ObsMapNode = {
  ciId: string;
  ciCode: string;
  name: string;
  ciClass: string;
  lifecycle: string;
  status: HealthStatus;
  reason: string;
  probe?: string;
};

export type ObsMapEdge = {
  fromCiId: string;
  toCiId: string;
  relType: "depends_on";
};

export type ObsTrace = {
  traceId: string;
  spanId: string;
  name: string;
  startTime: string;
  durationMs: number;
  status: "ok" | "error";
  httpMethod: string;
  httpRoute: string;
  httpStatus: number;
};

export type ObsHealth = {
  increment: string;
  nodes: number;
  edges: number;
  traces: number;
  byStatus: Record<HealthStatus, number>;
  slo: { window: string; requests: number; errors: number; errorRate: number; p95Ms?: number };
};

export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  ok: "OK",
  degraded: "Degraded",
  unavailable: "Unavailable",
  unknown: "Unknown",
};

export async function getObsHealth(token: string) {
  return eosFetch<ObsHealth>("/v1/observability/health", { token });
}

export async function getObsMap(token: string) {
  return eosFetch<{ generatedAt: string; nodes: ObsMapNode[]; edges: ObsMapEdge[] }>(
    "/v1/observability/map",
    { token },
  );
}

export async function listObsTraces(token: string) {
  return eosFetch<{ items: ObsTrace[] }>("/v1/observability/traces?limit=50", { token });
}
