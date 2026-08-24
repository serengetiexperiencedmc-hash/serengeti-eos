import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { IT_SEED } from "../src/it/collections.js";
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

describe("ITR1 IT release register", () => {
  it("lists ITR1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("103_itr1_itsm_releases"))).toBe(true);
  });

  it("enforces auth and tenant isolation without reusing I11, ITC1, or ITP1 permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/itsm/releases/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/releases/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/releases",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/itsm/releases/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("ITR1");
    expect(health.json().module).toBe("itsm-releases");
    expect(health.json().releases).toBe(0);
    assertNoSecrets(health.json());

    const i11Health = await app.inject({
      method: "GET",
      url: "/v1/itsm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i11Health.statusCode).toBe(200);
    expect(i11Health.json().increment).toBe("I11");

    const itc1Health = await app.inject({
      method: "GET",
      url: "/v1/itsm/changes/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itc1Health.statusCode).toBe(200);
    expect(itc1Health.json().increment).toBe("ITC1");

    const itp1Health = await app.inject({
      method: "GET",
      url: "/v1/itsm/problems/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itp1Health.statusCode).toBe(200);
    expect(itp1Health.json().increment).toBe("ITP1");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/itsm/releases/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "itsm.release")?.permissionKeys).toEqual([
      "itsm:read:release",
      "itsm:write:release",
    ]);
    expect(store.roles.find((r) => r.key === "it.agent")?.permissionKeys).not.toContain("itsm:read:release");
    expect(store.roles.find((r) => r.key === "it.agent")?.permissionKeys).not.toContain("itsm:write:release");
    expect(store.roles.find((r) => r.key === "itsm.change")?.permissionKeys).not.toContain("itsm:read:release");
    expect(store.roles.find((r) => r.key === "itsm.change")?.permissionKeys).not.toContain("itsm:write:release");
    expect(store.roles.find((r) => r.key === "itsm.problem")?.permissionKeys).not.toContain("itsm:read:release");
    expect(store.roles.find((r) => r.key === "itsm.problem")?.permissionKeys).not.toContain("itsm:write:release");
    expect(store.roles.find((r) => r.key === "hr.certification")?.permissionKeys).not.toContain("itsm:write:release");
    expect(store.roles.find((r) => r.key === "crisis.action")?.permissionKeys).not.toContain("itsm:read:release");
  });

  it("runs release lifecycle with human-only mutate, optional CI reference, and no I11/ITC1/ITP1 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/itsm/releases",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/itsm/releases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/itsm/releases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "R".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("title_too_long");

    const unknownCi = await app.inject({
      method: "POST",
      url: "/v1/itsm/releases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Unknown CI", ciId: newId() },
    });
    expect(unknownCi.statusCode).toBe(400);
    expect(unknownCi.json().reason).toBe("ci_not_found");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignCiId = "91919191-9191-4919-8919-919191919191";
    store.cmdbCis.push({
      id: foreignCiId,
      tenantId: partnerTenant!.id,
      ciCode: "CI-9999",
      name: "Other tenant CI",
      ciClass: "application",
      lifecycle: "active",
      environment: "development",
      criticality: "low",
      classification: "Internal",
      sourceOfTruth: "manual",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossCi = await app.inject({
      method: "POST",
      url: "/v1/itsm/releases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant CI", ciId: foreignCiId },
    });
    expect(crossCi.statusCode).toBe(400);
    expect(crossCi.json().reason).toBe("ci_not_found");

    const foreignId = "93939393-9393-4939-8939-939393939393";
    store.itsmReleases.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      releaseCode: "REL-9999",
      title: "Other tenant release",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/itsm/releases/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/releases/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const i11Before = await app.inject({
      method: "GET",
      url: "/v1/itsm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i11Before.json().increment).toBe("I11");
    const ticketsBefore = i11Before.json().tickets as number;
    const openTicketsBefore = i11Before.json().openTickets as number;
    const cmdbBefore = await app.inject({
      method: "GET",
      url: "/v1/cmdb/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    const cisBefore = cmdbBefore.json().cis as number;
    const relationshipsBefore = cmdbBefore.json().relationships as number;
    const itc1Before = await app.inject({
      method: "GET",
      url: "/v1/itsm/changes/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itc1Before.json().increment).toBe("ITC1");
    const changesBefore = itc1Before.json().changes as number;
    const itp1Before = await app.inject({
      method: "GET",
      url: "/v1/itsm/problems/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itp1Before.json().increment).toBe("ITP1");
    const problemsBefore = itp1Before.json().problems as number;
    const seedCi = store.cmdbCis.find((c) => c.id === IT_SEED.webCiId);
    expect(seedCi).toBeDefined();
    const ciSnapshot = JSON.stringify(seedCi);
    const ticketSnapshot = JSON.stringify(store.itsmTickets.filter((t) => t.tenantId === seedCi!.tenantId));
    const changesSnapshot = JSON.stringify(store.itsmChanges);
    const problemsSnapshot = JSON.stringify(store.itsmProblems);

    const created = await app.inject({
      method: "POST",
      url: "/v1/itsm/releases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Cut weekend maintenance window",
        notes: "Register row only — not a deploy",
        status: "cancelled",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().release.releaseCode).toBe("REL-0001");
    expect(created.json().release.status).toBe("open");
    expect(created.json().release.title).toBe("Cut weekend maintenance window");
    expect(created.json().release.ciId).toBeUndefined();
    assertNoSecrets(created.json());
    const id = created.json().release.id as string;

    const withCi = await app.inject({
      method: "POST",
      url: "/v1/itsm/releases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Ship EOS Web package", ciId: IT_SEED.webCiId },
    });
    expect(withCi.statusCode).toBe(201);
    expect(withCi.json().release.releaseCode).toBe("REL-0002");
    expect(withCi.json().release.ciId).toBe(IT_SEED.webCiId);
    expect(withCi.json().release.ciCode).toBe("CI-0001");
    const withCiId = withCi.json().release.id as string;

    const retiredCi = store.cmdbCis.find((c) => c.id === IT_SEED.dbCiId);
    expect(retiredCi).toBeDefined();
    retiredCi!.lifecycle = "retired";
    const retired = await app.inject({
      method: "POST",
      url: "/v1/itsm/releases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Retire DB label package", ciId: IT_SEED.dbCiId },
    });
    expect(retired.statusCode).toBe(201);
    expect(retired.json().release.ciId).toBe(IT_SEED.dbCiId);

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/itsm/releases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/releases/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/itsm/releases",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);

    const got = await app.inject({
      method: "GET",
      url: `/v1/itsm/releases/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().release.releaseCode).toBe("REL-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/releases/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cut weekend maintenance window — register only", ciId: newId() },
    });
    expect(patched.json().release.title).toBe("Cut weekend maintenance window — register only");
    expect(patched.json().release.ciId).toBeUndefined();

    const ciImmutable = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/releases/${withCiId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { ciId: IT_SEED.apiCiId },
    });
    expect(ciImmutable.json().release.ciId).toBe(IT_SEED.webCiId);

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/releases/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "approved" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const done = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/releases/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(done.json().release.status).toBe("done");

    const patchDone = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/releases/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchDone.statusCode).toBe(409);
    expect(patchDone.json().reason).toBe("done");

    const reopen = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/releases/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "open" },
    });
    expect(reopen.statusCode).toBe(409);
    expect(reopen.json().reason).toBe("done");

    const cancelled = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/releases/${withCiId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "cancelled" },
    });
    expect(cancelled.json().release.status).toBe("cancelled");

    const patchCancelled = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/releases/${withCiId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { notes: "Nope" },
    });
    expect(patchCancelled.statusCode).toBe(409);
    expect(patchCancelled.json().reason).toBe("cancelled");

    for (const path of [
      "approve",
      "reject",
      "execute",
      "deploy",
      "schedule",
      "rollback",
      "promote",
      "freeze",
      "cab",
      "emergency",
      "complete",
      "cancel",
    ]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/itsm/releases/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(JSON.stringify(store.cmdbCis.find((c) => c.id === IT_SEED.webCiId))).toBe(ciSnapshot);
    expect(JSON.stringify(store.itsmTickets.filter((t) => t.tenantId === seedCi!.tenantId))).toBe(ticketSnapshot);
    expect(JSON.stringify(store.itsmChanges)).toBe(changesSnapshot);
    expect(JSON.stringify(store.itsmProblems)).toBe(problemsSnapshot);
    expect(store.cmdbCis.find((c) => c.id === IT_SEED.dbCiId)?.lifecycle).toBe("retired");

    const i11After = await app.inject({
      method: "GET",
      url: "/v1/itsm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i11After.json().increment).toBe("I11");
    expect(i11After.json().tickets).toBe(ticketsBefore);
    expect(i11After.json().openTickets).toBe(openTicketsBefore);

    const cmdbAfter = await app.inject({
      method: "GET",
      url: "/v1/cmdb/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(cmdbAfter.json().increment).toBe("I11");
    expect(cmdbAfter.json().cis).toBe(cisBefore);
    expect(cmdbAfter.json().relationships).toBe(relationshipsBefore);

    const itc1After = await app.inject({
      method: "GET",
      url: "/v1/itsm/changes/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itc1After.json().increment).toBe("ITC1");
    expect(itc1After.json().changes).toBe(changesBefore);

    const itp1After = await app.inject({
      method: "GET",
      url: "/v1/itsm/problems/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itp1After.json().increment).toBe("ITP1");
    expect(itp1After.json().problems).toBe(problemsBefore);

    const h1After = await app.inject({
      method: "GET",
      url: "/v1/hr/certifications/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(h1After.json().increment).toBe("H1");

    const i10After = await app.inject({
      method: "GET",
      url: "/v1/hr/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i10After.json().increment).toBe("I10");

    const i18After = await app.inject({
      method: "GET",
      url: "/v1/crisis/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i18After.json().increment).toBe("I18");

    const k1After = await app.inject({
      method: "GET",
      url: "/v1/crisis/decisions/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(k1After.json().increment).toBe("K1");

    const k2After = await app.inject({
      method: "GET",
      url: "/v1/crisis/actions/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(k2After.json().increment).toBe("K2");

    const o6After = await app.inject({
      method: "GET",
      url: "/v1/ops/issues/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(o6After.json().increment).toBe("O6");

    const g1After = await app.inject({
      method: "GET",
      url: "/v1/compliance/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g1After.json().increment).toBe("G1");

    const g2After = await app.inject({
      method: "GET",
      url: "/v1/grc/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g2After.json().increment).toBe("G2");

    const g3After = await app.inject({
      method: "GET",
      url: "/v1/findings/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g3After.json().increment).toBe("G3");

    const g4After = await app.inject({
      method: "GET",
      url: "/v1/control-tests/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g4After.json().increment).toBe("G4");

    const g5After = await app.inject({
      method: "GET",
      url: "/v1/mappings/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(g5After.json().increment).toBe("G5");

    const p1After = await app.inject({
      method: "GET",
      url: "/v1/privacy/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(p1After.json().increment).toBe("P1");

    const i15After = await app.inject({
      method: "GET",
      url: "/v1/erm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i15After.json().increment).toBe("I15");

    const i17After = await app.inject({
      method: "GET",
      url: "/v1/bcm/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i17After.json().increment).toBe("I17");

    const c9After = await app.inject({
      method: "GET",
      url: "/v1/bookings/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(c9After.statusCode).toBe(200);
    expect(c9After.json().increment).toBe("C9-C10");

    expect("itsmReleases" in store).toBe(true);
    expect("itsmChanges" in store).toBe(true);
    expect("itsmProblems" in store).toBe(true);
  });
});
