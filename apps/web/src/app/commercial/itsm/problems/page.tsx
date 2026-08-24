"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import { listCis, listTickets, type CmdbCi, type ItsmTicket } from "@/lib/it-api";
import {
  ITSM_PROBLEM_STATUS_LABELS,
  createItsmProblem,
  getItsmProblemsHealth,
  listItsmProblems,
  patchItsmProblem,
  type ItsmProblem,
} from "@/lib/itsm-problems-api";

function statusBadge(status: ItsmProblem["status"]) {
  if (status === "open") return <Badge variant="review" label="Open" />;
  if (status === "done") return <Badge variant="won" label="Done" />;
  return <Badge variant="draft" label="Cancelled" />;
}

export default function ItsmProblemsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<ItsmProblem[]>([]);
  const [tickets, setTickets] = useState<ItsmTicket[]>([]);
  const [cis, setCis] = useState<CmdbCi[]>([]);
  const [health, setHealth] = useState<{ problems: number; openProblems: number } | null>(null);
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
  const [ticketId, setTicketId] = useState("");
  const [ciId, setCiId] = useState("");
  const [notes, setNotes] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listItsmProblems(token), getItsmProblemsHealth(token)]);
      setItems(list.items);
      setHealth({ problems: h.problems, openProblems: h.openProblems });
      try {
        const overlay = await listTickets(token);
        setTickets(overlay.items);
      } catch {
        setTickets([]);
      }
      try {
        const overlay = await listCis(token);
        setCis(overlay.items);
      } catch {
        setCis([]);
      }
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load problems");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  const selected = items.find((row) => row.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    setEditTitle(selected.title);
    setEditNotes(selected.notes ?? "");
  }, [selected]);

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
      return `${row.problemCode} ${row.title} ${row.ticketCode ?? ""} ${row.ciCode ?? ""} ${row.notes ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, query, statusFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the problem register.</p>;

  return (
    <>
      <PageHeader
        eyebrow="ITP1 · IT"
        title="Problems"
        subtitle="Problem register only · not Problem Management ITIL, not RCA, not a known-error database, not Release, and not an I11 or ITC1 replacement"
        actions={
          <div className="flex gap-2">
            <Btn variant="secondary" href="/commercial/itsm">
              Service Desk
            </Btn>
            <Btn variant="secondary" href="/commercial/itsm/changes">
              Changes
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Problems">
            <div className="font-display text-2xl font-semibold text-ink">{health.problems}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openProblems}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading problems…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register problem">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createItsmProblem>[1] = { title };
                  if (ticketId.trim()) input.ticketId = ticketId.trim();
                  if (ciId.trim()) input.ciId = ciId.trim();
                  if (notes.trim()) input.notes = notes.trim();
                  const created = await createItsmProblem(token!, input);
                  selectedIdRef.current = created.problem.id;
                  setSelectedId(created.problem.id);
                  setTitle("");
                  setTicketId("");
                  setCiId("");
                  setNotes("");
                  setMessage("Problem registered");
                });
              }}
            >
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Problem title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <select
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
              >
                <option value="">No ticket</option>
                {tickets.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.ticketCode} · {row.title}
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                value={ciId}
                onChange={(e) => setCiId(e.target.value)}
              >
                <option value="">No configuration item</option>
                {cis.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.ciCode} · {row.name}
                  </option>
                ))}
              </select>
              <textarea
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                rows={2}
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
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
                  {Object.entries(ITSM_PROBLEM_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No problems match the current filter.</p>
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
                        {row.problemCode}
                        {row.ticketCode ? ` · ${row.ticketCode}` : ""}
                        {row.ciCode ? ` · ${row.ciCode}` : ""}
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
            <Card title="Problem detail">
              <p className="text-sm text-muted">Select a problem to edit it while open, or mark it done or cancelled.</p>
            </Card>
          ) : (
            <Card title={selected.problemCode} headerExtra={statusBadge(selected.status)}>
              {selected.ticketCode && (
                <p className="mb-2 text-sm text-muted">References {selected.ticketCode} (I11 identifier only)</p>
              )}
              {selected.ciCode && (
                <p className="mb-4 text-sm text-muted">References {selected.ciCode} (I11 identifier only)</p>
              )}
              {selected.status === "open" ? (
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      await patchItsmProblem(token!, selected.id, {
                        title: editTitle,
                        notes: editNotes,
                      });
                      setMessage("Problem updated");
                    });
                  }}
                >
                  <input
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                  <textarea
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    rows={2}
                    placeholder="Notes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Btn type="submit" disabled={busy}>
                      Save
                    </Btn>
                    <Btn
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={busy}
                      onClick={() =>
                        void run(async () => {
                          await patchItsmProblem(token!, selected.id, { status: "done" });
                          setMessage("Problem marked done");
                        })
                      }
                    >
                      Complete
                    </Btn>
                    <Btn
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={busy}
                      onClick={() =>
                        void run(async () => {
                          await patchItsmProblem(token!, selected.id, { status: "cancelled" });
                          setMessage("Problem cancelled");
                        })
                      }
                    >
                      Cancel
                    </Btn>
                  </div>
                </form>
              ) : (
                <>
                  <p className="mb-2 text-sm text-ink">{selected.title}</p>
                  {selected.notes && <p className="mb-2 text-sm text-muted">Notes: {selected.notes}</p>}
                  <p className="text-sm text-muted">
                    {selected.status === "done"
                      ? "Completed problems cannot be edited."
                      : "Cancelled problems cannot be edited."}
                  </p>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
