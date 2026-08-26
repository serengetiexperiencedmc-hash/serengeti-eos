import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { CI_CLASSES, newId } from "@sedmc/kernel";
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

describe("ITE1 IT endpoint register", () => {
  it("lists ITE1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("109_ite1_it_endpoints"))).toBe(true);
    expect(listMigrationFiles().some((f) => f.includes("116_ite1_it_endpoints"))).toBe(false);
  });

  it("enforces auth and tenant isolation without reusing ITA1, ITL1, or I11 permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/endpoints/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/endpoints/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/endpoints",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/endpoints/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("ITE1");
    expect(health.json().module).toBe("it-endpoints");
    expect(health.json().endpoints).toBe(0);
    assertNoSecrets(health.json());

    const ita1Health = await app.inject({
      method: "GET",
      url: "/v1/assets/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(ita1Health.statusCode).toBe(200);
    expect(ita1Health.json().increment).toBe("ITA1");

    const itl1Health = await app.inject({
      method: "GET",
      url: "/v1/licenses/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itl1Health.statusCode).toBe(200);
    expect(itl1Health.json().increment).toBe("ITL1");

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

    const e1Health = await app.inject({
      method: "GET",
      url: "/v1/erm/kris/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(e1Health.statusCode).toBe(200);
    expect(e1Health.json().increment).toBe("E1");

    const e2Health = await app.inject({
      method: "GET",
      url: "/v1/erm/treatments/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(e2Health.statusCode).toBe(200);
    expect(e2Health.json().increment).toBe("E2");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/endpoints/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "it.endpoint")?.permissionKeys).toEqual([
      "endpoint:read:register",
      "endpoint:write:register",
    ]);
    expect(store.roles.find((r) => r.key === "it.asset")?.permissionKeys).not.toContain("endpoint:read:register");
    expect(store.roles.find((r) => r.key === "it.asset")?.permissionKeys).not.toContain("endpoint:write:register");
    expect(store.roles.find((r) => r.key === "it.license")?.permissionKeys).not.toContain("endpoint:read:register");
    expect(store.roles.find((r) => r.key === "it.license")?.permissionKeys).not.toContain("endpoint:write:register");
    expect(store.roles.find((r) => r.key === "it.agent")?.permissionKeys).not.toContain("endpoint:read:register");
    expect(store.roles.find((r) => r.key === "it.agent")?.permissionKeys).not.toContain("endpoint:write:register");
    expect(store.roles.find((r) => r.key === "itsm.release")?.permissionKeys).not.toContain("endpoint:read:register");
    expect(store.roles.find((r) => r.key === "itsm.release")?.permissionKeys).not.toContain("endpoint:write:register");
    expect(CI_CLASSES).toContain("endpoint");
  });

  it("runs endpoint lifecycle with human-only mutate and no ITA1/ITL1/I11/E1/E2 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/endpoints",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/endpoints",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/endpoints",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "A".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("title_too_long");

    const notesTooLong = await app.inject({
      method: "POST",
      url: "/v1/endpoints",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Notes check", notes: "N".repeat(2001) },
    });
    expect(notesTooLong.statusCode).toBe(400);
    expect(notesTooLong.json().reason).toBe("notes_too_long");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignId = "97979797-9797-4979-8979-979797979797";
    store.itEndpoints.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      endpointCode: "END-9999",
      title: "Other tenant endpoint",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/endpoints/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/endpoints/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const ticketsSnapshot = JSON.stringify(store.itsmTickets);
    const cisSnapshot = JSON.stringify(store.cmdbCis);
    const relationshipsSnapshot = JSON.stringify(store.cmdbRelationships);
    const releasesSnapshot = JSON.stringify(store.itsmReleases);
    const assetsSnapshot = JSON.stringify(store.itAssets);
    const licensesSnapshot = JSON.stringify(store.itLicenses);
    const krisSnapshot = JSON.stringify(store.ermKris);
    const treatmentsSnapshot = JSON.stringify(store.ermTreatments);

    const created = await app.inject({
      method: "POST",
      url: "/v1/endpoints",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Laptop register row",
        notes: "Register row only — not UEM",
        status: "cancelled",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().endpoint.endpointCode).toBe("END-0001");
    expect(created.json().endpoint.status).toBe("open");
    expect(created.json().endpoint.title).toBe("Laptop register row");
    expect(created.json().endpoint.assetId).toBeUndefined();
    expect(created.json().endpoint.ciId).toBeUndefined();
    expect(created.json().endpoint.licenseId).toBeUndefined();
    expect(created.json().endpoint.serialNumber).toBeUndefined();
    expect(created.json().endpoint.hostname).toBeUndefined();
    expect(created.json().endpoint.ipAddress).toBeUndefined();
    expect(created.json().endpoint.macAddress).toBeUndefined();
    expect(created.json().endpoint.lastSeen).toBeUndefined();
    assertNoSecrets(created.json());
    const id = created.json().endpoint.id as string;

    const second = await app.inject({
      method: "POST",
      url: "/v1/endpoints",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Phone register row" },
    });
    expect(second.statusCode).toBe(201);
    expect(second.json().endpoint.endpointCode).toBe("END-0002");
    const secondId = second.json().endpoint.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/endpoints",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/endpoints/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/endpoints",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);

    const got = await app.inject({
      method: "GET",
      url: `/v1/endpoints/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().endpoint.endpointCode).toBe("END-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/endpoints/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Laptop register row — register only" },
    });
    expect(patched.json().endpoint.title).toBe("Laptop register row — register only");

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/endpoints/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "enrolled" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const done = await app.inject({
      method: "PATCH",
      url: `/v1/endpoints/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(done.json().endpoint.status).toBe("done");

    const patchDone = await app.inject({
      method: "PATCH",
      url: `/v1/endpoints/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchDone.statusCode).toBe(409);
    expect(patchDone.json().reason).toBe("done");

    const reopen = await app.inject({
      method: "PATCH",
      url: `/v1/endpoints/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "open" },
    });
    expect(reopen.statusCode).toBe(409);
    expect(reopen.json().reason).toBe("done");

    const cancelled = await app.inject({
      method: "PATCH",
      url: `/v1/endpoints/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "cancelled" },
    });
    expect(cancelled.json().endpoint.status).toBe("cancelled");

    const patchCancelled = await app.inject({
      method: "PATCH",
      url: `/v1/endpoints/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { notes: "Nope" },
    });
    expect(patchCancelled.statusCode).toBe(409);
    expect(patchCancelled.json().reason).toBe("cancelled");

    for (const path of [
      "enrol",
      "discover",
      "wipe",
      "quarantine",
      "comply",
      "lock",
      "unlock",
      "locate",
      "uem",
      "mdm",
      "edr",
      "agent",
      "heartbeat",
      "telemetry",
      "policy",
    ]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/endpoints/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/assets/${newId()}/endpoint`,
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);

    expect(
      (
        await app.inject({
          method: "POST",
          url: `/v1/licenses/${newId()}/endpoint`,
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);

    expect(JSON.stringify(store.itsmTickets)).toBe(ticketsSnapshot);
    expect(JSON.stringify(store.cmdbCis)).toBe(cisSnapshot);
    expect(JSON.stringify(store.cmdbRelationships)).toBe(relationshipsSnapshot);
    expect(JSON.stringify(store.itsmReleases)).toBe(releasesSnapshot);
    expect(JSON.stringify(store.itAssets)).toBe(assetsSnapshot);
    expect(JSON.stringify(store.itLicenses)).toBe(licensesSnapshot);
    expect(JSON.stringify(store.ermKris)).toBe(krisSnapshot);
    expect(JSON.stringify(store.ermTreatments)).toBe(treatmentsSnapshot);

    const ita1After = await app.inject({
      method: "GET",
      url: "/v1/assets/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(ita1After.json().increment).toBe("ITA1");

    const itl1After = await app.inject({
      method: "GET",
      url: "/v1/licenses/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itl1After.json().increment).toBe("ITL1");

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

    const e1After = await app.inject({
      method: "GET",
      url: "/v1/erm/kris/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(e1After.json().increment).toBe("E1");

    const e2After = await app.inject({
      method: "GET",
      url: "/v1/erm/treatments/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(e2After.json().increment).toBe("E2");

    expect("itEndpoints" in store).toBe(true);
    expect("itEndpoint" in store).toBe(false);
    expect("itAssets" in store).toBe(true);
    expect("itLicenses" in store).toBe(true);
    expect("cmdbCis" in store).toBe(true);
    expect("itsmTickets" in store).toBe(true);
    expect("ermKris" in store).toBe(true);
    expect("ermTreatments" in store).toBe(true);
  });
});
