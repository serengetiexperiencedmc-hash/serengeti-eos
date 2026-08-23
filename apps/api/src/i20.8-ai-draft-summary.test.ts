import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function login(app: ReturnType<typeof buildServer>, email: string, password: string) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I20.8 AI draft summary", () => {
  it("requires ai:read:recommend", async () => {
    const store = seedStore("i208-auth", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const forbidden = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts/summary",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(forbidden.statusCode).toBe(403);
  });

  it("returns pendingCount after create and accept", async () => {
    const store = seedStore("i208-summary", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await login(app, "carol.admin@sedmc.local", P.carolPassword);

    const empty = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts/summary",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.statusCode).toBe(200);
    expect(empty.json().increment).toBe("I20.9");
    expect(empty.json().pendingCount).toBe(0);

    const created = await app.inject({
      method: "POST",
      url: "/v1/ai/drafts",
      headers: { authorization: `Bearer ${token}` },
      payload: { recommendationKey: "notifications.allowlist_digest.stale" },
    });
    expect(created.statusCode).toBe(201);

    const pending = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts/summary",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(pending.json().pendingCount).toBe(1);

    await app.inject({
      method: "POST",
      url: `/v1/ai/drafts/${created.json().draft.id}/accept`,
      headers: { authorization: `Bearer ${token}` },
    });

    const after = await app.inject({
      method: "GET",
      url: "/v1/ai/drafts/summary",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().pendingCount).toBe(0);
  });
});
