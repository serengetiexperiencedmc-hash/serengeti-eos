import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const PARTNER_TENANT_ID = "22222222-2222-4222-8222-222222222222";
const PARTNER_PRESET_ID = "33333333-3333-4333-8333-333333333333";

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I4.33 DLQ preset usage and last-used preset echo", () => {
  it("records usage only when a preset is applied and does not persist usage", async () => {
    const store = seedStore("i433-usage", TEST_BOOTSTRAP_SECRETS);
    const writes: string[] = [];
    store.dbPool = {
      query: async (sql: string) => {
        writes.push(String(sql));
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const bob = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "bob.approver@sedmc.local", password: P.bobPassword, tenantSlug: "sedmc" },
    });
    const forbidden = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets/usage",
      headers: { authorization: `Bearer ${bob.json().accessToken}` },
    });
    expect(forbidden.statusCode).toBe(403);
    expect(forbidden.json().error).toBe("forbidden");

    const token = await loginCarol(app);
    const empty = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.statusCode).toBe(200);
    expect(empty.json().increment).toBe("I4.33");
    expect(empty.json().lastPreset).toBeNull();
    expect(empty.json().usages).toEqual([]);
    expect(empty.json().lastFilter).toBeNull();
    const writesAfterEmptyStatus = writes.length;

    const plain = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(plain.statusCode).toBe(200);
    expect(plain.json().increment).toBe("I4.33");
    expect(plain.json().lastPreset).toBeNull();
    expect(store.notifDlqSlaDigestStaleAuditExportPresetUsages).toHaveLength(0);
    expect(plain.json().lastFilter).toBeTruthy();

    const created = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });
    const presetId = created.json().preset.id as string;
    store.notifDlqSlaDigestStaleAuditExportPresets.push({
      id: PARTNER_PRESET_ID,
      tenantId: PARTNER_TENANT_ID,
      name: "Partner only",
      createdAt: new Date().toISOString(),
      createdByPrincipalId: "partner-user",
      updatedAt: new Date().toISOString(),
    });

    const missing = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export?presetId=00000000-0000-4000-8000-000000000000",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(missing.json().reason).toBe("preset_not_found");
    expect(store.notifDlqSlaDigestStaleAuditExportPresetUsages).toHaveLength(0);

    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export?presetId=${PARTNER_PRESET_ID}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(crossTenant.statusCode).toBe(404);
    expect(store.notifDlqSlaDigestStaleAuditExportPresetUsages).toHaveLength(0);

    const exported = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export?preset=Snoozes%20only",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I4.33");
    expect(exported.json().lastPreset.presetName).toBe("Snoozes only");
    expect(exported.json().lastPreset.presetId).toBe(presetId);
    expect(exported.json().lastPreset).not.toHaveProperty("tenantId");
    expect(exported.json().lastFilter.action).toBe("snooze");
    expect(store.notifDlqSlaDigestStaleAuditExportPresetUsages).toHaveLength(1);

    const after = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().lastPreset.presetName).toBe("Snoozes only");
    expect(after.json().usages).toHaveLength(1);
    expect(after.json().usages[0]).not.toHaveProperty("tenantId");
    expect(after.json().usages[0]).not.toHaveProperty("principalId");
    expect(after.json().lastFilter.action).toBe("snooze");
    expect(store.notifDlqSlaDigestStaleAuditExportPresetUsages).toHaveLength(1);
    expect(writesAfterEmptyStatus).toBe(0);

    const repeated = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export?presetId=${presetId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(repeated.statusCode).toBe(200);
    expect(store.notifDlqSlaDigestStaleAuditExportPresetUsages).toHaveLength(2);

    const statusAfterRepeat = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(statusAfterRepeat.json().usages).toHaveLength(2);

    const bad = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets/usage?format=xlsx",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(bad.statusCode).toBe(400);
    expect(bad.json().reason).toBe("invalid_format");
    expect(store.notifDlqSlaDigestStaleAuditExportPresetUsages).toHaveLength(2);

    const usageJson = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets/usage",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(usageJson.statusCode).toBe(200);
    expect(usageJson.json().increment).toBe("I4.33");
    expect(usageJson.json().format).toBe("json");
    expect(usageJson.json().count).toBe(2);
    expect(usageJson.json().lastPreset.presetName).toBe("Snoozes only");
    expect(usageJson.json().usages).toHaveLength(2);

    const usage = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets/usage?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(usage.statusCode).toBe(200);
    expect(usage.json().count).toBe(2);
    expect(usage.json().csv).toContain("presetId,presetName,createdAt");
    expect(usage.json().lastPreset.presetName).toBe("Snoozes only");
    expect(store.notifDlqSlaDigestStaleAuditExportPresetUsages).toHaveLength(2);
    expect(writes.some((sql) => sql.includes("preset_usage") || sql.includes("last_preset"))).toBe(false);

    const removed = await app.inject({
      method: "DELETE",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${presetId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(removed.statusCode).toBe(200);

    const exportDeleted = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export?presetId=${presetId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exportDeleted.statusCode).toBe(404);
    expect(store.notifDlqSlaDigestStaleAuditExportPresetUsages).toHaveLength(2);

    const statusAfterDelete = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(statusAfterDelete.json().lastPreset.presetId).toBe(presetId);
    expect(statusAfterDelete.json().usages).toHaveLength(2);
    expect(statusAfterDelete.json().presets.some((row: { id: string }) => row.id === presetId)).toBe(false);
  });
});
