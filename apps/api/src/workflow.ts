import {
  assertLiveAllowed,
  authorize,
  canDecide,
  evaluateEffectiveRule,
  newId,
  nextNodeKey,
  simulateRule,
  sodViolation,
  type BusinessRule,
  type BusinessRuleVersion,
  type ExecutionContext,
  type Principal,
  type WorkflowDefinition,
  type WorkflowGraph,
  type WorkflowInstance,
  type WorkflowTask,
  type WorkflowVersion,
} from "@sedmc/kernel";
import { recordAudit, type Store } from "./store.js";

const taskLocks = new Set<string>();

export type WorkflowTelemetry = {
  event: string;
  fields?: Record<string, unknown>;
};

let emitTelemetry: (t: WorkflowTelemetry) => void = () => undefined;

export function setWorkflowTelemetry(handler: (t: WorkflowTelemetry) => void): void {
  emitTelemetry = handler;
}

export function ensureWorkflowCollections(store: Store): void {
  if (!store.workflowDefinitions) store.workflowDefinitions = [];
  if (!store.workflowVersions) store.workflowVersions = [];
  if (!store.workflowInstances) store.workflowInstances = [];
  if (!store.workflowTasks) store.workflowTasks = [];
  if (!store.businessRules) store.businessRules = [];
  if (!store.businessRuleVersions) store.businessRuleVersions = [];
}

function deny(
  store: Store,
  principal: Principal,
  action: string,
  resourceType: string,
  correlationId: string,
  reason: string,
  resourceId?: string,
) {
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType,
    ...(resourceId !== undefined ? { resourceId } : {}),
    correlationId,
    authorization: "deny",
    evidence: { reason },
  });
}

export function createWorkflowDefinition(
  store: Store,
  principal: Principal,
  input: { key: string; name: string },
  correlationId: string,
) {
  ensureWorkflowCollections(store);
  const decision = authorize({
    principal,
    permission: "workflow:write:definition",
    action: "write:workflow_definition",
  });
  if (decision.result === "deny") {
    deny(store, principal, "workflow:write:definition", "workflow_definition", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (store.workflowDefinitions.some((d) => d.tenantId === principal.tenantId && d.key === input.key)) {
    return { error: "conflict" as const, reason: "key_exists" };
  }
  const definition: WorkflowDefinition = {
    id: newId(),
    tenantId: principal.tenantId,
    key: input.key,
    name: input.name,
    ownerPrincipalId: principal.id,
  };
  store.workflowDefinitions.push(definition);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "workflow:write:definition",
    resourceType: "workflow_definition",
    resourceId: definition.id,
    correlationId,
    authorization: "allow",
    newState: definition,
  });
  return { definition };
}

export function addWorkflowVersion(
  store: Store,
  principal: Principal,
  definitionId: string,
  graph: WorkflowGraph,
  correlationId: string,
) {
  ensureWorkflowCollections(store);
  const decision = authorize({
    principal,
    permission: "workflow:write:definition",
    action: "write:workflow_version",
  });
  if (decision.result === "deny") {
    deny(store, principal, "workflow:write:definition", "workflow_version", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const definition = store.workflowDefinitions.find(
    (d) => d.id === definitionId && d.tenantId === principal.tenantId,
  );
  if (!definition) return { error: "not_found" as const };
  const versionNum =
    store.workflowVersions.filter((v) => v.definitionId === definitionId).reduce((m, v) => Math.max(m, v.version), 0) +
    1;
  const version: WorkflowVersion = {
    id: newId(),
    definitionId,
    version: versionNum,
    status: "draft",
    graph,
    createdByPrincipalId: principal.id,
  };
  store.workflowVersions.push(version);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "workflow:write:definition",
    resourceType: "workflow_version",
    resourceId: version.id,
    correlationId,
    authorization: "allow",
    newState: { version: version.version, status: version.status },
  });
  return { version };
}

export function publishWorkflowVersion(
  store: Store,
  principal: Principal,
  versionId: string,
  correlationId: string,
) {
  ensureWorkflowCollections(store);
  const decision = authorize({
    principal,
    permission: "workflow:publish:definition",
    action: "publish:workflow_version",
  });
  if (decision.result === "deny") {
    deny(store, principal, "workflow:publish:definition", "workflow_version", correlationId, decision.reason, versionId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const version = store.workflowVersions.find((v) => v.id === versionId);
  if (!version) return { error: "not_found" as const };
  const definition = store.workflowDefinitions.find(
    (d) => d.id === version.definitionId && d.tenantId === principal.tenantId,
  );
  if (!definition) return { error: "not_found" as const };
  for (const other of store.workflowVersions) {
    if (other.definitionId === version.definitionId && other.status === "published") {
      other.status = "retired";
    }
  }
  version.status = "published";
  version.publishedAt = new Date().toISOString();
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "workflow:publish:definition",
    resourceType: "workflow_version",
    resourceId: version.id,
    correlationId,
    authorization: "allow",
    newState: { status: "published", version: version.version },
  });
  return { version };
}

export function startWorkflowInstance(
  store: Store,
  principal: Principal,
  input: { definitionKey: string; businessKey?: string; context?: Record<string, unknown> },
  correlationId: string,
) {
  ensureWorkflowCollections(store);
  const decision = authorize({
    principal,
    permission: "workflow:execute:instance",
    action: "start:workflow_instance",
  });
  if (decision.result === "deny") {
    deny(store, principal, "workflow:execute:instance", "workflow_instance", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const definition = store.workflowDefinitions.find(
    (d) => d.tenantId === principal.tenantId && d.key === input.definitionKey,
  );
  if (!definition) return { error: "not_found" as const };
  const version = store.workflowVersions
    .filter((v) => v.definitionId === definition.id && v.status === "published")
    .sort((a, b) => b.version - a.version)[0];
  if (!version) return { error: "conflict" as const, reason: "no_published_version" };

  const instance: WorkflowInstance = {
    id: newId(),
    tenantId: principal.tenantId,
    definitionId: definition.id,
    versionId: version.id,
    status: "running",
    ...(input.businessKey !== undefined ? { businessKey: input.businessKey } : {}),
    context: input.context ?? {},
    startedByPrincipalId: principal.id,
    currentNodeKey: version.graph.start,
  };
  store.workflowInstances.push(instance);
  store.actions.push({
    principalId: principal.id,
    action: "workflow:execute:instance",
    objectId: instance.id,
  });
  const startNode = version.graph.nodes.find((n) => n.key === version.graph.start);
  const task: WorkflowTask = {
    id: newId(),
    tenantId: principal.tenantId,
    instanceId: instance.id,
    nodeKey: version.graph.start,
    taskType: startNode?.type ?? "human_approval",
    status: "pending",
    ...(startNode?.slaMinutes
      ? { dueAt: new Date(Date.now() + startNode.slaMinutes * 60_000).toISOString() }
      : {}),
    // Default approval authority window: 24h from start (hardening gate)
    authorityExpiresAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString(),
  };
  store.workflowTasks.push(task);
  emitTelemetry({
    event: "workflow_started",
    fields: { instanceId: instance.id, versionId: version.id, taskId: task.id },
  });
  emitTelemetry({ event: "task_created", fields: { taskId: task.id, instanceId: instance.id } });
  emitTelemetry({ event: "approval_requested", fields: { taskId: task.id, instanceId: instance.id } });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "workflow:execute:instance",
    resourceType: "workflow_instance",
    resourceId: instance.id,
    correlationId,
    authorization: "allow",
    newState: {
      status: instance.status,
      taskId: task.id,
      versionId: version.id,
      workflowVersion: version.version,
      mode: "LIVE",
    },
  });
  return { instance, task, version };
}

export function completeWorkflowTask(
  store: Store,
  principal: Principal,
  taskId: string,
  input: {
    decision: "approved" | "rejected";
    reason?: string;
    idempotencyKey: string;
    mode?: ExecutionContext["mode"];
  },
  correlationId: string,
) {
  ensureWorkflowCollections(store);
  const mode = input.mode ?? "LIVE";
  const ctx: ExecutionContext = { mode, correlationId, actorPrincipalId: principal.id };
  try {
    assertLiveAllowed(ctx, "completeWorkflowTask");
  } catch {
    emitTelemetry({ event: "simulation_live_action_blocked", fields: { action: "completeWorkflowTask" } });
    return { error: "forbidden" as const, reason: "simulation_cannot_mutate" };
  }

  if (taskLocks.has(taskId)) {
    return { error: "conflict" as const, reason: "concurrent_transition" };
  }
  taskLocks.add(taskId);
  try {
    return completeWorkflowTaskLocked(store, principal, taskId, input, correlationId);
  } finally {
    taskLocks.delete(taskId);
  }
}

function completeWorkflowTaskLocked(
  store: Store,
  principal: Principal,
  taskId: string,
  input: { decision: "approved" | "rejected"; reason?: string; idempotencyKey: string },
  correlationId: string,
) {
  const task = store.workflowTasks.find((t) => t.id === taskId);
  if (!task || task.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const existing = store.workflowTasks.find(
    (t) => t.tenantId === principal.tenantId && t.idempotencyKey === input.idempotencyKey,
  );
  if (existing && existing.id === taskId && existing.status !== "pending") {
    emitTelemetry({ event: "idempotency_replay", fields: { taskId, idempotencyKey: input.idempotencyKey } });
    return { task: existing, idempotent: true as const };
  }
  if (existing && existing.id !== taskId) {
    emitTelemetry({ event: "idempotency_conflict", fields: { taskId, idempotencyKey: input.idempotencyKey } });
    return { error: "conflict" as const, reason: "idempotency_key_reuse" };
  }

  if (task.taskType === "human_approval" && principal.actorType === "AiAgent") {
    deny(store, principal, "workflow:approve:task", "workflow_task", correlationId, "ai_cannot_approve", taskId);
    return { error: "forbidden" as const, reason: "ai_cannot_approve" };
  }

  if (task.authorityExpiresAt && new Date(task.authorityExpiresAt).getTime() < Date.now()) {
    deny(store, principal, "workflow:approve:task", "workflow_task", correlationId, "authority_expired", taskId);
    return { error: "forbidden" as const, reason: "authority_expired" };
  }

  const decision = authorize({
    principal,
    permission: "workflow:approve:task",
    action: "approve:workflow_task",
    resource: {
      tenantId: task.tenantId,
      type: "workflow_task",
      id: task.id,
      classification: "Confidential",
    },
  });
  if (decision.result === "deny") {
    deny(store, principal, "workflow:approve:task", "workflow_task", correlationId, decision.reason, taskId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const instance = store.workflowInstances.find((i) => i.id === task.instanceId);
  if (!instance) return { error: "not_found" as const };
  if (instance.status === "cancelled") {
    return { error: "conflict" as const, reason: "instance_cancelled" };
  }
  if (instance.status !== "running") return { error: "conflict" as const, reason: "instance_not_running" };
  const version = store.workflowVersions.find((v) => v.id === instance.versionId);
  if (!version || version.status !== "published") {
    return { error: "conflict" as const, reason: "version_not_effective" };
  }

  const gate = canDecide({
    task: {
      id: task.id,
      tenantId: task.tenantId,
      actionClass: "workflow.approval",
      resourceType: "workflow_task",
      resourceId: task.id,
      status: task.status === "pending" ? "pending" : "approved",
      requestedByPrincipalId: instance.startedByPrincipalId,
    },
    actorPrincipalId: principal.id,
    actorType: principal.actorType,
    outcome: input.decision,
  });
  if (!gate.allow) {
    deny(store, principal, "workflow:approve:task", "workflow_task", correlationId, gate.reason, taskId);
    return { error: "forbidden" as const, reason: gate.reason };
  }

  const sod = sodViolation(store.sodRules, store.actions, {
    principalId: principal.id,
    action: "workflow:approve:task",
    objectId: instance.id,
  });
  if (sod) {
    deny(store, principal, "workflow:approve:task", "workflow_task", correlationId, "sod", taskId);
    return { error: "forbidden" as const, reason: "sod" };
  }

  if (task.status !== "pending") return { error: "conflict" as const, reason: "not_pending" };

  const previousStatus = task.status;
  task.status = input.decision === "approved" ? "completed" : "rejected";
  task.decision = input.decision;
  if (input.reason !== undefined) task.reason = input.reason;
  task.idempotencyKey = input.idempotencyKey;
  task.completedAt = new Date().toISOString();
  store.actions.push({
    principalId: principal.id,
    action: "workflow:approve:task",
    objectId: instance.id,
  });

  const next = nextNodeKey(version.graph, task.nodeKey, input.decision);
  let nextTask: WorkflowTask | undefined;
  if (!next) {
    instance.status = input.decision === "approved" ? "completed" : "cancelled";
    delete instance.currentNodeKey;
    emitTelemetry({
      event: input.decision === "approved" ? "workflow_completed" : "workflow_cancelled",
      fields: { instanceId: instance.id },
    });
  } else {
    instance.currentNodeKey = next;
    const node = version.graph.nodes.find((n) => n.key === next);
    nextTask = {
      id: newId(),
      tenantId: principal.tenantId,
      instanceId: instance.id,
      nodeKey: next,
      taskType: node?.type ?? "human_approval",
      status: "pending",
    };
    store.workflowTasks.push(nextTask);
    emitTelemetry({ event: "task_created", fields: { taskId: nextTask.id, instanceId: instance.id } });
  }

  emitTelemetry({
    event: input.decision === "approved" ? "approval_completed" : "approval_rejected",
    fields: { taskId: task.id, instanceId: instance.id, mode: "LIVE" },
  });

  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "workflow:approve:task",
    resourceType: "workflow_task",
    resourceId: task.id,
    correlationId,
    authorization: "allow",
    previousState: { status: previousStatus },
    newState: {
      status: task.status,
      decision: task.decision,
      instanceStatus: instance.status,
      workflowVersion: version.version,
      workflowVersionId: version.id,
      idempotencyKey: input.idempotencyKey,
      mode: "LIVE",
    },
  });
  return { task, instance, nextTask };
}

export function cancelWorkflowInstance(
  store: Store,
  principal: Principal,
  instanceId: string,
  correlationId: string,
  mode: ExecutionContext["mode"] = "LIVE",
) {
  ensureWorkflowCollections(store);
  try {
    assertLiveAllowed({ mode, correlationId, actorPrincipalId: principal.id }, "cancelWorkflowInstance");
  } catch {
    return { error: "forbidden" as const, reason: "simulation_cannot_mutate" };
  }
  const decision = authorize({
    principal,
    permission: "workflow:execute:instance",
    action: "cancel:workflow_instance",
  });
  if (decision.result === "deny") {
    deny(store, principal, "workflow:execute:instance", "workflow_instance", correlationId, decision.reason, instanceId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const instance = store.workflowInstances.find((i) => i.id === instanceId && i.tenantId === principal.tenantId);
  if (!instance) return { error: "not_found" as const };
  if (instance.status === "completed" || instance.status === "cancelled") {
    return { error: "conflict" as const, reason: "terminal_state" };
  }
  const previous = instance.status;
  instance.status = "cancelled";
  for (const task of store.workflowTasks) {
    if (task.instanceId === instance.id && task.status === "pending") {
      task.status = "cancelled";
    }
  }
  emitTelemetry({ event: "workflow_cancelled", fields: { instanceId } });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "workflow:cancel:instance",
    resourceType: "workflow_instance",
    resourceId: instance.id,
    correlationId,
    authorization: "allow",
    previousState: { status: previous },
    newState: { status: "cancelled", mode: "LIVE" },
  });
  return { instance };
}

export function escalateOverdueTasks(store: Store, now = Date.now()): WorkflowTask[] {
  ensureWorkflowCollections(store);
  const escalated: WorkflowTask[] = [];
  for (const task of store.workflowTasks) {
    if (task.status !== "pending" || !task.dueAt) continue;
    if (new Date(task.dueAt).getTime() > now) continue;
    task.status = "escalated";
    escalated.push(task);
    emitTelemetry({ event: "escalation", fields: { taskId: task.id, instanceId: task.instanceId } });
    emitTelemetry({ event: "task_timed_out", fields: { taskId: task.id } });
  }
  return escalated;
}

export function simulateWorkflowPath(
  store: Store,
  principal: Principal,
  input: { definitionKey: string; decisions: Array<"approved" | "rejected"> },
  correlationId = "sim",
) {
  ensureWorkflowCollections(store);
  const decision = authorize({
    principal,
    permission: "workflow:execute:instance",
    action: "simulate:workflow",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const definition = store.workflowDefinitions.find(
    (d) => d.tenantId === principal.tenantId && d.key === input.definitionKey,
  );
  if (!definition) return { error: "not_found" as const };
  const version = store.workflowVersions
    .filter((v) => v.definitionId === definition.id && v.status === "published")
    .sort((a, b) => b.version - a.version)[0];
  if (!version) return { error: "conflict" as const, reason: "no_published_version" };

  const path: string[] = [version.graph.start];
  let current = version.graph.start;
  for (const d of input.decisions) {
    const next = nextNodeKey(version.graph, current, d);
    if (!next) break;
    path.push(next);
    current = next;
  }
  emitTelemetry({
    event: "simulation_executed",
    fields: { definitionKey: input.definitionKey, version: version.version, mode: "SIMULATION" },
  });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "workflow:simulate",
    resourceType: "workflow_definition",
    resourceId: definition.id,
    correlationId,
    authorization: "allow",
    newState: { simulated: true, executed: false, path, mode: "SIMULATION", workflowVersion: version.version },
  });
  // Explicit: no instance/task mutation, no notifications, no outbox.
  return {
    simulated: true as const,
    executed: false as const,
    mode: "SIMULATION" as const,
    path,
    version: version.version,
    sideEffects: [] as const,
  };
}

export function retireRuleVersion(
  store: Store,
  principal: Principal,
  versionId: string,
  correlationId: string,
) {
  ensureWorkflowCollections(store);
  const version = store.businessRuleVersions.find((v) => v.id === versionId);
  if (!version) return { error: "not_found" as const };
  const rule = store.businessRules.find((r) => r.id === version.ruleId && r.tenantId === principal.tenantId);
  if (!rule) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "rules:approve:rule",
    action: "retire:rule",
  });
  if (decision.result === "deny") {
    deny(store, principal, "rules:approve:rule", "business_rule_version", correlationId, decision.reason, versionId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  version.status = "retired";
  emitTelemetry({ event: "rule_retired", fields: { versionId, ruleKey: rule.key } });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "rules:retire:rule",
    resourceType: "business_rule_version",
    resourceId: version.id,
    correlationId,
    authorization: "allow",
    newState: { status: "retired" },
  });
  return { version };
}

export function executeEffectiveRule(
  store: Store,
  principal: Principal,
  versionId: string,
  input: Record<string, unknown>,
  correlationId: string,
  mode: ExecutionContext["mode"] = "LIVE",
) {
  ensureWorkflowCollections(store);
  if (mode === "SIMULATION") {
    return simulateRuleVersion(store, principal, versionId, input, correlationId);
  }
  const decision = authorize({
    principal,
    permission: "rules:simulate:rule",
    action: "execute:rule",
  });
  if (decision.result === "deny") {
    emitTelemetry({ event: "rule_rejected", fields: { versionId, reason: decision.reason } });
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const version = store.businessRuleVersions.find((v) => v.id === versionId);
  if (!version) return { error: "not_found" as const };
  const rule = store.businessRules.find((r) => r.id === version.ruleId && r.tenantId === principal.tenantId);
  if (!rule) return { error: "not_found" as const };

  const outcome = evaluateEffectiveRule(version, input);
  emitTelemetry({
    event: outcome.reason ? "rule_rejected" : "rule_evaluated",
    fields: {
      versionId,
      ruleKey: rule.key,
      matched: outcome.matched,
      reason: outcome.reason,
      mode: "LIVE",
    },
  });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "rules:execute:rule",
    resourceType: "business_rule_version",
    resourceId: version.id,
    correlationId,
    authorization: "allow",
    newState: {
      matched: outcome.matched,
      result: outcome.result,
      ruleVersionId: version.id,
      ruleVersion: version.version,
      mode: "LIVE",
      ...(outcome.reason !== undefined ? { reason: outcome.reason } : {}),
    },
  });
  return { ...outcome, ruleKey: rule.key, version: version.version };
}

export function createRule(
  store: Store,
  principal: Principal,
  input: {
    key: string;
    name: string;
    purpose?: string;
    condition: BusinessRuleVersion["condition"];
    result: Record<string, unknown>;
    priority?: number;
  },
  correlationId: string,
) {
  ensureWorkflowCollections(store);
  const decision = authorize({
    principal,
    permission: "rules:write:rule",
    action: "write:rule",
  });
  if (decision.result === "deny") {
    deny(store, principal, "rules:write:rule", "business_rule", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  let rule = store.businessRules.find((r) => r.tenantId === principal.tenantId && r.key === input.key);
  if (!rule) {
    rule = {
      id: newId(),
      tenantId: principal.tenantId,
      key: input.key,
      name: input.name,
      ...(input.purpose !== undefined ? { purpose: input.purpose } : {}),
      ownerPrincipalId: principal.id,
    };
    store.businessRules.push(rule);
  }
  const versionNum =
    store.businessRuleVersions.filter((v) => v.ruleId === rule!.id).reduce((m, v) => Math.max(m, v.version), 0) + 1;
  const version: BusinessRuleVersion = {
    id: newId(),
    ruleId: rule.id,
    version: versionNum,
    status: "draft",
    condition: input.condition,
    result: input.result,
    priority: input.priority ?? 100,
    createdByPrincipalId: principal.id,
  };
  store.businessRuleVersions.push(version);
  store.actions.push({
    principalId: principal.id,
    action: "rules:write:rule",
    objectId: `${rule.key}:v${version.version}`,
  });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "rules:write:rule",
    resourceType: "business_rule_version",
    resourceId: version.id,
    correlationId,
    authorization: "allow",
    newState: { status: "draft", version: version.version },
  });
  return { rule, version };
}

export function approveRule(
  store: Store,
  principal: Principal,
  versionId: string,
  correlationId: string,
) {
  ensureWorkflowCollections(store);
  const version = store.businessRuleVersions.find((v) => v.id === versionId);
  if (!version) return { error: "not_found" as const };
  const rule = store.businessRules.find((r) => r.id === version.ruleId && r.tenantId === principal.tenantId);
  if (!rule) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "rules:approve:rule",
    action: "approve:rule",
  });
  if (decision.result === "deny") {
    deny(store, principal, "rules:approve:rule", "business_rule_version", correlationId, decision.reason, versionId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const gate = canDecide({
    task: {
      id: version.id,
      tenantId: rule.tenantId,
      actionClass: "rule.approve",
      resourceType: "business_rule_version",
      resourceId: `${rule.key}:v${version.version}`,
      status: version.status === "draft" || version.status === "review" ? "pending" : "approved",
      requestedByPrincipalId: version.createdByPrincipalId,
    },
    actorPrincipalId: principal.id,
    actorType: principal.actorType,
    outcome: "approved",
  });
  if (!gate.allow) {
    deny(store, principal, "rules:approve:rule", "business_rule_version", correlationId, gate.reason, versionId);
    return { error: "forbidden" as const, reason: gate.reason };
  }
  const sod = sodViolation(store.sodRules, store.actions, {
    principalId: principal.id,
    action: "rules:approve:rule",
    objectId: `${rule.key}:v${version.version}`,
  });
  if (sod) {
    deny(store, principal, "rules:approve:rule", "business_rule_version", correlationId, "sod", versionId);
    return { error: "forbidden" as const, reason: "sod" };
  }
  if (version.status === "effective") return { error: "conflict" as const, reason: "already_effective" };
  version.status = "effective";
  version.approvedByPrincipalId = principal.id;
  version.effectiveFrom = new Date().toISOString();
  store.actions.push({
    principalId: principal.id,
    action: "rules:approve:rule",
    objectId: `${rule.key}:v${version.version}`,
  });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "rules:approve:rule",
    resourceType: "business_rule_version",
    resourceId: version.id,
    correlationId,
    authorization: "allow",
    newState: { status: "effective" },
  });
  return { version };
}

export function simulateRuleVersion(
  store: Store,
  principal: Principal,
  versionId: string,
  input: Record<string, unknown>,
  correlationId = "sim",
) {
  ensureWorkflowCollections(store);
  const decision = authorize({
    principal,
    permission: "rules:simulate:rule",
    action: "simulate:rule",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const version = store.businessRuleVersions.find((v) => v.id === versionId);
  if (!version) return { error: "not_found" as const };
  const rule = store.businessRules.find((r) => r.id === version.ruleId && r.tenantId === principal.tenantId);
  if (!rule) return { error: "not_found" as const };
  const outcome = simulateRule(version, input);
  emitTelemetry({
    event: "simulation_executed",
    fields: { ruleKey: rule.key, version: version.version, mode: "SIMULATION" },
  });
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "rules:simulate:rule",
    resourceType: "business_rule_version",
    resourceId: version.id,
    correlationId,
    authorization: "allow",
    newState: { ...outcome, ruleKey: rule.key, ruleVersion: version.version },
  });
  return { ...outcome, ruleKey: rule.key, version: version.version };
}
