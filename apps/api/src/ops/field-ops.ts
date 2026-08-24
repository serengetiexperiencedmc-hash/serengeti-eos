import {
  authorize,
  canIssueOpsBrief,
  canTransitionFieldTask,
  newId,
  type OpsAssignment,
  type OpsBrief,
  type OpsFieldTask,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowOpsAudit, denyOpsAudit } from "./audit.js";
import { ensureOpsCollections } from "./collections.js";
import { autoCompleteHandoverTaskByKey } from "./handover-sync.js";

function sanitizeAssignment(a: OpsAssignment) {
  return {
    id: a.id,
    bookingId: a.bookingId,
    programmeId: a.programmeId,
    principalId: a.principalId,
    role: a.role,
    status: a.status,
    notes: a.notes,
  };
}

function sanitizeFieldTask(t: OpsFieldTask) {
  return {
    id: t.id,
    bookingId: t.bookingId,
    assignmentId: t.assignmentId,
    title: t.title,
    description: t.description,
    dueDate: t.dueDate,
    status: t.status,
    completedAt: t.completedAt,
  };
}

function sanitizeBrief(b: OpsBrief) {
  return {
    id: b.id,
    bookingId: b.bookingId,
    programmeId: b.programmeId,
    content: b.content,
    issuedAt: b.issuedAt,
  };
}

function findBooking(store: Store, tenantId: string, bookingId: string) {
  return store.bkgBookings.find((b) => b.id === bookingId && b.tenantId === tenantId && !b.archivedAt);
}

export function listAssignments(store: Store, principal: Principal, query?: { bookingId?: string }) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_assignment" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.opsAssignments.filter((a) => a.tenantId === principal.tenantId);
  if (query?.bookingId) items = items.filter((a) => a.bookingId === query.bookingId);
  return { items: items.map(sanitizeAssignment) };
}

export type CreateAssignmentInput = {
  bookingId: string;
  principalId: string;
  role: OpsAssignment["role"];
  notes?: string;
};

export function createAssignment(store: Store, principal: Principal, input: CreateAssignmentInput, correlationId: string) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:write:operations", action: "create:ops_assignment" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:operations", "ops_assignment", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const booking = findBooking(store, principal.tenantId, input.bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const now = new Date().toISOString();
  const row: OpsAssignment = {
    id: newId(),
    tenantId: principal.tenantId,
    bookingId: input.bookingId,
    programmeId: booking.programmeId,
    principalId: input.principalId,
    role: input.role,
    status: "active",
    notes: input.notes,
    classification: booking.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.opsAssignments.push(row);
  allowOpsAudit(store, principal, "ops:write:operations", "ops_assignment", row.id, correlationId);
  return { assignment: sanitizeAssignment(row) };
}

export function listFieldTasks(store: Store, principal: Principal, query?: { bookingId?: string }) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_field_task" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.opsFieldTasks.filter((t) => t.tenantId === principal.tenantId);
  if (query?.bookingId) items = items.filter((t) => t.bookingId === query.bookingId);
  items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return { items: items.map(sanitizeFieldTask) };
}

export type CreateFieldTaskInput = {
  bookingId: string;
  assignmentId?: string;
  title: string;
  description?: string;
  dueDate?: string;
};

export function createFieldTask(store: Store, principal: Principal, input: CreateFieldTaskInput, correlationId: string) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:write:operations", action: "create:ops_field_task" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:operations", "ops_field_task", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const booking = findBooking(store, principal.tenantId, input.bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const now = new Date().toISOString();
  const row: OpsFieldTask = {
    id: newId(),
    tenantId: principal.tenantId,
    bookingId: input.bookingId,
    assignmentId: input.assignmentId,
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    status: "pending",
    classification: booking.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.opsFieldTasks.push(row);
  allowOpsAudit(store, principal, "ops:write:operations", "ops_field_task", row.id, correlationId);
  return { task: sanitizeFieldTask(row) };
}

export function completeFieldTask(store: Store, principal: Principal, taskId: string, correlationId: string) {
  ensureOpsCollections(store);
  const row = store.opsFieldTasks.find((t) => t.id === taskId && t.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };

  const decision = authorize({ principal, permission: "ops:write:operations", action: "complete:ops_field_task" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:operations", "ops_field_task", correlationId, decision.reason, taskId);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const gate = canTransitionFieldTask(row.status, "complete");
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  const now = new Date().toISOString();
  row.status = "complete";
  row.completedAt = now;
  row.completedByPrincipalId = principal.id;
  row.updatedAt = now;
  row.version += 1;
  row.updatedByPrincipalId = principal.id;
  allowOpsAudit(store, principal, "ops:write:operations", "ops_field_task", taskId, correlationId);
  return { task: sanitizeFieldTask(row) };
}

export function getBriefByBooking(store: Store, principal: Principal, bookingId: string) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:read:operations", action: "read:ops_brief" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const brief = store.opsBriefs.find((b) => b.bookingId === bookingId && b.tenantId === principal.tenantId);
  if (!brief) return { error: "not_found" as const };
  return { brief: sanitizeBrief(brief) };
}

export function createOrUpdateBrief(
  store: Store,
  principal: Principal,
  bookingId: string,
  content: string,
  correlationId: string,
) {
  ensureOpsCollections(store);
  const decision = authorize({ principal, permission: "ops:write:operations", action: "write:ops_brief" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:operations", "ops_brief", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const booking = findBooking(store, principal.tenantId, bookingId);
  if (!booking) return { error: "not_found" as const, reason: "booking_not_found" };

  const now = new Date().toISOString();
  let brief = store.opsBriefs.find((b) => b.bookingId === bookingId && b.tenantId === principal.tenantId);
  if (brief) {
    if (brief.issuedAt) return { error: "conflict" as const, reason: "brief_already_issued" };
    brief.content = content;
    brief.updatedAt = now;
    brief.version += 1;
    brief.updatedByPrincipalId = principal.id;
  } else {
    brief = {
      id: newId(),
      tenantId: principal.tenantId,
      bookingId,
      programmeId: booking.programmeId,
      content,
      classification: booking.classification,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: principal.id,
      updatedByPrincipalId: principal.id,
    };
    store.opsBriefs.push(brief);
  }
  allowOpsAudit(store, principal, "ops:write:operations", "ops_brief", brief.id, correlationId);
  return { brief: sanitizeBrief(brief) };
}

export function issueOpsBrief(store: Store, principal: Principal, bookingId: string, correlationId: string) {
  ensureOpsCollections(store);
  const brief = store.opsBriefs.find((b) => b.bookingId === bookingId && b.tenantId === principal.tenantId);
  if (!brief) return { error: "not_found" as const, reason: "brief_not_found" };

  const decision = authorize({ principal, permission: "ops:write:operations", action: "issue:ops_brief" });
  if (decision.result === "deny") {
    denyOpsAudit(store, principal, "ops:write:operations", "ops_brief", correlationId, decision.reason, brief.id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const gate = canIssueOpsBrief(brief);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  const now = new Date().toISOString();
  brief.issuedAt = now;
  brief.issuedByPrincipalId = principal.id;
  brief.updatedAt = now;
  brief.version += 1;
  brief.updatedByPrincipalId = principal.id;

  autoCompleteHandoverTaskByKey(store, principal.tenantId, bookingId, "ops_brief", principal.id);
  allowOpsAudit(store, principal, "ops:write:operations", "ops_brief", brief.id, correlationId, { issued: true });
  return { brief: sanitizeBrief(brief) };
}

export function getOpsModuleHealth(store: Store, principal: Principal) {
  ensureOpsCollections(store);
  const decision = authorize({
    principal,
    permission: "ops:read:operations",
    action: "read:ops_health",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const tenantId = principal.tenantId;
  return {
    module: "ops",
    increment: "O5",
    status: "ok" as const,
    supplierConfirmations: store.opsSupplierConfirmations.filter((c) => c.tenantId === tenantId).length,
    manifests: store.opsManifests.filter((m) => m.tenantId === tenantId).length,
    assignments: store.opsAssignments.filter((a) => a.tenantId === tenantId).length,
    fieldTasks: store.opsFieldTasks.filter((t) => t.tenantId === tenantId).length,
    briefs: store.opsBriefs.filter((b) => b.tenantId === tenantId).length,
    vouchers: (store.opsVouchers ?? []).filter((v) => v.tenantId === tenantId).length,
    workbench: store.bkgBookings.filter(
      (b) =>
        b.tenantId === tenantId &&
        !b.archivedAt &&
        (b.status === "confirmed" || b.status === "handover_pending" || b.status === "handed_over"),
    ).length,
  };
}
