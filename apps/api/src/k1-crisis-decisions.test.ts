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

describe("K1 crisis decision log", () => {
  it("lists K1 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("098_k1_crisis_decisions"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/crisis/decisions/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/crisis/decisions/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/crisis/decisions",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/crisis/decisions/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("K1");
    expect(health.json().decisions).toBe(0);
    assertNoSecrets(health.json());

    const i18Health = await app.inject({
      method: "GET",
      url: "/v1/crisis/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i18Health.statusCode).toBe(200);
    expect(i18Health.json().increment).toBe("I18");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/crisis/decisions/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "crisis.decision")?.permissionKeys).toEqual([
      "crisis:read:decision",
      "crisis:write:decision",
    ]);
    expect(store.roles.find((r) => r.key === "crisis.commander")?.permissionKeys).toEqual([
      "crisis:read:case",
      "crisis:write:case",
      "crisis:read:timeline",
      "crisis:write:timeline",
    ]);
    expect(store.roles.find((r) => r.key === "ops.issue")?.permissionKeys).not.toContain("crisis:read:decision");
    expect(store.roles.find((r) => r.key === "grc.mapping")?.permissionKeys).not.toContain(
      "crisis:write:decision",
    );
  });

  it("runs decision lifecycle with human-only mutate, crisis reference, and no I18 mutation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/crisis/decisions",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record", crisisId: CRISIS_SEED.sampleCaseId },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/crisis/decisions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   ", crisisId: CRISIS_SEED.sampleCaseId },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const missingCrisis = await app.inject({
      method: "POST",
      url: "/v1/crisis/decisions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "No crisis" },
    });
    expect(missingCrisis.statusCode).toBe(400);
    expect(missingCrisis.json().reason).toBe("crisis_not_found");

    const unknownCrisis = await app.inject({
      method: "POST",
      url: "/v1/crisis/decisions",
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
      url: "/v1/crisis/decisions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant crisis", crisisId: foreignCrisisId },
    });
    expect(crossCrisis.statusCode).toBe(400);
    expect(crossCrisis.json().reason).toBe("crisis_not_found");

    const foreignId = "86868686-8686-4868-8868-868686868686";
    store.crisisDecisions.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      decisionCode: "DEC-9999",
      title: "Other tenant decision",
      status: "recorded",
      crisisId: foreignCrisisId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/crisis/decisions/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/crisis/decisions/health",
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

    const created = await app.inject({
      method: "POST",
      url: "/v1/crisis/decisions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Isolate the venue (Dev/Test)",
        options: "Hold on site · Relocate",
        chosenAction: "Hold on site",
        rationale: "Register row only — not emcomms",
        authorityLabel: "Duty manager",
        crisisId: CRISIS_SEED.sampleCaseId,
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().decision.decisionCode).toBe("DEC-0001");
    expect(created.json().decision.status).toBe("recorded");
    expect(created.json().decision.crisisId).toBe(CRISIS_SEED.sampleCaseId);
    expect(created.json().decision.crisisCode).toBe("CRS-0001");
    assertNoSecrets(created.json());
    expect(store.crisisCases.find((c) => c.id === CRISIS_SEED.sampleCaseId)?.status).toBe("open");
    const id = created.json().decision.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/crisis/decisions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record", crisisId: CRISIS_SEED.sampleCaseId },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/crisis/decisions",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);

    const got = await app.inject({
      method: "GET",
      url: `/v1/crisis/decisions/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().decision.decisionCode).toBe("DEC-0001");

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/crisis/decisions/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Isolate the venue — register only" },
    });
    expect(patched.json().decision.title).toBe("Isolate the venue — register only");

    const superseded = await app.inject({
      method: "POST",
      url: `/v1/crisis/decisions/${id}/supersede`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(superseded.json().decision.status).toBe("superseded");

    const supersedeAgain = await app.inject({
      method: "POST",
      url: `/v1/crisis/decisions/${id}/supersede`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(supersedeAgain.statusCode).toBe(409);
    expect(supersedeAgain.json().reason).toBe("invalid_transition");

    const patchSuperseded = await app.inject({
      method: "PATCH",
      url: `/v1/crisis/decisions/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchSuperseded.statusCode).toBe(409);
    expect(patchSuperseded.json().reason).toBe("superseded");

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
      url: "/v1/crisis/decisions",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Must not record on closed", crisisId: closedParentId },
    });
    expect(createOnClosed.statusCode).toBe(409);
    expect(createOnClosed.json().reason).toBe("case_closed");

    expect(store.crisisCases.find((c) => c.id === CRISIS_SEED.sampleCaseId)?.status).toBe("open");
    expect(store.crisisTimelineEntries.filter((e) => e.crisisId === CRISIS_SEED.sampleCaseId).length).toBe(
      seedTimeline,
    );
    const i18After = await app.inject({
      method: "GET",
      url: "/v1/crisis/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(i18After.json().increment).toBe("I18");
    expect(i18After.json().cases).toBe(casesBefore + 1);
    expect(i18After.json().openCases).toBe(openBefore);
    expect(i18After.json().timelineEntries).toBe(timelineBefore);

    expect("crisisDecisions" in store).toBe(true);
    expect("crisisDecisionLogs" in store).toBe(false);
    expect("crisisExercises" in store).toBe(false);
    expect("sampleRecords" in store).toBe(false);
  });
});
