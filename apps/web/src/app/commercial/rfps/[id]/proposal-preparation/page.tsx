"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { formatCost } from "@/lib/costing-api";
import { EosApiError } from "@/lib/eos-client";
import {
  getRfpProposalPreparation,
  type ProposalPreparationView,
} from "@/lib/rfp-api";

export default function ProposalPreparationPage() {
  const params = useParams<{ id: string }>();
  const { token, ready } = useEosSession();
  const [view, setView] = useState<ProposalPreparationView | null>(null);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !params.id) {
      setView(null);
      return;
    }
    setLoading(true);
    setError(null);
    getRfpProposalPreparation(token, params.id)
      .then((prep) => {
        setView(prep);
        return listOrganizations(token)
          .then((orgList) => setOrgs(orgList.items))
          .catch(() => setOrgs([]));
      })
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load proposal preparation");
        setView(null);
      })
      .finally(() => setLoading(false));
  }, [token, params.id]);

  const clientName = useMemo(() => {
    if (!view) return "";
    const orgId = view.programme?.organizationId ?? view.rfp.organizationId;
    const org = orgs.find((o) => o.id === orgId);
    return org?.tradingName ?? org?.legalName ?? "Client";
  }, [view, orgs]);

  if (ready && !token) {
    return <p className="text-sm text-muted">Sign in to view internal proposal preparation.</p>;
  }
  if (loading) return <p className="text-sm text-muted">Loading proposal preparation…</p>;
  if (error || !view) {
    return <p className="text-sm text-red-700">{error ?? "Proposal preparation not found"}</p>;
  }

  const finance = view.financialSummary;
  const requiredGaps = view.unresolved.filter((g) => g.requiredForClientRelease);

  return (
    <>
      <PageHeader
        eyebrow="Internal working draft · not a client-issued proposal"
        title={`Proposal preparation · ${view.rfp.rfpCode}`}
        subtitle={`${clientName} · ${view.readiness.replace(/_/g, " ")} · PDF/email/dispatch deferred`}
        actions={
          <>
            <Link href={`/commercial/rfps/${view.rfp.id}`}>
              <Btn variant="secondary">RFP</Btn>
            </Link>
            <Link href={`/commercial/programme?rfpId=${view.rfp.id}`}>
              <Btn variant="secondary">Programme Builder</Btn>
            </Link>
            <Link href="/commercial/finance">
              <Btn variant="secondary">Finance</Btn>
            </Link>
          </>
        }
      />

      <div className="mb-5 rounded-md border border-gold bg-ivory px-4 py-3 text-sm text-ink">
        This is an <strong>internal proposal-preparation working draft</strong>. It assembles the existing RFP,
        programme, and cost sheet. It does not generate a PDF, send email, or issue a client proposal.
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-4">
        {[
          ["RFP", view.rfp.rfpCode],
          ["Programme", view.programme?.programmeCode ?? "Missing"],
          ["Commercial label", view.programme?.commercialVersionLabel ?? "—"],
          ["Costing", view.costingStatus ?? "No cost sheet"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-line bg-paper p-3">
            <div className="text-[0.65rem] uppercase tracking-wide text-muted">{label}</div>
            <div className="mt-1 font-medium">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card title="RFP context (source of truth — not copied)">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[0.7rem] uppercase text-muted">Title</dt>
                <dd>{view.rfp.title}</dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase text-muted">Workflow stage</dt>
                <dd>{view.rfpWorkflow.current}</dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase text-muted">Pax / destination</dt>
                <dd>
                  {view.rfp.paxCount ?? "—"} · {view.rfp.destinations ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase text-muted">Opportunity</dt>
                <dd>{view.rfp.opportunityId}</dd>
              </div>
              <div>
                <dt className="text-[0.7rem] uppercase text-muted">Won/lost record</dt>
                <dd>{view.rfpWorkflow.wonLostRecord} (not RFP)</dd>
              </div>
            </dl>
            {view.rfp.requirementsText && (
              <p className="mt-3 text-sm text-muted">{view.rfp.requirementsText}</p>
            )}
          </Card>

          <Card title="Programme itinerary">
            {!view.programme ? (
              <p className="text-sm text-muted">No programme linked. Create one from the RFP.</p>
            ) : (
              <>
                <p className="mb-3 text-xs text-muted">
                  {view.programme.title} · live commercial label {view.programme.commercialVersionLabel}
                  {view.latestNumericProgrammeVersion
                    ? ` · recorded snapshot v${view.latestNumericProgrammeVersion.versionNumber}`
                    : " · no numeric snapshot recorded"}
                </p>
                {view.days.length === 0 ? (
                  <p className="text-sm text-muted">No days yet.</p>
                ) : (
                  view.days.map((day) => (
                    <div key={day.id} className="mb-3 rounded-md border border-line p-3">
                      <div className="text-sm font-medium">
                        Day {day.dayNumber} · {day.title}
                        {day.location ? ` · ${day.location}` : ""}
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-muted">
                        {day.items.map((item) => (
                          <li key={item.id}>
                            {item.startTime ?? "—"} · {item.title}
                            {item.itemType ? ` · ${item.itemType}` : ""}
                            {item.supplierLabel ? ` · ${item.supplierLabel}` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Internal commercial figures">
            {!finance ? (
              <p className="text-sm text-muted">No cost sheet. Figures are not invented.</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Supplier cost</span>
                  <span>{formatCost(finance.supplierCost, finance.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Client selling price</span>
                  <span>{formatCost(finance.clientSellingPrice, finance.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross profit</span>
                  <span>{formatCost(finance.grossProfit ?? 0, finance.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross margin</span>
                  <span>{finance.grossMarginPercent.toFixed(1)}%</span>
                </div>
                <p className="pt-2 text-xs text-muted">
                  Formula reused: {view.financialFormula ?? finance.formula ?? "kernel.computeCostTotals"}. Not
                  recalculated here. File fee is internal and incorporated.
                </p>
              </div>
            )}
          </Card>

          <Card title="Client-facing commercial view">
            {!view.clientFacing ? (
              <p className="text-sm text-muted">No sanitized client price until a cost sheet exists.</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Client selling price</span>
                  <span>{formatCost(view.clientFacing.clientSellingPrice, view.clientFacing.currency)}</span>
                </div>
                <p className="text-xs text-muted">
                  This view excludes supplier cost, markup, margin, file fee, tax composition, and FX.
                  PDF/email/dispatch remain deferred.
                </p>
              </div>
            )}
          </Card>

          <Card title="Required before client release">
            <ul className="space-y-2 text-xs">
              {requiredGaps.map((gap) => (
                <li key={gap.code} className="rounded-md border border-line bg-ivory p-2">
                  <div className="font-medium text-ink">{gap.code}</div>
                  <div className="text-muted">{gap.message}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
