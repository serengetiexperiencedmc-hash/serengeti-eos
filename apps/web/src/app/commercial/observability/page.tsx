"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  getObsHealth,
  getObsMap,
  HEALTH_STATUS_LABELS,
  listObsTraces,
  type HealthStatus,
  type ObsHealth,
  type ObsMapEdge,
  type ObsMapNode,
  type ObsTrace,
} from "@/lib/obs-api";

function statusBadge(status: HealthStatus) {
  if (status === "ok") return <Badge variant="won" label="OK" />;
  if (status === "degraded") return <Badge variant="review" label="Degraded" />;
  if (status === "unavailable") return <Badge variant="urgent" label="Unavailable" />;
  return <Badge variant="draft" label="Unknown" />;
}

function edgeLabel(edge: ObsMapEdge, nodes: ObsMapNode[]) {
  const from = nodes.find((n) => n.ciId === edge.fromCiId);
  const to = nodes.find((n) => n.ciId === edge.toCiId);
  return `${from?.ciCode ?? edge.fromCiId} depends on ${to?.ciCode ?? edge.toCiId}`;
}

export default function ObservabilityPage() {
  const { token, ready } = useEosSession();
  const [health, setHealth] = useState<ObsHealth | null>(null);
  const [nodes, setNodes] = useState<ObsMapNode[]>([]);
  const [edges, setEdges] = useState<ObsMapEdge[]>([]);
  const [traces, setTraces] = useState<ObsTrace[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [h, map, t] = await Promise.all([getObsHealth(token), getObsMap(token), listObsTraces(token)]);
      setHealth(h);
      setNodes(map.nodes);
      setEdges(map.edges);
      setTraces(t.items);
    } catch (err) {
      setHealth(null);
      setNodes([]);
      setEdges([]);
      setTraces([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load observability");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  const visible = useMemo(() => {
    if (!statusFilter) return nodes;
    return nodes.filter((n) => n.status === statusFilter);
  }, [nodes, statusFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view observability.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I12 · IT"
        title="Observability"
        subtitle="Health dependency map from CMDB depends_on · in-process traces"
        actions={
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => void load()}>
              Refresh
            </Btn>
            <Btn variant="secondary" href="/commercial/cmdb">
              CMDB
            </Btn>
            <Btn variant="secondary" href="/commercial">
              ← Dashboard
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card title="Nodes">
            <div className="font-display text-2xl font-semibold text-ink">{health.nodes}</div>
          </Card>
          <Card title="Dependencies">
            <div className="font-display text-2xl font-semibold text-ink">{health.edges}</div>
          </Card>
          <Card title="Traces">
            <div className="font-display text-2xl font-semibold text-ink">{health.traces}</div>
          </Card>
          <Card title="Error rate">
            <div className="font-display text-2xl font-semibold text-ink">
              {Math.round(health.slo.errorRate * 1000) / 10}%
            </div>
            {health.slo.p95Ms != null && <p className="mt-1 text-xs text-muted">p95 {health.slo.p95Ms}ms</p>}
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading observability…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Card
            title="Health dependency map"
            headerExtra={
              <select className="rounded-md border border-line px-2 py-1 text-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All statuses</option>
                {(Object.keys(HEALTH_STATUS_LABELS) as HealthStatus[]).map((value) => (
                  <option key={value} value={value}>
                    {HEALTH_STATUS_LABELS[value]}
                  </option>
                ))}
              </select>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No configuration items in the operational map.</p>
            ) : (
              <div className="divide-y divide-line">
                {visible.map((node) => (
                  <div key={node.ciId} className="flex items-center justify-between gap-3 px-1 py-3">
                    <div>
                      <div className="font-medium text-ink">{node.name}</div>
                      <div className="text-xs text-muted">
                        {node.ciCode} · {node.ciClass} · {node.probe ?? "no probe"} · {node.reason}
                      </div>
                    </div>
                    {statusBadge(node.status)}
                  </div>
                ))}
              </div>
            )}
            {edges.length > 0 && (
              <div className="mt-4 border-t border-line pt-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">depends_on</p>
                <ul className="space-y-1 text-sm text-ink">
                  {edges.map((edge) => (
                    <li key={`${edge.fromCiId}-${edge.toCiId}`}>{edgeLabel(edge, nodes)}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
        <div className="xl:col-span-2">
          <Card title="Recent traces">
            {traces.length === 0 && !loading ? (
              <p className="text-sm text-muted">No tenant-scoped spans recorded yet.</p>
            ) : (
              <div className="divide-y divide-line">
                {traces.map((span) => (
                  <div key={span.spanId} className="px-1 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-ink">{span.name}</span>
                      {span.status === "error" ? <Badge variant="urgent" label={String(span.httpStatus)} /> : <Badge variant="won" label={String(span.httpStatus)} />}
                    </div>
                    <div className="text-xs text-muted">
                      {span.durationMs}ms · {span.traceId.slice(0, 12)}…
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
