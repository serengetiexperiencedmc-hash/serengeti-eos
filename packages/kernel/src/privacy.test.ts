import { describe, expect, it } from "vitest";
import {
  canCloseDsrBy,
  canMutatePrivacy,
  canRetireProcessingActivity,
  canTransitionDsr,
  isValidDsrRequestType,
  isValidDsrStatus,
  isValidProcessingActivityStatus,
  nextDsrCode,
  nextProcessingActivityCode,
} from "./privacy.js";

describe("P1 privacy RoPA and DSR kernel", () => {
  it("sequences codes and accepts only register statuses and DSR types", () => {
    expect(nextProcessingActivityCode([])).toBe("RPA-0001");
    expect(nextProcessingActivityCode(["RPA-0001"])).toBe("RPA-0002");
    expect(nextDsrCode([])).toBe("DSR-0001");
    expect(nextDsrCode(["DSR-0001"])).toBe("DSR-0002");
    expect(isValidProcessingActivityStatus("open")).toBe(true);
    expect(isValidProcessingActivityStatus("retired")).toBe(true);
    expect(isValidProcessingActivityStatus("erased")).toBe(false);
    expect(isValidDsrStatus("open")).toBe(true);
    expect(isValidDsrStatus("in_progress")).toBe(true);
    expect(isValidDsrStatus("closed")).toBe(true);
    expect(isValidDsrRequestType("access")).toBe(true);
    expect(isValidDsrRequestType("erasure")).toBe(true);
    expect(isValidDsrRequestType("rectification")).toBe(true);
    expect(isValidDsrRequestType("delete_now")).toBe(false);
  });

  it("enforces human-only mutate, retire, DSR start/close, and SoD close", () => {
    expect(canMutatePrivacy("Human")).toEqual({ allowed: true });
    expect(canMutatePrivacy("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutatePrivacy("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canRetireProcessingActivity("open")).toEqual({ allowed: true, next: "retired" });
    expect(canRetireProcessingActivity("retired").allowed).toBe(false);
    expect(canTransitionDsr("open", "start")).toEqual({ allowed: true, next: "in_progress" });
    expect(canTransitionDsr("in_progress", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionDsr("open", "close").allowed).toBe(false);
    expect(canTransitionDsr("closed", "close").allowed).toBe(false);
    expect(canCloseDsrBy("a", "b")).toEqual({ allowed: true });
    expect(canCloseDsrBy("a", "a")).toEqual({ allowed: false, reason: "sod" });
  });
});
