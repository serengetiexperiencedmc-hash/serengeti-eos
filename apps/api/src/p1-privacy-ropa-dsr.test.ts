import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { PRIVACY_SEED } from "../src/privacy/collections.js";
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

describe("P1 privacy RoPA and DSR", () => {
  it("lists P1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("092_p1_privacy_ropa_dsr"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/privacy/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/privacy/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/privacy/dsrs",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/privacy/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("P1");
    expect(health.json().activities).toBe(1);
    expect(health.json().dsrs).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/privacy/activities/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "dpo")?.permissionKeys).toEqual([
      "privacy:read:activity",
      "privacy:write:activity",
      "privacy:read:dsr",
      "privacy:write:dsr",
    ]);
  });

  it("runs RoPA and DSR lifecycle with SoD close and no deferred privacy products", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/privacy/activities",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not register" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/privacy/activities",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const invalidType = await app.inject({
      method: "POST",
      url: "/v1/privacy/dsrs",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { requestType: "delete_now" },
    });
    expect(invalidType.statusCode).toBe(400);
    expect(invalidType.json().reason).toBe("invalid_request_type");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignId = "81818181-8181-4818-8818-818181818181";
    store.privacyDsrCases.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      dsrCode: "DSR-9999",
      requestType: "access",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/privacy/dsrs/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/privacy/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const createdActivity = await app.inject({
      method: "POST",
      url: "/v1/privacy/activities",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Guest booking operations (Dev/Test)", purpose: "Programme fulfilment" },
    });
    expect(createdActivity.statusCode).toBe(201);
    expect(createdActivity.json().activity.activityCode).toBe("RPA-0002");
    expect(createdActivity.json().activity.status).toBe("open");
    assertNoSecrets(createdActivity.json());
    const activityId = createdActivity.json().activity.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/privacy/activities",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not register" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/activities/${activityId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Guest booking operations — register only" },
    });
    expect(patched.json().activity.title).toBe("Guest booking operations — register only");

    const retired = await app.inject({
      method: "POST",
      url: `/v1/privacy/activities/${activityId}/retire`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(retired.json().activity.status).toBe("retired");

    const patchRetired = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/activities/${activityId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchRetired.statusCode).toBe(409);
    expect(patchRetired.json().reason).toBe("retired");

    const createdDsr = await app.inject({
      method: "POST",
      url: "/v1/privacy/dsrs",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { requestType: "erasure", subjectLabel: "Guest B (label only)", note: "Case only — not live delete" },
    });
    expect(createdDsr.statusCode).toBe(201);
    expect(createdDsr.json().dsr.dsrCode).toBe("DSR-0002");
    expect(createdDsr.json().dsr.status).toBe("open");
    assertNoSecrets(createdDsr.json());
    const dsrId = createdDsr.json().dsr.id as string;

    const closeOpen = await app.inject({
      method: "POST",
      url: `/v1/privacy/dsrs/${dsrId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closeOpen.statusCode).toBe(409);
    expect(closeOpen.json().reason).toBe("invalid_transition");

    const started = await app.inject({
      method: "POST",
      url: `/v1/privacy/dsrs/${dsrId}/start`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(started.json().dsr.status).toBe("in_progress");

    const sod = await app.inject({
      method: "POST",
      url: `/v1/privacy/dsrs/${dsrId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(sod.statusCode).toBe(403);
    expect(sod.json().reason).toBe("sod");

    const closed = await app.inject({
      method: "POST",
      url: `/v1/privacy/dsrs/${dsrId}/close`,
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(closed.json().dsr.status).toBe("closed");

    const patchClosed = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/dsrs/${dsrId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { note: "Nope" },
    });
    expect(patchClosed.statusCode).toBe(409);
    expect(patchClosed.json().reason).toBe("closed");

    const startSeed = await app.inject({
      method: "POST",
      url: `/v1/privacy/dsrs/${PRIVACY_SEED.sampleDsrId}/start`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(startSeed.json().dsr.status).toBe("in_progress");

    expect("privacyRopa" in store).toBe(false);
    expect("privacyDsr" in store).toBe(false);
    expect("privacyConsent" in store).toBe(false);
    expect("privacyDpia" in store).toBe(false);
    expect("privacyDlp" in store).toBe(false);
  });
});
