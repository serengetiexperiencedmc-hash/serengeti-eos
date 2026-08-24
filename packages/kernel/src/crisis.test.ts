import { describe, expect, it } from "vitest";
import {
  canCloseCrisis,
  canCloseCrisisBy,
  canMutateCrisis,
  canWriteOpenCrisis,
  isValidCrisisSeverity,
  isValidCrisisStatus,
  nextCrisisCode,
  nextTimelineCode,
} from "./crisis.js";

describe("I18 crisis overlay kernel", () => {
  it("sequences codes and accepts only L2/L3 overlay severities", () => {
    expect(nextCrisisCode([])).toBe("CRS-0001");
    expect(nextCrisisCode(["CRS-0001"])).toBe("CRS-0002");
    expect(nextTimelineCode([])).toBe("TLN-0001");
    expect(nextTimelineCode(["TLN-0009"])).toBe("TLN-0010");
    expect(isValidCrisisSeverity("l2")).toBe(true);
    expect(isValidCrisisSeverity("l3")).toBe(true);
    expect(isValidCrisisSeverity("l1")).toBe(false);
    expect(isValidCrisisSeverity("l0")).toBe(false);
    expect(isValidCrisisStatus("open")).toBe(true);
    expect(isValidCrisisStatus("closed")).toBe(true);
    expect(isValidCrisisStatus("resolved")).toBe(false);
  });

  it("enforces human-only mutate, SoD close, and closed as terminal", () => {
    expect(canMutateCrisis("Human")).toEqual({ allowed: true });
    expect(canMutateCrisis("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateCrisis("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canCloseCrisis("open")).toEqual({ allowed: true, next: "closed" });
    expect(canCloseCrisis("closed")).toEqual({ allowed: false, reason: "already_closed" });
    expect(canCloseCrisisBy("a", "b")).toEqual({ allowed: true });
    expect(canCloseCrisisBy("a", "a")).toEqual({ allowed: false, reason: "sod" });
    expect(canWriteOpenCrisis("open")).toEqual({ allowed: true });
    expect(canWriteOpenCrisis("closed")).toEqual({ allowed: false, reason: "case_closed" });
  });
});
