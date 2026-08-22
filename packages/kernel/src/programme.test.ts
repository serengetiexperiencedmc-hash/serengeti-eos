import { describe, expect, it } from "vitest";
import { buildProgrammeCode } from "./programme.js";

describe("programme kernel", () => {
  it("builds programme code from RFP code", () => {
    expect(buildProgrammeCode("RFP-2026-0847")).toBe("PRG-2026-0847");
  });
});
