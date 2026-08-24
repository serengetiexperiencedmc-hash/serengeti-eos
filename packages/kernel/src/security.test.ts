import { describe, expect, it } from "vitest";
import { canTransitionAlert, nextAlertCode } from "./security.js";

describe("security kernel", () => {
  it("allocates ALT codes", () => {
    expect(nextAlertCode([])).toBe("ALT-0001");
    expect(nextAlertCode(["ALT-0002"])).toBe("ALT-0003");
  });

  it("allows only ingest-lifecycle transitions", () => {
    expect(canTransitionAlert("open", "acknowledge")).toEqual({ allowed: true, next: "acknowledged" });
    expect(canTransitionAlert("acknowledged", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionAlert("closed", "acknowledge").allowed).toBe(false);
  });
});
