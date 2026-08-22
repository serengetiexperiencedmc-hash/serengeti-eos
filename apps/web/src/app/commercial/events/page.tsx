"use client";

import { useEffect, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Card, PageHeader } from "@/components/commercial/ui";
import { getNatsConsumerLag, type NatsLagMetrics } from "@/lib/events-api";

function formatMs(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  return `${(ms / 3_600_000).toFixed(1)}h`;
}

function statusColor(status: NatsLagMetrics["summary"]["status"]): string {
  if (status === "ok") return "text-emerald-700";
  if (status === "degraded") return "text-amber-700";
  return "text-rose-700";
}

export default function EventsInfrastructurePage() {
  const { token, ready } = useEosSession();
  const [metrics, setMetrics] = useState<NatsLagMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getNatsConsumerLag(token)
      .then(setMetrics)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load lag metrics"));
  }, [token]);

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        title="Event Infrastructure"
        subtitle="NATS JetStream consumer lag and tenant filter subjects (I4.7)"
      />

      {error ? (
        <div className="mt-6 rounded-[10px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-800">{error}</div>
      ) : null}

      {metrics ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <div className="text-xs uppercase tracking-wide text-stone-500">Status</div>
              <div className={`mt-1 text-xl font-semibold ${statusColor(metrics.summary.status)}`}>
                {metrics.summary.status}
              </div>
              <div className="mt-1 text-sm text-stone-600">
                NATS {metrics.natsConfigured ? "connected" : "not configured"}
              </div>
            </Card>
            <Card>
              <div className="text-xs uppercase tracking-wide text-stone-500">Broker lag</div>
              <div className="mt-1 text-xl font-semibold">
                {metrics.summary.brokerLag ?? "—"}
              </div>
              <div className="mt-1 text-sm text-stone-600">stream head − ack floor</div>
            </Card>
            <Card>
              <div className="text-xs uppercase tracking-wide text-stone-500">Tenants tracked</div>
              <div className="mt-1 text-xl font-semibold">{metrics.summary.tenantsTracked}</div>
              <div className="mt-1 text-sm text-stone-600">stored offset checkpoints</div>
            </Card>
            <Card>
              <div className="text-xs uppercase tracking-wide text-stone-500">Max tenant lag</div>
              <div className="mt-1 text-xl font-semibold">
                {metrics.summary.maxTenantStreamLag ?? "—"}
              </div>
              <div className="mt-1 text-sm text-stone-600">stream head − tenant checkpoint</div>
            </Card>
            <Card>
              <div className="text-xs uppercase tracking-wide text-stone-500">Max staleness</div>
              <div className="mt-1 text-xl font-semibold">{formatMs(metrics.summary.maxStalenessMs)}</div>
              <div className="mt-1 text-sm text-stone-600">since last processed seq</div>
            </Card>
          </div>

          {metrics.tenantFilter ? (
            <div className="mt-6">
              <Card title="Tenant filter subject (I4.7)">
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div className="sm:col-span-2">
                    <dt className="text-stone-500">Filter</dt>
                    <dd className="font-mono text-xs font-medium">{metrics.tenantFilter.subject}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Durable</dt>
                    <dd className="font-medium">{metrics.tenantFilter.durableName}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Tenant broker lag</dt>
                    <dd className="font-medium">
                      {metrics.summary.tenantBrokerLag ?? metrics.tenantFilter.brokerLag ?? "—"}
                    </dd>
                  </div>
                </dl>
              </Card>
            </div>
          ) : null}

          {metrics.tenantIndex ? (
            <div className="mt-6">
              <Card title="Recent stream scan (last 50 seq)">
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-stone-500">Scanned</dt>
                    <dd className="font-medium">{metrics.tenantIndex.scanned}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Tenant messages</dt>
                    <dd className="font-medium">{metrics.tenantIndex.tenantMessages}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Other tenants</dt>
                    <dd className="font-medium">{metrics.tenantIndex.otherTenantMessages}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          ) : null}

          {metrics.stream ? (
            <div className="mt-6">
            <Card title={`Stream ${metrics.stream.name}`}>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-stone-500">Last seq</dt>
                  <dd className="font-medium">{metrics.stream.lastSeq}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Messages</dt>
                  <dd className="font-medium">{metrics.stream.messageCount}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">First seq</dt>
                  <dd className="font-medium">{metrics.stream.firstSeq}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Bytes</dt>
                  <dd className="font-medium">{metrics.stream.bytes.toLocaleString()}</dd>
                </div>
              </dl>
            </Card>
            </div>
          ) : null}

          {metrics.durableConsumer ? (
            <div className="mt-6">
            <Card title="Durable consumer">
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-stone-500">Durable</dt>
                  <dd className="font-medium">{metrics.durableConsumer.durableName}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Logical</dt>
                  <dd className="font-medium">{metrics.durableConsumer.logicalConsumer}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Pending</dt>
                  <dd className="font-medium">{metrics.durableConsumer.numPending}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Ack pending</dt>
                  <dd className="font-medium">{metrics.durableConsumer.numAckPending}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Ack floor seq</dt>
                  <dd className="font-medium">{metrics.durableConsumer.ackFloorStreamSeq ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Delivered seq</dt>
                  <dd className="font-medium">{metrics.durableConsumer.deliveredStreamSeq ?? "—"}</dd>
                </div>
              </dl>
            </Card>
            </div>
          ) : null}

          <div className="mt-6 overflow-x-auto">
          <Card title="Tenant offsets">
            {metrics.offsets.length === 0 ? (
              <p className="mt-3 text-sm text-stone-600">No offset checkpoints recorded yet.</p>
            ) : (
              <table className="mt-4 w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500">
                    <th className="py-2 pr-4">Consumer</th>
                    <th className="py-2 pr-4">Stream</th>
                    <th className="py-2 pr-4">Last seq</th>
                    <th className="py-2 pr-4">Tenant lag</th>
                    <th className="py-2 pr-4">Last event</th>
                    <th className="py-2 pr-4">Staleness</th>
                    <th className="py-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.offsets.map((o) => (
                    <tr key={`${o.consumer}:${o.stream}`} className="border-b border-stone-100">
                      <td className="py-2 pr-4 font-medium">{o.consumer}</td>
                      <td className="py-2 pr-4">{o.stream}</td>
                      <td className="py-2 pr-4">{o.lastStreamSeq}</td>
                      <td className="py-2 pr-4">{o.tenantStreamLag ?? "—"}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{o.lastEventId ?? "—"}</td>
                      <td className="py-2 pr-4">{formatMs(o.stalenessMs)}</td>
                      <td className="py-2 text-stone-600">{new Date(o.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
          </div>

          <p className="mt-4 text-xs text-stone-500">
            As of {new Date(metrics.asOf).toLocaleString()} · transport {metrics.transport.ok ? "ok" : "degraded"} (
            {metrics.transport.detail})
          </p>
        </>
      ) : (
        !error && (
          <div className="mt-6 rounded-[10px] border border-line bg-paper px-5 py-4 text-stone-600">
            Loading lag metrics…
          </div>
        )
      )}
    </div>
  );
}
