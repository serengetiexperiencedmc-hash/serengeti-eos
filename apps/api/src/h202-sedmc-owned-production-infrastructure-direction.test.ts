import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-202-sedmc-owned-production-infrastructure-direction-and-implementation-specification.md",
);

describe("H-202 SEDMC-owned production infrastructure direction", () => {
  it("records SEDMC-owned hosting without claiming plant exists or authorizing Production", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("Hosting direction: SEDMC-owned/controlled infrastructure — SELECTED");
    expect(text).toContain("EOS locally hosted on SEDMC-controlled servers/infrastructure — SELECTED");
    expect(text).toContain("Google-managed public-cloud hosting — NOT THE EOS HOSTING MODEL");
    expect(text).toContain("Production infrastructure implemented: NO");
    expect(text).toContain("Production resources provisioned: NO EVIDENCE");
    expect(text).toContain("SEDMC PRODUCTION SERVERS = NOT IN PLACE");
    expect(text).toContain("No Production infrastructure is represented as existing");
    expect(text).toContain("RTO ≤ 4 hours — UNMEASURED REQUIREMENT");
    expect(text).toContain("RPO ≤ 1 hour — UNMEASURED REQUIREMENT");
    expect(text).toContain("measured RTO: NONE");
    expect(text).toContain("measured RPO: NONE");
    expect(text).toContain("PRODUCTION IMPLEMENTATION = NOT AUTHORIZED");
    expect(text).toContain("P01 = NOT GRANTED");
    expect(text).toContain("productionReady = false");
    expect(text).not.toContain("productionReady = true");
    expect(text).not.toContain("productionReady=true");
    expect(text).toContain("H-81: NOT STARTED");
    expect(text).toContain(
      "VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE",
    );
    expect(text).toContain("external GCP evidence collection: NOT REQUIRED FOR SELECTED HOSTING DIRECTION");
    expect(text).not.toMatch(/\b\d+\s*vCPU\b/i);
    expect(text).not.toMatch(/\b\d+\s*GiB\b/);
  });
});
