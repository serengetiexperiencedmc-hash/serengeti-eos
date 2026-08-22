import { eosFetch } from "./eos-client";
import { formatCost } from "./costing-api";

export type ProposalSummary = {
  id: string;
  proposalCode: string;
  rfpId: string;
  organizationId: string;
  title: string;
  status: string;
  currency: string;
  totalCost: number;
  sellPrice: number;
  marginPercent: number;
  paxCount?: number;
  sentAt?: string;
  clientViewedAt?: string;
  currentVersion: number;
  updatedAt: string;
};

export type ProposalDetail = {
  proposal: ProposalSummary;
  programme?: {
    id: string;
    title: string;
    days: Array<{
      dayNumber: number;
      title: string;
      location?: string;
      items: Array<{ startTime?: string; title: string; description?: string }>;
    }>;
  };
  costLines: Array<{ category: string; description: string; lineTotal: number; currency: string }>;
  versions: Array<{
    id: string;
    versionNumber: number;
    summary: string;
    snapshot: Record<string, unknown>;
    createdAt: string;
  }>;
};

export const PROPOSAL_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
};

export function proposalStatusBadge(status: string): "draft" | "progress" | "review" | "won" {
  if (status === "sent") return "progress";
  if (status === "accepted") return "won";
  if (status === "pending_approval" || status === "approved") return "review";
  return "draft";
}

export function formatProposalValue(proposal: ProposalSummary): string {
  return formatCost(proposal.sellPrice, proposal.currency);
}

export async function listProposals(token: string, query?: { rfpId?: string; status?: string }) {
  const params = new URLSearchParams();
  if (query?.rfpId) params.set("rfpId", query.rfpId);
  if (query?.status) params.set("status", query.status);
  const qs = params.toString();
  return eosFetch<{ items: ProposalSummary[] }>(`/v1/proposals${qs ? `?${qs}` : ""}`, { token });
}

export async function getProposal(token: string, id: string) {
  return eosFetch<ProposalDetail>(`/v1/proposals/${id}`, { token });
}

export async function getProposalByRfp(token: string, rfpId: string) {
  return eosFetch<ProposalDetail>(`/v1/proposals/by-rfp/${rfpId}`, { token });
}

export async function generateProposal(token: string, rfpId: string, title?: string) {
  return eosFetch<ProposalDetail>("/v1/proposals", {
    token,
    method: "POST",
    body: JSON.stringify({ rfpId, ...(title ? { title } : {}) }),
  });
}

export async function transitionProposal(token: string, id: string, toStatus: string) {
  return eosFetch<{ proposal: ProposalSummary }>(`/v1/proposals/${id}/transitions`, {
    token,
    method: "POST",
    body: JSON.stringify({ toStatus }),
  });
}

export async function fetchProposalHealth(token: string) {
  return eosFetch<{ proposals: number }>("/v1/proposals/health", { token });
}
