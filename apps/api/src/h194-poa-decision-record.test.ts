import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-194-poa-decision-record-evidence-activation-and-production-prerequisite-closure-gate.md",
);

describe("H-194 POA decision record and evidence activation", () => {
  it("records POA directions without granting P01, selecting final products, or sending requests", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-194 STATUS = COMPLETE");
    expect(text).toContain("NOT GRANTED");
    expect(text).toContain("FEDERATED IDENTITY + MANDATORY MFA");
    expect(text).toContain("LOCAL-PASSWORD PRODUCTION IDENTITY = REJECTED");
    expect(text).toContain("Google Identity Platform = CANDIDATE PRODUCT, NOT YET FINAL PRODUCT SELECTION");
    expect(text).toContain("MANAGED SECRET PLATFORM REQUIRED");
    expect(text).toContain("GOOGLE-MANAGED ENCRYPTION = DEFAULT DIRECTION");
    expect(text).toContain("DURABLE MANAGED OBJECT STORAGE REQUIRED");
    expect(text).toContain("EMAIL INTEGRATION DIRECTION = SMTP");
    expect(text).toContain("EMAIL PROVIDER = NOT YET SELECTED");
    expect(text).toContain("PSA VS PSC = DEFERRED — TECHNICAL EVIDENCE REQUIRED");
    expect(text).toContain("ACTUAL HOSTNAME = OPEN");
    expect(text).toContain("NO DEDICATED NOC AT INITIAL LAUNCH");
    expect(text).toContain("AUTHORIZED FOR EXECUTION");
    expect(text).toContain("REQUESTS SENT                = NONE");
    expect(text).toContain("SENDER MAILBOX = REQUIRES EXECUTION-TIME CONFIRMATION");
    expect(text).toContain("NO PROCUREMENT COMMITMENT AUTHORIZED BY H-194");
    expect(text).not.toMatch(/projects\/[a-z][a-z0-9-]{4,}/);
  });
});
