import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { HR_SEED } from "../src/hr/collections.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

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

function assertNoSecrets(body: unknown) {
  const raw = JSON.stringify(body);
  expect(raw).not.toContain("tenantId");
  expect(raw).not.toContain("principalId");
}

describe("H1 HR certification register", () => {
  it("lists H1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("100_h1_hr_certifications"))).toBe(true);
  });

  it("enforces auth and tenant isolation without reusing I10 write permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/hr/certifications/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/hr/certifications/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/hr/certifications",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/hr/certifications/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("H1");
    expect(health.json().certifications).toBe(0);
    assertNoSecrets(health.json());

    const i10Health = await app.inject({
      method: "GET",
      url: "/v1/hr/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i10Health.statusCode).toBe(200);
    expect(i10Health.json().increment).toBe("I10");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/hr/certifications/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "hr.certification")?.permissionKeys).toEqual([
      "hr:read:certification",
      "hr:write:certification",
    ]);
    expect(store.roles.find((r) => r.key === "hr.member")?.permissionKeys).not.toContain("hr:read:certification");
    expect(store.roles.find((r) => r.key === "hr.member")?.permissionKeys).not.toContain("hr:write:certification");
    expect(store.roles.find((r) => r.key === "hr.approver")?.permissionKeys).not.toContain("hr:write:certification");
    expect(store.roles.find((r) => r.key === "hr.approver")?.permissionKeys).not.toContain("hr:read:certification");
    expect(store.roles.find((r) => r.key === "ops.issue")?.permissionKeys).not.toContain("hr:read:certification");
    expect(store.roles.find((r) => r.key === "grc.mapping")?.permissionKeys).not.toContain("hr:write:certification");
  });

  it("runs certification lifecycle with human-only mutate, employee reference, and no I10 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/hr/certifications",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { name: "Alice must not record", employeeId: HR_SEED.aliceEmployeeId },
        })
      ).statusCode,
    ).toBe(403);

    const missingName = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "   ", employeeId: HR_SEED.aliceEmployeeId },
    });
    expect(missingName.statusCode).toBe(400);
    expect(missingName.json().reason).toBe("name_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "C".repeat(201), employeeId: HR_SEED.aliceEmployeeId },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("name_too_long");

    const missingEmployee = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "No employee" },
    });
    expect(missingEmployee.statusCode).toBe(400);
    expect(missingEmployee.json().reason).toBe("employee_not_found");

    const unknownEmployee = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "Unknown employee", employeeId: newId() },
    });
    expect(unknownEmployee.statusCode).toBe(400);
    expect(unknownEmployee.json().reason).toBe("employee_not_found");

    const invertedDates = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        name: "Inverted dates",
        employeeId: HR_SEED.aliceEmployeeId,
        issuedOn: "2026-12-31",
        expiresOn: "2026-01-01",
      },
    });
    expect(invertedDates.statusCode).toBe(400);
    expect(invertedDates.json().reason).toBe("invalid_dates");

    const badDate = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "Bad date", employeeId: HR_SEED.aliceEmployeeId, issuedOn: "01-01-2026" },
    });
    expect(badDate.statusCode).toBe(400);
    expect(badDate.json().reason).toBe("invalid_dates");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignEmployeeId = "91919191-9191-4919-8919-919191919191";
    store.hrEmployees.push({
      id: foreignEmployeeId,
      tenantId: partnerTenant!.id,
      employeeCode: "EMP-9999",
      givenName: "Other",
      familyName: "Tenant",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossEmployee = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "Cross tenant employee", employeeId: foreignEmployeeId },
    });
    expect(crossEmployee.statusCode).toBe(400);
    expect(crossEmployee.json().reason).toBe("employee_not_found");

    const foreignId = "92929292-9292-4929-8929-929292929292";
    store.hrCertifications.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      certificationCode: "CRT-9999",
      name: "Other tenant certification",
      status: "held",
      employeeId: foreignEmployeeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/hr/certifications/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/hr/certifications/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const i10Before = await app.inject({
      method: "GET",
      url: "/v1/hr/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i10Before.json().increment).toBe("I10");
    const employeesBefore = i10Before.json().employees as number;
    const skillsBefore = i10Before.json().skills as number;
    const leavePendingBefore = i10Before.json().leavePending as number;
    const seedEmployee = store.hrEmployees.find((e) => e.id === HR_SEED.aliceEmployeeId);
    expect(seedEmployee?.status).toBe("active");
    const seedLeave = store.hrLeaveRequests.filter((row) => row.employeeId === HR_SEED.aliceEmployeeId).length;
    const seedSkills = store.hrEmployeeSkills.filter((row) => row.employeeId === HR_SEED.aliceEmployeeId).length;

    const created = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        name: "Wilderness First Responder",
        issuerLabel: "SOLO",
        issuedOn: "2024-03-01",
        expiresOn: "2026-03-01",
        notes: "Register row only — not an LMS",
        employeeId: HR_SEED.aliceEmployeeId,
        status: "revoked",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().certification.certificationCode).toBe("CRT-0001");
    expect(created.json().certification.status).toBe("held");
    expect(created.json().certification.employeeId).toBe(HR_SEED.aliceEmployeeId);
    expect(created.json().certification.employeeCode).toBe("EMP-0001");
    expect(created.json().certification.issuerLabel).toBe("SOLO");
    expect(created.json().certification.issuedOn).toBe("2024-03-01");
    expect(created.json().certification.expiresOn).toBe("2026-03-01");
    assertNoSecrets(created.json());
    expect(store.hrEmployees.find((e) => e.id === HR_SEED.aliceEmployeeId)?.status).toBe("active");
    const id = created.json().certification.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "AI must not record", employeeId: HR_SEED.aliceEmployeeId },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);

    const got = await app.inject({
      method: "GET",
      url: `/v1/hr/certifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().certification.certificationCode).toBe("CRT-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/hr/certifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "Wilderness First Responder — register only", employeeId: newId() },
    });
    expect(patched.json().certification.name).toBe("Wilderness First Responder — register only");
    expect(patched.json().certification.employeeId).toBe(HR_SEED.aliceEmployeeId);

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/hr/certifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "expired" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const revoked = await app.inject({
      method: "PATCH",
      url: `/v1/hr/certifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "revoked" },
    });
    expect(revoked.json().certification.status).toBe("revoked");

    const patchRevoked = await app.inject({
      method: "PATCH",
      url: `/v1/hr/certifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "Nope" },
    });
    expect(patchRevoked.statusCode).toBe(409);
    expect(patchRevoked.json().reason).toBe("revoked");

    const unrevoke = await app.inject({
      method: "PATCH",
      url: `/v1/hr/certifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "held" },
    });
    expect(unrevoke.statusCode).toBe(409);
    expect(unrevoke.json().reason).toBe("revoked");

    const terminated = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "Terminated staff still allowed", employeeId: HR_SEED.bobEmployeeId },
    });
    expect(terminated.statusCode).toBe(201);
    expect(terminated.json().certification.status).toBe("held");

    expect(store.hrEmployees.find((e) => e.id === HR_SEED.aliceEmployeeId)?.status).toBe("active");
    expect(store.hrLeaveRequests.filter((row) => row.employeeId === HR_SEED.aliceEmployeeId).length).toBe(seedLeave);
    expect(store.hrEmployeeSkills.filter((row) => row.employeeId === HR_SEED.aliceEmployeeId).length).toBe(seedSkills);
    const i10After = await app.inject({
      method: "GET",
      url: "/v1/hr/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i10After.json().increment).toBe("I10");
    expect(i10After.json().employees).toBe(employeesBefore);
    expect(i10After.json().skills).toBe(skillsBefore);
    expect(i10After.json().leavePending).toBe(leavePendingBefore);

    const i11After = await app.inject({
      method: "GET",
      url: "/v1/itsm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i11After.statusCode).toBe(200);
    expect(i11After.json().increment).toBe("I11");

    const i18After = await app.inject({
      method: "GET",
      url: "/v1/crisis/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i18After.json().increment).toBe("I18");

    const k1After = await app.inject({
      method: "GET",
      url: "/v1/crisis/decisions/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(k1After.json().increment).toBe("K1");

    const k2After = await app.inject({
      method: "GET",
      url: "/v1/crisis/actions/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(k2After.json().increment).toBe("K2");

    const o6After = await app.inject({
      method: "GET",
      url: "/v1/ops/issues/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(o6After.json().increment).toBe("O6");

    const g1After = await app.inject({
      method: "GET",
      url: "/v1/compliance/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g1After.json().increment).toBe("G1");

    const g2After = await app.inject({
      method: "GET",
      url: "/v1/grc/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g2After.json().increment).toBe("G2");

    const g3After = await app.inject({
      method: "GET",
      url: "/v1/findings/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g3After.json().increment).toBe("G3");

    const g4After = await app.inject({
      method: "GET",
      url: "/v1/control-tests/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g4After.json().increment).toBe("G4");

    const g5After = await app.inject({
      method: "GET",
      url: "/v1/mappings/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g5After.json().increment).toBe("G5");

    const p1After = await app.inject({
      method: "GET",
      url: "/v1/privacy/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p1After.json().increment).toBe("P1");

    const i15After = await app.inject({
      method: "GET",
      url: "/v1/erm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i15After.json().increment).toBe("I15");

    const i17After = await app.inject({
      method: "GET",
      url: "/v1/bcm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i17After.json().increment).toBe("I17");

    const c9After = await app.inject({
      method: "GET",
      url: "/v1/bookings/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(c9After.statusCode).toBe(200);

    expect("hrCertifications" in store).toBe(true);
    expect("hrPayroll" in store).toBe(false);
    expect("hrLms" in store).toBe(false);
    expect("sampleRecords" in store).toBe(false);
  });
});
