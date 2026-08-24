import { eosFetch } from "./eos-client";
import { getCommercialSummary, getOperationsSummary, type CommercialAnalyticsSummary, type OpsAnalyticsSummary } from "./analytics-api";
import { listActivities } from "./crm-api";
import { fetchPipelineBoard } from "./pipeline-api";
import { listRfps, slaIndicatorStatus, slaLabel, type RfpSummary } from "./rfp-api";

export type CommercialLiveStats = {
  analytics: CommercialAnalyticsSummary;
  opsAnalytics: OpsAnalyticsSummary;
  pipelineBoardValue: number;
  pipelineBoardCount: number;

  suppliers: number;

  organizations: number;

  contacts: number;

  activities: number;

  accounts: number;

  recentActivities: Array<{

    id: string;

    subject: string;

    activityType: string;

    occurredAt: string;

    organizationId?: string;

  }>;

  organizationNames: Record<string, string>;

  actionRfps: Array<{

    id: string;

    client: string;

    programme: string;

    stage: "progress" | "review" | "urgent";

    sla: "on_track" | "at_risk" | "breached";

    slaIndicator: "on-track" | "at-risk" | "overdue";

    slaLabel: string;

    value: string;

    href: string;

  }>;

};



function rfpStageBadge(stage: string): "progress" | "review" | "urgent" {

  if (stage === "approval" || stage === "costing") return "review";

  if (stage === "intake") return "urgent";

  return "progress";

}



function mapActionRfp(rfp: RfpSummary, orgName: string): CommercialLiveStats["actionRfps"][number] {

  return {

    id: rfp.id,

    client: orgName,

    programme: [rfp.programmeType, rfp.paxCount ? `${rfp.paxCount} pax` : undefined].filter(Boolean).join(" · "),

    stage: rfpStageBadge(rfp.workflowStage),

    sla: rfp.slaStatus ?? "on_track",

    slaIndicator: slaIndicatorStatus(rfp.slaStatus),

    slaLabel: slaLabel(rfp.slaDueAt, rfp.slaStatus),

    value: new Intl.NumberFormat("en-US", { style: "currency", currency: rfp.currency ?? "USD", maximumFractionDigits: 0 }).format(

      rfp.budgetMax ?? rfp.budgetMin ?? 0,

    ),

    href: `/commercial/rfps/${rfp.id}`,

  };

}



export async function fetchCommercialLiveStats(token: string): Promise<CommercialLiveStats> {
  const [analyticsRes, opsAnalyticsRes, supHealth, crmHealth, activities, orgs, rfpList, board] = await Promise.all([
    getCommercialSummary(token),
    getOperationsSummary(token),
    eosFetch<{ suppliers: number }>("/v1/suppliers/health", { token }),
    eosFetch<{ entities: Record<string, number> }>("/v1/crm/health", { token }),
    listActivities(token, { limit: 5 }),
    eosFetch<{ items: Array<{ id: string; legalName: string; tradingName?: string }> }>(
      "/v1/crm/organizations",
      { token },
    ),
    listRfps(token, { status: "active" }),
    fetchPipelineBoard(token).catch(() => ({ columns: [] as Array<{ items: Array<{ estimatedValue?: number }> }> })),
  ]);

  const pipelineBoardCount = board.columns.reduce((sum, col) => sum + col.items.length, 0);
  const pipelineBoardValue = board.columns.reduce(
    (sum, col) => sum + col.items.reduce((s, o) => s + (o.estimatedValue ?? 0), 0),
    0,
  );



  const organizationNames: Record<string, string> = {};

  for (const org of orgs.items) {

    organizationNames[org.id] = org.tradingName ?? org.legalName;

  }



  const actionRfps = rfpList.items.slice(0, 5).map((rfp) =>

    mapActionRfp(rfp, organizationNames[rfp.organizationId] ?? "Client"),

  );



  return {
    analytics: analyticsRes.summary,
    opsAnalytics: opsAnalyticsRes.summary,
    pipelineBoardValue,
    pipelineBoardCount,

    suppliers: supHealth.suppliers,

    organizations: crmHealth.entities.organizations ?? 0,

    contacts: crmHealth.entities.contacts ?? 0,

    activities: crmHealth.entities.activities ?? 0,

    accounts: crmHealth.entities.accounts ?? 0,

    recentActivities: activities.items,

    organizationNames,

    actionRfps,

  };

}


