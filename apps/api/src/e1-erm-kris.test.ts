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

describe("E1 ERM KRI register", () => {
  it("lists E1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("107_e1_erm_kris"))).toBe(true);
  });

  it("enforces auth and tenant isolation without broadening risk.member", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/erm/kris/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/erm/kris/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/erm/kris",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/erm/kris/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("E1");
    expect(health.json().module).toBe("erm-kris");
    expect(health.json().kris).toBe(0);
    expect(health.json().openKris).toBe(0);
    assertNoSecrets(health.json());

    const i15Health = await app.inject({
      method: "GET",
      url: "/v1/erm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i15Health.statusCode).toBe(200);
    expect(i15Health.json().increment).toBe("I15");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/erm/kris/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "erm.kri")?.permissionKeys).toEqual([
      "erm:read:kri",
      "erm:write:kri",
    ]);
    expect(store.roles.find((r) => r.key === "risk.member")?.permissionKeys).toEqual([
      "erm:read:risk",
      "erm:write:risk",
    ]);
    expect(store.roles.find((r) => r.key === "risk.member")?.permissionKeys).not.toContain("erm:read:kri");
    expect(store.roles.find((r) => r.key === "risk.member")?.permissionKeys).not.toContain("erm:write:kri");

    const alice = [...store.principals.values()].find((p) => p.email === "alice.finance@sedmc.local");
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
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/erm/kris/health",
          headers: { authorization: `Bearer ${aliceAfter}` },
        })
      ).statusCode,
    ).toBe(403);
  });

  it("runs KRI lifecycle with human-only mutate, optional riskId, and no I15 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/erm/kris",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/erm/kris",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/erm/kris",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "A".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("title_too_long");

    const notesTooLong = await app.inject({
      method: "POST",
      url: "/v1/erm/kris",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Notes check", notes: "N".repeat(2001) },
    });
    expect(notesTooLong.statusCode).toBe(400);
    expect(notesTooLong.json().reason).toBe("notes_too_long");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignKriId = "97979797-9797-4979-8979-979797979797";
    const foreignRiskId = "98989898-9898-4989-8989-989898989898";
    store.ermKris.push({
      id: foreignKriId,
      tenantId: partnerTenant!.id,
      kriCode: "KRI-9999",
      title: "Other tenant KRI",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    store.ermRisks.push({
      id: foreignRiskId,
      tenantId: partnerTenant!.id,
      riskCode: "RSK-9999",
      title: "Other tenant risk",
      likelihood: 3,
      impact: 3,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/erm/kris/${foreignKriId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/erm/kris/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const risksSnapshot = JSON.stringify(store.ermRisks);
    const findingsSnapshot = JSON.stringify(store.findingRecords);

    const created = await app.inject({
      method: "POST",
      url: "/v1/erm/kris",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Travel disruption indicator",
        notes: "Catalogue row only — not a calculation",
        ownerLabel: "CRO (Dev/Test)",
        status: "retired",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().kri.kriCode).toBe("KRI-0001");
    expect(created.json().kri.status).toBe("open");
    expect(created.json().kri.title).toBe("Travel disruption indicator");
    expect(created.json().kri.riskId).toBeUndefined();
    expect(created.json().kri.formula).toBeUndefined();
    expect(created.json().kri.threshold).toBeUndefined();
    expect(created.json().kri.ragStatus).toBeUndefined();
    assertNoSecrets(created.json());
    const id = created.json().kri.id as string;

    const missingRisk = await app.inject({
      method: "POST",
      url: "/v1/erm/kris",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Missing risk", riskId: newId() },
    });
    expect(missingRisk.statusCode).toBe(400);
    expect(missingRisk.json().reason).toBe("risk_not_found");

    const wrongTenantRisk = await app.inject({
      method: "POST",
      url: "/v1/erm/kris",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Wrong tenant risk", riskId: foreignRiskId },
    });
    expect(wrongTenantRisk.statusCode).toBe(400);
    expect(wrongTenantRisk.json().reason).toBe("risk_not_found");

    const linked = await app.inject({
      method: "POST",
      url: "/v1/erm/kris",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Linked to residual risk",
        riskId: ERM_SEED.sampleRiskId,
      },
    });
    expect(linked.statusCode).toBe(201);
    expect(linked.json().kri.kriCode).toBe("KRI-0002");
    expect(linked.json().kri.riskId).toBe(ERM_SEED.sampleRiskId);
    expect(linked.json().kri.riskCode).toBe("RSK-0001");
    const linkedId = linked.json().kri.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/erm/kris",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/erm/kris/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "retired" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/erm/kris",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);
    expect(listed.json().items[0].kriCode).toBe("KRI-0002");

    const got = await app.inject({
      method: "GET",
      url: `/v1/erm/kris/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().kri.kriCode).toBe("KRI-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/erm/kris/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Travel disruption indicator — register only" },
    });
    expect(patched.json().kri.title).toBe("Travel disruption indicator — register only");

    const cleared = await app.inject({
      method: "PATCH",
      url: `/v1/erm/kris/${linkedId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { riskId: null },
    });
    expect(cleared.statusCode).toBe(200);
    expect(cleared.json().kri.riskId).toBeUndefined();
    expect(cleared.json().kri.riskCode).toBeUndefined();

    const reLinked = await app.inject({
      method: "PATCH",
      url: `/v1/erm/kris/${linkedId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { riskId: ERM_SEED.sampleRiskId },
    });
    expect(reLinked.json().kri.riskId).toBe(ERM_SEED.sampleRiskId);

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/erm/kris/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "active" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const retired = await app.inject({
      method: "PATCH",
      url: `/v1/erm/kris/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "retired" },
    });
    expect(retired.json().kri.status).toBe("retired");

    const patchRetired = await app.inject({
      method: "PATCH",
      url: `/v1/erm/kris/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchRetired.statusCode).toBe(409);
    expect(patchRetired.json().reason).toBe("retired");

    const reopen = await app.inject({
      method: "PATCH",
      url: `/v1/erm/kris/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "open" },
    });
    expect(reopen.statusCode).toBe(409);
    expect(reopen.json().reason).toBe("retired");

    for (const path of [
      "calculate",
      "measure",
      "threshold",
      "alert",
      "notify",
      "series",
      "dashboard",
      "score",
      "schedule",
      "treat",
      "finding",
    ]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/erm/kris/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/erm/risks/${ERM_SEED.sampleRiskId}/kri`,
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);

    expect(JSON.stringify(store.ermRisks)).toBe(risksSnapshot);
    expect(JSON.stringify(store.findingRecords)).toBe(findingsSnapshot);

    const i15After = await app.inject({
      method: "GET",
      url: "/v1/erm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i15After.json().increment).toBe("I15");

    expect("ermKris" in store).toBe(true);
    expect("ermKri" in store).toBe(false);
    expect("ermRisks" in store).toBe(true);
    expect("ermObligations" in store).toBe(false);
  });
});
