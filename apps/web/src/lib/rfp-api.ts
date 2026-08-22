import { eosFetch } from "./eos-client";

export type RfpSummary = {
  id: string;
  rfpCode: string;
  opportunityId: string;
  organizationId: string;
  title: string;
  workflowStage: string;
  status: string;
  programmeType?: string;
  paxCount?: number;
  travelDates?: string;
  destinations?: string;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  requirementsText?: string;
  slaDueAt?: string;
  slaStatus?: "on_track" | "at_risk" | "breached";
  assignedPrincipalId?: string;
  currentVersion: number;
  updatedAt: string;
};

export type RfpVersion = {
  id: string;
  versionNumber: number;
  summary: string;
  createdAt: string;
  createdByPrincipalId: string;
};

export const RFP_WORKFLOW_LABELS: Record<string, string> = {
  intake: "RFP Intake",
  programme: "Programme",
  costing: "Costing",
  approval: "Approval",
  proposal: "Proposal",
  sent: "Sent",
  closed: "Closed",
};

export function formatBudgetRange(min?: number, max?: number, currency = "USD"): string {
  if (min === undefined && max === undefined) return "—";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  if (min !== undefined && max !== undefined) return `${fmt(min)} – ${fmt(max)}`;
  if (min !== undefined) return fmt(min);
  return fmt(max!);
}

export function slaLabel(slaDueAt?: string, slaStatus?: string): string {
  if (!slaDueAt) return "No SLA";
  const due = new Date(slaDueAt);
  const hoursLeft = Math.max(0, Math.round((due.getTime() - Date.now()) / (1000 * 60 * 60)));
  if (slaStatus === "breached") return "SLA breached";
  if (hoursLeft < 24) return `SLA: ${hoursLeft}h remaining`;
  const daysLeft = Math.round(hoursLeft / 24);
  return `SLA: ${daysLeft}d remaining`;
}

export async function listRfps(token: string, query?: { status?: string }) {
  const params = new URLSearchParams();
  if (query?.status) params.set("status", query.status);
  const qs = params.toString();
  return eosFetch<{ items: RfpSummary[] }>(`/v1/rfps${qs ? `?${qs}` : ""}`, { token });
}

export async function getRfp(token: string, id: string) {
  return eosFetch<{ rfp: RfpSummary; versions: RfpVersion[] }>(`/v1/rfps/${id}`, { token });
}

export async function fetchRfpHealth(token: string) {
  return eosFetch<{ rfps: number }>("/v1/rfps/health", { token });
}

export function slaIndicatorStatus(status?: RfpSummary["slaStatus"]): "on-track" | "at-risk" | "overdue" {
  if (status === "at_risk") return "at-risk";
  if (status === "breached") return "overdue";
  return "on-track";
}
