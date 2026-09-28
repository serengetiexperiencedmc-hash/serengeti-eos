import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("H-140 commercial document UI contract", () => {
  it("states commercial-only upload without claiming file-content scanning", () => {
    const page = readFileSync(new URL("./app/commercial/rfps/[id]/page.tsx", import.meta.url), "utf8");
    expect(page).toContain("Commercial RFP, contract, and rate-sheet files only");
    expect(page).toContain("File contents are not scanned");
    expect(page).not.toMatch(/personal-data scanner|privacy guaranteed/i);
  });
});
