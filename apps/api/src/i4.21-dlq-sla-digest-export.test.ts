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

describe("I4.21 DLQ SLA digest last-run export", () => {
  it("exports lastRun as JSON and CSV after dispatch", async () => {
    const store = seedStore("i421-export", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i421-1",
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

    const dispatched = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(dispatched.statusCode).toBe(200);
    expect(dispatched.json().increment).toBe("I4.34");
    expect(dispatched.json().lastRun.breachedCount).toBe(1);

    const json = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status/export",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(json.statusCode).toBe(200);
    expect(json.json().increment).toBe("I4.34");
    expect(json.json().format).toBe("json");
    expect(json.json().lastRun.breachedCount).toBe(1);
    expect(json.json().row.outboxDigestCount).toBeGreaterThanOrEqual(1);

    const csv = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status/export?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(csv.json().format).toBe("csv");
    expect(csv.json().csv).toContain("breachedCount");
    expect(csv.json().csv).toContain(",1,");

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().dlqSlaDigestLastRun.breachedCount).toBe(1);
  });
});
