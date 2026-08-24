export const EMPLOYEE_STATUSES = ["active", "on_leave", "terminated"] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export const LEAVE_TYPES = ["annual", "sick", "unpaid", "compassionate"] as const;
export type LeaveType = (typeof LEAVE_TYPES)[number];

export const LEAVE_STATUSES = ["draft", "submitted", "approved", "rejected", "cancelled"] as const;
export type LeaveStatus = (typeof LEAVE_STATUSES)[number];

export const LEAVE_ACTIONS = ["submit", "approve", "reject", "cancel"] as const;
export type LeaveAction = (typeof LEAVE_ACTIONS)[number];

export const SKILL_PROFICIENCIES = ["beginner", "intermediate", "advanced", "expert"] as const;
export type SkillProficiency = (typeof SKILL_PROFICIENCIES)[number];

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: "Active",
  on_leave: "On leave",
  terminated: "Terminated",
};

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual: "Annual",
  sick: "Sick",
  unpaid: "Unpaid",
  compassionate: "Compassionate",
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const SKILL_PROFICIENCY_LABELS: Record<SkillProficiency, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidEmployeeStatus(value: string): value is EmployeeStatus {
  return (EMPLOYEE_STATUSES as readonly string[]).includes(value);
}

export function isValidLeaveType(value: string): value is LeaveType {
  return (LEAVE_TYPES as readonly string[]).includes(value);
}

export function isValidLeaveStatus(value: string): value is LeaveStatus {
  return (LEAVE_STATUSES as readonly string[]).includes(value);
}

export function isValidSkillProficiency(value: string): value is SkillProficiency {
  return (SKILL_PROFICIENCIES as readonly string[]).includes(value);
}

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(parsed);
}

export function computeLeaveDays(startDate: string, endDate: string): number | undefined {
  if (!isIsoDate(startDate) || !isIsoDate(endDate)) return undefined;
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (end < start) return undefined;
  return Math.round((end - start) / 86_400_000) + 1;
}

export function nextEmployeeCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^EMP-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `EMP-${String(max + 1).padStart(4, "0")}`;
}

const LEAVE_TRANSITIONS: Record<LeaveStatus, Partial<Record<LeaveAction, LeaveStatus>>> = {
  draft: { submit: "submitted", cancel: "cancelled" },
  submitted: { approve: "approved", reject: "rejected", cancel: "cancelled" },
  approved: {},
  rejected: {},
  cancelled: {},
};

export function canTransitionLeave(
  from: LeaveStatus,
  action: LeaveAction,
): { allowed: true; next: LeaveStatus } | { allowed: false; reason: "invalid_transition" } {
  const next = LEAVE_TRANSITIONS[from][action];
  if (!next) return { allowed: false, reason: "invalid_transition" };
  return { allowed: true, next };
}

export type HrEmployee = {
  id: string;
  tenantId: string;
  employeeCode: string;
  givenName: string;
  familyName: string;
  email?: string;
  principalId?: string;
  orgUnitId?: string;
  locationId?: string;
  jobTitle?: string;
  startDate?: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type HrSkill = {
  id: string;
  tenantId: string;
  name: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type HrEmployeeSkill = {
  id: string;
  tenantId: string;
  employeeId: string;
  skillId: string;
  proficiency: SkillProficiency;
  createdAt: string;
  updatedAt: string;
};

export type HrLeaveRequest = {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
