"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { SupplierImportModal } from "@/components/commercial/SupplierImportModal";
import { SupplierFormModal } from "@/components/commercial/SupplierFormModal";
import { Btn, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  archiveSupplier,
  archiveSupplierContact,
  archiveSupplierContentBlock,
  archiveSupplierRate,
  createSupplierContact,
  createSupplierContentBlock,
  createSupplierRate,
  formatCategoryLabel,
  getSupplier,
  getSupplierFacets,
  getSupplierRateCalendar,
  listSuppliers,
  preferSupplierRate,
  restoreSupplier,
  type SupplierDetail,
  type SupplierFacets,
  type SupplierSummary,
} from "@/lib/suppliers-api";

const FILTERS = [
  { label: "All", category: undefined, preferredOnly: false, archived: false },
  { label: "Accommodation", category: "accommodation", preferredOnly: false, archived: false },
  { label: "Vehicle Hire", category: "vehicle_hire", preferredOnly: false, archived: false },
  { label: "Excursions", category: "excursion", preferredOnly: false, archived: false },
  { label: "AV & Entertainment", category: "av_entertainment", preferredOnly: false, archived: false },
  { label: "Décor", category: "decor", preferredOnly: false, archived: false },
  { label: "Preferred Partners", category: undefined, preferredOnly: true, archived: false },
  { label: "Archived", category: undefined, preferredOnly: false, archived: true },
] as const;

function statusBadge(status: string) {
  if (status === "pending_review") return <Badge variant="review" label="Pending Review" />;
  if (status === "draft") return <Badge variant="draft" label="Draft" />;
  if (status === "inactive" || status === "suspended") {
    return <Badge variant="draft" label={status.replace(/_/g, " ")} />;
  }
  return null;
}

function SupplierCard({
  supplier,
  onSelect,
  onRestore,
  archivedView,
}: {
  supplier: SupplierSummary;
  onSelect: (id: string) => void;
  onRestore?: (id: string) => void;
  archivedView?: boolean;
}) {
  const displayName = supplier.tradingName ?? supplier.legalName;
  const location = [supplier.city, supplier.region, supplier.country].filter(Boolean).join(" · ");

  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-paper text-left transition hover:shadow-lg">
      <button type="button" onClick={() => onSelect(supplier.id)} className="w-full cursor-pointer text-left" disabled={archivedView}>
        <div className="flex h-[120px] items-center justify-center bg-gradient-to-br from-sand to-line px-4 text-center">
          <span className="font-display text-lg font-semibold text-ink-soft">{displayName}</span>
        </div>
        <div className="p-4">
          <div className="font-medium text-ink">{displayName}</div>
          <div className="text-xs text-muted">
            {formatCategoryLabel(supplier.category)}
            {location ? ` · ${location}` : ""}
            {supplier.preferredPartner ? " · ★ Preferred" : ""}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-muted">{supplier.supplierCode}</span>
            {statusBadge(supplier.status)}
            {supplier.defaultCurrency && (
              <span className="text-gold-deep">{supplier.defaultCurrency}</span>
            )}
          </div>
        </div>
      </button>
      {archivedView && onRestore ? (
        <div className="border-t border-line px-4 py-3">
          <Btn size="sm" variant="secondary" onClick={() => onRestore(supplier.id)}>
            Restore
          </Btn>
        </div>
      ) : null}
    </div>
  );
}

function SupplierDetailDrawer({
  token,
  detail,
  loading,
  onClose,
  onEdit,
  onRefresh,
  onArchived,
}: {
  token: string;
  detail: SupplierDetail | null;
  loading: boolean;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
  onArchived: () => void;
}) {
  const [contactBusy, setContactBusy] = useState(false);
  const [rateBusy, setRateBusy] = useState(false);
  const [blockBusy, setBlockBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    contactRole: "reservations",
    givenName: "",
    familyName: "",
    email: "",
    isPrimary: false,
  });
  const [rateForm, setRateForm] = useState({
    rateCode: "",
    rateName: "",
    rateType: "per_room_per_night",
    amount: "100",
    currency: "USD",
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    seasonLabel: "",
    status: "active",
  });
  const [calendarFrom, setCalendarFrom] = useState("2026-01-01");
  const [calendarTo, setCalendarTo] = useState("2026-12-31");
  const [calendar, setCalendar] = useState<{
    seasons: Array<{ label: string; count: number }>;
    months: Array<{ month: string; count: number }>;
    heatmapMonths: Array<{ month: string; conflictCount: number; unresolvedCount: number }>;
    heatmapMax: number;
    conflicts: Array<{
      rateType: string;
      overlapFrom: string;
      overlapTo: string;
      aId: string;
      bId: string;
      aCode: string;
      bCode: string;
      preferredRateId: string | null;
      resolved: boolean;
    }>;
  } | null>(null);
  const [blockForm, setBlockForm] = useState({
    blockCode: "",
    blockType: "description",
    title: "",
    body: "",
    status: "draft",
  });

  if (!detail && !loading) return null;
  const supplier = detail?.supplier;

  async function loadCalendar() {
    if (!supplier) return;
    try {
      const res = await getSupplierRateCalendar(token, {
        from: calendarFrom,
        to: calendarTo,
        supplierId: supplier.id,
      });
      setCalendar({
        seasons: res.seasons.map((s) => ({ label: s.label, count: s.count })),
        months: res.months.map((m) => ({ month: m.month, count: m.count })),
        heatmapMonths: res.heatmap?.months ?? [],
        heatmapMax: res.heatmap?.maxConflictCount ?? 0,
        conflicts: (res.conflicts ?? []).map((c) => ({
          rateType: c.rateType,
          overlapFrom: c.overlapFrom,
          overlapTo: c.overlapTo,
          aId: c.a.id,
          bId: c.b.id,
          aCode: c.a.rateCode,
          bCode: c.b.rateCode,
          preferredRateId: c.preferredRateId ?? null,
          resolved: Boolean(c.resolved),
        })),
      });
    } catch {
      setCalendar(null);
    }
  }

  useEffect(() => {
    if (!supplier) return;
    void loadCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, supplier?.id, calendarFrom, calendarTo, detail?.rates.length]);

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!supplier) return;
    setContactBusy(true);
    setFormError(null);
    try {
      await createSupplierContact(token, supplier.id, {
        contactRole: contactForm.contactRole,
        givenName: contactForm.givenName,
        familyName: contactForm.familyName,
        ...(contactForm.email.trim() ? { email: contactForm.email.trim() } : {}),
        isPrimary: contactForm.isPrimary,
      });
      setShowContactForm(false);
      setContactForm({ contactRole: "reservations", givenName: "", familyName: "", email: "", isPrimary: false });
      onRefresh();
    } catch (err) {
      setFormError(err instanceof EosApiError ? err.message : "Failed to add contact");
    } finally {
      setContactBusy(false);
    }
  }

  async function handleAddRate(e: React.FormEvent) {
    e.preventDefault();
    if (!supplier) return;
    setRateBusy(true);
    setFormError(null);
    try {
      await createSupplierRate(token, supplier.id, {
        rateCode: rateForm.rateCode,
        rateName: rateForm.rateName,
        rateType: rateForm.rateType,
        amount: Number(rateForm.amount),
        currency: rateForm.currency,
        validFrom: rateForm.validFrom,
        validTo: rateForm.validTo,
        ...(rateForm.seasonLabel.trim() ? { seasonLabel: rateForm.seasonLabel.trim() } : {}),
        status: rateForm.status,
      });
      setShowRateForm(false);
      setRateForm({
        rateCode: "",
        rateName: "",
        rateType: "per_room_per_night",
        amount: "100",
        currency: "USD",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        seasonLabel: "",
        status: "active",
      });
      onRefresh();
      void loadCalendar();
    } catch (err) {
      setFormError(err instanceof EosApiError ? err.message : "Failed to add rate");
    } finally {
      setRateBusy(false);
    }
  }

  async function handleArchiveContact(contactId: string) {
    if (!supplier) return;
    try {
      await archiveSupplierContact(token, supplier.id, contactId);
      onRefresh();
    } catch (err) {
      setFormError(err instanceof EosApiError ? err.message : "Failed to remove contact");
    }
  }

  async function handlePreferRate(rateId: string) {
    if (!supplier) return;
    try {
      await preferSupplierRate(token, supplier.id, rateId);
      onRefresh();
      await loadCalendar();
    } catch (err) {
      setFormError(err instanceof EosApiError ? err.message : "Failed to prefer rate");
    }
  }

  async function handleArchiveRate(rateId: string) {
    if (!supplier) return;
    try {
      await archiveSupplierRate(token, supplier.id, rateId);
      onRefresh();
    } catch (err) {
      setFormError(err instanceof EosApiError ? err.message : "Failed to remove rate");
    }
  }

  async function handleAddBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!supplier) return;
    setBlockBusy(true);
    setFormError(null);
    try {
      await createSupplierContentBlock(token, supplier.id, {
        blockCode: blockForm.blockCode,
        blockType: blockForm.blockType,
        body: blockForm.body,
        ...(blockForm.title.trim() ? { title: blockForm.title.trim() } : {}),
        status: blockForm.status,
      });
      setShowBlockForm(false);
      setBlockForm({ blockCode: "", blockType: "description", title: "", body: "", status: "draft" });
      onRefresh();
    } catch (err) {
      setFormError(err instanceof EosApiError ? err.message : "Failed to add content block");
    } finally {
      setBlockBusy(false);
    }
  }

  async function handleArchiveBlock(blockId: string) {
    if (!supplier) return;
    try {
      await archiveSupplierContentBlock(token, supplier.id, blockId);
      onRefresh();
    } catch (err) {
      setFormError(err instanceof EosApiError ? err.message : "Failed to remove content block");
    }
  }

  async function handleArchiveSupplier() {
    if (!supplier) return;
    if (!window.confirm(`Archive ${supplier.tradingName ?? supplier.legalName}? Contacts, rates, and content blocks will also be archived.`)) {
      return;
    }
    setFormError(null);
    try {
      await archiveSupplier(token, supplier.id);
      onArchived();
    } catch (err) {
      setFormError(err instanceof EosApiError ? err.message : "Failed to archive supplier");
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-ink/30">
      <div className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-paper shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            {loading ? "Loading…" : (supplier?.tradingName ?? supplier?.legalName)}
          </h2>
          <div className="flex items-center gap-2">
            {supplier && (
              <>
                <Btn variant="secondary" onClick={onEdit}>
                  Edit
                </Btn>
                <Btn variant="secondary" onClick={() => void handleArchiveSupplier()}>
                  Archive
                </Btn>
              </>
            )}
            <button type="button" onClick={onClose} className="text-muted hover:text-ink">
              ✕
            </button>
          </div>
        </div>
        {supplier && detail && (
          <div className="space-y-5 p-5 text-sm">
            {formError && (
              <div className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-danger">{formError}</div>
            )}
            <div>
              <div className="text-xs uppercase tracking-wide text-muted">Legal name</div>
              <div className="text-ink">{supplier.legalName}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted">Code</div>
                <div className="font-mono text-ink">{supplier.supplierCode}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted">Status</div>
                <div className="capitalize text-ink">{supplier.status.replace(/_/g, " ")}</div>
              </div>
            </div>

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Contacts ({detail.contacts.length})
                </h3>
                <Btn size="sm" variant="secondary" onClick={() => setShowContactForm((v) => !v)}>
                  {showContactForm ? "Cancel" : "+ Contact"}
                </Btn>
              </div>
              {showContactForm && (
                <form onSubmit={handleAddContact} className="mb-3 space-y-2 rounded-md border border-line bg-ivory p-3">
                  <select
                    value={contactForm.contactRole}
                    onChange={(e) => setContactForm((f) => ({ ...f, contactRole: e.target.value }))}
                    className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                  >
                    {["reservations", "operations", "finance", "management", "sales", "emergency", "other"].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      placeholder="Given name"
                      value={contactForm.givenName}
                      onChange={(e) => setContactForm((f) => ({ ...f, givenName: e.target.value }))}
                      className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                    />
                    <input
                      required
                      placeholder="Family name"
                      value={contactForm.familyName}
                      onChange={(e) => setContactForm((f) => ({ ...f, familyName: e.target.value }))}
                      className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                  />
                  <label className="flex items-center gap-2 text-xs text-ink">
                    <input
                      type="checkbox"
                      checked={contactForm.isPrimary}
                      onChange={(e) => setContactForm((f) => ({ ...f, isPrimary: e.target.checked }))}
                    />
                    Primary contact
                  </label>
                  <Btn type="submit" size="sm" disabled={contactBusy}>
                    {contactBusy ? "Saving…" : "Save contact"}
                  </Btn>
                </form>
              )}
              {detail.contacts.length === 0 ? (
                <p className="text-muted">No contacts yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.contacts.map((c) => (
                    <li key={c.id} className="rounded-md border border-line bg-ivory p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-ink">
                            {c.givenName} {c.familyName}
                            {c.isPrimary ? " · Primary" : ""}
                          </div>
                          <div className="text-xs capitalize text-muted">{c.contactRole.replace(/_/g, " ")}</div>
                          {c.email && <div className="text-xs text-ink-soft">{c.email}</div>}
                        </div>
                        <button
                          type="button"
                          className="text-xs text-muted hover:text-danger"
                          onClick={() => void handleArchiveContact(c.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Rate cards ({detail.rates.length})
                </h3>
                <Btn size="sm" variant="secondary" onClick={() => setShowRateForm((v) => !v)}>
                  {showRateForm ? "Cancel" : "+ Rate"}
                </Btn>
              </div>
              {showRateForm && (
                <form onSubmit={handleAddRate} className="mb-3 space-y-2 rounded-md border border-line bg-ivory p-3">
                  <input
                    required
                    placeholder="Rate code"
                    value={rateForm.rateCode}
                    onChange={(e) => setRateForm((f) => ({ ...f, rateCode: e.target.value }))}
                    className="w-full rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-sm"
                  />
                  <input
                    required
                    placeholder="Rate name"
                    value={rateForm.rateName}
                    onChange={(e) => setRateForm((f) => ({ ...f, rateName: e.target.value }))}
                    className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={rateForm.amount}
                      onChange={(e) => setRateForm((f) => ({ ...f, amount: e.target.value }))}
                      className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                    />
                    <input
                      required
                      maxLength={3}
                      value={rateForm.currency}
                      onChange={(e) => setRateForm((f) => ({ ...f, currency: e.target.value.toUpperCase() }))}
                      className="rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      type="date"
                      value={rateForm.validFrom}
                      onChange={(e) => setRateForm((f) => ({ ...f, validFrom: e.target.value }))}
                      className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                    />
                    <input
                      required
                      type="date"
                      value={rateForm.validTo}
                      onChange={(e) => setRateForm((f) => ({ ...f, validTo: e.target.value }))}
                      className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                    />
                  </div>
                  <input
                    placeholder="Season label (optional)"
                    value={rateForm.seasonLabel}
                    onChange={(e) => setRateForm((f) => ({ ...f, seasonLabel: e.target.value }))}
                    className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                  />
                  <Btn type="submit" size="sm" disabled={rateBusy}>
                    {rateBusy ? "Saving…" : "Save rate"}
                  </Btn>
                </form>
              )}
              {calendar && (
                <div className="mb-3 rounded-md border border-line bg-ivory p-3">
                  <div className="mb-2 text-xs uppercase tracking-wide text-muted">Rate calendar (PG.23)</div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={calendarFrom}
                      onChange={(e) => setCalendarFrom(e.target.value)}
                      className="rounded-md border border-line bg-paper px-2 py-1 text-xs"
                    />
                    <input
                      type="date"
                      value={calendarTo}
                      onChange={(e) => setCalendarTo(e.target.value)}
                      className="rounded-md border border-line bg-paper px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {calendar.seasons.map((s) => (
                      <span key={s.label} className="rounded border border-line px-2 py-0.5 text-xs text-ink">
                        {s.label} · {s.count}
                      </span>
                    ))}
                    {calendar.seasons.length === 0 && (
                      <span className="text-xs text-muted">No rates in window</span>
                    )}
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {calendar.months.map((m) => (
                      <span key={m.month} className="rounded bg-sand/40 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                        {m.month}:{m.count}
                      </span>
                    ))}
                  </div>
                  {calendar.heatmapMonths.length > 0 && (
                    <div className="mb-2">
                      <div className="mb-1 text-[10px] uppercase tracking-wide text-muted">Conflict heatmap</div>
                      <div className="flex flex-wrap gap-1">
                        {calendar.heatmapMonths.map((m) => {
                          const intensity =
                            calendar.heatmapMax > 0 ? m.conflictCount / calendar.heatmapMax : 0;
                          const bg =
                            m.unresolvedCount > 0
                              ? `rgba(190, 18, 60, ${0.18 + intensity * 0.55})`
                              : `rgba(180, 140, 60, ${0.12 + intensity * 0.4})`;
                          return (
                            <span
                              key={`heat-${m.month}`}
                              title={`${m.month}: ${m.conflictCount} conflict(s), ${m.unresolvedCount} unresolved`}
                              className="rounded px-1.5 py-0.5 font-mono text-[10px] text-ink"
                              style={{ backgroundColor: bg }}
                            >
                              {m.month.slice(5)}:{m.conflictCount}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {calendar.conflicts.length > 0 && (
                    <div className="rounded border border-rose-200 bg-rose-50/60 p-2 text-xs text-rose-800">
                      <div className="mb-1 font-medium">
                        Conflicts ({calendar.conflicts.length}
                        {calendar.conflicts.some((c) => !c.resolved)
                          ? ` · ${calendar.conflicts.filter((c) => !c.resolved).length} unresolved`
                          : ""}
                        )
                      </div>
                      <ul className="space-y-1.5">
                        {calendar.conflicts.map((c, i) => (
                          <li key={`${c.aCode}-${c.bCode}-${i}`} className="flex flex-wrap items-center gap-2">
                            <span>
                              {c.aCode} ↔ {c.bCode} · {c.rateType} · {c.overlapFrom}→{c.overlapTo}
                              {c.resolved ? " · preferred set" : ""}
                            </span>
                            {!c.resolved && (
                              <span className="flex gap-1">
                                <button
                                  type="button"
                                  className="rounded border border-rose-300 bg-white px-1.5 py-0.5 text-[10px] text-rose-900 hover:bg-rose-100"
                                  onClick={() => void handlePreferRate(c.aId)}
                                >
                                  Prefer {c.aCode}
                                </button>
                                <button
                                  type="button"
                                  className="rounded border border-rose-300 bg-white px-1.5 py-0.5 text-[10px] text-rose-900 hover:bg-rose-100"
                                  onClick={() => void handlePreferRate(c.bId)}
                                >
                                  Prefer {c.bCode}
                                </button>
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {detail.rates.length === 0 ? (
                <p className="text-muted">No rates yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.rates.map((r) => (
                    <li key={r.id} className="rounded-md border border-line bg-ivory p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-ink">{r.rateName}</div>
                          <div className="text-xs text-muted">{r.rateCode}</div>
                          <div className="mt-1 text-gold-deep">
                            {r.currency} {r.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted">
                            {r.validFrom} → {r.validTo}
                            {r.seasonLabel ? ` · ${r.seasonLabel}` : ""}
                            {r.preferredInConflict ? " · preferred in conflict" : ""}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-muted hover:text-danger"
                          onClick={() => void handleArchiveRate(r.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="mb-2 flex items-center justify-between font-display text-lg font-semibold text-ink">
                <span>Content blocks ({detail.contentBlocks.length})</span>
                <button
                  type="button"
                  className="text-xs font-sans font-medium text-gold-deep hover:underline"
                  onClick={() => setShowBlockForm((v) => !v)}
                >
                  {showBlockForm ? "Cancel" : "+ Add"}
                </button>
              </h3>
              {showBlockForm && (
                <form onSubmit={(e) => void handleAddBlock(e)} className="mb-3 space-y-2 rounded-md border border-line bg-ivory p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      placeholder="Block code"
                      value={blockForm.blockCode}
                      onChange={(e) => setBlockForm((f) => ({ ...f, blockCode: e.target.value.toUpperCase() }))}
                      className="rounded-md border border-line bg-paper px-2 py-1.5 font-mono text-sm"
                    />
                    <select
                      value={blockForm.blockType}
                      onChange={(e) => setBlockForm((f) => ({ ...f, blockType: e.target.value }))}
                      className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                    >
                      <option value="description">Description</option>
                      <option value="highlights">Highlights</option>
                      <option value="room_type">Room type</option>
                      <option value="inclusions">Inclusions</option>
                      <option value="exclusions">Exclusions</option>
                      <option value="location">Location</option>
                      <option value="programme_snippet">Programme snippet</option>
                      <option value="image_caption">Image caption</option>
                      <option value="terms">Terms</option>
                    </select>
                  </div>
                  <input
                    placeholder="Title (optional)"
                    value={blockForm.title}
                    onChange={(e) => setBlockForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Body"
                    value={blockForm.body}
                    onChange={(e) => setBlockForm((f) => ({ ...f, body: e.target.value }))}
                    className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
                  />
                  <Btn type="submit" size="sm" disabled={blockBusy}>
                    {blockBusy ? "Saving…" : "Save content block"}
                  </Btn>
                </form>
              )}
              {detail.contentBlocks.length === 0 ? (
                <p className="text-muted">No content blocks yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.contentBlocks.map((b) => (
                    <li key={b.id} className="rounded-md border border-line bg-ivory p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-ink">{b.title ?? b.blockCode}</div>
                          <div className="text-xs capitalize text-muted">{b.blockType.replace(/_/g, " ")}</div>
                          <div className="text-xs text-muted">{b.status}</div>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-muted hover:text-danger"
                          onClick={() => void handleArchiveBlock(b.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuppliersPage() {
  const { token, ready } = useEosSession();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]["label"]>("All");
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SupplierDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState<string | undefined>();
  const [facets, setFacets] = useState<SupplierFacets | null>(null);
  const [total, setTotal] = useState(0);

  const filterConfig = FILTERS.find((f) => f.label === activeFilter) ?? FILTERS[0];

  const loadSuppliers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const query = {
        category: filterConfig.category,
        q: search.trim() || undefined,
        archived: filterConfig.archived,
        preferredPartner: filterConfig.preferredOnly ? true : undefined,
        country: countryFilter,
      };
      const [result, facetResult] = await Promise.all([
        listSuppliers(token, query),
        getSupplierFacets(token, query),
      ]);
      setSuppliers(result.items);
      setTotal(result.total ?? result.items.length);
      setFacets(facetResult.facets);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to load suppliers");
      setSuppliers([]);
      setFacets(null);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [token, filterConfig, search, countryFilter]);

  useEffect(() => {
    if (ready && token) void loadSuppliers();
  }, [ready, token, loadSuppliers]);

  useEffect(() => {
    if (!token || !selectedId) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    void getSupplier(token, selectedId)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }, [token, selectedId]);

  const subtitle = useMemo(() => {
    if (!token) return "Sign in to load suppliers from EOS API";
    if (loading) return "Loading suppliers…";
    return `${total} supplier${total === 1 ? "" : "s"} · Live API · PG.16 rate prefer`;
  }, [token, loading, total]);

  return (
    <>
      <PageHeader
        eyebrow="Supplier & Rate Library"
        title="Supplier Library"
        subtitle={subtitle}
        actions={
          token ? (
            <>
              <Btn variant="secondary" onClick={() => setImportOpen(true)}>
                Import CSV
              </Btn>
              <Btn
                onClick={() => {
                  setFormMode("create");
                  setFormOpen(true);
                }}
              >
                + Add Supplier
              </Btn>
            </>
          ) : undefined
        }
      />

      {token && (
        <div className="mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or supplier code…"
            className="w-full max-w-md rounded-full border border-line bg-ivory px-4 py-2 text-sm text-ink outline-none focus:border-gold"
          />
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => {
              setActiveFilter(filter.label);
              setCountryFilter(undefined);
            }}
            disabled={!token}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors disabled:opacity-50 ${
              activeFilter === filter.label
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper text-ink-soft hover:bg-sand"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {facets && facets.country.length > 0 && !filterConfig.archived && (
        <div className="mb-5 flex flex-wrap gap-2">
          <span className="self-center text-xs uppercase tracking-wide text-muted">Country</span>
          <button
            type="button"
            onClick={() => setCountryFilter(undefined)}
            className={`rounded-full border px-3 py-1 text-xs ${
              !countryFilter ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink"
            }`}
          >
            All
          </button>
          {facets.country.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCountryFilter(c.value)}
              className={`rounded-full border px-3 py-1 text-xs ${
                countryFilter === c.value ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink"
              }`}
            >
              {c.value} ({c.count})
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}. Is the API running on port 8080?
        </div>
      )}

      {!token ? (
        <div className="rounded-[10px] border border-dashed border-line bg-ivory p-10 text-center text-sm text-muted">
          Supplier data loads from <code className="text-ink">/v1/suppliers</code> once you sign in.
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-[10px] bg-sand" />
          ))}
        </div>
      ) : suppliers.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-line bg-ivory p-10 text-center">
          <p className="mb-4 text-sm text-muted">No suppliers yet. Import your first batch to get started.</p>
          <Btn onClick={() => setImportOpen(true)}>Import CSV</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {suppliers.map((s) => (
            <SupplierCard
              key={s.id}
              supplier={s}
              archivedView={filterConfig.archived}
              onSelect={(id) => {
                if (filterConfig.archived) return;
                setSelectedId(id);
              }}
              onRestore={(id) => {
                void restoreSupplier(token!, id)
                  .then(() => loadSuppliers())
                  .catch((err) =>
                    setError(err instanceof EosApiError ? err.message : "Failed to restore supplier"),
                  );
              }}
            />
          ))}
        </div>
      )}

      {token && (
        <SupplierImportModal
          token={token}
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onCommitted={() => void loadSuppliers()}
        />
      )}

      {token && (
        <SupplierFormModal
          token={token}
          open={formOpen}
          mode={formMode}
          initial={formMode === "edit" ? detail?.supplier ?? null : null}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            void loadSuppliers();
            if (selectedId) {
              void getSupplier(token, selectedId).then(setDetail).catch(() => setDetail(null));
            }
          }}
        />
      )}

      {(selectedId || detailLoading) && token && (
        <SupplierDetailDrawer
          token={token}
          detail={detail}
          loading={detailLoading}
          onClose={() => setSelectedId(null)}
          onEdit={() => {
            setFormMode("edit");
            setFormOpen(true);
          }}
          onRefresh={() => {
            if (!selectedId) return;
            void getSupplier(token, selectedId).then(setDetail).catch(() => setDetail(null));
            void loadSuppliers();
          }}
          onArchived={() => {
            setSelectedId(null);
            setDetail(null);
            void loadSuppliers();
          }}
        />
      )}
    </>
  );
}
