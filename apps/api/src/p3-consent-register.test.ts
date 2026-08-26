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

describe("P3 Consent Register", () => {
  it("lists P3 additive migration after committed 109_ite1", () => {
    expect(listMigrationFiles().some((f) => f.includes("110_p3_consent_records"))).toBe(true);
    expect(listMigrationFiles().some((f) => f.includes("109_ite1_it_endpoints"))).toBe(true);
  });

  it("enforces auth and tenant isolation without reusing P1 or P2 permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/consents/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/consents/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/consents",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/consents/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("P3");
    expect(health.json().module).toBe("consent-register");
    expect(health.json().consents).toBe(0);
    assertNoSecrets(health.json());

    const p1Health = await app.inject({
      method: "GET",
      url: "/v1/privacy/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p1Health.statusCode).toBe(200);
    expect(p1Health.json().increment).toBe("P1");

    const p2Health = await app.inject({
      method: "GET",
      url: "/v1/privacy/dpias/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p2Health.statusCode).toBe(200);
    expect(p2Health.json().increment).toBe("P2");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/consents/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "consent.register")?.permissionKeys).toEqual([
      "consent:read:register",
      "consent:write:register",
    ]);
    expect(store.roles.find((r) => r.key === "dpo")?.permissionKeys).not.toContain("consent:read:register");
    expect(store.roles.find((r) => r.key === "dpo")?.permissionKeys).not.toContain("consent:write:register");
    expect(store.roles.find((r) => r.key === "privacy.dpia")?.permissionKeys).not.toContain("consent:read:register");
    expect(store.roles.find((r) => r.key === "privacy.dpia")?.permissionKeys).not.toContain(
      "consent:write:register",
    );
    expect("consentRecords" in store).toBe(true);
    expect("privacyConsent" in store).toBe(false);
  });

  it("runs consent-register lifecycle with human-only mutate and no P1/P2 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/consents",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/consents",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/consents",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "A".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("title_too_long");

    const notesTooLong = await app.inject({
      method: "POST",
      url: "/v1/consents",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Notes check", notes: "N".repeat(2001) },
    });
    expect(notesTooLong.statusCode).toBe(400);
    expect(notesTooLong.json().reason).toBe("notes_too_long");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignId = "97979797-9797-4979-8979-979797979798";
    store.consentRecords.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      consentCode: "CNS-9999",
      title: "Other tenant consent row",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/consents/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/consents/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const activitiesSnapshot = JSON.stringify(store.privacyProcessingActivities);
    const dsrsSnapshot = JSON.stringify(store.privacyDsrCases);
    const dpiasSnapshot = JSON.stringify(store.privacyDpias);

    const created = await app.inject({
      method: "POST",
      url: "/v1/consents",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Catalogue row exists",
        notes: "Register row only — not captured consent",
        status: "cancelled",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().consent.consentCode).toBe("CNS-0001");
    expect(created.json().consent.status).toBe("open");
    expect(created.json().consent.title).toBe("Catalogue row exists");
    expect(created.json().consent.activityId).toBeUndefined();
    expect(created.json().consent.dsrId).toBeUndefined();
    expect(created.json().consent.dpiaId).toBeUndefined();
    expect(created.json().consent.subjectEmail).toBeUndefined();
    expect(created.json().consent.cookieId).toBeUndefined();
    expect(created.json().consent.providerId).toBeUndefined();
    expect(created.json().consent.lawfulBasis).toBeUndefined();
    expect(created.json().consent.grantedAt).toBeUndefined();
    expect(created.json().consent.withdrawnAt).toBeUndefined();
    expect(created.json().consent.evidence).toBeUndefined();
    assertNoSecrets(created.json());
    const id = created.json().consent.id as string;

    const second = await app.inject({
      method: "POST",
      url: "/v1/consents",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Second catalogue row" },
    });
    expect(second.statusCode).toBe(201);
    expect(second.json().consent.consentCode).toBe("CNS-0002");
    const secondId = second.json().consent.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/consents",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/consents/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/consents",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);
    expect(listed.json().items.some((row: { id: string }) => row.id === foreignId)).toBe(false);

    const byCode = await app.inject({
      method: "GET",
      url: "/v1/consents?q=CNS-0001",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(byCode.json().items).toHaveLength(1);
    expect(byCode.json().items[0].consentCode).toBe("CNS-0001");

    const byTitle = await app.inject({
      method: "GET",
      url: "/v1/consents?q=Second%20catalogue",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(byTitle.json().items).toHaveLength(1);
    expect(byTitle.json().items[0].id).toBe(secondId);

    const got = await app.inject({
      method: "GET",
      url: `/v1/consents/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().consent.consentCode).toBe("CNS-0001");
    assertNoSecrets(got.json());

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/consents/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Catalogue row exists — register only" },
    });
    expect(patched.json().consent.title).toBe("Catalogue row exists — register only");

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/consents/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "granted" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const done = await app.inject({
      method: "PATCH",
      url: `/v1/consents/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(done.json().consent.status).toBe("done");

    const patchDone = await app.inject({
      method: "PATCH",
      url: `/v1/consents/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchDone.statusCode).toBe(409);
    expect(patchDone.json().reason).toBe("done");

    const reopen = await app.inject({
      method: "PATCH",
      url: `/v1/consents/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "open" },
    });
    expect(reopen.statusCode).toBe(409);
    expect(reopen.json().reason).toBe("done");

    const cancelled = await app.inject({
      method: "PATCH",
      url: `/v1/consents/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "cancelled" },
    });
    expect(cancelled.json().consent.status).toBe("cancelled");

    const patchCancelled = await app.inject({
      method: "PATCH",
      url: `/v1/consents/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { notes: "Nope" },
    });
    expect(patchCancelled.statusCode).toBe(409);
    expect(patchCancelled.json().reason).toBe("cancelled");

    for (const path of [
      "collect",
      "notice",
      "sign",
      "grant",
      "withdraw",
      "enforce",
      "cookie",
      "prefer",
      "erase",
      "cmp",
    ]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/consents/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/privacy/dpias/${newId()}/consent`,
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);
    expect(
      (
        await app.inject({
          method: "GET",
          url: `/v1/privacy/dpias/${newId()}/consent`,
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);
    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/privacy/activities/${newId()}/consent`,
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);
    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/privacy/dsrs/${newId()}/consent`,
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);

    expect(JSON.stringify(store.privacyProcessingActivities)).toBe(activitiesSnapshot);
    expect(JSON.stringify(store.privacyDsrCases)).toBe(dsrsSnapshot);
    expect(JSON.stringify(store.privacyDpias)).toBe(dpiasSnapshot);

    const p1After = await app.inject({
      method: "GET",
      url: "/v1/privacy/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p1After.json().increment).toBe("P1");

    const p2After = await app.inject({
      method: "GET",
      url: "/v1/privacy/dpias/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p2After.json().increment).toBe("P2");

    expect("consentRecords" in store).toBe(true);
    expect("privacyConsent" in store).toBe(false);
    expect("privacyProcessingActivities" in store).toBe(true);
    expect("privacyDsrCases" in store).toBe(true);
    expect("privacyDpias" in store).toBe(true);
  });
});
