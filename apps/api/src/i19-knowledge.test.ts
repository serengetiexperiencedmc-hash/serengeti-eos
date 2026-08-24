import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { KNOWLEDGE_SEED } from "../src/knowledge/collections.js";
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

describe("I19 Knowledge Search", () => {
  it("lists I19 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("087_i19_knowledge"))).toBe(true);
  });

  it("enforces auth and tenant isolation", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");
    const partnerToken = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");

    expect((await app.inject({ method: "GET", url: "/v1/knowledge/health" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/knowledge/health",
          headers: { authorization: `Bearer ${aliceToken}` },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/knowledge/documents",
          headers: { authorization: `Bearer ${partnerToken}` },
        })
      ).statusCode,
    ).toBe(403);

    const health = await app.inject({
      method: "GET",
      url: "/v1/knowledge/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.statusCode).toBe(200);
    expect(health.json().increment).toBe("I19");
    expect(health.json().documents).toBe(1);
    assertNoSecrets(health.json());

    const missing = await app.inject({
      method: "GET",
      url: `/v1/knowledge/documents/${newId()}`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(missing.statusCode).toBe(404);
  });

  it("runs document lifecycle and tenant-scoped title/body search", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword, "sedmc");
    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword, "sedmc");

    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/knowledge/documents",
          headers: { authorization: `Bearer ${aliceToken}` },
          payload: { title: "Nope", documentType: "note" },
        })
      ).statusCode,
    ).toBe(403);

    const created = await app.inject({
      method: "POST",
      url: "/v1/knowledge/documents",
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {
        title: "Safari check-in SOP",
        documentType: "sop",
        body: "Unique phrase zebra-gate for body search.",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().document.docCode).toBe("DOC-0002");
    expect(created.json().document.authorityState).toBe("draft");
    assertNoSecrets(created.json());

    const hit = await app.inject({
      method: "GET",
      url: "/v1/knowledge/documents?q=zebra-gate",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(hit.json().items).toHaveLength(1);
    expect(hit.json().items[0].id).toBe(created.json().document.id);

    const miss = await app.inject({
      method: "GET",
      url: "/v1/knowledge/documents?q=not-in-any-document",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(miss.json().items).toHaveLength(0);

    const patched = await app.inject({
      method: "PATCH",
      url: `/v1/knowledge/documents/${created.json().document.id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Safari check-in SOP v2" },
    });
    expect(patched.json().document.title).toBe("Safari check-in SOP v2");

    const published = await app.inject({
      method: "POST",
      url: `/v1/knowledge/documents/${created.json().document.id}/publish`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(published.json().document.authorityState).toBe("authoritative");

    const patchPublished = await app.inject({
      method: "PATCH",
      url: `/v1/knowledge/documents/${created.json().document.id}`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { title: "Nope" },
    });
    expect(patchPublished.statusCode).toBe(409);

    const publishAgain = await app.inject({
      method: "POST",
      url: `/v1/knowledge/documents/${created.json().document.id}/publish`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(publishAgain.statusCode).toBe(409);

    const retired = await app.inject({
      method: "POST",
      url: `/v1/knowledge/documents/${created.json().document.id}/retire`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(retired.json().document.authorityState).toBe("retired");

    const retireSeed = await app.inject({
      method: "POST",
      url: `/v1/knowledge/documents/${KNOWLEDGE_SEED.sampleDocId}/retire`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(retireSeed.json().document.authorityState).toBe("retired");

    expect("knowledgeGraphNodes" in store).toBe(false);
    expect("knowledgeIndex" in store).toBe(false);
  });
});
