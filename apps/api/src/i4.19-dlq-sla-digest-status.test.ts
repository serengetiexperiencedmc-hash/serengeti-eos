import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { commitWithOutbox, publishPendingOutbox } from "./outbox.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I4.19 DLQ SLA digest last-run status", () => {
  it("stamps lastRun on dispatch and exposes status analytics", async () => {
    const store = seedStore("i419-status", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i419-1",
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

    const before = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(before.statusCode).toBe(200);
    expect(before.json().increment).toBe("I4.31");
    expect(before.json().lastRun).toBeNull();

    const dispatched = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(dispatched.statusCode).toBe(200);
    expect(dispatched.json().increment).toBe("I4.31");
    expect(dispatched.json().lastRun.breachedCount).toBe(1);
    expect(dispatched.json().lastRun.dispatchedCount).toBeGreaterThanOrEqual(1);

    const status = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(status.json().lastRun.breachedCount).toBe(1);
    expect(status.json().analytics.outboxDigestCount).toBeGreaterThanOrEqual(1);
  });
});
