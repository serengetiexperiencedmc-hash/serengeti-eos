import { describe, expect, it } from "vitest";
import {
  canMutateItsmRelease,
  canPatchItsmReleaseStatus,
  isValidItsmReleaseStatus,
  nextReleaseCode,
} from "./itsm-releases.js";

describe("ITR1 IT release register kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextReleaseCode([])).toBe("REL-0001");
    expect(nextReleaseCode(["REL-0001"])).toBe("REL-0002");
    expect(isValidItsmReleaseStatus("open")).toBe(true);
    expect(isValidItsmReleaseStatus("done")).toBe(true);
    expect(isValidItsmReleaseStatus("cancelled")).toBe(true);
    expect(isValidItsmReleaseStatus("approved")).toBe(false);
    expect(isValidItsmReleaseStatus("scheduled")).toBe(false);
    expect(isValidItsmReleaseStatus("deployed")).toBe(false);
    expect(isValidItsmReleaseStatus("frozen")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutateItsmRelease("Human")).toEqual({ allowed: true });
    expect(canMutateItsmRelease("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateItsmRelease("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchItsmReleaseStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchItsmReleaseStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchItsmReleaseStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchItsmReleaseStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItsmReleaseStatus("done", "done")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItsmReleaseStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchItsmReleaseStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
