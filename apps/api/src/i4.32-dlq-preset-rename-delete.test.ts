import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { deleteNotifDlqSlaDigestStaleAuditExportPreset } from "./persistence/pg-repository.js";
import { persistDeleteNotifDlqSlaDigestStaleAuditExportPreset } from "./persistence/notifications.js";

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

describe("I4.32 rename and delete stale DLQ audit export presets", () => {
  it("renames, rejects taken names, and deletes without persisting status GET", async () => {
    const store = seedStore("i432-rename", TEST_BOOTSTRAP_SECRETS);
    const deleted: string[] = [];
    const writes: Array<{ id: string; name: string }> = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("DELETE FROM notif_dlq_sla_digest_stale_audit_export_preset")) {
          deleted.push(params![0] as string);
        }
        if (text.includes("INSERT INTO notif_dlq_sla_digest_stale_audit_export_preset (")) {
          writes.push({ id: params![0] as string, name: params![2] as string });
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const bob = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "bob.approver@sedmc.local", password: P.bobPassword, tenantSlug: "sedmc" },
    });
    const token = await loginCarol(app);

    const first = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });
    const second = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Acks only", action: "ack" },
    });
    const firstId = first.json().preset.id as string;
    const secondId = second.json().preset.id as string;
    store.notifDlqSlaDigestStaleAuditExportPresets.push({
      id: PARTNER_PRESET_ID,
      tenantId: PARTNER_TENANT_ID,
      name: "Partner only",
      createdAt: new Date().toISOString(),
      createdByPrincipalId: "partner-user",
      updatedAt: new Date().toISOString(),
    });
    const writesAfterCreate = writes.length;

    const forbidden = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${bob.json().accessToken}` },
      payload: { name: "Renamed" },
    });
    expect(forbidden.statusCode).toBe(403);
    expect(forbidden.json().error).toBe("forbidden");
    expect(writes.length).toBe(writesAfterCreate);

    const nameless = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "   " },
    });
    expect(nameless.statusCode).toBe(400);
    expect(nameless.json().error).toBe("invalid_request");
    expect(nameless.json().reason).toBe("invalid_name");
    expect(writes.length).toBe(writesAfterCreate);

    const tooLong = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "x".repeat(81) },
    });
    expect(tooLong.statusCode).toBe(400);
    expect(tooLong.json().error).toBe("invalid_request");
    expect(tooLong.json().reason).toBe("invalid_name");
    expect(writes.length).toBe(writesAfterCreate);

    const missing = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets/00000000-0000-4000-8000-000000000000/rename",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Missing" },
    });
    expect(missing.statusCode).toBe(404);
    expect(missing.json().error).toBe("not_found");
    expect(missing.json().reason).toBe("preset_not_found");
    expect(writes.length).toBe(writesAfterCreate);

    const crossTenant = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${PARTNER_PRESET_ID}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Sedmc copy" },
    });
    expect(crossTenant.statusCode).toBe(404);
    expect(crossTenant.json().error).toBe("not_found");
    expect(crossTenant.json().reason).toBe("preset_not_found");
    expect(writes.length).toBe(writesAfterCreate);
    expect(store.notifDlqSlaDigestStaleAuditExportPresets.some((row) => row.id === PARTNER_PRESET_ID)).toBe(true);

    const clash = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "acks only" },
    });
    expect(clash.statusCode).toBe(409);
    expect(clash.json().error).toBe("conflict");
    expect(clash.json().reason).toBe("name_taken");
    expect(writes.length).toBe(writesAfterCreate);

    const renamed = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "  Last  snoozes " },
    });
    expect(renamed.statusCode).toBe(200);
    expect(renamed.json().increment).toBe("I4.34");
    expect(renamed.json().preset.id).toBe(firstId);
    expect(renamed.json().preset.name).toBe("Last snoozes");
    expect(renamed.json().preset.action).toBe("snooze");
    expect(renamed.json().preset).not.toHaveProperty("tenantId");
    expect(renamed.json().preset).not.toHaveProperty("createdByPrincipalId");
    expect(writes.some((row) => row.id === firstId && row.name === "Last snoozes")).toBe(true);

    const sameName = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${firstId}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Last snoozes" },
    });
    expect(sameName.statusCode).toBe(200);
    expect(sameName.json().preset.id).toBe(firstId);
    expect(sameName.json().preset.name).toBe("Last snoozes");

    const statusAfterRename = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(statusAfterRename.statusCode).toBe(200);
    expect(statusAfterRename.json().increment).toBe("I4.34");
    expect(statusAfterRename.json().presets.map((row: { name: string }) => row.name)).toEqual([
      "Acks only",
      "Last snoozes",
    ]);
    const writesAfterRename = writes.length;

    const exportedRenamed = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export?preset=Last%20snoozes",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exportedRenamed.statusCode).toBe(200);
    expect(exportedRenamed.json().preset.name).toBe("Last snoozes");
    expect(exportedRenamed.json().preset.id).toBe(firstId);

    const forbiddenDelete = await app.inject({
      method: "DELETE",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${secondId}`,
      headers: { authorization: `Bearer ${bob.json().accessToken}` },
    });
    expect(forbiddenDelete.statusCode).toBe(403);
    expect(forbiddenDelete.json().error).toBe("forbidden");
    expect(deleted).toEqual([]);

    const missingDelete = await app.inject({
      method: "DELETE",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets/00000000-0000-4000-8000-000000000000",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missingDelete.statusCode).toBe(404);
    expect(missingDelete.json().error).toBe("not_found");
    expect(missingDelete.json().reason).toBe("preset_not_found");
    expect(deleted).toEqual([]);

    const crossTenantDelete = await app.inject({
      method: "DELETE",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${PARTNER_PRESET_ID}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(crossTenantDelete.statusCode).toBe(404);
    expect(crossTenantDelete.json().error).toBe("not_found");
    expect(crossTenantDelete.json().reason).toBe("preset_not_found");
    expect(deleted).toEqual([]);
    expect(store.notifDlqSlaDigestStaleAuditExportPresets.some((row) => row.id === PARTNER_PRESET_ID)).toBe(true);

    const removed = await app.inject({
      method: "DELETE",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${secondId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(removed.statusCode).toBe(200);
    expect(removed.json().increment).toBe("I4.34");
    expect(removed.json().presets.map((row: { name: string }) => row.name)).toEqual(["Last snoozes"]);
    expect(deleted).toContain(secondId);

    const repeatDelete = await app.inject({
      method: "DELETE",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${secondId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(repeatDelete.statusCode).toBe(404);
    expect(repeatDelete.json().reason).toBe("preset_not_found");

    const statusAfterDelete = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(statusAfterDelete.json().presets).toHaveLength(1);
    expect(statusAfterDelete.json().presets[0].name).toBe("Last snoozes");
    expect(writes.length).toBe(writesAfterRename);
    expect(deleted).toEqual([secondId]);

    const exportedDeleted = await app.inject({
      method: "GET",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export?presetId=${secondId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exportedDeleted.statusCode).toBe(404);
    expect(exportedDeleted.json().reason).toBe("preset_not_found");

    await persistDeleteNotifDlqSlaDigestStaleAuditExportPreset(store.dbPool, firstId);
    expect(typeof deleteNotifDlqSlaDigestStaleAuditExportPreset).toBe("function");
  });

  it("does not report successful deletion unless persist-delete ran", async () => {
    const store = seedStore("i432-delete-persist", TEST_BOOTSTRAP_SECRETS);
    const deleted: string[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        if (String(sql).includes("DELETE FROM notif_dlq_sla_digest_stale_audit_export_preset")) {
          deleted.push(params![0] as string);
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const token = await loginCarol(app);
    const created = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "To delete" },
    });
    const id = created.json().preset.id as string;

    const missing = await app.inject({
      method: "DELETE",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets/00000000-0000-4000-8000-000000000099",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(missing.statusCode).toBe(404);
    expect(deleted).toEqual([]);

    const removed = await app.inject({
      method: "DELETE",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(removed.statusCode).toBe(200);
    expect(deleted).toEqual([id]);
  });

  it("does not report successful rename unless persist-rename ran", async () => {
    const store = seedStore("i432-rename-persist", TEST_BOOTSTRAP_SECRETS);
    const writes: string[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        if (String(sql).includes("INSERT INTO notif_dlq_sla_digest_stale_audit_export_preset (")) {
          writes.push(params![2] as string);
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const token = await loginCarol(app);
    const created = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Original" },
    });
    const id = created.json().preset.id as string;
    const writesAfterCreate = writes.length;

    const nameless = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${id}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "   " },
    });
    expect(nameless.statusCode).toBe(400);
    expect(writes.length).toBe(writesAfterCreate);

    const renamed = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/dlq-sla-digest-stale/export/presets/${id}/rename`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Persisted name" },
    });
    expect(renamed.statusCode).toBe(200);
    expect(writes[writes.length - 1]).toBe("Persisted name");
  });
});
