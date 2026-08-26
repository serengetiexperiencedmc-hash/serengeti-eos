"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  CONSENT_RECORD_STATUS_LABELS,
  createConsent,
  getConsentsHealth,
  listConsents,
  patchConsent,
  type ConsentRecord,
} from "@/lib/consent-register-api";

function statusBadge(status: ConsentRecord["status"]) {
  if (status === "open") return <Badge variant="review" label="Open" />;
  if (status === "done") return <Badge variant="won" label="Done" />;
  return <Badge variant="draft" label="Cancelled" />;
}

export default function ConsentRegisterPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<ConsentRecord[]>([]);
  const [health, setHealth] = useState<{ consents: number; openConsents: number } | null>(null);
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
      const [list, h] = await Promise.all([listConsents(token), getConsentsHealth(token)]);
      setItems(list.items);
      setHealth({ consents: h.consents, openConsents: h.openConsents });
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load Consent Register");
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
      return `${row.consentCode} ${row.title}`.toLowerCase().includes(q);
    });
  }, [items, query, statusFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the Consent Register.</p>;

  return (
    <>
      <PageHeader
        eyebrow="P3 · Privacy"
        title="Consent Register"
        subtitle="Consent Register only · a human catalogue that a consent record exists or was cancelled · not Consent Management, not a Consent Platform, not a Preference Centre, not a CMP, not Consent Capture, not notices, signatures, cookies, or legal-validity determination, and not a P1 RoPA/DSR or P2 DPIA replacement"
        actions={
          <div className="flex gap-2">
            <Btn variant="secondary" href="/commercial/privacy">
              RoPA
            </Btn>
            <Btn variant="secondary" href="/commercial/dsr">
              DSR
            </Btn>
            <Btn variant="secondary" href="/commercial/dpia">
              DPIA
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Register rows">
            <div className="font-display text-2xl font-semibold text-ink">{health.consents}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openConsents}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading Consent Register…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register consent row">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createConsent>[1] = { title };
                  if (notes.trim()) input.notes = notes.trim();
                  const created = await createConsent(token!, input);
                  selectedIdRef.current = created.consent.id;
                  setSelectedId(created.consent.id);
                  setTitle("");
                  setNotes("");
                  setMessage("Consent Register row recorded");
                });
              }}
            >
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Consent Register title"
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
                  {Object.entries(CONSENT_RECORD_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No Consent Register rows match the current filter.</p>
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
                      <div className="text-xs text-muted">{row.consentCode}</div>
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
            <Card title="Consent Register detail">
              <p className="text-sm text-muted">
                Select a register row to edit it while open, or mark it done or cancelled. Done means the
                catalogue row is complete; it does not mean legally valid consent was obtained.
              </p>
            </Card>
          ) : (
            <Card title={selected.consentCode} headerExtra={statusBadge(selected.status)}>
              {selected.status === "open" ? (
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      await patchConsent(token!, selected.id, {
                        title: editTitle,
                        notes: editNotes,
                      });
                      setMessage("Consent Register row updated");
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
                          await patchConsent(token!, selected.id, { status: "done" });
                          setMessage("Consent Register row marked done");
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
                          await patchConsent(token!, selected.id, { status: "cancelled" });
                          setMessage("Consent Register row cancelled");
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
                      ? "Completed Consent Register rows cannot be edited. Done is a register label, not legally valid consent, not collected consent, and not enforced consent."
                      : "Cancelled Consent Register rows cannot be edited."}
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
