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

describe("I20.10 AI recommend last-run export", () => {
  it("rejects unknown export format", async () => {
    const store = seedStore("i2010-format", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const bad = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/export?format=xlsx",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(bad.statusCode).toBe(400);
    expect(bad.json().reason).toBe("invalid_format");
  });

  it("filters keys and exports CSV without recording a new run", async () => {
    const store = seedStore("i2010-export", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations",
      headers: { authorization: `Bearer ${token}` },
    });
    const runCount = store.aiRecommendRuns.length;
    const occurredAt = store.aiRecommendRuns[0]!.occurredAt;

    const filtered = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run?key=notifications.",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(filtered.statusCode).toBe(200);
    expect(filtered.json().increment).toBe("I20.17");
    expect(filtered.json().filter.key).toBe("notifications.");
    expect(filtered.json().keys.every((key: string) => key.startsWith("notifications."))).toBe(true);
    expect(filtered.json().lastRun.occurredAt).toBe(occurredAt);
    expect(store.aiRecommendRuns.length).toBe(runCount);

    const csv = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/export?format=csv&key=notifications.",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(csv.statusCode).toBe(200);
    expect(csv.json().format).toBe("csv");
    expect(csv.json().csv).toContain("occurredAt,provider,count,key,stale,neverRun,ageHours,thresholdHours");
    expect(csv.json().csv).toContain("notifications.allowlist_digest.stale");
    expect(csv.json().csv).not.toContain("events.dlq_digest.stale");
    expect(store.aiRecommendRuns[0]!.occurredAt).toBe(occurredAt);
  });
});
