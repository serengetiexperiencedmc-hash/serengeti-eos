import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("C1.11 OpenAPI gate artifact", () => {
  it("crm-c1.yaml exists and documents CRM routes", () => {
    const path = join(process.cwd(), "..", "..", "docs", "architecture", "openapi", "crm-c1.yaml");
    const yaml = readFileSync(path, "utf8");
    expect(yaml).toContain("openapi: 3.1.0");
    expect(yaml).toContain("/v1/crm/organizations:");
    expect(yaml).toContain("/v1/crm/merges:");
    expect(yaml).toContain("/v1/crm/search:");
    expect(yaml).toContain("Idempotency-Key");
    expect(yaml).toContain("If-Match");
    expect(yaml).toContain("/v1/crm/dev/outbox-events:");
    expect((yaml.match(/^\s+\/v1\/crm\//gm) ?? []).length).toBeGreaterThanOrEqual(50);
  });
});
