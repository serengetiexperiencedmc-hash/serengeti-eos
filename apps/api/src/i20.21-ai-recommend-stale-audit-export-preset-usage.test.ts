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

describe("I20.21 preset usage audit and last-used preset echo", () => {
  it("records usage only when a preset is applied and does not record a recommend run", async () => {
    const store = seedStore("i2021-usage", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const alice = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
    });
    const forbidden = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export/presets/usage",
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
    });
    expect(forbidden.statusCode).toBe(403);

    const token = await loginCarol(app);
    const empty = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.json().increment).toBe("I20.22");
    expect(empty.json().lastPreset).toBeNull();
    expect(empty.json().usages).toEqual([]);
    expect(store.aiRecommendRuns.length).toBe(0);

    const plain = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(plain.statusCode).toBe(200);
    expect(plain.json().lastPreset).toBeNull();
    expect(store.aiRecommendStaleAuditExportPresetUsages.length).toBe(0);

    await app.inject({
      method: "POST",
      url: "/v1/ai/recommendations/last-run/stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });

    const exported = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export?preset=Snoozes%20only",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I20.22");
    expect(exported.json().lastPreset.presetName).toBe("Snoozes only");
    expect(exported.json().lastPreset).not.toHaveProperty("tenantId");
    expect(store.aiRecommendRuns.length).toBe(0);

    const after = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().lastPreset.presetName).toBe("Snoozes only");
    expect(after.json().usages).toHaveLength(1);
    expect(after.json().usages[0]).not.toHaveProperty("tenantId");
    expect(store.aiRecommendRuns.length).toBe(0);

    const bad = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export/presets/usage?format=xlsx",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(bad.statusCode).toBe(400);
    expect(bad.json().reason).toBe("invalid_format");

    const usage = await app.inject({
      method: "GET",
      url: "/v1/ai/recommendations/last-run/stale/export/presets/usage?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(usage.statusCode).toBe(200);
    expect(usage.json().count).toBe(1);
    expect(usage.json().csv).toContain("presetId,presetName,createdAt");
    expect(usage.json().lastPreset.presetName).toBe("Snoozes only");
    expect(store.aiRecommendRuns.length).toBe(0);
  });
});
