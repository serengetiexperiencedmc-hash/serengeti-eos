"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import { listCrisisCases, type CrisisCase } from "@/lib/crisis-api";
import {
  CRISIS_DECISION_STATUS_LABELS,
  createCrisisDecision,
  getCrisisDecisionsHealth,
  listCrisisDecisions,
  supersedeCrisisDecision,
  type CrisisDecision,
} from "@/lib/crisis-decisions-api";

function statusBadge(status: CrisisDecision["status"]) {
  if (status === "recorded") return <Badge variant="review" label="Recorded" />;
  return <Badge variant="draft" label="Superseded" />;
}

export default function CrisisDecisionsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<CrisisDecision[]>([]);
  const [cases, setCases] = useState<CrisisCase[]>([]);
  const [health, setHealth] = useState<{ decisions: number; recordedDecisions: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState("");
  const [chosenAction, setChosenAction] = useState("");
  const [rationale, setRationale] = useState("");
  const [authorityLabel, setAuthorityLabel] = useState("");
  const [crisisId, setCrisisId] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listCrisisDecisions(token), getCrisisDecisionsHealth(token)]);
      setItems(list.items);
      setHealth({ decisions: h.decisions, recordedDecisions: h.recordedDecisions });
      try {
        const overlay = await listCrisisCases(token);
        setCases(overlay.items.filter((row) => row.status === "open"));
      } catch {
        setCases([]);
      }
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load decisions");
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
    return items.filter((row) => {
      if (statusFilter && row.status !== statusFilter) return false;
      if (!q) return true;
      return `${row.decisionCode} ${row.title} ${row.crisisCode ?? ""}`.toLowerCase().includes(q);
    });
  }, [items, query, statusFilter]);

  const selected = items.find((row) => row.id === selectedId) ?? null;

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the decision log.</p>;

  return (
    <>
      <PageHeader
        eyebrow="K1 · Crisis"
        title="Decisions"
        subtitle="Decision log only · not emcomms, not an exercise engine, and not an I18 timeline replacement"
        actions={
          <Btn variant="secondary" href="/commercial/crisis">
            ← Declaration
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Decisions">
            <div className="font-display text-2xl font-semibold text-ink">{health.decisions}</div>
          </Card>
          <Card title="Recorded">
            <div className="font-display text-2xl font-semibold text-ink">{health.recordedDecisions}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading decisions…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Record decision">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createCrisisDecision>[1] = { title, crisisId };
                  if (options.trim()) input.options = options.trim();
                  if (chosenAction.trim()) input.chosenAction = chosenAction.trim();
                  if (rationale.trim()) input.rationale = rationale.trim();
                  if (authorityLabel.trim()) input.authorityLabel = authorityLabel.trim();
                  const created = await createCrisisDecision(token!, input);
                  selectedIdRef.current = created.decision.id;
                  setSelectedId(created.decision.id);
                  setTitle("");
                  setOptions("");
                  setChosenAction("");
                  setRationale("");
                  setAuthorityLabel("");
                  setCrisisId("");
                  setMessage("Decision recorded");
                });
              }}
            >
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                rows={2}
                placeholder="Options (optional)"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
              />
              <textarea
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                rows={2}
                placeholder="Chosen action (optional)"
                value={chosenAction}
                onChange={(e) => setChosenAction(e.target.value)}
              />
              <textarea
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                rows={2}
                placeholder="Rationale (optional)"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
              />
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Authority label (optional)"
                value={authorityLabel}
                onChange={(e) => setAuthorityLabel(e.target.value)}
              />
              <select
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                value={crisisId}
                onChange={(e) => setCrisisId(e.target.value)}
                required
              >
                <option value="">Select an open crisis</option>
                {cases.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.crisisCode} · {row.title}
                  </option>
                ))}
              </select>
              <Btn type="submit" disabled={busy}>
                Record
              </Btn>
            </form>
          </Card>

          <Card
            title="Queue"
            headerExtra={
              <div className="flex gap-2">
                <input
                  className="w-32 rounded-md border border-line px-2 py-1 text-xs"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <select
                  className="rounded-md border border-line px-2 py-1 text-xs"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {Object.entries(CRISIS_DECISION_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No decisions match the current filter.</p>
            ) : (
              <div className="divide-y divide-line">
                {visible.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelectedId(row.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${selectedId === row.id ? "bg-sand/50" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-ink">{row.title}</div>
                      <div className="text-xs text-muted">
                        {row.decisionCode}
                        {row.crisisCode ? ` · ${row.crisisCode}` : ""}
                      </div>
                    </div>
                    {statusBadge(row.status)}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          {!selected ? (
            <Card title="Decision detail">
              <p className="text-sm text-muted">Select a decision to supersede it.</p>
            </Card>
          ) : (
            <Card title={selected.decisionCode} headerExtra={statusBadge(selected.status)}>
              <p className="mb-4 text-sm text-ink">{selected.title}</p>
              {selected.options && <p className="mb-2 text-sm text-muted">Options: {selected.options}</p>}
              {selected.chosenAction && (
                <p className="mb-2 text-sm text-muted">Chosen action: {selected.chosenAction}</p>
              )}
              {selected.rationale && <p className="mb-2 text-sm text-muted">Rationale: {selected.rationale}</p>}
              {selected.authorityLabel && (
                <p className="mb-2 text-sm text-muted">Authority: {selected.authorityLabel}</p>
              )}
              {selected.crisisCode && (
                <p className="mb-4 text-sm text-muted">References {selected.crisisCode} (I18 identifier only)</p>
              )}
              {selected.status === "recorded" && (
                <Btn
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await supersedeCrisisDecision(token!, selected.id);
                      setMessage("Decision superseded");
                    })
                  }
                >
                  Supersede
                </Btn>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
