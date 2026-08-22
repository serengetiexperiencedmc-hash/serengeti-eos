import { describe, expect, it } from "vitest";
import {
  cancelWorkflowInstance,
  completeWorkflowTask,
  createRule,
  createWorkflowDefinition,
  addWorkflowVersion,
  executeEffectiveRule,
  publishWorkflowVersion,
  retireRuleVersion,
  setWorkflowTelemetry,
  simulateWorkflowPath,
  startWorkflowInstance,
  approveRule,
} from "../src/workflow.js";
import { seedStore } from "../src/app.js";

describe("I2 hardening gate", () => {
  it("rejects simulation mutations and records SIMULATION mode", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    createWorkflowDefinition(store, carol, { key: "harden.sim", name: "Sim" }, "c1");
    const def = store.workflowDefinitions[0]!;
    addWorkflowVersion(
      store,
      carol,
      def.id,
      { start: "a", nodes: [{ key: "a", type: "human_approval", name: "A" }] },
      "c2",
    );
    publishWorkflowVersion(store, carol, store.workflowVersions[0]!.id, "c3");
    const started = startWorkflowInstance(store, carol, { definitionKey: "harden.sim" }, "c4");
    if ("error" in started) throw new Error("start failed");
    const bob = [...store.principals.values()].find((p) => p.email === "bob.approver@sedmc.local")!;
    const blocked = completeWorkflowTask(
      store,
      bob,
      started.task.id,
      { decision: "approved", idempotencyKey: "k1", mode: "SIMULATION" },
      "c5",
    );
    expect(blocked).toMatchObject({ error: "forbidden", reason: "simulation_cannot_mutate" });
    expect(started.task.status).toBe("pending");

    const sim = simulateWorkflowPath(store, carol, { definitionKey: "harden.sim", decisions: ["approved"] }, "c6");
    expect(sim).toMatchObject({ simulated: true, executed: false, mode: "SIMULATION", sideEffects: [] });
    expect(store.workflowInstances.filter((i) => i.status === "running").length).toBe(1);
  });

  it("enforces idempotency, cancel-after-approval block, and authority expiry", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const bob = [...store.principals.values()].find((p) => p.email === "bob.approver@sedmc.local")!;
    createWorkflowDefinition(store, carol, { key: "harden.idem", name: "Idem" }, "c1");
    addWorkflowVersion(
      store,
      carol,
      store.workflowDefinitions[0]!.id,
      { start: "a", nodes: [{ key: "a", type: "human_approval", name: "A" }] },
      "c2",
    );
    publishWorkflowVersion(store, carol, store.workflowVersions[0]!.id, "c3");
    const started = startWorkflowInstance(store, carol, { definitionKey: "harden.idem" }, "c4");
    if ("error" in started) throw new Error("start failed");

    const first = completeWorkflowTask(
      store,
      bob,
      started.task.id,
      { decision: "approved", idempotencyKey: "same-key" },
      "c5",
    );
    expect("task" in first && first.task.status).toBe("completed");
    const replay = completeWorkflowTask(
      store,
      bob,
      started.task.id,
      { decision: "approved", idempotencyKey: "same-key" },
      "c6",
    );
    expect(replay).toMatchObject({ idempotent: true });

    const started2 = startWorkflowInstance(store, carol, { definitionKey: "harden.idem" }, "c7");
    if ("error" in started2) throw new Error("start2 failed");
    cancelWorkflowInstance(store, carol, started2.instance.id, "c8");
    const afterCancel = completeWorkflowTask(
      store,
      bob,
      started2.task.id,
      { decision: "approved", idempotencyKey: "after-cancel" },
      "c9",
    );
    expect(afterCancel).toMatchObject({ error: "conflict", reason: "instance_cancelled" });

    const started3 = startWorkflowInstance(store, carol, { definitionKey: "harden.idem" }, "c10");
    if ("error" in started3) throw new Error("start3 failed");
    started3.task.authorityExpiresAt = new Date(Date.now() - 1000).toISOString();
    const expired = completeWorkflowTask(
      store,
      bob,
      started3.task.id,
      { decision: "approved", idempotencyKey: "expired" },
      "c11",
    );
    expect(expired).toMatchObject({ error: "forbidden", reason: "authority_expired" });
  });

  it("blocks concurrent double-complete on the same task", async () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const bob = [...store.principals.values()].find((p) => p.email === "bob.approver@sedmc.local")!;
    createWorkflowDefinition(store, carol, { key: "harden.conc", name: "Conc" }, "c1");
    addWorkflowVersion(
      store,
      carol,
      store.workflowDefinitions[0]!.id,
      { start: "a", nodes: [{ key: "a", type: "human_approval", name: "A" }] },
      "c2",
    );
    publishWorkflowVersion(store, carol, store.workflowVersions[0]!.id, "c3");
    const started = startWorkflowInstance(store, carol, { definitionKey: "harden.conc" }, "c4");
    if ("error" in started) throw new Error("start failed");

    const a = completeWorkflowTask(
      store,
      bob,
      started.task.id,
      { decision: "approved", idempotencyKey: "conc-a" },
      "c5",
    );
    const b = completeWorkflowTask(
      store,
      bob,
      started.task.id,
      { decision: "approved", idempotencyKey: "conc-b" },
      "c6",
    );
    expect("task" in a).toBe(true);
    expect(b).toMatchObject({ error: "conflict" });
  });

  it("rules: unapproved/retired/future cannot execute live; history pins version", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const bob = [...store.principals.values()].find((p) => p.email === "bob.approver@sedmc.local")!;
    const created = createRule(
      store,
      carol,
      {
        key: "margin.min",
        name: "Min margin",
        condition: { all: [{ path: "margin", op: "gte", value: 0.15 }] },
        result: { allow: true },
      },
      "r1",
    );
    if ("error" in created) throw new Error("create failed");
    const draftExec = executeEffectiveRule(store, bob, created.version.id, { margin: 0.2 }, "r2", "LIVE");
    expect(draftExec).toMatchObject({ reason: "rule_not_effective", executed: false });

    approveRule(store, bob, created.version.id, "r3");
    created.version.effectiveFrom = new Date(Date.now() + 86_400_000).toISOString();
    const future = executeEffectiveRule(store, bob, created.version.id, { margin: 0.2 }, "r4", "LIVE");
    expect(future).toMatchObject({ reason: "rule_not_yet_effective" });

    created.version.effectiveFrom = new Date(Date.now() - 1000).toISOString();
    const ok = executeEffectiveRule(store, bob, created.version.id, { margin: 0.2 }, "r5", "LIVE");
    expect(ok).toMatchObject({ matched: true, executed: true, ruleVersionId: created.version.id });

    retireRuleVersion(store, bob, created.version.id, "r6");
    const retired = executeEffectiveRule(store, bob, created.version.id, { margin: 0.2 }, "r7", "LIVE");
    expect(retired).toMatchObject({ reason: "rule_retired" });

    const historical = store.audit.filter((a) => a.action === "rules:execute:rule" && a.newState?.matched === true);
    expect(historical[0]?.newState?.ruleVersionId).toBe(created.version.id);
  });

  it("emits workflow telemetry events", () => {
    const events: string[] = [];
    setWorkflowTelemetry((t) => events.push(t.event));
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const bob = [...store.principals.values()].find((p) => p.email === "bob.approver@sedmc.local")!;
    createWorkflowDefinition(store, carol, { key: "harden.tel", name: "Tel" }, "c1");
    addWorkflowVersion(
      store,
      carol,
      store.workflowDefinitions[0]!.id,
      { start: "a", nodes: [{ key: "a", type: "human_approval", name: "A" }] },
      "c2",
    );
    publishWorkflowVersion(store, carol, store.workflowVersions[0]!.id, "c3");
    const started = startWorkflowInstance(store, carol, { definitionKey: "harden.tel" }, "c4");
    if ("error" in started) throw new Error("start failed");
    completeWorkflowTask(
      store,
      bob,
      started.task.id,
      { decision: "approved", idempotencyKey: "tel-1" },
      "c5",
    );
    expect(events).toEqual(
      expect.arrayContaining([
        "workflow_started",
        "task_created",
        "approval_requested",
        "approval_completed",
        "workflow_completed",
      ]),
    );
    setWorkflowTelemetry(() => undefined);
  });
});
