import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import type {
  NotifAllowlistDualDigestStaleAuditExportLastPreset,
  NotifAllowlistDualDigestStaleAuditExportPresetUsage,
} from "@sedmc/kernel";
import {
  insertNotifAllowlistDualDigestStaleAuditExportPresetUsage,
  loadNotifAllowlistDualDigestStaleAuditExportLastPresets,
  loadNotifAllowlistDualDigestStaleAuditExportPresetUsages,
  upsertNotifAllowlistDualDigestStaleAuditExportLastPreset,
} from "./persistence/pg-repository.js";
import {
  hydrateNotifAllowlistDualDigestStaleAuditExportLastPresets,
  hydrateNotifAllowlistDualDigestStaleAuditExportPresetUsages,
  persistNotifAllowlistDualDigestStaleAuditExportLastPreset,
  persistNotifAllowlistDualDigestStaleAuditExportPresetUsage,
} from "./persistence/notifications.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;
const PARTNER_TENANT_ID = "22222222-2222-4222-8222-222222222222";
const PARTNER_PRESET_ID = "33333333-3333-4333-8333-333333333333";

function isI337UsageSql(sql: string) {
  return (
    sql.includes("notif_allowlist_dual_digest_stale_audit_export_preset_usage") ||
    sql.includes("notif_allowlist_dual_digest_stale_audit_export_last_preset")
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

describe("I3.37 persist allowlist preset usage and last-used preset", () => {
  it("lists I3.37 migration without I4 or I20 usage tables", () => {
    const files = listMigrationFiles();
    expect(files.some((f) => f.includes("077_i337_allowlist_dual_digest_stale_audit_export_preset_usage"))).toBe(true);
    expect(files.some((f) => f.includes("077_") && f.includes("i434"))).toBe(false);
    expect(files.some((f) => f.includes("077_") && f.includes("i2022"))).toBe(false);
    expect(files.some((f) => f.includes("077_") && f.includes("pg30"))).toBe(false);
  });

  it("dual-writes usage and last preset on named export and hydrates", async () => {
    const store = seedStore("i337-persist", TEST_BOOTSTRAP_SECRETS);
    const writes: string[] = [];
    const usageWrites: NotifAllowlistDualDigestStaleAuditExportPresetUsage[] = [];
    const lastWrites: NotifAllowlistDualDigestStaleAuditExportLastPreset[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        writes.push(text);
        if (text.includes("INSERT INTO notif_allowlist_dual_digest_stale_audit_export_preset_usage")) {
          usageWrites.push({
            id: params![0] as string,
            tenantId: params![1] as string,
            principalId: params![2] as string,
            presetId: params![3] as string,
            presetName: params![4] as string,
            createdAt: params![5] as string,
            createdByPrincipalId: params![6] as string,
          });
        }
        if (text.includes("INSERT INTO notif_allowlist_dual_digest_stale_audit_export_last_preset")) {
          lastWrites.push({
            tenantId: params![0] as string,
            principalId: params![1] as string,
            presetId: params![2] as string,
            presetName: params![3] as string,
            usedAt: params![4] as string,
          });
        }
        if (text.includes("FROM notif_allowlist_dual_digest_stale_audit_export_preset_usage") && !text.includes("INSERT")) {
          return {
            rows: usageWrites.map((row) => ({
              id: row.id,
              tenant_id: row.tenantId,
              principal_id: row.principalId,
              preset_id: row.presetId,
              preset_name: row.presetName,
              created_at: row.createdAt,
              created_by_principal_id: row.createdByPrincipalId,
            })),
            rowCount: usageWrites.length,
          };
        }
        if (text.includes("FROM notif_allowlist_dual_digest_stale_audit_export_last_preset") && !text.includes("INSERT")) {
          return {
            rows: lastWrites.map((row) => ({
              tenant_id: row.tenantId,
              principal_id: row.principalId,
              preset_id: row.presetId,
              preset_name: row.presetName,
              used_at: row.usedAt,
            })),
            rowCount: lastWrites.length,
          };
        }
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
    expect(usageWrites).toHaveLength(0);
    expect(lastWrites).toHaveLength(0);

    const token = await loginCarol(app);
    const empty = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.statusCode).toBe(200);
    expect(empty.json().increment).toBe("I3.37");
    expect(empty.json().lastPreset).toBeNull();
    expect(empty.json().usages).toEqual([]);
    expect(writes.filter(isI337UsageSql)).toHaveLength(0);

    const plain = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(plain.statusCode).toBe(200);
    expect(plain.json().lastPreset).toBeNull();
    expect(plain.json().lastFilter).toBeTruthy();
    expect(usageWrites).toHaveLength(0);
    expect(lastWrites).toHaveLength(0);
    expect(writes.some(isI332LastFilterSql)).toBe(true);

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });
    expect(usageWrites).toHaveLength(0);
    expect(lastWrites).toHaveLength(0);

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
    expect(usageWrites).toHaveLength(0);

    const crossTenant = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export?presetId=${PARTNER_PRESET_ID}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(crossTenant.statusCode).toBe(404);
    expect(usageWrites).toHaveLength(0);

    const invalid = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export?since=not-a-date",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(invalid.statusCode).toBe(400);
    expect(usageWrites).toHaveLength(0);

    const invalidName = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export?preset=${"x".repeat(81)}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(invalidName.statusCode).toBe(400);
    expect(usageWrites).toHaveLength(0);

    const exported = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export?preset=Snoozes%20only",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I3.37");
    expect(exported.json().lastPreset.presetName).toBe("Snoozes only");
    expect(exported.json().lastPreset).not.toHaveProperty("tenantId");
    expect(exported.json().lastFilter.action).toBe("snooze");
    expect(usageWrites).toHaveLength(1);
    expect(lastWrites).toHaveLength(1);
    expect(usageWrites[0]!.presetName).toBe("Snoozes only");
    expect(lastWrites[0]!.presetName).toBe("Snoozes only");
    const persistAfterApply = writes.filter(isI337UsageSql).length;

    const after = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().lastPreset.presetName).toBe("Snoozes only");
    expect(after.json().usages).toHaveLength(1);
    expect(after.json().usages[0]).not.toHaveProperty("tenantId");
    expect(after.json().usages[0]).not.toHaveProperty("principalId");
    expect(after.json().usages[0]).not.toHaveProperty("createdByPrincipalId");
    expect(after.json().lastFilter.action).toBe("snooze");
    expect(writes.filter(isI337UsageSql)).toHaveLength(persistAfterApply);

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
    expect(writes.filter(isI337UsageSql)).toHaveLength(persistAfterApply);

    const repeated = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export?preset=Snoozes%20only",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(repeated.statusCode).toBe(200);
    expect(usageWrites).toHaveLength(2);
    expect(lastWrites.length).toBeGreaterThanOrEqual(2);
    const persistAfterRepeat = writes.filter(isI337UsageSql).length;
    expect(persistAfterRepeat).toBeGreaterThan(persistAfterApply);

    const statusAfterRepeat = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(statusAfterRepeat.json().usages).toHaveLength(2);
    expect(statusAfterRepeat.json().usages[0].createdAt >= statusAfterRepeat.json().usages[1].createdAt).toBe(true);
    expect(writes.filter(isI337UsageSql)).toHaveLength(persistAfterRepeat);

    const badFormat = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets/usage?format=xlsx",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(badFormat.statusCode).toBe(400);
    expect(writes.filter(isI337UsageSql)).toHaveLength(persistAfterRepeat);

    const usageJson = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets/usage",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(usageJson.statusCode).toBe(200);
    expect(usageJson.json().count).toBe(2);
    expect(writes.filter(isI337UsageSql)).toHaveLength(persistAfterRepeat);

    const usageCsv = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets/usage?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(usageCsv.statusCode).toBe(200);
    expect(usageCsv.json().csv).toContain("presetId,presetName,createdAt");
    expect(writes.filter(isI337UsageSql)).toHaveLength(persistAfterRepeat);

    const snapshotName = usageWrites[0]!.presetName;
    const presetId = exported.json().lastPreset.presetId as string;
    const renamed = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export/presets/${presetId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Renamed snoozes" },
    });
    expect(renamed.statusCode).toBe(200);
    expect(usageWrites.every((row) => row.presetName === snapshotName)).toBe(true);
    expect(writes.filter(isI337UsageSql)).toHaveLength(persistAfterRepeat);

    const removed = await app.inject({
      method: "DELETE",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export/presets/${presetId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(removed.statusCode).toBe(200);
    expect(usageWrites).toHaveLength(2);
    expect(lastWrites[lastWrites.length - 1]!.presetId).toBe(presetId);
    expect(writes.some((sql) => sql.includes("DELETE FROM notif_allowlist_dual_digest_stale_audit_export_preset_usage"))).toBe(
      false,
    );
    expect(writes.some((sql) => sql.includes("DELETE FROM notif_allowlist_dual_digest_stale_audit_export_last_preset"))).toBe(
      false,
    );

    const exportDeleted = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/allowlist-dual-digest-stale/export?presetId=${presetId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exportDeleted.statusCode).toBe(404);
    expect(usageWrites).toHaveLength(2);

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
      statusAfterDelete.json().presets.some((row: { id: string }) => row.id === statusAfterDelete.json().lastPreset.presetId);
    expect(canPrefill).toBe(false);

    expect(writes.some((sql) => sql.includes("notif_dlq_sla_digest_stale_audit_export_preset_usage"))).toBe(false);
    expect(writes.some((sql) => sql.includes("notif_dlq_sla_digest_stale_audit_export_last_preset"))).toBe(false);
    expect(writes.some((sql) => sql.includes("ai_recommend_stale_audit_export_preset_usage"))).toBe(false);
    expect(writes.some((sql) => sql.includes("ai_recommend_stale_audit_export_last_preset"))).toBe(false);

    const emptyStore = seedStore("i337-hydrate", TEST_BOOTSTRAP_SECRETS);
    const mergedUsages = await hydrateNotifAllowlistDualDigestStaleAuditExportPresetUsages(store.dbPool!, emptyStore);
    const mergedLast = await hydrateNotifAllowlistDualDigestStaleAuditExportLastPresets(store.dbPool!, emptyStore);
    expect(mergedUsages).toBe(2);
    expect(mergedLast).toBe(1);
    expect(emptyStore.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(2);
    expect(emptyStore.notifAllowlistDualDigestStaleAuditExportLastPresets[0]!.presetName).toBe("Snoozes only");
    expect(emptyStore.notifAllowlistDualDigestStaleAuditExportPresetUsages.every((row) => row.presetName === snapshotName)).toBe(
      true,
    );
    await persistNotifAllowlistDualDigestStaleAuditExportPresetUsage(store.dbPool, usageWrites[0]!);
    await persistNotifAllowlistDualDigestStaleAuditExportLastPreset(store.dbPool, lastWrites[0]!);
    expect(typeof insertNotifAllowlistDualDigestStaleAuditExportPresetUsage).toBe("function");
    expect(typeof upsertNotifAllowlistDualDigestStaleAuditExportLastPreset).toBe("function");
    expect(typeof loadNotifAllowlistDualDigestStaleAuditExportPresetUsages).toBe("function");
    expect(typeof loadNotifAllowlistDualDigestStaleAuditExportLastPresets).toBe("function");
  });

  it("swallows persist throw, stays memory-only without dbPool, and does not swallow hydrate throw", async () => {
    const throwing = seedStore("i337-throw", TEST_BOOTSTRAP_SECRETS);
    throwing.dbPool = {
      query: async (sql: string) => {
        if (String(sql).includes("notif_allowlist_dual_digest_stale_audit_export_preset_usage")) {
          throw new Error("usage persist failed");
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;
    const throwApp = buildServer({ store: throwing });
    const throwToken = await loginCarol(throwApp);
    await throwApp.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets",
      headers: { authorization: `Bearer ${throwToken}` },
      payload: { name: "Throw persist", action: "ack" },
    });
    const thrown = await throwApp.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export?preset=Throw%20persist",
      headers: { authorization: `Bearer ${throwToken}` },
    });
    expect(thrown.statusCode).toBe(200);
    expect(throwing.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(1);

    const memory = seedStore("i337-memory", TEST_BOOTSTRAP_SECRETS);
    const memoryApp = buildServer({ store: memory });
    const memoryToken = await loginCarol(memoryApp);
    await memoryApp.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export/presets",
      headers: { authorization: `Bearer ${memoryToken}` },
      payload: { name: "Memory only", action: "cleared" },
    });
    const memoryExport = await memoryApp.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export?preset=Memory%20only",
      headers: { authorization: `Bearer ${memoryToken}` },
    });
    expect(memoryExport.statusCode).toBe(200);
    expect(memoryExport.json().lastPreset.presetName).toBe("Memory only");
    expect(memory.notifAllowlistDualDigestStaleAuditExportPresetUsages).toHaveLength(1);
    expect(memory.dbPool).toBeUndefined();

    const hydrateFail = seedStore("i337-hydrate-fail", TEST_BOOTSTRAP_SECRETS);
    const failingPool = {
      query: async () => {
        throw new Error("hydrate select failed");
      },
    } as never;
    await expect(hydrateNotifAllowlistDualDigestStaleAuditExportPresetUsages(failingPool, hydrateFail)).rejects.toThrow(
      "hydrate select failed",
    );
  });
});
