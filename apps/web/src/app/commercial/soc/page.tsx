"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  acknowledgeSocAlert,
  ALERT_STATUS_LABELS,
  closeSocAlert,
  getSocHealth,
  ingestSocAlert,
  listSocAlerts,
  openSocCase,
  type SocAlert,
} from "@/lib/soc-api";

function statusBadge(status: SocAlert["status"]) {
  if (status === "open") return <Badge variant="urgent" label="Open" />;
  if (status === "acknowledged") return <Badge variant="review" label="Acknowledged" />;
  return <Badge variant="draft" label="Closed" />;
}

export default function SocPage() {
  const { token, ready } = useEosSession();
  const [alerts, setAlerts] = useState<SocAlert[]>([]);
  const [health, setHealth] = useState<{ alerts: number; openAlerts: number; cases: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [severity, setSeverity] = useState<SocAlert["severity"]>("medium");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listSocAlerts(token), getSocHealth(token)]);
      setAlerts(list.items);
      setHealth({ alerts: h.alerts, openAlerts: h.openAlerts, cases: h.cases });
    } catch (err) {
      setAlerts([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load SOC");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  async function run(action: () => Promise<void>) {
    if (!token) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alerts.filter((a) => {
      if (statusFilter && a.status !== statusFilter) return false;
      if (!q) return true;
      return `${a.alertCode} ${a.title}`.toLowerCase().includes(q);
    });
  }, [alerts, query, statusFilter]);

  const selected = alerts.find((a) => a.id === selectedId) ?? null;

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view SOC.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I13 · Security"
        title="SOC"
        subtitle="Dev/Test alert ingest · IR casefile is an I11 incident ticket"
        actions={
          <div className="flex gap-2">
            <Btn variant="secondary" href="/commercial/itsm">
              Service Desk
            </Btn>
            <Btn variant="secondary" href="/commercial">
              ← Dashboard
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card title="Alerts">
            <div className="font-display text-2xl font-semibold text-ink">{health.alerts}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openAlerts}</div>
          </Card>
          <Card title="IR cases">
            <div className="font-display text-2xl font-semibold text-ink">{health.cases}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading SOC…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Ingest (devtest.webhook)">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof ingestSocAlert>[1] = { title, severity };
                  if (summary.trim()) input.summary = summary.trim();
                  await ingestSocAlert(token!, input);
                  setTitle("");
                  setSummary("");
                  setMessage("Alert ingested");
                });
              }}
            >
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <select className="w-full rounded-md border border-line px-3 py-2 text-sm" value={severity} onChange={(e) => setSeverity(e.target.value as SocAlert["severity"])}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <textarea className="w-full rounded-md border border-line px-3 py-2 text-sm" rows={3} placeholder="Summary (not a log dump)" value={summary} onChange={(e) => setSummary(e.target.value)} />
              <Btn type="submit" disabled={busy}>
                Ingest alert
              </Btn>
            </form>
          </Card>

          <Card
            title="Queue"
            headerExtra={
              <div className="flex gap-2">
                <input className="w-32 rounded-md border border-line px-2 py-1 text-xs" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="rounded-md border border-line px-2 py-1 text-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All</option>
                  {Object.entries(ALERT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No alerts match the current filter.</p>
            ) : (
              <div className="divide-y divide-line">
                {visible.map((alert) => (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => setSelectedId(alert.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${selectedId === alert.id ? "bg-sand/50" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-ink">{alert.title}</div>
                      <div className="text-xs text-muted">
                        {alert.alertCode} · {alert.severity}
                        {alert.ticketCode ? ` · ${alert.ticketCode}` : ""}
                      </div>
                    </div>
                    {statusBadge(alert.status)}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          {!selected ? (
            <Card title="Alert detail">
              <p className="text-sm text-muted">Select an alert to acknowledge, close, or open an I11 incident case.</p>
            </Card>
          ) : (
            <Card title={selected.title} headerExtra={statusBadge(selected.status)}>
              <p className="mb-4 text-sm text-muted">
                {selected.alertCode} · {selected.source} · {selected.severity}
              </p>
              {selected.summary && <p className="mb-4 text-sm text-ink">{selected.summary}</p>}
              {selected.ticketCode && (
                <p className="mb-4 text-sm">
                  IR casefile:{" "}
                  <Link href="/commercial/itsm" className="text-gold-deep underline">
                    {selected.ticketCode}
                  </Link>
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {selected.status === "open" && (
                  <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await acknowledgeSocAlert(token!, selected.id); setMessage("Acknowledged"); })}>
                    Acknowledge
                  </Btn>
                )}
                {(selected.status === "open" || selected.status === "acknowledged") && !selected.ticketId && (
                  <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await openSocCase(token!, selected.id); setMessage("I11 incident opened"); })}>
                    Open case
                  </Btn>
                )}
                {(selected.status === "open" || selected.status === "acknowledged") && (
                  <Btn size="sm" variant="secondary" disabled={busy} onClick={() => void run(async () => { await closeSocAlert(token!, selected.id); setMessage("Closed"); })}>
                    Close
                  </Btn>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
