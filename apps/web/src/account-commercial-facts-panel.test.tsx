import { describe, expect, it } from "vitest";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AccountCommercialFactsPanel } from "./components/commercial/AccountCommercialFactsPanel";
import {
  COMMERCIAL_ACCOUNT_TYPE_LABELS,
  COMMERCIAL_MARKET_LABELS,
  mapCommercialFactsPutFailure,
  type AccountCommercialFacts,
} from "./lib/commercial-facts-api";
import { EosApiError } from "./lib/eos-client";

const facts: AccountCommercialFacts = {
  accountId: "acc-1",
  organizationId: "org-1",
  accountName: "H112-TEST Account",
  accountTypeIndependentOfMarket: true,
  marketIndependentOfAccountType: true,
  or03Authoritative: true,
  or03mAuthoritative: true,
  inferredFromName: false,
  inferredFromTelephone: false,
  inferredFromEmail: false,
};

function render(props: Partial<ComponentProps<typeof AccountCommercialFactsPanel>> = {}) {
  return renderToStaticMarkup(
    createElement(AccountCommercialFactsPanel, {
      facts: null,
      draftType: "",
      draftMarket: "",
      onTypeChange: () => undefined,
      onMarketChange: () => undefined,
      onSave: () => undefined,
      ...props,
    }),
  );
}

describe("H-112 Account F2 commercial-facts UI", () => {
  it("keeps account type independent of market and does not infer from name", () => {
    const html = render({
      facts: { ...facts, accountType: "pco", accountTypeLabel: COMMERCIAL_ACCOUNT_TYPE_LABELS.pco, market: "germany", marketLabel: COMMERCIAL_MARKET_LABELS.germany },
      persistence: { recorded: true, mode: "f2_dp01_sidecar", mixedSqlDurable: true },
      canWrite: true,
      draftType: "pco",
      draftMarket: "germany",
    });
    expect(html).toContain(COMMERCIAL_ACCOUNT_TYPE_LABELS.pco);
    expect(html).toContain(COMMERCIAL_MARKET_LABELS.germany);
    expect(html).toContain("independent of market");
    expect(html).toContain("Save F2 account facts");
    expect(html).toContain("not used to infer");
    expect(html).not.toContain("250000");
  });

  it("hides Save when canWrite is false", () => {
    const html = render({
      facts,
      persistence: { recorded: false, mode: "f2_dp01_sidecar", mixedSqlDurable: false },
      canWrite: false,
    });
    expect(html).not.toContain("Save F2 account facts");
  });

  it("maps PUT 403 to write-forbidden without treating it as success", () => {
    const mapped = mapCommercialFactsPutFailure(new EosApiError("forbidden", 403), "account");
    expect(mapped.writeForbidden).toBe(true);
    expect(mapped.message).toContain("Not authorized to update account commercial facts.");
  });
});
