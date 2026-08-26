import { describe, expect, it } from "vitest";
import {
  canMutateKri,
  canPatchKriStatus,
  isValidKriStatus,
  nextKriCode,
} from "./erm-kris.js";

describe("E1 KRI register kernel", () => {
  it("sequences codes and accepts only catalogue statuses", () => {
    expect(nextKriCode([])).toBe("KRI-0001");
    expect(nextKriCode(["KRI-0001"])).toBe("KRI-0002");
    expect(nextKriCode(["kri-0009"])).toBe("KRI-0010");
    expect(isValidKriStatus("open")).toBe(true);
    expect(isValidKriStatus("retired")).toBe(true);
    expect(isValidKriStatus("active")).toBe(false);
    expect(isValidKriStatus("monitoring")).toBe(false);
    expect(isValidKriStatus("breached")).toBe(false);
    expect(isValidKriStatus("done")).toBe(false);
    expect(isValidKriStatus("cancelled")).toBe(false);
    expect(isValidKriStatus("closed")).toBe(false);
  });

  it("enforces human-only mutate and open → retired with no reactivation", () => {
    expect(canMutateKri("Human")).toEqual({ allowed: true });
    expect(canMutateKri("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateKri("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchKriStatus("open", "retired")).toEqual({ allowed: true });
    expect(canPatchKriStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchKriStatus("retired", "open")).toEqual({ allowed: false, reason: "retired" });
    expect(canPatchKriStatus("retired", "retired")).toEqual({ allowed: false, reason: "retired" });
  });
});
