import {
  authorize,
  buildHealthDependencyMap,
  correlationToTraceId,
  newId,
  percentileNearestRank,
  trimRing,
  type HealthStatus,
  type ObsProbeKey,
  type OtelSpan,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { OBS_SPAN_LIMIT, ensureObsCollections } from "./collections.js";

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

export type SpanView = {
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

function sanitizeSpan(span: OtelSpan): SpanView {
  return {
    traceId: span.traceId,
    spanId: span.spanId,
    name: span.name,
    startTime: span.startTime,
    durationMs: span.durationMs,
    status: span.status,
    httpMethod: span.httpMethod,
    httpRoute: span.httpRoute,
    httpStatus: span.httpStatus,
  };
}

export type ProbeSnapshot = Partial<Record<ObsProbeKey, HealthStatus>>;

export function recordHttpSpan(
  store: Store,
  input: {
    tenantId?: string;
    correlationId: string;
    method: string;
    route: string;
    statusCode: number;
    durationMs: number;
    startTime: string;
  },
): void {
  ensureObsCollections(store);
  if (!input.tenantId) return;
  const span: OtelSpan = {
    id: newId(),
    tenantId: input.tenantId,
    traceId: correlationToTraceId(input.correlationId),
    spanId: newId().replace(/-/g, "").slice(0, 16),
    name: `${input.method} ${input.route}`,
    startTime: input.startTime,
    durationMs: Math.max(0, input.durationMs),
    status: input.statusCode >= 500 ? "error" : "ok",
    httpMethod: input.method,
    httpRoute: input.route.split("?")[0] ?? input.route,
    httpStatus: input.statusCode,
  };
  store.otelSpans.push(span);
  store.otelSpans = trimRing(store.otelSpans, OBS_SPAN_LIMIT * 4);
}

function tenantSpans(store: Store, tenantId: string): OtelSpan[] {
  return store.otelSpans.filter((s) => s.tenantId === tenantId);
}

function sloSnapshot(spans: readonly OtelSpan[]) {
  const errors = spans.filter((s) => s.status === "error" || s.httpStatus >= 500).length;
  const snapshot: {
    window: "in_memory";
    requests: number;
    errors: number;
    errorRate: number;
    p95Ms?: number;
  } = {
    window: "in_memory",
    requests: spans.length,
    errors,
    errorRate: spans.length === 0 ? 0 : errors / spans.length,
  };
  const p95 = percentileNearestRank(
    spans.map((s) => s.durationMs),
    95,
  );
  if (p95 != null) snapshot.p95Ms = p95;
  return snapshot;
}

export function getObservabilityHealth(
  store: Store,
  principal: Principal,
  probes: ProbeSnapshot,
) {
  ensureObsCollections(store);
  const decision = authorize({
    principal,
    permission: "observability:read:map",
    action: "read:observability_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const map = buildMap(store, principal.tenantId, probes, false);
  const spans = tenantSpans(store, principal.tenantId);
  const byStatus = { ok: 0, degraded: 0, unavailable: 0, unknown: 0 };
  for (const node of map.nodes) byStatus[node.status] += 1;
  return {
    module: "observability",
    increment: "I12" as const,
    status: "ok" as const,
    nodes: map.nodes.length,
    edges: map.edges.length,
    traces: spans.length,
    byStatus,
    slo: sloSnapshot(spans),
  };
}

function operationalLifecycle(lifecycle: string) {
  return lifecycle === "active" || lifecycle === "maintenance";
}

function buildMap(store: Store, tenantId: string, probes: ProbeSnapshot, includeAll: boolean) {
  const cis = store.cmdbCis.filter((c) => c.tenantId === tenantId && (includeAll || operationalLifecycle(c.lifecycle)));
  const rels = store.cmdbRelationships.filter((r) => r.tenantId === tenantId);
  return buildHealthDependencyMap(
    cis.map((c) => ({
      id: c.id,
      ciCode: c.ciCode,
      name: c.name,
      ciClass: c.ciClass,
      lifecycle: c.lifecycle,
    })),
    rels.map((r) => ({ fromCiId: r.fromCiId, toCiId: r.toCiId, relType: r.relType })),
    probes,
  );
}

export function getObservabilityMap(
  store: Store,
  principal: Principal,
  probes: ProbeSnapshot,
  query?: { lifecycle?: string },
) {
  ensureObsCollections(store);
  const decision = authorize({
    principal,
    permission: "observability:read:map",
    action: "read:observability_map",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.lifecycle && query.lifecycle !== "all") {
    return { error: "invalid_request" as const, reason: "invalid_lifecycle" };
  }
  const map = buildMap(store, principal.tenantId, probes, query?.lifecycle === "all");
  return {
    generatedAt: new Date().toISOString(),
    nodes: map.nodes.map((n) => {
      const view: {
        ciId: string;
        ciCode: string;
        name: string;
        ciClass: string;
        lifecycle: string;
        status: HealthStatus;
        reason: string;
        probe?: ObsProbeKey;
      } = {
        ciId: n.id,
        ciCode: n.ciCode,
        name: n.name,
        ciClass: n.ciClass,
        lifecycle: n.lifecycle,
        status: n.status,
        reason: n.reason,
      };
      if (n.probe) view.probe = n.probe;
      return view;
    }),
    edges: map.edges,
  };
}

export function listObservabilityTraces(
  store: Store,
  principal: Principal,
  query?: { limit?: string },
) {
  ensureObsCollections(store);
  const decision = authorize({
    principal,
    permission: "observability:read:signal",
    action: "read:observability_signal",
  });
  if (decision.result === "deny") return deny(decision.reason);
  let limit = 50;
  if (query?.limit != null && query.limit !== "") {
    const parsed = Number(query.limit);
    if (!Number.isInteger(parsed) || parsed < 1) {
      return { error: "invalid_request" as const, reason: "invalid_limit" };
    }
    limit = Math.min(OBS_SPAN_LIMIT, parsed);
  }
  const items = [...tenantSpans(store, principal.tenantId)]
    .sort((a, b) => b.startTime.localeCompare(a.startTime))
    .slice(0, limit)
    .map(sanitizeSpan);
  return { items };
}
