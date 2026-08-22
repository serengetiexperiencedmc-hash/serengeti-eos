"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, PageHeader } from "@/components/commercial/ui";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import {
  fetchPipelineBoard,
  formatCurrency,
  type PipelineBoardColumn,
} from "@/lib/pipeline-api";

function stageTag(stage: string): { tag: string; tagType: "sla" | "badge" } {
  if (stage === "proposal_sent") return { tag: "Sent", tagType: "badge" };
  if (stage === "negotiation") return { tag: "Approval", tagType: "badge" };
  if (stage === "rfp_received") return { tag: "Building", tagType: "badge" };
  if (stage === "won") return { tag: "Confirmed", tagType: "badge" };
  return { tag: "Draft", tagType: "badge" };
}

export default function PipelinePage() {
  const { token, ready } = useEosSession();
  const [columns, setColumns] = useState<PipelineBoardColumn[]>([]);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setColumns([]);
      setOrgs([]);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([fetchPipelineBoard(token), listOrganizations(token)])
      .then(([board, orgList]) => {
        setColumns(board.columns);
        setOrgs(orgList.items);
      })
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load pipeline");
        setColumns([]);
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

  const totalValue = useMemo(
    () =>
      columns.reduce(
        (sum, col) =>
          sum + col.items.reduce((s, o) => s + (o.estimatedValue ?? 0), 0),
        0,
      ),
    [columns],
  );
  const totalCount = useMemo(
    () => columns.reduce((sum, col) => sum + col.items.length, 0),
    [columns],
  );

  const subtitle =
    token && !loading && columns.length > 0
      ? `${totalCount} active opportunities · ${formatCurrency(totalValue)} total value`
      : token && loading
        ? "Loading pipeline…"
        : token
          ? "No opportunities yet — run demo seed or create one"
          : "Sign in to view live pipeline data";

  return (
    <>
      <PageHeader
        eyebrow="Sales Pipeline"
        title="Opportunity Pipeline"
        subtitle={subtitle}
        actions={<Btn disabled={!token}>+ New Opportunity</Btn>}
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {!ready && (
        <p className="text-sm text-muted">Checking session…</p>
      )}

      {ready && !token && (
        <p className="text-sm text-muted">Use the dev sign-in panel to load the pipeline board from the API.</p>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        {(token && columns.length > 0 ? columns : []).map((col) => (
          <div key={col.stage} className="flex flex-col rounded-[10px] bg-sand p-3">
            <div className="mb-3 flex items-center justify-between px-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{col.label}</h4>
              <span className="rounded-full bg-paper px-2 py-0.5 text-[0.7rem] text-muted">{col.count}</span>
            </div>
            {col.items.map((opp) => {
              const client = orgNames[opp.organizationId] ?? opp.title;
              const { tag, tagType } = stageTag(opp.stage);
              return (
                <div
                  key={opp.id}
                  className="mb-2 cursor-pointer rounded-md border border-line bg-paper p-3.5 transition hover:-translate-y-px hover:shadow-md"
                >
                  <div className="mb-1 text-sm font-medium text-ink">{client}</div>
                  <div className="mb-2 text-xs text-muted">{opp.programmeSummary ?? opp.title}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gold-deep">
                      {formatCurrency(opp.estimatedValue, opp.currency)}
                    </span>
                    {tagType === "badge" ? (
                      <Badge variant="draft" label={tag} />
                    ) : (
                      <span className="text-success">{tag}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
