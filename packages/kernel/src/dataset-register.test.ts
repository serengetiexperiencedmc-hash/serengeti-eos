import { describe, expect, it } from "vitest";
import {
  canMutateDatasetRecord,
  canPatchDatasetRecordStatus,
  isValidDatasetRecordStatus,
  nextDatasetCode,
} from "./dataset-register.js";

describe("DG1 Dataset Register kernel", () => {
  it("sequences DST- codes and accepts only register statuses", () => {
    expect(nextDatasetCode([])).toBe("DST-0001");
    expect(nextDatasetCode(["DST-0001"])).toBe("DST-0002");
    expect(isValidDatasetRecordStatus("open")).toBe(true);
    expect(isValidDatasetRecordStatus("done")).toBe(true);
    expect(isValidDatasetRecordStatus("cancelled")).toBe(true);
    expect(isValidDatasetRecordStatus("classified")).toBe(false);
    expect(isValidDatasetRecordStatus("scanned")).toBe(false);
    expect(isValidDatasetRecordStatus("lineaged")).toBe(false);
    expect(isValidDatasetRecordStatus("quality_failed")).toBe(false);
    expect(isValidDatasetRecordStatus("ingested")).toBe(false);
    expect(isValidDatasetRecordStatus("erased")).toBe(false);
    expect(isValidDatasetRecordStatus("granted")).toBe(false);
    expect(isValidDatasetRecordStatus("withdrawn")).toBe(false);
    expect(isValidDatasetRecordStatus("expired")).toBe(false);
    expect(isValidDatasetRecordStatus("approved")).toBe(false);
    expect(isValidDatasetRecordStatus("valid")).toBe(false);
    expect(isValidDatasetRecordStatus("invalid")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutateDatasetRecord("Human")).toEqual({ allowed: true });
    expect(canMutateDatasetRecord("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateDatasetRecord("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchDatasetRecordStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchDatasetRecordStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchDatasetRecordStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchDatasetRecordStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchDatasetRecordStatus("done", "done")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchDatasetRecordStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchDatasetRecordStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
