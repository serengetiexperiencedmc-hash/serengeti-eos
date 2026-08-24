import { describe, expect, it } from "vitest";
import {
  canMutateControl,
  canTransitionControl,
  isValidControlStatus,
  nextControlCode,
} from "./grc.js";

describe("G2 GRC control catalogue kernel", () => {
  it("sequences codes and accepts only catalogue statuses", () => {
    expect(nextControlCode([])).toBe("CTL-0001");
    expect(nextControlCode(["CTL-0001"])).toBe("CTL-0002");
    expect(isValidControlStatus("draft")).toBe(true);
    expect(isValidControlStatus("active")).toBe(true);
    expect(isValidControlStatus("retired")).toBe(true);
    expect(isValidControlStatus("finding")).toBe(false);
  });

  it("enforces human-only mutate and draft → active → retired", () => {
    expect(canMutateControl("Human")).toEqual({ allowed: true });
    expect(canMutateControl("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateControl("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canTransitionControl("draft", "activate")).toEqual({ allowed: true, next: "active" });
    expect(canTransitionControl("active", "retire")).toEqual({ allowed: true, next: "retired" });
    expect(canTransitionControl("draft", "retire").allowed).toBe(false);
    expect(canTransitionControl("active", "activate").allowed).toBe(false);
    expect(canTransitionControl("retired", "retire").allowed).toBe(false);
  });
});
