"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AiPanel, Btn, PageHeader } from "@/components/commercial/ui";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import { getProgrammeByRfp, type ProgrammeDetail } from "@/lib/programme-api";
import { getCostSheetByProgramme, formatCost, COST_CATEGORY_LABELS, recalculateCostSheet, type CostSheetDetail } from "@/lib/costing-api";
import { listSuppliers, type SupplierSummary } from "@/lib/suppliers-api";

function ProgrammeBuilderContent() {
  const searchParams = useSearchParams();
  const rfpId = searchParams.get("rfpId") ?? undefined;
  const { token, ready } = useEosSession();
  const [detail, setDetail] = useState<ProgrammeDetail | null>(null);
  const [costing, setCosting] = useState<CostSheetDetail | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    if (!token || !rfpId) {
      setDetail(null);
      setCosting(null);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([getProgrammeByRfp(token, rfpId), listSuppliers(token), listOrganizations(token)])
      .then(async ([programme, supplierList, orgList]) => {
        setDetail(programme);
        setSuppliers(supplierList.items.slice(0, 8));
        setOrgs(orgList.items);
        try {
          const sheet = await getCostSheetByProgramme(token, programme.programme.id);
          setCosting(sheet);
        } catch {
          setCosting(null);
        }
      })
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load programme");
        setDetail(null);
      })
      .finally(() => setLoading(false));
  }, [token, rfpId]);

  const clientName = useMemo(() => {
    if (!detail) return "";
    const org = orgs.find((o) => o.id === detail.programme.organizationId);
    return org?.tradingName ?? org?.legalName ?? "Client";
  }, [detail, orgs]);

  const subtitle = detail
    ? `${clientName} · ${detail.programme.paxCount ?? "—"} pax · ${detail.programme.destinations ?? "Tanzania"}`
    : rfpId
      ? "Loading programme…"
      : "Open from an RFP to load programme data";

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

      {detail && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr_300px]">
          <Panel title="Supplier Library">
            <input
              type="search"
              placeholder="Search suppliers…"
              className="mb-3 w-full rounded-md border border-line px-3 py-2 text-xs outline-none focus:border-gold"
              disabled
            />
            {suppliers.map((s) => (
              <div
                key={s.id}
                className="mb-2 flex cursor-grab items-center gap-2 rounded-md border border-line bg-ivory p-2 text-xs hover:border-gold"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-sand text-[0.6rem] text-muted">
                  {s.category.slice(0, 3).toUpperCase()}
                </div>
                <div>
                  <strong className="block text-ink">{s.tradingName ?? s.legalName}</strong>
                  <span className="text-muted">{s.preferredPartner ? "★ Preferred" : s.category.replace(/_/g, " ")}</span>
                </div>
              </div>
            ))}
          </Panel>

          <Panel title="Itinerary · Live from C5 API">
            {detail.days.length === 0 ? (
              <p className="text-sm text-muted">No days yet. Add days via the API.</p>
            ) : (
              detail.days.map((day) => (
                <DayBlock
                  key={day.id}
                  day={day.title}
                  location={day.location ?? ""}
                  items={day.items.map((item) => ({
                    time: item.startTime ?? "—",
                    title: item.title,
                    sub: item.supplierLabel ?? item.description ?? "",
                  }))}
                  empty={day.items.length === 0}
                />
              ))
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
              </>
            ) : (
              <p className="text-sm text-muted">No cost sheet yet for this programme.</p>
            )}
            <AiPanel>
              <div className="rounded-md bg-white/5 p-3 text-xs leading-relaxed">
                &ldquo;Day 3 — Soar above the Serengeti at dawn in a hot air balloon, followed by a champagne breakfast in the bush.&rdquo;
                <div className="mt-2 flex gap-2">
                  <Btn variant="gold" size="sm" disabled>
                    Use text
                  </Btn>
                  <Btn variant="ghost" size="sm" disabled>
                    Edit
                  </Btn>
                </div>
              </div>
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
            Drop supplier here…
          </div>
        )}
      </div>
    </div>
  );
}
