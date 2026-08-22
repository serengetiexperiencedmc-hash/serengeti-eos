export type WorkflowInstanceStatus =
  | "draft"
  | "running"
  | "suspended"
  | "completed"
  | "cancelled"
  | "failed";

export type TaskStatus =
  | "pending"
  | "claimed"
  | "completed"
  | "rejected"
  | "cancelled"
  | "escalated"
  | "timed_out";

export type TaskType = "human_approval" | "system" | "review";

export type WorkflowNode = {
  key: string;
  type: TaskType;
  name: string;
  assigneeRole?: string;
  slaMinutes?: number;
  nextOnApprove?: string;
  nextOnReject?: string;
};

export type WorkflowGraph = {
  start: string;
  nodes: WorkflowNode[];
};

export type WorkflowDefinition = {
  id: string;
  tenantId: string;
  key: string;
  name: string;
  ownerPrincipalId: string;
};

export type WorkflowVersion = {
  id: string;
  definitionId: string;
  version: number;
  status: "draft" | "published" | "retired";
  graph: WorkflowGraph;
  createdByPrincipalId: string;
  publishedAt?: string;
};

export type WorkflowInstance = {
  id: string;
  tenantId: string;
  definitionId: string;
  versionId: string;
  status: WorkflowInstanceStatus;
  businessKey?: string;
  context: Record<string, unknown>;
  startedByPrincipalId: string;
  currentNodeKey?: string;
};

export type WorkflowTask = {
  id: string;
  tenantId: string;
  instanceId: string;
  nodeKey: string;
  taskType: TaskType;
  status: TaskStatus;
  assigneePrincipalId?: string;
  dueAt?: string;
  authorityExpiresAt?: string;
  decision?: "approved" | "rejected";
  reason?: string;
  idempotencyKey?: string;
  completedAt?: string;
  ruleVersionId?: string;
};

export type RuleStatus = "draft" | "test" | "review" | "approved" | "effective" | "retired";

export type RuleCondition = {
  all?: Array<{ path: string; op: "eq" | "gte" | "lte" | "neq"; value: unknown }>;
};

export type BusinessRule = {
  id: string;
  tenantId: string;
  key: string;
  name: string;
  purpose?: string;
  ownerPrincipalId: string;
};

export type BusinessRuleVersion = {
  id: string;
  ruleId: string;
  version: number;
  status: RuleStatus;
  condition: RuleCondition;
  result: Record<string, unknown>;
  priority: number;
  effectiveFrom?: string;
  expiresAt?: string;
  createdByPrincipalId: string;
  approvedByPrincipalId?: string;
};

export function evaluateCondition(
  condition: RuleCondition,
  input: Record<string, unknown>,
): boolean {
  const clauses = condition.all ?? [];
  if (clauses.length === 0) return true;
  return clauses.every((clause) => {
    const actual = input[clause.path];
    switch (clause.op) {
      case "eq":
        return actual === clause.value;
      case "neq":
        return actual !== clause.value;
      case "gte":
        return typeof actual === "number" && typeof clause.value === "number" && actual >= clause.value;
      case "lte":
        return typeof actual === "number" && typeof clause.value === "number" && actual <= clause.value;
      default:
        return false;
    }
  });
}

export function simulateRule(
  version: BusinessRuleVersion,
  input: Record<string, unknown>,
): { matched: boolean; result: Record<string, unknown> | null; executed: false; mode: "SIMULATION" } {
  // Simulation evaluates any version for design-time testing; never marks executed.
  const matched = evaluateCondition(version.condition, input);
  return { matched, result: matched ? version.result : null, executed: false, mode: "SIMULATION" };
}

export function evaluateEffectiveRule(
  version: BusinessRuleVersion,
  input: Record<string, unknown>,
  now = Date.now(),
): {
  matched: boolean;
  result: Record<string, unknown> | null;
  executed: boolean;
  mode: "LIVE";
  reason?: string;
  ruleVersionId: string;
} {
  const applicability = ruleIsApplicable(version, now);
  if (!applicability.ok) {
    return {
      matched: false,
      result: null,
      executed: false,
      mode: "LIVE",
      ruleVersionId: version.id,
      ...(applicability.reason !== undefined ? { reason: applicability.reason } : {}),
    };
  }
  const matched = evaluateCondition(version.condition, input);
  return {
    matched,
    result: matched ? version.result : null,
    executed: true,
    mode: "LIVE",
    ruleVersionId: version.id,
  };
}

export function ruleIsApplicable(
  version: BusinessRuleVersion,
  now = Date.now(),
): { ok: boolean; reason?: string } {
  if (version.status === "retired") return { ok: false, reason: "rule_retired" };
  if (version.status !== "effective") return { ok: false, reason: "rule_not_effective" };
  if (version.effectiveFrom && new Date(version.effectiveFrom).getTime() > now) {
    return { ok: false, reason: "rule_not_yet_effective" };
  }
  if (version.expiresAt && new Date(version.expiresAt).getTime() <= now) {
    return { ok: false, reason: "rule_expired" };
  }
  return { ok: true };
}

export function nextNodeKey(
  graph: WorkflowGraph,
  currentKey: string,
  decision: "approved" | "rejected",
): string | undefined {
  const node = graph.nodes.find((n) => n.key === currentKey);
  if (!node) return undefined;
  return decision === "approved" ? node.nextOnApprove : node.nextOnReject;
}
