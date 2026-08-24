import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { HR_SEED } from "../src/hr/collections.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const FOREIGN = "22222222-2222-4222-8222-222222222222";

async function login(
  app: ReturnType<typeof buildServer>,
  email: string,
  password: string,
  tenantSlug: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug },
  });
  return res.json().accessToken as string;
}

async function loginCarol(app: ReturnType<typeof buildServer>) {
  return login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
}

async function loginAlice(app: ReturnType<typeof buildServer>) {
  return login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
}

async function loginBob(app: ReturnType<typeof buildServer>) {
  return login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
}

function assertNoSecrets(body: unknown) {
  const raw = JSON.stringify(body);
  expect(raw).not.toContain("tenantId");
  expect(raw).not.toContain("principalId");
}

describe("I10 HR core", () => {
  it("lists I10 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("081_i10_hr_core"))).toBe(true);
  });

  it("scopes health and directory to the tenant and enforces authorization", async () => {
    const store = seedStore("test-secret");
    store.hrEmployees.push({
      id: newId(),
      tenantId: FOREIGN,
      employeeCode: "EMP-9001",
      givenName: "Foreign",
      familyName: "Staff",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });

    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const aliceToken = await loginAlice(app);
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    const unauth = await app.inject({ method: "GET", url: "/v1/hr/health" });
    expect(unauth.statusCode).toBe(401);

    const aliceHealth = await app.inject({
      method: "GET",
      url: "/v1/hr/health",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(aliceHealth.statusCode).toBe(403);

    const partnerHealth = await app.inject({
      method: "GET",
      url: "/v1/hr/health",
      headers: { authorization: `Bearer ${partnerToken}` },
    });
    expect(partnerHealth.statusCode).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/hr/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    const healthBody = health.json();
    expect(healthBody.increment).toBe("I10");
    expect(healthBody.module).toBe("hr");
    expect(healthBody.employees).toBe(3);
    assertNoSecrets(healthBody);

    const list = await app.inject({
      method: "GET",
      url: "/v1/hr/employees",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(list.statusCode).toBe(200);
    const items = list.json().items as Array<{ employeeCode: string }>;
    expect(items.map((i) => i.employeeCode)).toEqual(["EMP-0001", "EMP-0002", "EMP-0003"]);
    assertNoSecrets(list.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/hr/employees/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    const aliceList = await app.inject({
      method: "GET",
      url: "/v1/hr/employees",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(aliceList.statusCode).toBe(403);
  });

  it("creates and patches employees without leaking identifiers", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);

    const invalid = await app.inject({
      method: "POST",
      url: "/v1/hr/employees",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { givenName: "Only" },
    });
    expect(invalid.statusCode).toBe(400);

    const created = await app.inject({
      method: "POST",
      url: "/v1/hr/employees",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        givenName: "David",
        familyName: "Mwangi",
        jobTitle: "Operations Coordinator",
        email: "david.mwangi@sedmc.local",
      },
    });
    expect(created.statusCode).toBe(201);
    const employee = created.json().employee as { id: string; employeeCode: string; jobTitle: string };
    expect(employee.employeeCode).toBe("EMP-0004");
    expect(employee.jobTitle).toBe("Operations Coordinator");
    assertNoSecrets(created.json());

    const dup = await app.inject({
      method: "POST",
      url: "/v1/hr/employees",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { givenName: "Other", familyName: "Person", email: "david.mwangi@sedmc.local" },
    });
    expect(dup.statusCode).toBe(409);

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/hr/employees/${employee.id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "on_leave", jobTitle: "Ops Lead" },
    });
    expect(patched.statusCode).toBe(200);
    expect(patched.json().employee.status).toBe("on_leave");
    expect(patched.json().employee.jobTitle).toBe("Ops Lead");
  });

  it("manages skills and assignments", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);

    const created = await app.inject({
      method: "POST",
      url: "/v1/hr/skills",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "French", category: "language" },
    });
    expect(created.statusCode).toBe(201);
    const skillId = created.json().skill.id as string;

    const dup = await app.inject({
      method: "POST",
      url: "/v1/hr/skills",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "french" },
    });
    expect(dup.statusCode).toBe(409);

    const assigned = await app.inject({
      method: "POST",
      url: `/v1/hr/employees/${HR_SEED.bobEmployeeId}/skills`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { skillId, proficiency: "advanced" },
    });
    expect(assigned.statusCode).toBe(200);
    const skills = assigned.json().skills as Array<{ skillId: string; proficiency: string }>;
    expect(skills.some((s) => s.skillId === skillId && s.proficiency === "advanced")).toBe(true);
    assertNoSecrets(assigned.json());

    const removed = await app.inject({
      method: "DELETE",
      url: `/v1/hr/employees/${HR_SEED.bobEmployeeId}/skills/${skillId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(removed.statusCode).toBe(200);
    expect(
      (removed.json().skills as Array<{ skillId: string }>).some((s) => s.skillId === skillId),
    ).toBe(false);
  });

  it("enforces leave transitions, SoD, and own-leave rules", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await loginCarol(app);
    const bobToken = await loginBob(app);
    const aliceToken = await loginAlice(app);

    const seededApprove = await app.inject({
      method: "POST",
      url: `/v1/hr/leave/${HR_SEED.aliceLeaveId}/approve`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(seededApprove.statusCode).toBe(403);
    expect(seededApprove.json().reason).toBe("sod");

    const bobApproveSeed = await app.inject({
      method: "POST",
      url: `/v1/hr/leave/${HR_SEED.aliceLeaveId}/approve`,
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(bobApproveSeed.statusCode).toBe(200);
    expect(bobApproveSeed.json().leave.status).toBe("approved");
    assertNoSecrets(bobApproveSeed.json());

    const created = await app.inject({
      method: "POST",
      url: "/v1/hr/leave",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        employeeId: HR_SEED.bobEmployeeId,
        leaveType: "sick",
        startDate: "2026-10-01",
        endDate: "2026-10-02",
      },
    });
    expect(created.statusCode).toBe(201);
    const leaveId = created.json().leave.id as string;
    expect(created.json().leave.days).toBe(2);

    const badDates = await app.inject({
      method: "POST",
      url: "/v1/hr/leave",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        employeeId: HR_SEED.bobEmployeeId,
        leaveType: "sick",
        startDate: "2026-10-10",
        endDate: "2026-10-01",
      },
    });
    expect(badDates.statusCode).toBe(400);

    const aliceWrite = await app.inject({
      method: "POST",
      url: "/v1/hr/leave",
      headers: { authorization: `Bearer ${aliceToken}` },
      payload: {
        employeeId: HR_SEED.aliceEmployeeId,
        leaveType: "annual",
        startDate: "2026-11-01",
        endDate: "2026-11-02",
      },
    });
    expect(aliceWrite.statusCode).toBe(403);

    const submitted = await app.inject({
      method: "POST",
      url: `/v1/hr/leave/${leaveId}/submit`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(submitted.statusCode).toBe(200);
    expect(submitted.json().leave.status).toBe("submitted");

    const carolApprove = await app.inject({
      method: "POST",
      url: `/v1/hr/leave/${leaveId}/approve`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(carolApprove.statusCode).toBe(403);
    expect(carolApprove.json().reason).toBe("sod");

    const bobOwn = await app.inject({
      method: "POST",
      url: `/v1/hr/leave/${leaveId}/approve`,
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(bobOwn.statusCode).toBe(403);
    expect(bobOwn.json().reason).toBe("cannot_approve_own_leave");

    const terminated = await app.inject({
      method: "PATCH",
      url: `/v1/hr/employees/${HR_SEED.carolEmployeeId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "terminated" },
    });
    expect(terminated.statusCode).toBe(200);

    const leaveTerminated = await app.inject({
      method: "POST",
      url: "/v1/hr/leave",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        employeeId: HR_SEED.carolEmployeeId,
        leaveType: "annual",
        startDate: "2026-12-01",
        endDate: "2026-12-02",
      },
    });
    expect(leaveTerminated.statusCode).toBe(409);

    const draft = await app.inject({
      method: "POST",
      url: "/v1/hr/leave",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        employeeId: HR_SEED.aliceEmployeeId,
        leaveType: "unpaid",
        startDate: "2026-12-10",
        endDate: "2026-12-12",
      },
    });
    const draftId = draft.json().leave.id as string;
    const cancelled = await app.inject({
      method: "POST",
      url: `/v1/hr/leave/${draftId}/cancel`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(cancelled.statusCode).toBe(200);
    expect(cancelled.json().leave.status).toBe("cancelled");

    const illegal = await app.inject({
      method: "POST",
      url: `/v1/hr/leave/${draftId}/submit`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(illegal.statusCode).toBe(409);
  });
});
