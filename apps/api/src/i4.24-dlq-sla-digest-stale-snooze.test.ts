import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I4.24 stale DLQ SLA digest snooze / ack", () => {
  it("hides inbox after snooze or ack and skips stale email until digest restamps", async () => {
    const store = seedStore("i424-snooze", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const day = new Date().toISOString().slice(0, 10);

    const snoozed = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I4.31");
    expect(snoozed.json().suppression.snoozedUntil).toBeTruthy();

    const inbox = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(inbox.json().items.some((i: { key: string }) => i.key === `dlq-sla-digest-stale:${day}`)).toBe(false);

    const alerted = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest-stale",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(alerted.json().skipped[0].reason).toBe("snoozed");

    const acked = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/ack",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(acked.json().suppression.acknowledgedAt).toBeTruthy();

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });

    const status = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(status.json().increment).toBe("I4.31");
    expect(status.json().freshness.stale).toBe(false);
    expect(status.json().suppression).toBeNull();
  });
});
