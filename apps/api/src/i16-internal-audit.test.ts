import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { AUDIT_IA_SEED } from "../src/audit-ia/collections.js";
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

describe("I16 Internal Audit", () => {
  it("lists I16 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("088_i16_internal_audit"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/audit-ia/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/audit-ia/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/audit-ia/engagements",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/audit-ia/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("I16");
    expect(health.json().engagements).toBe(1);
    expect(health.json().workpapers).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/audit-ia/engagements/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "audit.member")?.permissionKeys).toEqual([
      "auditia:read:engagement",
      "auditia:write:engagement",
      "auditia:read:workpaper",
      "auditia:write:workpaper",
    ]);
  });

  it("runs engagement and workpaper lifecycle with SoD", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/audit-ia/engagements",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Nope" },
        })
      ).statusCode,
    ).toBe(403);

    const created = await app.inject({
      method: "POST",
      url: "/v1/audit-ia/engagements",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Access control review", ownerLabel: "IA" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().engagement.engagementCode).toBe("ENG-0002");
    expect(created.json().engagement.status).toBe("planned");
    assertNoSecrets(created.json());
    const engagementId = created.json().engagement.id as string;

    const started = await app.inject({
      method: "POST",
      url: `/v1/audit-ia/engagements/${engagementId}/start`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(started.json().engagement.status).toBe("in_progress");

    const paper = await app.inject({
      method: "POST",
      url: `/v1/audit-ia/engagements/${engagementId}/workpapers`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Sample testing sheet", body: "Notes only" },
    });
    expect(paper.statusCode).toBe(201);
    expect(paper.json().workpaper.workpaperCode).toBe("WP-0002");
    expect(paper.json().workpaper.status).toBe("draft");
    const paperId = paper.json().workpaper.id as string;

    const closeBlocked = await app.inject({
      method: "POST",
      url: `/v1/audit-ia/engagements/${engagementId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closeBlocked.statusCode).toBe(409);
    expect(closeBlocked.json().reason).toBe("open_workpapers");

    const selfFinalize = await app.inject({
      method: "POST",
      url: `/v1/audit-ia/workpapers/${paperId}/finalize`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(selfFinalize.statusCode).toBe(403);
    expect(selfFinalize.json().reason).toBe("sod");

    const bobFinalize = await app.inject({
      method: "POST",
      url: `/v1/audit-ia/workpapers/${paperId}/finalize`,
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(bobFinalize.statusCode).toBe(200);
    expect(bobFinalize.json().workpaper.status).toBe("finalized");

    const patchFinalized = await app.inject({
      method: "PATCH",
      url: `/v1/audit-ia/workpapers/${paperId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchFinalized.statusCode).toBe(409);

    const closed = await app.inject({
      method: "POST",
      url: `/v1/audit-ia/engagements/${engagementId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closed.json().engagement.status).toBe("closed");

    const addAfterClose = await app.inject({
      method: "POST",
      url: `/v1/audit-ia/engagements/${engagementId}/workpapers`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Too late" },
    });
    expect(addAfterClose.statusCode).toBe(409);

    const seedCloseBlocked = await app.inject({
      method: "POST",
      url: `/v1/audit-ia/engagements/${AUDIT_IA_SEED.sampleEngagementId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(seedCloseBlocked.statusCode).toBe(409);

    expect("iaOpinions" in store).toBe(false);
  });
});
