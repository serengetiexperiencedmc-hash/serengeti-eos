import { describe, expect, it } from "vitest";
import {
  canMutateHrCertification,
  canPatchCertificationStatus,
  isValidCertificationStatus,
  nextCertificationCode,
  validateCertificationDates,
} from "./hr-certifications.js";

describe("H1 HR certification register kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextCertificationCode([])).toBe("CRT-0001");
    expect(nextCertificationCode(["CRT-0001"])).toBe("CRT-0002");
    expect(isValidCertificationStatus("held")).toBe(true);
    expect(isValidCertificationStatus("revoked")).toBe(true);
    expect(isValidCertificationStatus("expired")).toBe(false);
    expect(isValidCertificationStatus("pending")).toBe(false);
    expect(isValidCertificationStatus("active")).toBe(false);
  });

  it("enforces human-only mutate and held → revoked", () => {
    expect(canMutateHrCertification("Human")).toEqual({ allowed: true });
    expect(canMutateHrCertification("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateHrCertification("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchCertificationStatus("held", "revoked")).toEqual({ allowed: true });
    expect(canPatchCertificationStatus("held", "held")).toEqual({ allowed: true });
    expect(canPatchCertificationStatus("revoked", "held").allowed).toBe(false);
    expect(canPatchCertificationStatus("revoked", "revoked")).toEqual({
      allowed: false,
      reason: "revoked",
    });
  });

  it("treats date labels as informational YYYY-MM-DD values", () => {
    expect(validateCertificationDates()).toEqual({ ok: true });
    expect(validateCertificationDates("2024-01-01")).toEqual({ ok: true });
    expect(validateCertificationDates(undefined, "2025-12-31")).toEqual({ ok: true });
    expect(validateCertificationDates("2024-01-01", "2025-12-31")).toEqual({ ok: true });
    expect(validateCertificationDates("2025-12-31", "2024-01-01")).toEqual({
      ok: false,
      reason: "invalid_dates",
    });
    expect(validateCertificationDates("01-01-2024")).toEqual({ ok: false, reason: "invalid_dates" });
    expect(validateCertificationDates("not-a-date")).toEqual({ ok: false, reason: "invalid_dates" });
  });
});
