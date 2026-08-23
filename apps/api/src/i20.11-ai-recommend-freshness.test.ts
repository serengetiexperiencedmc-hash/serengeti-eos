import { describe, expect, it } from "vitest";
import { aiRecommendLastRunFreshness } from "@sedmc/kernel";
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

describe("I20.11 AI recommend last-run freshness", () => {
  it("treats never-run as stale and clears after recommend", async () => {
    const store = seedStore("i2011-fresh", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const empty = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.statusCode).toBe(200);
    expect(empty.json().increment).toBe("I20.20");
    expect(empty.json().lastRun).toBeNull();
    expect(empty.json().freshness.neverRun).toBe(true);
    expect(empty.json().freshness.stale).toBe(true);
    expect(empty.json().freshness.ageHours).toBeNull();
    expect(empty.json().freshness.thresholdHours).toBe(26);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().freshness.neverRun).toBe(false);
    expect(listed.json().freshness.stale).toBe(false);
    expect(listed.json().freshness.ageHours).toBeLessThan(1);

    const after = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().freshness.neverRun).toBe(false);
    expect(after.json().freshness.stale).toBe(false);
    expect(store.aiRecommendRuns.length).toBe(1);

    const exported = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/export?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.json().increment).toBe("I20.20");
    expect(exported.json().freshness.stale).toBe(false);
    expect(exported.json().csv).toContain("stale,neverRun,ageHours,thresholdHours");
    expect(store.aiRecommendRuns.length).toBe(1);
  });

  it("marks a last-run older than the threshold as stale", async () => {
    const old = new Date(Date.now() - 40 * 3_600_000).toISOString();
    const freshness = aiRecommendLastRunFreshness(old);
    expect(freshness.neverRun).toBe(false);
    expect(freshness.stale).toBe(true);
    expect(freshness.ageHours).toBeGreaterThanOrEqual(26);

    const store = seedStore("i2011-old", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });
    store.aiRecommendRuns[0]!.occurredAt = old;

    const viewed = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(viewed.json().freshness.stale).toBe(true);
    expect(viewed.json().freshness.neverRun).toBe(false);
    expect(viewed.json().lastRun.occurredAt).toBe(old);
    expect(store.aiRecommendRuns.length).toBe(1);
  });
});
