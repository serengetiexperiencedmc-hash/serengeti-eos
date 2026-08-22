import type { Classification } from "./types.js";

export type CostSheetStatus = "draft" | "active" | "archived";

export const COST_LINE_CATEGORIES = [
  "accommodation",
  "transport",
  "activities",
  "av_events",
  "park_fees_misc",
  "other",
] as const;

export type CostLineCategory = (typeof COST_LINE_CATEGORIES)[number];

export const COST_LINE_CATEGORY_LABELS: Record<CostLineCategory, string> = {
  accommodation: "Accommodation",
  transport: "Transport",
  activities: "Activities",
  av_events: "AV & Events",
  park_fees_misc: "Park Fees & Misc",
  other: "Other",
};

export function isValidCostLineCategory(value: string): value is CostLineCategory {
  return (COST_LINE_CATEGORIES as readonly string[]).includes(value);
}

export type CostSheet = {
  id: string;
  tenantId: string;
  sheetCode: string;
  programmeId: string;
  rfpId: string;
  opportunityId: string;
  organizationId: string;
  status: CostSheetStatus;
  currency: string;
  markupPercent?: number;
  sellPrice?: number;
  marginFloorPercent: number;
  totalCost: number;
  marginPercent: number;
  marginAmount: number;
  perPerson?: number;
  paxCount?: number;
  currentVersion: number;
  classification: Classification;
  version: number;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type CostLineItem = {
  id: string;
  tenantId: string;
  costSheetId: string;
  category: CostLineCategory;
  description: string;
  quantity: number;
  unitCost: number;
  currency: string;
  lineTotal: number;
  supplierId?: string;
  supplierRateId?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CostSheetVersion = {
  id: string;
  tenantId: string;
  costSheetId: string;
  versionNumber: number;
  summary: string;
  totalCost: number;
  sellPrice: number;
  marginPercent: number;
  lineCount: number;
  createdAt: string;
  createdByPrincipalId: string;
};

export function computeLineTotal(quantity: number, unitCost: number): number {
  return Math.round(quantity * unitCost * 100) / 100;
}

export type CostTotalsInput = {
  lines: Array<{ category: CostLineCategory; lineTotal: number }>;
  markupPercent?: number;
  sellPriceOverride?: number;
  paxCount?: number;
};

export type CostTotalsResult = {
  totalCost: number;
  sellPrice: number;
  marginPercent: number;
  marginAmount: number;
  perPerson?: number;
  categoryTotals: Record<CostLineCategory, number>;
};

export function computeCostTotals(input: CostTotalsInput): CostTotalsResult {
  const categoryTotals = Object.fromEntries(COST_LINE_CATEGORIES.map((c) => [c, 0])) as Record<
    CostLineCategory,
    number
  >;

  let totalCost = 0;
  for (const line of input.lines) {
    totalCost += line.lineTotal;
    categoryTotals[line.category] = Math.round((categoryTotals[line.category] + line.lineTotal) * 100) / 100;
  }
  totalCost = Math.round(totalCost * 100) / 100;

  let sellPrice: number;
  if (input.sellPriceOverride !== undefined) {
    sellPrice = Math.round(input.sellPriceOverride * 100) / 100;
  } else if (input.markupPercent !== undefined) {
    sellPrice = Math.round(totalCost * (1 + input.markupPercent / 100) * 100) / 100;
  } else {
    sellPrice = totalCost;
  }

  const marginAmount = Math.round((sellPrice - totalCost) * 100) / 100;
  const marginPercent = sellPrice > 0 ? Math.round((marginAmount / sellPrice) * 10000) / 100 : 0;
  const perPerson =
    input.paxCount && input.paxCount > 0 ? Math.round((sellPrice / input.paxCount) * 100) / 100 : undefined;

  return { totalCost, sellPrice, marginPercent, marginAmount, perPerson, categoryTotals };
}

export function buildCostSheetCode(programmeCode: string): string {
  return programmeCode.replace(/^PRG-/i, "CST-");
}

export function marginMeetsFloor(marginPercent: number, floorPercent: number): boolean {
  return marginPercent >= floorPercent;
}
