"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { SupplierImportModal } from "@/components/commercial/SupplierImportModal";
import { SupplierFormModal } from "@/components/commercial/SupplierFormModal";
import { Btn, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  archiveSupplierContact,
  archiveSupplierRate,
  createSupplierContact,
  createSupplierRate,
  formatCategoryLabel,
  getSupplier,
  listSuppliers,
  type SupplierDetail,
  type SupplierSummary,
} from "@/lib/suppliers-api";

const FILTERS = [
  { label: "All", category: undefined, preferredOnly: false },
  { label: "Accommodation", category: "accommodation", preferredOnly: false },
  { label: "Vehicle Hire", category: "vehicle_hire", preferredOnly: false },
  { label: "Excursions", category: "excursion", preferredOnly: false },
  { label: "AV & Entertainment", category: "av_entertainment", preferredOnly: false },
  { label: "Décor", category: "decor", preferredOnly: false },
  { label: "Preferred Partners", category: undefined, preferredOnly: true },
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
}: {
  supplier: SupplierSummary;
  onSelect: (id: string) => void;
}) {
  const displayName = supplier.tradingName ?? supplier.legalName;
  const location = [supplier.city, supplier.region, supplier.country].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={() => onSelect(supplier.id)}
      className="cursor-pointer overflow-hidden rounded-[10px] border border-line bg-paper text-left transition hover:shadow-lg"
    >
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
  );
}

function SupplierDetailDrawer({
  token,
  detail,
  loading,
  onClose,
  onEdit,
  onRefresh,
}: {
  token: string;
  detail: SupplierDetail | null;
  loading: boolean;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
}) {
  const [contactBusy, setContactBusy] = useState(false);
  const [rateBusy, setRateBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);
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
    status: "active",
  });

  if (!detail && !loading) return null;

  const supplier = detail?.supplier;

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
        status: "active",
      });
      onRefresh();
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

  async function handleArchiveRate(rateId: string) {
    if (!supplier) return;
    try {
      await archiveSupplierRate(token, supplier.id, rateId);
      onRefresh();
    } catch (err) {
      setFormError(err instanceof EosApiError ? err.message : "Failed to remove rate");
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
              <Btn variant="secondary" onClick={onEdit}>
                Edit
              </Btn>
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
                  <Btn type="submit" size="sm" disabled={rateBusy}>
                    {rateBusy ? "Saving…" : "Save rate"}
                  </Btn>
                </form>
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
              <h3 className="mb-2 font-display text-lg font-semibold text-ink">
                Content blocks ({detail.contentBlocks.length})
              </h3>
              {detail.contentBlocks.length === 0 ? (
                <p className="text-muted">No content blocks imported yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.contentBlocks.map((b) => (
                    <li key={b.id} className="rounded-md border border-line bg-ivory p-3">
                      <div className="font-medium text-ink">{b.title ?? b.blockCode}</div>
                      <div className="text-xs capitalize text-muted">{b.blockType.replace(/_/g, " ")}</div>
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

  const filterConfig = FILTERS.find((f) => f.label === activeFilter) ?? FILTERS[0];

  const loadSuppliers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await listSuppliers(token, {
        category: filterConfig.category,
        q: search.trim() || undefined,
      });
      let items = result.items;
      if (filterConfig.preferredOnly) {
        items = items.filter((s) => s.preferredPartner);
      }
      setSuppliers(items);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to load suppliers");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, [token, filterConfig, search]);

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
    return `${suppliers.length} supplier${suppliers.length === 1 ? "" : "s"} · Live API`;
  }, [token, loading, suppliers.length]);

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
            onClick={() => setActiveFilter(filter.label)}
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
            <SupplierCard key={s.id} supplier={s} onSelect={setSelectedId} />
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
        />
      )}
    </>
  );
}
