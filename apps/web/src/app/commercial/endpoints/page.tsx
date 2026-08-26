"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  IT_ENDPOINT_STATUS_LABELS,
  createItEndpoint,
  getItEndpointsHealth,
  listItEndpoints,
  patchItEndpoint,
  type ItEndpoint,
} from "@/lib/it-endpoints-api";

function statusBadge(status: ItEndpoint["status"]) {
  if (status === "open") return <Badge variant="review" label="Open" />;
  if (status === "done") return <Badge variant="won" label="Done" />;
  return <Badge variant="draft" label="Cancelled" />;
}

export default function ItEndpointsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<ItEndpoint[]>([]);
  const [health, setHealth] = useState<{ endpoints: number; openEndpoints: number } | null>(null);
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
  const [notes, setNotes] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listItEndpoints(token), getItEndpointsHealth(token)]);
      setItems(list.items);
      setHealth({ endpoints: h.endpoints, openEndpoints: h.openEndpoints });
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load endpoint register");
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
      return `${row.endpointCode} ${row.title} ${row.notes ?? ""}`.toLowerCase().includes(q);
    });
  }, [items, query, statusFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the endpoint register.</p>;

  return (
    <>
      <PageHeader
        eyebrow="ITE1 · IT"
        title="Endpoints"
        subtitle="Endpoint Register only · not UEM, not MDM, not EDR, not Discovery, not Device Management, not Fleet Control, not Endpoint Security, not an ITA1 Assets replacement, not an ITL1 Licenses replacement, and not an I11 Service Desk or CMDB replacement (including I11 CI class endpoint)"
        actions={
          <div className="flex gap-2">
            <Btn variant="secondary" href="/commercial/assets">
              Assets
            </Btn>
            <Btn variant="secondary" href="/commercial/licenses">
              Licenses
            </Btn>
            <Btn variant="secondary" href="/commercial/itsm">
              Service Desk
            </Btn>
            <Btn variant="secondary" href="/commercial/cmdb">
              CMDB
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Endpoints">
            <div className="font-display text-2xl font-semibold text-ink">{health.endpoints}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openEndpoints}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading endpoint register…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register endpoint">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createItEndpoint>[1] = { title };
                  if (notes.trim()) input.notes = notes.trim();
                  const created = await createItEndpoint(token!, input);
                  selectedIdRef.current = created.endpoint.id;
                  setSelectedId(created.endpoint.id);
                  setTitle("");
                  setNotes("");
                  setMessage("Endpoint registered");
                });
              }}
            >
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Endpoint title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
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
                  {Object.entries(IT_ENDPOINT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No endpoint rows match the current filter.</p>
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
                      <div className="text-xs text-muted">{row.endpointCode}</div>
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
            <Card title="Endpoint detail">
              <p className="text-sm text-muted">Select an endpoint to edit it while open, or mark it done or cancelled.</p>
            </Card>
          ) : (
            <Card title={selected.endpointCode} headerExtra={statusBadge(selected.status)}>
              {selected.status === "open" ? (
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      await patchItEndpoint(token!, selected.id, {
                        title: editTitle,
                        notes: editNotes,
                      });
                      setMessage("Endpoint updated");
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
                          await patchItEndpoint(token!, selected.id, { status: "done" });
                          setMessage("Endpoint marked done");
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
                          await patchItEndpoint(token!, selected.id, { status: "cancelled" });
                          setMessage("Endpoint cancelled");
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
                      ? "Completed endpoint rows cannot be edited. Done is a register label, not enrolled, not compliant, not online, and not CMDB retired."
                      : "Cancelled endpoint rows cannot be edited."}
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
