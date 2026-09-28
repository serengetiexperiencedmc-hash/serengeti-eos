"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AiPanel, Btn, PageHeader } from "@/components/commercial/ui";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import {
  addProgrammeDay,
  addProgrammeItem,
  addProgrammeRooming,
  createProgramme,
  getProgrammeByRfp,
  patchProgramme,
  PROGRAMME_COMMERCIAL_VERSION_OPTIONS,
  PROGRAMME_ITEM_TYPE_OPTIONS,
  type ProgrammeDetail,
} from "@/lib/programme-api";
import { getCostSheetByProgramme, createCostSheet, addCostLineItem, formatCost, COST_CATEGORY_LABELS, recalculateCostSheet, type CostSheetDetail } from "@/lib/costing-api";
import { listSuppliers, type SupplierSummary } from "@/lib/suppliers-api";
import { ProgrammeCommercialFactsPanel } from "@/components/commercial/ProgrammeCommercialFactsPanel";
import {
  commercialFactsCanWrite,
  getProgrammeCommercialFacts,
  mapCommercialFactsPutFailure,
  putProgrammeCommercialFacts,
  type F2FactsPersistence,
  type ProgrammeCommercialFacts,
} from "@/lib/commercial-facts-api";

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
  const [dayDate, setDayDate] = useState("");
  const [dayDescription, setDayDescription] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [itemTime, setItemTime] = useState("");
  const [itemType, setItemType] = useState("other");
  const [busy, setBusy] = useState(false);
  const [versionBusy, setVersionBusy] = useState(false);
  const [creatingSheet, setCreatingSheet] = useState(false);
  const [lineCategory, setLineCategory] = useState("accommodation");
  const [lineDescription, setLineDescription] = useState("");
  const [lineCost, setLineCost] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [deposit, setDeposit] = useState("30");
  const [roomType, setRoomType] = useState("twin");
  const [roomCount, setRoomCount] = useState("1");
  const [roomOccupancy, setRoomOccupancy] = useState("");
  const [termsBusy, setTermsBusy] = useState(false);
  const [f2Facts, setF2Facts] = useState<ProgrammeCommercialFacts | null>(null);
  const [f2Persistence, setF2Persistence] = useState<F2FactsPersistence | undefined>();
  const [f2Error, setF2Error] = useState<string | null>(null);
  const [f2Loading, setF2Loading] = useState(false);
  const [f2Unauthorized, setF2Unauthorized] = useState(false);
  const [f2WriteForbidden, setF2WriteForbidden] = useState(false);
  const [f2DraftNote, setF2DraftNote] = useState("");
  const [f2DraftVersion, setF2DraftVersion] = useState("");
  const [f2Saving, setF2Saving] = useState(false);

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
      setInclusions(programme.programme.inclusionsText ?? "");
      setExclusions(programme.programme.exclusionsText ?? "");
      setDeposit(String(programme.programme.depositPercent ?? 30));
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
      setF2Loading(true);
      try {
        const commercial = await getProgrammeCommercialFacts(token, programme.programme.id);
        setF2Facts(commercial.facts);
        setF2Persistence(commercial.persistence);
        setF2DraftNote(commercial.facts.note ?? "");
        setF2DraftVersion(
          commercial.facts.observedClientFacingVersionNumber !== undefined
            ? String(commercial.facts.observedClientFacingVersionNumber)
            : "",
        );
        setF2Error(null);
        setF2Unauthorized(false);
        setF2WriteForbidden(false);
      } catch (err) {
        setF2Facts(null);
        if (err instanceof EosApiError && err.status === 403) {
          setF2Unauthorized(true);
          setF2Error("Not authorized to read programme commercial facts.");
        } else {
          setF2Error(err instanceof EosApiError ? err.message : "Failed to load F2 programme facts");
        }
      } finally {
        setF2Loading(false);
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

  async function saveF2ProgrammeFacts() {
    if (!token || !detail) return;
    setF2Saving(true);
    setF2Error(null);
    try {
      const payload: { note?: string; observedClientFacingVersionNumber?: number } = {
        note: f2DraftNote,
      };
      if (f2DraftVersion.trim()) {
        payload.observedClientFacingVersionNumber = Number(f2DraftVersion);
      }
      const saved = await putProgrammeCommercialFacts(token, detail.programme.id, payload);
      setF2Facts(saved.facts);
      setF2Persistence(saved.persistence);
      setF2WriteForbidden(false);
    } catch (err) {
      const mapped = mapCommercialFactsPutFailure(err, "programme");
      setF2Error(mapped.message);
      if (mapped.writeForbidden) setF2WriteForbidden(true);
    } finally {
      setF2Saving(false);
    }
  }

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
        ...(dayDate.trim() ? { calendarDate: dayDate.trim() } : {}),
        ...(dayDescription.trim() ? { description: dayDescription.trim() } : {}),
      });
      setDayTitle("");
      setDayLocation("");
      setDayDate("");
      setDayDescription("");
      await loadProgramme();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to add day");
    } finally {
      setBusy(false);
    }
  }

  async function handleAddItem(dayId: string, input: { title: string; startTime?: string; supplierId?: string; supplierLabel?: string; itemType?: string }) {
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
        ...(input.itemType ? { itemType: input.itemType } : {}),
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
      itemType,
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

  async function handleCommercialVersionChange(label: string) {
    if (!token || !detail) return;
    setVersionBusy(true);
    setError(null);
    try {
      const updated = await patchProgramme(token, detail.programme.id, { commercialVersionLabel: label });
      setDetail((current) =>
        current ? { ...current, programme: { ...current.programme, ...updated.programme } } : current,
      );
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to update commercial version");
    } finally {
      setVersionBusy(false);
    }
  }

  async function handleSaveCommercialTerms() {
    if (!token || !detail) return;
    const parsed = Number(deposit);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
      setError("Deposit percent must be between 0 and 100");
      return;
    }
    setTermsBusy(true);
    setError(null);
    try {
      const updated = await patchProgramme(token, detail.programme.id, {
        depositPercent: parsed,
        inclusionsText: inclusions.trim() ? inclusions.trim() : null,
        exclusionsText: exclusions.trim() ? exclusions.trim() : null,
      });
      setDetail((current) => (current ? { ...current, programme: { ...current.programme, ...updated.programme } } : current));
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to save commercial terms");
    } finally {
      setTermsBusy(false);
    }
  }

  async function handleAddRooming() {
    if (!token || !detail) return;
    const count = Number(roomCount);
    if (!Number.isFinite(count) || count < 0) {
      setError("Room count must be 0 or more");
      return;
    }
    setTermsBusy(true);
    setError(null);
    try {
      const occupancy = roomOccupancy.trim() ? Number(roomOccupancy) : undefined;
      const updated = await addProgrammeRooming(token, detail.programme.id, {
        roomType,
        roomCount: count,
        ...(occupancy !== undefined && Number.isFinite(occupancy) ? { occupancy } : {}),
      });
      setDetail(updated);
      setRoomCount("1");
      setRoomOccupancy("");
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to add rooming");
    } finally {
      setTermsBusy(false);
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
      const added = await addCostLineItem(token, costing.sheet.id, {
        category: lineCategory,
        description,
        unitCost,
      });
      const refreshed = await getCostSheetByProgramme(token, added.sheet.programmeId);
      setCosting(refreshed);
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
            {detail && (
              <Link href={`/commercial/rfps/${detail.programme.rfpId}`}>
                <Btn variant="secondary">Originating RFP</Btn>
              </Link>
            )}
            {detail && (
              <Link href={`/commercial/rfps/${detail.programme.rfpId}/proposal-preparation`}>
                <Btn variant="secondary">Proposal preparation</Btn>
              </Link>
            )}
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

      {(f2Facts || f2Loading || f2Error) && (
        <div className="mb-4">
          <ProgrammeCommercialFactsPanel
            facts={f2Facts}
            persistence={f2Persistence}
            loading={f2Loading}
            error={f2Error}
            unauthorized={f2Unauthorized}
            unauthenticated={ready && !token}
            canWrite={commercialFactsCanWrite({
              hasToken: Boolean(token),
              factsLoaded: Boolean(f2Facts),
              unauthorizedRead: f2Unauthorized,
              writeForbidden: f2WriteForbidden,
            })}
            draftNote={f2DraftNote}
            draftVersion={f2DraftVersion}
            saving={f2Saving}
            onNoteChange={setF2DraftNote}
            onVersionChange={setF2DraftVersion}
            onSave={() => void saveF2ProgrammeFacts()}
          />
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
        <div className="mb-4 grid grid-cols-1 gap-3 rounded-md border border-line bg-ivory p-4 text-sm md:grid-cols-4">
          <div>
            <div className="text-[0.7rem] uppercase tracking-wide text-muted">Commercial version</div>
            <select
              value={detail.programme.commercialVersionLabel ?? "draft"}
              disabled={versionBusy}
              onChange={(e) => void handleCommercialVersionChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-2 py-1 text-xs outline-none focus:border-gold"
            >
              {PROGRAMME_COMMERCIAL_VERSION_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[0.7rem] uppercase tracking-wide text-muted">Programme status</div>
            <div className="mt-1 font-medium">{detail.programme.status}</div>
          </div>
          <div>
            <div className="text-[0.7rem] uppercase tracking-wide text-muted">Days / pax</div>
            <div className="mt-1 font-medium">
              {detail.programme.dayCount} days · {detail.programme.paxCount ?? "—"} pax
            </div>
          </div>
          <div>
            <div className="text-[0.7rem] uppercase tracking-wide text-muted">Costing status</div>
            <div className="mt-1 font-medium">
              {costing?.sheet.financialSummary?.financialStatus ?? costing?.sheet.status ?? "No cost sheet"}
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="mb-4 rounded-md border border-line bg-paper p-4 text-sm">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Commercial terms (internal)
          </div>
          <p className="mb-3 text-xs text-muted">
            Client version stays editable. Final locks the programme. Nights = departure − arrival. Rooming is entered
            explicitly. Safari vehicle default is 6 passengers.
          </p>
          <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <div className="text-[0.65rem] uppercase text-muted">Nights</div>
              <div className="font-medium">{detail.programme.nightCount ?? "—"}</div>
            </div>
            <div>
              <div className="text-[0.65rem] uppercase text-muted">Deposit %</div>
              <input
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="mt-1 w-full rounded-md border border-line px-2 py-1 text-xs outline-none focus:border-gold"
              />
            </div>
            <div>
              <div className="text-[0.65rem] uppercase text-muted">Vehicles (max 6 pax)</div>
              <div className="font-medium">{detail.programme.requiredVehicles ?? "—"}</div>
            </div>
            <div>
              <div className="text-[0.65rem] uppercase text-muted">Milestones</div>
              <div className="font-medium">
                {(detail.programme.paymentMilestones ?? []).map((m) => `${m.percent}%`).join(" / ") || "30 / 40 / 30"}
              </div>
            </div>
          </div>
          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <textarea
              value={inclusions}
              onChange={(e) => setInclusions(e.target.value)}
              placeholder="Inclusions (manual)"
              className="min-h-[72px] w-full rounded-md border border-line px-2 py-1 text-xs outline-none focus:border-gold"
            />
            <textarea
              value={exclusions}
              onChange={(e) => setExclusions(e.target.value)}
              placeholder="Exclusions (manual)"
              className="min-h-[72px] w-full rounded-md border border-line px-2 py-1 text-xs outline-none focus:border-gold"
            />
          </div>
          <Btn size="sm" disabled={termsBusy} onClick={() => void handleSaveCommercialTerms()}>
            {termsBusy ? "Saving…" : "Save terms"}
          </Btn>
          <div className="mt-4 border-t border-line pt-3">
            <div className="mb-2 text-[0.65rem] uppercase text-muted">Rooming (explicit, no assumed ratio)</div>
            <ul className="mb-2 text-xs">
              {(detail.rooming ?? []).length === 0 ? (
                <li className="text-muted">No rooming entered.</li>
              ) : (
                (detail.rooming ?? []).map((row) => (
                  <li key={row.id}>
                    {row.roomCount} × {row.roomType}
                    {row.occupancy !== undefined ? ` · occ ${row.occupancy}` : ""}
                  </li>
                ))
              )}
            </ul>
            <div className="flex flex-wrap gap-2">
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="rounded-md border border-line px-2 py-1 text-xs outline-none focus:border-gold"
              >
                {["single", "twin", "double", "triple", "crew_staff", "other"].map((value) => (
                  <option key={value} value={value}>
                    {value.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <input
                value={roomCount}
                onChange={(e) => setRoomCount(e.target.value)}
                placeholder="Count"
                className="w-20 rounded-md border border-line px-2 py-1 text-xs outline-none focus:border-gold"
              />
              <input
                value={roomOccupancy}
                onChange={(e) => setRoomOccupancy(e.target.value)}
                placeholder="Occupancy"
                className="w-24 rounded-md border border-line px-2 py-1 text-xs outline-none focus:border-gold"
              />
              <Btn size="sm" disabled={termsBusy} onClick={() => void handleAddRooming()}>
                Add rooming
              </Btn>
            </div>
          </div>
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
              <input
                type="date"
                value={dayDate}
                onChange={(e) => setDayDate(e.target.value)}
                className="mb-2 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
              />
              <input
                value={dayDescription}
                onChange={(e) => setDayDescription(e.target.value)}
                placeholder="Day notes (optional)"
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
                        sub: [item.itemType, item.supplierLabel ?? item.description].filter(Boolean).join(" · "),
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
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="mb-2 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
                >
                  {PROGRAMME_ITEM_TYPE_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <Btn
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    void handleAddItem(selectedDayId, {
                      title: itemTitle,
                      itemType,
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
                    <span>Supplier cost</span>
                    <span>
                      {formatCost(
                        costing.sheet.financialSummary?.supplierCost ?? costing.sheet.totalCost,
                        costing.sheet.currency,
                      )}
                    </span>
                  </div>
                </div>
                <div className="mt-4 border-t border-line pt-4 text-sm">
                  <div className="flex justify-between font-medium">
                    <span>Client selling price</span>
                    <strong>
                      {formatCost(
                        costing.sheet.financialSummary?.clientSellingPrice ?? costing.sheet.sellPrice ?? 0,
                        costing.sheet.currency,
                      )}
                    </strong>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted">
                    <span>Gross profit</span>
                    <span>
                      {formatCost(
                        costing.sheet.financialSummary?.grossProfit ?? costing.sheet.marginAmount,
                        costing.sheet.currency,
                      )}
                    </span>
                  </div>
                  {costing.sheet.fileFeeAmount !== undefined && (
                    <div className="mt-1 text-[0.65rem] text-muted">
                      File fee is internal and incorporated into the client selling price. It is not a client line.
                    </div>
                  )}
                  {costing.sheet.clientFacing && (
                    <div className="mt-3 rounded-md border border-line bg-ivory p-2 text-xs">
                      <div className="uppercase tracking-wide text-muted">Client-facing price</div>
                      <div className="mt-1 font-medium">
                        {formatCost(
                          costing.sheet.clientFacing.clientSellingPrice,
                          costing.sheet.clientFacing.currency,
                        )}
                      </div>
                    </div>
                  )}
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
