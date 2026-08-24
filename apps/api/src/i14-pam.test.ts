import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { PAM_SEED } from "../src/pam/collections.js";
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
  expect(raw.toLowerCase()).not.toContain("password");
}

describe("I14 PAM", () => {
  it("lists I14 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("085_i14_pam"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/pam/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/pam/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/pam/refs",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/pam/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("I14");
    expect(health.json().refs).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/pam/refs/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
  });

  it("stores opaque refs and overlays JIT grants", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/pam/refs",
          headers: { authorization: `Bearer ${carolToken}` },
          payload: { label: "Bad", secretRef: "hunter2" },
        })
      ).statusCode,
    ).toBe(400);

    const created = await app.inject({
      method: "POST",
      url: "/v1/pam/refs",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { label: "Mail adapter pointer", secretRef: "ref://devtest/mail/smtp" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().ref.refCode).toBe("SRF-0002");
    expect(created.json().ref.secretRef).toBe("ref://devtest/mail/smtp");
    assertNoSecrets(created.json());

    const duplicate = await app.inject({
      method: "POST",
      url: "/v1/pam/refs",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { label: "Again", secretRef: "ref://devtest/mail/smtp" },
    });
    expect(duplicate.statusCode).toBe(409);

    const grantPam = await app.inject({
      method: "POST",
      url: "/v1/pam/grants",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        subjectEmail: "alice.finance@sedmc.local",
        permissionKey: "pam:write:grant",
        ttlSeconds: 600,
      },
    });
    expect(grantPam.statusCode).toBe(400);

    const grant = await app.inject({
      method: "POST",
      url: "/v1/pam/grants",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        subjectEmail: "alice.finance@sedmc.local",
        permissionKey: "itsm:read:ticket",
        ttlSeconds: 600,
        reason: "Break-glass read for Dev/Test",
      },
    });
    expect(grant.statusCode).toBe(201);
    expect(grant.json().grant.grantCode).toBe("JIT-0001");
    expect(grant.json().grant.subjectEmail).toBe("alice.finance@sedmc.local");
    assertNoSecrets(grant.json());

    const partnerSubject = await app.inject({
      method: "POST",
      url: "/v1/pam/grants",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        subjectEmail: "partner@external.local",
        permissionKey: "itsm:read:ticket",
        ttlSeconds: 600,
      },
    });
    expect(partnerSubject.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const revoked = await app.inject({
      method: "POST",
      url: `/v1/pam/grants/${grant.json().grant.id}/revoke`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(revoked.json().grant.status).toBe("revoked");
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const retired = await app.inject({
      method: "POST",
      url: `/v1/pam/refs/${PAM_SEED.sampleRefId}/retire`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(retired.json().ref.status).toBe("retired");
    const retireAgain = await app.inject({
      method: "POST",
      url: `/v1/pam/refs/${PAM_SEED.sampleRefId}/retire`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(retireAgain.statusCode).toBe(409);
  });
});
