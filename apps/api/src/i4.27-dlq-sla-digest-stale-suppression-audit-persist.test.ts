import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import {
  insertNotifDlqSlaDigestStaleSuppressionAudit,
  loadNotifDlqSlaDigestStaleSuppressionAudits,
} from "./persistence/pg-repository.js";
import { persistNotifDlqSlaDigestStaleSuppressionAudit } from "./persistence/notifications.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import type { NotifDlqSlaDigestStaleSuppressionAudit } from "@sedmc/kernel";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I4.27 stale DLQ SLA digest suppression audit persistence", () => {
  it("lists I4.27 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("063_i427_dlq_sla_digest_stale_suppression_audit"))).toBe(true);
  });

  it("dual-writes snooze audit rows", async () => {
    const store = seedStore("i427-persist", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const writes: NotifDlqSlaDigestStaleSuppressionAudit[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        const text = String(sql);
        if (text.includes("notif_dlq_sla_digest_stale_suppression_audit") && text.includes("INSERT")) {
          writes.push({
            id: params![0] as string,
            tenantId: params![1] as string,
            action: params![2] as NotifDlqSlaDigestStaleSuppressionAudit["action"],
            ...(params![3] ? { snoozedUntil: params![3] as string } : {}),
            ...(params![4] ? { acknowledgedAt: params![4] as string } : {}),
            createdAt: params![5] as string,
            createdByPrincipalId: params![6] as string,
          });
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const snoozed = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I4.27");
    expect(writes.length).toBeGreaterThanOrEqual(1);
    expect(writes[0]!.action).toBe("snooze");
    expect(writes[0]!.snoozedUntil).toBeTruthy();

    await persistNotifDlqSlaDigestStaleSuppressionAudit(store.dbPool, writes[0]!);
    expect(typeof insertNotifDlqSlaDigestStaleSuppressionAudit).toBe("function");
    expect(typeof loadNotifDlqSlaDigestStaleSuppressionAudits).toBe("function");
  });
});
