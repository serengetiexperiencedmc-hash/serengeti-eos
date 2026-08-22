"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { SupplierImportModal } from "@/components/commercial/SupplierImportModal";
import { SupplierFormModal } from "@/components/commercial/SupplierFormModal";
import { Btn, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
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
  detail,
  loading,
  onClose,
  onEdit,
}: {
  detail: SupplierDetail | null;
  loading: boolean;
  onClose: () => void;
  onEdit: () => void;
}) {
  if (!detail && !loading) return null;

  const supplier = detail?.supplier;

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
        {supplier && (
          <div className="space-y-5 p-5 text-sm">
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
              <h3 className="mb-2 font-display text-lg font-semibold text-ink">
                Contacts ({detail.contacts.length})
              </h3>
              {detail.contacts.length === 0 ? (
                <p className="text-muted">No contacts imported yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.contacts.map((c) => (
                    <li key={c.id} className="rounded-md border border-line bg-ivory p-3">
                      <div className="font-medium text-ink">
                        {c.givenName} {c.familyName}
                        {c.isPrimary ? " · Primary" : ""}
                      </div>
                      <div className="text-xs capitalize text-muted">{c.contactRole.replace(/_/g, " ")}</div>
                      {c.email && <div className="text-xs text-ink-soft">{c.email}</div>}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="mb-2 font-display text-lg font-semibold text-ink">
                Rate cards ({detail.rates.length})
              </h3>
              {detail.rates.length === 0 ? (
                <p className="text-muted">No rates imported yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.rates.map((r) => (
                    <li key={r.id} className="rounded-md border border-line bg-ivory p-3">
                      <div className="font-medium text-ink">{r.rateName}</div>
                      <div className="text-xs text-muted">{r.rateCode}</div>
                      <div className="mt-1 text-gold-deep">
                        {r.currency} {r.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted">
                        {r.validFrom} → {r.validTo}
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

      {(selectedId || detailLoading) && (
        <SupplierDetailDrawer
          detail={detail}
          loading={detailLoading}
          onClose={() => setSelectedId(null)}
          onEdit={() => {
            setFormMode("edit");
            setFormOpen(true);
          }}
        />
      )}
    </>
  );
}
