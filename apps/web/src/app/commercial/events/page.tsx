"use client";

import { useCallback, useEffect, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import {
  executeEventReplay,
  getNatsConsumerLag,
  listDeadLetters,
  requestEventReplay,
  type DeadLetterItem,
  type NatsLagMetrics,
} from "@/lib/events-api";

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
  const [dlq, setDlq] = useState<DeadLetterItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    if (!token) return;
    const [lag, letters] = await Promise.all([getNatsConsumerLag(token), listDeadLetters(token)]);
    setMetrics(lag);
    setDlq(letters.items);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    reload().catch((err) => setError(err instanceof Error ? err.message : "Failed to load events"));
  }, [token, reload]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleReplay() {
    if (!token || selected.size === 0) return;
    setBusy(true);
    setMsg(null);
    try {
      const req = await requestEventReplay(token, {
        reason: "Commercial UI replay (I4.9)",
        intent: "reexecute",
        deadLetterIds: [...selected],
      });
      const exec = await executeEventReplay(token, req.id);
      setMsg(`Replayed ${exec.replayed} dead letter(s)`);
      setSelected(new Set());
      await reload();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Replay failed");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return null;

  const openDlq = dlq.filter((d) => d.status === "failed");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        eyebrow="I4 · I4.9 · Events"
        title="Event Infrastructure"
        subtitle="NATS lag, DLQ, and controlled replay"
        actions={
          token && selected.size > 0 ? (
            <Btn disabled={busy} onClick={() => void handleReplay()}>
              {busy ? "Replaying…" : `Replay selected (${selected.size})`}
            </Btn>
          ) : undefined
        }
      />

      {error ? (
        <div className="mt-6 rounded-[10px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-800">{error}</div>
      ) : null}
      {msg ? <p className="mt-4 text-sm text-gold-deep">{msg}</p> : null}

      <div className="mt-6">
        <Card title={`Dead letter queue (${openDlq.length} open / ${dlq.length} total)`}>
          <p className="mb-3 text-sm text-muted">
            Select failed entries and replay to re-queue outbox publish (I4.9).
          </p>
          {dlq.length === 0 ? (
            <p className="text-sm text-muted">No dead letters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="py-2 pr-3" />
                    <th className="py-2 pr-3">Event</th>
                    <th className="py-2 pr-3">Consumer</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Attempts</th>
                    <th className="py-2">Failure</th>
                  </tr>
                </thead>
                <tbody>
                  {dlq.map((d) => (
                    <tr key={d.id} className="border-b border-line/60">
                      <td className="py-2 pr-3">
                        {d.status === "failed" ? (
                          <input
                            type="checkbox"
                            checked={selected.has(d.id)}
                            onChange={() => toggle(d.id)}
                          />
                        ) : null}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="font-medium text-ink">{d.eventType}</div>
                        <div className="font-mono text-xs text-muted">{d.eventId}</div>
                      </td>
                      <td className="py-2 pr-3">{d.consumer}</td>
                      <td className="py-2 pr-3 capitalize">{d.status.replace(/_/g, " ")}</td>
                      <td className="py-2 pr-3">{d.attempts}</td>
                      <td className="py-2 text-muted">{d.failureReason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

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
              <div className="mt-1 text-xl font-semibold">{metrics.summary.brokerLag ?? "—"}</div>
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
