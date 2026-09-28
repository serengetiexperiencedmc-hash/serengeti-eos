import { describe, expect, it } from "vitest";
import { computeCostTotals } from "./costing.js";
import { RFP_WORKFLOW_STAGES } from "./rfp.js";
import { programmeIsCommerciallyLocked } from "./programme.js";
import {
  clientFacingViewContainsInternalCommercial,
  composeH203ClientPrice,
  defaultProgrammePaymentMilestones,
  H203_APPROVED_MARGIN_FLOOR_PERCENT,
  H203_DEFAULT_DEPOSIT_PERCENT,
  H203_DEFAULT_MARKUP_PERCENT,
  H203_FILE_FEE_USD,
  H203_SAFARI_VEHICLE_MAX_PASSENGERS,
  H203_WON_LOST_OWNER,
  H203_WON_LOST_RECORD,
  h203MarginMeetsApprovedFloor,
  paymentMilestonesTotalOneHundred,
  principalMayAuthorizeMarginFloorException,
  programmeNightCount,
  requiredSafariVehicles,
  toClientFacingCommercialView,
} from "./h203-commercial-policy.js";

describe("H-203 authorized commercial policy", () => {
  it("applies 25% markup on supplier cost (~20% GM before fee) via computeCostTotals", () => {
    const core = computeCostTotals({
      lines: [{ category: "transport", lineTotal: 1000 }],
      markupPercent: H203_DEFAULT_MARKUP_PERCENT,
    });
    expect(core.totalCost).toBe(1000);
    expect(core.sellPrice).toBe(1250);
    expect(core.marginPercent).toBe(20);
    expect(H203_DEFAULT_MARKUP_PERCENT).toBe(25);
  });

  it("incorporates the USD 200 file fee into the client selling price without a separate client line", () => {
    const composed = composeH203ClientPrice({
      lines: [{ category: "transport", lineTotal: 1000 }],
      currency: "USD",
    });
    expect(composed.baseSellPrice).toBe(1250);
    expect(composed.fileFeeAmount).toBe(H203_FILE_FEE_USD);
    expect(composed.fileFeeIncorporatedIntoPrice).toBe(true);
    expect(composed.clientSellingPrice).toBe(1450);
    expect(composed.marginPercent).toBeCloseTo(31.03, 1);
    expect(composed.formula).toBe("kernel.computeCostTotals");
  });

  it("keeps a manual selling-price override as the final client price (fee recorded, not added twice)", () => {
    const composed = composeH203ClientPrice({
      lines: [{ category: "transport", lineTotal: 1000 }],
      currency: "USD",
      sellPriceOverride: 1600,
    });
    expect(composed.clientSellingPrice).toBe(1600);
    expect(composed.fileFeeAmount).toBe(200);
    expect(composed.fileFeeIncorporatedIntoPrice).toBe(false);
    expect(composed.sellPriceSource).toBe("sellPriceOverride");
  });

  it("enforces the approved 15% gross-margin floor and rejects sell-at-cost as a normal price", () => {
    expect(H203_APPROVED_MARGIN_FLOOR_PERCENT).toBe(15);
    expect(h203MarginMeetsApprovedFloor(20)).toBe(true);
    expect(h203MarginMeetsApprovedFloor(15)).toBe(true);
    expect(h203MarginMeetsApprovedFloor(14.99)).toBe(false);
    const atCost = composeH203ClientPrice({
      lines: [{ category: "transport", lineTotal: 1000 }],
      currency: "USD",
      sellPriceOverride: 1000,
    });
    expect(atCost.marginPercent).toBe(0);
    expect(h203MarginMeetsApprovedFloor(atCost.marginPercent)).toBe(false);
  });

  it("treats tax as a manual rate or amount and invents no statutory rate", () => {
    const none = composeH203ClientPrice({
      lines: [{ category: "transport", lineTotal: 1000 }],
      currency: "USD",
      taxMode: "none",
    });
    expect(none.taxAmount).toBe(0);
    const amount = composeH203ClientPrice({
      lines: [{ category: "transport", lineTotal: 1000 }],
      currency: "USD",
      taxMode: "amount",
      taxAmountEntered: 50,
    });
    expect(amount.taxAmount).toBe(50);
    expect(amount.clientSellingPrice).toBe(1500);
    const rate = composeH203ClientPrice({
      lines: [{ category: "transport", lineTotal: 1000 }],
      currency: "USD",
      taxMode: "rate",
      taxRatePercent: 10,
    });
    expect(rate.taxAmount).toBe(125);
    expect(rate.clientSellingPrice).toBe(1575);
  });

  it("does not fetch or invent FX", () => {
    const composed = composeH203ClientPrice({
      lines: [{ category: "transport", lineTotal: 1000 }],
      currency: "USD",
    });
    expect(composed).not.toHaveProperty("fxRate");
  });

  it("sanitizes client-facing commercial view", () => {
    const view = toClientFacingCommercialView({ currency: "USD", clientSellingPrice: 1450 });
    expect(view).toEqual({ currency: "USD", clientSellingPrice: 1450 });
    expect(clientFacingViewContainsInternalCommercial(view as unknown as Record<string, unknown>)).toBe(false);
    expect(
      clientFacingViewContainsInternalCommercial({
        clientSellingPrice: 1450,
        supplierCost: 1000,
        grossMarginPercent: 20,
        fileFeeAmount: 200,
      }),
    ).toBe(true);
  });

  it("derives night count from departure minus arrival", () => {
    expect(programmeNightCount("2026-06-10", "2026-06-24")).toBe(14);
    expect(programmeNightCount("2026-06-10", "2026-06-10")).toBe(0);
    expect(programmeNightCount("2026-06-10")).toBeUndefined();
  });

  it("defaults deposit 30% and 30/40/30 milestones totaling 100%", () => {
    expect(H203_DEFAULT_DEPOSIT_PERCENT).toBe(30);
    const milestones = defaultProgrammePaymentMilestones();
    expect(milestones.map((m) => m.percent)).toEqual([30, 40, 30]);
    expect(paymentMilestonesTotalOneHundred(milestones)).toBe(true);
  });

  it("uses 6-passenger safari vehicles and 6 guests per driver-guide", () => {
    expect(requiredSafariVehicles(6)).toBe(1);
    expect(requiredSafariVehicles(12)).toBe(2);
    expect(requiredSafariVehicles(18)).toBe(3);
    expect(requiredSafariVehicles(25)).toBe(5);
    expect(requiredSafariVehicles(60)).toBe(10);
    expect(H203_SAFARI_VEHICLE_MAX_PASSENGERS).toBe(6);
    expect(requiredSafariVehicles(7, H203_SAFARI_VEHICLE_MAX_PASSENGERS)).toBe(2);
  });

  it("keeps client label editable, final locked, won/lost on Opportunity/consultant, RFP stages unchanged", () => {
    expect(programmeIsCommerciallyLocked("client")).toBe(false);
    expect(programmeIsCommerciallyLocked("final")).toBe(true);
    expect(H203_WON_LOST_RECORD).toBe("opportunity");
    expect(H203_WON_LOST_OWNER).toBe("consultant");
    expect([...RFP_WORKFLOW_STAGES]).toEqual([
      "intake",
      "programme",
      "costing",
      "approval",
      "proposal",
      "sent",
      "closed",
    ]);
  });

  it("allows platform.admin to record a below-floor exception", () => {
    expect(
      principalMayAuthorizeMarginFloorException({
        id: "p1",
        tenantId: "t1",
        actorType: "Human",
        displayName: "Carol",
        status: "active",
        classificationClearance: "Restricted",
        roles: ["platform.admin"],
        permissions: [],
      }),
    ).toBe(true);
    expect(
      principalMayAuthorizeMarginFloorException({
        id: "p2",
        tenantId: "t1",
        actorType: "Human",
        displayName: "Alice",
        status: "active",
        classificationClearance: "Confidential",
        roles: ["finance.member"],
        permissions: [],
      }),
    ).toBe(false);
  });
});
