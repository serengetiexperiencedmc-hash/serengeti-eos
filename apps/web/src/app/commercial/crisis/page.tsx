"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  closeCrisisCase,
  createCrisisCase,
  createCrisisTimelineEntry,
  CRISIS_SEVERITY_LABELS,
  CRISIS_STATUS_LABELS,
  getCrisisHealth,
  listCrisisCases,
  listCrisisTimeline,
  type CrisisCase,
  type CrisisSeverity,
  type CrisisTimelineEntry,
} from "@/lib/crisis-api";

function caseBadge(crisis: CrisisCase) {
  if (crisis.status === "closed") return <Badge variant="draft" label="Closed" />;
  if (crisis.severity === "l3") return <Badge variant="progress" label="L3 Crisis" />;
  return <Badge variant="review" label="L2 Overlay" />;
}

export default function CrisisDeclarationPage() {
  const { token, ready } = useEosSession();
  const [cases, setCases] = useState<CrisisCase[]>([]);
  const [timeline, setTimeline] = useState<CrisisTimelineEntry[]>([]);
  const [health, setHealth] = useState<{ cases: number; openCases: number; timelineEntries: number } | null>(null);
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
  const [severity, setSeverity] = useState<CrisisSeverity>("l2");
  const [commanderLabel, setCommanderLabel] = useState("");
  const [summary, setSummary] = useState("");
  const [timelineBody, setTimelineBody] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listCrisisCases(token), getCrisisHealth(token)]);
      setCases(list.items);
      setHealth({
        cases: h.cases,
        openCases: h.openCases,
        timelineEntries: h.timelineEntries,
      });
    } catch (err) {
      setCases([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load crisis overlay");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadTimeline = useCallback(
    async (crisisId: string) => {
      if (!token) return;
      try {
        const list = await listCrisisTimeline(token, crisisId);
        setTimeline(list.items);
      } catch (err) {
        setTimeline([]);
        setError(err instanceof EosApiError ? err.message : "Failed to load timeline");
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  useEffect(() => {
    if (!token || !selectedId) {
      setTimeline([]);
      return;
    }
    setTimeline([]);
    void loadTimeline(selectedId);
  }, [token, selectedId, loadTimeline]);

  async function run(action: () => Promise<void>) {
    if (!token) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
      const id = selectedIdRef.current;
      if (id) await loadTimeline(id);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((crisis) => {
      if (statusFilter && crisis.status !== statusFilter) return false;
      if (!q) return true;
      return `${crisis.crisisCode} ${crisis.title}`.toLowerCase().includes(q);
    });
  }, [cases, query, statusFilter]);

  const selected = cases.find((crisis) => crisis.id === selectedId) ?? null;
  const timelineForSelected = selected
    ? timeline.filter((entry) => entry.crisisId === selected.id)
    : [];

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view crisis declaration.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I18 · Crisis"
        title="Declaration"
        subtitle="Human L2/L3 command overlay and immutable timeline · not emcomms · declarer cannot close"
        actions={
          <Btn variant="secondary" href="/commercial">
            ← Dashboard
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card title="Cases">
            <div className="font-display text-2xl font-semibold text-ink">{health.cases}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openCases}</div>
          </Card>
          <Card title="Timeline entries">
            <div className="font-display text-2xl font-semibold text-ink">{health.timelineEntries}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading crisis overlay…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Declare overlay">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createCrisisCase>[1] = { title, severity };
                  if (commanderLabel.trim()) input.commanderLabel = commanderLabel.trim();
                  if (summary.trim()) input.summary = summary.trim();
                  const created = await createCrisisCase(token!, input);
                  selectedIdRef.current = created.crisis.id;
                  setSelectedId(created.crisis.id);
                  setTitle("");
                  setCommanderLabel("");
                  setSummary("");
                  setMessage("Crisis overlay declared");
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
              <select
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as CrisisSeverity)}
              >
                {Object.entries(CRISIS_SEVERITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Commander label (optional)"
                value={commanderLabel}
                onChange={(e) => setCommanderLabel(e.target.value)}
              />
              <textarea
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                rows={3}
                placeholder="Summary (optional — not a ticket body)"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <Btn type="submit" disabled={busy}>
                Declare
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
                  {Object.entries(CRISIS_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No crisis overlays match the current filter.</p>
            ) : (
              <div className="divide-y divide-line">
                {visible.map((crisis) => (
                  <button
                    key={crisis.id}
                    type="button"
                    onClick={() => setSelectedId(crisis.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${selectedId === crisis.id ? "bg-sand/50" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-ink">{crisis.title}</div>
                      <div className="text-xs text-muted">
                        {crisis.crisisCode} · {crisis.timelineCount} entries
                      </div>
                    </div>
                    {caseBadge(crisis)}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5 xl:col-span-3">
          {!selected ? (
            <Card title="Case detail">
              <p className="text-sm text-muted">Select a case to append timeline or close the overlay.</p>
            </Card>
          ) : (
            <>
              <Card title={selected.crisisCode} headerExtra={caseBadge(selected)}>
                <p className="mb-4 text-sm text-muted">
                  {CRISIS_SEVERITY_LABELS[selected.severity]}
                  {selected.commanderLabel ? ` · ${selected.commanderLabel}` : ""}
                  {` · ${selected.timelineCount} timeline entries`}
                </p>
                {selected.summary && <p className="mb-4 text-sm text-ink">{selected.summary}</p>}
                {selected.status === "open" && (
                  <Btn
                    size="sm"
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        await closeCrisisCase(token!, selected.id);
                        setMessage("Crisis overlay closed");
                      })
                    }
                  >
                    Close
                  </Btn>
                )}
              </Card>

              {selected.status === "open" && (
                <Card title="Append timeline">
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void run(async () => {
                        await createCrisisTimelineEntry(token!, selected.id, { body: timelineBody });
                        setTimelineBody("");
                        setMessage("Timeline entry recorded");
                      });
                    }}
                  >
                    <textarea
                      className="w-full rounded-md border border-line px-3 py-2 text-sm"
                      rows={4}
                      placeholder="Immutable note (facts vs unconfirmed)"
                      value={timelineBody}
                      onChange={(e) => setTimelineBody(e.target.value)}
                      required
                    />
                    <Btn type="submit" disabled={busy}>
                      Append
                    </Btn>
                    <p className="text-xs text-muted">Sign in as Bob to close a case Carol declared.</p>
                  </form>
                </Card>
              )}

              <Card title="Timeline">
                {timelineForSelected.length === 0 ? (
                  <p className="text-sm text-muted">No timeline entries on this case.</p>
                ) : (
                  <div className="divide-y divide-line">
                    {timelineForSelected.map((entry) => (
                      <div key={entry.id} className="py-3">
                        <div className="text-xs text-muted">
                          {entry.entryCode} · {entry.createdAt}
                        </div>
                        <p className="mt-1 text-sm text-ink">{entry.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}
