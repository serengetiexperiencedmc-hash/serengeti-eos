import {
  authorize,
  canCancelTask,
  canCompleteTask,
  canTransitionTask,
  clearanceAllows,
  CRM_EVENT_TYPES,
  isValidTaskPriority,
  isValidTaskStatus,
  maxClassification,
  newId,
  parseOccurredAt,
  type Classification,
  type CrmEventType,
  type CrmTask,
  type CrmTaskStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";

const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 100;

function taskResource(task: CrmTask) {
  return {
    tenantId: task.tenantId,
    type: "crm_task" as const,
    id: task.id,
    classification: task.classification,
    ownerPrincipalId: task.assigneePrincipalId,
  };
}

function findTask(store: Store, tenantId: string, id: string): CrmTask | undefined {
  const task = store.crmTasks.find((t) => t.id === id);
  if (!task || task.tenantId !== tenantId) return undefined;
  return task;
}

function resolveTaskClassification(
  store: Store,
  tenantId: string,
  input: {
    classification?: Classification;
    relatedOrganizationId?: string;
    relatedContactId?: string;
    relatedAccountId?: string;
    relatedActivityId?: string;
  },
): Classification | { error: "invalid_request"; reason: string } {
  let classification: Classification = input.classification ?? "Internal";
  if (input.relatedContactId) {
    const c = store.crmContacts.find((x) => x.id === input.relatedContactId && x.tenantId === tenantId);
    if (!c) return { error: "invalid_request", reason: "invalid_contact" };
    classification = maxClassification(classification, c.classification);
  }
  if (input.relatedOrganizationId) {
    const o = store.crmOrganizations.find((x) => x.id === input.relatedOrganizationId && x.tenantId === tenantId);
    if (!o) return { error: "invalid_request", reason: "invalid_organization" };
    classification = maxClassification(classification, o.classification);
  }
  if (input.relatedAccountId) {
    const a = store.crmAccounts.find((x) => x.id === input.relatedAccountId && x.tenantId === tenantId);
    if (!a) return { error: "invalid_request", reason: "invalid_account" };
    classification = maxClassification(classification, a.classification);
  }
  if (input.relatedActivityId) {
    const act = store.crmActivities.find((x) => x.id === input.relatedActivityId && x.tenantId === tenantId);
    if (!act) return { error: "invalid_request", reason: "invalid_activity" };
    classification = maxClassification(classification, act.classification);
  }
  return classification;
}

export function listTasks(
  store: Store,
  principal: Principal,
  query?: {
    status?: string;
    assigneePrincipalId?: string;
    relatedOrganizationId?: string;
    relatedContactId?: string;
    relatedAccountId?: string;
    dueBefore?: string;
    dueAfter?: string;
    limit?: number;
    cursor?: string;
  },
) {
  ensureCrmCollections(store);
  const decision = authorize({
    principal,
    permission: "crm:read:task",
    action: "read:crm_task",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.crmTasks.filter((t) => t.tenantId === principal.tenantId);
  if (query?.status) {
    if (!isValidTaskStatus(query.status)) return { error: "invalid_request" as const, reason: "invalid_status" };
    items = items.filter((t) => t.status === query.status);
  }
  if (query?.assigneePrincipalId) items = items.filter((t) => t.assigneePrincipalId === query.assigneePrincipalId);
  if (query?.relatedOrganizationId) {
    items = items.filter((t) => t.relatedOrganizationId === query.relatedOrganizationId);
  }
  if (query?.relatedContactId) items = items.filter((t) => t.relatedContactId === query.relatedContactId);
  if (query?.relatedAccountId) items = items.filter((t) => t.relatedAccountId === query.relatedAccountId);
  if (query?.dueAfter) {
    const parsed = parseOccurredAt(query.dueAfter);
    if (!parsed.ok) return { error: "invalid_request" as const, reason: "invalid_due_after" };
    items = items.filter((t) => t.dueAt && t.dueAt >= parsed.iso);
  }
  if (query?.dueBefore) {
    const parsed = parseOccurredAt(query.dueBefore);
    if (!parsed.ok) return { error: "invalid_request" as const, reason: "invalid_due_before" };
    items = items.filter((t) => t.dueAt && t.dueAt <= parsed.iso);
  }
  items = items.filter((t) => clearanceAllows(principal.classificationClearance, t.classification));
  items.sort((a, b) => {
    const da = a.dueAt ?? "9999";
    const db = b.dueAt ?? "9999";
    return da.localeCompare(db);
  });

  const limit = Math.min(Math.max(query?.limit ?? DEFAULT_LIST_LIMIT, 1), MAX_LIST_LIMIT);
  if (query?.cursor) {
    const idx = items.findIndex((t) => t.id === query.cursor);
    if (idx >= 0) items = items.slice(idx + 1);
  }
  const page = items.slice(0, limit);
  const nextCursor = page.length === limit && items.length > limit ? page[page.length - 1]?.id : undefined;
  return { items: page, ...(nextCursor !== undefined ? { nextCursor } : {}) };
}

export function getTask(store: Store, principal: Principal, taskId: string) {
  ensureCrmCollections(store);
  const task = store.crmTasks.find((t) => t.id === taskId);
  if (!task || task.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:task",
    action: "read:crm_task",
    resource: taskResource(task),
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (!clearanceAllows(principal.classificationClearance, task.classification)) {
    return { error: "forbidden" as const, reason: "classification" };
  }
  return { task };
}

export type CreateTaskInput = {
  title: string;
  description?: string;
  assigneePrincipalId?: string;
  priority?: string;
  dueAt?: string;
  relatedOrganizationId?: string;
  relatedContactId?: string;
  relatedAccountId?: string;
  relatedActivityId?: string;
  classification?: Classification;
};

export function createTask(store: Store, principal: Principal, input: CreateTaskInput, correlationId: string) {
  ensureCrmCollections(store);
  const title = input.title?.trim();
  if (!title) return { error: "invalid_request" as const, reason: "title_required" };
  if (input.priority && !isValidTaskPriority(input.priority)) {
    return { error: "invalid_request" as const, reason: "invalid_priority" };
  }
  if (input.dueAt) {
    const due = parseOccurredAt(input.dueAt);
    if (!due.ok) return { error: "invalid_request" as const, reason: "invalid_due_at" };
  }

  const classResult = resolveTaskClassification(store, principal.tenantId, input);
  if (typeof classResult === "object" && "error" in classResult) {
    return { error: "invalid_request" as const, reason: classResult.reason };
  }

  const assigneeId = input.assigneePrincipalId ?? principal.id;
  const assignee = [...store.principals.values()].find((p) => p.id === assigneeId && p.tenantId === principal.tenantId);
  if (!assignee) return { error: "invalid_request" as const, reason: "invalid_assignee" };

  const decision = authorize({
    principal,
    permission: "crm:write:task",
    action: "write:crm_task",
    resource: {
      tenantId: principal.tenantId,
      type: "crm_task",
      id: "new",
      classification: classResult,
      ownerPrincipalId: assigneeId,
    },
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:task", "crm_task", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const now = new Date().toISOString();
  const dueAtParsed = input.dueAt ? parseOccurredAt(input.dueAt) : undefined;
  const task: CrmTask = {
    id: newId(),
    tenantId: principal.tenantId,
    title,
    assigneePrincipalId: assigneeId,
    status: "Open",
    classification: classResult,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(dueAtParsed?.ok ? { dueAt: dueAtParsed.iso } : {}),
    ...(input.relatedOrganizationId !== undefined ? { relatedOrganizationId: input.relatedOrganizationId } : {}),
    ...(input.relatedContactId !== undefined ? { relatedContactId: input.relatedContactId } : {}),
    ...(input.relatedAccountId !== undefined ? { relatedAccountId: input.relatedAccountId } : {}),
    ...(input.relatedActivityId !== undefined ? { relatedActivityId: input.relatedActivityId } : {}),
  };

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.TASK_CREATED,
    entityType: "task",
    entityId: task.id,
    classification: task.classification,
    correlationId,
    payload: { taskId: task.id },
    mutate: () => {
      store.crmTasks.push(task);
      allowCrmAudit(store, principal, "crm:write:task", "crm_task", task.id, correlationId, {
        id: task.id,
        title: task.title,
        status: task.status,
      });
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { task };
}

export type UpdateTaskInput = Partial<
  Pick<CreateTaskInput, "title" | "description" | "priority" | "dueAt" | "assigneePrincipalId">
> & {
  status?: CrmTaskStatus;
};

export function updateTask(
  store: Store,
  principal: Principal,
  taskId: string,
  input: UpdateTaskInput,
  correlationId: string,
  expectedVersion?: number,
) {
  ensureCrmCollections(store);
  const task = findTask(store, principal.tenantId, taskId);
  if (!task) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:task",
    action: "write:crm_task",
    resource: taskResource(task),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:task", "crm_task", correlationId, decision.reason, taskId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (task.status === "Completed" || task.status === "Cancelled") {
    return { error: "conflict" as const, reason: "task_not_mutable" };
  }
  if (expectedVersion !== undefined && task.version !== expectedVersion) {
    return { error: "conflict" as const, reason: "version_mismatch" };
  }

  const previousState = { ...task };

  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid_request" as const, reason: "title_required" };
    task.title = title;
  }
  if (input.description !== undefined) task.description = input.description;
  if (input.priority !== undefined) {
    if (input.priority && !isValidTaskPriority(input.priority)) {
      return { error: "invalid_request" as const, reason: "invalid_priority" };
    }
    task.priority = input.priority;
  }
  if (input.dueAt !== undefined) {
    if (input.dueAt === "") delete task.dueAt;
    else {
      const due = parseOccurredAt(input.dueAt);
      if (!due.ok) return { error: "invalid_request" as const, reason: "invalid_due_at" };
      task.dueAt = due.iso;
    }
  }
  if (input.assigneePrincipalId !== undefined) {
    const assignee = [...store.principals.values()].find(
      (p) => p.id === input.assigneePrincipalId && p.tenantId === principal.tenantId,
    );
    if (!assignee) return { error: "invalid_request" as const, reason: "invalid_assignee" };
    task.assigneePrincipalId = input.assigneePrincipalId;
  }
  if (input.status !== undefined) {
    if (!isValidTaskStatus(input.status)) return { error: "invalid_request" as const, reason: "invalid_status" };
    if (!canTransitionTask(task.status, input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    task.status = input.status;
    if (input.status === "Completed") task.completedAt = new Date().toISOString();
  }

  task.version += 1;
  task.updatedAt = new Date().toISOString();
  task.updatedByPrincipalId = principal.id;

  let taskEventType: CrmEventType = CRM_EVENT_TYPES.TASK_UPDATED;
  if (input.status === "Completed") taskEventType = CRM_EVENT_TYPES.TASK_COMPLETED;
  else if (input.status === "Cancelled") taskEventType = CRM_EVENT_TYPES.TASK_CANCELLED;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: taskEventType,
    entityType: "task",
    entityId: task.id,
    classification: task.classification,
    correlationId,
    payload: { taskId: task.id },
    mutate: () => {
      allowCrmAudit(store, principal, "crm:write:task", "crm_task", task.id, correlationId, {
        id: task.id,
        status: task.status,
        assigneePrincipalId: task.assigneePrincipalId,
      }, previousState);
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { task };
}

export function completeTask(store: Store, principal: Principal, taskId: string, correlationId: string) {
  ensureCrmCollections(store);
  const task = findTask(store, principal.tenantId, taskId);
  if (!task) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:task",
    action: "complete:crm_task",
    resource: taskResource(task),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:task", "crm_task", correlationId, decision.reason, taskId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (!canCompleteTask(task.status)) return { error: "conflict" as const, reason: "invalid_complete_state" };

  const previousState = { status: task.status };
  task.status = "Completed";
  task.completedAt = new Date().toISOString();
  task.version += 1;
  task.updatedAt = task.completedAt;
  task.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.TASK_COMPLETED,
    entityType: "task",
    entityId: task.id,
    classification: task.classification,
    correlationId,
    payload: { taskId: task.id },
    mutate: () => {
      allowCrmAudit(store, principal, "crm:write:task", "crm_task", task.id, correlationId, {
        status: task.status,
        completedAt: task.completedAt,
      }, previousState);
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { task };
}

export function cancelTask(store: Store, principal: Principal, taskId: string, correlationId: string) {
  ensureCrmCollections(store);
  const task = findTask(store, principal.tenantId, taskId);
  if (!task) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:write:task",
    action: "cancel:crm_task",
    resource: taskResource(task),
  });
  if (decision.result === "deny") {
    denyCrmAudit(store, principal, "crm:write:task", "crm_task", correlationId, decision.reason, taskId);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (!canCancelTask(task.status)) return { error: "conflict" as const, reason: "invalid_cancel_state" };

  const previousState = { status: task.status };
  task.status = "Cancelled";
  task.version += 1;
  task.updatedAt = new Date().toISOString();
  task.updatedByPrincipalId = principal.id;

  const committed = commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.TASK_CANCELLED,
    entityType: "task",
    entityId: task.id,
    classification: task.classification,
    correlationId,
    payload: { taskId: task.id },
    mutate: () => {
      allowCrmAudit(store, principal, "crm:write:task", "crm_task", task.id, correlationId, {
        status: task.status,
      }, previousState);
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };
  return { task };
}
