import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { addEmailAllowlistEntry, noteAllowlistSesOverlap } from "./notifications/email-allowlist.js";
import { allPrincipals } from "./store.js";
import { digestLastRunFreshness } from "./notifications/digest-freshness.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.25 allowlist dual digest last-run freshness", () => {
  it("treats never-run as stale and clears after dispatch", async () => {
    const store = seedStore("i325-fresh", TEST_BOOTSTRAP_SECRETS);
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
    expect(before.json().increment).toBe("I3.32");
    expect(before.json().freshness.neverRun).toBe(true);
    expect(before.json().freshness.stale).toBe(true);

    const dispatched = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(dispatched.json().increment).toBe("I3.32");

    const after = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-status",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().freshness.neverRun).toBe(false);
    expect(after.json().freshness.stale).toBe(false);

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().allowlistDualDigestFreshness.stale).toBe(false);
  });

  it("marks an allowlist last-run older than the threshold as stale", () => {
    const old = new Date(Date.now() - 40 * 3_600_000).toISOString();
    const freshness = digestLastRunFreshness(old, Date.now(), "EOS_ALLOWLIST_DUAL_DIGEST_STALE_HOURS");
    expect(freshness.stale).toBe(true);
    expect(freshness.neverRun).toBe(false);
  });
});
