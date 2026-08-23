import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { commitWithOutbox, publishPendingOutbox } from "./outbox.js";
import { allPrincipals } from "./store.js";
import { digestLastRunFreshness } from "./notifications/digest-freshness.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I4.22 DLQ SLA digest last-run freshness", () => {
  it("treats never-run as stale and clears after dispatch", async () => {
    const store = seedStore("i422-fresh", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i422-1",
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
    expect(before.json().increment).toBe("I4.22");
    expect(before.json().freshness.neverRun).toBe(true);
    expect(before.json().freshness.stale).toBe(true);

    const dispatched = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(dispatched.json().increment).toBe("I4.22");

    const after = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().freshness.neverRun).toBe(false);
    expect(after.json().freshness.stale).toBe(false);
    expect(after.json().freshness.ageHours).toBeLessThan(1);

    const exported = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status/export?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.json().increment).toBe("I4.22");
    expect(exported.json().freshness.stale).toBe(false);
    expect(exported.json().csv).toContain("stale,neverRun,ageHours,thresholdHours");

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().dlqSlaDigestFreshness.stale).toBe(false);
  });

  it("marks a last-run older than the threshold as stale", () => {
    const old = new Date(Date.now() - 40 * 3_600_000).toISOString();
    const freshness = digestLastRunFreshness(old);
    expect(freshness.neverRun).toBe(false);
    expect(freshness.stale).toBe(true);
    expect(freshness.ageHours).toBeGreaterThanOrEqual(26);
  });
});
