import { describe, expect, it } from "vitest";
import {
  buildApprovalRequestCode,
  canDecideCommercialApproval,
  canRequestCommercialApproval,
  evaluateCommercialApprovalGate,
} from "./commercial-approval.js";

describe("commercial approval kernel", () => {
  it("builds approval request code from cost sheet code", () => {
    expect(buildApprovalRequestCode("CST-2026-0847")).toBe("APR-2026-0847");
  });

  it("evaluates sell threshold gate for high-value deals", () => {
    const gate = evaluateCommercialApprovalGate({
      marginPercent: 30.4,
      marginFloorPercent: 20,
      sellPrice: 285000,
    });
    expect(gate.gateType).toBe("sell_threshold");
  });

  it("evaluates margin floor gate when below floor", () => {
    const gate = evaluateCommercialApprovalGate({
      marginPercent: 15,
      marginFloorPercent: 20,
      sellPrice: 100000,
    });
    expect(gate.gateType).toBe("margin_floor");
  });

  it("blocks request when margin below floor", () => {
    expect(canRequestCommercialApproval(15, 20)).toBe(false);
    expect(canRequestCommercialApproval(25, 20)).toBe(true);
  });

  it("enforces SoD on approval decision", () => {
    expect(canDecideCommercialApproval("a", "a").allowed).toBe(false);
    expect(canDecideCommercialApproval("a", "b").allowed).toBe(true);
  });
});
