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

function seedBreachedDlq(store: ReturnType<typeof seedStore>) {
  const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
  commitWithOutbox(store, carol, {
    eventType: "platform.ping.v1",
    payload: { ping: true },
    classification: "Internal",
    correlationId: "i417-1",
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
}

describe("I4.17 DLQ SLA digest recipients", () => {
  it("fans out digest to caller plus store alias and dedupes per recipient", async () => {
    const store = seedStore("i417-fanout", TEST_BOOTSTRAP_SECRETS);
    seedBreachedDlq(store);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const added = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-recipients",
      headers: { authorization: `Bearer ${token}` },
      payload: { email: "ops@example.com", note: "ops alias" },
    });
    expect(added.statusCode).toBe(201);
    expect(added.json().increment).toBe("I4.20");

    const first = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(first.statusCode).toBe(200);
    expect(first.json().increment).toBe("I4.30");
    expect(first.json().recipientCount).toBe(2);
    expect(first.json().dispatched).toHaveLength(2);
    expect(first.json().dispatched.every((k: string) => /^dlq-sla-digest:\d{4}-\d{2}-\d{2}:/.test(k))).toBe(true);

    const second = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(second.json().dispatched).toHaveLength(0);
    expect(second.json().skipped.every((s: { reason?: string }) => s.reason === "already_dispatched")).toBe(true);
  });

  it("merges env recipients", async () => {
    const prev = process.env.EOS_DLQ_SLA_DIGEST_RECIPIENTS;
    process.env.EOS_DLQ_SLA_DIGEST_RECIPIENTS = "oncall@sedmc.local";
    try {
      const store = seedStore("i417-env", TEST_BOOTSTRAP_SECRETS);
      seedBreachedDlq(store);
      const app = buildServer({ store });
      const token = await loginCarol(app);
      const listed = await app.inject({
        method: "GET",
        url: "/v1/notifications/email/dlq-sla-digest-recipients",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.json().items.some((i: { email: string }) => i.email === "oncall@sedmc.local")).toBe(true);

      const dispatched = await app.inject({
        method: "POST",
        url: "/v1/notifications/email/dispatch-dlq-sla-digest",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(dispatched.json().dispatched.some((k: string) => k.endsWith(":oncall@sedmc.local"))).toBe(true);
    } finally {
      if (prev === undefined) delete process.env.EOS_DLQ_SLA_DIGEST_RECIPIENTS;
      else process.env.EOS_DLQ_SLA_DIGEST_RECIPIENTS = prev;
    }
  });
});
