import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-198-final-google-cloud-evidence-submission-package.md",
);

describe("H-198 final Google Cloud evidence submission package", () => {
  it("prepares the seven-request payload without submitting the Contact Sales form", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-198 STATUS = COMPLETE");
    expect(text).toContain("---BEGIN H-198 SUBMISSION PAYLOAD---");
    expect(text).toContain("---END H-198 SUBMISSION PAYLOAD---");
    expect(text).toContain("https://cloud.google.com/contact/form");
    expect(text).toContain("H177-D02");
    expect(text).toContain("H177-D03");
    expect(text).toContain("H177-D05");
    expect(text).toContain("H177-D06");
    expect(text).toContain("H177-D07");
    expect(text).toContain("H177-D10");
    expect(text).toContain("H177-D11");
    expect(text).toContain("D01, D04, D08, D09, D12, D13, D14, D15");
    expect(text).toContain("SEDMC-selected business/architecture requirements");
    expect(text).toContain("africa-south1");
    expect(text).toContain("europe-west1");
    expect(text).toContain("OWNER/POA CONFIRMED — SEND-AS / DELEGATED-SEND CAPABILITY NOT YET EVIDENCED");
    expect(text).toContain(
      "Authorized operator has confirmed that the selected submission identity is permitted to represent SEDMC",
    );
    expect(text).toContain("OPERATOR = PENDING");
    expect(text).toContain("GOOGLE CLOUD FORM SUBMITTED = NO");
    expect(text).toContain("REQUESTS SENT = NONE");
    expect(text).toContain("EVIDENCE RECEIVED = NONE");
    expect(text).toContain("EVIDENCE ACCEPTED = NONE");
    expect(text).toContain("RECEIVED = 0");
    expect(text).toContain("ACCEPTED = 0");
    expect(text).toContain("P01 = NOT GRANTED");
    expect(text).toContain("H-81 = NOT STARTED");
    expect(text).toContain("rfp@serengetiexperiencedmc.com");
    expect(text).toContain("info@serengetiexperience.com");
    expect(text).toContain("[GCP PROJECT ID TO BE DETERMINED]");
  });
});
