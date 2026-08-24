import { describe, expect, it } from "vitest";
import {
  canMutateItsmChange,
  canPatchItsmChangeStatus,
  isValidItsmChangeStatus,
  nextChangeCode,
} from "./itsm-changes.js";

describe("ITC1 IT change register kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextChangeCode([])).toBe("CHG-0001");
    expect(nextChangeCode(["CHG-0001"])).toBe("CHG-0002");
    expect(isValidItsmChangeStatus("open")).toBe(true);
    expect(isValidItsmChangeStatus("done")).toBe(true);
    expect(isValidItsmChangeStatus("cancelled")).toBe(true);
    expect(isValidItsmChangeStatus("approved")).toBe(false);
    expect(isValidItsmChangeStatus("scheduled")).toBe(false);
    expect(isValidItsmChangeStatus("emergency")).toBe(false);
    expect(isValidItsmChangeStatus("frozen")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutateItsmChange("Human")).toEqual({ allowed: true });
    expect(canMutateItsmChange("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateItsmChange("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchItsmChangeStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchItsmChangeStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchItsmChangeStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchItsmChangeStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItsmChangeStatus("done", "done")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItsmChangeStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchItsmChangeStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
