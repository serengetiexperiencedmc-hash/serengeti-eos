import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { addEmailAllowlistEntry, noteAllowlistSesOverlap } from "./notifications/email-allowlist.js";
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

describe("I3.29 stale allowlist dual digest suppression export / audit", () => {
  it("records snooze/ack/clear audit and exports CSV", async () => {
    const store = seedStore("i329-export", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const snoozed = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/snooze",
      headers: { authorization: `Bearer ${token}` },
      payload: { hours: 24 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I3.36");

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/ack",
      headers: { authorization: `Bearer ${token}` },
    });

    const json = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(json.statusCode).toBe(200);
    expect(json.json().increment).toBe("I3.36");
    expect(json.json().count).toBeGreaterThanOrEqual(2);
    expect(json.json().audits.map((a: { action: string }) => a.action)).toEqual(
      expect.arrayContaining(["snooze", "ack"]),
    );

    await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });

    const csv = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-stale/export?format=csv",
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
