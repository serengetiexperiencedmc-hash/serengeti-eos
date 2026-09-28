import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));

const GATE_B_VERIFICATION_SOURCES = [
  "gate-b.persistence.integration.test.ts",
  "persistence/gate-b-pg-verification.ts",
  "persistence/gate-b-recovery-harness.ts",
] as const;

function sourceOf(relative: string): string {
  return readFileSync(join(here, relative), "utf8");
}

describe("Gate B PostgreSQL verification migration-safety", () => {
  it("does not import main.ts", () => {
    for (const file of GATE_B_VERIFICATION_SOURCES) {
      const source = sourceOf(file);
      expect(source, file).not.toMatch(/from\s+["'][^"']*main(\.js)?["']/);
    }
  });

  it("does not import or call migrate()", () => {
    for (const file of GATE_B_VERIFICATION_SOURCES) {
      const source = sourceOf(file);
      const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      expect(withoutComments, file).not.toMatch(/import\s*\{[^}]*\bmigrate\b/);
      expect(withoutComments, file).not.toMatch(/\bawait\s+migrate\s*\(/);
      expect(withoutComments, file).not.toMatch(/\bmigrate\s*\(\s*(pool|client)\b/);
    }
  });

  it("does not emit schema-changing SQL", () => {
    for (const file of GATE_B_VERIFICATION_SOURCES) {
      const source = sourceOf(file);
      expect(source, file).not.toMatch(/CREATE\s+TABLE/i);
      expect(source, file).not.toMatch(/ALTER\s+TABLE/i);
      expect(source, file).not.toMatch(/DROP\s+TABLE/i);
      expect(source, file).not.toMatch(/CREATE\s+INDEX/i);
    }
  });
});
