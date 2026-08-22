import { describe, expect, it } from "vitest";
import { buildBookingCode, canCreateBooking, DEFAULT_HANDOVER_TASKS } from "./booking.js";

describe("booking kernel", () => {
  it("builds booking code from proposal code", () => {
    expect(buildBookingCode("PROP-2026-0847")).toBe("BKG-2026-0847");
  });

  it("allows booking only from accepted proposals", () => {
    expect(canCreateBooking("accepted").allowed).toBe(true);
    expect(canCreateBooking("sent").allowed).toBe(false);
    expect(canCreateBooking("sent").reason).toBe("proposal_must_be_accepted");
  });

  it("defines default handover checklist", () => {
    expect(DEFAULT_HANDOVER_TASKS.length).toBeGreaterThanOrEqual(4);
  });
});
