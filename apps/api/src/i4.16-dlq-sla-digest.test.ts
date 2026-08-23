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

describe("I4.16 DLQ SLA escalation digest email", () => {
  it("dispatches a daily digest and skips redispatch", async () => {
    const store = seedStore("i416-digest", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i416-1",
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

    const first = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(first.statusCode).toBe(200);
    expect(first.json().increment).toBe("I4.32");
    expect(first.json().breachedCount).toBe(1);
    expect(first.json().dispatched[0]).toMatch(/^dlq-sla-digest:\d{4}-\d{2}-\d{2}:/);

    const second = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(second.statusCode).toBe(200);
    expect(second.json().dispatched).toHaveLength(0);
    expect(second.json().skipped[0].reason).toBe("already_dispatched");
  });

  it("skips when no SLA breaches", async () => {
    const store = seedStore("i416-none", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const res = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().skipped[0].reason).toBe("none_breached");
  });
});
