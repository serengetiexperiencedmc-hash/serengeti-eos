import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I20.16 stale recommend suppression export filters", () => {
  it("rejects unknown action and inverted window", async () => {
    const store = seedStore("i2016-format", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const badAction = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?action=merge",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(badAction.statusCode).toBe(400);
    expect(badAction.json().reason).toBe("invalid_action");

    const badWindow = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?since=2026-08-24T00:00:00.000Z&until=2026-08-23T00:00:00.000Z",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(badWindow.statusCode).toBe(400);
    expect(badWindow.json().reason).toBe("invalid_window");
  });

  it("filters export by action and createdAt window without recording a run", async () => {
    const store = seedStore("i2016-filter", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/ack",
      headers: { authorization: `Bearer ${token}` },
    });
    await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });
    const runCount = store.aiRecommendRuns.length;

    const snoozeOnly = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?action=snooze",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(snoozeOnly.statusCode).toBe(200);
    expect(snoozeOnly.json().increment).toBe("I20.21");
    expect(snoozeOnly.json().filter.action).toBe("snooze");
    expect(snoozeOnly.json().audits.every((a: { action: string }) => a.action === "snooze")).toBe(true);
    expect(snoozeOnly.json().count).toBe(1);
    expect(store.aiRecommendRuns.length).toBe(runCount);

    const last = store.aiRecommendStaleSuppressionAudits[store.aiRecommendStaleSuppressionAudits.length - 1]!;
    const windowed = await app.inject({
      method: "GET",
      url: `/v1/ai/recommendations/last-run/stale/export?since=${encodeURIComponent(last.createdAt)}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(windowed.statusCode).toBe(200);
    expect(windowed.json().filter.since).toBe(last.createdAt);
    expect(windowed.json().audits.every((a: { createdAt: string }) => a.createdAt >= last.createdAt)).toBe(true);
    expect(windowed.json().count).toBeGreaterThanOrEqual(1);
    expect(store.aiRecommendRuns.length).toBe(runCount);
  });
});
