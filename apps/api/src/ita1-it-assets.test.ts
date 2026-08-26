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

describe("ITA1 IT asset register", () => {
  it("lists ITA1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("105_ita1_it_assets"))).toBe(true);
  });

  it("enforces auth and tenant isolation without reusing I11 permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/assets/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/assets/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/assets",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/assets/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("ITA1");
    expect(health.json().module).toBe("it-assets");
    expect(health.json().assets).toBe(0);
    assertNoSecrets(health.json());

    const i11Health = await app.inject({
      method: "GET",
      url: "/v1/itsm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i11Health.statusCode).toBe(200);
    expect(i11Health.json().increment).toBe("I11");

    const cmdbHealth = await app.inject({
      method: "GET",
      url: "/v1/cmdb/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(cmdbHealth.statusCode).toBe(200);
    expect(cmdbHealth.json().increment).toBe("I11");

    const itr1Health = await app.inject({
      method: "GET",
      url: "/v1/itsm/releases/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itr1Health.statusCode).toBe(200);
    expect(itr1Health.json().increment).toBe("ITR1");

    const p2Health = await app.inject({
      method: "GET",
      url: "/v1/privacy/dpias/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p2Health.statusCode).toBe(200);
    expect(p2Health.json().increment).toBe("P2");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/assets/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "it.asset")?.permissionKeys).toEqual([
      "asset:read:register",
      "asset:write:register",
    ]);
    expect(store.roles.find((r) => r.key === "it.agent")?.permissionKeys).not.toContain("asset:read:register");
    expect(store.roles.find((r) => r.key === "it.agent")?.permissionKeys).not.toContain("asset:write:register");
    expect(store.roles.find((r) => r.key === "itsm.release")?.permissionKeys).not.toContain("asset:read:register");
    expect(store.roles.find((r) => r.key === "itsm.release")?.permissionKeys).not.toContain("asset:write:register");
    expect(store.roles.find((r) => r.key === "privacy.dpia")?.permissionKeys).not.toContain("asset:write:register");
  });

  it("runs asset lifecycle with human-only mutate and no I11 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/assets",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/assets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/assets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "A".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("title_too_long");

    const notesTooLong = await app.inject({
      method: "POST",
      url: "/v1/assets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Notes check", notes: "N".repeat(2001) },
    });
    expect(notesTooLong.statusCode).toBe(400);
    expect(notesTooLong.json().reason).toBe("notes_too_long");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignId = "95959595-9595-4959-8959-959595959595";
    store.itAssets.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      assetCode: "AST-9999",
      title: "Other tenant asset",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/assets/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/assets/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const ticketsSnapshot = JSON.stringify(store.itsmTickets);
    const cisSnapshot = JSON.stringify(store.cmdbCis);
    const relationshipsSnapshot = JSON.stringify(store.cmdbRelationships);
    const releasesSnapshot = JSON.stringify(store.itsmReleases);
    const dpiasSnapshot = JSON.stringify(store.privacyDpias);

    const created = await app.inject({
      method: "POST",
      url: "/v1/assets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Reception laptop",
        notes: "Register row only — not discovery",
        status: "cancelled",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().asset.assetCode).toBe("AST-0001");
    expect(created.json().asset.status).toBe("open");
    expect(created.json().asset.title).toBe("Reception laptop");
    expect(created.json().asset.ciId).toBeUndefined();
    expect(created.json().asset.ticketId).toBeUndefined();
    expect(created.json().asset.releaseId).toBeUndefined();
    assertNoSecrets(created.json());
    const id = created.json().asset.id as string;

    const second = await app.inject({
      method: "POST",
      url: "/v1/assets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Meeting-room projector" },
    });
    expect(second.statusCode).toBe(201);
    expect(second.json().asset.assetCode).toBe("AST-0002");
    const secondId = second.json().asset.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/assets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/assets/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/assets",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);

    const got = await app.inject({
      method: "GET",
      url: `/v1/assets/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().asset.assetCode).toBe("AST-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/assets/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Reception laptop — register only" },
    });
    expect(patched.json().asset.title).toBe("Reception laptop — register only");

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/assets/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "retired" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const done = await app.inject({
      method: "PATCH",
      url: `/v1/assets/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(done.json().asset.status).toBe("done");

    const patchDone = await app.inject({
      method: "PATCH",
      url: `/v1/assets/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchDone.statusCode).toBe(409);
    expect(patchDone.json().reason).toBe("done");

    const reopen = await app.inject({
      method: "PATCH",
      url: `/v1/assets/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "open" },
    });
    expect(reopen.statusCode).toBe(409);
    expect(reopen.json().reason).toBe("done");

    const cancelled = await app.inject({
      method: "PATCH",
      url: `/v1/assets/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "cancelled" },
    });
    expect(cancelled.json().asset.status).toBe("cancelled");

    const patchCancelled = await app.inject({
      method: "PATCH",
      url: `/v1/assets/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { notes: "Nope" },
    });
    expect(patchCancelled.statusCode).toBe(409);
    expect(patchCancelled.json().reason).toBe("cancelled");

    for (const path of [
      "discover",
      "uem",
      "license",
      "endpoint",
      "cmdb",
      "reconcile",
      "approve",
      "dispose",
      "complete",
      "cancel",
    ]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/assets/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(JSON.stringify(store.itsmTickets)).toBe(ticketsSnapshot);
    expect(JSON.stringify(store.cmdbCis)).toBe(cisSnapshot);
    expect(JSON.stringify(store.cmdbRelationships)).toBe(relationshipsSnapshot);
    expect(JSON.stringify(store.itsmReleases)).toBe(releasesSnapshot);
    expect(JSON.stringify(store.privacyDpias)).toBe(dpiasSnapshot);

    const i11After = await app.inject({
      method: "GET",
      url: "/v1/itsm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i11After.json().increment).toBe("I11");

    const cmdbAfter = await app.inject({
      method: "GET",
      url: "/v1/cmdb/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(cmdbAfter.json().increment).toBe("I11");

    const itc1After = await app.inject({
      method: "GET",
      url: "/v1/itsm/changes/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itc1After.json().increment).toBe("ITC1");

    const itp1After = await app.inject({
      method: "GET",
      url: "/v1/itsm/problems/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itp1After.json().increment).toBe("ITP1");

    const itr1After = await app.inject({
      method: "GET",
      url: "/v1/itsm/releases/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itr1After.json().increment).toBe("ITR1");

    const p2After = await app.inject({
      method: "GET",
      url: "/v1/privacy/dpias/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p2After.json().increment).toBe("P2");

    expect("itAssets" in store).toBe(true);
    expect("itAsset" in store).toBe(false);
    expect("cmdbCis" in store).toBe(true);
    expect("itsmTickets" in store).toBe(true);
    expect("itsmReleases" in store).toBe(true);
  });
});
