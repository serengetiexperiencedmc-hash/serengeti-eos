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

describe("P2 DPIA register", () => {
  it("lists P2 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("104_p2_privacy_dpias"))).toBe(true);
  });

  it("enforces auth and tenant isolation without reusing P1 permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/privacy/dpias/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/privacy/dpias/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/privacy/dpias",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/privacy/dpias/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("P2");
    expect(health.json().module).toBe("privacy-dpias");
    expect(health.json().dpias).toBe(0);
    assertNoSecrets(health.json());

    const p1Health = await app.inject({
      method: "GET",
      url: "/v1/privacy/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p1Health.statusCode).toBe(200);
    expect(p1Health.json().increment).toBe("P1");

    const itr1Health = await app.inject({
      method: "GET",
      url: "/v1/itsm/releases/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itr1Health.statusCode).toBe(200);
    expect(itr1Health.json().increment).toBe("ITR1");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/privacy/dpias/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "privacy.dpia")?.permissionKeys).toEqual([
      "privacy:read:dpia",
      "privacy:write:dpia",
    ]);
    expect(store.roles.find((r) => r.key === "dpo")?.permissionKeys).not.toContain("privacy:read:dpia");
    expect(store.roles.find((r) => r.key === "dpo")?.permissionKeys).not.toContain("privacy:write:dpia");
    expect(store.roles.find((r) => r.key === "itsm.release")?.permissionKeys).not.toContain("privacy:read:dpia");
    expect(store.roles.find((r) => r.key === "hr.certification")?.permissionKeys).not.toContain("privacy:write:dpia");
  });

  it("runs DPIA lifecycle with human-only mutate and no P1 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/privacy/dpias",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/privacy/dpias",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/privacy/dpias",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "D".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("title_too_long");

    const notesTooLong = await app.inject({
      method: "POST",
      url: "/v1/privacy/dpias",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Notes check", notes: "N".repeat(2001) },
    });
    expect(notesTooLong.statusCode).toBe(400);
    expect(notesTooLong.json().reason).toBe("notes_too_long");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignId = "94949494-9494-4949-8949-949494949494";
    store.privacyDpias.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      dpiaCode: "DPI-9999",
      title: "Other tenant DPIA",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/privacy/dpias/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/privacy/dpias/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const p1Before = await app.inject({
      method: "GET",
      url: "/v1/privacy/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p1Before.json().increment).toBe("P1");
    const activitiesBefore = p1Before.json().activities as number;
    const dsrsBefore = p1Before.json().dsrs as number;
    const activitiesSnapshot = JSON.stringify(store.privacyProcessingActivities);
    const dsrsSnapshot = JSON.stringify(store.privacyDsrCases);

    const created = await app.inject({
      method: "POST",
      url: "/v1/privacy/dpias",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Field-app offline cache assessment",
        notes: "Register row only — not a legal DPIA",
        status: "cancelled",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().dpia.dpiaCode).toBe("DPI-0001");
    expect(created.json().dpia.status).toBe("open");
    expect(created.json().dpia.title).toBe("Field-app offline cache assessment");
    expect(created.json().dpia.activityId).toBeUndefined();
    expect(created.json().dpia.dsrId).toBeUndefined();
    assertNoSecrets(created.json());
    const id = created.json().dpia.id as string;

    const second = await app.inject({
      method: "POST",
      url: "/v1/privacy/dpias",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Supplier portal intake" },
    });
    expect(second.statusCode).toBe(201);
    expect(second.json().dpia.dpiaCode).toBe("DPI-0002");
    const secondId = second.json().dpia.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/privacy/dpias",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/dpias/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/privacy/dpias",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);

    const got = await app.inject({
      method: "GET",
      url: `/v1/privacy/dpias/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().dpia.dpiaCode).toBe("DPI-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/dpias/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Field-app offline cache assessment — register only" },
    });
    expect(patched.json().dpia.title).toBe("Field-app offline cache assessment — register only");

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/dpias/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "approved" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const done = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/dpias/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(done.json().dpia.status).toBe("done");

    const patchDone = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/dpias/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchDone.statusCode).toBe(409);
    expect(patchDone.json().reason).toBe("done");

    const reopen = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/dpias/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "open" },
    });
    expect(reopen.statusCode).toBe(409);
    expect(reopen.json().reason).toBe("done");

    const cancelled = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/dpias/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "cancelled" },
    });
    expect(cancelled.json().dpia.status).toBe("cancelled");

    const patchCancelled = await app.inject({
      method: "PATCH",
      url: `/v1/privacy/dpias/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { notes: "Nope" },
    });
    expect(patchCancelled.statusCode).toBe(409);
    expect(patchCancelled.json().reason).toBe("cancelled");

    for (const path of [
      "approve",
      "reject",
      "legal",
      "opinion",
      "assess",
      "erase",
      "consent",
      "dlp",
      "complete",
      "cancel",
    ]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/privacy/dpias/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(JSON.stringify(store.privacyProcessingActivities)).toBe(activitiesSnapshot);
    expect(JSON.stringify(store.privacyDsrCases)).toBe(dsrsSnapshot);
    expect(store.privacyProcessingActivities.some((a) => a.id === PRIVACY_SEED.sampleActivityId)).toBe(true);

    const p1After = await app.inject({
      method: "GET",
      url: "/v1/privacy/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p1After.json().increment).toBe("P1");
    expect(p1After.json().activities).toBe(activitiesBefore);
    expect(p1After.json().dsrs).toBe(dsrsBefore);

    const itr1After = await app.inject({
      method: "GET",
      url: "/v1/itsm/releases/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itr1After.json().increment).toBe("ITR1");

    const g1After = await app.inject({
      method: "GET",
      url: "/v1/compliance/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g1After.json().increment).toBe("G1");

    const i15After = await app.inject({
      method: "GET",
      url: "/v1/erm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i15After.json().increment).toBe("I15");

    expect("privacyDpias" in store).toBe(true);
    expect("privacyDpia" in store).toBe(false);
    expect("privacyRopa" in store).toBe(false);
    expect("privacyDsr" in store).toBe(false);
    expect("privacyConsent" in store).toBe(false);
    expect("privacyDlp" in store).toBe(false);
  });
});
