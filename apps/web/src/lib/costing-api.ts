import { eosFetch } from "./eos-client";

export type ProgrammeFinancialSummary = {
  programmeId: string;
  rfpId: string;
  costSheetId: string;
  currency: string;
  financialStatus: string;
  supplierCost: number;
  clientSellingPrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  formula: string;
  sellPriceSource: string;
};

export type CostSheetSummary = {
  id: string;
  sheetCode: string;
  programmeId: string;
  rfpId: string;
  status: string;
  currency: string;
  totalCost: number;
  sellPrice?: number;
  clientSellingPrice?: number;
  markupPercent?: number;
  marginPercent: number;
  marginAmount: number;
  perPerson?: number;
  paxCount?: number;
  marginFloorPercent: number;
  marginMeetsFloor: boolean;
  categoryTotals: Record<string, number>;
  financialSummary?: ProgrammeFinancialSummary;
  clientFacing?: { currency: string; clientSellingPrice: number };
  fileFeeAmount?: number;
  taxMode?: string;
  taxAmount?: number;
  fxCurrencyPair?: string;
  fxRate?: number;
  fxAsOfDate?: string;
  fxSourceReference?: string;
};

export type CostLineItemView = {
  id: string;
  category: string;
  categoryLabel: string;
  description: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
  currency?: string;
  programmeItemId?: string;
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

export async function createCostSheet(
  token: string,
  input: { programmeId: string; sellPrice?: number; paxCount?: number },
) {
  return eosFetch<CostSheetDetail>("/v1/costing/sheets", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function addCostLineItem(
  token: string,
  sheetId: string,
  input: { category: string; description: string; unitCost: number; quantity?: number; programmeItemId?: string },
) {
  return eosFetch<{ line: CostLineItemView; sheet: CostSheetSummary }>(`/v1/costing/sheets/${sheetId}/line-items`, {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listCostSheets(token: string, query?: { programmeId?: string; rfpId?: string }) {
  const params = new URLSearchParams();
  if (query?.programmeId) params.set("programmeId", query.programmeId);
  if (query?.rfpId) params.set("rfpId", query.rfpId);
  const qs = params.toString();
  return eosFetch<{ items: CostSheetSummary[] }>(`/v1/costing/sheets${qs ? `?${qs}` : ""}`, { token });
}

export async function getProgrammeFinancialSummary(token: string, programmeId: string) {
  return eosFetch<{ financialSummary: ProgrammeFinancialSummary; sheet: CostSheetSummary }>(
    `/v1/costing/sheets/by-programme/${programmeId}/summary`,
    { token },
  );
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
