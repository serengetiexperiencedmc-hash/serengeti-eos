import { describe, expect, it } from "vitest";
import {
  canMutateItsmProblem,
  canPatchItsmProblemStatus,
  isValidItsmProblemStatus,
  nextProblemCode,
} from "./itsm-problems.js";

describe("ITP1 IT problem register kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextProblemCode([])).toBe("PRB-0001");
    expect(nextProblemCode(["PRB-0001"])).toBe("PRB-0002");
    expect(isValidItsmProblemStatus("open")).toBe(true);
    expect(isValidItsmProblemStatus("done")).toBe(true);
    expect(isValidItsmProblemStatus("cancelled")).toBe(true);
    expect(isValidItsmProblemStatus("known_error")).toBe(false);
    expect(isValidItsmProblemStatus("major")).toBe(false);
    expect(isValidItsmProblemStatus("rca")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutateItsmProblem("Human")).toEqual({ allowed: true });
    expect(canMutateItsmProblem("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateItsmProblem("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchItsmProblemStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchItsmProblemStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchItsmProblemStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchItsmProblemStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItsmProblemStatus("done", "cancelled")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItsmProblemStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchItsmProblemStatus("cancelled", "done")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
