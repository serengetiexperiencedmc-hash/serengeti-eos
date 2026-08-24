"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { listObligations, type ComplianceObligation } from "@/lib/compliance-api";
import { EosApiError } from "@/lib/eos-client";
import {
  CONTROL_STATUS_LABELS,
  createControl,
  getGrcHealth,
  listControls,
  transitionControl,
  type GrcControl,
} from "@/lib/grc-api";

function statusBadge(status: GrcControl["status"]) {
  if (status === "draft") return <Badge variant="draft" label="Draft" />;
  if (status === "active") return <Badge variant="progress" label="Active" />;
  return <Badge variant="review" label="Retired" />;
}

export default function GrcControlsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<GrcControl[]>([]);
  const [obligations, setObligations] = useState<ComplianceObligation[]>([]);
  const [health, setHealth] = useState<{ controls: number; openControls: number } | null>(null);
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
  const [obligationId, setObligationId] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listControls(token), getGrcHealth(token)]);
      setItems(list.items);
      setHealth({ controls: h.controls, openControls: h.openControls });
      try {
        const obl = await listObligations(token);
        setObligations(obl.items);
      } catch {
        setObligations([]);
      }
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load controls");
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
      return `${row.controlCode} ${row.title}`.toLowerCase().includes(q);
    });
  }, [items, query, statusFilter]);

  const selected = items.find((row) => row.id === selectedId) ?? null;

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view controls.</p>;

  return (
    <>
      <PageHeader
        eyebrow="G2 · Compliance"
        title="Controls"
        subtitle="Control catalogue only · not findings, test campaigns, or legal interpretation"
        actions={
          <Btn variant="secondary" href="/commercial/compliance">
            ← Obligations
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Controls">
            <div className="font-display text-2xl font-semibold text-ink">{health.controls}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openControls}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading controls…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register control">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createControl>[1] = { title };
                  if (description.trim()) input.description = description.trim();
                  if (ownerLabel.trim()) input.ownerLabel = ownerLabel.trim();
                  if (obligationId) input.obligationId = obligationId;
                  const created = await createControl(token!, input);
                  selectedIdRef.current = created.control.id;
                  setSelectedId(created.control.id);
                  setTitle("");
                  setDescription("");
                  setOwnerLabel("");
                  setObligationId("");
                  setMessage("Control registered");
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
              {obligations.length > 0 && (
                <select
                  className="w-full rounded-md border border-line px-3 py-2 text-sm"
                  value={obligationId}
                  onChange={(e) => setObligationId(e.target.value)}
                >
                  <option value="">No obligation reference</option>
                  {obligations.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.obligationCode} · {row.title}
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
                  {Object.entries(CONTROL_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No controls match the current filter.</p>
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
                        {row.controlCode}
                        {row.obligationCode ? ` · ${row.obligationCode}` : ""}
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
            <Card title="Control detail">
              <p className="text-sm text-muted">Select a control to activate or retire it.</p>
            </Card>
          ) : (
            <Card title={selected.controlCode} headerExtra={statusBadge(selected.status)}>
              <p className="mb-4 text-sm text-ink">{selected.title}</p>
              {selected.description && <p className="mb-4 text-sm text-muted">{selected.description}</p>}
              {selected.ownerLabel && <p className="mb-4 text-sm text-muted">{selected.ownerLabel}</p>}
              {selected.obligationCode && (
                <p className="mb-4 text-sm text-muted">References {selected.obligationCode} (G1 identifier only)</p>
              )}
              {selected.status === "draft" && (
                <Btn
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await transitionControl(token!, selected.id, "activate");
                      setMessage("Control activated");
                    })
                  }
                >
                  Activate
                </Btn>
              )}
              {selected.status === "active" && (
                <Btn
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await transitionControl(token!, selected.id, "retire");
                      setMessage("Control retired");
                    })
                  }
                >
                  Retire
                </Btn>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
