"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  createEngagement,
  createWorkpaper,
  ENGAGEMENT_STATUS_LABELS,
  finalizeWorkpaper,
  getAuditIaHealth,
  listEngagements,
  listWorkpapers,
  transitionEngagement,
  type IaEngagement,
  type IaWorkpaper,
} from "@/lib/audit-ia-api";

function engagementBadge(status: IaEngagement["status"]) {
  if (status === "planned") return <Badge variant="review" label="Planned" />;
  if (status === "in_progress") return <Badge variant="progress" label="In progress" />;
  return <Badge variant="draft" label="Closed" />;
}

function workpaperBadge(status: IaWorkpaper["status"]) {
  return status === "draft" ? <Badge variant="review" label="Draft" /> : <Badge variant="won" label="Finalized" />;
}

export default function InternalAuditPage() {
  const { token, ready } = useEosSession();
  const [engagements, setEngagements] = useState<IaEngagement[]>([]);
  const [workpapers, setWorkpapers] = useState<IaWorkpaper[]>([]);
  const [health, setHealth] = useState<{ engagements: number; openEngagements: number; draftWorkpapers: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [ownerLabel, setOwnerLabel] = useState("");
  const [paperTitle, setPaperTitle] = useState("");
  const [paperBody, setPaperBody] = useState("");
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listEngagements(token), getAuditIaHealth(token)]);
      setEngagements(list.items);
      setHealth({
        engagements: h.engagements,
        openEngagements: h.openEngagements,
        draftWorkpapers: h.draftWorkpapers,
      });
    } catch (err) {
      setEngagements([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load internal audit");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadPapers = useCallback(async (engagementId: string) => {
    if (!token) return;
    try {
      const list = await listWorkpapers(token, engagementId);
      setWorkpapers(list.items);
    } catch (err) {
      setWorkpapers([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load workpapers");
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  useEffect(() => {
    if (!token || !selectedId) {
      setWorkpapers([]);
      return;
    }
    setWorkpapers([]);
    void loadPapers(selectedId);
  }, [token, selectedId, loadPapers]);

  async function run(action: () => Promise<void>) {
    if (!token) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
      const id = selectedIdRef.current;
      if (id) await loadPapers(id);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return engagements.filter((engagement) => {
      if (statusFilter && engagement.status !== statusFilter) return false;
      if (!q) return true;
      return `${engagement.engagementCode} ${engagement.title}`.toLowerCase().includes(q);
    });
  }, [engagements, query, statusFilter]);

  const selected = engagements.find((engagement) => engagement.id === selectedId) ?? null;

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view internal audit.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I16 · Audit"
        title="Engagements"
        subtitle="Internal audit engagements and workpapers · creator cannot finalize own workpaper"
        actions={
          <Btn variant="secondary" href="/commercial">
            ← Dashboard
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card title="Engagements">
            <div className="font-display text-2xl font-semibold text-ink">{health.engagements}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openEngagements}</div>
          </Card>
          <Card title="Draft workpapers">
            <div className="font-display text-2xl font-semibold text-ink">{health.draftWorkpapers}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading internal audit…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Open engagement">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createEngagement>[1] = { title };
                  if (objective.trim()) input.objective = objective.trim();
                  if (ownerLabel.trim()) input.ownerLabel = ownerLabel.trim();
                  const created = await createEngagement(token!, input);
                  selectedIdRef.current = created.engagement.id;
                  setSelectedId(created.engagement.id);
                  setTitle("");
                  setObjective("");
                  setOwnerLabel("");
                  setMessage("Engagement opened");
                });
              }}
            >
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Owner label (optional)" value={ownerLabel} onChange={(e) => setOwnerLabel(e.target.value)} />
              <textarea className="w-full rounded-md border border-line px-3 py-2 text-sm" rows={3} placeholder="Objective (optional)" value={objective} onChange={(e) => setObjective(e.target.value)} />
              <Btn type="submit" disabled={busy}>
                Open engagement
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
                  {Object.entries(ENGAGEMENT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No engagements match the current filter.</p>
            ) : (
              <div className="divide-y divide-line">
                {visible.map((engagement) => (
                  <button
                    key={engagement.id}
                    type="button"
                    onClick={() => setSelectedId(engagement.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${selectedId === engagement.id ? "bg-sand/50" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-ink">{engagement.title}</div>
                      <div className="text-xs text-muted">
                        {engagement.engagementCode} · {engagement.workpaperCount} workpapers
                      </div>
                    </div>
                    {engagementBadge(engagement.status)}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5 xl:col-span-3">
          {!selected ? (
            <Card title="Engagement detail">
              <p className="text-sm text-muted">Select an engagement to start, add workpapers, or close.</p>
            </Card>
          ) : (
            <>
              <Card title={selected.title} headerExtra={engagementBadge(selected.status)}>
                <p className="mb-4 text-sm text-muted">
                  {selected.engagementCode}
                  {selected.ownerLabel ? ` · ${selected.ownerLabel}` : ""}
                  {` · ${selected.draftWorkpaperCount} draft workpapers`}
                </p>
                {selected.objective && <p className="mb-4 text-sm text-ink">{selected.objective}</p>}
                <div className="flex flex-wrap gap-2">
                  {selected.status === "planned" && (
                    <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await transitionEngagement(token!, selected.id, "start"); setMessage("Started"); })}>
                      Start
                    </Btn>
                  )}
                  {selected.status !== "closed" && (
                    <Btn size="sm" variant="secondary" disabled={busy} onClick={() => void run(async () => { await transitionEngagement(token!, selected.id, "close"); setMessage("Closed"); })}>
                      Close
                    </Btn>
                  )}
                </div>
              </Card>

              {selected.status !== "closed" && (
                <Card title="Add workpaper">
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void run(async () => {
                        const input: Parameters<typeof createWorkpaper>[2] = { title: paperTitle };
                        if (paperBody.trim()) input.body = paperBody.trim();
                        await createWorkpaper(token!, selected.id, input);
                        setPaperTitle("");
                        setPaperBody("");
                        setMessage("Workpaper added as draft");
                      });
                    }}
                  >
                    <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Workpaper title" value={paperTitle} onChange={(e) => setPaperTitle(e.target.value)} required />
                    <textarea className="w-full rounded-md border border-line px-3 py-2 text-sm" rows={3} placeholder="Notes (optional — not production evidence)" value={paperBody} onChange={(e) => setPaperBody(e.target.value)} />
                    <Btn type="submit" disabled={busy}>
                      Add workpaper
                    </Btn>
                  </form>
                </Card>
              )}

              <Card title="Workpapers">
                {workpapers.filter((paper) => paper.engagementId === selected.id).length === 0 ? (
                  <p className="text-sm text-muted">No workpapers on this engagement.</p>
                ) : (
                  <div className="divide-y divide-line">
                    {workpapers
                      .filter((paper) => paper.engagementId === selected.id)
                      .map((paper) => (
                      <div key={paper.id} className="flex items-center justify-between gap-3 py-3">
                        <div>
                          <div className="font-medium text-ink">{paper.title}</div>
                          <div className="text-xs text-muted">{paper.workpaperCode}</div>
                          {paper.body && <p className="mt-1 text-sm text-ink">{paper.body}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {workpaperBadge(paper.status)}
                          {paper.status === "draft" && (
                            <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await finalizeWorkpaper(token!, paper.id); setMessage("Finalized"); })}>
                              Finalize
                            </Btn>
                          )}
                        </div>
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
