import { describe, expect, it } from "vitest";
import {
  canMutateSourcingEvent,
  canPatchSourcingEventStatus,
  isValidSourcingEventStatus,
  nextSourcingEventCode,
} from "./sourcing-event-register.js";

describe("PR2 SourcingEvent catalogue kernel", () => {
  it("sequences SE- codes per tenant convention and rejects engine statuses", () => {
    expect(nextSourcingEventCode([])).toBe("SE-0001");
    expect(nextSourcingEventCode(["SE-0001"])).toBe("SE-0002");
    expect(nextSourcingEventCode(["se-0009"])).toBe("SE-0010");
    expect(nextSourcingEventCode(["PRC-0001", "PR2-0001"])).toBe("SE-0001");
    expect(isValidSourcingEventStatus("open")).toBe(true);
    expect(isValidSourcingEventStatus("retired")).toBe(true);
    expect(isValidSourcingEventStatus("cancelled")).toBe(false);
    expect(isValidSourcingEventStatus("done")).toBe(false);
    expect(isValidSourcingEventStatus("approved")).toBe(false);
    expect(isValidSourcingEventStatus("issued")).toBe(false);
    expect(isValidSourcingEventStatus("tendering")).toBe(false);
    expect(isValidSourcingEventStatus("bidding")).toBe(false);
    expect(isValidSourcingEventStatus("scoring")).toBe(false);
    expect(isValidSourcingEventStatus("awarded")).toBe(false);
    expect(isValidSourcingEventStatus("shortlisted")).toBe(false);
    expect(isValidSourcingEventStatus("rfq_sent")).toBe(false);
    expect(isValidSourcingEventStatus("auction_open")).toBe(false);
    expect(isValidSourcingEventStatus("selected")).toBe(false);
    expect(isValidSourcingEventStatus("rejected")).toBe(false);
    expect(isValidSourcingEventStatus("supplier_selected")).toBe(false);
  });

  it("enforces human-only mutate and open → retired with no reopen", () => {
    expect(canMutateSourcingEvent("Human")).toEqual({ allowed: true });
    expect(canMutateSourcingEvent("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateSourcingEvent("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canPatchSourcingEventStatus("open", "retired")).toEqual({ allowed: true });
    expect(canPatchSourcingEventStatus("open", "open")).toEqual({ allowed: true });
    expect(canPatchSourcingEventStatus("retired", "open")).toEqual({
      allowed: false,
      reason: "retired",
    });
    expect(canPatchSourcingEventStatus("retired", "retired")).toEqual({
      allowed: false,
      reason: "retired",
    });
  });
});
