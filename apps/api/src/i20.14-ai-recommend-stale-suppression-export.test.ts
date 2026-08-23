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

describe("I20.14 stale recommend suppression export / audit", () => {
  it("rejects unknown export format and requires ai:read:recommend", async () => {
    const store = seedStore("i2014-format", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const alice = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
    });
    const forbidden = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export",
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
    });
    expect(forbidden.statusCode).toBe(403);

    const token = await loginCarol(app);
    const bad = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?format=xlsx",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(bad.statusCode).toBe(400);
    expect(bad.json().reason).toBe("invalid_format");
  });

  it("records snooze/ack/clear audit and exports CSV", async () => {
    const store = seedStore("i2014-export", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const snoozed = await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I20.18");

    await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/ack",
      headers: { authorization: `Bearer ${token}` },
    });

    const json = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(json.statusCode).toBe(200);
    expect(json.json().increment).toBe("I20.18");
    expect(json.json().count).toBeGreaterThanOrEqual(2);
    expect(json.json().audits.map((a: { action: string }) => a.action)).toEqual(
      expect.arrayContaining(["snooze", "ack"]),
    );
    expect(json.json().audits.every((a: { tenantId?: string }) => a.tenantId === undefined)).toBe(true);
    const auditCount = store.aiRecommendStaleSuppressionAudits.length;

    const lastRun = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(lastRun.statusCode).toBe(200);
    expect(store.aiRecommendRuns.length).toBe(0);
    expect(store.aiRecommendStaleSuppressionAudits.length).toBe(auditCount);

    await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/export?format=json",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(store.aiRecommendRuns.length).toBe(0);
    expect(store.aiRecommendStaleSuppressionAudits.length).toBe(auditCount);

    await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });

    const csv = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(csv.json().format).toBe("csv");
    expect(csv.json().csv).toContain("action,snoozedUntil,acknowledgedAt,createdAt,createdByPrincipalId");
    expect(csv.json().csv).toContain("snooze");
    expect(csv.json().csv).toContain("ack");
    expect(csv.json().csv).toContain("cleared");
    expect(csv.json().suppression).toBeNull();
    expect(store.aiRecommendRuns.length).toBe(1);
  });
});
