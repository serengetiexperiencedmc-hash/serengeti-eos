import { describe, expect, it } from "vitest";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProgrammeCommercialFactsPanel } from "./components/commercial/ProgrammeCommercialFactsPanel";
import { mapCommercialFactsPutFailure, type ProgrammeCommercialFacts } from "./lib/commercial-facts-api";
import { EosApiError } from "./lib/eos-client";

const facts: ProgrammeCommercialFacts = {
  programmeId: "prg-1",
  programmeCode: "PRG-1",
  rfpId: "rfp-1",
  opportunityId: "opp-1",
  rfpObserved: true,
  costingReferencesProgramme: false,
  proposalReferencesProgramme: false,
  recordedClientFacingVersionNumbers: [1],
};

function render(props: Partial<ComponentProps<typeof ProgrammeCommercialFactsPanel>> = {}) {
  return renderToStaticMarkup(
    createElement(ProgrammeCommercialFactsPanel, {
      facts: null,
      draftNote: "",
      draftVersion: "",
      onNoteChange: () => undefined,
      onVersionChange: () => undefined,
      onSave: () => undefined,
      ...props,
    }),
  );
}

describe("H-112 Programme F2 commercial-facts write UI", () => {
  it("shows identity trace and does not treat costing as profit", () => {
    const html = render({
      facts,
      persistence: { recorded: false, mode: "f2_dp01_sidecar", mixedSqlDurable: true },
      canWrite: true,
    });
    expect(html).toContain("PRG-1");
    expect(html).toContain("Save F2 programme facts");
    expect(html).toContain("not profit");
    expect(html).toContain("not revenue");
    expect(html).not.toContain("250000");
  });

  it("hides Save when canWrite is false", () => {
    const html = render({
      facts,
      canWrite: false,
    });
    expect(html).not.toContain("Save F2 programme facts");
  });

  it("maps PUT 403 to write-forbidden", () => {
    const mapped = mapCommercialFactsPutFailure(new EosApiError("forbidden", 403), "programme");
    expect(mapped.writeForbidden).toBe(true);
    expect(mapped.message).toContain("Not authorized to update programme commercial facts.");
  });
});
