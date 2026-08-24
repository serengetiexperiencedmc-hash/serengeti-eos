import { describe, expect, it } from "vitest";
import {
  canMutateObligation,
  canTransitionObligation,
  isValidObligationStatus,
  nextObligationCode,
} from "./compliance.js";

describe("G1 compliance obligation kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextObligationCode([])).toBe("OBL-0001");
    expect(nextObligationCode(["OBL-0001"])).toBe("OBL-0002");
    expect(isValidObligationStatus("open")).toBe(true);
    expect(isValidObligationStatus("in_force")).toBe(true);
    expect(isValidObligationStatus("closed")).toBe(true);
    expect(isValidObligationStatus("finding")).toBe(false);
  });

  it("enforces human-only mutate and open → in_force → closed", () => {
    expect(canMutateObligation("Human")).toEqual({ allowed: true });
    expect(canMutateObligation("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateObligation("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canTransitionObligation("open", "activate")).toEqual({ allowed: true, next: "in_force" });
    expect(canTransitionObligation("in_force", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionObligation("open", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionObligation("in_force", "activate").allowed).toBe(false);
    expect(canTransitionObligation("closed", "close").allowed).toBe(false);
  });
});
