import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const PARTNER_TENANT_ID = "22222222-2222-4222-8222-222222222222";
const PARTNER_PRESET_ID = "33333333-3333-4333-8333-333333333333";

function isUsageOrLastPresetSql(sql: string) {
  return (
    sql.includes("preset_usage") ||
    sql.includes("last_preset") ||
    sql.includes("ai_recommend_stale_audit_export_preset_usage") ||
    sql.includes("ai_recommend_stale_audit_export_last_preset")
  );
}

function isI332LastFilterSql(sql: string) {
  return sql.includes("notif_allowlist_dual_digest_stale_audit_export_last_filter");
}

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.36 allowlist preset usage and last-used preset echo", () => {
  it("does not add an I3.36 usage migration", () => {
    const files = listMigrationFiles();
    expect(files.some((f) => f.includes("i336") && f.includes("preset_usage"))).toBe(false);
    expect(files.some((f) => f.includes("allowlist") && f.includes("preset_usage"))).toBe(false);
  });

  it("records usage only when a preset is applied and does not persist usage", async () => {
    const store = seedStore("i336-usage", TEST_BOOTSTRAP_SECRETS);
    const writes: string[] = [];
    store.dbPool = {
      query: async (sql: string) => {
        writes.push(String(sql));
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const unauth = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets/usage",
    });
    expect(unauth.statusCode).toBe(401);

    const bob = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "bob.approver@sedmc.local", password: P.bobPassword, tenantSlug: "sedmc" },
    });
    const forbidden = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets/usage",
      headers: { authorization: `Bearer ${bob.json().accessToken}` },
    });
    expect(forbidden.statusCode).toBe(403);
    expect(forbidden.json().error).toBe("forbidden");
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(0);

    const token = await loginCarol(app);
    const empty = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.statusCode).toBe(200);
    expect(empty.json().increment).toBe("I3.36");
    expect(empty.json().lastPreset).toBeNull();
    expect(empty.json().usages).toEqual([]);
    expect(empty.json().lastFilter).toBeNull();
    expect(writes.filter(isUsageOrLastPresetSql)).toHaveLength(0);

    const plain = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(plain.statusCode).toBe(200);
    expect(plain.json().increment).toBe("I3.36");
    expect(plain.json().lastPreset).toBeNull();
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(0);
    expect(plain.json().lastFilter).toBeTruthy();
    expect(writes.some(isI332LastFilterSql)).toBe(true);
    expect(writes.filter(isUsageOrLastPresetSql)).toHaveLength(0);

    const created = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });
    const presetId = created.json().preset.id as string;
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(0);

    store.notifAllowlistDualDigestStaleAuditExportPresets.push({
      id: PARTNER_PRESET_ID,
      tenantId: PARTNER_TENANT_ID,
      name: "Partner only",
      createdAt: new Date().toISOString(),
      createdByPrincipalId: "partner-user",
      updatedAt: new Date().toISOString(),
    });

    const missing = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export?presetId=00000000-0000-4000-8000-000000000000",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(missing.json().reason).toBe("preset_not_found");
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(0);

    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export?presetId=${PARTNER_PRESET_ID}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(crossTenant.statusCode).toBe(404);
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(0);

    const invalidWindow = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export?since=not-a-date",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(invalidWindow.statusCode).toBe(400);
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(0);

    const invalidName = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export?preset=${"x".repeat(81)}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(invalidName.statusCode).toBe(400);
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(0);

    const persistBeforeApply = writes.filter(isUsageOrLastPresetSql).length;
    const exported = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export?preset=Snoozes%20only",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I3.36");
    expect(exported.json().lastPreset.presetName).toBe("Snoozes only");
    expect(exported.json().lastPreset.presetId).toBe(presetId);
    expect(exported.json().lastPreset).not.toHaveProperty("tenantId");
    expect(exported.json().lastFilter.action).toBe("snooze");
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(1);
    expect(writes.filter(isUsageOrLastPresetSql)).toHaveLength(persistBeforeApply);

    const after = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().lastPreset.presetName).toBe("Snoozes only");
    expect(after.json().usages).toHaveLength(1);
    expect(after.json().usages[0]).not.toHaveProperty("tenantId");
    expect(after.json().usages[0]).not.toHaveProperty("principalId");
    expect(after.json().lastFilter.action).toBe("snooze");
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(1);
    expect(writes.filter(isUsageOrLastPresetSql)).toHaveLength(persistBeforeApply);

    const alice = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
    });
    const aliceStatus = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${alice.json().accessToken}` },
    });
    expect(aliceStatus.statusCode).toBe(200);
    expect(aliceStatus.json().lastPreset).toBeNull();
    expect(aliceStatus.json().usages).toEqual([]);
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(1);

    const repeated = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export?presetId=${presetId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(repeated.statusCode).toBe(200);
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(2);

    const statusAfterRepeat = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(statusAfterRepeat.json().usages).toHaveLength(2);
    expect(statusAfterRepeat.json().usages[0].createdAt >= statusAfterRepeat.json().usages[1].createdAt).toBe(true);
    expect(writes.filter(isUsageOrLastPresetSql)).toHaveLength(persistBeforeApply);

    const bad = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets/usage?format=xlsx",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(bad.statusCode).toBe(400);
    expect(bad.json().reason).toBe("invalid_format");
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(2);

    const usageJson = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets/usage",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(usageJson.statusCode).toBe(200);
    expect(usageJson.json().increment).toBe("I3.36");
    expect(usageJson.json().format).toBe("json");
    expect(usageJson.json().count).toBe(2);
    expect(usageJson.json().lastPreset.presetName).toBe("Snoozes only");
    expect(usageJson.json().usages).toHaveLength(2);
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(2);

    const usage = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets/usage?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(usage.statusCode).toBe(200);
    expect(usage.json().count).toBe(2);
    expect(usage.json().csv).toContain("presetId,presetName,createdAt");
    expect(usage.json().lastPreset.presetName).toBe("Snoozes only");
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(2);
    expect(writes.filter(isUsageOrLastPresetSql)).toHaveLength(persistBeforeApply);

    const snapshotName = store.notifAllowlistDualDigestStaleAuditExportPresetUsages[0]!.presetName;
    const renamed = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export/presets/${presetId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Renamed snoozes" },
    });
    expect(renamed.statusCode).toBe(200);
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages.every((row) => row.presetName === snapshotName)).toBe(
      true,
    );

    const removed = await app.inject({
      method: "DELETE",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export/presets/${presetId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(removed.statusCode).toBe(200);

    const exportDeleted = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export?presetId=${presetId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exportDeleted.statusCode).toBe(404);
    expect(store.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(2);
    expect(writes.filter(isUsageOrLastPresetSql)).toHaveLength(persistBeforeApply);

    const statusAfterDelete = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(statusAfterDelete.json().lastPreset.presetId).toBe(presetId);
    expect(statusAfterDelete.json().usages).toHaveLength(2);
    expect(statusAfterDelete.json().presets.some((row: { id: string }) => row.id === presetId)).toBe(false);
    const canPrefill =
      statusAfterDelete.json().lastPreset &&
      statusAfterDelete.json().presets.some(
        (row: { id: string }) => row.id === statusAfterDelete.json().lastPreset.presetId,
      );
    expect(canPrefill).toBe(false);
  });
});
