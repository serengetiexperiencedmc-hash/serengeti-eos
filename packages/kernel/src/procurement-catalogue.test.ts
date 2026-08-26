import { describe, expect, it } from "vitest";
import {
  canMutateProcurementRecord,
  canPatchProcurementRecordStatus,
  isValidProcurementRecordStatus,
  nextProcurementCode,
} from "./procurement-catalogue.js";

describe("PR1 Procurement Catalogue kernel", () => {
  it("sequences PRC- codes and accepts only catalogue statuses", () => {
    expect(nextProcurementCode([])).toBe("PRC-0001");
    expect(nextProcurementCode(["PRC-0001"])).toBe("PRC-0002");
    expect(isValidProcurementRecordStatus("open")).toBe(true);
    expect(isValidProcurementRecordStatus("cancelled")).toBe(true);
    expect(isValidProcurementRecordStatus("submitted")).toBe(false);
    expect(isValidProcurementRecordStatus("approved")).toBe(false);
    expect(isValidProcurementRecordStatus("rejected")).toBe(false);
    expect(isValidProcurementRecordStatus("ordered")).toBe(false);
    expect(isValidProcurementRecordStatus("received")).toBe(false);
    expect(isValidProcurementRecordStatus("matched")).toBe(false);
    expect(isValidProcurementRecordStatus("paid")).toBe(false);
    expect(isValidProcurementRecordStatus("closed")).toBe(false);
    expect(isValidProcurementRecordStatus("fulfilled")).toBe(false);
    expect(isValidProcurementRecordStatus("issued")).toBe(false);
    expect(isValidProcurementRecordStatus("done")).toBe(false);
  });

  it("enforces human-only mutate and open → cancelled", () => {
    expect(canMutateProcurementRecord("Human")).toEqual({ allowed: true });
    expect(canMutateProcurementRecord("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateProcurementRecord("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchProcurementRecordStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchProcurementRecordStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchProcurementRecordStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchProcurementRecordStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
