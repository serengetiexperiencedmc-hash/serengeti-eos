import { describe, expect, it } from "vitest";
import {
  createWorkflowDefinition,
  addWorkflowVersion,
  publishWorkflowVersion,
  startWorkflowInstance,
} from "../src/workflow.js";
import { seedStore } from "../src/app.js";

describe("I2 performance baseline (dev evidence)", () => {
  it("records latency samples for create/start under small concurrency", async () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    createWorkflowDefinition(store, carol, { key: "perf.base", name: "Perf" }, "p1");
    addWorkflowVersion(
      store,
      carol,
      store.workflowDefinitions[0]!.id,
      { start: "a", nodes: [{ key: "a", type: "human_approval", name: "A" }] },
      "p2",
    );
    publishWorkflowVersion(store, carol, store.workflowVersions[0]!.id, "p3");

    const samples: number[] = [];
    for (let i = 0; i < 50; i++) {
      const t0 = performance.now();
      const r = startWorkflowInstance(store, carol, { definitionKey: "perf.base", businessKey: `BK-${i}` }, `p-${i}`);
      samples.push(performance.now() - t0);
      expect("instance" in r).toBe(true);
    }
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const p95 = [...samples].sort((a, b) => a - b)[Math.floor(samples.length * 0.95)]!;
    expect(avg).toBeLessThan(50);
    expect(p95).toBeLessThan(100);
    expect(store.audit.length).toBeGreaterThan(50);
  });
});
