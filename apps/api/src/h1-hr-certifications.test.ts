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
    expect(missing.statusCode).toBe(400);
    expect(missing.json().reason).toBe("person_domain_removed");

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

  it("refuses certification writes after person-domain removal and leaves other modules intact", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/hr/certifications",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { name: "Alice must not record", employeeId: newId() },
        })
      ).statusCode,
    ).toBe(403);

    const created = await app.inject({
      method: "POST",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { name: "First aid", employeeId: newId() },
    });
    expect(created.statusCode).toBe(400);
    expect(created.json().reason).toBe("person_domain_removed");

    const listed = await app.inject({
      method: "GET",
      url: "/v1/hr/certifications",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.statusCode).toBe(400);
    expect(listed.json().reason).toBe("person_domain_removed");

    expect((await app.inject({ method: "GET", url: "/v1/itsm/health", headers: { authorization: `Bearer ${carolToken}` } })).json().increment).toBe("I11");
    expect((await app.inject({ method: "GET", url: "/v1/crisis/health", headers: { authorization: `Bearer ${carolToken}` } })).json().increment).toBe("I18");
    expect((await app.inject({ method: "GET", url: "/v1/privacy/health", headers: { authorization: `Bearer ${carolToken}` } })).json().increment).toBe("P1");
    expect((await app.inject({ method: "GET", url: "/v1/bookings/health", headers: { authorization: `Bearer ${carolToken}` } })).statusCode).toBe(200);

    expect("hrCertifications" in store).toBe(true);
    expect("hrPayroll" in store).toBe(false);
    expect("hrLms" in store).toBe(false);
  });
});
