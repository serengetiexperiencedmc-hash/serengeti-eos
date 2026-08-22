import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
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

describe("I4.15 DLQ SLA acknowledge / snooze", () => {
  it("lists I4.15 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("056_i415_dlq_sla_snooze"))).toBe(true);
  });

  it("suppresses escalation via snooze and acknowledge", async () => {
    const store = seedStore("i415-sla", TEST_BOOTSTRAP_SECRETS);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i415-1",
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

    const inboxBefore = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(
      (inboxBefore.json().items as Array<{ key: string }>).some((i) => i.key === `dlq-sla:${dlq.id}`),
    ).toBe(true);

    const snoozed = await app.inject({
      method: "POST",
      url: `/v1/events/dlq/${dlq.id}/sla-snooze`,
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 48 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I4.15");
    expect(snoozed.json().deadLetter.slaSnoozeUntil).toBeTruthy();

    const breached = await app.inject({
      method: "GET",
      url: "/v1/events/dlq?slaBreached=1",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(breached.json().items).toHaveLength(0);
    expect(breached.json().increment).toBe("I4.15");

    const inboxSnoozed = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(
      (inboxSnoozed.json().items as Array<{ key: string }>).some((i) => i.key === `dlq-sla:${dlq.id}`),
    ).toBe(false);

    dlq.slaSnoozeUntil = new Date(Date.now() - 60_000).toISOString();
    const inboxAgain = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(
      (inboxAgain.json().items as Array<{ key: string }>).some((i) => i.key === `dlq-sla:${dlq.id}`),
    ).toBe(true);

    const acked = await app.inject({
      method: "POST",
      url: `/v1/events/dlq/${dlq.id}/sla-acknowledge`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(acked.statusCode).toBe(200);
    expect(acked.json().deadLetter.slaAcknowledgedAt).toBeTruthy();

    const inboxAcked = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(
      (inboxAcked.json().items as Array<{ key: string }>).some((i) => i.key === `dlq-sla:${dlq.id}`),
    ).toBe(false);
  });
});
