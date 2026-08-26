import { describe, expect, it } from "vitest";
import {
  canMutateTreatment,
  canPatchTreatmentStatus,
  isValidTreatmentStatus,
  nextTreatmentCode,
} from "./erm-treatments.js";

describe("E2 Treatment register kernel", () => {
  it("sequences codes and accepts only catalogue statuses", () => {
    expect(nextTreatmentCode([])).toBe("TRT-0001");
    expect(nextTreatmentCode(["TRT-0001"])).toBe("TRT-0002");
    expect(nextTreatmentCode(["trt-0009"])).toBe("TRT-0010");
    expect(isValidTreatmentStatus("open")).toBe(true);
    expect(isValidTreatmentStatus("retired")).toBe(true);
    expect(isValidTreatmentStatus("mitigating")).toBe(false);
    expect(isValidTreatmentStatus("accepted")).toBe(false);
    expect(isValidTreatmentStatus("closed")).toBe(false);
    expect(isValidTreatmentStatus("done")).toBe(false);
    expect(isValidTreatmentStatus("cancelled")).toBe(false);
    expect(isValidTreatmentStatus("effective")).toBe(false);
  });

  it("enforces human-only mutate and open → retired with no reactivation", () => {
    expect(canMutateTreatment("Human")).toEqual({ allowed: true });
    expect(canMutateTreatment("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateTreatment("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchTreatmentStatus("open", "retired")).toEqual({ allowed: true });
    expect(canPatchTreatmentStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchTreatmentStatus("retired", "open")).toEqual({ allowed: false, reason: "retired" });
    expect(canPatchTreatmentStatus("retired", "retired")).toEqual({
      allowed: false,
      reason: "retired",
    });
  });
});
