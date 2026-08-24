import {
  authorize,
  canTransitionLeave,
  computeLeaveDays,
  isValidEmployeeStatus,
  isValidLeaveStatus,
  isValidLeaveType,
  isValidSkillProficiency,
  newId,
  nextEmployeeCode,
  sodViolation,
  type EmployeeStatus,
  type HrEmployee,
  type HrEmployeeSkill,
  type HrLeaveRequest,
  type HrSkill,
  type LeaveAction,
  type LeaveType,
  type Principal,
  type SkillProficiency,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { principalById, recordAudit } from "../store.js";
import { ensureHrCollections } from "./collections.js";

function tenantEmployees(store: Store, tenantId: string) {
  return store.hrEmployees.filter((e) => e.tenantId === tenantId);
}

function findEmployee(store: Store, tenantId: string, id: string) {
  return store.hrEmployees.find((e) => e.id === id && e.tenantId === tenantId);
}

function findSkill(store: Store, tenantId: string, id: string) {
  return store.hrSkills.find((s) => s.id === id && s.tenantId === tenantId);
}

function findLeave(store: Store, tenantId: string, id: string) {
  return store.hrLeaveRequests.find((l) => l.id === id && eTenant(l, tenantId));
}

function eTenant(row: { tenantId: string }, tenantId: string) {
  return row.tenantId === tenantId;
}

function linkedEmail(store: Store, employee: HrEmployee): string | undefined {
  if (!employee.principalId) return employee.email;
  const principal = principalById(store, employee.principalId);
  if (principal?.tenantId === employee.tenantId && principal.email) return principal.email;
  return employee.email;
}

function orgUnitName(store: Store, employee: HrEmployee): string | undefined {
  if (!employee.orgUnitId) return undefined;
  return store.orgUnits.find((u) => u.id === employee.orgUnitId && u.tenantId === employee.tenantId)?.name;
}

function locationName(store: Store, employee: HrEmployee): string | undefined {
  if (!employee.locationId) return undefined;
  return store.locations.find((l) => l.id === employee.locationId && l.tenantId === employee.tenantId)?.name;
}

export type HrEmployeeView = {
  id: string;
  employeeCode: string;
  givenName: string;
  familyName: string;
  displayName: string;
  status: EmployeeStatus;
  skillCount: number;
  pendingLeaveCount: number;
  email?: string;
  linkedAccountEmail?: string;
  orgUnitId?: string;
  orgUnitName?: string;
  locationId?: string;
  locationName?: string;
  jobTitle?: string;
  startDate?: string;
};

export type HrSkillView = {
  id: string;
  name: string;
  category?: string;
};

export type HrEmployeeSkillView = {
  skillId: string;
  name: string;
  category?: string;
  proficiency: SkillProficiency;
};

export type HrLeaveView = {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: HrLeaveRequest["status"];
  notes?: string;
};

function employeeSkillCount(store: Store, employeeId: string, tenantId: string) {
  return store.hrEmployeeSkills.filter((s) => s.employeeId === employeeId && s.tenantId === tenantId).length;
}

function pendingLeaveCount(store: Store, employeeId: string, tenantId: string) {
  return store.hrLeaveRequests.filter(
    (l) => l.employeeId === employeeId && l.tenantId === tenantId && (l.status === "draft" || l.status === "submitted"),
  ).length;
}

function sanitizeEmployee(store: Store, employee: HrEmployee): HrEmployeeView {
  const view: HrEmployeeView = {
    id: employee.id,
    employeeCode: employee.employeeCode,
    givenName: employee.givenName,
    familyName: employee.familyName,
    displayName: `${employee.givenName} ${employee.familyName}`.trim(),
    status: employee.status,
    skillCount: employeeSkillCount(store, employee.id, employee.tenantId),
    pendingLeaveCount: pendingLeaveCount(store, employee.id, employee.tenantId),
  };
  if (employee.email) view.email = employee.email;
  const linked = linkedEmail(store, employee);
  if (linked) view.linkedAccountEmail = linked;
  if (employee.orgUnitId) view.orgUnitId = employee.orgUnitId;
  const unit = orgUnitName(store, employee);
  if (unit) view.orgUnitName = unit;
  if (employee.locationId) view.locationId = employee.locationId;
  const loc = locationName(store, employee);
  if (loc) view.locationName = loc;
  if (employee.jobTitle) view.jobTitle = employee.jobTitle;
  if (employee.startDate) view.startDate = employee.startDate;
  return view;
}

function sanitizeSkill(skill: HrSkill): HrSkillView {
  const view: HrSkillView = { id: skill.id, name: skill.name };
  if (skill.category) view.category = skill.category;
  return view;
}

function sanitizeLeave(store: Store, leave: HrLeaveRequest): HrLeaveView {
  const employee = findEmployee(store, leave.tenantId, leave.employeeId);
  const view: HrLeaveView = {
    id: leave.id,
    employeeId: leave.employeeId,
    employeeCode: employee?.employeeCode ?? "",
    employeeName: employee ? `${employee.givenName} ${employee.familyName}` : "",
    leaveType: leave.leaveType,
    startDate: leave.startDate,
    endDate: leave.endDate,
    days: leave.days,
    status: leave.status,
  };
  if (leave.notes) view.notes = leave.notes;
  return view;
}

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

export function getHrModuleHealth(store: Store, principal: Principal) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:read:employee",
    action: "read:hr_health",
  });
  if (decision.result === "deny") return deny(decision.reason);

  const tenantId = principal.tenantId;
  return {
    module: "hr",
    increment: "I10" as const,
    status: "ok" as const,
    employees: store.hrEmployees.filter((e) => e.tenantId === tenantId).length,
    skills: store.hrSkills.filter((s) => s.tenantId === tenantId).length,
    leavePending: store.hrLeaveRequests.filter(
      (l) => l.tenantId === tenantId && (l.status === "draft" || l.status === "submitted"),
    ).length,
  };
}

export function listEmployees(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:read:employee",
    action: "read:hr_employee",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidEmployeeStatus(query.status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }

  let items = tenantEmployees(store, principal.tenantId);
  if (query?.status) items = items.filter((e) => e.status === query.status);
  const q = query?.q?.trim().toLowerCase();
  if (q) {
    items = items.filter((e) => {
      const hay = `${e.employeeCode} ${e.givenName} ${e.familyName} ${e.email ?? ""} ${e.jobTitle ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }
  items = [...items].sort((a, b) => a.employeeCode.localeCompare(b.employeeCode));
  return { items: items.map((e) => sanitizeEmployee(store, e)) };
}

export function getEmployee(store: Store, principal: Principal, id: string) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:read:employee",
    action: "read:hr_employee",
  });
  if (decision.result === "deny") return deny(decision.reason);

  const employee = findEmployee(store, principal.tenantId, id);
  if (!employee) return { error: "not_found" as const, reason: "employee_not_found" };

  const skills = store.hrEmployeeSkills
    .filter((s) => s.employeeId === employee.id && s.tenantId === principal.tenantId)
    .map((row) => {
      const skill = findSkill(store, principal.tenantId, row.skillId);
      const view: HrEmployeeSkillView = {
        skillId: row.skillId,
        name: skill?.name ?? "",
        proficiency: row.proficiency,
      };
      if (skill?.category) view.category = skill.category;
      return view;
    });
  const leave = store.hrLeaveRequests
    .filter((l) => l.employeeId === employee.id && l.tenantId === principal.tenantId)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map((l) => sanitizeLeave(store, l));
  return { employee: sanitizeEmployee(store, employee), skills, leave };
}

function resolveLinkedPrincipal(
  store: Store,
  tenantId: string,
  linkedPrincipalEmail: string | undefined,
): { principalId?: string; error?: "invalid_request"; reason?: string } {
  const email = linkedPrincipalEmail?.trim().toLowerCase();
  if (!email) return {};
  const principal = [...store.principals.values()].find(
    (p) => p.tenantId === tenantId && p.email?.toLowerCase() === email,
  );
  if (!principal) return { error: "invalid_request", reason: "principal_not_found" };
  return { principalId: principal.id };
}

export type CreateEmployeeInput = {
  givenName?: string;
  familyName?: string;
  email?: string;
  linkedPrincipalEmail?: string;
  orgUnitId?: string;
  locationId?: string;
  jobTitle?: string;
  startDate?: string;
  status?: string;
  employeeCode?: string;
};

export function createEmployee(
  store: Store,
  principal: Principal,
  input: CreateEmployeeInput,
  correlationId: string,
) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:write:employee",
    action: "write:hr_employee",
  });
  if (decision.result === "deny") return deny(decision.reason);

  const givenName = input.givenName?.trim();
  const familyName = input.familyName?.trim();
  if (!givenName || !familyName) {
    return { error: "invalid_request" as const, reason: "name_required" };
  }
  if (input.status && !isValidEmployeeStatus(input.status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }
  if (input.startDate && !computeLeaveDays(input.startDate, input.startDate)) {
    return { error: "invalid_request" as const, reason: "invalid_start_date" };
  }
  if (input.orgUnitId && !store.orgUnits.some((u) => u.id === input.orgUnitId && u.tenantId === principal.tenantId)) {
    return { error: "invalid_request" as const, reason: "org_unit_not_found" };
  }
  if (input.locationId && !store.locations.some((l) => l.id === input.locationId && l.tenantId === principal.tenantId)) {
    return { error: "invalid_request" as const, reason: "location_not_found" };
  }

  const linked = resolveLinkedPrincipal(store, principal.tenantId, input.linkedPrincipalEmail);
  if (linked.error) return { error: linked.error, reason: linked.reason ?? "principal_not_found" };

  const tenantEmployeesNow = tenantEmployees(store, principal.tenantId);
  const employeeCode = input.employeeCode?.trim() || nextEmployeeCode(tenantEmployeesNow.map((e) => e.employeeCode));
  if (tenantEmployeesNow.some((e) => e.employeeCode.toLowerCase() === employeeCode.toLowerCase())) {
    return { error: "conflict" as const, reason: "duplicate_employee_code" };
  }
  const email = input.email?.trim().toLowerCase();
  if (email && tenantEmployeesNow.some((e) => e.email?.toLowerCase() === email)) {
    return { error: "conflict" as const, reason: "duplicate_employee_email" };
  }
  if (linked.principalId && tenantEmployeesNow.some((e) => e.principalId === linked.principalId)) {
    return { error: "conflict" as const, reason: "principal_already_linked" };
  }

  const now = new Date().toISOString();
  const employee: HrEmployee = {
    id: newId(),
    tenantId: principal.tenantId,
    employeeCode,
    givenName,
    familyName,
    status: input.status && isValidEmployeeStatus(input.status) ? input.status : "active",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (email) employee.email = email;
  if (linked.principalId) employee.principalId = linked.principalId;
  if (input.orgUnitId) employee.orgUnitId = input.orgUnitId;
  if (input.locationId) employee.locationId = input.locationId;
  const jobTitle = input.jobTitle?.trim();
  if (jobTitle) employee.jobTitle = jobTitle;
  if (input.startDate) employee.startDate = input.startDate;

  store.hrEmployees.push(employee);
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: now,
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action: "hr:write:employee",
    resourceType: "hr_employee",
    resourceId: employee.id,
    correlationId,
    authorization: "allow",
    evidence: { employeeCode },
  });
  return { employee: sanitizeEmployee(store, employee) };
}

export type PatchEmployeeInput = {
  givenName?: string;
  familyName?: string;
  email?: string | null;
  linkedPrincipalEmail?: string | null;
  orgUnitId?: string | null;
  locationId?: string | null;
  jobTitle?: string | null;
  startDate?: string | null;
  status?: string;
};

export function patchEmployee(
  store: Store,
  principal: Principal,
  id: string,
  input: PatchEmployeeInput,
  correlationId: string,
) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:write:employee",
    action: "write:hr_employee",
  });
  if (decision.result === "deny") return deny(decision.reason);

  const employee = findEmployee(store, principal.tenantId, id);
  if (!employee) return { error: "not_found" as const, reason: "employee_not_found" };

  if (input.status && !isValidEmployeeStatus(input.status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }
  if (input.startDate && input.startDate !== null && !computeLeaveDays(input.startDate, input.startDate)) {
    return { error: "invalid_request" as const, reason: "invalid_start_date" };
  }
  if (input.orgUnitId && !store.orgUnits.some((u) => u.id === input.orgUnitId && u.tenantId === principal.tenantId)) {
    return { error: "invalid_request" as const, reason: "org_unit_not_found" };
  }
  if (input.locationId && !store.locations.some((l) => l.id === input.locationId && l.tenantId === principal.tenantId)) {
    return { error: "invalid_request" as const, reason: "location_not_found" };
  }

  if (typeof input.linkedPrincipalEmail === "string") {
    const linked = resolveLinkedPrincipal(store, principal.tenantId, input.linkedPrincipalEmail);
    if (linked.error) return { error: linked.error, reason: linked.reason ?? "principal_not_found" };
    if (
      linked.principalId &&
      tenantEmployees(store, principal.tenantId).some((e) => e.id !== employee.id && e.principalId === linked.principalId)
    ) {
      return { error: "conflict" as const, reason: "principal_already_linked" };
    }
    if (linked.principalId) employee.principalId = linked.principalId;
  } else if (input.linkedPrincipalEmail === null) {
    delete employee.principalId;
  }

  if (typeof input.email === "string") {
    const email = input.email.trim().toLowerCase();
    if (email && tenantEmployees(store, principal.tenantId).some((e) => e.id !== employee.id && e.email?.toLowerCase() === email)) {
      return { error: "conflict" as const, reason: "duplicate_employee_email" };
    }
    if (email) employee.email = email;
    else delete employee.email;
  } else if (input.email === null) {
    delete employee.email;
  }

  if (input.givenName?.trim()) employee.givenName = input.givenName.trim();
  if (input.familyName?.trim()) employee.familyName = input.familyName.trim();
  if (input.status && isValidEmployeeStatus(input.status)) employee.status = input.status;
  if (input.orgUnitId === null) delete employee.orgUnitId;
  else if (input.orgUnitId) employee.orgUnitId = input.orgUnitId;
  if (input.locationId === null) delete employee.locationId;
  else if (input.locationId) employee.locationId = input.locationId;
  if (input.jobTitle === null) delete employee.jobTitle;
  else if (typeof input.jobTitle === "string") {
    const jobTitle = input.jobTitle.trim();
    if (jobTitle) employee.jobTitle = jobTitle;
    else delete employee.jobTitle;
  }
  if (input.startDate === null) delete employee.startDate;
  else if (input.startDate) employee.startDate = input.startDate;

  employee.updatedAt = new Date().toISOString();
  employee.updatedByPrincipalId = principal.id;
  void correlationId;
  return { employee: sanitizeEmployee(store, employee) };
}

export function listSkills(store: Store, principal: Principal, query?: { q?: string }) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:read:skill",
    action: "read:hr_skill",
  });
  if (decision.result === "deny") return deny(decision.reason);

  let items = store.hrSkills.filter((s) => s.tenantId === principal.tenantId);
  const q = query?.q?.trim().toLowerCase();
  if (q) items = items.filter((s) => `${s.name} ${s.category ?? ""}`.toLowerCase().includes(q));
  items = [...items].sort((a, b) => a.name.localeCompare(b.name));
  return { items: items.map(sanitizeSkill) };
}

export function createSkill(
  store: Store,
  principal: Principal,
  input: { name?: string; category?: string },
  correlationId: string,
) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:write:skill",
    action: "write:hr_skill",
  });
  if (decision.result === "deny") return deny(decision.reason);

  const name = input.name?.trim();
  if (!name) return { error: "invalid_request" as const, reason: "name_required" };
  const duplicate = store.hrSkills.some(
    (s) => s.tenantId === principal.tenantId && s.name.toLowerCase() === name.toLowerCase(),
  );
  if (duplicate) return { error: "conflict" as const, reason: "duplicate_skill_name" };

  const now = new Date().toISOString();
  const skill: HrSkill = {
    id: newId(),
    tenantId: principal.tenantId,
    name,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  const category = input.category?.trim();
  if (category) skill.category = category;
  store.hrSkills.push(skill);
  void correlationId;
  return { skill: sanitizeSkill(skill) };
}

export function patchSkill(
  store: Store,
  principal: Principal,
  id: string,
  input: { name?: string; category?: string | null },
) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:write:skill",
    action: "write:hr_skill",
  });
  if (decision.result === "deny") return deny(decision.reason);

  const skill = findSkill(store, principal.tenantId, id);
  if (!skill) return { error: "not_found" as const, reason: "skill_not_found" };

  if (typeof input.name === "string") {
    const name = input.name.trim();
    if (!name) return { error: "invalid_request" as const, reason: "name_required" };
    const duplicate = store.hrSkills.some(
      (s) => s.tenantId === principal.tenantId && s.id !== skill.id && s.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) return { error: "conflict" as const, reason: "duplicate_skill_name" };
    skill.name = name;
  }
  if (input.category === null) delete skill.category;
  else if (typeof input.category === "string") {
    const category = input.category.trim();
    if (category) skill.category = category;
    else delete skill.category;
  }
  skill.updatedAt = new Date().toISOString();
  skill.updatedByPrincipalId = principal.id;
  return { skill: sanitizeSkill(skill) };
}

export function assignEmployeeSkill(
  store: Store,
  principal: Principal,
  employeeId: string,
  input: { skillId?: string; proficiency?: string },
) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:write:employee",
    action: "write:hr_employee_skill",
  });
  if (decision.result === "deny") return deny(decision.reason);

  const employee = findEmployee(store, principal.tenantId, employeeId);
  if (!employee) return { error: "not_found" as const, reason: "employee_not_found" };
  if (!input.skillId) return { error: "invalid_request" as const, reason: "skill_id_required" };
  const skill = findSkill(store, principal.tenantId, input.skillId);
  if (!skill) return { error: "not_found" as const, reason: "skill_not_found" };
  const proficiency = input.proficiency ?? "beginner";
  if (!isValidSkillProficiency(proficiency)) {
    return { error: "invalid_request" as const, reason: "invalid_proficiency" };
  }

  const existing = store.hrEmployeeSkills.find(
    (s) => s.employeeId === employee.id && s.skillId === skill.id && s.tenantId === principal.tenantId,
  );
  const now = new Date().toISOString();
  if (existing) {
    existing.proficiency = proficiency;
    existing.updatedAt = now;
  } else {
    const row: HrEmployeeSkill = {
      id: newId(),
      tenantId: principal.tenantId,
      employeeId: employee.id,
      skillId: skill.id,
      proficiency,
      createdAt: now,
      updatedAt: now,
    };
    store.hrEmployeeSkills.push(row);
  }
  return getEmployee(store, principal, employee.id);
}

export function removeEmployeeSkill(store: Store, principal: Principal, employeeId: string, skillId: string) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:write:employee",
    action: "write:hr_employee_skill",
  });
  if (decision.result === "deny") return deny(decision.reason);

  const employee = findEmployee(store, principal.tenantId, employeeId);
  if (!employee) return { error: "not_found" as const, reason: "employee_not_found" };

  const idx = store.hrEmployeeSkills.findIndex(
    (s) => s.employeeId === employee.id && s.skillId === skillId && s.tenantId === principal.tenantId,
  );
  if (idx < 0) return { error: "not_found" as const, reason: "employee_skill_not_found" };
  store.hrEmployeeSkills.splice(idx, 1);
  return getEmployee(store, principal, employee.id);
}

export function listLeave(
  store: Store,
  principal: Principal,
  query?: { employeeId?: string; status?: string },
) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:read:leave",
    action: "read:hr_leave",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidLeaveStatus(query.status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }

  let items = store.hrLeaveRequests.filter((l) => l.tenantId === principal.tenantId);
  if (query?.employeeId) items = items.filter((l) => l.employeeId === query.employeeId);
  if (query?.status) items = items.filter((l) => l.status === query.status);
  items = [...items].sort((a, b) => b.startDate.localeCompare(a.startDate) || a.employeeId.localeCompare(b.employeeId));
  return { items: items.map((l) => sanitizeLeave(store, l)) };
}

export type CreateLeaveInput = {
  employeeId?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
};

export function createLeave(
  store: Store,
  principal: Principal,
  input: CreateLeaveInput,
  correlationId: string,
) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:write:leave",
    action: "write:hr_leave",
  });
  if (decision.result === "deny") return deny(decision.reason);

  if (!input.employeeId) return { error: "invalid_request" as const, reason: "employee_id_required" };
  const employee = findEmployee(store, principal.tenantId, input.employeeId);
  if (!employee) return { error: "not_found" as const, reason: "employee_not_found" };
  if (employee.status === "terminated") return { error: "conflict" as const, reason: "employee_not_active" };
  if (!input.leaveType || !isValidLeaveType(input.leaveType)) {
    return { error: "invalid_request" as const, reason: "invalid_leave_type" };
  }
  const startDate = input.startDate;
  const endDate = input.endDate;
  const days = startDate && endDate ? computeLeaveDays(startDate, endDate) : undefined;
  if (!days || !startDate || !endDate) return { error: "invalid_request" as const, reason: "invalid_date_range" };

  const now = new Date().toISOString();
  const leave: HrLeaveRequest = {
    id: newId(),
    tenantId: principal.tenantId,
    employeeId: employee.id,
    leaveType: input.leaveType,
    startDate,
    endDate,
    days,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  const notes = input.notes?.trim();
  if (notes) leave.notes = notes;
  store.hrLeaveRequests.push(leave);
  store.actions.push({ principalId: principal.id, action: "hr:write:leave", objectId: leave.id });
  void correlationId;
  return { leave: sanitizeLeave(store, leave) };
}

function transitionLeave(
  store: Store,
  principal: Principal,
  id: string,
  action: LeaveAction,
  permission: string,
  correlationId: string,
) {
  ensureHrCollections(store);
  const decision = authorize({
    principal,
    permission,
    action: `${action}:hr_leave`,
  });
  if (decision.result === "deny") return deny(decision.reason);

  const leave = findLeave(store, principal.tenantId, id);
  if (!leave) return { error: "not_found" as const, reason: "leave_not_found" };

  const gate = canTransitionLeave(leave.status, action);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  if (action === "approve" || action === "reject") {
    const employee = findEmployee(store, principal.tenantId, leave.employeeId);
    if (employee?.principalId && employee.principalId === principal.id) {
      return deny("cannot_approve_own_leave");
    }
    const sod = sodViolation(store.sodRules, store.actions, {
      principalId: principal.id,
      action: "hr:approve:leave",
      objectId: leave.id,
    });
    if (sod) return deny("sod");
  }

  leave.status = gate.next;
  leave.updatedAt = new Date().toISOString();
  leave.updatedByPrincipalId = principal.id;
  if (action === "submit") {
    store.actions.push({ principalId: principal.id, action: "hr:write:leave", objectId: leave.id });
  }
  if (action === "approve" || action === "reject") {
    store.actions.push({ principalId: principal.id, action: "hr:approve:leave", objectId: leave.id });
  }
  void correlationId;
  return { leave: sanitizeLeave(store, leave) };
}

export function submitLeave(store: Store, principal: Principal, id: string, correlationId: string) {
  return transitionLeave(store, principal, id, "submit", "hr:write:leave", correlationId);
}

export function approveLeave(store: Store, principal: Principal, id: string, correlationId: string) {
  return transitionLeave(store, principal, id, "approve", "hr:approve:leave", correlationId);
}

export function rejectLeave(store: Store, principal: Principal, id: string, correlationId: string) {
  return transitionLeave(store, principal, id, "reject", "hr:approve:leave", correlationId);
}

export function cancelLeave(store: Store, principal: Principal, id: string, correlationId: string) {
  return transitionLeave(store, principal, id, "cancel", "hr:write:leave", correlationId);
}
