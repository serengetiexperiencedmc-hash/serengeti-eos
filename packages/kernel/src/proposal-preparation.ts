import type { ProgrammeFinancialSummary } from "./costing.js";

/** Derived internal assembly only. Not an RFP stage and not a C8 proposal status. */
export const PROPOSAL_PREPARATION_KIND = "internal_working_draft" as const;
export type ProposalPreparationKind = typeof PROPOSAL_PREPARATION_KIND;

export type ProposalPreparationReadiness = "incomplete" | "internal_working_draft";

export type ProposalPreparationGap = {
  code: string;
  requiredForClientRelease: boolean;
  message: string;
};

export type ProposalPreparationGapInput = {
  hasProgramme: boolean;
  hasCostSheet: boolean;
  sellPriceSource?: ProgrammeFinancialSummary["sellPriceSource"];
  hasRecordedNumericVersion: boolean;
  taxSupplied?: boolean;
  fxSupplied?: boolean;
  currency?: string;
};

const POLICY_NOTES: ProposalPreparationGap[] = [
  {
    code: "tax_is_manual_input",
    requiredForClientRelease: false,
    message: "Tax is a manual commercial input. No statutory tax rate is invented.",
  },
  {
    code: "fx_is_manual_input",
    requiredForClientRelease: false,
    message: "FX is a manual input (pair, rate, as-of date, source). No external FX lookup is performed.",
  },
  {
    code: "file_fee_internal_only",
    requiredForClientRelease: false,
    message: "The US$200 file fee is incorporated into the client selling price and must not appear as a client-facing line.",
  },
];

export function listProposalPreparationGaps(input: ProposalPreparationGapInput): ProposalPreparationGap[] {
  const gaps: ProposalPreparationGap[] = [];
  if (!input.hasProgramme) {
    gaps.push({
      code: "programme_missing",
      requiredForClientRelease: true,
      message: "No programme is linked to this RFP.",
    });
  }
  if (!input.hasCostSheet) {
    gaps.push({
      code: "cost_sheet_missing",
      requiredForClientRelease: true,
      message: "No programme cost sheet exists. Supplier cost and client selling price cannot be shown.",
    });
  }
  if (input.hasCostSheet && input.sellPriceSource === "equalsSupplierCost") {
    gaps.push({
      code: "client_price_equals_supplier_cost",
      requiredForClientRelease: true,
      message: "Client selling price equals supplier cost. That is below the authorized 15% gross-margin floor and is not a normal permitted price.",
    });
  }
  if (input.hasProgramme && !input.hasRecordedNumericVersion) {
    gaps.push({
      code: "no_recorded_programme_snapshot",
      requiredForClientRelease: false,
      message: "No numeric programme snapshot has been recorded yet. The live programme commercial label is shown instead.",
    });
  }
  gaps.push(...POLICY_NOTES);
  gaps.push({
    code: "client_issued_proposal_not_generated",
    requiredForClientRelease: true,
    message: "This assembly is an internal working draft. PDF, email, client dispatch, and C8 generate/send remain deferred.",
  });
  return gaps;
}

export function proposalPreparationReadiness(
  gaps: ProposalPreparationGap[],
): ProposalPreparationReadiness {
  const blocking = gaps.some((gap) => gap.code === "programme_missing" || gap.code === "cost_sheet_missing");
  return blocking ? "incomplete" : "internal_working_draft";
}
