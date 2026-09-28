import { describe, expect, it } from "vitest";
import {
  buildProgrammeCode,
  isValidProgrammeCommercialVersionLabel,
  programmeDateRangeValid,
  programmeIsCommerciallyLocked,
} from "./programme.js";

describe("programme kernel", () => {
  it("builds programme code from RFP code", () => {
    expect(buildProgrammeCode("RFP-2026-0847")).toBe("PRG-2026-0847");
  });

  it("accepts H-203 commercial version labels and locks only final", () => {
    expect(isValidProgrammeCommercialVersionLabel("draft")).toBe(true);
    expect(isValidProgrammeCommercialVersionLabel("revised")).toBe(true);
    expect(isValidProgrammeCommercialVersionLabel("client")).toBe(true);
    expect(isValidProgrammeCommercialVersionLabel("final")).toBe(true);
    expect(isValidProgrammeCommercialVersionLabel("approved")).toBe(false);
    expect(programmeIsCommerciallyLocked("draft")).toBe(false);
    expect(programmeIsCommerciallyLocked("final")).toBe(true);
  });

  it("validates start/end date order without inventing night counts", () => {
    expect(programmeDateRangeValid("2026-06-01", "2026-06-08")).toBe(true);
    expect(programmeDateRangeValid("2026-06-08", "2026-06-01")).toBe(false);
    expect(programmeDateRangeValid("2026-06-01", null)).toBe(true);
  });
});

