import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { ERM_SEED } from "../src/erm/collections.js";
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

describe("I15 ERM risk register", () => {
  it("lists I15 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("086_i15_erm"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/erm/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/erm/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/erm/risks",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/erm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("I15");
    expect(health.json().risks).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/erm/risks/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
  });

  it("runs risk lifecycle without inventing deferred GRC aggregates", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/erm/risks",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Nope" },
        })
      ).statusCode,
    ).toBe(403);

    const created = await app.inject({
      method: "POST",
      url: "/v1/erm/risks",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Supplier concentration", likelihood: 4, impact: 5, ownerLabel: "CRO" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().risk.riskCode).toBe("RSK-0002");
    expect(created.json().risk.status).toBe("open");
    assertNoSecrets(created.json());

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/erm/risks/${created.json().risk.id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { likelihood: 2 },
    });
    expect(patched.json().risk.likelihood).toBe(2);

    const mitigated = await app.inject({
      method: "POST",
      url: `/v1/erm/risks/${created.json().risk.id}/mitigate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(mitigated.json().risk.status).toBe("mitigating");

    const accepted = await app.inject({
      method: "POST",
      url: `/v1/erm/risks/${created.json().risk.id}/accept`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(accepted.json().risk.status).toBe("accepted");

    const closed = await app.inject({
      method: "POST",
      url: `/v1/erm/risks/${created.json().risk.id}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closed.json().risk.status).toBe("closed");

    const patchClosed = await app.inject({
      method: "PATCH",
      url: `/v1/erm/risks/${created.json().risk.id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchClosed.statusCode).toBe(409);

    const mitigateSeed = await app.inject({
      method: "POST",
      url: `/v1/erm/risks/${ERM_SEED.sampleRiskId}/mitigate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(mitigateSeed.json().risk.status).toBe("mitigating");
    const mitigateAgain = await app.inject({
      method: "POST",
      url: `/v1/erm/risks/${ERM_SEED.sampleRiskId}/mitigate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(mitigateAgain.statusCode).toBe(409);

    const alice = [...store.principals.values()].find((p) => p.email === "alice.finance@sedmc.local");
    expect(store.roles.find((r) => r.key === "risk.member")?.permissionKeys).toEqual([
      "erm:read:risk",
      "erm:write:risk",
    ]);
    const granted = await app.inject({
      method: "POST",
      url: "/v1/role-grants",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { principalId: alice!.id, roleKey: "risk.member" },
    });
    expect(granted.statusCode).toBe(201);
    const aliceAfter = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/erm/health",
          headers: { authorization: `Bearer ${aliceAfter}` },
        })
      ).statusCode,
    ).toBe(200);

    expect("ermObligations" in store).toBe(false);
    expect("privacyRopa" in store).toBe(false);
    expect("privacyDsr" in store).toBe(false);
  });
});
