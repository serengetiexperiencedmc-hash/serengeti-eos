import { describe, expect, it } from "vitest";
import { canTransitionTicket, nextTicketCode } from "./itsm.js";
import { nextCiCode } from "./cmdb.js";

describe("itsm kernel", () => {
  it("allocates the next TKT code", () => {
    expect(nextTicketCode([])).toBe("TKT-0001");
    expect(nextTicketCode(["TKT-0002", "TKT-0009"])).toBe("TKT-0010");
  });

  it("allows only contracted ticket transitions", () => {
    expect(canTransitionTicket("open", "triage")).toEqual({ allowed: true, next: "triaged" });
    expect(canTransitionTicket("triaged", "assign")).toEqual({ allowed: true, next: "assigned" });
    expect(canTransitionTicket("resolved", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionTicket("closed", "cancel").allowed).toBe(false);
    expect(canTransitionTicket("open", "close").allowed).toBe(false);
  });
});

describe("cmdb kernel", () => {
  it("allocates the next CI code", () => {
    expect(nextCiCode([])).toBe("CI-0001");
    expect(nextCiCode(["CI-0003"])).toBe("CI-0004");
  });
});
