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

describe("ITP1 IT problem register", () => {
  it("lists ITP1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("102_itp1_itsm_problems"))).toBe(true);
  });

  it("enforces auth and tenant isolation without reusing I11 or ITC1 permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/itsm/problems/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/problems/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/problems",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/itsm/problems/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("ITP1");
    expect(health.json().problems).toBe(0);
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

    const missing = await app.inject({
      method: "GET",
      url: `/v1/itsm/problems/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "itsm.problem")?.permissionKeys).toEqual([
      "itsm:read:problem",
      "itsm:write:problem",
    ]);
    expect(store.roles.find((r) => r.key === "it.agent")?.permissionKeys).not.toContain("itsm:read:problem");
    expect(store.roles.find((r) => r.key === "it.agent")?.permissionKeys).not.toContain("itsm:write:problem");
    expect(store.roles.find((r) => r.key === "itsm.change")?.permissionKeys).not.toContain("itsm:read:problem");
    expect(store.roles.find((r) => r.key === "itsm.change")?.permissionKeys).not.toContain("itsm:write:problem");
  });

  it("runs problem lifecycle with human-only mutate, optional ticket/CI references, and no I11 or ITC1 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/itsm/problems",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/itsm/problems",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const unknownTicket = await app.inject({
      method: "POST",
      url: "/v1/itsm/problems",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Unknown ticket", ticketId: newId() },
    });
    expect(unknownTicket.statusCode).toBe(400);
    expect(unknownTicket.json().reason).toBe("ticket_not_found");

    const unknownCi = await app.inject({
      method: "POST",
      url: "/v1/itsm/problems",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Unknown CI", ciId: newId() },
    });
    expect(unknownCi.statusCode).toBe(400);
    expect(unknownCi.json().reason).toBe("ci_not_found");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignTicketId = "90909090-9090-4909-8909-909090909090";
    store.itsmTickets.push({
      id: foreignTicketId,
      tenantId: partnerTenant!.id,
      ticketCode: "TKT-9999",
      title: "Other tenant ticket",
      ticketType: "incident",
      severity: "low",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
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
    const crossTicket = await app.inject({
      method: "POST",
      url: "/v1/itsm/problems",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant ticket", ticketId: foreignTicketId },
    });
    expect(crossTicket.statusCode).toBe(400);
    expect(crossTicket.json().reason).toBe("ticket_not_found");
    const crossCi = await app.inject({
      method: "POST",
      url: "/v1/itsm/problems",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant CI", ciId: foreignCiId },
    });
    expect(crossCi.statusCode).toBe(400);
    expect(crossCi.json().reason).toBe("ci_not_found");

    const foreignId = "93939393-9393-4939-8939-939393939393";
    store.itsmProblems.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      problemCode: "PRB-9999",
      title: "Other tenant problem",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/itsm/problems/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/itsm/problems/health",
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
    const itc1Before = await app.inject({
      method: "GET",
      url: "/v1/itsm/changes/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    const changesBefore = itc1Before.json().changes as number;
    const seedTicket = store.itsmTickets.find((t) => t.id === IT_SEED.outageTicketId);
    expect(seedTicket).toBeDefined();
    const ticketSnapshot = JSON.stringify(seedTicket);
    const ciSnapshot = JSON.stringify(store.cmdbCis.find((c) => c.id === IT_SEED.webCiId));
    const changesSnapshot = JSON.stringify(store.itsmChanges);

    const created = await app.inject({
      method: "POST",
      url: "/v1/itsm/problems",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Recurring API timeouts", notes: "Register row only — not RCA", status: "cancelled" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().problem.problemCode).toBe("PRB-0001");
    expect(created.json().problem.status).toBe("open");
    expect(created.json().problem.ticketId).toBeUndefined();
    expect(created.json().problem.ciId).toBeUndefined();
    assertNoSecrets(created.json());
    const id = created.json().problem.id as string;

    const withRefs = await app.inject({
      method: "POST",
      url: "/v1/itsm/problems",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Web outage cluster", ticketId: IT_SEED.outageTicketId, ciId: IT_SEED.webCiId },
    });
    expect(withRefs.statusCode).toBe(201);
    expect(withRefs.json().problem.problemCode).toBe("PRB-0002");
    expect(withRefs.json().problem.ticketId).toBe(IT_SEED.outageTicketId);
    expect(withRefs.json().problem.ciId).toBe(IT_SEED.webCiId);
    expect(withRefs.json().problem.ticketCode).toBeDefined();
    expect(withRefs.json().problem.ciCode).toBe("CI-0001");
    const withRefsId = withRefs.json().problem.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/itsm/problems",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/problems/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/itsm/problems",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);

    const got = await app.inject({
      method: "GET",
      url: `/v1/itsm/problems/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().problem.problemCode).toBe("PRB-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/problems/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Recurring API timeouts — register only", ticketId: newId(), ciId: newId() },
    });
    expect(patched.json().problem.title).toBe("Recurring API timeouts — register only");
    expect(patched.json().problem.ticketId).toBeUndefined();
    expect(patched.json().problem.ciId).toBeUndefined();

    const refsImmutable = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/problems/${withRefsId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { ticketId: newId(), ciId: IT_SEED.apiCiId },
    });
    expect(refsImmutable.json().problem.ticketId).toBe(IT_SEED.outageTicketId);
    expect(refsImmutable.json().problem.ciId).toBe(IT_SEED.webCiId);

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/problems/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "known_error" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const done = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/problems/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(done.json().problem.status).toBe("done");

    const patchDone = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/problems/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchDone.statusCode).toBe(409);
    expect(patchDone.json().reason).toBe("done");

    const cancelled = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/problems/${withRefsId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "cancelled" },
    });
    expect(cancelled.json().problem.status).toBe("cancelled");

    const patchCancelled = await app.inject({
      method: "PATCH",
      url: `/v1/itsm/problems/${withRefsId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(patchCancelled.statusCode).toBe(409);
    expect(patchCancelled.json().reason).toBe("cancelled");

    for (const path of ["root-cause", "known-error", "major", "approve", "execute", "schedule", "escalate", "sla"]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/itsm/problems/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(JSON.stringify(store.itsmTickets.find((t) => t.id === IT_SEED.outageTicketId))).toBe(ticketSnapshot);
    expect(JSON.stringify(store.cmdbCis.find((c) => c.id === IT_SEED.webCiId))).toBe(ciSnapshot);
    expect(JSON.stringify(store.itsmChanges)).toBe(changesSnapshot);

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

    const itc1After = await app.inject({
      method: "GET",
      url: "/v1/itsm/changes/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(itc1After.json().increment).toBe("ITC1");
    expect(itc1After.json().changes).toBe(changesBefore);

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

    expect("itsmProblems" in store).toBe(true);
    expect("itsmReleases" in store).toBe(false);
  });
});
