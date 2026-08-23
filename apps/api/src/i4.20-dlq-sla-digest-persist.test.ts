import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { upsertNotifDlqSlaDigestLastRun, loadNotifDlqSlaDigestLastRuns } from "./persistence/pg-repository.js";
import { persistNotifDlqSlaDigestLastRun } from "./persistence/notifications.js";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { commitWithOutbox, publishPendingOutbox } from "./outbox.js";
import { allPrincipals } from "./store.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import type { NotifDlqSlaDigestLastRun } from "@sedmc/kernel";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I4.20 DLQ SLA digest last-run persistence", () => {
  it("lists I4.20 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("058_i420_dlq_sla_digest_last_run"))).toBe(true);
  });

  it("stamps lastRun on dispatch and dual-writes when pool present", async () => {
    const store = seedStore("i420-persist", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

    const writes: NotifDlqSlaDigestLastRun[] = [];
    store.dbPool = {
      query: async (sql: string, params?: unknown[]) => {
        if (String(sql).includes("notif_dlq_sla_digest_last_run") && String(sql).includes("INSERT")) {
          writes.push({
            tenantId: params![0] as string,
            day: params![1] as string,
            lastRunAt: params![2] as string,
            lastRunByPrincipalId: params![3] as string,
            breachedCount: params![4] as number,
            dispatchedCount: params![5] as number,
            skippedCount: params![6] as number,
            recipientCount: params![7] as number,
          });
        }
        return { rows: [], rowCount: 0 };
      },
    } as never;

    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i420-1",
      mutate: () => undefined,
    });
    const eventId = store.outboxEvents[0]!.envelope.eventId;
    const fail = new Set([eventId]);
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: fail });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: fail });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: fail });
    const dlq = store.deadLetters[0]!;
    dlq.firstFailureAt = new Date(Date.now() - 30 * 3_600_000).toISOString();
    dlq.lastFailureAt = dlq.firstFailureAt;

    const app = buildServer({ store });
    const token = await loginCarol(app);
    const res = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().increment).toBe("I4.34");
    expect(res.json().lastRun.breachedCount).toBe(1);
    expect(writes.length).toBeGreaterThanOrEqual(1);
    expect(writes[0]!.tenantId).toBe(carol.tenantId);

    // persist helper is a no-op without pool; with pool it should not throw
    await persistNotifDlqSlaDigestLastRun(store.dbPool, writes[0]!);
    expect(typeof upsertNotifDlqSlaDigestLastRun).toBe("function");
    expect(typeof loadNotifDlqSlaDigestLastRuns).toBe("function");
  });
});
