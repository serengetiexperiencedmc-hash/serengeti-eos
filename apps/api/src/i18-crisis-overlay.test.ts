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

describe("I18 crisis overlay", () => {
  it("lists I18 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("090_i18_crisis_overlay"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/crisis/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/crisis/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/crisis/cases",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/crisis/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("I18");
    expect(health.json().cases).toBe(1);
    expect(health.json().timelineEntries).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/crisis/cases/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "crisis.commander")?.permissionKeys).toEqual([
      "crisis:read:case",
      "crisis:write:case",
      "crisis:read:timeline",
      "crisis:write:timeline",
    ]);
  });

  it("runs declare / timeline / SoD close / human-only lifecycle", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/crisis/cases",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not declare", severity: "l2" },
        })
      ).statusCode,
    ).toBe(403);

    const invalidSeverity = await app.inject({
      method: "POST",
      url: "/v1/crisis/cases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "L1 is I11", severity: "l1" },
    });
    expect(invalidSeverity.statusCode).toBe(400);
    expect(invalidSeverity.json().reason).toBe("invalid_severity");

    const created = await app.inject({
      method: "POST",
      url: "/v1/crisis/cases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Multi-programme disruption (Dev/Test)",
        severity: "l2",
        commanderLabel: "Head of Ops (Dev/Test)",
        summary: "Command overlay only — not a ticket fork.",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().crisis.crisisCode).toBe("CRS-0002");
    expect(created.json().crisis.status).toBe("open");
    expect(created.json().crisis.severity).toBe("l2");
    assertNoSecrets(created.json());
    const caseId = created.json().crisis.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiDeclare = await app.inject({
      method: "POST",
      url: "/v1/crisis/cases",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not declare", severity: "l3" },
    });
    expect(aiDeclare.statusCode).toBe(403);
    expect(aiDeclare.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const note = await app.inject({
      method: "POST",
      url: `/v1/crisis/cases/${caseId}/timeline`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { body: "Facts confirmed by duty manager — unconfirmed reports stay labelled." },
    });
    expect(note.statusCode).toBe(201);
    expect(note.json().entry.entryCode).toBe("TLN-0002");
    expect(note.json().entry.crisisId).toBe(caseId);
    expect(note.json().entry.crisisCode).toBe("CRS-0002");
    assertNoSecrets(note.json());

    const selfClose = await app.inject({
      method: "POST",
      url: `/v1/crisis/cases/${caseId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(selfClose.statusCode).toBe(403);
    expect(selfClose.json().reason).toBe("sod");

    const bobClose = await app.inject({
      method: "POST",
      url: `/v1/crisis/cases/${caseId}/close`,
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(bobClose.statusCode).toBe(200);
    expect(bobClose.json().crisis.status).toBe("closed");

    const appendClosed = await app.inject({
      method: "POST",
      url: `/v1/crisis/cases/${caseId}/timeline`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { body: "Must not append after close" },
    });
    expect(appendClosed.statusCode).toBe(409);
    expect(appendClosed.json().reason).toBe("case_closed");

    const closeAgain = await app.inject({
      method: "POST",
      url: `/v1/crisis/cases/${CRISIS_SEED.sampleCaseId}/close`,
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(closeAgain.json().crisis.status).toBe("closed");
    const alreadyClosed = await app.inject({
      method: "POST",
      url: `/v1/crisis/cases/${CRISIS_SEED.sampleCaseId}/close`,
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(alreadyClosed.statusCode).toBe(409);
    expect(alreadyClosed.json().reason).toBe("already_closed");

    expect("crisisDecisionLogs" in store).toBe(false);
    expect("crisisExercises" in store).toBe(false);
  });
});
