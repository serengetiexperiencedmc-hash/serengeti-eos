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

describe("I3.23 allowlist dual digest last-run status", () => {
  it("stamps lastRun on dispatch and exposes status analytics", async () => {
    const store = seedStore("i323-status", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const before = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(before.statusCode).toBe(200);
    expect(before.json().increment).toBe("I3.24");
    expect(before.json().lastRun).toBeNull();

    const dispatched = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(dispatched.statusCode).toBe(200);
    expect(dispatched.json().increment).toBe("I3.24");
    expect(dispatched.json().lastRun.pendingCount).toBe(1);
    expect(dispatched.json().lastRun.dispatchedCount).toBeGreaterThanOrEqual(1);

    const status = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(status.json().lastRun.pendingCount).toBe(1);
    expect(status.json().analytics.outboxDigestCount).toBeGreaterThanOrEqual(1);

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().allowlistDualDigestLastRun.pendingCount).toBe(1);
  });

  it("stamps lastRun when none pending", async () => {
    const store = seedStore("i323-none", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const res = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().skipped[0].reason).toBe("none_pending");
    expect(res.json().lastRun.pendingCount).toBe(0);
    expect(res.json().lastRun.skippedCount).toBe(1);
  });
});
