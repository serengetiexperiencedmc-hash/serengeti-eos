import { describe, expect, it } from "vitest";
import {
  canRecordRestoreProbe,
  canRecordRestoreProbeBy,
  canTransitionBackupJob,
  eatNineteenHundredIso,
  isJobProven,
  nextBackupJobCode,
  nextRestoreProbeCode,
} from "./bcm.js";

describe("I17 BCM backup evidence kernel", () => {
  it("sequences codes and stamps 19:00 EAT as UTC+3", () => {
    expect(nextBackupJobCode([])).toBe("JOB-0001");
    expect(nextBackupJobCode(["JOB-0001"])).toBe("JOB-0002");
    expect(nextRestoreProbeCode([])).toBe("PRP-0001");
    expect(nextRestoreProbeCode(["PRP-0009"])).toBe("PRP-0010");
    expect(eatNineteenHundredIso("2026-08-24")).toBe("2026-08-24T16:00:00.000Z");
    expect(eatNineteenHundredIso("2026-02-31")).toBeNull();
    expect(eatNineteenHundredIso("not-a-date")).toBeNull();
  });

  it("allows complete/fail from scheduled only and enforces SoD plus proven derivation", () => {
    expect(canTransitionBackupJob("scheduled", "complete")).toEqual({ allowed: true, next: "completed" });
    expect(canTransitionBackupJob("scheduled", "fail")).toEqual({ allowed: true, next: "failed" });
    expect(canTransitionBackupJob("completed", "complete").allowed).toBe(false);
    expect(canTransitionBackupJob("failed", "fail").allowed).toBe(false);
    expect(canRecordRestoreProbe("completed")).toEqual({ allowed: true });
    expect(canRecordRestoreProbe("scheduled")).toEqual({ allowed: false, reason: "not_completed" });
    expect(canRecordRestoreProbe("failed")).toEqual({ allowed: false, reason: "not_completed" });
    expect(canRecordRestoreProbeBy("a", "b")).toEqual({ allowed: true });
    expect(canRecordRestoreProbeBy("a", "a")).toEqual({ allowed: false, reason: "sod" });
    expect(isJobProven("completed", 1)).toBe(true);
    expect(isJobProven("completed", 0)).toBe(false);
    expect(isJobProven("scheduled", 1)).toBe(false);
  });
});
