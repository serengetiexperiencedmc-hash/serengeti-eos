import { describe, expect, it } from "vitest";
import { canTransitionRisk, isValidRiskScore, nextRiskCode } from "./erm.js";

describe("I15 ERM kernel", () => {
  it("sequences risk codes and bounds scores", () => {
    expect(nextRiskCode([])).toBe("RSK-0001");
    expect(nextRiskCode(["RSK-0001"])).toBe("RSK-0002");
    expect(isValidRiskScore(1)).toBe(true);
    expect(isValidRiskScore(6)).toBe(false);
  });

  it("allows mitigate/accept/close and rejects illegal transitions", () => {
    expect(canTransitionRisk("open", "mitigate")).toEqual({ allowed: true, next: "mitigating" });
    expect(canTransitionRisk("mitigating", "accept")).toEqual({ allowed: true, next: "accepted" });
    expect(canTransitionRisk("accepted", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionRisk("closed", "close").allowed).toBe(false);
    expect(canTransitionRisk("accepted", "mitigate").allowed).toBe(false);
  });
});
