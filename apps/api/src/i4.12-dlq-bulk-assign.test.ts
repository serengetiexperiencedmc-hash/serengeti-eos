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

describe("I4.12 DLQ bulk owner assign", () => {
  it("assigns owner to many DLQ rows", async () => {
    const store = seedStore("i412-bulk", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

    const eventIds: string[] = [];
    for (const corr of ["i412-a", "i412-b"]) {
      commitWithOutbox(store, carol, {
        eventType: "platform.ping.v1",
        payload: { ping: true, corr },
        classification: "Internal",
        correlationId: corr,
        mutate: () => undefined,
      });
      eventIds.push(store.outboxEvents[store.outboxEvents.length - 1]!.envelope.eventId);
    }

    const fail = new Set(eventIds);
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: fail });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: fail });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: fail });
    expect(store.deadLetters.length).toBeGreaterThanOrEqual(2);
    const ids = store.deadLetters.map((d) => d.id).slice(0, 2);

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const bulk = await app.inject({
      method: "POST",
      url: "/v1/events/dlq/assign",
      headers: { authorization: `Bearer ${token}` },
      payload: { ids, owner: "night-ops" },
    });
    expect(bulk.statusCode).toBe(200);
    expect(bulk.json().increment).toBe("I4.14");
    expect(bulk.json().updated).toBe(2);
    expect(store.deadLetters.filter((d) => d.owner === "night-ops").length).toBeGreaterThanOrEqual(2);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/events/dlq?owner=night-ops",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.json().increment).toBe("I4.14");
    expect(listed.json().items.length).toBeGreaterThanOrEqual(2);
  });
});

