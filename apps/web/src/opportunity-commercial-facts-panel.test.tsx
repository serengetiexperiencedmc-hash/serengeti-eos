import { describe, expect, it } from "vitest";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { OpportunityCommercialFactsPanel } from "./components/commercial/OpportunityCommercialFactsPanel";
import {
  commercialFactsCanWrite,
  isControlledDevtestResidue,
  mapCommercialFactsPutFailure,
  persistenceCaption,
  QUALIFICATION_CONDITION_LABELS,
  type OpportunityCommercialFacts,
} from "./lib/commercial-facts-api";
import { EosApiError } from "./lib/eos-client";

const facts: OpportunityCommercialFacts = {
  opportunityId: "opp-1",
  workflowStage: "new_qualified",
  opportunityStatus: "open",
  qualificationStatus: "not_yet_assessed",
  qualificationIsIndependentOfWorkflowStage: true,
  newQualifiedStageIsNotQualification: true,
  or01Qualified: false,
  qualificationConditions: Object.fromEntries(Object.keys(QUALIFICATION_CONDITION_LABELS).map((key) => [key, false])),
  qualificationEvidenceRefs: [],
  ownerPrincipalId: "owner-1",
  intakeOwnerPrincipalId: "owner-1",
  followUpOwnerPrincipalId: "owner-1",
  ownershipTransfers: [],
  ownerExistsBeforeQualification: true,
  c1Account: { linked: false },
};

function render(props: Partial<ComponentProps<typeof OpportunityCommercialFactsPanel>> = {}) {
  return renderToStaticMarkup(
    createElement(OpportunityCommercialFactsPanel, {
      facts: null,
      draftStatus: "not_yet_assessed",
      draftConditions: {},
      draftNextAction: "",
      onStatusChange: () => undefined,
      onConditionToggle: () => undefined,
      onNextActionChange: () => undefined,
      onSave: () => undefined,
      ...props,
    }),
  );
}

describe("H-111 Day 2 opportunity F2 commercial-facts UI", () => {
  it("renders sign-in state without fabricating values", () => {
    const html = render({ unauthenticated: true });
    expect(html).toContain("Sign in to load opportunity commercial facts");
    expect(html).not.toMatch(/250000|revenue|profit|FX|booking authority/i);
  });

  it("renders unauthorized access without showing facts", () => {
    const html = render({ unauthorized: true });
    expect(html).toContain("Not authorized to read opportunity commercial facts");
    expect(html).not.toContain("Workflow stage");
    expect(html).not.toContain("Save F2 facts");
  });

  it("renders API failure", () => {
    const html = render({ error: "upstream unavailable" });
    expect(html).toContain("upstream unavailable");
  });

  it("renders missing F2 facts without inventing commercial values", () => {
    const html = render({
      facts,
      persistence: { recorded: false, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("No F2 commercial facts recorded yet");
    expect(html).toContain("`new_qualified` is not OR-01 qualified");
    expect(html).toContain("mixed SQL not durable");
    expect(html).not.toMatch(/250000|20%/);
    expect(html).not.toContain("H91-TEST");
  });

  it("renders recorded F2 facts and linked account labels", () => {
    const html = render({
      facts: {
        ...facts,
        qualificationStatus: "qualified",
        or01Qualified: true,
        nextAction: { description: "Call buyer", ownerPrincipalId: "owner-1" },
        c1Account: { linked: true, accountName: "Acme Incentive", accountTypeLabel: "PCO", marketLabel: "United Kingdom" },
      },
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
      canWrite: true,
    });
    expect(html).toContain("F2 facts recorded");
    expect(html).toContain("Call buyer");
    expect(html).toContain("PCO");
    expect(html).toContain("United Kingdom");
    expect(html).toContain("Save F2 facts");
  });

  it("labels H91 synthetic residue instead of presenting it as adoption evidence", () => {
    const html = render({
      opportunityCode: "H91-TEST-OPP",
      opportunityTitle: "H91-TEST row",
      facts,
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("Controlled Dev/Test residue");
    expect(html).toContain("not live commercial adoption evidence");
  });

  it("persistence caption and residue helpers stay fail-closed", () => {
    expect(isControlledDevtestResidue("normal-code")).toBe(false);
    expect(isControlledDevtestResidue("H91-TEST-OPP")).toBe(true);
    expect(
      persistenceCaption({ recorded: false, mode: "in_memory_preview", mixedSqlDurable: false }),
    ).toContain("in-memory preview");
  });
});

describe("H-111 Day 5 D5-S1 opportunity read/write security UI", () => {
  it("does not present Save when facts are readable but write is not established", () => {
    const html = render({
      facts,
      canWrite: false,
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("Workflow stage");
    expect(html).toContain("OR-01 qualification");
    expect(html).not.toContain("Save F2 facts");
    expect(html).not.toContain("Qualification status");
  });

  it("treats PUT 403 as authorization failure, not a successful save", () => {
    const html = render({
      facts,
      canWrite: false,
      error: "Not authorized to update opportunity commercial facts.",
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
    });
    expect(html).toContain("Not authorized to update opportunity commercial facts.");
    expect(html).toContain("Workflow stage");
    expect(html).not.toContain("Save F2 facts");
    expect(html).not.toMatch(/saved|save succeeded|updated successfully/i);
  });

  it("maps Opportunity PUT 403 to write-forbidden copy without treating it as success", () => {
    const mapped = mapCommercialFactsPutFailure(new EosApiError("forbidden", 403), "opportunity");
    expect(mapped.writeForbidden).toBe(true);
    expect(mapped.message).toBe("Not authorized to update opportunity commercial facts.");
    const other = mapCommercialFactsPutFailure(new EosApiError("conflict", 409), "opportunity");
    expect(other.writeForbidden).toBe(false);
    expect(other.message).toBe("conflict");
  });

  it("does not treat GET success as a write grant once PUT 403 has been observed", () => {
    expect(
      commercialFactsCanWrite({
        hasToken: true,
        factsLoaded: true,
        unauthorizedRead: false,
        writeForbidden: true,
      }),
    ).toBe(false);
    expect(
      commercialFactsCanWrite({
        hasToken: true,
        factsLoaded: true,
        unauthorizedRead: false,
        writeForbidden: false,
      }),
    ).toBe(true);
    expect(
      commercialFactsCanWrite({
        hasToken: true,
        factsLoaded: false,
        unauthorizedRead: true,
        writeForbidden: false,
      }),
    ).toBe(false);
  });
});
