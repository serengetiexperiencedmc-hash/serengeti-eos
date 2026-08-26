import { describe, expect, it } from "vitest";
import {
  canMutateConsentRecord,
  canPatchConsentRecordStatus,
  isValidConsentRecordStatus,
  nextConsentCode,
} from "./consent-register.js";

describe("P3 Consent Register kernel", () => {
  it("sequences CNS- codes and accepts only register statuses", () => {
    expect(nextConsentCode([])).toBe("CNS-0001");
    expect(nextConsentCode(["CNS-0001"])).toBe("CNS-0002");
    expect(isValidConsentRecordStatus("open")).toBe(true);
    expect(isValidConsentRecordStatus("done")).toBe(true);
    expect(isValidConsentRecordStatus("cancelled")).toBe(true);
    expect(isValidConsentRecordStatus("granted")).toBe(false);
    expect(isValidConsentRecordStatus("withdrawn")).toBe(false);
    expect(isValidConsentRecordStatus("expired")).toBe(false);
    expect(isValidConsentRecordStatus("valid")).toBe(false);
    expect(isValidConsentRecordStatus("approved")).toBe(false);
    expect(isValidConsentRecordStatus("revoked")).toBe(false);
    expect(isValidConsentRecordStatus("closed")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutateConsentRecord("Human")).toEqual({ allowed: true });
    expect(canMutateConsentRecord("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateConsentRecord("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchConsentRecordStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchConsentRecordStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchConsentRecordStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchConsentRecordStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchConsentRecordStatus("done", "done")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchConsentRecordStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchConsentRecordStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
