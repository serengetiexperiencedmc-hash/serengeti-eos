import { describe, expect, it } from "vitest";
import {
  canMutateMapping,
  canTransitionMapping,
  isValidMappingStatus,
  nextMappingCode,
} from "./mappings.js";

describe("G5 regulation-to-control mapping kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextMappingCode([])).toBe("MAP-0001");
    expect(nextMappingCode(["MAP-0001"])).toBe("MAP-0002");
    expect(isValidMappingStatus("draft")).toBe(true);
    expect(isValidMappingStatus("active")).toBe(true);
    expect(isValidMappingStatus("retired")).toBe(true);
    expect(isValidMappingStatus("open")).toBe(false);
    expect(isValidMappingStatus("feed")).toBe(false);
  });

  it("enforces human-only mutate and draft → active → retired", () => {
    expect(canMutateMapping("Human")).toEqual({ allowed: true });
    expect(canMutateMapping("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateMapping("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canTransitionMapping("draft", "activate")).toEqual({ allowed: true, next: "active" });
    expect(canTransitionMapping("active", "retire")).toEqual({ allowed: true, next: "retired" });
    expect(canTransitionMapping("draft", "retire").allowed).toBe(false);
    expect(canTransitionMapping("active", "activate").allowed).toBe(false);
    expect(canTransitionMapping("retired", "retire").allowed).toBe(false);
  });
});
