export const HEALTH_STATUSES = ["ok", "degraded", "unavailable", "unknown"] as const;
export type HealthStatus = (typeof HEALTH_STATUSES)[number];

export const OBS_PROBE_KEYS = ["api", "web", "oltp"] as const;
export type ObsProbeKey = (typeof OBS_PROBE_KEYS)[number];

export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  ok: "OK",
  degraded: "Degraded",
  unavailable: "Unavailable",
  unknown: "Unknown",
};

export type HealthMapNodeInput = {
  id: string;
  ciCode: string;
  name: string;
  ciClass: string;
  lifecycle: string;
};

export type HealthMapEdgeInput = {
  fromCiId: string;
  toCiId: string;
  relType: string;
};

export function isValidHealthStatus(value: string): value is HealthStatus {
  return (HEALTH_STATUSES as readonly string[]).includes(value);
}

export function mapCiProbeKey(ci: { ciClass: string; name: string }): ObsProbeKey | undefined {
  if (ci.ciClass === "database") return "oltp";
  if (ci.ciClass === "application" && /api/i.test(ci.name)) return "api";
  if (ci.ciClass === "application" && /web/i.test(ci.name)) return "web";
  return undefined;
}

export function correlationToTraceId(correlationId: string): string {
  return correlationId.replace(/-/g, "").toLowerCase();
}

export function rollupHealth(self: HealthStatus, dependencyStatuses: readonly HealthStatus[]): HealthStatus {
  if (self === "unavailable") return "unavailable";
  const depBad = dependencyStatuses.some((s) => s === "unavailable" || s === "degraded");
  if (depBad) return "degraded";
  return self;
}

export function percentileNearestRank(values: readonly number[], percentile: number): number | undefined {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.min(sorted.length, Math.max(1, Math.ceil((percentile / 100) * sorted.length)));
  return sorted[rank - 1];
}

export function trimRing<T>(items: T[], max: number): T[] {
  if (items.length <= max) return items;
  return items.slice(items.length - max);
}

export type HealthMapNode = HealthMapNodeInput & {
  probe?: ObsProbeKey;
  status: HealthStatus;
  reason: string;
};

export type HealthMapEdge = {
  fromCiId: string;
  toCiId: string;
  relType: "depends_on";
};

export function buildHealthDependencyMap(
  nodes: readonly HealthMapNodeInput[],
  edges: readonly HealthMapEdgeInput[],
  probeStatus: Partial<Record<ObsProbeKey, HealthStatus>>,
): { nodes: HealthMapNode[]; edges: HealthMapEdge[] } {
  const dependsOn = edges.filter((e) => e.relType === "depends_on");
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const mapEdges: HealthMapEdge[] = dependsOn
    .filter((e) => byId.has(e.fromCiId) && byId.has(e.toCiId))
    .map((e) => ({ fromCiId: e.fromCiId, toCiId: e.toCiId, relType: "depends_on" as const }));

  const dependencies = new Map<string, string[]>();
  for (const node of nodes) {
    dependencies.set(node.id, []);
  }
  for (const edge of mapEdges) {
    dependencies.get(edge.fromCiId)?.push(edge.toCiId);
  }

  const status = new Map<string, HealthStatus>();
  const reason = new Map<string, string>();
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const resolve = (id: string): HealthStatus => {
    const existing = status.get(id);
    if (existing && visited.has(id)) return existing;
    if (visiting.has(id)) {
      status.set(id, "unknown");
      reason.set(id, "cycle");
      return "unknown";
    }
    visiting.add(id);
    const node = byId.get(id);
    if (!node) return "unknown";
    const probe = mapCiProbeKey(node);
    const self: HealthStatus = probe ? (probeStatus[probe] ?? "unknown") : "unknown";
    const depIds = dependencies.get(id) ?? [];
    const depStatuses = depIds.map((depId) => resolve(depId));
    const rolled = rollupHealth(self, depStatuses);
    let why = probe ? `probe:${probe}` : "no_probe";
    if (self === "unavailable") why = `${why}:self_unavailable`;
    else if (depStatuses.some((s) => s === "unavailable" || s === "degraded")) why = `${why}:dependency`;
    status.set(id, rolled);
    reason.set(id, why);
    visiting.delete(id);
    visited.add(id);
    return rolled;
  };

  for (const node of nodes) resolve(node.id);

  return {
    nodes: nodes.map((node) => {
      const probe = mapCiProbeKey(node);
      const out: HealthMapNode = {
        ...node,
        status: status.get(node.id) ?? "unknown",
        reason: reason.get(node.id) ?? "no_probe",
      };
      if (probe) out.probe = probe;
      return out;
    }),
    edges: mapEdges,
  };
}

export type OtelSpan = {
  id: string;
  tenantId: string;
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
