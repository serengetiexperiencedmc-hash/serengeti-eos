import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-199-production-hosting-architecture-reassessment.md",
);

describe("H-199 production hosting architecture reassessment", () => {
  it("reassesses hosting without selecting a provider, submitting H-198, or claiming Production readiness", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-199 STATUS = COMPLETE — REASSESSMENT ONLY; NO PROVIDER SELECTED");
    expect(text).toContain(
      "This assessment does not select a Production hosting provider and does not authorize Production implementation",
    );
    expect(text).toContain("does **not** claim either architecture is Production-ready");
    expect(text).toContain("Neither architecture is Production-ready");
    expect(text).toContain("H-198 Google Cloud submission remains **unsent**");
    expect(text).toContain("GOOGLE CLOUD FORM SUBMITTED = NO");
    expect(text).toContain("H-198 SUBMISSION = UNSENT");
    expect(text).toContain("productionReady = false");
    expect(text).toContain("H-81 = NOT STARTED");
    expect(text).toContain("P01 = NOT GRANTED");
    expect(text).toContain("PRODUCTION IMPLEMENTATION = NOT AUTHORIZED");
    expect(text).toContain("RTO ≤ 4 hours");
    expect(text).toContain("RPO ≤ 1 hour");
    expect(text).toContain("selected historical direction, not implemented infrastructure");
    expect(text).toContain("SEDMC PRODUCTION SERVERS = NOT IN PLACE");
    expect(text).toContain("GCP is not required");
    expect(text).toContain("Do **not** conclude “both are equally suitable.”");
    expect(text).toContain("Do **not** conclude “GCP is required.”");
  });
});
