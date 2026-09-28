import { describe, expect, it } from "vitest";
import { DEFAULT_CRM_ORGANIZATION_TYPE_KEYS } from "./crm.js";
import { OPPORTUNITY_STAGES } from "./opportunity.js";
import { RFP_WORKFLOW_STAGES } from "./rfp.js";
import { evaluatePathBCommercialApproval } from "./commercial-approval.js";
import {
  COMMERCIAL_ACCOUNT_TYPE_KEYS,
  COMMERCIAL_ACCOUNT_TYPE_LABELS,
  COMMERCIAL_CHANNEL_KEYS,
  COMMERCIAL_MARKET_KEYS,
  COMMERCIAL_SOURCE_KEYS,
  LOSS_REASON_CODES,
  LOSS_REASON_LABELS,
  MAX_SECONDARY_COMMERCIAL_SOURCES,
  OPPORTUNITY_STAGE_NEW_QUALIFIED,
  PATH_B_EXCEPTIONAL_APPROVAL_CATEGORIES,
  PATH_B_EXCEPTIONAL_APPROVAL_LABELS,
  PCO_ACCOUNT_TYPE,
  QUALIFICATION_CONDITION_KEYS,
  QUALIFICATION_STATUSES,
  SUPPLIER_RATE_SOURCE_CLASSES,
  SUPPLIER_RATE_TYPE_KEYS,
  allMandatoryQualificationConditionsMet,
  canSendProposalAsOwner,
  defaultFollowUpOwnerPrincipalId,
  emptyQualificationConditions,
  evaluatePathBApprovalRequirement,
  isCommercialAccountType,
  isCommercialChannel,
  isCommercialMarket,
  isCommercialSource,
  isOr01Qualified,
  isPcoAccountType,
  isQualificationStatus,
  isSupplierRateValidityCurrent,
  validateClosedLostReasons,
  validateSourceChannelSet,
} from "./commercial-contract.js";

const NUMERICAL_CPR_PATTERN = /250\s*,?\s*000|250000|250_000|\b20\s*%|\b0\.20\b/;

describe("F2-I1 commercial contract", () => {
  it("represents PCO as a distinct account type without folding it into the CRM seed keys", () => {
    expect(COMMERCIAL_ACCOUNT_TYPE_KEYS).toContain(PCO_ACCOUNT_TYPE);
    expect(isPcoAccountType("pco")).toBe(true);
    expect(isCommercialAccountType("pco")).toBe(true);
    expect(COMMERCIAL_ACCOUNT_TYPE_LABELS.pco).toBe("PCO");
    expect(DEFAULT_CRM_ORGANIZATION_TYPE_KEYS.includes("pco" as never)).toBe(false);
    expect(COMMERCIAL_ACCOUNT_TYPE_KEYS).toHaveLength(11);
  });

  it("keeps market and account type as separate catalogues", () => {
    expect(isCommercialMarket("south_africa")).toBe(true);
    expect(isCommercialAccountType("south_africa")).toBe(false);
    expect(isCommercialMarket("pco")).toBe(false);
    expect(isCommercialAccountType("incentive_house_agency")).toBe(true);
    expect(COMMERCIAL_MARKET_KEYS).toHaveLength(15);
    expect(COMMERCIAL_MARKET_KEYS).not.toEqual(COMMERCIAL_ACCOUNT_TYPE_KEYS as unknown as typeof COMMERCIAL_MARKET_KEYS);
  });

  it("treats qualification as independent of workflow stage", () => {
    expect(OPPORTUNITY_STAGES).toContain(OPPORTUNITY_STAGE_NEW_QUALIFIED);
    expect(isQualificationStatus("new_qualified")).toBe(false);
    expect(isOr01Qualified("not_yet_assessed")).toBe(false);
    expect(isOr01Qualified("qualified")).toBe(true);
    expect(QUALIFICATION_STATUSES).toEqual(["not_yet_assessed", "qualified", "not_qualified"]);
    expect(RFP_WORKFLOW_STAGES.includes("qualified" as never)).toBe(false);
    expect(QUALIFICATION_CONDITION_KEYS).not.toContain("budget");
    const conditions = emptyQualificationConditions();
    expect(allMandatoryQualificationConditionsMet(conditions)).toBe(false);
    for (const key of QUALIFICATION_CONDITION_KEYS) conditions[key] = true;
    expect(allMandatoryQualificationConditionsMet(conditions)).toBe(true);
  });

  it("represents LR-01–LR-12 exactly, with primary vs contributing distinction", () => {
    expect(LOSS_REASON_CODES).toEqual([
      "LR-01",
      "LR-02",
      "LR-03",
      "LR-04",
      "LR-05",
      "LR-06",
      "LR-07",
      "LR-08",
      "LR-09",
      "LR-10",
      "LR-11",
      "LR-12",
    ]);
    expect(Object.keys(LOSS_REASON_LABELS)).toEqual(LOSS_REASON_CODES);
    expect(validateClosedLostReasons({ primary: "LR-01", contributing: ["LR-02"] }).ok).toBe(true);
    expect(validateClosedLostReasons({ primary: "LR-12" }).ok).toBe(false);
    expect(
      validateClosedLostReasons({ primary: "LR-12", otherExplanation: "Client did not specify" }).ok,
    ).toBe(true);
    expect(validateClosedLostReasons({ primary: "LR-01", contributing: ["LR-01"] }).ok).toBe(false);
  });

  it("keeps SOURCE and CHANNEL as distinct catalogues", () => {
    expect(isCommercialSource("email")).toBe(false);
    expect(isCommercialChannel("email")).toBe(true);
    expect(isCommercialSource("existing_client_repeat")).toBe(true);
    expect(isCommercialChannel("existing_client_repeat")).toBe(false);
    expect(isCommercialSource("linkedin")).toBe(true);
    expect(isCommercialChannel("linkedin")).toBe(true);
    expect(MAX_SECONDARY_COMMERCIAL_SOURCES).toBe(2);
    expect(
      validateSourceChannelSet({
        primarySource: "referral",
        secondarySources: ["linkedin", "website_organic"],
        channel: "email",
      }).ok,
    ).toBe(true);
    expect(
      validateSourceChannelSet({
        primarySource: "referral",
        secondarySources: ["linkedin", "website_organic", "corporate_direct"],
        channel: "email",
      }).ok,
    ).toBe(false);
  });

  it("defines Path B approval as qualitative categories with no numerical CPR", () => {
    expect(PATH_B_EXCEPTIONAL_APPROVAL_CATEGORIES).toHaveLength(8);
    const labels = Object.values(PATH_B_EXCEPTIONAL_APPROVAL_LABELS).join(" ");
    const keys = PATH_B_EXCEPTIONAL_APPROVAL_CATEGORIES.join(" ");
    expect(NUMERICAL_CPR_PATTERN.test(labels)).toBe(false);
    expect(NUMERICAL_CPR_PATTERN.test(keys)).toBe(false);
    expect(evaluatePathBApprovalRequirement([]).required).toBe(false);
    const required = evaluatePathBApprovalRequirement(["exceptional_discounting", "strategic_high_risk_accounts"]);
    expect(required.required).toBe(true);
    expect(required.categories).toEqual(["exceptional_discounting", "strategic_high_risk_accounts"]);
    expect(evaluatePathBCommercialApproval(["unusual_payment_credit"]).required).toBe(true);
  });

  it("does not introduce 250k/20% into the F2 contract module", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(new URL("./commercial-contract.ts", import.meta.url), "utf8"),
    );
    expect(NUMERICAL_CPR_PATTERN.test(source)).toBe(false);
    expect(source.includes("DEFAULT_SELL_THRESHOLD")).toBe(false);
  });

  it("establishes supplier-rate identity catalogues without FX conversion", () => {
    expect(SUPPLIER_RATE_SOURCE_CLASSES).toHaveLength(5);
    expect(SUPPLIER_RATE_TYPE_KEYS).toEqual([
      "negotiated_contracted",
      "trade_net",
      "public",
      "promotional",
      "quoted_ad_hoc",
    ]);
    expect(
      isSupplierRateValidityCurrent(
        { validFrom: "2026-01-01", validTo: "2026-12-31" },
        "2026-06-01",
      ),
    ).toBe(true);
    expect(
      isSupplierRateValidityCurrent(
        { validFrom: "2026-01-01", validTo: "2026-03-31" },
        "2026-06-01",
      ),
    ).toBe(false);
  });

  it("defaults follow-up ownership to the opportunity owner and gates send on owner plus Path B approval", () => {
    expect(defaultFollowUpOwnerPrincipalId("owner-1")).toBe("owner-1");
    expect(
      canSendProposalAsOwner({
        senderPrincipalId: "owner-1",
        opportunityOwnerPrincipalId: "owner-1",
        exceptionalApprovalRequired: true,
        exceptionalApprovalGranted: false,
      }),
    ).toBe(false);
    expect(
      canSendProposalAsOwner({
        senderPrincipalId: "owner-1",
        opportunityOwnerPrincipalId: "owner-1",
        exceptionalApprovalRequired: true,
        exceptionalApprovalGranted: true,
      }),
    ).toBe(true);
  });
});
