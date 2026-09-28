import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-196-controlled-evidence-dispatch-preparation-and-sender-mailbox-confirmation.md",
);

describe("H-196 controlled evidence dispatch preparation and sender-mailbox confirmation", () => {
  it("records the confirmed mailbox arrangement without sending or claiming delegated-send", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-196 STATUS = COMPLETE");
    expect(text).toContain("AUTHORIZED SENDER IDENTITY = rfp@serengetiexperiencedmc.com");
    expect(text).toContain("SENDING MAILBOX = info@serengetiexperience.com");
    expect(text).toContain("DELEGATED-SEND / SEND-AS PERMISSION = NOT EVIDENCED — REQUIRES CONFIRMATION");
    expect(text).toContain("NOT READY — GCP RECIPIENT/CHANNEL AND EXECUTION CONTROLS PENDING");
    expect(text).toContain("Currently READY FOR AUTHORIZED EXECUTION = 0");
    expect(text).toContain("Prepared dispatch records = 7");
    expect(text).toContain("H177-D02");
    expect(text).toContain("H177-D03");
    expect(text).toContain("H177-D05");
    expect(text).toContain("H177-D06");
    expect(text).toContain("H177-D07");
    expect(text).toContain("H177-D10");
    expect(text).toContain("H177-D11");
    expect(text).toContain("OPERATOR = PENDING EXECUTION-TIME CONFIRMATION");
    expect(text).toContain("EXECUTION TIMESTAMP = PENDING");
    expect(text).toContain("GCP ROUTABLE RECIPIENT / OFFICIAL CHANNEL = PENDING");
    expect(text).toContain("REQUESTS SENT = NONE");
    expect(text).toContain("EVIDENCE RECEIVED = NONE");
    expect(text).toContain("EVIDENCE ACCEPTED = NONE");
    expect(text).toContain("P01 = NOT GRANTED");
    expect(text).toContain("H-81 = NOT STARTED");
    expect(text).not.toMatch(/DELEGATED-SEND \/ SEND-AS PERMISSION = (EXISTS|CONFIRMED|EVIDENCED)/);
  });
});
