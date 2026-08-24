import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { CAMPAIGN_SEED } from "../src/control-tests/collections.js";
import { FINDINGS_SEED } from "../src/findings/collections.js";
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

describe("G4 control-test campaign register", () => {
  it("lists G4 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("095_g4_control_test_campaigns"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/control-tests/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/control-tests/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/control-tests",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/control-tests/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("G4");
    expect(health.json().campaigns).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/control-tests/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(store.roles.find((r) => r.key === "grc.campaign")?.permissionKeys).toEqual([
      "grc:read:campaign",
      "grc:write:campaign",
    ]);
    expect(store.roles.find((r) => r.key === "grc.finding")?.permissionKeys).toEqual([
      "grc:read:finding",
      "grc:write:finding",
    ]);
    expect(store.roles.find((r) => r.key === "grc.control")?.permissionKeys).toEqual([
      "grc:read:control",
      "grc:write:control",
    ]);
  });

  it("runs campaign lifecycle with human-only mutate, G2 reference, and no deferred GRC products", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/control-tests",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not register" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/control-tests",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const missingControl = await app.inject({
      method: "POST",
      url: "/v1/control-tests",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Unknown control", controlId: newId() },
    });
    expect(missingControl.statusCode).toBe(400);
    expect(missingControl.json().reason).toBe("control_not_found");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
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
    const crossControl = await app.inject({
      method: "POST",
      url: "/v1/control-tests",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Cross tenant control", controlId: foreignControlId },
    });
    expect(crossControl.statusCode).toBe(400);
    expect(crossControl.json().reason).toBe("control_not_found");

    const foreignId = "87878787-8787-4878-8878-878787878787";
    store.controlTestCampaigns.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      campaignCode: "CTC-9999",
      title: "Other tenant campaign",
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/control-tests/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/control-tests/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const seedControl = store.grcControls.find((c) => c.id === GRC_SEED.sampleControlId);
    expect(seedControl?.status).toBe("draft");
    const seedFinding = store.findingRecords.find((f) => f.id === FINDINGS_SEED.sampleFindingId);
    expect(seedFinding?.status).toBe("open");

    const created = await app.inject({
      method: "POST",
      url: "/v1/control-tests",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Q3 access review campaign (Dev/Test)",
        description: "Register row only — not a mapping engine",
        ownerLabel: "GRC lead",
        controlId: GRC_SEED.sampleControlId,
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().campaign.campaignCode).toBe("CTC-0002");
    expect(created.json().campaign.status).toBe("planned");
    expect(created.json().campaign.controlId).toBe(GRC_SEED.sampleControlId);
    expect(created.json().campaign.controlCode).toBe("CTL-0001");
    assertNoSecrets(created.json());
    expect(store.grcControls.find((c) => c.id === GRC_SEED.sampleControlId)?.status).toBe("draft");
    expect(store.findingRecords.find((f) => f.id === FINDINGS_SEED.sampleFindingId)?.status).toBe("open");
    const id = created.json().campaign.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/control-tests",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not register" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/control-tests/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Q3 access review campaign — register only" },
    });
    expect(patched.json().campaign.title).toBe("Q3 access review campaign — register only");

    const started = await app.inject({
      method: "POST",
      url: `/v1/control-tests/${id}/start`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(started.json().campaign.status).toBe("in_progress");

    const startAgain = await app.inject({
      method: "POST",
      url: `/v1/control-tests/${id}/start`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(startAgain.statusCode).toBe(409);

    const closed = await app.inject({
      method: "POST",
      url: `/v1/control-tests/${id}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closed.json().campaign.status).toBe("closed");

    const patchClosed = await app.inject({
      method: "PATCH",
      url: `/v1/control-tests/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchClosed.statusCode).toBe(409);
    expect(patchClosed.json().reason).toBe("closed");

    const closeSeed = await app.inject({
      method: "POST",
      url: `/v1/control-tests/${CAMPAIGN_SEED.sampleCampaignId}/close`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(closeSeed.json().campaign.status).toBe("closed");

    expect("grcTests" in store).toBe(false);
    expect("grcMappings" in store).toBe(false);
  });
});
