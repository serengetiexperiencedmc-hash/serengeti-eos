"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  createErmRisk,
  getErmHealth,
  listErmRisks,
  RISK_STATUS_LABELS,
  transitionErmRisk,
  type ErmRisk,
} from "@/lib/erm-api";

function statusBadge(status: ErmRisk["status"]) {
  if (status === "open") return <Badge variant="urgent" label="Open" />;
  if (status === "mitigating") return <Badge variant="progress" label="Mitigating" />;
  if (status === "accepted") return <Badge variant="review" label="Accepted" />;
  return <Badge variant="draft" label="Closed" />;
}

export default function ErmPage() {
  const { token, ready } = useEosSession();
  const [risks, setRisks] = useState<ErmRisk[]>([]);
  const [health, setHealth] = useState<{ risks: number; openRisks: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [ownerLabel, setOwnerLabel] = useState("");
  const [likelihood, setLikelihood] = useState("3");
  const [impact, setImpact] = useState("3");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listErmRisks(token), getErmHealth(token)]);
      setRisks(list.items);
      setHealth({ risks: h.risks, openRisks: h.openRisks });
    } catch (err) {
      setRisks([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load risk register");
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
    return risks.filter((risk) => {
      if (statusFilter && risk.status !== statusFilter) return false;
      if (!q) return true;
      return `${risk.riskCode} ${risk.title}`.toLowerCase().includes(q);
    });
  }, [risks, query, statusFilter]);

  const selected = risks.find((risk) => risk.id === selectedId) ?? null;

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the risk register.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I15 · Risk"
        title="Risk register"
        subtitle="Residual risks only · compliance obligations and Privacy RoPA/DSR are deferred"
        actions={
          <div className="flex gap-2">
            <Btn variant="secondary" href="/commercial/erm/treatments">
              Treatments
            </Btn>
            <Btn variant="secondary" href="/commercial">
              ← Dashboard
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Risks">
            <div className="font-display text-2xl font-semibold text-ink">{health.risks}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openRisks}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading risk register…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register risk">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createErmRisk>[1] = {
                    title,
                    likelihood: Number(likelihood),
                    impact: Number(impact),
                  };
                  if (summary.trim()) input.summary = summary.trim();
                  if (ownerLabel.trim()) input.ownerLabel = ownerLabel.trim();
                  const created = await createErmRisk(token!, input);
                  setSelectedId(created.risk.id);
                  setTitle("");
                  setSummary("");
                  setOwnerLabel("");
                  setLikelihood("3");
                  setImpact("3");
                  setMessage("Risk registered");
                });
              }}
            >
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-muted">
                  Likelihood
                  <select className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm" value={likelihood} onChange={(e) => setLikelihood(e.target.value)}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-muted">
                  Impact
                  <select className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm" value={impact} onChange={(e) => setImpact(e.target.value)}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Owner label (optional)" value={ownerLabel} onChange={(e) => setOwnerLabel(e.target.value)} />
              <textarea className="w-full rounded-md border border-line px-3 py-2 text-sm" rows={3} placeholder="Summary (optional)" value={summary} onChange={(e) => setSummary(e.target.value)} />
              <Btn type="submit" disabled={busy}>
                Register risk
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
                  {Object.entries(RISK_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No risks match the current filter.</p>
            ) : (
              <div className="divide-y divide-line">
                {visible.map((risk) => (
                  <button
                    key={risk.id}
                    type="button"
                    onClick={() => setSelectedId(risk.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${selectedId === risk.id ? "bg-sand/50" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-ink">{risk.title}</div>
                      <div className="text-xs text-muted">
                        {risk.riskCode} · L{risk.likelihood} / I{risk.impact}
                      </div>
                    </div>
                    {statusBadge(risk.status)}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          {!selected ? (
            <Card title="Risk detail">
              <p className="text-sm text-muted">Select a risk to mitigate, accept, or close.</p>
            </Card>
          ) : (
            <Card title={selected.title} headerExtra={statusBadge(selected.status)}>
              <p className="mb-4 text-sm text-muted">
                {selected.riskCode} · likelihood {selected.likelihood} · impact {selected.impact}
                {selected.ownerLabel ? ` · ${selected.ownerLabel}` : ""}
              </p>
              {selected.summary && <p className="mb-4 text-sm text-ink">{selected.summary}</p>}
              <div className="flex flex-wrap gap-2">
                {selected.status === "open" && (
                  <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await transitionErmRisk(token!, selected.id, "mitigate"); setMessage("Mitigating"); })}>
                    Mitigate
                  </Btn>
                )}
                {(selected.status === "open" || selected.status === "mitigating") && (
                  <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await transitionErmRisk(token!, selected.id, "accept"); setMessage("Accepted"); })}>
                    Accept
                  </Btn>
                )}
                {selected.status !== "closed" && (
                  <Btn size="sm" variant="secondary" disabled={busy} onClick={() => void run(async () => { await transitionErmRisk(token!, selected.id, "close"); setMessage("Closed"); })}>
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
