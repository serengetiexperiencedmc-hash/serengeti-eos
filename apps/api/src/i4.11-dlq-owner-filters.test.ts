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

describe("I4.11 DLQ owner assignment and filters", () => {
  it("assigns owner and filters DLQ list", async () => {
    const store = seedStore("i411-dlq", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i411-1",
      mutate: () => undefined,
    });
    const eventId = store.outboxEvents[0]!.envelope.eventId;
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([eventId]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([eventId]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([eventId]) });
    const dlqId = store.deadLetters[0]!.id;

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const assigned = await app.inject({
      method: "PATCH",
      url: `/v1/events/dlq/${dlqId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { owner: "ops-oncall" },
    });
    expect(assigned.statusCode).toBe(200);
    expect(assigned.json().increment).toBe("I4.13");
    expect(assigned.json().deadLetter.owner).toBe("ops-oncall");

    const byOwner = await app.inject({
      method: "GET",
      url: "/v1/events/dlq?owner=ops-oncall",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(byOwner.statusCode).toBe(200);
    expect(byOwner.json().increment).toBe("I4.13");
    expect(byOwner.json().items).toHaveLength(1);
    expect(byOwner.json().owners).toContain("ops-oncall");

    const unassigned = await app.inject({
      method: "GET",
      url: "/v1/events/dlq?unassigned=1",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(unassigned.json().items).toHaveLength(0);

    const cleared = await app.inject({
      method: "PATCH",
      url: `/v1/events/dlq/${dlqId}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { owner: null },
    });
    expect(cleared.statusCode).toBe(200);
    expect(cleared.json().deadLetter.owner).toBeUndefined();
  });
});


