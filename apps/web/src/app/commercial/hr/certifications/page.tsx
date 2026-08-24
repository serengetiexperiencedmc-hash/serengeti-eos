"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import { listEmployees, type HrEmployee } from "@/lib/hr-api";
import {
  CERTIFICATION_STATUS_LABELS,
  createHrCertification,
  getHrCertificationsHealth,
  listHrCertifications,
  patchHrCertification,
  type HrCertification,
} from "@/lib/hr-certifications-api";

function statusBadge(status: HrCertification["status"]) {
  if (status === "held") return <Badge variant="won" label="Held" />;
  return <Badge variant="draft" label="Revoked" />;
}

export default function HrCertificationsPage() {
  const { token, ready } = useEosSession();
  const [items, setItems] = useState<HrCertification[]>([]);
  const [employees, setEmployees] = useState<HrEmployee[]>([]);
  const [health, setHealth] = useState<{ certifications: number; heldCertifications: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [issuerLabel, setIssuerLabel] = useState("");
  const [issuedOn, setIssuedOn] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [notes, setNotes] = useState("");
  const [editName, setEditName] = useState("");
  const [editIssuer, setEditIssuer] = useState("");
  const [editIssuedOn, setEditIssuedOn] = useState("");
  const [editExpiresOn, setEditExpiresOn] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, h] = await Promise.all([listHrCertifications(token), getHrCertificationsHealth(token)]);
      setItems(list.items);
      setHealth({ certifications: h.certifications, heldCertifications: h.heldCertifications });
      try {
        const overlay = await listEmployees(token);
        setEmployees(overlay.items);
      } catch {
        setEmployees([]);
      }
    } catch (err) {
      setItems([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load certifications");
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
    setEditName(selected.name);
    setEditIssuer(selected.issuerLabel ?? "");
    setEditIssuedOn(selected.issuedOn ?? "");
    setEditExpiresOn(selected.expiresOn ?? "");
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
      return `${row.certificationCode} ${row.name} ${row.employeeCode ?? ""} ${row.issuerLabel ?? ""}`.toLowerCase().includes(
        q,
      );
    });
  }, [items, query, statusFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the certification register.</p>;

  return (
    <>
      <PageHeader
        eyebrow="H1 · People"
        title="Certifications"
        subtitle="Certification register only · not payroll, not an LMS, and not an I10 directory replacement"
        actions={
          <Btn variant="secondary" href="/commercial/hr">
            ← HR
          </Btn>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Certifications">
            <div className="font-display text-2xl font-semibold text-ink">{health.certifications}</div>
          </Card>
          <Card title="Held">
            <div className="font-display text-2xl font-semibold text-ink">{health.heldCertifications}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading certifications…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Register certification">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createHrCertification>[1] = { name, employeeId };
                  if (issuerLabel.trim()) input.issuerLabel = issuerLabel.trim();
                  if (issuedOn.trim()) input.issuedOn = issuedOn.trim();
                  if (expiresOn.trim()) input.expiresOn = expiresOn.trim();
                  if (notes.trim()) input.notes = notes.trim();
                  const created = await createHrCertification(token!, input);
                  selectedIdRef.current = created.certification.id;
                  setSelectedId(created.certification.id);
                  setName("");
                  setEmployeeId("");
                  setIssuerLabel("");
                  setIssuedOn("");
                  setExpiresOn("");
                  setNotes("");
                  setMessage("Certification registered");
                });
              }}
            >
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Certification name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <select
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              >
                <option value="">Select an employee</option>
                {employees.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.employeeCode} · {row.displayName}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                placeholder="Issuer label (optional text)"
                value={issuerLabel}
                onChange={(e) => setIssuerLabel(e.target.value)}
              />
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                type="date"
                value={issuedOn}
                onChange={(e) => setIssuedOn(e.target.value)}
                aria-label="Issued on"
              />
              <input
                className="w-full rounded-md border border-line px-3 py-2 text-sm"
                type="date"
                value={expiresOn}
                onChange={(e) => setExpiresOn(e.target.value)}
                aria-label="Expires on"
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
                  {Object.entries(CERTIFICATION_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No certifications match the current filter.</p>
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
                      <div className="font-medium text-ink">{row.name}</div>
                      <div className="text-xs text-muted">
                        {row.certificationCode}
                        {row.employeeCode ? ` · ${row.employeeCode}` : ""}
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
            <Card title="Certification detail">
              <p className="text-sm text-muted">Select a certification to edit it while held or revoke it.</p>
            </Card>
          ) : (
            <Card title={selected.certificationCode} headerExtra={statusBadge(selected.status)}>
              {selected.employeeCode && (
                <p className="mb-4 text-sm text-muted">Held by {selected.employeeCode} (I10 identifier only)</p>
              )}
              {selected.status === "held" ? (
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      await patchHrCertification(token!, selected.id, {
                        name: editName,
                        issuerLabel: editIssuer,
                        issuedOn: editIssuedOn,
                        expiresOn: editExpiresOn,
                        notes: editNotes,
                      });
                      setMessage("Certification updated");
                    });
                  }}
                >
                  <input
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                  <input
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    placeholder="Issuer label"
                    value={editIssuer}
                    onChange={(e) => setEditIssuer(e.target.value)}
                  />
                  <input
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    type="date"
                    value={editIssuedOn}
                    onChange={(e) => setEditIssuedOn(e.target.value)}
                    aria-label="Issued on"
                  />
                  <input
                    className="w-full rounded-md border border-line px-3 py-2 text-sm"
                    type="date"
                    value={editExpiresOn}
                    onChange={(e) => setEditExpiresOn(e.target.value)}
                    aria-label="Expires on"
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
                          await patchHrCertification(token!, selected.id, { status: "revoked" });
                          setMessage("Certification revoked");
                        })
                      }
                    >
                      Revoke
                    </Btn>
                  </div>
                </form>
              ) : (
                <>
                  <p className="mb-2 text-sm text-ink">{selected.name}</p>
                  {selected.issuerLabel && <p className="mb-2 text-sm text-muted">Issuer: {selected.issuerLabel}</p>}
                  {selected.issuedOn && <p className="mb-2 text-sm text-muted">Issued: {selected.issuedOn}</p>}
                  {selected.expiresOn && <p className="mb-2 text-sm text-muted">Expires: {selected.expiresOn}</p>}
                  {selected.notes && <p className="mb-2 text-sm text-muted">Notes: {selected.notes}</p>}
                  <p className="text-sm text-muted">Revoked certifications cannot be edited.</p>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
