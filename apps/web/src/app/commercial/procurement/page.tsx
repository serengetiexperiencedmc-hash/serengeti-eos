"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  PROCUREMENT_RECORD_STATUS_LABELS,
  createProcurementRecord,
  getProcurementHealth,
  listProcurementRecords,
  patchProcurementRecord,
  type ProcurementRecord,
} from "@/lib/procurement-api";
import { listSuppliers, type SupplierSummary } from "@/lib/suppliers-api";

function statusBadge(status: ProcurementRecord["status"]) {
  if (status === "open") return <Badge variant="review" label="Open" />;
  return <Badge variant="draft" label="Cancelled" />;
}

export default function ProcurementCataloguePage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<ProcurementRecord[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  const [health, setHealth] = useState<{ records: number; openRecords: number } | null>(null);
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
  const [supplierId, setSupplierId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editOwnerLabel, setEditOwnerLabel] = useState("");
  const [editSupplierId, setEditSupplierId] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listProcurementRecords(token), getProcurementHealth(token)]);
      setItems(list.items);
      setHealth({ records: h.records, openRecords: h.openRecords });
      try {
        const supplierList = await listSuppliers(token, { limit: 100 });
        setSuppliers(supplierList.items);
      } catch {
        setSuppliers([]);
      }
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load Procurement Catalogue");
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
    setEditSupplierId(selected.supplierId ?? "");
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
      return `${row.procurementCode} ${row.title}`.toLowerCase().includes(q);
    });
  }, [items, query, statusFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the Procurement Catalogue.</p>;

  return (
    <>
      <PageHeader
        eyebrow="PR1 · Commercial"
        title="Procurement Catalogue"
        subtitle="Procurement Catalogue only · a human record that a purchase request and/or purchase order exists, or was cancelled · not a sourcing engine, RFQ/tender platform, rate/costing engine, AP/GL system, booking engine, or C4 Supplier replacement"
        actions={
          <div className="flex gap-2">
            <Btn variant="secondary" href="/commercial/suppliers">
              Supplier Library
            </Btn>
            <Btn variant="secondary" href="/commercial/finance">
              Finance
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Catalogue rows">
            <div className="font-display text-2xl font-semibold text-ink">{health.records}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openRecords}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading Procurement Catalogue…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register catalogue row">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createProcurementRecord>[1] = { title };
                  if (notes.trim()) input.notes = notes.trim();
                  if (ownerLabel.trim()) input.ownerLabel = ownerLabel.trim();
                  if (supplierId) input.supplierId = supplierId;
                  const created = await createProcurementRecord(token!, input);
                  selectedIdRef.current = created.record.id;
                  setSelectedId(created.record.id);
                  setTitle("");
                  setNotes("");
                  setOwnerLabel("");
                  setSupplierId("");
                  setMessage("Procurement Catalogue row recorded");
                });
              }}
            >
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Procurement Catalogue title"
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
              {suppliers.length > 0 && (
                <select
                  className="w-full rounded-md border border-line px-3 py-2 text-sm"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                >
                  <option value="">No C4 supplier reference</option>
                  {suppliers.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.supplierCode} · {row.legalName}
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
                  {Object.entries(PROCUREMENT_RECORD_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No Procurement Catalogue rows match the current filter.</p>
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
                      <div className="text-xs text-muted">{row.procurementCode}</div>
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
            <Card title="Procurement Catalogue detail">
              <p className="text-sm text-muted">
                Select a catalogue row to edit it while open, or cancel it. Open means the PR/PO is listed in
                the catalogue. Cancelled means the row was withdrawn. Neither state is approval, issue, receipt,
                matching, or payment.
              </p>
            </Card>
          ) : (
            <Card title={selected.procurementCode} headerExtra={statusBadge(selected.status)}>
              {selected.status === "open" ? (
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      await patchProcurementRecord(token!, selected.id, {
                        title: editTitle,
                        notes: editNotes,
                        ownerLabel: editOwnerLabel,
                        supplierId: editSupplierId ? editSupplierId : null,
                      });
                      setMessage("Procurement Catalogue row updated");
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
                  {suppliers.length > 0 && (
                    <select
                      className="w-full rounded-md border border-line px-3 py-2 text-sm"
                      value={editSupplierId}
                      onChange={(e) => setEditSupplierId(e.target.value)}
                    >
                      <option value="">No C4 supplier reference</option>
                      {suppliers.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.supplierCode} · {row.legalName}
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
                          await patchProcurementRecord(token!, selected.id, { status: "cancelled" });
                          setMessage("Procurement Catalogue row cancelled");
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
                  {selected.ownerLabel && (
                    <p className="mb-2 text-sm text-muted">Owner: {selected.ownerLabel}</p>
                  )}
                  {selected.supplierCode && (
                    <p className="mb-2 text-sm text-muted">Linked supplier: {selected.supplierCode}</p>
                  )}
                  <p className="text-sm text-muted">
                    Cancelled Procurement Catalogue rows cannot be edited or reactivated. Cancelled is a
                    catalogue withdrawal, not an AP void, not a booking cancel, and not a three-way-match
                    exception.
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
