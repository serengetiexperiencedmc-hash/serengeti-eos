import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { CRISIS_SEED } from "../src/crisis/collections.js";
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

describe("K2 crisis action register", () => {
  it("lists K2 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("099_k2_crisis_actions"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/crisis/actions/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/crisis/actions/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/crisis/actions",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/crisis/actions/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("K2");
    expect(health.json().actions).toBe(0);
    assertNoSecrets(health.json());

    const i18Health = await app.inject({
      method: "GET",
      url: "/v1/crisis/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i18Health.statusCode).toBe(200);
    expect(i18Health.json().increment).toBe("I18");

    const k1Health = await app.inject({
      method: "GET",
      url: "/v1/crisis/decisions/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(k1Health.statusCode).toBe(200);
    expect(k1Health.json().increment).toBe("K1");

    const o6Health = await app.inject({
      method: "GET",
      url: "/v1/ops/issues/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(o6Health.statusCode).toBe(200);
    expect(o6Health.json().increment).toBe("O6");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/crisis/actions/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "crisis.action")?.permissionKeys).toEqual([
      "crisis:read:action",
      "crisis:write:action",
    ]);
    expect(store.roles.find((r) => r.key === "crisis.commander")?.permissionKeys).toEqual([
      "crisis:read:case",
      "crisis:write:case",
      "crisis:read:timeline",
      "crisis:write:timeline",
    ]);
    expect(store.roles.find((r) => r.key === "crisis.decision")?.permissionKeys).toEqual([
      "crisis:read:decision",
      "crisis:write:decision",
    ]);
    expect(store.roles.find((r) => r.key === "ops.issue")?.permissionKeys).not.toContain("crisis:read:action");
    expect(store.roles.find((r) => r.key === "grc.mapping")?.permissionKeys).not.toContain("crisis:write:action");
  });

  it("runs action lifecycle with human-only mutate, crisis reference, and no I18/K1/O6 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/crisis/actions",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record", crisisId: CRISIS_SEED.sampleCaseId },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/crisis/actions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   ", crisisId: CRISIS_SEED.sampleCaseId },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const missingCrisis = await app.inject({
      method: "POST",
      url: "/v1/crisis/actions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "No crisis" },
    });
    expect(missingCrisis.statusCode).toBe(400);
    expect(missingCrisis.json().reason).toBe("crisis_not_found");

    const unknownCrisis = await app.inject({
      method: "POST",
      url: "/v1/crisis/actions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Unknown crisis", crisisId: newId() },
    });
    expect(unknownCrisis.statusCode).toBe(400);
    expect(unknownCrisis.json().reason).toBe("crisis_not_found");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignCrisisId = "85858585-8585-4858-8858-858585858585";
    store.crisisCases.push({
      id: foreignCrisisId,
      tenantId: partnerTenant!.id,
      crisisCode: "CRS-9999",
      title: "Other tenant crisis",
      severity: "l2",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossCrisis = await app.inject({
      method: "POST",
      url: "/v1/crisis/actions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant crisis", crisisId: foreignCrisisId },
    });
    expect(crossCrisis.statusCode).toBe(400);
    expect(crossCrisis.json().reason).toBe("crisis_not_found");

    const foreignId = "86868686-8686-4868-8868-868686868686";
    store.crisisActions.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      actionCode: "ACT-9999",
      title: "Other tenant action",
      status: "open",
      crisisId: foreignCrisisId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/crisis/actions/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/crisis/actions/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const i18Before = await app.inject({
      method: "GET",
      url: "/v1/crisis/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i18Before.json().increment).toBe("I18");
    const casesBefore = i18Before.json().cases as number;
    const openBefore = i18Before.json().openCases as number;
    const timelineBefore = i18Before.json().timelineEntries as number;
    const seedCase = store.crisisCases.find((c) => c.id === CRISIS_SEED.sampleCaseId);
    expect(seedCase?.status).toBe("open");
    const seedTimeline = store.crisisTimelineEntries.filter((e) => e.crisisId === CRISIS_SEED.sampleCaseId).length;
    const k1CountBefore = store.crisisDecisions.length;
    const o6CountBefore = store.operationalIssues.length;

    const created = await app.inject({
      method: "POST",
      url: "/v1/crisis/actions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Secure the perimeter (Dev/Test)",
        ownerLabel: "Duty manager",
        notes: "Register row only — not SLA",
        crisisId: CRISIS_SEED.sampleCaseId,
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().action.actionCode).toBe("ACT-0001");
    expect(created.json().action.status).toBe("open");
    expect(created.json().action.crisisId).toBe(CRISIS_SEED.sampleCaseId);
    expect(created.json().action.crisisCode).toBe("CRS-0001");
    expect(created.json().action.ownerLabel).toBe("Duty manager");
    assertNoSecrets(created.json());
    expect(store.crisisCases.find((c) => c.id === CRISIS_SEED.sampleCaseId)?.status).toBe("open");
    const id = created.json().action.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/crisis/actions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record", crisisId: CRISIS_SEED.sampleCaseId },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/crisis/actions",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);

    const got = await app.inject({
      method: "GET",
      url: `/v1/crisis/actions/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().action.actionCode).toBe("ACT-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/crisis/actions/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Secure the perimeter — register only", crisisId: newId() },
    });
    expect(patched.json().action.title).toBe("Secure the perimeter — register only");
    expect(patched.json().action.crisisId).toBe(CRISIS_SEED.sampleCaseId);

    const completed = await app.inject({
      method: "POST",
      url: `/v1/crisis/actions/${id}/complete`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(completed.json().action.status).toBe("done");

    const completeAgain = await app.inject({
      method: "POST",
      url: `/v1/crisis/actions/${id}/complete`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(completeAgain.statusCode).toBe(409);
    expect(completeAgain.json().reason).toBe("invalid_transition");

    const cancelDone = await app.inject({
      method: "POST",
      url: `/v1/crisis/actions/${id}/cancel`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(cancelDone.statusCode).toBe(409);
    expect(cancelDone.json().reason).toBe("invalid_transition");

    const patchDone = await app.inject({
      method: "PATCH",
      url: `/v1/crisis/actions/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchDone.statusCode).toBe(409);
    expect(patchDone.json().reason).toBe("done");

    const toCancel = await app.inject({
      method: "POST",
      url: "/v1/crisis/actions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Stand down extras", crisisId: CRISIS_SEED.sampleCaseId },
    });
    expect(toCancel.statusCode).toBe(201);
    const cancelId = toCancel.json().action.id as string;
    const cancelled = await app.inject({
      method: "POST",
      url: `/v1/crisis/actions/${cancelId}/cancel`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(cancelled.json().action.status).toBe("cancelled");
    const patchCancelled = await app.inject({
      method: "PATCH",
      url: `/v1/crisis/actions/${cancelId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchCancelled.statusCode).toBe(409);
    expect(patchCancelled.json().reason).toBe("cancelled");
    const completeCancelled = await app.inject({
      method: "POST",
      url: `/v1/crisis/actions/${cancelId}/complete`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(completeCancelled.statusCode).toBe(409);
    expect(completeCancelled.json().reason).toBe("invalid_transition");

    const closedParent = await app.inject({
      method: "POST",
      url: "/v1/crisis/cases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Parent for closed-case deny", severity: "l2" },
    });
    expect(closedParent.statusCode).toBe(201);
    const closedParentId = closedParent.json().crisis.id as string;
    const bobClose = await app.inject({
      method: "POST",
      url: `/v1/crisis/cases/${closedParentId}/close`,
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(bobClose.json().crisis.status).toBe("closed");
    const createOnClosed = await app.inject({
      method: "POST",
      url: "/v1/crisis/actions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Must not record on closed", crisisId: closedParentId },
    });
    expect(createOnClosed.statusCode).toBe(409);
    expect(createOnClosed.json().reason).toBe("case_closed");

    expect(store.crisisCases.find((c) => c.id === CRISIS_SEED.sampleCaseId)?.status).toBe("open");
    expect(store.crisisTimelineEntries.filter((e) => e.crisisId === CRISIS_SEED.sampleCaseId).length).toBe(
      seedTimeline,
    );
    expect(store.crisisDecisions.length).toBe(k1CountBefore);
    expect(store.operationalIssues.length).toBe(o6CountBefore);
    const i18After = await app.inject({
      method: "GET",
      url: "/v1/crisis/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i18After.json().increment).toBe("I18");
    expect(i18After.json().cases).toBe(casesBefore + 1);
    expect(i18After.json().openCases).toBe(openBefore);
    expect(i18After.json().timelineEntries).toBe(timelineBefore);

    const k1After = await app.inject({
      method: "GET",
      url: "/v1/crisis/decisions/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(k1After.json().increment).toBe("K1");
    expect(k1After.json().decisions).toBe(k1CountBefore);

    const o6After = await app.inject({
      method: "GET",
      url: "/v1/ops/issues/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(o6After.json().increment).toBe("O6");

    expect("crisisActions" in store).toBe(true);
    expect("crisisActionTrackers" in store).toBe(false);
    expect("crisisExercises" in store).toBe(false);
    expect("sampleRecords" in store).toBe(false);
  });
});
