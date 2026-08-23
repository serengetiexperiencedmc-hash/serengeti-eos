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

describe("I3.21 allowlist dual-control digest email", () => {
  it("dispatches a daily digest for pending dual-control and skips redispatch", async () => {
    const store = seedStore("i321-dual-digest", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const first = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(first.statusCode).toBe(200);
    expect(first.json().increment).toBe("I3.37");
    expect(first.json().pendingCount).toBe(1);
    expect(first.json().dispatched[0]).toMatch(/^allowlist-dual-digest:\d{4}-\d{2}-\d{2}:/);

    const second = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(second.statusCode).toBe(200);
    expect(second.json().dispatched).toHaveLength(0);
    expect(second.json().skipped[0].reason).toBe("already_dispatched");

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("I3.21");
  });

  it("skips when no pending dual-control", async () => {
    const store = seedStore("i321-none", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const token = await loginCarol(app);
    const res = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().skipped[0].reason).toBe("none_pending");
  });
});
