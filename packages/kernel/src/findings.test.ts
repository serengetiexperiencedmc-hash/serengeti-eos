import { describe, expect, it } from "vitest";
import {
  canMutateFinding,
  canTransitionFinding,
  isValidFindingStatus,
  nextFindingCode,
} from "./findings.js";

describe("G3 findings register kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextFindingCode([])).toBe("FND-0001");
    expect(nextFindingCode(["FND-0001"])).toBe("FND-0002");
    expect(isValidFindingStatus("open")).toBe(true);
    expect(isValidFindingStatus("in_progress")).toBe(true);
    expect(isValidFindingStatus("closed")).toBe(true);
    expect(isValidFindingStatus("campaign")).toBe(false);
  });

  it("enforces human-only mutate and open → in_progress → closed", () => {
    expect(canMutateFinding("Human")).toEqual({ allowed: true });
    expect(canMutateFinding("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateFinding("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canTransitionFinding("open", "start")).toEqual({ allowed: true, next: "in_progress" });
    expect(canTransitionFinding("in_progress", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionFinding("open", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionFinding("in_progress", "start").allowed).toBe(false);
    expect(canTransitionFinding("closed", "close").allowed).toBe(false);
  });
});
