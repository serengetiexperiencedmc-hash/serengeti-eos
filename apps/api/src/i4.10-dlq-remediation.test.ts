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

describe("I4.10 DLQ remediation statuses", () => {
  it("advances DLQ lifecycle via PATCH and banners I4.10", async () => {
    const store = seedStore("i410-dlq", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i410-1",
      mutate: () => undefined,
    });
    const eventId = store.outboxEvents[0]!.envelope.eventId;
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([eventId]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([eventId]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([eventId]) });
    const dlqId = store.deadLetters[0]!.id;

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/events/dlq",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.json().increment).toBe("I4.13");

    const investigating = await app.inject({
      method: "PATCH",
      url: `/v1/events/dlq/${dlqId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: "investigating", remediation: "Checking transport" },
    });
    expect(investigating.statusCode).toBe(200);
    expect(investigating.json().increment).toBe("I4.13");
    expect(investigating.json().deadLetter.status).toBe("investigating");

    const bad = await app.inject({
      method: "PATCH",
      url: `/v1/events/dlq/${dlqId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: "resolved" },
    });
    expect(bad.statusCode).toBe(400);

    const corrected = await app.inject({
      method: "PATCH",
      url: `/v1/events/dlq/${dlqId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { status: "corrected" },
    });
    expect(corrected.statusCode).toBe(200);
    expect(store.deadLetters.find((d) => d.id === dlqId)?.status).toBe("corrected");
  });
});


