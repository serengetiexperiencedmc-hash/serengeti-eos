import { eosFetch } from "./eos-client";

export type CommercialApprovalRequest = {
  id: string;
  requestCode: string;
  costSheetId: string;
  rfpId: string;
  programmeId: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  gateType: string;
  gateReason: string;
  marginPercent: number;
  marginFloorPercent: number;
  totalCost: number;
  sellPrice: number;
  currency: string;
  marginMeetsFloor: boolean;
  requestedByPrincipalId: string;
  decidedByPrincipalId?: string;
  decidedAt?: string;
  decisionNotes?: string;
  createdAt: string;
};

export async function listCommercialApprovals(
  token: string,
  query?: { costSheetId?: string; rfpId?: string; status?: string },
) {
  const params = new URLSearchParams();
  if (query?.costSheetId) params.set("costSheetId", query.costSheetId);
  if (query?.rfpId) params.set("rfpId", query.rfpId);
  if (query?.status) params.set("status", query.status);
  const qs = params.toString();
  return eosFetch<{ items: CommercialApprovalRequest[] }>(
    `/v1/commercial-approvals${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function requestCommercialApproval(token: string, costSheetId: string, notes?: string) {
  return eosFetch<{ request: CommercialApprovalRequest }>("/v1/commercial-approvals/request", {
    token,
    method: "POST",
    body: JSON.stringify({ costSheetId, notes }),
  });
}

export async function decideCommercialApproval(
  token: string,
  id: string,
  outcome: "approved" | "rejected",
  notes?: string,
) {
  return eosFetch<{ request: CommercialApprovalRequest }>(`/v1/commercial-approvals/${id}/decision`, {
    token,
    method: "POST",
    body: JSON.stringify({ outcome, notes }),
  });
}

export function approvalStatusLabel(status: string): string {
  if (status === "pending") return "Awaiting Finance Approval";
  if (status === "approved") return "Finance Approved";
  if (status === "rejected") return "Finance Rejected";
  return status;
}
