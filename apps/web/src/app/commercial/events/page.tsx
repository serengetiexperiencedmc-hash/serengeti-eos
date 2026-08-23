"use client";

import { useCallback, useEffect, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import {
  assignDeadLetterOwner,
  bulkAssignDeadLetterOwners,
  acknowledgeDeadLetterSla,
  snoozeDeadLetterSla,
  executeEventReplay,
  getNatsConsumerLag,
  listDeadLetters,
  requestEventReplay,
  updateDeadLetterRemediation,
  getDlqSlaDigestStatus,
  exportDlqSlaDigestLastRun,
  dispatchDlqSlaDigest,
  dispatchDlqSlaDigestStaleAlert,
  snoozeDlqSlaDigestStale,
  acknowledgeDlqSlaDigestStale,
  type DeadLetterItem,
  type DigestFreshness,
  type DlqSlaDigestLastRun,
  type NatsLagMetrics,
} from "@/lib/events-api";

const NEXT_STATUS: Record<string, string[]> = {
  failed: ["investigating"],
  investigating: ["corrected", "permanently_rejected"],
  corrected: ["resolved"],
  replay_approved: ["resolved"],
  replayed: ["resolved"],
  permanently_rejected: ["closed"],
  resolved: ["closed"],
};
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
  const [owners, setOwners] = useState<string[]>([]);
  const [ownerFilter, setOwnerFilter] = useState<"all" | "unassigned" | string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [slaOnly, setSlaOnly] = useState(false);
  const [slaSummary, setSlaSummary] = useState<{
    thresholdHours: number;
    breachedCount: number;
    openCount: number;
  } | null>(null);
  const [assignDraft, setAssignDraft] = useState<Record<string, string>>({});
  const [bulkOwner, setBulkOwner] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [digestLastRun, setDigestLastRun] = useState<DlqSlaDigestLastRun | null>(null);
  const [digestOutboxCount, setDigestOutboxCount] = useState(0);
  const [digestFreshness, setDigestFreshness] = useState<DigestFreshness | null>(null);

  const reload = useCallback(async () => {
    if (!token) return;
    const query = {
      ...(ownerFilter === "unassigned"
        ? { unassigned: true as const }
        : ownerFilter !== "all"
          ? { owner: ownerFilter }
          : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(slaOnly ? { slaBreached: true as const } : {}),
    };
    const [lag, letters, digest] = await Promise.all([
      getNatsConsumerLag(token),
      listDeadLetters(token, query),
      getDlqSlaDigestStatus(token).catch(() => null),
    ]);
    setMetrics(lag);
    setDlq(letters.items);
    setOwners(letters.owners ?? []);
    setSlaSummary(letters.sla ?? null);
    setDigestLastRun(digest?.lastRun ?? null);
    setDigestOutboxCount(digest?.analytics.outboxDigestCount ?? 0);
    setDigestFreshness(digest?.freshness ?? null);
  }, [token, ownerFilter, statusFilter, slaOnly]);

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
        reason: "Commercial UI replay (I4.14)",
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

  async function handleRemediate(id: string, status: string) {
    if (!token) return;
    setBusy(true);
    setMsg(null);
    try {
      await updateDeadLetterRemediation(token, id, { status, remediation: `UI → ${status}` });
      setMsg(`Updated status to ${status}`);
      await reload();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Remediation failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSlaAck(id: string) {
    if (!token) return;
    setBusy(true);
    setMsg(null);
    try {
      await acknowledgeDeadLetterSla(token, id);
      setMsg("SLA escalation acknowledged");
      await reload();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Acknowledge failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSlaSnooze(id: string) {
    if (!token) return;
    setBusy(true);
    setMsg(null);
    try {
      await snoozeDeadLetterSla(token, id, { hours: 24 });
      setMsg("SLA escalation snoozed 24h");
      await reload();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Snooze failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleBulkAssign() {
    if (!token || selected.size === 0) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await bulkAssignDeadLetterOwners(token, {
        ids: [...selected],
        owner: bulkOwner.trim() === "" ? null : bulkOwner.trim(),
      });
      setMsg(
        bulkOwner.trim()
          ? `Assigned ${res.updated} to ${bulkOwner.trim()}`
          : `Cleared owner on ${res.updated}`,
      );
      setSelected(new Set());
      await reload();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Bulk assign failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleAssign(id: string) {
    if (!token) return;
    setBusy(true);
    setMsg(null);
    try {
      const raw = assignDraft[id]?.trim() ?? "";
      await assignDeadLetterOwner(token, id, raw === "" ? null : raw);
      setMsg(raw ? `Assigned to ${raw}` : "Cleared owner");
      await reload();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Assign failed");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return null;

  const openDlq = dlq.filter((d) => d.status === "failed" || d.status === "investigating" || d.status === "corrected");
  const replayable = (status: string) => status === "failed" || status === "corrected";

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        eyebrow="I4 · I4.15 · Events"
        title="Event Infrastructure"
        subtitle="NATS lag, DLQ SLA ack/snooze, bulk owner assign, and controlled replay"
        actions={
          token && selected.size > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <input
                className="rounded border border-line bg-paper px-2 py-1 text-xs"
                placeholder="Bulk owner"
                value={bulkOwner}
                onChange={(e) => setBulkOwner(e.target.value)}
              />
              <Btn variant="secondary" disabled={busy} onClick={() => void handleBulkAssign()}>
                Assign selected ({selected.size})
              </Btn>
              <Btn disabled={busy} onClick={() => void handleReplay()}>
                {busy ? "Working…" : `Replay selected (${selected.size})`}
              </Btn>
            </div>
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
            Filter by owner/status/SLA age, ack/snooze escalations, bulk-assign owners, remediate, then replay (I4.15).
            {slaSummary
              ? ` · SLA ${slaSummary.thresholdHours}h: ${slaSummary.breachedCount}/${slaSummary.openCount} open breached`
              : ""}
            {digestLastRun
              ? ` · digest last run ${digestLastRun.day} (${digestLastRun.breachedCount} breached, ${digestLastRun.dispatchedCount} sent)`
              : " · digest never run"}
            {digestOutboxCount > 0 ? ` · outbox ${digestOutboxCount}` : ""}
          </p>
          {digestFreshness?.stale && (
            <p className="mb-3 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
              {digestFreshness.neverRun
                ? `DLQ SLA digest has never run (stale after ${digestFreshness.thresholdHours}h).`
                : `DLQ SLA digest is stale (${digestFreshness.ageHours ?? "?"}h ≥ ${digestFreshness.thresholdHours}h).`}
            </p>
          )}
          {token && (
            <div className="mb-3 flex flex-wrap gap-2">
              <Btn
                variant="secondary"
                disabled={busy}
                onClick={() => {
                  void (async () => {
                    setBusy(true);
                    try {
                      const res = await dispatchDlqSlaDigest(token);
                      setMsg(
                        `DLQ digest: ${res.dispatched.length} sent${
                          res.lastRun ? ` · last run ${res.lastRun.day}` : ""
                        }`,
                      );
                      await reload();
                    } catch (err) {
                      setMsg(err instanceof Error ? err.message : "Digest failed");
                    } finally {
                      setBusy(false);
                    }
                  })();
                }}
              >
                Dispatch SLA digest
              </Btn>
              <Btn
                variant="secondary"
                disabled={busy}
                onClick={() => {
                  void exportDlqSlaDigestLastRun(token, "csv").then((res) => {
                    const blob = new Blob([res.csv ?? ""], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `dlq-sla-digest-${res.generatedAt.slice(0, 10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    setMsg("Exported DLQ digest last-run CSV");
                  });
                }}
              >
                Export last-run
              </Btn>
              <Btn
                variant="secondary"
                disabled={busy || !digestFreshness?.stale}
                onClick={() => {
                  void (async () => {
                    setBusy(true);
                    try {
                      const res = await dispatchDlqSlaDigestStaleAlert(token);
                      setMsg(
                        res.dispatched.length > 0
                          ? `Stale digest alert: ${res.dispatched.length} sent`
                          : `Stale digest alert skipped (${res.skipped[0]?.reason ?? "none"})`,
                      );
                      await reload();
                    } catch (err) {
                      setMsg(err instanceof Error ? err.message : "Stale alert failed");
                    } finally {
                      setBusy(false);
                    }
                  })();
                }}
              >
                Escalate stale digest
              </Btn>
              <Btn
                variant="secondary"
                disabled={busy || !digestFreshness?.stale}
                onClick={() => {
                  void (async () => {
                    setBusy(true);
                    try {
                      await snoozeDlqSlaDigestStale(token, 24);
                      setMsg("Stale digest snoozed 24h");
                      await reload();
                    } catch (err) {
                      setMsg(err instanceof Error ? err.message : "Snooze failed");
                    } finally {
                      setBusy(false);
                    }
                  })();
                }}
              >
                Snooze stale 24h
              </Btn>
              <Btn
                variant="secondary"
                disabled={busy || !digestFreshness?.stale}
                onClick={() => {
                  void (async () => {
                    setBusy(true);
                    try {
                      await acknowledgeDlqSlaDigestStale(token);
                      setMsg("Stale digest acknowledged");
                      await reload();
                    } catch (err) {
                      setMsg(err instanceof Error ? err.message : "Ack failed");
                    } finally {
                      setBusy(false);
                    }
                  })();
                }}
              >
                Ack stale digest
              </Btn>
            </div>
          )}
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={`rounded-full border px-3 py-1 text-xs ${ownerFilter === "all" ? "border-ink bg-ink text-paper" : "border-line"}`}
              onClick={() => setOwnerFilter("all")}
            >
              All owners
            </button>
            <button
              type="button"
              className={`rounded-full border px-3 py-1 text-xs ${ownerFilter === "unassigned" ? "border-ink bg-ink text-paper" : "border-line"}`}
              onClick={() => setOwnerFilter("unassigned")}
            >
              Unassigned
            </button>
            {owners.map((o) => (
              <button
                key={o}
                type="button"
                className={`rounded-full border px-3 py-1 text-xs ${ownerFilter === o ? "border-ink bg-ink text-paper" : "border-line"}`}
                onClick={() => setOwnerFilter(o)}
              >
                {o}
              </button>
            ))}
            <button
              type="button"
              className={`rounded-full border px-3 py-1 text-xs ${slaOnly ? "border-rose-700 bg-rose-700 text-white" : "border-line"}`}
              onClick={() => setSlaOnly((v) => !v)}
            >
              SLA breached
            </button>
            <select
              className="rounded border border-line bg-paper px-2 py-1 text-xs"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              {["failed", "investigating", "corrected", "replay_approved", "replayed", "resolved", "permanently_rejected", "closed"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ),
              )}
            </select>
          </div>
          {dlq.length === 0 ? (
            <p className="text-sm text-muted">No dead letters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="py-2 pr-3" />
                    <th className="py-2 pr-3">Event</th>
                    <th className="py-2 pr-3">Consumer</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Age</th>
                    <th className="py-2 pr-3">Owner</th>
                    <th className="py-2 pr-3">Attempts</th>
                    <th className="py-2 pr-3">Failure</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dlq.map((d) => (
                    <tr key={d.id} className="border-b border-line/60">
                      <td className="py-2 pr-3">
                        <input
                          type="checkbox"
                          checked={selected.has(d.id)}
                          onChange={() => toggle(d.id)}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <div className="font-medium text-ink">{d.eventType}</div>
                        <div className="font-mono text-xs text-muted">{d.eventId}</div>
                      </td>
                      <td className="py-2 pr-3">{d.consumer}</td>
                      <td className="py-2 pr-3 capitalize">{d.status.replace(/_/g, " ")}</td>
                      <td className={`py-2 pr-3 ${d.slaBreached ? "font-medium text-rose-700" : "text-muted"}`}>
                        {d.ageHours !== undefined ? `${d.ageHours}h` : "—"}
                        {d.slaBreached ? " · SLA" : ""}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted">{d.owner ?? "—"}</span>
                          <div className="flex gap-1">
                            <input
                              className="w-24 rounded border border-line px-1 py-0.5 text-xs"
                              placeholder="owner"
                              value={assignDraft[d.id] ?? d.owner ?? ""}
                              onChange={(e) =>
                                setAssignDraft((prev) => ({ ...prev, [d.id]: e.target.value }))
                              }
                            />
                            <button
                              type="button"
                              disabled={busy}
                              className="rounded border border-line px-1.5 py-0.5 text-xs hover:bg-sand disabled:opacity-50"
                              onClick={() => void handleAssign(d.id)}
                            >
                              Set
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 pr-3">{d.attempts}</td>
                      <td className="py-2 pr-3 text-muted">{d.failureReason}</td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1">
                          {d.slaBreached && (
                            <>
                              <button
                                type="button"
                                disabled={busy}
                                className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                                onClick={() => void handleSlaAck(d.id)}
                              >
                                Ack SLA
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                                onClick={() => void handleSlaSnooze(d.id)}
                              >
                                Snooze 24h
                              </button>
                            </>
                          )}
                          {(NEXT_STATUS[d.status] ?? []).map((next) => (
                            <button
                              key={next}
                              type="button"
                              disabled={busy}
                              className="rounded border border-line px-2 py-0.5 text-xs hover:bg-sand disabled:opacity-50"
                              onClick={() => void handleRemediate(d.id, next)}
                            >
                              → {next.replace(/_/g, " ")}
                            </button>
                          ))}
                        </div>
                      </td>
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
