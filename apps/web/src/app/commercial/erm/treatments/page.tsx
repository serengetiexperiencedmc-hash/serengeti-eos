"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import { listErmRisks, type ErmRisk } from "@/lib/erm-api";
import {
  TREATMENT_STATUS_LABELS,
  createErmTreatment,
  listErmTreatments,
  patchErmTreatment,
  type ErmTreatment,
} from "@/lib/erm-treatments-api";

function statusBadge(status: ErmTreatment["status"]) {
  if (status === "open") return <Badge variant="review" label="Open" />;
  return <Badge variant="draft" label="Retired" />;
}

export default function ErmTreatmentsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<ErmTreatment[]>([]);
  const [risks, setRisks] = useState<ErmRisk[]>([]);
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
  const [ownerLabel, setOwnerLabel] = useState("");
  const [riskId, setRiskId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editOwnerLabel, setEditOwnerLabel] = useState("");
  const [editRiskId, setEditRiskId] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const list = await listErmTreatments(token);
      setItems(list.items);
      try {
        const riskList = await listErmRisks(token);
        setRisks(riskList.items);
      } catch {
        setRisks([]);
      }
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load Treatment register");
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
    setEditOwnerLabel(selected.ownerLabel ?? "");
    setEditRiskId(selected.riskId ?? "");
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
      return `${row.treatmentCode} ${row.title} ${row.notes ?? ""} ${row.ownerLabel ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, query, statusFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the Treatment register.</p>;

  return (
    <>
      <PageHeader
        eyebrow="E2 · Risk"
        title="Treatments"
        subtitle="Treatment Register only · catalogue/governance record that a treatment exists · not a treatment engine, effectiveness dashboard, residual-risk calculator, RAG board, or I15 Risk replacement"
        actions={
          <Btn variant="secondary" href="/commercial/erm">
            Register
          </Btn>
        }
      />

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading Treatment register…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register treatment">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createErmTreatment>[1] = { title };
                  if (notes.trim()) input.notes = notes.trim();
                  if (ownerLabel.trim()) input.ownerLabel = ownerLabel.trim();
                  if (riskId) input.riskId = riskId;
                  const created = await createErmTreatment(token!, input);
                  selectedIdRef.current = created.treatment.id;
                  setSelectedId(created.treatment.id);
                  setTitle("");
                  setNotes("");
                  setOwnerLabel("");
                  setRiskId("");
                  setMessage("Treatment registered");
                });
              }}
            >
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Treatment title"
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
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Owner label (optional)"
                value={ownerLabel}
                onChange={(e) => setOwnerLabel(e.target.value)}
              />
              {risks.length > 0 && (
                <select
                  className="w-full rounded-md border border-line px-3 py-2 text-sm"
                  value={riskId}
                  onChange={(e) => setRiskId(e.target.value)}
                >
                  <option value="">No I15 risk reference</option>
                  {risks.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.riskCode} · {row.title}
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
                  {Object.entries(TREATMENT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No Treatment rows match the current filter.</p>
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
                      <div className="text-xs text-muted">{row.treatmentCode}</div>
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
            <Card title="Treatment detail">
              <p className="text-sm text-muted">
                Select a treatment to edit it while listed in the catalogue, or retire it. Retired rows cannot be
                reactivated. Treatment status is not I15 risk status.
              </p>
            </Card>
          ) : (
            <Card title={selected.treatmentCode} headerExtra={statusBadge(selected.status)}>
              {selected.status === "open" ? (
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      await patchErmTreatment(token!, selected.id, {
                        title: editTitle,
                        notes: editNotes,
                        ownerLabel: editOwnerLabel,
                        riskId: editRiskId ? editRiskId : null,
                      });
                      setMessage("Treatment updated");
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
                  <input
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    placeholder="Owner label (optional)"
                    value={editOwnerLabel}
                    onChange={(e) => setEditOwnerLabel(e.target.value)}
                  />
                  {risks.length > 0 && (
                    <select
                      className="w-full rounded-md border border-line px-3 py-2 text-sm"
                      value={editRiskId}
                      onChange={(e) => setEditRiskId(e.target.value)}
                    >
                      <option value="">No I15 risk reference</option>
                      {risks.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.riskCode} · {row.title}
                        </option>
                      ))}
                    </select>
                  )}
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
                          await patchErmTreatment(token!, selected.id, { status: "retired" });
                          setMessage("Treatment retired");
                        })
                      }
                    >
                      Retire
                    </Btn>
                  </div>
                </form>
              ) : (
                <>
                  <p className="mb-2 text-sm text-ink">{selected.title}</p>
                  {selected.notes && <p className="mb-2 text-sm text-muted">Notes: {selected.notes}</p>}
                  {selected.ownerLabel && (
                    <p className="mb-2 text-sm text-muted">Owner: {selected.ownerLabel}</p>
                  )}
                  {selected.riskCode && (
                    <p className="mb-2 text-sm text-muted">Linked risk: {selected.riskCode}</p>
                  )}
                  <p className="text-sm text-muted">
                    Retired Treatment rows cannot be edited or reactivated. Retired is a catalogue withdrawal, not
                    an I15 closed or accepted risk, not effectiveness, and not a calculation result.
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
