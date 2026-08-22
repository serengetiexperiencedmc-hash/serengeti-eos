import { eosFetch } from "./eos-client";

export type CostSheetSummary = {
  id: string;
  sheetCode: string;
  programmeId: string;
  rfpId: string;
  currency: string;
  totalCost: number;
  sellPrice?: number;
  marginPercent: number;
  marginAmount: number;
  perPerson?: number;
  paxCount?: number;
  marginFloorPercent: number;
  marginMeetsFloor: boolean;
  categoryTotals: Record<string, number>;
};

export type CostLineItemView = {
  id: string;
  category: string;
  categoryLabel: string;
  description: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
};

export type CostSheetDetail = {
  sheet: CostSheetSummary;
  lineItems: CostLineItemView[];
};

export const COST_CATEGORY_LABELS: Record<string, string> = {
  accommodation: "Accommodation",
  transport: "Transport",
  activities: "Activities",
  av_events: "AV & Events",
  park_fees_misc: "Park Fees & Misc",
  other: "Other",
};

export function formatCost(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function getCostSheetByProgramme(token: string, programmeId: string) {
  return eosFetch<CostSheetDetail>(`/v1/costing/sheets/by-programme/${programmeId}`, { token });
}

export async function getCostSheetByRfp(token: string, rfpId: string) {
  const list = await eosFetch<{ items: CostSheetSummary[] }>(`/v1/costing/sheets?rfpId=${rfpId}`, { token });
  if (list.items.length === 0) throw new Error("no_cost_sheet");
  return eosFetch<CostSheetDetail>(`/v1/costing/sheets/${list.items[0].id}`, { token });
}

export async function fetchCostingHealth(token: string) {
  return eosFetch<{ sheets: number; lineItems: number }>("/v1/costing/health", { token });
}

export async function recalculateCostSheet(token: string, sheetId: string, sellPrice?: number) {
  return eosFetch<CostSheetDetail>(`/v1/costing/sheets/${sheetId}/recalculate`, {
    token,
    method: "POST",
    body: JSON.stringify(sellPrice !== undefined ? { sellPrice } : {}),
  });
}
