import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import type { NotifDlqSlaDigestStaleAuditExportPreset } from "@sedmc/kernel";
import {
  loadNotifDlqSlaDigestStaleAuditExportPresets,
  upsertNotifDlqSlaDigestStaleAuditExportPreset,
} from "./persistence/pg-repository.js";
import {
  hydrateNotifDlqSlaDigestStaleAuditExportPresets,
  persistNotifDlqSlaDigestStaleAuditExportPreset,
} from "./persistence/notifications.js";
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

describe("I4.31 persist named stale DLQ audit export presets", () => {
  it("lists I4.31 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("075_i431_dlq_sla_digest_stale_audit_export_preset"))).toBe(true);
  });

  it("dual-writes presets on save and hydrates", async () => {
    const store = seedStore("i431-persist", TEST_BOOTSTRAP_SECRETS);
    const writes: NotifDlqSlaDigestStaleAuditExportPreset[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO notif_dlq_sla_digest_stale_audit_export_preset")) {
          writes.push({
            id: params![0] as string,
            tenantId: params![1] as string,
            name: params![2] as string,
            ...(params![3] ? { action: params![3] as NotifDlqSlaDigestStaleAuditExportPreset["action"] } : {}),
            ...(params![4] ? { since: params![4] as string } : {}),
            ...(params![5] ? { until: params![5] as string } : {}),
            createdAt: params![6] as string,
            createdByPrincipalId: params![7] as string,
            updatedAt: params![8] as string,
          });
        }
        if (text.includes("FROM notif_dlq_sla_digest_stale_audit_export_preset") && !text.includes("INSERT")) {
          return {
            rows: writes.map((row) => ({
              id: row.id,
              tenant_id: row.tenantId,
              name: row.name,
              action: row.action ?? null,
              since_text: row.since ?? null,
              until_text: row.until ?? null,
              created_at: row.createdAt,
              created_by_principal_id: row.createdByPrincipalId,
              updated_at: row.updatedAt,
            })),
            rowCount: writes.length,
          };
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const empty = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(empty.json().increment).toBe("I4.31");
    expect(empty.json().presets).toEqual([]);
    expect(writes.length).toBe(0);

    const bad = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "   " },
    });
    expect(bad.statusCode).toBe(400);
    expect(writes.length).toBe(0);

    const saved = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export/presets",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Snoozes only", action: "snooze" },
    });
    expect(saved.statusCode).toBe(200);
    expect(saved.json().increment).toBe("I4.31");
    expect(saved.json().preset.name).toBe("Snoozes only");
    expect(saved.json().preset).not.toHaveProperty("tenantId");
    expect(writes.length).toBeGreaterThanOrEqual(1);

    const after = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().presets[0].name).toBe("Snoozes only");
    expect(writes.length).toBeGreaterThanOrEqual(1);

    const emptyStore = seedStore("i431-hydrate", TEST_BOOTSTRAP_SECRETS);
    const merged = await hydrateNotifDlqSlaDigestStaleAuditExportPresets(store.dbPool!, emptyStore);
    expect(merged).toBe(1);
    expect(emptyStore.notifDlqSlaDigestStaleAuditExportPresets[0]!.name).toBe("Snoozes only");
    await persistNotifDlqSlaDigestStaleAuditExportPreset(store.dbPool, writes[0]!);
    expect(typeof upsertNotifDlqSlaDigestStaleAuditExportPreset).toBe("function");
    expect(typeof loadNotifDlqSlaDigestStaleAuditExportPresets).toBe("function");
  });
});
