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

describe("I4.13 DLQ SLA age filters", () => {
  it("reports ageHours, sla summary, and slaBreached filter", async () => {
    const store = seedStore("i413-sla", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i413-1",
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

    const listed = await app.inject({
      method: "GET",
      url: "/v1/events/dlq",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().increment).toBe("I4.13");
    expect(listed.json().sla.thresholdHours).toBe(24);
    expect(listed.json().sla.breachedCount).toBeGreaterThanOrEqual(1);
    expect(listed.json().items[0].ageHours).toBeGreaterThanOrEqual(24);
    expect(listed.json().items[0].slaBreached).toBe(true);

    const breached = await app.inject({
      method: "GET",
      url: "/v1/events/dlq?slaBreached=1&slaHours=24",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(breached.json().items.every((d: { slaBreached: boolean }) => d.slaBreached)).toBe(true);

    const young = await app.inject({
      method: "GET",
      url: "/v1/events/dlq?minAgeHours=1000",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(young.json().items).toHaveLength(0);
  });
});
