import { describe, expect, it } from "vitest";
import {
  canMutateClassificationRecord,
  canPatchClassificationRecordStatus,
  isValidClassificationRecordStatus,
  nextClassificationCode,
} from "./classification-register.js";

describe("DG2 Classification Register kernel", () => {
  it("sequences CLS- codes and accepts only register statuses", () => {
    expect(nextClassificationCode([])).toBe("CLS-0001");
    expect(nextClassificationCode(["CLS-0001"])).toBe("CLS-0002");
    expect(isValidClassificationRecordStatus("open")).toBe(true);
    expect(isValidClassificationRecordStatus("done")).toBe(true);
    expect(isValidClassificationRecordStatus("cancelled")).toBe(true);
    expect(isValidClassificationRecordStatus("classified")).toBe(false);
    expect(isValidClassificationRecordStatus("scanned")).toBe(false);
    expect(isValidClassificationRecordStatus("restricted")).toBe(false);
    expect(isValidClassificationRecordStatus("highly_restricted")).toBe(false);
    expect(isValidClassificationRecordStatus("Public")).toBe(false);
    expect(isValidClassificationRecordStatus("Internal")).toBe(false);
    expect(isValidClassificationRecordStatus("Confidential")).toBe(false);
    expect(isValidClassificationRecordStatus("Restricted")).toBe(false);
    expect(isValidClassificationRecordStatus("HighlyRestricted")).toBe(false);
    expect(isValidClassificationRecordStatus("lineaged")).toBe(false);
    expect(isValidClassificationRecordStatus("quality_failed")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutateClassificationRecord("Human")).toEqual({ allowed: true });
    expect(canMutateClassificationRecord("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateClassificationRecord("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchClassificationRecordStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchClassificationRecordStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchClassificationRecordStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchClassificationRecordStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchClassificationRecordStatus("done", "done")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchClassificationRecordStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchClassificationRecordStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
