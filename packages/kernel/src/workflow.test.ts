import { describe, expect, it } from "vitest";
import { evaluateCondition, nextNodeKey, simulateRule } from "../src/workflow.js";

describe("workflow/rules kernel", () => {
  it("evaluates rule conditions without executing actions", () => {
    const version = {
      id: "v1",
      ruleId: "r1",
      version: 1,
      status: "draft" as const,
      condition: { all: [{ path: "amount", op: "gte" as const, value: 1000 }] },
      result: { requireDualControl: true },
      priority: 10,
      createdByPrincipalId: "p1",
    };
    expect(simulateRule(version, { amount: 500 }).matched).toBe(false);
    expect(simulateRule(version, { amount: 1500 })).toEqual({
      matched: true,
      result: { requireDualControl: true },
      executed: false,
      mode: "SIMULATION",
    });
    expect(evaluateCondition({ all: [{ path: "role", op: "eq", value: "approver" }] }, { role: "approver" })).toBe(
      true,
    );
  });

  it("routes workflow nodes by decision", () => {
    const graph = {
      start: "review",
      nodes: [
        {
          key: "review",
          type: "human_approval" as const,
          name: "Review",
          nextOnApprove: "done",
          nextOnReject: "end",
        },
        { key: "done", type: "system" as const, name: "Done" },
        { key: "end", type: "system" as const, name: "End" },
      ],
    };
    expect(nextNodeKey(graph, "review", "approved")).toBe("done");
    expect(nextNodeKey(graph, "review", "rejected")).toBe("end");
  });
});
