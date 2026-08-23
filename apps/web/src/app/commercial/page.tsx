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
import {
  acceptAiDraft,
  createAiDraft,
  discardAiDraft,
  listAiDrafts,
  listAiRecommendations,
  type AiDraft,
  type AiRecommendation,
} from "@/lib/ai-api";
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
  const [recs, setRecs] = useState<AiRecommendation[] | null>(null);
  const [drafts, setDrafts] = useState<AiDraft[] | null>(null);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Welcome");

  function reloadAi(sessionToken: string) {
    void listAiRecommendations(sessionToken)
      .then((res) => setRecs(res.items))
      .catch(() => setRecs([]));
    void listAiDrafts(sessionToken, "pending")
      .then((res) => setDrafts(res.items))
      .catch(() => setDrafts([]));
  }

  useEffect(() => {
    setGreeting(timeOfDayGreeting());
  }, []);

  useEffect(() => {
    if (!token) {
      setLive(null);
      setRecs(null);
      setDrafts(null);
      return;
    }
    void fetchCommercialLiveStats(token)
      .then(setLive)
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load live stats");
        setLive(null);
      });
    reloadAi(token);
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
            {!token ? (
              <p className="text-sm leading-relaxed">
                Sign in to see recommended next actions. Drafts stay unpublished until you accept.
                The assistant cannot merge, email, or approve.
              </p>
            ) : recs === null ? (
              <p className="text-sm text-muted">Loading recommendations…</p>
            ) : (
              <>
                {aiError && <p className="mb-2 text-xs text-gold">{aiError}</p>}
                {recs.length === 0 ? (
                  <p className="text-sm leading-relaxed">No recommended actions right now.</p>
                ) : (
                  <ul className="space-y-3">
                    {recs.map((item) => (
                      <li key={item.id} className="rounded-md bg-white/5 p-3 text-sm leading-relaxed">
                        <p className="font-medium text-sand">{item.title}</p>
                        <p className="mt-1 text-xs text-muted">{item.reason}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Btn href={item.href} variant="gold" size="sm">
                            Open
                          </Btn>
                          <Btn
                            variant="secondary"
                            size="sm"
                            disabled={aiBusy === `draft:${item.key}`}
                            onClick={() => {
                              setAiBusy(`draft:${item.key}`);
                              setAiError(null);
                              void createAiDraft(token, item.key)
                                .then(() => reloadAi(token))
                                .catch((err) => {
                                  setAiError(err instanceof EosApiError ? err.message : "Could not create draft");
                                })
                                .finally(() => setAiBusy(null));
                            }}
                          >
                            {aiBusy === `draft:${item.key}` ? "Drafting…" : "Draft"}
                          </Btn>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {drafts && drafts.length > 0 && (
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">
                      Pending drafts
                    </p>
                    <ul className="space-y-3">
                      {drafts.map((draft) => (
                        <li key={draft.id} className="rounded-md bg-white/5 p-3 text-sm leading-relaxed">
                          <p className="font-medium text-sand">{draft.title}</p>
                          <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-gold">
                            {draft.artefactType === "crm_activity" ? "CRM activity draft" : "CRM task draft"}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-xs text-muted">{draft.body}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Btn
                              variant="gold"
                              size="sm"
                              disabled={aiBusy === `accept:${draft.id}`}
                              onClick={() => {
                                setAiBusy(`accept:${draft.id}`);
                                setAiError(null);
                                void acceptAiDraft(token, draft.id)
                                  .then(() => reloadAi(token))
                                  .catch((err) => {
                                    setAiError(err instanceof EosApiError ? err.message : "Could not accept draft");
                                  })
                                  .finally(() => setAiBusy(null));
                              }}
                            >
                              {aiBusy === `accept:${draft.id}` ? "Accepting…" : "Accept"}
                            </Btn>
                            <Btn
                              variant="secondary"
                              size="sm"
                              disabled={aiBusy === `discard:${draft.id}`}
                              onClick={() => {
                                setAiBusy(`discard:${draft.id}`);
                                setAiError(null);
                                void discardAiDraft(token, draft.id)
                                  .then(() => reloadAi(token))
                                  .catch((err) => {
                                    setAiError(err instanceof EosApiError ? err.message : "Could not discard draft");
                                  })
                                  .finally(() => setAiBusy(null));
                              }}
                            >
                              {aiBusy === `discard:${draft.id}` ? "Discarding…" : "Discard"}
                            </Btn>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </AiPanel>
        </div>
      </div>
    </>
  );
}
