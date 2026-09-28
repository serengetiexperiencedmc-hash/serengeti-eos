import { authorize, type EmployeeStatus, type LeaveType, type Principal, type SkillProficiency } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureHrCollections } from "./collections.js";
import { personDomainRemoved } from "../personal-data-phase1.js";

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
  status: "draft" | "submitted" | "approved" | "rejected" | "cancelled";
  notes?: string;
};

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireRead(store: Store, principal: Principal, action: string) {
  ensureHrCollections(store);
  const decision = authorize({ principal, permission: "hr:read:employee", action });
  if (decision.result === "deny") return deny(decision.reason);
  return null;
}

function requireWrite(store: Store, principal: Principal, permission: string, action: string) {
  ensureHrCollections(store);
  const decision = authorize({ principal, permission, action });
  if (decision.result === "deny") return deny(decision.reason);
  return null;
}

export function getHrModuleHealth(store: Store, principal: Principal) {
  const denied = requireRead(store, principal, "read:hr_health");
  if (denied) return denied;
  return { module: "hr", increment: "I10" as const, status: "ok" as const, employees: 0, skills: 0, leavePending: 0 };
}

export function listEmployees(store: Store, principal: Principal, query?: { q?: string; status?: string }) {
  void query;
  const denied = requireRead(store, principal, "read:hr_employee");
  if (denied) return denied;
  return personDomainRemoved();
}

export function getEmployee(store: Store, principal: Principal, id: string) {
  void id;
  const denied = requireRead(store, principal, "read:hr_employee");
  if (denied) return denied;
  return personDomainRemoved();
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

export function createEmployee(store: Store, principal: Principal, input: CreateEmployeeInput, correlationId: string) {
  void input;
  void correlationId;
  const denied = requireWrite(store, principal, "hr:write:employee", "write:hr_employee");
  if (denied) return denied;
  return personDomainRemoved();
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
  void id;
  void input;
  void correlationId;
  const denied = requireWrite(store, principal, "hr:write:employee", "write:hr_employee");
  if (denied) return denied;
  return personDomainRemoved();
}

export function listSkills(store: Store, principal: Principal, query?: { q?: string }) {
  void query;
  const denied = requireRead(store, principal, "read:hr_skill");
  if (denied) return denied;
  return personDomainRemoved();
}

export function createSkill(
  store: Store,
  principal: Principal,
  input: { name?: string; category?: string },
  correlationId: string,
) {
  void input;
  void correlationId;
  const denied = requireWrite(store, principal, "hr:write:employee", "write:hr_skill");
  if (denied) return denied;
  return personDomainRemoved();
}

export function patchSkill(
  store: Store,
  principal: Principal,
  id: string,
  input: { name?: string; category?: string | null },
) {
  void id;
  void input;
  const denied = requireWrite(store, principal, "hr:write:employee", "write:hr_skill");
  if (denied) return denied;
  return personDomainRemoved();
}

export function assignEmployeeSkill(
  store: Store,
  principal: Principal,
  employeeId: string,
  input: { skillId?: string; proficiency?: string },
) {
  void employeeId;
  void input;
  const denied = requireWrite(store, principal, "hr:write:employee", "write:hr_employee_skill");
  if (denied) return denied;
  return personDomainRemoved();
}

export function removeEmployeeSkill(store: Store, principal: Principal, employeeId: string, skillId: string) {
  void employeeId;
  void skillId;
  const denied = requireWrite(store, principal, "hr:write:employee", "write:hr_employee_skill");
  if (denied) return denied;
  return personDomainRemoved();
}

export function listLeave(store: Store, principal: Principal, query?: { status?: string; employeeId?: string }) {
  void query;
  const denied = requireRead(store, principal, "read:hr_leave");
  if (denied) return denied;
  return personDomainRemoved();
}

export function createLeave(
  store: Store,
  principal: Principal,
  input: Record<string, unknown>,
  correlationId: string,
) {
  void input;
  void correlationId;
  const denied = requireWrite(store, principal, "hr:write:leave", "write:hr_leave");
  if (denied) return denied;
  return personDomainRemoved();
}

export function submitLeave(store: Store, principal: Principal, id: string, correlationId: string) {
  void id;
  void correlationId;
  const denied = requireWrite(store, principal, "hr:write:leave", "submit:hr_leave");
  if (denied) return denied;
  return personDomainRemoved();
}

export function approveLeave(store: Store, principal: Principal, id: string, correlationId: string) {
  void id;
  void correlationId;
  const denied = requireWrite(store, principal, "hr:approve:leave", "approve:hr_leave");
  if (denied) return denied;
  return personDomainRemoved();
}

export function rejectLeave(store: Store, principal: Principal, id: string, correlationId: string) {
  void id;
  void correlationId;
  const denied = requireWrite(store, principal, "hr:approve:leave", "reject:hr_leave");
  if (denied) return denied;
  return personDomainRemoved();
}

export function cancelLeave(store: Store, principal: Principal, id: string, correlationId: string) {
  void id;
  void correlationId;
  const denied = requireWrite(store, principal, "hr:write:leave", "cancel:hr_leave");
  if (denied) return denied;
  return personDomainRemoved();
}
