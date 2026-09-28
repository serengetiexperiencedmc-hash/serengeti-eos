import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-200-production-infrastructure-requirements-and-architecture-specification.md",
);

describe("H-200 production infrastructure requirements and architecture specification", () => {
  it("defines provider-neutral requirements without selecting or authorizing Production infrastructure", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-200 STATUS = COMPLETE — REQUIREMENTS SPECIFICATION ONLY; NO PATH SELECTED");
    expect(text).toContain("H-200 does not select GCP, self-managed infrastructure, a data centre, a country, or a hosting provider");
    expect(text).toContain("PRODUCTION IMPLEMENTATION = NOT AUTHORIZED");
    expect(text).toContain("P01 = NOT GRANTED");
    expect(text).toContain("H-198 SUBMISSION = UNSENT");
    expect(text).toContain("GOOGLE CLOUD FORM SUBMITTED = NO");
    expect(text).toContain("productionReady = false");
    expect(text).toContain("H-81 = NOT STARTED");
    expect(text).toContain("RTO ≤ 4 hours");
    expect(text).toContain("RPO ≤ 1 hour");
    expect(text).toContain("NEWEST APPLICATION-COMPATIBLE PROVIDER-SUPPORTED VERSION AT IMPLEMENTATION TIME");
    expect(text).toContain("SIZING EVIDENCE REQUIRED");
    expect(text).toContain("SEDMC PRODUCTION SERVERS = NOT IN PLACE");
    expect(text).toContain("GCP PRODUCTION RESOURCES = NONE");
    expect(text).toContain("No Production infrastructure is represented as existing");
    expect(text).toContain("must not** be treated as a Production document-storage solution");
  });
});
