import { describe, expect, it } from "vitest";
import {
  canMutateItEndpoint,
  canPatchItEndpointStatus,
  isValidItEndpointStatus,
  nextEndpointCode,
} from "./it-endpoints.js";

describe("ITE1 IT endpoint register kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextEndpointCode([])).toBe("END-0001");
    expect(nextEndpointCode(["END-0001"])).toBe("END-0002");
    expect(isValidItEndpointStatus("open")).toBe(true);
    expect(isValidItEndpointStatus("done")).toBe(true);
    expect(isValidItEndpointStatus("cancelled")).toBe(true);
    expect(isValidItEndpointStatus("enrolled")).toBe(false);
    expect(isValidItEndpointStatus("compliant")).toBe(false);
    expect(isValidItEndpointStatus("managed")).toBe(false);
    expect(isValidItEndpointStatus("online")).toBe(false);
    expect(isValidItEndpointStatus("active")).toBe(false);
  });

  it("enforces human-only mutate and open → done / cancelled", () => {
    expect(canMutateItEndpoint("Human")).toEqual({ allowed: true });
    expect(canMutateItEndpoint("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateItEndpoint("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchItEndpointStatus("open", "done")).toEqual({ allowed: true });
    expect(canPatchItEndpointStatus("open", "cancelled")).toEqual({ allowed: true });
    expect(canPatchItEndpointStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchItEndpointStatus("done", "open")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItEndpointStatus("done", "done")).toEqual({ allowed: false, reason: "done" });
    expect(canPatchItEndpointStatus("cancelled", "open")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
    expect(canPatchItEndpointStatus("cancelled", "cancelled")).toEqual({
      allowed: false,
      reason: "cancelled",
    });
  });
});
