import { describe, expect, it } from "vitest";
import { computeAverageMargin, computeHandoverProgress, computeWinRate } from "./analytics.js";
import { canPublishManifest } from "./ops-manifest.js";
import { canTransitionSupplierConfirmation } from "./ops-supplier-confirmation.js";

describe("ops kernel", () => {
  it("allows supplier confirmation confirm transition", () => {
    expect(canTransitionSupplierConfirmation("requested", "confirmed").allowed).toBe(true);
    expect(canTransitionSupplierConfirmation("confirmed", "declined").allowed).toBe(false);
  });

  it("requires entries before manifest publish", () => {
    expect(canPublishManifest("draft", 0).allowed).toBe(false);
    expect(canPublishManifest("draft", 3).allowed).toBe(true);
  });
});

describe("analytics kernel", () => {
  it("computes win rate and average margin", () => {
    expect(computeWinRate(1, 4)).toBe(25);
    expect(computeAverageMargin([30.4, 28.5])).toBe(29.5);
  });

  it("computes handover progress", () => {
    expect(computeHandoverProgress(1, 2)).toBe(50);
    expect(computeHandoverProgress(0, 0)).toBe(0);
  });
});
