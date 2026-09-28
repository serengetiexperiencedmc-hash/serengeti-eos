import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-197-official-google-cloud-contact-channel-reconciliation-and-dispatch-route.md",
);

describe("H-197 official Google Cloud contact-channel reconciliation and dispatch route", () => {
  it("records the official Contact Sales form as the route without submitting it", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-197 STATUS = COMPLETE");
    expect(text).toContain("https://cloud.google.com/contact");
    expect(text).toContain("https://cloud.google.com/contact/form");
    expect(text).toContain("GOOGLE CLOUD CONTACT FORM SUBMITTED = NO");
    expect(text).toContain("OFFICIAL CHANNEL IDENTIFIED");
    expect(text).toContain("NONE — NO INDIVIDUAL INVENTED");
    expect(text).toContain("GCP ROUTABLE EMAIL ADDRESS = NONE IDENTIFIED");
    expect(text).toContain(
      "READY FOR CONTROLLED EXECUTION VIA OFFICIAL GOOGLE CLOUD CONTACT CHANNEL — SUBJECT TO EXECUTION-TIME OPERATOR AND SEND-AS CONFIRMATION",
    );
    expect(text).toContain("CONFIRMED BY OWNER/POA — DELEGATED SEND-AS PERMISSION NOT YET EVIDENCED");
    expect(text).toContain("H177-D02");
    expect(text).toContain("H177-D03");
    expect(text).toContain("H177-D05");
    expect(text).toContain("H177-D06");
    expect(text).toContain("H177-D07");
    expect(text).toContain("H177-D10");
    expect(text).toContain("H177-D11");
    expect(text).toContain("REQUESTS SENT = NONE");
    expect(text).toContain("EVIDENCE RECEIVED = NONE");
    expect(text).toContain("EVIDENCE ACCEPTED = NONE");
    expect(text).toContain("RECEIVED = 0");
    expect(text).toContain("ACCEPTED = 0");
    expect(text).toContain("P01 = NOT GRANTED");
    expect(text).toContain("H-81 = NOT STARTED");
    expect(text).toContain("rfp@serengetiexperiencedmc.com");
    expect(text).toContain("info@serengetiexperience.com");
  });
});
