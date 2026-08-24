import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { COMPLIANCE_SEED } from "../src/compliance/collections.js";
import { CAMPAIGN_SEED } from "../src/control-tests/collections.js";
import { FINDINGS_SEED } from "../src/findings/collections.js";
import { GRC_SEED } from "../src/grc/collections.js";
import { MAPPING_SEED } from "../src/mappings/collections.js";
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

describe("G5 regulation-to-control mapping register", () => {
  it("lists G5 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("096_g5_regulation_control_mapping"))).toBe(
      true,
    );
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/mappings/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/mappings/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/mappings",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/mappings/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("G5");
    expect(health.json().mappings).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/mappings/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "grc.mapping")?.permissionKeys).toEqual([
      "grc:read:mapping",
      "grc:write:mapping",
    ]);
    expect(store.roles.find((r) => r.key === "grc.campaign")?.permissionKeys).toEqual([
      "grc:read:campaign",
      "grc:write:campaign",
    ]);
    expect(store.roles.find((r) => r.key === "grc.finding")?.permissionKeys).toEqual([
      "grc:read:finding",
      "grc:write:finding",
    ]);
  });

  it("runs mapping lifecycle with human-only mutate, G1/G2 references, and no deferred GRC products", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/mappings",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not register" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/mappings",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const missingObligation = await app.inject({
      method: "POST",
      url: "/v1/mappings",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Unknown obligation", obligationId: newId() },
    });
    expect(missingObligation.statusCode).toBe(400);
    expect(missingObligation.json().reason).toBe("obligation_not_found");

    const missingControl = await app.inject({
      method: "POST",
      url: "/v1/mappings",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Unknown control", controlId: newId() },
    });
    expect(missingControl.statusCode).toBe(400);
    expect(missingControl.json().reason).toBe("control_not_found");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignObligationId = "84848484-8484-4848-8848-848484848484";
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
    const foreignControlId = "85858585-8585-4858-8858-858585858585";
    store.grcControls.push({
      id: foreignControlId,
      tenantId: partnerTenant!.id,
      controlCode: "CTL-9999",
      title: "Other tenant control",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossObligation = await app.inject({
      method: "POST",
      url: "/v1/mappings",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant obligation", obligationId: foreignObligationId },
    });
    expect(crossObligation.statusCode).toBe(400);
    expect(crossObligation.json().reason).toBe("obligation_not_found");
    const crossControl = await app.inject({
      method: "POST",
      url: "/v1/mappings",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant control", controlId: foreignControlId },
    });
    expect(crossControl.statusCode).toBe(400);
    expect(crossControl.json().reason).toBe("control_not_found");

    const foreignId = "88888888-8888-4888-8888-888888888888";
    store.mappingRecords.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      mappingCode: "MAP-9999",
      title: "Other tenant mapping",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/mappings/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/mappings/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    expect(store.complianceObligations.find((o) => o.id === COMPLIANCE_SEED.sampleObligationId)?.status).toBe(
      "open",
    );
    expect(store.grcControls.find((c) => c.id === GRC_SEED.sampleControlId)?.status).toBe("draft");
    expect(store.findingRecords.find((f) => f.id === FINDINGS_SEED.sampleFindingId)?.status).toBe("open");
    expect(store.controlTestCampaigns.find((c) => c.id === CAMPAIGN_SEED.sampleCampaignId)?.status).toBe(
      "planned",
    );

    const created = await app.inject({
      method: "POST",
      url: "/v1/mappings",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Access review mapping (Dev/Test)",
        description: "Register row only — not a live feed",
        ownerLabel: "GRC lead",
        obligationId: COMPLIANCE_SEED.sampleObligationId,
        controlId: GRC_SEED.sampleControlId,
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().mapping.mappingCode).toBe("MAP-0002");
    expect(created.json().mapping.status).toBe("draft");
    expect(created.json().mapping.obligationId).toBe(COMPLIANCE_SEED.sampleObligationId);
    expect(created.json().mapping.obligationCode).toBe("OBL-0001");
    expect(created.json().mapping.controlId).toBe(GRC_SEED.sampleControlId);
    expect(created.json().mapping.controlCode).toBe("CTL-0001");
    assertNoSecrets(created.json());
    expect(store.complianceObligations.find((o) => o.id === COMPLIANCE_SEED.sampleObligationId)?.status).toBe(
      "open",
    );
    expect(store.grcControls.find((c) => c.id === GRC_SEED.sampleControlId)?.status).toBe("draft");
    expect(store.findingRecords.find((f) => f.id === FINDINGS_SEED.sampleFindingId)?.status).toBe("open");
    expect(store.controlTestCampaigns.find((c) => c.id === CAMPAIGN_SEED.sampleCampaignId)?.status).toBe(
      "planned",
    );
    const id = created.json().mapping.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/mappings",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not register" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/mappings/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Access review mapping — register only" },
    });
    expect(patched.json().mapping.title).toBe("Access review mapping — register only");

    const activated = await app.inject({
      method: "POST",
      url: `/v1/mappings/${id}/activate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(activated.json().mapping.status).toBe("active");

    const activateAgain = await app.inject({
      method: "POST",
      url: `/v1/mappings/${id}/activate`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(activateAgain.statusCode).toBe(409);

    const retired = await app.inject({
      method: "POST",
      url: `/v1/mappings/${id}/retire`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(retired.json().mapping.status).toBe("retired");

    const patchRetired = await app.inject({
      method: "PATCH",
      url: `/v1/mappings/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchRetired.statusCode).toBe(409);
    expect(patchRetired.json().reason).toBe("retired");

    const retireSeed = await app.inject({
      method: "POST",
      url: `/v1/mappings/${MAPPING_SEED.sampleMappingId}/retire`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(retireSeed.statusCode).toBe(409);

    expect("grcMappings" in store).toBe(false);
    expect("grcTests" in store).toBe(false);
  });
});
