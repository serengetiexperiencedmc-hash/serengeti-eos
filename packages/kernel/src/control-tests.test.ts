import { describe, expect, it } from "vitest";
import {
  canMutateCampaign,
  canTransitionCampaign,
  isValidCampaignStatus,
  nextCampaignCode,
} from "./control-tests.js";

describe("G4 control-test campaign kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextCampaignCode([])).toBe("CTC-0001");
    expect(nextCampaignCode(["CTC-0001"])).toBe("CTC-0002");
    expect(isValidCampaignStatus("planned")).toBe(true);
    expect(isValidCampaignStatus("in_progress")).toBe(true);
    expect(isValidCampaignStatus("closed")).toBe(true);
    expect(isValidCampaignStatus("open")).toBe(false);
    expect(isValidCampaignStatus("mapping")).toBe(false);
  });

  it("enforces human-only mutate and planned → in_progress → closed", () => {
    expect(canMutateCampaign("Human")).toEqual({ allowed: true });
    expect(canMutateCampaign("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateCampaign("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canTransitionCampaign("planned", "start")).toEqual({ allowed: true, next: "in_progress" });
    expect(canTransitionCampaign("in_progress", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionCampaign("planned", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionCampaign("in_progress", "start").allowed).toBe(false);
    expect(canTransitionCampaign("closed", "close").allowed).toBe(false);
  });
});
