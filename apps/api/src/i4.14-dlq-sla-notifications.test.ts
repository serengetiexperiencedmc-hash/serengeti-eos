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

describe("I4.15 DLQ SLA escalation notifications", () => {
  it("emits urgent inbox item for open DLQ past SLA and banners I4.15", async () => {
    const store = seedStore("i414-sla-notif", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i414-1",
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
    expect(listed.json().increment).toBe("I4.15");
    expect(listed.json().items[0].slaBreached).toBe(true);

    const inbox = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(inbox.statusCode).toBe(200);
    const items = inbox.json().items as Array<{ key: string; title: string; href: string; severity: string }>;
    const escalation = items.find((i) => i.key === `dlq-sla:${dlq.id}`);
    expect(escalation).toBeTruthy();
    expect(escalation!.title).toBe("DLQ SLA breached");
    expect(escalation!.severity).toBe("urgent");
    expect(escalation!.href).toBe("/commercial/events");
  });
});
