import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function login(
  app: ReturnType<typeof buildServer>,
  email: string,
  password: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I20.12 AI recommend stale snooze / ack", () => {
  it("requires ai:write:draft and rejects invalid hours", async () => {
    const store = seedStore("i2012-auth", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const alice = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const forbidden = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/snooze",
      headers: { authorization: `Bearer ${alice}` },
      payload: { hours: 24 },
    });
    expect(forbidden.statusCode).toBe(403);

    const carol = await login(app, "carol.admin@sedmc.local", P.carolPassword);
    const bad = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/snooze",
      headers: { authorization: `Bearer ${carol}` },
      payload: { hours: 0 },
    });
    expect(bad.statusCode).toBe(400);
    expect(bad.json().reason).toBe("invalid_hours");
  });

  it("hides stale banner after snooze or ack until recommend restamps", async () => {
    const store = seedStore("i2012-snooze", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await login(app, "carol.admin@sedmc.local", P.carolPassword);

    const empty = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.json().increment).toBe("I20.17");
    expect(empty.json().freshness.stale).toBe(true);
    expect(empty.json().suppressed).toBe(false);
    expect(empty.json().suppression).toBeNull();

    const snoozed = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I20.17");
    expect(snoozed.json().suppressed).toBe(true);
    expect(snoozed.json().suppression.snoozedUntil).toBeTruthy();
    expect(store.aiRecommendRuns.length).toBe(0);

    const afterSnooze = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(afterSnooze.json().freshness.stale).toBe(true);
    expect(afterSnooze.json().freshness.neverRun).toBe(true);
    expect(afterSnooze.json().suppressed).toBe(true);
    expect(afterSnooze.json().suppression.snoozedUntil).toBeTruthy();
    expect(store.aiRecommendRuns.length).toBe(0);

    const acked = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/ack",
      headers: { authorization: `Bearer ${token}` },
      payload: {},
    });
    expect(acked.json().suppression.acknowledgedAt).toBeTruthy();
    expect(acked.json().suppression.snoozedUntil).toBeUndefined();

    const exported = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/export?format=json",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.json().suppressed).toBe(true);
    expect(exported.json().suppression.acknowledgedAt).toBeTruthy();
    expect(store.aiRecommendRuns.length).toBe(0);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.json().freshness.stale).toBe(false);
    expect(listed.json().suppressed).toBe(false);
    expect(listed.json().suppression).toBeNull();
    expect(store.aiRecommendStaleSuppressions.length).toBe(0);

    const afterRun = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(afterRun.json().suppressed).toBe(false);
    expect(afterRun.json().suppression).toBeNull();
  });
});
