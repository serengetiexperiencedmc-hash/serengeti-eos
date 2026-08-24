import { describe, expect, it } from "vitest";
import {
  canMutateCrisisAction,
  canTransitionCrisisAction,
  isValidCrisisActionStatus,
  nextCrisisActionCode,
} from "./crisis-actions.js";

describe("K2 crisis action register kernel", () => {
  it("sequences codes and accepts only action-register statuses", () => {
    expect(nextCrisisActionCode([])).toBe("ACT-0001");
    expect(nextCrisisActionCode(["ACT-0001"])).toBe("ACT-0002");
    expect(isValidCrisisActionStatus("open")).toBe(true);
    expect(isValidCrisisActionStatus("done")).toBe(true);
    expect(isValidCrisisActionStatus("cancelled")).toBe(true);
    expect(isValidCrisisActionStatus("recorded")).toBe(false);
    expect(isValidCrisisActionStatus("in_progress")).toBe(false);
    expect(isValidCrisisActionStatus("closed")).toBe(false);
  });

  it("enforces human-only mutate and open → done / open → cancelled", () => {
    expect(canMutateCrisisAction("Human")).toEqual({ allowed: true });
    expect(canMutateCrisisAction("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateCrisisAction("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canTransitionCrisisAction("open", "complete")).toEqual({ allowed: true, next: "done" });
    expect(canTransitionCrisisAction("open", "cancel")).toEqual({ allowed: true, next: "cancelled" });
    expect(canTransitionCrisisAction("done", "complete").allowed).toBe(false);
    expect(canTransitionCrisisAction("done", "cancel").allowed).toBe(false);
    expect(canTransitionCrisisAction("cancelled", "complete").allowed).toBe(false);
    expect(canTransitionCrisisAction("cancelled", "cancel").allowed).toBe(false);
  });
});
