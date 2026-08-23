import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import {
  insertNotifAllowlistDualDigestStaleSuppressionAudit,
  loadNotifAllowlistDualDigestStaleSuppressionAudits,
} from "./persistence/pg-repository.js";
import {
  hydrateNotifAllowlistDualDigestStaleSuppressionAudits,
  persistNotifAllowlistDualDigestStaleSuppressionAudit,
} from "./persistence/notifications.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { addEmailAllowlistEntry, noteAllowlistSesOverlap } from "./notifications/email-allowlist.js";
import { allPrincipals } from "./store.js";
import type { NotifAllowlistDualDigestStaleSuppressionAudit } from "@sedmc/kernel";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.30 stale allowlist dual digest suppression audit persistence", () => {
  it("lists I3.30 migration", () => {
    expect(
      listMigrationFiles().some((f) => f.includes("071_i330_allowlist_dual_digest_stale_suppression_audit")),
    ).toBe(true);
  });

  it("dual-writes snooze/ack/clear audit and hydrates", async () => {
    const store = seedStore("i330-persist", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);

    const writes: NotifAllowlistDualDigestStaleSuppressionAudit[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("INSERT INTO notif_allowlist_dual_digest_stale_suppression_audit")) {
          writes.push({
            id: params![0] as string,
            tenantId: params![1] as string,
            action: params![2] as NotifAllowlistDualDigestStaleSuppressionAudit["action"],
            ...(params![3] ? { snoozedUntil: params![3] as string } : {}),
            ...(params![4] ? { acknowledgedAt: params![4] as string } : {}),
            createdAt: params![5] as string,
            createdByPrincipalId: params![6] as string,
          });
        }
        if (text.includes("FROM notif_allowlist_dual_digest_stale_suppression_audit") && !text.includes("INSERT")) {
          return {
            rows: writes.map((row) => ({
              id: row.id,
              tenant_id: row.tenantId,
              action: row.action,
              snoozed_until: row.snoozedUntil ?? null,
              acknowledged_at: row.acknowledgedAt ?? null,
              created_at: row.createdAt,
              created_by_principal_id: row.createdByPrincipalId,
            })),
            rowCount: writes.length,
          };
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const snoozed = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I3.31");
    expect(writes.some((row) => row.action === "snooze")).toBe(true);

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/ack",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(writes.some((row) => row.action === "ack")).toBe(true);

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(writes.some((row) => row.action === "cleared")).toBe(true);

    const emptyStore = seedStore("i330-hydrate", TEST_BOOTSTRAP_SECRETS);
    const merged = await hydrateNotifAllowlistDualDigestStaleSuppressionAudits(store.dbPool!, emptyStore);
    expect(merged).toBeGreaterThanOrEqual(3);
    expect(emptyStore.notifAllowlistDualDigestStaleSuppressionAudits.map((a) => a.action)).toEqual(
      expect.arrayContaining(["snooze", "ack", "cleared"]),
    );
    await persistNotifAllowlistDualDigestStaleSuppressionAudit(store.dbPool, writes[0]!);
    expect(typeof insertNotifAllowlistDualDigestStaleSuppressionAudit).toBe("function");
    expect(typeof loadNotifAllowlistDualDigestStaleSuppressionAudits).toBe("function");
  });
});
