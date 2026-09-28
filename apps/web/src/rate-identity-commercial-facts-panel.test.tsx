import { describe, expect, it } from "vitest";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RateIdentityCommercialFactsPanel } from "./components/commercial/RateIdentityCommercialFactsPanel";
import {
  emptyRateIdentityDraft,
  mapCommercialFactsPutFailure,
  nextRateVersionIdentity,
  SUPPLIER_RATE_SOURCE_CLASS_LABELS,
  SUPPLIER_RATE_TYPE_LABELS,
  type RateCommercialFacts,
  type RateIdentityView,
} from "./lib/commercial-facts-api";
import { EosApiError } from "./lib/eos-client";

const identity: RateIdentityView = {
  identityId: "id-1",
  rateId: "rate-1",
  supplierId: "sup-1",
  supplierCode: "H114-SUP",
  supplierLegalName: "H114 Lodge",
  itemIdentity: "SGL-BB",
  rateCode: "SGL-BB",
  rateName: "SGL-BB",
  versionIdentity: 1,
  sourceClass: "direct_supplier_contract",
  sourceClassLabel: SUPPLIER_RATE_SOURCE_CLASS_LABELS.direct_supplier_contract,
  rateType: "negotiated_contracted",
  rateTypeLabel: SUPPLIER_RATE_TYPE_LABELS.negotiated_contracted,
  originalCurrency: "TZS",
  validFrom: "2026-01-01",
  validTo: "2026-12-31",
  currentlyValid: true,
  validityState: "current",
  amountIsNotIdentity: true,
  legacyAmount: 250,
  legacyUnitRateType: "per_room_per_night",
  legacyUnitRateTypeAuthoritativeForF2: false,
  legacyCurrency: "USD",
  legacyCurrencyAuthoritativeForF2: false,
  fxProviderImplemented: false,
  overlapWinnerInvented: false,
  preferredInConflictAuthoritativeForF2: false,
  inferredFromWebsite: false,
  or08Authoritative: true,
};

const facts: RateCommercialFacts = {
  identities: [identity],
  overlapResolution: "none",
  preferredInConflictAuthoritativeForF2: false,
  fxProviderImplemented: false,
};

function render(props: Partial<ComponentProps<typeof RateIdentityCommercialFactsPanel>> = {}) {
  return renderToStaticMarkup(
    createElement(RateIdentityCommercialFactsPanel, {
      facts: null,
      nextVersionIdentity: 1,
      draft: emptyRateIdentityDraft(),
      onDraftChange: () => undefined,
      onSave: () => undefined,
      ...props,
    }),
  );
}

describe("H-114 Rate Identity overlay UI", () => {
  it("shows authorized overlay fields and distinguishes mixed C4 without winner/FX/freeze controls", () => {
    const html = render({
      facts,
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: true },
      canWrite: true,
      nextVersionIdentity: 2,
      draft: {
        ...emptyRateIdentityDraft(),
        sourceClass: "direct_supplier_contract",
        rateType: "negotiated_contracted",
        originalCurrency: "TZS",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
      },
    });
    expect(html).toContain("versionIdentity");
    expect(html).toContain(SUPPLIER_RATE_SOURCE_CLASS_LABELS.direct_supplier_contract);
    expect(html).toContain(SUPPLIER_RATE_TYPE_LABELS.negotiated_contracted);
    expect(html).toContain("H114-SUP");
    expect(html).toContain("TZS");
    expect(html).toContain("Validity observation");
    expect(html).toContain("legacy mixed C4");
    expect(html).toContain("Amount is not identity");
    expect(html).toContain("FX is not implemented");
    expect(html).toContain("overlap winner");
    expect(html).toContain("live-proposal freeze");
    expect(html).toContain("Append F2 rate identity version");
    expect(html).not.toContain("Prefer rate");
    expect(html).not.toContain("Convert currency");
    expect(html).not.toContain("Freeze on send");
    expect(html).not.toContain("Approve for sale");
  });

  it("hides append when canWrite is false", () => {
    const html = render({ facts, canWrite: false });
    expect(html).not.toContain("Append F2 rate identity version");
  });

  it("maps overlay PUT 403 and duplicate version 409 without treating them as success", () => {
    const forbidden = mapCommercialFactsPutFailure(new EosApiError("forbidden", 403), "rate_identity");
    expect(forbidden.writeForbidden).toBe(true);
    expect(forbidden.message).toContain("Not authorized to update rate identity overlay.");

    const duplicate = mapCommercialFactsPutFailure(new EosApiError("conflict", 409), "rate_identity");
    expect(duplicate.writeForbidden).toBe(false);
    expect(duplicate.message).toContain("append-only");
    expect(nextRateVersionIdentity(facts.identities)).toBe(2);
  });
});
