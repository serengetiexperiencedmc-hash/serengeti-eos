import { describe, expect, it } from "vitest";
import {
  canMutateCrisisDecision,
  canTransitionCrisisDecision,
  isValidCrisisDecisionStatus,
  nextCrisisDecisionCode,
} from "./crisis-decisions.js";

describe("K1 crisis decision log kernel", () => {
  it("sequences codes and accepts only decision-log statuses", () => {
    expect(nextCrisisDecisionCode([])).toBe("DEC-0001");
    expect(nextCrisisDecisionCode(["DEC-0001"])).toBe("DEC-0002");
    expect(isValidCrisisDecisionStatus("recorded")).toBe(true);
    expect(isValidCrisisDecisionStatus("superseded")).toBe(true);
    expect(isValidCrisisDecisionStatus("open")).toBe(false);
    expect(isValidCrisisDecisionStatus("closed")).toBe(false);
  });

  it("enforces human-only mutate and recorded → superseded", () => {
    expect(canMutateCrisisDecision("Human")).toEqual({ allowed: true });
    expect(canMutateCrisisDecision("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateCrisisDecision("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canTransitionCrisisDecision("recorded", "supersede")).toEqual({
      allowed: true,
      next: "superseded",
    });
    expect(canTransitionCrisisDecision("superseded", "supersede").allowed).toBe(false);
  });
});
