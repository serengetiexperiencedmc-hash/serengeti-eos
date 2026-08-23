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

describe("I3.22 allowlist dual-control digest recipients", () => {
  it("fans out digest to caller plus store alias", async () => {
    const store = seedStore("i322-fanout", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const added = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist-dual-digest-recipients",
      headers: { authorization: `Bearer ${token}` },
      payload: { email: "approver@example.com", note: "dual ops" },
    });
    expect(added.statusCode).toBe(201);
    expect(added.json().increment).toBe("I3.22");

    const dispatched = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/dispatch-allowlist-dual-digest",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(dispatched.statusCode).toBe(200);
    expect(dispatched.json().increment).toBe("I3.27");
    expect(dispatched.json().recipientCount).toBeGreaterThanOrEqual(2);
    expect(dispatched.json().dispatched.length).toBeGreaterThanOrEqual(2);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist-dual-digest-recipients",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.json().items.some((i: { email: string }) => i.email === "approver@example.com")).toBe(true);

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("I3.21");
  });
});
