"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Card, PageHeader } from "@/components/commercial/ui";
import {
  formatCurrency,
  getCommercialSummary,
  getFinanceAnalyticsSummary,
  getMarginRollup,
  getOperationsBookingReadiness,
  getOperationsSummary,
  getPipelineRollup,
  type CommercialAnalyticsSummary,
  type FinanceAnalyticsSummary,
  type MarginRollup,
  type OpsAnalyticsSummary,
  type OpsBookingReadinessRollup,
  type PipelineStageRollup,
} from "@/lib/analytics-api";
import { EosApiError } from "@/lib/eos-client";

const STAGE_LABELS: Record<string, string> = {
  new_qualified: "New / Qualified",
  discovery: "Discovery",
  proposal_sent: "Proposal Sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

type AnalyticsTab = "commercial" | "operations" | "finance";

export default function AnalyticsPage() {
  const { token, ready } = useEosSession();
  const [tab, setTab] = useState<AnalyticsTab>("commercial");
  const [summary, setSummary] = useState<CommercialAnalyticsSummary | null>(null);
  const [opsSummary, setOpsSummary] = useState<OpsAnalyticsSummary | null>(null);
  const [financeSummary, setFinanceSummary] = useState<FinanceAnalyticsSummary | null>(null);
  const [bookingReadiness, setBookingReadiness] = useState<OpsBookingReadinessRollup[]>([]);
  const [stages, setStages] = useState<PipelineStageRollup[]>([]);
  const [margins, setMargins] = useState<MarginRollup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    if (!token) {
      setSummary(null);
      setOpsSummary(null);
      setFinanceSummary(null);
      return;
    }
    setLoading(true);
    Promise.all([
      getCommercialSummary(token),
      getPipelineRollup(token),
      getMarginRollup(token),
      getOperationsSummary(token),
      getOperationsBookingReadiness(token),
      getFinanceAnalyticsSummary(token, { from: from || undefined, to: to || undefined }),
    ])
      .then(([s, p, m, ops, readiness, fin]) => {
        setSummary(s.summary);
        setStages(p.stages);
        setMargins(m.items);
        setOpsSummary(ops.summary);
        setBookingReadiness(readiness.items);
        setFinanceSummary(fin.summary);
      })
      .catch((err) => setError(err instanceof EosApiError ? err.message : "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [token, from, to]);

  if (ready && !token) {
    return <p className="text-sm text-muted">Sign in to view analytics.</p>;
  }
  if (loading) return <p className="text-sm text-muted">Loading analytics…</p>;
  if (error || !summary || !opsSummary || !financeSummary) {
    return <p className="text-sm text-red-700">{error ?? "No analytics data"}</p>;
  }

  const asOf =
    tab === "commercial" ? summary.asOf : tab === "operations" ? opsSummary.asOf : financeSummary.asOf;
  const title =
    tab === "commercial" ? "Commercial Intelligence" : tab === "operations" ? "Operations Intelligence" : "Finance Intelligence";

  return (
    <>
      <PageHeader
        eyebrow="Domain J · Analytics"
        title={title}
        subtitle={`Live OLTP rollups · as of ${new Date(asOf).toLocaleString()}`}
        actions={
          <Link href="/commercial" className="text-sm text-gold-deep underline">
            ← Dashboard
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["commercial", "operations", "finance"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-md border px-4 py-2 text-sm font-medium ${
              tab === key ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:bg-sand/40"
            }`}
          >
            {key === "commercial" ? "J1 Commercial" : key === "operations" ? "J2 Operations" : "J3 Finance"}
          </button>
        ))}
      </div>

      {tab === "commercial" ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Pipeline Value", value: formatCurrency(summary.pipelineValue, summary.currency) },
              { label: "Win Rate", value: `${summary.winRatePercent}%` },
              { label: "Active RFPs", value: String(summary.activeRfps) },
              { label: "Avg. Margin", value: `${summary.averageMarginPercent}%` },
            ].map((stat) => (
              <Card key={stat.label} title={stat.label}>
                <div className="font-display text-2xl font-semibold text-ink">{stat.value}</div>
              </Card>
            ))}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Outstanding Invoices", value: String(summary.outstandingInvoices) },
              { label: "Recon Exceptions", value: String(summary.reconciliationExceptions) },
              { label: "Field Sync Conflicts", value: String(summary.fieldSyncConflicts) },
              { label: "Bookings in Handover", value: String(summary.bookingsInHandover) },
            ].map((stat) => (
              <Card key={stat.label} title={stat.label}>
                <div className="font-display text-2xl font-semibold text-ink">{stat.value}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card title="Pipeline by Stage">
              <div className="space-y-2">
                {stages.map((s) => (
                  <div key={s.stage} className="flex justify-between rounded border border-line px-3 py-2 text-sm">
                    <span>{STAGE_LABELS[s.stage] ?? s.stage}</span>
                    <span className="text-muted">
                      {s.count} · {formatCurrency(s.totalValue, summary.currency)}
                    </span>
                  </div>
                ))}
                {stages.length === 0 && <p className="text-sm text-muted">No pipeline data.</p>}
              </div>
            </Card>

            <Card title="Bookings & Outcomes">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Won opportunities</span>
                  <span>
                    {summary.wonOpportunities} / {summary.totalOpportunities}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmed bookings</span>
                  <span>{summary.confirmedBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span>In handover / handed over</span>
                  <span>{summary.bookingsInHandover}</span>
                </div>
              </div>
            </Card>

            <Card title="Margin Rollups">
              <div className="space-y-2">
                {margins.map((m) => (
                  <div key={m.costSheetId} className="flex justify-between rounded border border-line px-3 py-2 text-sm">
                    <span className="text-muted">RFP sheet</span>
                    <span>
                      {formatCurrency(m.sellPrice, m.currency)} · {m.marginPercent}% margin
                    </span>
                  </div>
                ))}
                {margins.length === 0 && <p className="text-sm text-muted">No costing sheets yet.</p>}
              </div>
            </Card>
          </div>
        </>
      ) : tab === "operations" ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Active Bookings", value: String(opsSummary.activeBookings) },
              { label: "In Handover", value: String(opsSummary.bookingsInHandover) },
              { label: "Handover Tasks Pending", value: String(opsSummary.handoverTasksPending) },
              { label: "Handover Tasks Complete", value: String(opsSummary.handoverTasksComplete) },
            ].map((stat) => (
              <Card key={stat.label} title={stat.label}>
                <div className="font-display text-2xl font-semibold text-ink">{stat.value}</div>
              </Card>
            ))}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Supplier Confs Pending", value: String(opsSummary.supplierConfirmationsPending) },
              { label: "Manifests Published", value: String(opsSummary.manifestsPublished) },
              { label: "Vouchers Draft / Issued", value: `${opsSummary.vouchersDraft} / ${opsSummary.vouchersIssued}` },
              { label: "Field Tasks Open", value: String(opsSummary.fieldTasksOpen) },
            ].map((stat) => (
              <Card key={stat.label} title={stat.label}>
                <div className="font-display text-2xl font-semibold text-ink">{stat.value}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card title="Ops Module Rollups">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Supplier confirmations confirmed</span>
                  <span>{opsSummary.supplierConfirmationsConfirmed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Manifests draft / guests</span>
                  <span>
                    {opsSummary.manifestsDraft} draft · {opsSummary.manifestGuestCount} guests
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ops briefs issued</span>
                  <span>{opsSummary.opsBriefsIssued}</span>
                </div>
                <div className="flex justify-between">
                  <span>Field tasks complete</span>
                  <span>{opsSummary.fieldTasksComplete}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sync conflicts</span>
                  <span>{opsSummary.syncConflicts}</span>
                </div>
              </div>
            </Card>

            <Card title="Booking Ops Readiness">
              <div className="space-y-2">
                {bookingReadiness.map((b) => (
                  <div key={b.bookingId} className="rounded border border-line px-3 py-2 text-sm">
                    <div className="flex items-center justify-between">
                      <Link href={`/commercial/bookings/${b.bookingId}`} className="font-medium text-gold-deep underline">
                        {b.bookingCode}
                      </Link>
                      <span className="text-muted">{b.handoverProgressPercent}% handover</span>
                    </div>
                    <div className="mt-1 text-xs text-muted">{b.title}</div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                      {b.pendingHandoverTasks > 0 && <span>{b.pendingHandoverTasks} handover pending</span>}
                      {b.supplierConfirmationsPending > 0 && <span>{b.supplierConfirmationsPending} supplier confs</span>}
                      {b.vouchersDraft > 0 && <span>{b.vouchersDraft} draft vouchers</span>}
                      {b.fieldTasksOpen > 0 && <span>{b.fieldTasksOpen} field tasks</span>}
                      {b.syncConflicts > 0 && <span>{b.syncConflicts} sync conflicts</span>}
                      {b.manifestStatus && <span>manifest: {b.manifestStatus}</span>}
                    </div>
                  </div>
                ))}
                {bookingReadiness.length === 0 && <p className="text-sm text-muted">No active bookings.</p>}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <label className="text-sm text-muted">
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 block rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="text-sm text-muted">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 block rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
              />
            </label>
            <Link href="/commercial/finance" className="text-sm text-gold-deep underline">
              Open finance control
            </Link>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Client revenue", value: formatCurrency(financeSummary.clientRevenue, financeSummary.currency) },
              { label: "Supplier cost", value: formatCurrency(financeSummary.supplierCost, financeSummary.currency) },
              { label: "Margin", value: `${financeSummary.marginPercent}%` },
              { label: "Outstanding", value: formatCurrency(financeSummary.outstandingTotal, financeSummary.currency) },
            ].map((stat) => (
              <Card key={stat.label} title={stat.label}>
                <div className="font-display text-2xl font-semibold text-ink">{stat.value}</div>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card title="Collections">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Bookings in range</span>
                  <span>{financeSummary.bookingCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invoiced</span>
                  <span>{formatCurrency(financeSummary.invoicedTotal, financeSummary.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid</span>
                  <span>{formatCurrency(financeSummary.paidTotal, financeSummary.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Open invoices</span>
                  <span>{financeSummary.outstandingInvoiceCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recon exceptions</span>
                  <span>{financeSummary.reconciliationExceptions}</span>
                </div>
              </div>
            </Card>
            <Card title="Margin">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Margin amount</span>
                  <span>{formatCurrency(financeSummary.marginAmount, financeSummary.currency)}</span>
                </div>
                <p className="text-xs text-muted">
                  Rolled from C9 booking sell prices and C6 cost sheets. Date range uses booking confirmation date.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
