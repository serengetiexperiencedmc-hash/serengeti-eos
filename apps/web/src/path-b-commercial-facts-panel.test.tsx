import { describe, expect, it } from "vitest";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PathBCommercialFactsPanel } from "./components/commercial/PathBCommercialFactsPanel";
import {
  PATH_B_EXCEPTIONAL_APPROVAL_LABELS,
  mapCommercialFactsPutFailure,
  type PathBFacts,
} from "./lib/commercial-facts-api";
import { EosApiError } from "./lib/eos-client";

const pathB: PathBFacts = {
  rfpId: "rfp-1",
  required: false,
  status: "not_required",
  categories: [],
};

function render(props: Partial<ComponentProps<typeof PathBCommercialFactsPanel>> = {}) {
  return renderToStaticMarkup(
    createElement(PathBCommercialFactsPanel, {
      pathB: null,
      draftCategories: [],
      draftNotes: "",
      onToggleCategory: () => undefined,
      onNotesChange: () => undefined,
      onSaveCategories: () => undefined,
      onDecide: () => undefined,
      ...props,
    }),
  );
}

describe("H-112 Path B mutation UI", () => {
  it("renders qualitative categories without sell-price or margin thresholds", () => {
    const html = render({
      pathB,
      persistence: { recorded: false, mode: "f2_dp01_sidecar", mixedSqlDurable: true },
      canWrite: true,
      draftCategories: ["exceptional_discounting"],
    });
    expect(html).toContain(PATH_B_EXCEPTIONAL_APPROVAL_LABELS.exceptional_discounting);
    expect(html).toContain("Save Path B categories");
    expect(html).toContain("not inferred from sell price");
    expect(html).not.toContain("250000");
    expect(html).not.toMatch(/revenue|profit/);
  });

  it("shows decide actions only when Path B is pending", () => {
    const idle = render({
      pathB,
      canWrite: true,
      canDecide: true,
    });
    expect(idle).not.toContain("Approve Path B");
    const pending = render({
      pathB: { ...pathB, required: true, status: "pending", categories: ["exceptional_discounting"] },
      canWrite: true,
      canDecide: true,
    });
    expect(pending).toContain("Approve Path B");
    expect(pending).toContain("Reject Path B");
  });

  it("maps PUT 403 to write-forbidden", () => {
    const mapped = mapCommercialFactsPutFailure(new EosApiError("forbidden", 403), "path_b");
    expect(mapped.writeForbidden).toBe(true);
    expect(mapped.message).toContain("Not authorized to update Path B.");
  });
});
