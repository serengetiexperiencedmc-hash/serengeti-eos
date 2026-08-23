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

describe("I4.30 named tenant stale DLQ audit export presets", () => {
  it("requires write to save, rejects empty names, and upserts by name", async () => {
    const store = seedStore("i430-presets", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const bob = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "bob.approver@sedmc.local", password: P.bobPassword, tenantSlug: "sedmc" },
    });
    const forbidden = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${bob.json().accessToken}` },
      payload: { name: "Last 24h", action: "snooze" },
    });
    expect(forbidden.statusCode).toBe(403);

    const token = await loginCarol(app);
    const empty = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.statusCode).toBe(200);
    expect(empty.json().increment).toBe("I4.33");
    expect(empty.json().presets).toEqual([]);

    const nameless = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "   " },
    });
    expect(nameless.statusCode).toBe(400);
    expect(nameless.json().reason).toBe("invalid_name");

    const created = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "  Last  24h ", action: "snooze", since: "2026-08-23T00:00:00.000Z" },
    });
    expect(created.statusCode).toBe(200);
    expect(created.json().increment).toBe("I4.33");
    expect(created.json().preset.name).toBe("Last 24h");
    expect(created.json().preset.action).toBe("snooze");
    expect(created.json().preset).not.toHaveProperty("tenantId");
    const presetId = created.json().preset.id as string;

    const updated = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "last 24h", action: "ack" },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().preset.id).toBe(presetId);
    expect(updated.json().preset.action).toBe("ack");
    expect(updated.json().preset.since).toBeUndefined();
    expect(updated.json().presets).toHaveLength(1);
  });

  it("applies a named preset on stale export and still persists lastFilter", async () => {
    const store = seedStore("i430-export", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/ack",
      headers: { authorization: `Bearer ${token}` },
    });

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });

    const missing = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export?preset=Unknown",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(missing.json().reason).toBe("preset_not_found");

    const exported = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export?preset=Snoozes%20only",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I4.33");
    expect(exported.json().filter.action).toBe("snooze");
    expect(exported.json().preset.name).toBe("Snoozes only");
    expect(exported.json().audits.every((row: { action: string }) => row.action === "snooze")).toBe(true);
    expect(exported.json().lastFilter.action).toBe("snooze");

    const listed = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().presets.map((row: { name: string }) => row.name)).toEqual(["Snoozes only"]);
  });
});
