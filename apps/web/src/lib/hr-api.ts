import { eosFetch } from "./eos-client";

export type HrEmployee = {
  id: string;
  employeeCode: string;
  givenName: string;
  familyName: string;
  displayName: string;
  status: "active" | "on_leave" | "terminated";
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

export type HrSkill = {
  id: string;
  name: string;
  category?: string;
};

export type HrEmployeeSkill = {
  skillId: string;
  name: string;
  category?: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
};

export type HrLeave = {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  leaveType: "annual" | "sick" | "unpaid" | "compassionate";
  startDate: string;
  endDate: string;
  days: number;
  status: "draft" | "submitted" | "approved" | "rejected" | "cancelled";
  notes?: string;
};

export type HrEmployeeDetail = {
  employee: HrEmployee;
  skills: HrEmployeeSkill[];
  leave: HrLeave[];
};

export const EMPLOYEE_STATUS_LABELS: Record<HrEmployee["status"], string> = {
  active: "Active",
  on_leave: "On leave",
  terminated: "Terminated",
};

export const LEAVE_TYPE_LABELS: Record<HrLeave["leaveType"], string> = {
  annual: "Annual",
  sick: "Sick",
  unpaid: "Unpaid",
  compassionate: "Compassionate",
};

export const LEAVE_STATUS_LABELS: Record<HrLeave["status"], string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export async function getHrHealth(token: string) {
  return eosFetch<{ module: string; increment: string; employees: number; skills: number; leavePending: number }>(
    "/v1/hr/health",
    { token },
  );
}

export async function listEmployees(token: string, query?: { q?: string; status?: string }) {
  const params = new URLSearchParams();
  if (query?.q) params.set("q", query.q);
  if (query?.status) params.set("status", query.status);
  const qs = params.toString();
  return eosFetch<{ items: HrEmployee[] }>(`/v1/hr/employees${qs ? `?${qs}` : ""}`, { token });
}

export async function getEmployee(token: string, id: string) {
  return eosFetch<HrEmployeeDetail>(`/v1/hr/employees/${id}`, { token });
}

export async function createEmployee(
  token: string,
  input: {
    givenName: string;
    familyName: string;
    email?: string;
    jobTitle?: string;
    orgUnitId?: string;
    locationId?: string;
    startDate?: string;
    linkedPrincipalEmail?: string;
  },
) {
  return eosFetch<{ employee: HrEmployee }>("/v1/hr/employees", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function patchEmployee(
  token: string,
  id: string,
  input: { status?: HrEmployee["status"]; jobTitle?: string; givenName?: string; familyName?: string },
) {
  return eosFetch<{ employee: HrEmployee }>(`/v1/hr/employees/${id}`, {
    token,
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function listSkills(token: string) {
  return eosFetch<{ items: HrSkill[] }>("/v1/hr/skills", { token });
}

export async function createSkill(token: string, input: { name: string; category?: string }) {
  return eosFetch<{ skill: HrSkill }>("/v1/hr/skills", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function assignEmployeeSkill(
  token: string,
  employeeId: string,
  input: { skillId: string; proficiency: HrEmployeeSkill["proficiency"] },
) {
  return eosFetch<HrEmployeeDetail>(`/v1/hr/employees/${employeeId}/skills`, {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function removeEmployeeSkill(token: string, employeeId: string, skillId: string) {
  return eosFetch<HrEmployeeDetail>(`/v1/hr/employees/${employeeId}/skills/${skillId}`, {
    token,
    method: "DELETE",
  });
}

export async function listLeave(token: string, query?: { employeeId?: string; status?: string }) {
  const params = new URLSearchParams();
  if (query?.employeeId) params.set("employeeId", query.employeeId);
  if (query?.status) params.set("status", query.status);
  const qs = params.toString();
  return eosFetch<{ items: HrLeave[] }>(`/v1/hr/leave${qs ? `?${qs}` : ""}`, { token });
}

export async function createLeave(
  token: string,
  input: {
    employeeId: string;
    leaveType: HrLeave["leaveType"];
    startDate: string;
    endDate: string;
    notes?: string;
  },
) {
  return eosFetch<{ leave: HrLeave }>("/v1/hr/leave", {
    token,
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function submitLeave(token: string, id: string) {
  return eosFetch<{ leave: HrLeave }>(`/v1/hr/leave/${id}/submit`, { token, method: "POST", body: "{}" });
}

export async function approveLeave(token: string, id: string) {
  return eosFetch<{ leave: HrLeave }>(`/v1/hr/leave/${id}/approve`, { token, method: "POST", body: "{}" });
}

export async function rejectLeave(token: string, id: string) {
  return eosFetch<{ leave: HrLeave }>(`/v1/hr/leave/${id}/reject`, { token, method: "POST", body: "{}" });
}

export async function cancelLeave(token: string, id: string) {
  return eosFetch<{ leave: HrLeave }>(`/v1/hr/leave/${id}/cancel`, { token, method: "POST", body: "{}" });
}
