import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const artefact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/governance/h-193-owner-poa-production-dependency-decision-closure-session-package.md",
);

describe("H-193 Owner/POA decision-closure session package", () => {
  it("prepares the session without granting P01 or selecting products", () => {
    expect(existsSync(artefact)).toBe(true);
    const text = readFileSync(artefact, "utf8");
    expect(text).toContain("H-193 STATUS = COMPLETE");
    expect(text).toContain("SESSION = PREPARED / NOT HELD");
    expect(text).toContain("NOT GRANTED");
    expect(text).toContain("requests sent       = NONE");
    expect(text).toContain("africa-south1 Johannesburg");
    expect(text).toContain("europe-west1 Belgium");
    expect(text).toContain("PENDING OWNER/POA DECISION");
    expect(text).toContain("DEFERRED — EVIDENCE REQUIRED");
    expect(text).not.toMatch(/IdP product:\s*(Entra|Okta|Auth0|Keycloak)/i);
    expect(text).not.toMatch(/Production hostname:\s*[a-z0-9.-]+\.(com|co\.tz)/i);
    expect(text).toContain("Do not treat Dev/Test PostgreSQL 16 as Production version");
  });
});
