import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import type { NotifDlqSlaDigestStaleAuditExportLastFilter } from "@sedmc/kernel";
import {
  loadNotifDlqSlaDigestStaleAuditExportLastFilters,
  upsertNotifDlqSlaDigestStaleAuditExportLastFilter,
} from "./persistence/pg-repository.js";
import {
  hydrateNotifDlqSlaDigestStaleAuditExportLastFilters,
  persistNotifDlqSlaDigestStaleAuditExportLastFilter,
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

describe("I4.29 last-used stale DLQ audit export filter", () => {
  it("lists I4.29 migration", () => {
    expect(
      listMigrationFiles().some((f) => f.includes("073_i429_dlq_sla_digest_stale_audit_export_last_filter")),
    ).toBe(true);
  });

  it("dual-writes last-used filter on export and hydrates", async () => {
    const store = seedStore("i429-persist", TEST_BOOTSTRAP_SECRETS);
    const writes: NotifDlqSlaDigestStaleAuditExportLastFilter[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO notif_dlq_sla_digest_stale_audit_export_last_filter")) {
          writes.push({
            tenantId: params![0] as string,
            principalId: params![1] as string,
            ...(params![2] ? { action: params![2] as NotifDlqSlaDigestStaleAuditExportLastFilter["action"] } : {}),
            ...(params![3] ? { since: params![3] as string } : {}),
            ...(params![4] ? { until: params![4] as string } : {}),
            updatedAt: params![5] as string,
          });
        }
        if (text.includes("FROM notif_dlq_sla_digest_stale_audit_export_last_filter") && !text.includes("INSERT")) {
          const row = writes[writes.length - 1];
          return {
            rows: row
              ? [
                  {
                    tenant_id: row.tenantId,
                    principal_id: row.principalId,
                    action: row.action ?? null,
                    since_text: row.since ?? null,
                    until_text: row.until ?? null,
                    updated_at: row.updatedAt,
                  },
                ]
              : [],
            rowCount: row ? 1 : 0,
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
    expect(empty.json().increment).toBe("I4.30");
    expect(empty.json().lastFilter).toBeNull();
    expect(writes.length).toBe(0);

    const bad = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export?action=merge",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(bad.statusCode).toBe(400);
    expect(writes.length).toBe(0);

    const exported = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export?action=snooze&since=2026-08-23T00:00:00.000Z",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I4.30");
    expect(exported.json().lastFilter.action).toBe("snooze");
    expect(exported.json().lastFilter.since).toBe("2026-08-23T00:00:00.000Z");
    expect(exported.json().lastFilter).not.toHaveProperty("tenantId");
    expect(writes.length).toBeGreaterThanOrEqual(1);

    const after = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().lastFilter.action).toBe("snooze");
    expect(writes.length).toBe(1);

    const emptyStore = seedStore("i429-hydrate", TEST_BOOTSTRAP_SECRETS);
    const merged = await hydrateNotifDlqSlaDigestStaleAuditExportLastFilters(store.dbPool!, emptyStore);
    expect(merged).toBe(1);
    expect(emptyStore.notifDlqSlaDigestStaleAuditExportLastFilters[0]!.action).toBe("snooze");
    await persistNotifDlqSlaDigestStaleAuditExportLastFilter(store.dbPool, writes[0]!);
    expect(typeof upsertNotifDlqSlaDigestStaleAuditExportLastFilter).toBe("function");
    expect(typeof loadNotifDlqSlaDigestStaleAuditExportLastFilters).toBe("function");
  });
});
