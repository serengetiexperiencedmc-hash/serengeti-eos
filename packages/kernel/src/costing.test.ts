import { describe, expect, it } from "vitest";
import {
  buildCostSheetCode,
  computeCostTotals,
  computeLineTotal,
  marginMeetsFloor,
  programmeFinancialSummaryFromTotals,
} from "./costing.js";

describe("costing kernel", () => {
  it("computes line totals", () => {
    expect(computeLineTotal(65, 599)).toBe(38935);
  });

  it("computes sheet totals with sell override matching demo seed", () => {
    const result = computeCostTotals({
      lines: [
        { category: "accommodation", lineTotal: 86400 },
        { category: "transport", lineTotal: 32200 },
        { category: "activities", lineTotal: 38935 },
        { category: "av_events", lineTotal: 18500 },
        { category: "park_fees_misc", lineTotal: 22365 },
      ],
      sellPriceOverride: 285000,
      paxCount: 65,
    });
    expect(result.totalCost).toBe(198400);
    expect(result.sellPrice).toBe(285000);
    expect(result.marginPercent).toBe(30.39);
    expect(result.perPerson).toBe(4384.62);
    expect(result.categoryTotals.accommodation).toBe(86400);
  });

  it("builds cost sheet code from programme code", () => {
    expect(buildCostSheetCode("PRG-2026-0847")).toBe("CST-2026-0847");
  });

  it("checks margin floor", () => {
    expect(marginMeetsFloor(30.4, 20)).toBe(true);
    expect(marginMeetsFloor(18, 20)).toBe(false);
  });

  it("separates supplier cost from client selling price using computeCostTotals", () => {
    const totals = computeCostTotals({
      lines: [{ category: "transport", lineTotal: 1000 }],
      sellPriceOverride: 1300,
    });
    const summary = programmeFinancialSummaryFromTotals(
      {
        id: "sheet-1",
        programmeId: "prg-1",
        rfpId: "rfp-1",
        currency: "USD",
        status: "draft",
        sellPrice: 1300,
      },
      totals,
    );
    expect(summary.supplierCost).toBe(1000);
    expect(summary.clientSellingPrice).toBe(1300);
    expect(summary.grossProfit).toBe(300);
    expect(summary.formula).toBe("kernel.computeCostTotals");
    expect(summary.sellPriceSource).toBe("sellPriceOverride");
  });
});
