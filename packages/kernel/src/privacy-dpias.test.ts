import { describe, expect, it } from "vitest";
import {
  canMutatePrivacyDpia,
  canPatchPrivacyDpiaStatus,
  isValidPrivacyDpiaStatus,
  nextDpiaCode,
} from "./privacy-dpias.js";

describe("P2 DPIA register kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextDpiaCode([])).toBe("DPI-0001");
    expect(nextDpiaCode(["DPI-0001"])).toBe("DPI-0002");
    expect(isValidPrivacyDpiaStatus("open")).toBe(true);
    expect(isValidPrivacyDpiaStatus("done")).toBe(true);
    expect(isValidPrivacyDpiaStatus("cancelled")).toBe(true);
    expect(isValidPrivacyDpiaStatus("approved")).toBe(false);
    expect(isValidPrivacyDpiaStatus("legal")).toBe(false);
    expect(isValidPrivacyDpiaStatus("assessed")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutatePrivacyDpia("Human")).toEqual({ allowed: true });
    expect(canMutatePrivacyDpia("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutatePrivacyDpia("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchPrivacyDpiaStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchPrivacyDpiaStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchPrivacyDpiaStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchPrivacyDpiaStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchPrivacyDpiaStatus("done", "done")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchPrivacyDpiaStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchPrivacyDpiaStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
