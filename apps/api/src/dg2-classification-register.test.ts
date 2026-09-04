import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
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

describe("DG2 Classification Register", () => {
  it("does not create a DG2 SQL migration and does not reuse PQL or CD 119–122 filenames", () => {
    const files = listMigrationFiles();
    expect(files.some((f) => f.includes("123_dg2_classification_records"))).toBe(false);
    expect(files.some((f) => f.includes("111_dg1_dataset_records"))).toBe(true);
  });

  it("enforces auth and tenant isolation without reusing closed-register or I0 permissions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/classifications/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/classifications/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/classifications",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/classifications/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("DG2");
    expect(health.json().module).toBe("classification-register");
    expect(health.json().classifications).toBe(0);
    expect(health.json().openClassifications).toBe(0);
    assertNoSecrets(health.json());

    const dg1Health = await app.inject({
      method: "GET",
      url: "/v1/datasets/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(dg1Health.statusCode).toBe(200);
    expect(dg1Health.json().increment).toBe("DG1");
    expect(dg1Health.json().module).toBe("dataset-register");

    const missing = await app.inject({
      method: "GET",
      url: `/v1/classifications/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);

    expect(store.roles.find((r) => r.key === "classification.register")?.permissionKeys).toEqual([
      "classification:read:register",
      "classification:write:register",
    ]);
    for (const key of [
      "dataset.register",
      "dpo",
      "privacy.dpia",
      "consent.register",
      "it.endpoint",
      "erm.kri",
      "erm.treatment",
    ]) {
      expect(store.roles.find((r) => r.key === key)?.permissionKeys).not.toContain(
        "classification:read:register",
      );
      expect(store.roles.find((r) => r.key === key)?.permissionKeys).not.toContain(
        "classification:write:register",
      );
    }
    expect("classificationRecords" in store).toBe(true);
    expect("datasetRecords" in store).toBe(true);
  });

  it("runs classification-register lifecycle with human-only mutate and no DG1/I0/lineage leakage", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const bobToken = await login(app, "bob.approver@sedmc.local", P.bobPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/classifications",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Alice must not record" },
        })
      ).statusCode,
    ).toBe(403);

    const missingTitle = await app.inject({
      method: "POST",
      url: "/v1/classifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "   " },
    });
    expect(missingTitle.statusCode).toBe(400);
    expect(missingTitle.json().reason).toBe("title_required");

    const tooLong = await app.inject({
      method: "POST",
      url: "/v1/classifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "A".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().reason).toBe("title_too_long");

    const notesTooLong = await app.inject({
      method: "POST",
      url: "/v1/classifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Notes check", notes: "N".repeat(2001) },
    });
    expect(notesTooLong.statusCode).toBe(400);
    expect(notesTooLong.json().reason).toBe("notes_too_long");

    const partnerTenant = [...store.tenants.values()].find((t) => t.slug === "partner-demo");
    expect(partnerTenant).toBeDefined();
    const foreignId = "97979797-9797-4979-8979-979797979788";
    store.classificationRecords.push({
      id: foreignId,
      tenantId: partnerTenant!.id,
      classificationCode: "CLS-9999",
      title: "Other tenant classification row",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      updatedByPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/classifications/${foreignId}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(crossTenant.statusCode).toBe(404);

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/classifications/health",
          headers: { authorization: `Bearer ${bobToken}` },
        })
      ).statusCode,
    ).toBe(200);

    const datasetsSnapshot = JSON.stringify(store.datasetRecords);
    const activitiesSnapshot = JSON.stringify(store.privacyProcessingActivities);
    const dsrsSnapshot = JSON.stringify(store.privacyDsrCases);
    const dpiasSnapshot = JSON.stringify(store.privacyDpias);
    const consentsSnapshot = JSON.stringify(store.consentRecords);

    const created = await app.inject({
      method: "POST",
      url: "/v1/classifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Catalogue row exists",
        notes: "Register row only — not a classification engine",
        status: "cancelled",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().classification.classificationCode).toBe("CLS-0001");
    expect(created.json().classification.status).toBe("open");
    expect(created.json().classification.title).toBe("Catalogue row exists");
    expect(created.json().classification.notes).toBe("Register row only — not a classification engine");
    expect(created.json().classification.datasetId).toBeUndefined();
    expect(created.json().classification.clearance).toBeUndefined();
    expect(created.json().classification.classificationLevel).toBeUndefined();
    expect(created.json().classification.lineage).toBeUndefined();
    expect(created.json().classification.qualityScore).toBeUndefined();
    expect(created.json().classification.qualityRule).toBeUndefined();
    expect(created.json().classification.qualityRuleId).toBeUndefined();
    assertNoSecrets(created.json());
    const id = created.json().classification.id as string;

    const second = await app.inject({
      method: "POST",
      url: "/v1/classifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Second catalogue row" },
    });
    expect(second.statusCode).toBe(201);
    expect(second.json().classification.classificationCode).toBe("CLS-0002");
    expect(second.json().classification.notes).toBeUndefined();
    const secondId = second.json().classification.id as string;

    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local");
    expect(carol).toBeDefined();
    const previousActor = carol!.actorType;
    carol!.actorType = "AiAgent";
    const aiCreate = await app.inject({
      method: "POST",
      url: "/v1/classifications",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "AI must not record" },
    });
    expect(aiCreate.statusCode).toBe(403);
    expect(aiCreate.json().reason).toBe("ai_actor");
    const aiPatch = await app.inject({
      method: "PATCH",
      url: `/v1/classifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(aiPatch.statusCode).toBe(403);
    expect(aiPatch.json().reason).toBe("ai_actor");
    carol!.actorType = previousActor;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/classifications",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().items.some((row: { id: string }) => row.id === id)).toBe(true);
    expect(listed.json().items.some((row: { id: string }) => row.id === foreignId)).toBe(false);

    const byCode = await app.inject({
      method: "GET",
      url: "/v1/classifications?q=CLS-0001",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(byCode.json().items).toHaveLength(1);
    expect(byCode.json().items[0].classificationCode).toBe("CLS-0001");

    const byTitle = await app.inject({
      method: "GET",
      url: "/v1/classifications?q=Second%20catalogue",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(byTitle.json().items).toHaveLength(1);
    expect(byTitle.json().items[0].id).toBe(secondId);

    const got = await app.inject({
      method: "GET",
      url: `/v1/classifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(got.statusCode).toBe(200);
    expect(got.json().classification.classificationCode).toBe("CLS-0001");
    assertNoSecrets(got.json());

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/classifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Catalogue row exists — register only" },
    });
    expect(patched.json().classification.title).toBe("Catalogue row exists — register only");

    const illegalStatus = await app.inject({
      method: "PATCH",
      url: `/v1/classifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "classified" },
    });
    expect(illegalStatus.statusCode).toBe(409);
    expect(illegalStatus.json().reason).toBe("invalid_transition");

    const i0Status = await app.inject({
      method: "PATCH",
      url: `/v1/classifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "Restricted" },
    });
    expect(i0Status.statusCode).toBe(409);

    const done = await app.inject({
      method: "PATCH",
      url: `/v1/classifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "done" },
    });
    expect(done.json().classification.status).toBe("done");

    const patchDone = await app.inject({
      method: "PATCH",
      url: `/v1/classifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchDone.statusCode).toBe(409);
    expect(patchDone.json().reason).toBe("done");

    const reopen = await app.inject({
      method: "PATCH",
      url: `/v1/classifications/${id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "open" },
    });
    expect(reopen.statusCode).toBe(409);
    expect(reopen.json().reason).toBe("done");

    const cancelled = await app.inject({
      method: "PATCH",
      url: `/v1/classifications/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { status: "cancelled" },
    });
    expect(cancelled.json().classification.status).toBe("cancelled");

    const patchCancelled = await app.inject({
      method: "PATCH",
      url: `/v1/classifications/${secondId}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { notes: "Nope" },
    });
    expect(patchCancelled.statusCode).toBe(409);
    expect(patchCancelled.json().reason).toBe("cancelled");

    for (const path of [
      "classify",
      "lineage",
      "quality",
      "scan",
      "erase",
      "lakehouse",
    ]) {
      expect(
        (
          await app.inject({
            method: "POST",
            url: `/v1/classifications/${id}/${path}`,
            headers: { authorization: `Bearer ${carolToken}` },
          })
        ).statusCode,
      ).toBe(404);
    }

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/dg/health",
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/lineage",
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/quality-rules",
          headers: { authorization: `Bearer ${carolToken}` },
        })
      ).statusCode,
    ).toBe(404);

    expect(JSON.stringify(store.datasetRecords)).toBe(datasetsSnapshot);
    expect(JSON.stringify(store.privacyProcessingActivities)).toBe(activitiesSnapshot);
    expect(JSON.stringify(store.privacyDsrCases)).toBe(dsrsSnapshot);
    expect(JSON.stringify(store.privacyDpias)).toBe(dpiasSnapshot);
    expect(JSON.stringify(store.consentRecords)).toBe(consentsSnapshot);

    const dg1After = await app.inject({
      method: "GET",
      url: "/v1/datasets/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(dg1After.json().increment).toBe("DG1");
    expect(dg1After.json().module).toBe("dataset-register");

    const datasetCreate = await app.inject({
      method: "POST",
      url: "/v1/datasets",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "DG1 still independent" },
    });
    expect(datasetCreate.statusCode).toBe(201);
    expect(datasetCreate.json().dataset.datasetCode).toBe("DST-0001");
    expect(store.classificationRecords.some((row) => row.id === datasetCreate.json().dataset.id)).toBe(
      false,
    );

    expect("classificationRecords" in store).toBe(true);
    expect("datasetRecords" in store).toBe(true);
  });
});
