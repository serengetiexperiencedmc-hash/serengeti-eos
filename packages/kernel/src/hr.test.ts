import { describe, expect, it } from "vitest";
import { canTransitionLeave, computeLeaveDays, nextEmployeeCode } from "./hr.js";

describe("hr kernel", () => {
  it("computes inclusive leave days", () => {
    expect(computeLeaveDays("2026-08-24", "2026-08-24")).toBe(1);
    expect(computeLeaveDays("2026-08-24", "2026-08-26")).toBe(3);
    expect(computeLeaveDays("2026-08-26", "2026-08-24")).toBeUndefined();
    expect(computeLeaveDays("not-a-date", "2026-08-24")).toBeUndefined();
  });

  it("allocates the next EMP code", () => {
    expect(nextEmployeeCode([])).toBe("EMP-0001");
    expect(nextEmployeeCode(["EMP-0003", "EMP-0001"])).toBe("EMP-0004");
  });

  it("allows only contracted leave transitions", () => {
    expect(canTransitionLeave("draft", "submit")).toEqual({ allowed: true, next: "submitted" });
    expect(canTransitionLeave("submitted", "approve")).toEqual({ allowed: true, next: "approved" });
    expect(canTransitionLeave("approved", "cancel").allowed).toBe(false);
    expect(canTransitionLeave("draft", "approve").allowed).toBe(false);
  });
});
