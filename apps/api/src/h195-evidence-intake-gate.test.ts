import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-195-evidence-collection-execution-readiness-and-evidence-intake-gate.md",
);

describe("H-195 evidence-collection execution readiness and intake gate", () => {
  it("prepares intake without sending, fabricating evidence, or expanding H-181", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-195 STATUS = COMPLETE");
    expect(text).toContain("SENT = NONE");
    expect(text).toContain("CONFIRMED SENDER IDENTITY: [PENDING]");
    expect(text).toContain("NOT READY — IDENTITY/CHANNEL CONFIRMATION REQUIRED");
    expect(text).toContain("Currently READY FOR AUTHORIZED EXECUTION = 0");
    expect(text).toContain("Outbound eligible after confirmation = 7");
    expect(text).toContain("NOT SELECTED FOR OUTBOUND");
    expect(text).toContain("RECEIVED = 0");
    expect(text).toContain("STORAGE REFERENCE = NONE");
    expect(text).toContain("REQUESTS SENT = NONE");
    expect(text).toContain("P01 = NOT GRANTED");
    expect(text).not.toContain("H177-D16");
  });
});
