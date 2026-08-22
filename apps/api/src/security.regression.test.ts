import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function login(
  app: ReturnType<typeof buildServer>,
  email: string,
  password: string,
  tenant = "sedmc",
) {
  return app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug: tenant },
  });
}

describe("I1 security regression", () => {
  it("rejects missing authentication", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const res = await app.inject({ method: "GET", url: "/v1/principals" });
    expect(res.statusCode).toBe(401);
  });

  it("rejects invalid credentials", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const res = await login(app, "carol.admin@sedmc.local", "wrong-password");
    expect(res.statusCode).toBe(401);
  });

  it("rejects malformed tokens", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const res = await app.inject({
      method: "GET",
      url: "/v1/me",
      headers: { authorization: "Bearer not-a-jwt" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("rejects expired sessions", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const token = carol.json().accessToken;
    const session = store.sessions.find((s) => !s.revokedAt);
    expect(session).toBeTruthy();
    session!.expiresAt = new Date(Date.now() - 1000).toISOString();
    const res = await app.inject({
      method: "GET",
      url: "/v1/me",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(401);
  });

  it("blocks privilege escalation and insufficient role", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const forbidden = await app.inject({
      method: "POST",
      url: "/v1/locations",
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
      payload: { code: "X", name: "Nope" },
    });
    expect(forbidden.statusCode).toBe(403);
  });

  it("blocks unauthorized configuration approval and records deny audit", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const draft = await app.inject({
      method: "POST",
      url: "/v1/config/security.lockdown/drafts",
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
      payload: { value: { enabled: true } },
    });
    const versionId = draft.json().version.id;
    const denied = await app.inject({
      method: "POST",
      url: `/v1/config/versions/${versionId}/approve`,
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
      payload: {},
    });
    expect(denied.statusCode).toBe(403);
    expect(store.audit.some((a) => a.authorization === "deny" && a.action === "config:approve:item")).toBe(
      true,
    );
  });

  it("keeps human/service/ai actors distinguishable in audit", async () => {
    const store = seedStore("test-secret");
    const app = buildServer({ store });
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    await app.inject({
      method: "POST",
      url: "/v1/principals",
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
      payload: {
        actorType: "AiAgent",
        displayName: "Draft agent",
        classificationClearance: "Internal",
      },
    });
    const createEvents = store.audit.filter((a) => a.action === "identity:write:principal");
    expect(createEvents.every((e) => e.actorType === "Human")).toBe(true);
    expect(createEvents.at(-1)?.newState).toMatchObject({ actorType: "AiAgent" });
  });

  it("denies cross-tenant admin reads without disclosure", async () => {
    const app = buildServer({ store: seedStore("test-secret") });
    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const partner = await login(app, "partner@external.local", P.partnerPassword, "partner-demo");
    const partnerPrincipals = await app.inject({
      method: "GET",
      url: "/v1/principals",
      headers: { authorization: `Bearer ${partner.json().accessToken}` },
    });
    // partner lacks identity:read:principal
    expect(partnerPrincipals.statusCode).toBe(403);
    const adminList = await app.inject({
      method: "GET",
      url: "/v1/principals",
      headers: { authorization: `Bearer ${carol.json().accessToken}` },
    });
    expect(adminList.json().items.every((p: { tenantId: string }) => p.tenantId === carol.json().principal.tenantId)).toBe(
      true,
    );
  });
});
