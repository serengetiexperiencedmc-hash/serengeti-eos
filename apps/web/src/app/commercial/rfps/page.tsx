"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { SlaIndicator } from "@/components/commercial/SlaIndicator";
import { Btn, PageHeader } from "@/components/commercial/ui";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import {
  formatBudgetRange,
  listRfps,
  RFP_WORKFLOW_LABELS,
  slaIndicatorStatus,
  slaLabel,
  type RfpSummary,
} from "@/lib/rfp-api";

function workflowBadge(stage: string): "progress" | "review" | "won" | "draft" {
  if (stage === "approval" || stage === "costing") return "review";
  if (stage === "sent" || stage === "closed") return "won";
  if (stage === "proposal") return "progress";
  return "progress";
}

export default function RfpsListPage() {
  const { token, ready } = useEosSession();
  const [rfps, setRfps] = useState<RfpSummary[]>([]);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setRfps([]);
      setOrgs([]);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([listRfps(token, { status: "active" }), listOrganizations(token)])
      .then(([rfpList, orgList]) => {
        setRfps(rfpList.items);
        setOrgs(orgList.items);
      })
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load RFPs");
        setRfps([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const orgNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const org of orgs) {
      map[org.id] = org.tradingName ?? org.legalName;
    }
    return map;
  }, [orgs]);

  return (
    <>
      <PageHeader
        eyebrow="RFP Management"
        title="Active RFPs"
        subtitle={
          token && !loading
            ? `${rfps.length} active RFP${rfps.length === 1 ? "" : "s"} · Live · C3 API`
            : token && loading
              ? "Loading RFPs…"
              : "Sign in to view live RFP data"
        }
        actions={<Btn disabled={!token}>+ New RFP</Btn>}
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {ready && !token && (
        <p className="mb-4 text-sm text-muted">Use the dev sign-in panel to load RFPs from the API.</p>
      )}

      <div className="space-y-3">
        {rfps.map((rfp) => {
          const client = orgNames[rfp.organizationId] ?? "Client";
          const sla = rfp.slaStatus ?? "on_track";
          return (
            <Link
              key={rfp.id}
              href={`/commercial/rfps/${rfp.id}`}
              className="block rounded-[10px] border border-line bg-paper p-4 transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted">{rfp.rfpCode}</div>
                  <div className="mt-1 font-medium text-ink">
                    {client} — {rfp.title}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {rfp.programmeType ?? "Programme"}
                    {rfp.paxCount ? ` · ${rfp.paxCount} pax` : ""}
                    {rfp.travelDates ? ` · ${rfp.travelDates}` : ""}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={workflowBadge(rfp.workflowStage)} label={RFP_WORKFLOW_LABELS[rfp.workflowStage] ?? rfp.workflowStage} />
                  <SlaIndicator status={slaIndicatorStatus(rfp.slaStatus)} label={slaLabel(rfp.slaDueAt, rfp.slaStatus)} />
                </div>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted">Budget</span>
                <span className="font-medium">{formatBudgetRange(rfp.budgetMin, rfp.budgetMax, rfp.currency)}</span>
              </div>
            </Link>
          );
        })}
        {token && !loading && rfps.length === 0 && !error && (
          <p className="text-sm text-muted">No active RFPs. Run demo seed or create one via the API.</p>
        )}
      </div>
    </>
  );
}
