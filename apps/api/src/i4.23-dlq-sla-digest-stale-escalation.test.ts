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

describe("I4.23 stale DLQ SLA digest inbox / email escalation", () => {
  it("emits inbox item and emails when last-run is never-run, then skips after digest", async () => {
    const store = seedStore("i423-stale", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const day = new Date().toISOString().slice(0, 10);

    const inbox = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(inbox.statusCode).toBe(200);
    const items = inbox.json().items as Array<{ key: string; title: string; severity: string }>;
    const stale = items.find((i) => i.key === `dlq-sla-digest-stale:${day}`);
    expect(stale).toBeTruthy();
    expect(stale!.title).toBe("DLQ SLA digest never run");
    expect(stale!.severity).toBe("urgent");

    const alerted = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest-stale",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(alerted.statusCode).toBe(200);
    expect(alerted.json().increment).toBe("I4.28");
    expect(alerted.json().freshness.neverRun).toBe(true);
    expect(alerted.json().dispatched[0]).toMatch(/^dlq-sla-digest-stale:\d{4}-\d{2}-\d{2}:/);

    const again = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest-stale",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(again.json().dispatched).toHaveLength(0);
    expect(again.json().skipped[0].reason).toBe("already_dispatched");

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });

    const after = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest-stale",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().skipped[0].reason).toBe("not_stale");

    const inboxAfter = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${token}` },
    });
    const afterItems = inboxAfter.json().items as Array<{ key: string }>;
    expect(afterItems.some((i) => i.key === `dlq-sla-digest-stale:${day}`)).toBe(false);
  });
});
