import { describe, expect, it } from "vitest";
import {
  canMutateItLicense,
  canPatchItLicenseStatus,
  isValidItLicenseStatus,
  nextLicenseCode,
} from "./it-licenses.js";

describe("ITL1 IT license register kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextLicenseCode([])).toBe("LIC-0001");
    expect(nextLicenseCode(["LIC-0001"])).toBe("LIC-0002");
    expect(isValidItLicenseStatus("open")).toBe(true);
    expect(isValidItLicenseStatus("done")).toBe(true);
    expect(isValidItLicenseStatus("cancelled")).toBe(true);
    expect(isValidItLicenseStatus("active")).toBe(false);
    expect(isValidItLicenseStatus("expired")).toBe(false);
    expect(isValidItLicenseStatus("compliant")).toBe(false);
    expect(isValidItLicenseStatus("renewing")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutateItLicense("Human")).toEqual({ allowed: true });
    expect(canMutateItLicense("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateItLicense("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchItLicenseStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchItLicenseStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchItLicenseStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchItLicenseStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItLicenseStatus("done", "done")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItLicenseStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchItLicenseStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
