import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-201-production-infrastructure-options-and-decision-specification.md",
);

describe("H-201 production infrastructure options and decision specification", () => {
  it("specifies three options without selecting a path or authorizing Production", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-201 STATUS = COMPLETE — OPTIONS SPECIFIED; NO PATH SELECTED");
    expect(text).toContain("H-201 does not select a Production architecture");
    expect(text).toContain("No Production infrastructure exists as a result of H-201");
    expect(text).toContain("PREVIOUSLY SELECTED ARCHITECTURE DIRECTION — NOT IMPLEMENTED");
    expect(text).toContain("PRODUCTION IMPLEMENTATION = NOT AUTHORIZED");
    expect(text).toContain("P01 = NOT GRANTED");
    expect(text).toContain("H-198 SUBMISSION = UNSENT");
    expect(text).toContain("productionReady = false");
    expect(text).toContain("H-81 = NOT STARTED");
    expect(text).toContain("RTO ≤ 4 hours");
    expect(text).toContain("RPO ≤ 1 hour");
    expect(text).toContain("No provider is selected by H-201");
    expect(text).toContain("No Production infrastructure is represented as existing");
    expect(text).toContain("SEDMC PRODUCTION SERVERS = NOT IN PLACE");
    expect(text).toContain("GCP PRODUCTION RESOURCES = NONE");
    expect(text).toContain("CURRENT PRICE / QUOTE REQUIRED");
  });
});
