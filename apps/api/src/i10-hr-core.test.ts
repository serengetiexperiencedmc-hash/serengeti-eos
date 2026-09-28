import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
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

async function loginCarol(app: ReturnType<typeof buildServer>) {
  return login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
}

async function loginAlice(app: ReturnType<typeof buildServer>) {
  return login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
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

  it("keeps HR auth while the employee/leave SoR is removed", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
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
    expect(health.json().increment).toBe("I10");
    expect(health.json().employees).toBe(0);
    assertNoSecrets(health.json());

    const list = await app.inject({
      method: "GET",
      url: "/v1/hr/employees",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(list.statusCode).toBe(400);
    expect(list.json().reason).toBe("person_domain_removed");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/hr/employees/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(400);
    expect(missing.json().reason).toBe("person_domain_removed");

    const created = await app.inject({
      method: "POST",
      url: "/v1/hr/employees",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { givenName: "David", familyName: "Mwangi" },
    });
    expect(created.statusCode).toBe(400);
    expect(created.json().reason).toBe("person_domain_removed");

    const leave = await app.inject({
      method: "POST",
      url: "/v1/hr/leave",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        employeeId: newId(),
        leaveType: "sick",
        startDate: "2026-10-01",
        endDate: "2026-10-02",
      },
    });
    expect(leave.statusCode).toBe(400);
    expect(leave.json().reason).toBe("person_domain_removed");

    const aliceList = await app.inject({
      method: "GET",
      url: "/v1/hr/employees",
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(aliceList.statusCode).toBe(403);
  });
});
