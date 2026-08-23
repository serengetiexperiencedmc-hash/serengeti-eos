"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { SlaIndicator } from "@/components/commercial/SlaIndicator";
import { StatCard } from "@/components/commercial/StatCard";
import { AiPanel, Btn, Card, PageHeader } from "@/components/commercial/ui";
import { formatRelativeDate } from "@/lib/crm-api";
import { formatCurrency, type CommercialAnalyticsSummary } from "@/lib/analytics-api";
import { fetchCommercialLiveStats, type CommercialLiveStats } from "@/lib/commercial-stats";
import { EosApiError } from "@/lib/eos-client";

const activityIcons: Record<string, string> = {
  email: "✉",
  follow_up: "↩",
  sales_call: "📞",
  meeting: "🤝",
  proposal_discussion: "📄",
};

function timeOfDayGreeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function CommercialDashboardPage() {
  const { token, ready } = useEosSession();
  const [live, setLive] = useState<CommercialLiveStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    setGreeting(timeOfDayGreeting());
  }, []);

  useEffect(() => {
    if (!token) {
      setLive(null);
      return;
    }
    void fetchCommercialLiveStats(token)
      .then(setLive)
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load live stats");
        setLive(null);
      });
  }, [token]);

  const statCards = token && live
    ? [
        {
          label: "Pipeline Value",
          value: formatCurrency(live.analytics.pipelineValue, live.analytics.currency),
          delta: `${live.analytics.totalOpportunities} opportunities · J1 Analytics`,
          trend: "up" as const,
        },
        {
          label: "Win Rate",
          value: `${live.analytics.winRatePercent}%`,
          delta: `${live.analytics.wonOpportunities} won · live rollup`,
          trend: "neutral" as const,
        },
        {
          label: "Avg. Margin",
          value: `${live.analytics.averageMarginPercent}%`,
          delta: `${live.analytics.activeRfps} active RFPs`,
          trend: "up" as const,
        },
        {
          label: "Bookings / Finance",
          value: String(live.analytics.bookingsInHandover),
          delta: `${live.analytics.outstandingInvoices} invoices · ${live.analytics.reconciliationExceptions} recon exceptions`,
          trend: live.analytics.reconciliationExceptions > 0 ? ("down" as const) : ("neutral" as const),
        },
      ]
    : [
        {
          label: "Pipeline Value",
          value: "—",
          delta: "Sign in to load J1 analytics",
          trend: "neutral" as const,
        },
        {
          label: "Win Rate",
          value: "—",
          delta: "Sign in to load live data",
          trend: "neutral" as const,
        },
        {
          label: "Avg. Margin",
          value: "—",
          delta: "Sign in to load live data",
          trend: "neutral" as const,
        },
        {
          label: "Bookings / Finance",
          value: "—",
          delta: "Sign in to load live data",
          trend: "neutral" as const,
        },
      ];

  return (
    <>
      <PageHeader
        eyebrow={greeting}
        title="Commercial Dashboard"
        subtitle={
          token && live
            ? `J1 + J2 live analytics · ${live.suppliers} suppliers · ${live.opsAnalytics.activeBookings} active bookings`
            : "Sign in to connect live analytics, finance & operations APIs"
        }
        actions={
          <div className="flex gap-2">
            <Btn href="/commercial/analytics" variant="secondary">
              Analytics
            </Btn>
            <Btn href="/commercial/suppliers" variant="secondary">
              Supplier Library
            </Btn>
            <Btn href="/commercial/proposals">+ Create Proposal</Btn>
          </div>
        }
      />

      {error && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {token && live && (
        <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Handover Pending"
            value={String(live.opsAnalytics.handoverTasksPending)}
            delta={`${live.opsAnalytics.bookingsInHandover} bookings in handover · J2`}
            trend={live.opsAnalytics.handoverTasksPending > 0 ? "down" : "neutral"}
          />
          <StatCard
            label="Supplier Confs"
            value={String(live.opsAnalytics.supplierConfirmationsPending)}
            delta={`${live.opsAnalytics.supplierConfirmationsConfirmed} confirmed`}
            trend={live.opsAnalytics.supplierConfirmationsPending > 0 ? "down" : "neutral"}
          />
          <StatCard
            label="Draft Vouchers"
            value={String(live.opsAnalytics.vouchersDraft)}
            delta={`${live.opsAnalytics.vouchersIssued} issued · ${live.opsAnalytics.manifestGuestCount} guests`}
            trend={live.opsAnalytics.vouchersDraft > 0 ? "down" : "neutral"}
          />
          <StatCard
            label="Field Tasks Open"
            value={String(live.opsAnalytics.fieldTasksOpen)}
            delta={`${live.opsAnalytics.opsBriefsIssued} briefs issued`}
            trend={live.opsAnalytics.fieldTasksOpen > 0 ? "down" : "neutral"}
          />
        </div>
      )}

      {token && live && (
        <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Suppliers" value={String(live.suppliers)} delta="Live supplier library" trend="neutral" />
          <StatCard label="CRM Clients" value={String(live.organizations)} delta={`${live.contacts} contacts`} trend="neutral" />
          <StatCard label="CRM Activities" value={String(live.activities)} delta={`${live.accounts} accounts`} trend="neutral" />
          <StatCard
            label="Sync / Recon"
            value={String(live.analytics.fieldSyncConflicts + live.analytics.reconciliationExceptions)}
            delta={`${live.analytics.fieldSyncConflicts} sync · ${live.analytics.reconciliationExceptions} recon`}
            trend={live.analytics.reconciliationExceptions > 0 ? "down" : "neutral"}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
        <Card
          title="RFPs Requiring Action"
          headerExtra={
            token && live ? (
              <Link href="/commercial/rfps" className="text-sm text-gold-deep hover:underline">
                All RFPs →
              </Link>
            ) : (
              <span className="text-xs text-muted">Sign in for live RFPs</span>
            )
          }
          padding={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Programme</th>
                  <th className="px-4 py-3 font-semibold">Stage</th>
                  <th className="px-4 py-3 font-semibold">SLA</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {!token ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                      Sign in to see RFPs requiring action.
                    </td>
                  </tr>
                ) : !live ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                      Loading RFPs…
                    </td>
                  </tr>
                ) : live.actionRfps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                      No active RFPs. Run demo seed or create one via the API.
                    </td>
                  </tr>
                ) : (
                  live.actionRfps.map((rfp) => (
                    <tr key={rfp.id} className="border-b border-line hover:bg-sand/30">
                      <td className="px-4 py-3 font-medium text-ink">{rfp.client}</td>
                      <td className="px-4 py-3">{rfp.programme}</td>
                      <td className="px-4 py-3">
                        <Badge variant={rfp.stage} />
                      </td>
                      <td className="px-4 py-3">
                        <SlaIndicator status={rfp.slaIndicator} label={rfp.slaLabel} />
                      </td>
                      <td className="px-4 py-3">{rfp.value}</td>
                      <td className="px-4 py-3">
                        <Btn href={rfp.href} variant="secondary" size="sm">
                          Open
                        </Btn>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div>
          <Card
            title="Recent Activity"
            headerExtra={
              token ? (
                <Link href="/commercial/crm" className="text-sm text-gold-deep hover:underline">
                  CRM →
                </Link>
              ) : undefined
            }
          >
            {!token ? (
              <p className="text-sm text-muted">Sign in to see live CRM activities.</p>
            ) : !live ? (
              <p className="text-sm text-muted">Loading activities…</p>
            ) : live.recentActivities.length === 0 ? (
              <p className="text-sm text-muted">No activities logged yet.</p>
            ) : (
              live.recentActivities.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-line py-3 last:border-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand text-sm">
                    {activityIcons[item.activityType] ?? "•"}
                  </div>
                  <div>
                    <p className="text-sm">{item.subject}</p>
                    <div className="mt-0.5 text-xs text-muted">
                      {item.organizationId
                        ? `${live.organizationNames[item.organizationId] ?? "Client"} · `
                        : ""}
                      {formatRelativeDate(item.occurredAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </Card>

          <AiPanel>
            <div className="rounded-md bg-white/5 p-3 text-sm leading-relaxed">
              {token && live && live.organizations > 0 ? (
                <>
                  Global Incentives RFP: Based on similar 60–70 pax incentive programmes, consider
                  adding a bush dinner at Seronera on Day 3. Seronera Safari Lodge is in your
                  supplier library with High Season rates from USD 450/night.
                </>
              ) : (
                <>
                  Sign in and load demo data to see AI suggestions grounded in your supplier library
                  and CRM clients.
                </>
              )}
              <div className="mt-2 flex gap-2">
                <Btn variant="gold" size="sm" disabled>
                  Add to programme
                </Btn>
                <Btn variant="ghost" size="sm" disabled>
                  Dismiss
                </Btn>
              </div>
            </div>
          </AiPanel>
        </div>
      </div>
    </>
  );
}
