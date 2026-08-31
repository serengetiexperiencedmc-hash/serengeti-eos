import type {
  HrEmployee,
  HrEmployeeSkill,
  HrLeaveRequest,
  HrSkill,
} from "@sedmc/kernel";
import type { Store } from "../store.js";

export const HR_SEED = {
  aliceEmployeeId: "10101010-1010-4101-8101-101010101010",
  bobEmployeeId: "20202020-2020-4202-8202-202020202020",
  carolEmployeeId: "30303030-3030-4303-8303-303030303030",
  firstAidSkillId: "40404040-4040-4404-8404-404040404040",
  swahiliSkillId: "41414141-4141-4414-8414-414141414141",
  guidingSkillId: "42424242-4242-4424-8424-424242424242",
  aliceLeaveId: "50505050-5050-4505-8505-505050505050",
} as const;

export function ensureHrCollections(store: Store): void {
  if (!store.hrEmployees) store.hrEmployees = [];
  if (!store.hrSkills) store.hrSkills = [];
  if (!store.hrEmployeeSkills) store.hrEmployeeSkills = [];
  if (!store.hrLeaveRequests) store.hrLeaveRequests = [];
}

export function seedDefaultHr(store: Store): void {
  ensureHrCollections(store);
  const tenant = [...store.tenants.values()].find((t) => t.slug === "sedmc");
  if (!tenant) return;
  if (store.hrEmployees.some((e) => e.tenantId === tenant.id)) return;

  const alice = [...store.principals.values()].find((p) => p.email === "alice.finance@sedmc.local");
  const bob = [...store.principals.values()].find((p) => p.email === "bob.approver@sedmc.local");
  const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
  if (!alice || !bob || !carol) return;

  const now = "2026-08-01T08:00:00.000Z";
  const orgUnitId = alice.orgUnitId;
  const tenantId = tenant.id;
  const carolId = carol.id;
  const locationId = store.locations.find((l) => l.tenantId === tenantId)?.id;

  function staff(
    id: string,
    code: string,
    person: NonNullable<typeof alice>,
    givenName: string,
    familyName: string,
    jobTitle: string,
    startDate: string,
  ): HrEmployee {
    const row: HrEmployee = {
      id,
      tenantId,
      employeeCode: code,
      givenName,
      familyName,
      principalId: person.id,
      status: "active",
      jobTitle,
      startDate,
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: carolId,
      updatedByPrincipalId: carolId,
    };
    if (person.email) row.email = person.email;
    return row;
  }

  const employees: HrEmployee[] = [
    staff(HR_SEED.aliceEmployeeId, "EMP-0001", alice, "Alice", "Finance", "Finance Officer", "2024-01-15"),
    staff(HR_SEED.bobEmployeeId, "EMP-0002", bob, "Bob", "Approver", "Finance Approver", "2023-06-01"),
    staff(HR_SEED.carolEmployeeId, "EMP-0003", carol, "Carol", "Admin", "Platform Administrator", "2022-03-01"),
  ];
  if (orgUnitId) {
    for (const employee of employees) employee.orgUnitId = orgUnitId;
  }
  if (locationId) {
    for (const employee of employees) employee.locationId = locationId;
  }
  store.hrEmployees.push(...employees);

  const skills: HrSkill[] = [
    {
      id: HR_SEED.firstAidSkillId,
      tenantId: tenant.id,
      name: "First Aid",
      category: "safety",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: carol.id,
      updatedByPrincipalId: carol.id,
    },
    {
      id: HR_SEED.swahiliSkillId,
      tenantId: tenant.id,
      name: "Swahili",
      category: "language",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: carol.id,
      updatedByPrincipalId: carol.id,
    },
    {
      id: HR_SEED.guidingSkillId,
      tenantId: tenant.id,
      name: "Safari Guiding",
      category: "operations",
      createdAt: now,
      updatedAt: now,
      createdByPrincipalId: carol.id,
      updatedByPrincipalId: carol.id,
    },
  ];
  store.hrSkills.push(...skills);

  store.hrEmployeeSkills.push({
    id: "43434343-4343-4434-8434-434343434343",
    tenantId: tenant.id,
    employeeId: HR_SEED.aliceEmployeeId,
    skillId: HR_SEED.firstAidSkillId,
    proficiency: "intermediate",
    createdAt: now,
    updatedAt: now,
  });

  const leave: HrLeaveRequest = {
    id: HR_SEED.aliceLeaveId,
    tenantId: tenant.id,
    employeeId: HR_SEED.aliceEmployeeId,
    leaveType: "annual",
    startDate: "2026-09-01",
    endDate: "2026-09-05",
    days: 5,
    status: "submitted",
    notes: "Family travel — seeded pending approval",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: carol.id,
    updatedByPrincipalId: carol.id,
  };
  store.hrLeaveRequests.push(leave);
  store.actions.push({
    principalId: carol.id,
    action: "hr:write:leave",
    objectId: leave.id,
  });
}
