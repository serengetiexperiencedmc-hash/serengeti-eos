import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { COMPLIANCE_SEED } from "../src/compliance/collections.js";
import { GRC_SEED } from "../src/grc/collections.js";
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

describe("G2 GRC control catalogue", () => {
  it("lists G2 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("093_g2_grc_control_catalogue"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/grc/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/grc/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/grc/controls",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/grc/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("G2");
    expect(health.json().controls).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/grc/controls/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "grc.control")?.permissionKeys).toEqual([
      "grc:read:control",
      "grc:write:control",
    ]);
    expect(store.roles.find((r) => r.key === "compliance.member")?.permissionKeys).toEqual([
      "compliance:read:obligation",
      "compliance:write:obligation",
    ]);
  });

  it("runs control lifecycle with human-only mutate, G1 reference, and no deferred GRC products", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/grc/controls",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not register" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/grc/controls",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const missingObligation = await app.inject({
      method: "POST",
      url: "/v1/grc/controls",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Unknown obligation", obligationId: newId() },
    });
    expect(missingObligation.statusCode).toBe(400);
    expect(missingObligation.json().reason).toBe("obligation_not_found");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignObligationId = "81818181-8181-4818-8818-818181818181";
    store.complianceObligations.push({
      id: foreignObligationId,
      tenantId: partnerTenant!.id,
      obligationCode: "OBL-9999",
      title: "Other tenant obligation",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossObligation = await app.inject({
      method: "POST",
      url: "/v1/grc/controls",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant obligation", obligationId: foreignObligationId },
    });
    expect(crossObligation.statusCode).toBe(400);
    expect(crossObligation.json().reason).toBe("obligation_not_found");

    const foreignId = "84848484-8484-4848-8848-848484848484";
    store.grcControls.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      controlCode: "CTL-9999",
      title: "Other tenant control",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/grc/controls/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    const bobHealth = await app.inject({
      method: "GET",
      url: "/v1/grc/health",
      headers: { authorization: `Bearer ${bobToken}` },
    });
    expect(bobHealth.statusCode).toBe(200);

    const seedObligation = store.complianceObligations.find((o) => o.id === COMPLIANCE_SEED.sampleObligationId);
    expect(seedObligation?.status).toBe("open");

    const created = await app.inject({
      method: "POST",
      url: "/v1/grc/controls",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Guest PII access review (Dev/Test)",
        description: "Catalogue row only — not a test campaign",
        ownerLabel: "GRC lead",
        obligationId: COMPLIANCE_SEED.sampleObligationId,
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().control.controlCode).toBe("CTL-0002");
    expect(created.json().control.status).toBe("draft");
    expect(created.json().control.obligationId).toBe(COMPLIANCE_SEED.sampleObligationId);
    expect(created.json().control.obligationCode).toBe("OBL-0001");
    assertNoSecrets(created.json());
    expect(store.complianceObligations.find((o) => o.id === COMPLIANCE_SEED.sampleObligationId)?.status).toBe(
      "open",
    );
    const id = created.json().control.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/grc/controls",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not register" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/grc/controls/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Guest PII access review — catalogue only" },
    });
    expect(patched.json().control.title).toBe("Guest PII access review — catalogue only");

    const retireDraft = await app.inject({
      method: "POST",
      url: `/v1/grc/controls/${id}/retire`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(retireDraft.statusCode).toBe(409);
    expect(retireDraft.json().reason).toBe("invalid_transition");

    const activated = await app.inject({
      method: "POST",
      url: `/v1/grc/controls/${id}/activate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(activated.json().control.status).toBe("active");

    const activateAgain = await app.inject({
      method: "POST",
      url: `/v1/grc/controls/${id}/activate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(activateAgain.statusCode).toBe(409);

    const retired = await app.inject({
      method: "POST",
      url: `/v1/grc/controls/${id}/retire`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(retired.json().control.status).toBe("retired");

    const patchRetired = await app.inject({
      method: "PATCH",
      url: `/v1/grc/controls/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchRetired.statusCode).toBe(409);
    expect(patchRetired.json().reason).toBe("retired");

    const activateSeed = await app.inject({
      method: "POST",
      url: `/v1/grc/controls/${GRC_SEED.sampleControlId}/activate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(activateSeed.json().control.status).toBe("active");

    expect("complianceControls" in store).toBe(false);
    expect("complianceFindings" in store).toBe(false);
    expect("grcFindings" in store).toBe(false);
    expect("grcTests" in store).toBe(false);
    expect("grcMappings" in store).toBe(false);
  });
});
