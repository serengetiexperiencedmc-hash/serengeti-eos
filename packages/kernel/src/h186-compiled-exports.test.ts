import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("H-186 compiled @sedmc/kernel exports", () => {
  it("points Node runtime import at dist JavaScript, not TypeScript sources", () => {
    const pkg = JSON.parse(
      readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../package.json"), "utf8"),
    ) as {
      main: string;
      exports: Record<string, { import: string; default: string; source: string; types: string }>;
    };
    expect(pkg.main).toBe("./dist/index.js");
    expect(pkg.exports["."].import).toBe("./dist/index.js");
    expect(pkg.exports["."].default).toBe("./dist/index.js");
    expect(pkg.exports["."].source).toBe("./src/index.ts");
    expect(pkg.exports["./field-cache-crypto"].import).toBe("./dist/field-cache-crypto.js");
    expect(pkg.exports["./personal-data-content-contract"].import).toBe(
      "./dist/personal-data-content-contract.js",
    );
  });
});
