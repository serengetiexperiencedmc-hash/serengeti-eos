import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("H-186 compiled @sedmc/db exports", () => {
  it("points Node runtime import at dist JavaScript, not TypeScript sources", () => {
    const pkg = JSON.parse(
      readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../package.json"), "utf8"),
    ) as {
      main: string;
      exports: { ".": { import: string; default: string; source: string; types: string } };
    };
    expect(pkg.main).toBe("./dist/index.js");
    expect(pkg.exports["."].import).toBe("./dist/index.js");
    expect(pkg.exports["."].default).toBe("./dist/index.js");
    expect(pkg.exports["."].source).toBe("./src/index.ts");
    expect(pkg.exports["."].types).toBe("./src/index.ts");
  });
});
