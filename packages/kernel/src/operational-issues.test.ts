import { describe, expect, it } from "vitest";
import {
  canMutateOperationalIssue,
  canTransitionOperationalIssue,
  isValidOperationalIssueStatus,
  nextOperationalIssueCode,
} from "./operational-issues.js";

describe("O6 operational issues kernel", () => {
  it("sequences codes and accepts only register statuses", () => {
    expect(nextOperationalIssueCode([])).toBe("ISS-0001");
    expect(nextOperationalIssueCode(["ISS-0001"])).toBe("ISS-0002");
    expect(isValidOperationalIssueStatus("open")).toBe(true);
    expect(isValidOperationalIssueStatus("in_progress")).toBe(true);
    expect(isValidOperationalIssueStatus("closed")).toBe(true);
    expect(isValidOperationalIssueStatus("draft")).toBe(false);
  });

  it("enforces human-only mutate and open → in_progress → closed", () => {
    expect(canMutateOperationalIssue("Human")).toEqual({ allowed: true });
    expect(canMutateOperationalIssue("AiAgent")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canMutateOperationalIssue("Service")).toEqual({ allowed: false, reason: "ai_actor" });
    expect(canTransitionOperationalIssue("open", "start")).toEqual({ allowed: true, next: "in_progress" });
    expect(canTransitionOperationalIssue("in_progress", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionOperationalIssue("open", "close")).toEqual({ allowed: true, next: "closed" });
    expect(canTransitionOperationalIssue("in_progress", "start").allowed).toBe(false);
    expect(canTransitionOperationalIssue("closed", "close").allowed).toBe(false);
  });
});
