import { describe, expect, it } from "vitest";
import {
  canTransitionOpportunityStage,
  isValidOpportunityStage,
  opportunityCodePattern,
} from "./opportunity.js";
import { canTransitionRfpStage, computeSlaStatus, isValidRfpWorkflowStage, rfpCodePattern } from "./rfp.js";

describe("opportunity stage transitions", () => {
  it("validates stages", () => {
    expect(isValidOpportunityStage("new_qualified")).toBe(true);
    expect(isValidOpportunityStage("invalid")).toBe(false);
  });

  it("allows forward pipeline progression", () => {
    expect(canTransitionOpportunityStage("new_qualified", "rfp_received")).toBe(true);
    expect(canTransitionOpportunityStage("negotiation", "won")).toBe(true);
  });

  it("blocks transitions from terminal stages", () => {
    expect(canTransitionOpportunityStage("won", "negotiation")).toBe(false);
    expect(canTransitionOpportunityStage("lost", "new_qualified")).toBe(false);
  });

  it("allows lost from open stages and won only from negotiation", () => {
    expect(canTransitionOpportunityStage("new_qualified", "lost")).toBe(true);
    expect(canTransitionOpportunityStage("new_qualified", "won")).toBe(false);
    expect(canTransitionOpportunityStage("negotiation", "won")).toBe(true);
  });

  it("validates opportunity codes", () => {
    expect(opportunityCodePattern("OPP-2026-0847")).toBe(true);
    expect(opportunityCodePattern("bad")).toBe(false);
  });
});

describe("rfp workflow", () => {
  it("validates workflow stages", () => {
    expect(isValidRfpWorkflowStage("intake")).toBe(true);
    expect(isValidRfpWorkflowStage("foo")).toBe(false);
  });

  it("allows workflow progression", () => {
    expect(canTransitionRfpStage("intake", "programme")).toBe(true);
    expect(canTransitionRfpStage("proposal", "sent")).toBe(true);
  });

  it("computes SLA status", () => {
    const now = new Date("2026-08-22T12:00:00Z");
    expect(computeSlaStatus("2026-08-25T12:00:00Z", now)).toBe("on_track");
    expect(computeSlaStatus("2026-08-22T18:00:00Z", now)).toBe("at_risk");
    expect(computeSlaStatus("2026-08-21T12:00:00Z", now)).toBe("breached");
  });

  it("validates rfp codes", () => {
    expect(rfpCodePattern("RFP-2026-0847")).toBe(true);
  });
});
