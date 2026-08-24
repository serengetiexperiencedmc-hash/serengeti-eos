"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  FINDING_STATUS_LABELS,
  createFinding,
  getFindingsHealth,
  listFindings,
  transitionFinding,
  type FindingRecord,
} from "@/lib/findings-api";
import { listControls, type GrcControl } from "@/lib/grc-api";

function statusBadge(status: FindingRecord["status"]) {
  if (status === "open") return <Badge variant="review" label="Open" />;
  if (status === "in_progress") return <Badge variant="progress" label="In progress" />;
  return <Badge variant="draft" label="Closed" />;
}

export default function FindingsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<FindingRecord[]>([]);
  const [controls, setControls] = useState<GrcControl[]>([]);
  const [health, setHealth] = useState<{ findings: number; openFindings: number } | null>(null);
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
  const [description, setDescription] = useState("");
  const [ownerLabel, setOwnerLabel] = useState("");
  const [controlId, setControlId] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listFindings(token), getFindingsHealth(token)]);
      setItems(list.items);
      setHealth({ findings: h.findings, openFindings: h.openFindings });
      try {
        const ctl = await listControls(token);
        setControls(ctl.items);
      } catch {
        setControls([]);
      }
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load findings");
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
      return `${row.findingCode} ${row.title}`.toLowerCase().includes(q);
    });
  }, [items, query, statusFilter]);

  const selected = items.find((row) => row.id === selectedId) ?? null;

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view findings.</p>;

  return (
    <>
      <PageHeader
        eyebrow="G3 · Compliance"
        title="Findings"
        subtitle="Findings register only · not a test campaign, mapping engine, or legal interpretation"
        actions={
          <Btn variant="secondary" href="/commercial/controls">
            ← Controls
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Findings">
            <div className="font-display text-2xl font-semibold text-ink">{health.findings}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openFindings}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading findings…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register finding">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createFinding>[1] = { title };
                  if (description.trim()) input.description = description.trim();
                  if (ownerLabel.trim()) input.ownerLabel = ownerLabel.trim();
                  if (controlId) input.controlId = controlId;
                  const created = await createFinding(token!, input);
                  selectedIdRef.current = created.finding.id;
                  setSelectedId(created.finding.id);
                  setTitle("");
                  setDescription("");
                  setOwnerLabel("");
                  setControlId("");
                  setMessage("Finding registered");
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
                rows={3}
                placeholder="Description (optional — not a legal opinion)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Owner label (optional)"
                value={ownerLabel}
                onChange={(e) => setOwnerLabel(e.target.value)}
              />
              {controls.length > 0 && (
                <select
                  className="w-full rounded-md border border-line px-3 py-2 text-sm"
                  value={controlId}
                  onChange={(e) => setControlId(e.target.value)}
                >
                  <option value="">No control reference</option>
                  {controls.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.controlCode} · {row.title}
                    </option>
                  ))}
                </select>
              )}
              <Btn type="submit" disabled={busy}>
                Register
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
                  {Object.entries(FINDING_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No findings match the current filter.</p>
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
                        {row.findingCode}
                        {row.controlCode ? ` · ${row.controlCode}` : ""}
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
            <Card title="Finding detail">
              <p className="text-sm text-muted">Select a finding to start or close it.</p>
            </Card>
          ) : (
            <Card title={selected.findingCode} headerExtra={statusBadge(selected.status)}>
              <p className="mb-4 text-sm text-ink">{selected.title}</p>
              {selected.description && <p className="mb-4 text-sm text-muted">{selected.description}</p>}
              {selected.ownerLabel && <p className="mb-4 text-sm text-muted">{selected.ownerLabel}</p>}
              {selected.controlCode && (
                <p className="mb-4 text-sm text-muted">References {selected.controlCode} (G2 identifier only)</p>
              )}
              <div className="flex gap-2">
              {selected.status === "open" && (
                <Btn
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await transitionFinding(token!, selected.id, "start");
                      setMessage("Finding in progress");
                    })
                  }
                >
                  Start
                </Btn>
              )}
              {selected.status !== "closed" && (
                <Btn
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await transitionFinding(token!, selected.id, "close");
                      setMessage("Finding closed");
                    })
                  }
                >
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
