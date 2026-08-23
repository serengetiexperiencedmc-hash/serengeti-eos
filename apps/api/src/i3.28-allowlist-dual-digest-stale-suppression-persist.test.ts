import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import {
  upsertNotifAllowlistDualDigestStaleSuppression,
  loadNotifAllowlistDualDigestStaleSuppressions,
  deleteNotifAllowlistDualDigestStaleSuppression,
} from "./persistence/pg-repository.js";
import { persistNotifAllowlistDualDigestStaleSuppression } from "./persistence/notifications.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { addEmailAllowlistEntry, noteAllowlistSesOverlap } from "./notifications/email-allowlist.js";
import { allPrincipals } from "./store.js";
import type { NotifAllowlistDualDigestStaleSuppression } from "@sedmc/kernel";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.28 stale allowlist dual digest suppression persistence", () => {
  it("lists I3.28 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("062_i328_allowlist_dual_digest_stale_suppression"))).toBe(true);
  });

  it("dual-writes snooze and deletes the row when the digest restamps", async () => {
    const store = seedStore("i328-persist", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);

    const writes: NotifAllowlistDualDigestStaleSuppression[] = [];
    const deletes: string[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("notif_allowlist_dual_digest_stale_suppression") && text.includes("INSERT")) {
          writes.push({
            tenantId: params![0] as string,
            ...(params![1] ? { acknowledgedAt: params![1] as string } : {}),
            ...(params![2] ? { snoozedUntil: params![2] as string } : {}),
            updatedAt: params![3] as string,
            updatedByPrincipalId: params![4] as string,
          });
        }
        if (text.includes("DELETE FROM notif_allowlist_dual_digest_stale_suppression")) {
          deletes.push(params![0] as string);
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
    expect(snoozed.json().increment).toBe("I3.32");
    expect(writes.length).toBeGreaterThanOrEqual(1);
    expect(writes[0]!.snoozedUntil).toBeTruthy();

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(deletes.length).toBeGreaterThanOrEqual(1);

    await persistNotifAllowlistDualDigestStaleSuppression(store.dbPool, writes[0]!);
    expect(typeof upsertNotifAllowlistDualDigestStaleSuppression).toBe("function");
    expect(typeof loadNotifAllowlistDualDigestStaleSuppressions).toBe("function");
    expect(typeof deleteNotifAllowlistDualDigestStaleSuppression).toBe("function");
  });
});
