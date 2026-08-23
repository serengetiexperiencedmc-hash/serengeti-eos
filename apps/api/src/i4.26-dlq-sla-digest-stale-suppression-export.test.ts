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

describe("I4.26 stale DLQ SLA digest suppression export / audit", () => {
  it("records snooze/ack/clear audit and exports CSV", async () => {
    const store = seedStore("i426-export", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);

    const snoozed = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I4.32");

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dlq-sla-digest-stale/ack",
      headers: { authorization: `Bearer ${token}` },
    });

    const json = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(json.statusCode).toBe(200);
    expect(json.json().increment).toBe("I4.32");
    expect(json.json().count).toBeGreaterThanOrEqual(2);
    expect(json.json().audits.map((a: { action: string }) => a.action)).toEqual(
      expect.arrayContaining(["snooze", "ack"]),
    );

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-dlq-sla-digest",
      headers: { authorization: `Bearer ${token}` },
    });

    const csv = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/dlq-sla-digest-stale/export?format=csv",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(csv.json().format).toBe("csv");
    expect(csv.json().csv).toContain("action,snoozedUntil,acknowledgedAt,createdAt,createdByPrincipalId");
    expect(csv.json().csv).toContain("snooze");
    expect(csv.json().csv).toContain("ack");
    expect(csv.json().csv).toContain("cleared");
    expect(csv.json().suppression).toBeNull();
  });
});
