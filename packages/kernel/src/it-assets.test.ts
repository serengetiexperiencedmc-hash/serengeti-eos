import { describe, expect, it } from "vitest";
import {
  canMutateItAsset,
  canPatchItAssetStatus,
  isValidItAssetStatus,
  nextAssetCode,
} from "./it-assets.js";

describe("ITA1 IT asset register kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextAssetCode([])).toBe("AST-0001");
    expect(nextAssetCode(["AST-0001"])).toBe("AST-0002");
    expect(isValidItAssetStatus("open")).toBe(true);
    expect(isValidItAssetStatus("done")).toBe(true);
    expect(isValidItAssetStatus("cancelled")).toBe(true);
    expect(isValidItAssetStatus("retired")).toBe(false);
    expect(isValidItAssetStatus("discovered")).toBe(false);
    expect(isValidItAssetStatus("disposed")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutateItAsset("Human")).toEqual({ allowed: true });
    expect(canMutateItAsset("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateItAsset("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchItAssetStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchItAssetStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchItAssetStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchItAssetStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItAssetStatus("done", "done")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItAssetStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchItAssetStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
