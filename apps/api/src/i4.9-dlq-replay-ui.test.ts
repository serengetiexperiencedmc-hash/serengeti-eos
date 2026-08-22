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

describe("I4.9 DLQ and replay Commercial API", () => {
  it("lists DLQ and executes replay via HTTP", async () => {
    const store = seedStore("i49-dlq", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i49-1",
      mutate: () => undefined,
    });
    const eventId = store.outboxEvents[0]!.envelope.eventId;
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([eventId]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([eventId]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([eventId]) });
    expect(store.deadLetters.length).toBeGreaterThan(0);

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/events/dlq",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().increment).toBe("I4.14");
    expect(listed.json().items.length).toBeGreaterThan(0);
    const dlqId = listed.json().items[0].id as string;

    const requested = await app.inject({
      method: "POST",
      url: "/v1/events/replay/request",
      headers: { authorization: `Bearer ${token}` },
      payload: {
        reason: "I4.9 test replay",
        intent: "reexecute",
        deadLetterIds: [dlqId],
      },
    });
    expect(requested.statusCode).toBe(200);
    expect(requested.json().increment).toBe("I4.14");
    const requestId = requested.json().id as string;

    const executed = await app.inject({
      method: "POST",
      url: `/v1/events/replay/${requestId}/execute`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(executed.statusCode).toBe(200);
    expect(executed.json().replayed).toBe(1);
    expect(executed.json().increment).toBe("I4.14");
    expect(store.outboxEvents.find((o) => o.envelope.eventId === eventId)?.status).toBe("pending");
  });
});


