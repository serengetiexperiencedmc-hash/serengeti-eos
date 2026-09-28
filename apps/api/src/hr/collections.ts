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
}
