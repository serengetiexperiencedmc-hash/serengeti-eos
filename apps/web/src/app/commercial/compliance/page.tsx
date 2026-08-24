"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  createObligation,
  getComplianceHealth,
  listObligations,
  OBLIGATION_STATUS_LABELS,
  transitionObligation,
  type ComplianceObligation,
} from "@/lib/compliance-api";

function statusBadge(status: ComplianceObligation["status"]) {
  if (status === "open") return <Badge variant="review" label="Open" />;
  if (status === "in_force") return <Badge variant="progress" label="In force" />;
  return <Badge variant="draft" label="Closed" />;
}

export default function ComplianceObligationsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<ComplianceObligation[]>([]);
  const [health, setHealth] = useState<{ obligations: number; openObligations: number } | null>(null);
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
  const [ownerLabel, setOwnerLabel] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listObligations(token), getComplianceHealth(token)]);
      setItems(list.items);
      setHealth({ obligations: h.obligations, openObligations: h.openObligations });
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load obligations");
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
      return `${row.obligationCode} ${row.title}`.toLowerCase().includes(q);
    });
  }, [items, query, statusFilter]);

  const selected = items.find((row) => row.id === selectedId) ?? null;

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view obligations.</p>;

  return (
    <>
      <PageHeader
        eyebrow="G1 · Compliance"
        title="Obligations"
        subtitle="Obligation register only · not a control library, findings product, or legal opinion"
        actions={
          <Btn variant="secondary" href="/commercial">
            ← Dashboard
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Obligations">
            <div className="font-display text-2xl font-semibold text-ink">{health.obligations}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openObligations}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading obligations…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register obligation">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createObligation>[1] = { title };
                  if (ownerLabel.trim()) input.ownerLabel = ownerLabel.trim();
                  const created = await createObligation(token!, input);
                  selectedIdRef.current = created.obligation.id;
                  setSelectedId(created.obligation.id);
                  setTitle("");
                  setOwnerLabel("");
                  setMessage("Obligation registered");
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
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Owner label (optional)"
                value={ownerLabel}
                onChange={(e) => setOwnerLabel(e.target.value)}
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
                  {Object.entries(OBLIGATION_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No obligations match the current filter.</p>
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
                      <div className="text-xs text-muted">{row.obligationCode}</div>
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
            <Card title="Obligation detail">
              <p className="text-sm text-muted">Select an obligation to activate or close.</p>
            </Card>
          ) : (
            <Card title={selected.obligationCode} headerExtra={statusBadge(selected.status)}>
              <p className="mb-4 text-sm text-ink">{selected.title}</p>
              {selected.ownerLabel && <p className="mb-4 text-sm text-muted">{selected.ownerLabel}</p>}
              <div className="flex flex-wrap gap-2">
                {selected.status === "open" && (
                  <Btn
                    size="sm"
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        await transitionObligation(token!, selected.id, "activate");
                        setMessage("Obligation in force");
                      })
                    }
                  >
                    Activate
                  </Btn>
                )}
                {selected.status !== "closed" && (
                  <Btn
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        await transitionObligation(token!, selected.id, "close");
                        setMessage("Obligation closed");
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
