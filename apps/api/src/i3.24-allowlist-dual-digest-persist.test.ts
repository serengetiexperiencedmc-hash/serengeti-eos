import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import {
  upsertNotifAllowlistDualDigestLastRun,
  loadNotifAllowlistDualDigestLastRuns,
} from "./persistence/pg-repository.js";
import { persistNotifAllowlistDualDigestLastRun } from "./persistence/notifications.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { addEmailAllowlistEntry, noteAllowlistSesOverlap } from "./notifications/email-allowlist.js";
import { allPrincipals } from "./store.js";
import type { NotifAllowlistDualDigestLastRun } from "@sedmc/kernel";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.24 allowlist dual digest last-run persistence", () => {
  it("lists I3.24 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("059_i324_allowlist_dual_digest_last_run"))).toBe(true);
  });

  it("stamps lastRun on dispatch and dual-writes when pool present", async () => {
    const store = seedStore("i324-persist", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

    const writes: NotifAllowlistDualDigestLastRun[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        if (String(sql).includes("notif_allowlist_dual_digest_last_run") && String(sql).includes("INSERT")) {
          writes.push({
            tenantId: params![0] as string,
            day: params![1] as string,
            lastRunAt: params![2] as string,
            lastRunByPrincipalId: params![3] as string,
            pendingCount: params![4] as number,
            dispatchedCount: params![5] as number,
            skippedCount: params![6] as number,
            recipientCount: params![7] as number,
          });
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);

    const app = buildServer({ store });
    const token = await loginCarol(app);
    const res = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().increment).toBe("I3.29");
    expect(res.json().lastRun.pendingCount).toBe(1);
    expect(writes.length).toBeGreaterThanOrEqual(1);
    expect(writes[0]!.tenantId).toBe(carol.tenantId);

    await persistNotifAllowlistDualDigestLastRun(store.dbPool, writes[0]!);
    expect(typeof upsertNotifAllowlistDualDigestLastRun).toBe("function");
    expect(typeof loadNotifAllowlistDualDigestLastRuns).toBe("function");
  });
});
