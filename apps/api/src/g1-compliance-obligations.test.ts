import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { COMPLIANCE_SEED } from "../src/compliance/collections.js";
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

describe("G1 compliance obligations", () => {
  it("lists G1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("091_g1_compliance_obligations"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/compliance/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/compliance/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/compliance/obligations",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/compliance/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("G1");
    expect(health.json().obligations).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/compliance/obligations/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "compliance.member")?.permissionKeys).toEqual([
      "compliance:read:obligation",
      "compliance:write:obligation",
    ]);
  });

  it("runs obligation lifecycle with human-only mutate and no deferred GRC aggregates", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/compliance/obligations",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not register" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/compliance/obligations",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignId = "80808080-8080-4808-8808-808080808080";
    store.complianceObligations.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      obligationCode: "OBL-9999",
      title: "Other tenant obligation",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/compliance/obligations/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    const bobHealth = await app.inject({
      method: "GET",
      url: "/v1/compliance/health",
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(bobHealth.statusCode).toBe(200);

    const created = await app.inject({
      method: "POST",
      url: "/v1/compliance/obligations",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Guest data retention (Dev/Test)", ownerLabel: "Compliance lead" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().obligation.obligationCode).toBe("OBL-0002");
    expect(created.json().obligation.status).toBe("open");
    assertNoSecrets(created.json());
    const id = created.json().obligation.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/compliance/obligations",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not register" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/compliance/obligations/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Guest data retention — register only" },
    });
    expect(patched.json().obligation.title).toBe("Guest data retention — register only");

    const activated = await app.inject({
      method: "POST",
      url: `/v1/compliance/obligations/${id}/activate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(activated.json().obligation.status).toBe("in_force");

    const activateAgain = await app.inject({
      method: "POST",
      url: `/v1/compliance/obligations/${id}/activate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(activateAgain.statusCode).toBe(409);

    const closed = await app.inject({
      method: "POST",
      url: `/v1/compliance/obligations/${id}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closed.json().obligation.status).toBe("closed");

    const patchClosed = await app.inject({
      method: "PATCH",
      url: `/v1/compliance/obligations/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchClosed.statusCode).toBe(409);
    expect(patchClosed.json().reason).toBe("closed");

    const closeSeed = await app.inject({
      method: "POST",
      url: `/v1/compliance/obligations/${COMPLIANCE_SEED.sampleObligationId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closeSeed.json().obligation.status).toBe("closed");

    expect("complianceControls" in store).toBe(false);
    expect("complianceFindings" in store).toBe(false);
    expect("privacyRopa" in store).toBe(false);
    expect("privacyDsr" in store).toBe(false);
  });
});
