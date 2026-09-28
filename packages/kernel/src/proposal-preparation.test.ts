import { describe, expect, it } from "vitest";
import { RFP_WORKFLOW_STAGES } from "./rfp.js";
import {
  listProposalPreparationGaps,
  proposalPreparationReadiness,
  PROPOSAL_PREPARATION_KIND,
} from "./proposal-preparation.js";

describe("proposal preparation kernel", () => {
  it("is an internal working draft kind, not an RFP or C8 status", () => {
    expect(PROPOSAL_PREPARATION_KIND).toBe("internal_working_draft");
  });

  it("surfaces missing programme/cost sheet instead of inventing figures", () => {
    const gaps = listProposalPreparationGaps({
      hasProgramme: false,
      hasCostSheet: false,
      hasRecordedNumericVersion: false,
    });
    expect(gaps.some((g) => g.code === "programme_missing")).toBe(true);
    expect(gaps.some((g) => g.code === "cost_sheet_missing")).toBe(true);
    expect(proposalPreparationReadiness(gaps)).toBe("incomplete");
  });

  it("does not invent tax/commission/FX/markup and flags sell=cost as existing formula behavior", () => {
    const gaps = listProposalPreparationGaps({
      hasProgramme: true,
      hasCostSheet: true,
      sellPriceSource: "equalsSupplierCost",
      hasRecordedNumericVersion: true,
    });
    expect(proposalPreparationReadiness(gaps)).toBe("internal_working_draft");
    expect(gaps.some((g) => g.code === "client_price_equals_supplier_cost")).toBe(true);
    expect(gaps.some((g) => g.code === "tax_is_manual_input")).toBe(true);
    expect(gaps.some((g) => g.code === "file_fee_internal_only")).toBe(true);
    expect(gaps.some((g) => g.code === "won")).toBe(false);
    expect(gaps.some((g) => g.code.includes("won") || g.code.includes("lost"))).toBe(false);
    expect(RFP_WORKFLOW_STAGES).not.toContain("proposal_draft");
    expect(RFP_WORKFLOW_STAGES).not.toContain("proposal_final");
    expect(RFP_WORKFLOW_STAGES).not.toContain("won");
    expect(RFP_WORKFLOW_STAGES).not.toContain("lost");
  });
});
