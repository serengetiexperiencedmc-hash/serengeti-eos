"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  createDsrCase,
  DSR_REQUEST_TYPE_LABELS,
  DSR_STATUS_LABELS,
  getPrivacyHealth,
  listDsrCases,
  transitionDsrCase,
  type DsrRequestType,
  type PrivacyDsrCase,
} from "@/lib/privacy-api";

function statusBadge(status: PrivacyDsrCase["status"]) {
  if (status === "open") return <Badge variant="review" label="Open" />;
  if (status === "in_progress") return <Badge variant="progress" label="In progress" />;
  return <Badge variant="draft" label="Closed" />;
}

export default function PrivacyDsrPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<PrivacyDsrCase[]>([]);
  const [health, setHealth] = useState<{ dsrs: number; openDsrs: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [requestType, setRequestType] = useState<DsrRequestType>("access");
  const [subjectLabel, setSubjectLabel] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listDsrCases(token), getPrivacyHealth(token)]);
      setItems(list.items);
      setHealth({ dsrs: h.dsrs, openDsrs: h.openDsrs });
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load DSR cases");
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
      return `${row.dsrCode} ${row.requestType} ${row.subjectLabel ?? ""}`.toLowerCase().includes(q);
    });
  }, [items, query, statusFilter]);

  const selected = items.find((row) => row.id === selectedId) ?? null;

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view DSR cases.</p>;

  return (
    <>
      <PageHeader
        eyebrow="P1 · Privacy"
        title="DSR"
        subtitle="Case register only · erasure is a label, not live deletion · creator cannot close"
        actions={
          <Btn variant="secondary" href="/commercial/privacy">
            ← RoPA
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="DSR cases">
            <div className="font-display text-2xl font-semibold text-ink">{health.dsrs}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openDsrs}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading DSR cases…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register DSR case">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createDsrCase>[1] = { requestType };
                  if (subjectLabel.trim()) input.subjectLabel = subjectLabel.trim();
                  if (note.trim()) input.note = note.trim();
                  const created = await createDsrCase(token!, input);
                  selectedIdRef.current = created.dsr.id;
                  setSelectedId(created.dsr.id);
                  setSubjectLabel("");
                  setNote("");
                  setMessage("DSR case registered");
                });
              }}
            >
              <select
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as DsrRequestType)}
              >
                {Object.entries(DSR_REQUEST_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Subject label (optional — not a principal id)"
                value={subjectLabel}
                onChange={(e) => setSubjectLabel(e.target.value)}
              />
              <textarea
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                rows={3}
                placeholder="Note (optional — not live fulfilment)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
                  {Object.entries(DSR_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No DSR cases match the current filter.</p>
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
                      <div className="font-medium text-ink">{row.subjectLabel ?? DSR_REQUEST_TYPE_LABELS[row.requestType]}</div>
                      <div className="text-xs text-muted">
                        {row.dsrCode} · {DSR_REQUEST_TYPE_LABELS[row.requestType]}
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
            <Card title="Case detail">
              <p className="text-sm text-muted">Select a DSR case to start or close it.</p>
            </Card>
          ) : (
            <Card title={selected.dsrCode} headerExtra={statusBadge(selected.status)}>
              <p className="mb-2 text-sm text-ink">{DSR_REQUEST_TYPE_LABELS[selected.requestType]}</p>
              {selected.subjectLabel && <p className="mb-2 text-sm text-muted">{selected.subjectLabel}</p>}
              {selected.note && <p className="mb-4 text-sm text-ink">{selected.note}</p>}
              <div className="flex flex-wrap gap-2">
                {selected.status === "open" && (
                  <Btn
                    size="sm"
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        await transitionDsrCase(token!, selected.id, "start");
                        setMessage("DSR in progress");
                      })
                    }
                  >
                    Start
                  </Btn>
                )}
                {selected.status === "in_progress" && (
                  <Btn
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        await transitionDsrCase(token!, selected.id, "close");
                        setMessage("DSR closed");
                      })
                    }
                  >
                    Close
                  </Btn>
                )}
              </div>
              {selected.status === "in_progress" && (
                <p className="mt-3 text-xs text-muted">Sign in as Bob to close a case Carol opened.</p>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
