import { describe, expect, it } from "vitest";
import {
  canCloseEngagement,
  canFinalizeWorkpaper,
  canTransitionEngagement,
  nextEngagementCode,
  nextWorkpaperCode,
} from "./audit-ia.js";

describe("I16 Internal Audit kernel", () => {
  it("sequences engagement and workpaper codes", () => {
    expect(nextEngagementCode([])).toBe("ENG-0001");
    expect(nextEngagementCode(["ENG-0001"])).toBe("ENG-0002");
    expect(nextWorkpaperCode([])).toBe("WP-0001");
    expect(nextWorkpaperCode(["WP-0009"])).toBe("WP-0010");
  });

  it("allows start/close and enforces SoD plus open-workpaper close block", () => {
    expect(canTransitionEngagement("planned", "start")).toEqual({ allowed: true, next: "in_progress" });
    expect(canTransitionEngagement("in_progress", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionEngagement("closed", "close").allowed).toBe(false);
    expect(canTransitionEngagement("in_progress", "start").allowed).toBe(false);
    expect(canCloseEngagement(0)).toEqual({ allowed: true });
    expect(canCloseEngagement(1)).toEqual({ allowed: false, reason: "open_workpapers" });
    expect(canFinalizeWorkpaper("a", "b")).toEqual({ allowed: true });
    expect(canFinalizeWorkpaper("a", "a")).toEqual({ allowed: false, reason: "sod" });
  });
});
