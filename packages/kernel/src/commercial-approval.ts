import type { Classification } from "./types.js";
import { marginMeetsFloor } from "./costing.js";

export type ComApprovalStatus = "pending" | "approved" | "rejected" | "cancelled";

export type ComApprovalGateType = "margin_floor" | "sell_threshold" | "standard_review";

export const DEFAULT_SELL_THRESHOLD_USD = 250_000;

export type ComApprovalRequest = {
  id: string;
  tenantId: string;
  requestCode: string;
  costSheetId: string;
  rfpId: string;
  programmeId: string;
  organizationId: string;
  status: ComApprovalStatus;
  gateType: ComApprovalGateType;
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
  classification: Classification;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export function buildApprovalRequestCode(sheetCode: string): string {
  return sheetCode.replace(/^CST-/i, "APR-");
}

export function evaluateCommercialApprovalGate(input: {
  marginPercent: number;
  marginFloorPercent: number;
  sellPrice: number;
  sellThresholdUsd?: number;
}): { gateType: ComApprovalGateType; gateReason: string } {
  const meetsFloor = marginMeetsFloor(input.marginPercent, input.marginFloorPercent);
  const threshold = input.sellThresholdUsd ?? DEFAULT_SELL_THRESHOLD_USD;

  if (!meetsFloor) {
    return {
      gateType: "margin_floor",
      gateReason: `Margin ${input.marginPercent.toFixed(1)}% is below the ${input.marginFloorPercent}% floor`,
    };
  }
  if (input.sellPrice >= threshold) {
    return {
      gateType: "sell_threshold",
      gateReason: `Sell price exceeds ${threshold.toLocaleString("en-US")} USD threshold — finance review required`,
    };
  }
  return {
    gateType: "standard_review",
    gateReason: "Standard finance review for commercial proposal",
  };
}

export function canRequestCommercialApproval(marginPercent: number, marginFloorPercent: number): boolean {
  return marginMeetsFloor(marginPercent, marginFloorPercent);
}

export function canDecideCommercialApproval(
  requesterId: string,
  deciderId: string,
): { allowed: boolean; reason?: string } {
  if (requesterId === deciderId) {
    return { allowed: false, reason: "sod_requester_cannot_decide" };
  }
  return { allowed: true };
}
