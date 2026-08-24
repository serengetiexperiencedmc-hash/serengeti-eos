"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AiPanel, Btn, PageHeader } from "@/components/commercial/ui";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import {
  addProgrammeDay,
  addProgrammeItem,
  createProgramme,
  getProgrammeByRfp,
  type ProgrammeDetail,
} from "@/lib/programme-api";
import { getCostSheetByProgramme, createCostSheet, addCostLineItem, formatCost, COST_CATEGORY_LABELS, recalculateCostSheet, type CostSheetDetail } from "@/lib/costing-api";
import { listSuppliers, type SupplierSummary } from "@/lib/suppliers-api";

function ProgrammeBuilderContent() {
  const searchParams = useSearchParams();
  const rfpId = searchParams.get("rfpId") ?? undefined;
  const { token, ready } = useEosSession();
  const [detail, setDetail] = useState<ProgrammeDetail | null>(null);
  const [missing, setMissing] = useState(false);
  const [costing, setCosting] = useState<CostSheetDetail | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  const [supplierQuery, setSupplierQuery] = useState("");
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [dayTitle, setDayTitle] = useState("");
  const [dayLocation, setDayLocation] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [itemTime, setItemTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [creatingSheet, setCreatingSheet] = useState(false);
  const [lineCategory, setLineCategory] = useState("accommodation");
  const [lineDescription, setLineDescription] = useState("");
  const [lineCost, setLineCost] = useState("");

  const loadProgramme = useCallback(async () => {
    if (!token || !rfpId) {
      setDetail(null);
      setCosting(null);
      setMissing(false);
      return;
    }
    setLoading(true);
    setError(null);
    setMissing(false);
    try {
      const [programme, supplierList, orgList] = await Promise.all([
        getProgrammeByRfp(token, rfpId),
        listSuppliers(token),
        listOrganizations(token),
      ]);
      setDetail(programme);
      setSuppliers(supplierList.items);
      setOrgs(orgList.items);
      setSelectedDayId((current) => {
        if (current && programme.days.some((d) => d.id === current)) return current;
        return programme.days[0]?.id ?? null;
      });
      try {
        const sheet = await getCostSheetByProgramme(token, programme.programme.id);
        setCosting(sheet);
      } catch {
        setCosting(null);
      }
    } catch (err) {
      setDetail(null);
      setCosting(null);
      if (err instanceof EosApiError && err.status === 404) {
        setMissing(true);
        try {
          const [supplierList, orgList] = await Promise.all([listSuppliers(token), listOrganizations(token)]);
          setSuppliers(supplierList.items);
          setOrgs(orgList.items);
        } catch {
          /* keep builder usable for create even if library fails */
        }
      } else {
        setError(err instanceof EosApiError ? err.message : "Failed to load programme");
      }
    } finally {
      setLoading(false);
    }
  }, [token, rfpId]);

  useEffect(() => {
    void loadProgramme();
  }, [loadProgramme]);

  const clientName = useMemo(() => {
    if (!detail) return "";
    const org = orgs.find((o) => o.id === detail.programme.organizationId);
    return org?.tradingName ?? org?.legalName ?? "Client";
  }, [detail, orgs]);

  const subtitle = detail
    ? `${clientName} · ${detail.programme.paxCount ?? "—"} pax · ${detail.programme.destinations ?? "Tanzania"}`
    : rfpId
      ? missing
        ? "No programme yet for this RFP"
        : "Loading programme…"
      : "Open from an RFP to load programme data";

  const filteredSuppliers = useMemo(() => {
    const q = supplierQuery.trim().toLowerCase();
    if (!q) return suppliers.slice(0, 12);
    return suppliers
      .filter(
        (s) =>
          s.legalName.toLowerCase().includes(q) ||
          s.supplierCode.toLowerCase().includes(q) ||
          (s.tradingName?.toLowerCase().includes(q) ?? false),
      )
      .slice(0, 12);
  }, [suppliers, supplierQuery]);

  async function handleSaveAndCost() {
    if (!token || !costing) return;
    setRecalculating(true);
    setError(null);
    try {
      const updated = await recalculateCostSheet(token, costing.sheet.id, costing.sheet.sellPrice);
      setCosting(updated);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to recalculate costing");
    } finally {
      setRecalculating(false);
    }
  }

  async function handleCreateProgramme() {
    if (!token || !rfpId) return;
    setCreating(true);
    setError(null);
    try {
      await createProgramme(token, { rfpId });
      await loadProgramme();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to create programme");
    } finally {
      setCreating(false);
    }
  }

  async function handleAddDay() {
    if (!token || !detail) return;
    const title = dayTitle.trim();
    if (!title) {
      setError("Day title is required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const nextNumber = detail.days.reduce((max, d) => Math.max(max, d.dayNumber), 0) + 1;
      await addProgrammeDay(token, detail.programme.id, {
        dayNumber: nextNumber,
        title,
        ...(dayLocation.trim() ? { location: dayLocation.trim() } : {}),
      });
      setDayTitle("");
      setDayLocation("");
      await loadProgramme();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to add day");
    } finally {
      setBusy(false);
    }
  }

  async function handleAddItem(dayId: string, input: { title: string; startTime?: string; supplierId?: string; supplierLabel?: string }) {
    if (!token || !detail) return;
    if (!input.title.trim()) {
      setError("Item title is required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await addProgrammeItem(token, detail.programme.id, dayId, {
        title: input.title.trim(),
        ...(input.startTime ? { startTime: input.startTime } : {}),
        ...(input.supplierId ? { supplierId: input.supplierId } : {}),
        ...(input.supplierLabel ? { supplierLabel: input.supplierLabel } : {}),
      });
      setItemTitle("");
      setItemTime("");
      setSelectedDayId(dayId);
      await loadProgramme();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to add itinerary item");
    } finally {
      setBusy(false);
    }
  }

  async function handleAttachSupplier(supplier: SupplierSummary) {
    if (!selectedDayId) {
      setError("Add or select a day before attaching a supplier");
      return;
    }
    await handleAddItem(selectedDayId, {
      title: supplier.tradingName ?? supplier.legalName,
      supplierId: supplier.id,
      supplierLabel: supplier.tradingName ?? supplier.legalName,
    });
  }

  async function handleCreateCostSheet() {
    if (!token || !detail) return;
    setCreatingSheet(true);
    setError(null);
    try {
      const sheet = await createCostSheet(token, {
        programmeId: detail.programme.id,
        ...(detail.programme.paxCount !== undefined ? { paxCount: detail.programme.paxCount } : {}),
      });
      setCosting(sheet);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to create cost sheet");
    } finally {
      setCreatingSheet(false);
    }
  }

  async function handleAddCostLine() {
    if (!token || !costing) return;
    const description = lineDescription.trim();
    const unitCost = Number(lineCost);
    if (!description) {
      setError("Line description is required");
      return;
    }
    if (!Number.isFinite(unitCost) || unitCost < 0) {
      setError("Line unit cost must be a number");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const updated = await addCostLineItem(token, costing.sheet.id, {
        category: lineCategory,
        description,
        unitCost,
      });
      setCosting(updated);
      setLineDescription("");
      setLineCost("");
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to add cost line");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={`Programme Builder · ${detail?.programme.programmeCode ?? "—"}`}
        title={detail?.programme.title ?? "Programme Builder"}
        subtitle={subtitle}
        actions={
          <>
            <Btn variant="secondary" disabled>
              Preview PDF
            </Btn>
            <Btn
              disabled={!token || !costing || recalculating}
              onClick={() => void handleSaveAndCost()}
            >
              {recalculating ? "Recalculating…" : "Save & Cost"}
            </Btn>
          </>
        }
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {ready && !token && (
        <p className="mb-4 text-sm text-muted">Sign in and open from an RFP (e.g. Global Incentives) to load the programme.</p>
      )}

      {token && !rfpId && (
        <p className="mb-4 text-sm text-muted">
          No RFP selected. Open an RFP detail page and click &ldquo;Open Programme Builder&rdquo;.
        </p>
      )}

      {loading && <p className="text-sm text-muted">Loading programme…</p>}

      {token && rfpId && missing && !loading && (
        <div className="mb-4 rounded-md border border-line bg-ivory px-4 py-4 text-sm text-ink-soft">
          <p className="mb-3">This RFP has no programme yet. Create one to start the itinerary.</p>
          <Btn disabled={creating} onClick={() => void handleCreateProgramme()}>
            {creating ? "Creating…" : "Create programme"}
          </Btn>
        </div>
      )}

      {detail && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr_300px]">
          <Panel title="Supplier Library">
            <input
              type="search"
              value={supplierQuery}
              onChange={(e) => setSupplierQuery(e.target.value)}
              placeholder="Search suppliers…"
              className="mb-3 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
            />
            <p className="mb-2 text-[0.65rem] text-muted">Click a supplier to add it to the selected day.</p>
            {filteredSuppliers.length === 0 ? (
              <p className="text-xs text-muted">No suppliers match.</p>
            ) : (
              filteredSuppliers.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  disabled={busy || !selectedDayId}
                  onClick={() => void handleAttachSupplier(s)}
                  className="mb-2 flex w-full cursor-pointer items-center gap-2 rounded-md border border-line bg-ivory p-2 text-left text-xs hover:border-gold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-sand text-[0.6rem] text-muted">
                    {s.category.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <strong className="block text-ink">{s.tradingName ?? s.legalName}</strong>
                    <span className="text-muted">{s.preferredPartner ? "★ Preferred" : s.category.replace(/_/g, " ")}</span>
                  </div>
                </button>
              ))
            )}
          </Panel>

          <Panel title="Itinerary · Live from C5 API">
            <div className="mb-3 rounded-md border border-line bg-ivory p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Add day</div>
              <input
                value={dayTitle}
                onChange={(e) => setDayTitle(e.target.value)}
                placeholder="Day title"
                className="mb-2 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
              />
              <input
                value={dayLocation}
                onChange={(e) => setDayLocation(e.target.value)}
                placeholder="Location (optional)"
                className="mb-2 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
              />
              <Btn size="sm" disabled={busy} onClick={() => void handleAddDay()}>
                Add day
              </Btn>
            </div>

            {detail.days.length === 0 ? (
              <p className="text-sm text-muted">No days yet. Add a day to start the itinerary.</p>
            ) : (
              detail.days.map((day) => (
                <div key={day.id} className={selectedDayId === day.id ? "ring-1 ring-gold rounded-[10px]" : ""}>
                  <button
                    type="button"
                    className="mb-1 w-full text-left"
                    onClick={() => setSelectedDayId(day.id)}
                  >
                    <DayBlock
                      day={day.title}
                      location={day.location ?? (selectedDayId === day.id ? "Selected" : "")}
                      items={day.items.map((item) => ({
                        time: item.startTime ?? "—",
                        title: item.title,
                        sub: item.supplierLabel ?? item.description ?? "",
                      }))}
                      empty={day.items.length === 0}
                    />
                  </button>
                </div>
              ))
            )}

            {selectedDayId && (
              <div className="mt-2 rounded-md border border-dashed border-line p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Add item to selected day</div>
                <input
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="Item title"
                  className="mb-2 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
                />
                <input
                  value={itemTime}
                  onChange={(e) => setItemTime(e.target.value)}
                  placeholder="Start time (optional)"
                  className="mb-2 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
                />
                <Btn
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    void handleAddItem(selectedDayId, {
                      title: itemTitle,
                      ...(itemTime.trim() ? { startTime: itemTime.trim() } : {}),
                    })
                  }
                >
                  Add item
                </Btn>
              </div>
            )}
          </Panel>

          <Panel title="Live Costing">
            {costing ? (
              <>
                <div className="space-y-1 text-sm">
                  {Object.entries(costing.sheet.categoryTotals)
                    .filter(([, val]) => val > 0)
                    .map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span>{COST_CATEGORY_LABELS[key] ?? key}</span>
                        <span>{formatCost(val, costing.sheet.currency)}</span>
                      </div>
                    ))}
                  <div className="flex justify-between border-t-2 border-ink pt-3 text-base font-semibold text-ink">
                    <span>Total Cost</span>
                    <span>{formatCost(costing.sheet.totalCost, costing.sheet.currency)}</span>
                  </div>
                </div>
                <div className="mt-4 border-t border-line pt-4 text-sm">
                  <div className="flex justify-between font-medium">
                    <span>Sell Price</span>
                    <strong>{formatCost(costing.sheet.sellPrice ?? 0, costing.sheet.currency)}</strong>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full rounded-full bg-success"
                      style={{ width: `${Math.min(100, costing.sheet.marginPercent)}%` }}
                    />
                  </div>
                  <div className={`mt-1 text-xs ${costing.sheet.marginMeetsFloor ? "text-success" : "text-danger"}`}>
                    Margin: {costing.sheet.marginPercent.toFixed(1)}%
                    {costing.sheet.marginMeetsFloor
                      ? ` · Above ${costing.sheet.marginFloorPercent}% floor ✓`
                      : ` · Below ${costing.sheet.marginFloorPercent}% floor`}
                  </div>
                  {costing.sheet.perPerson !== undefined && (
                    <div className="mt-2 flex justify-between border-t border-line pt-2 text-sm">
                      <span>Per Person</span>
                      <span className="font-semibold">{formatCost(costing.sheet.perPerson, costing.sheet.currency)}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 rounded-md border border-line bg-ivory p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Add line</div>
                  <select
                    value={lineCategory}
                    onChange={(e) => setLineCategory(e.target.value)}
                    className="mb-2 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
                  >
                    {Object.entries(COST_CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    value={lineDescription}
                    onChange={(e) => setLineDescription(e.target.value)}
                    placeholder="Description"
                    className="mb-2 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                  <input
                    value={lineCost}
                    onChange={(e) => setLineCost(e.target.value)}
                    placeholder="Unit cost"
                    className="mb-2 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                  <Btn size="sm" disabled={busy} onClick={() => void handleAddCostLine()}>
                    Add line
                  </Btn>
                </div>
              </>
            ) : (
              <div>
                <p className="mb-3 text-sm text-muted">No cost sheet yet for this programme.</p>
                <Btn size="sm" disabled={creatingSheet} onClick={() => void handleCreateCostSheet()}>
                  {creatingSheet ? "Creating…" : "Create cost sheet"}
                </Btn>
              </div>
            )}
            <AiPanel>
              <p className="text-sm leading-relaxed">
                Programme copy is not drafted here. Create a follow-up task from a live recommendation
                on the commercial dashboard, then accept it yourself. The assistant cannot write
                itinerary text, merge, email, or approve.
              </p>
            </AiPanel>
          </Panel>
        </div>
      )}
    </>
  );
}

export default function ProgrammePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading programme builder…</p>}>
      <ProgrammeBuilderContent />
    </Suspense>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[560px] flex-col overflow-hidden rounded-[10px] border border-line bg-paper">
      <div className="border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">{title}</div>
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
    </div>
  );
}

function DayBlock({
  day,
  location,
  items,
  empty,
}: {
  day: string;
  location: string;
  items: { time: string; title: string; sub: string }[];
  empty?: boolean;
}) {
  return (
    <div className="mb-3 overflow-hidden rounded-[10px] border border-line">
      <div className="flex items-center justify-between bg-sand px-4 py-2.5 text-sm font-medium text-ink">
        <span>{day}</span>
        <span className="text-xs text-muted">{location}</span>
      </div>
      <div className="p-2">
        {items.map((item) => (
          <div key={item.time + item.title} className="mb-1.5 flex gap-3 rounded-md border border-line bg-paper p-2.5">
            <div className="min-w-[48px] text-xs font-semibold text-gold-deep">{item.time}</div>
            <div>
              <strong className="block text-sm text-ink">{item.title}</strong>
              <span className="text-xs text-muted">{item.sub}</span>
            </div>
          </div>
        ))}
        {empty && (
          <div className="rounded-md border border-dashed border-line bg-ivory p-2.5 text-xs text-muted">
            Select this day, then add an item or click a supplier.
          </div>
        )}
      </div>
    </div>
  );
}
