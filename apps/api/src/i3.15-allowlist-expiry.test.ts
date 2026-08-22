import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { addEmailAllowlistEntry, isEmailAllowlisted } from "./notifications/email-allowlist.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I3.15 allowlist expiry and export", () => {
  it("expires allowlist entries and exports audit CSV", async () => {
    const store = seedStore("i315-exp", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

    await addEmailAllowlistEntry(store, carol, {
      email: "temp@example.com",
      note: "short window",
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    });
    expect(isEmailAllowlisted(store, carol.tenantId, "temp@example.com")).toBe(false);

    await addEmailAllowlistEntry(store, carol, {
      email: "live@example.com",
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    });
    expect(isEmailAllowlisted(store, carol.tenantId, "live@example.com")).toBe(true);

    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const token = login.json().accessToken as string;

    const active = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(active.json().increment).toBe("I3.16");
    expect(active.json().items.every((e: { email: string }) => e.email !== "temp@example.com")).toBe(true);

    const withExpired = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist?includeExpired=1",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(withExpired.json().items.some((e: { email: string }) => e.email === "temp@example.com")).toBe(true);

    const exported = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist/export?format=csv&includeExpired=1",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I3.16");
    expect(exported.json().csv).toContain("temp@example.com");
    expect(exported.json().csv).toContain("expiresAt");

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("I3.16");
  });
});

