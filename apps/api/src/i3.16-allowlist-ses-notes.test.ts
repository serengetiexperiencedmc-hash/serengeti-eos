import { describe, expect, it } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { addEmailAllowlistEntry } from "./notifications/email-allowlist.js";
import { syncEmailSuppressionsFromSes } from "./notifications/email-suppression.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I3.17 allowlist SES sync notes", () => {
  it("notes allowlist overlaps during SES sync", async () => {
    const store = seedStore("i316-ses", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP override" });

    const result = await syncEmailSuppressionsFromSes(store, carol, {
      sesClient: {
        async list() {
          return [{ email: "vip@example.com", reason: "bounce" as const }];
        },
        async put() {},
        async remove() {},
      },
    });
    expect("allowlistSesNoted" in result && result.allowlistSesNoted).toBe(1);
    expect("increment" in result && result.increment).toBe("I3.20");
    const entry = store.notifEmailAllowlist.find((e) => e.email === "vip@example.com");
    expect(entry?.sesSyncNote).toContain("SES account suppression");
    expect(entry?.sesNotedAt).toBeTruthy();

    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const token = login.json().accessToken as string;
    const listed = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.json().increment).toBe("I3.20");
    expect(listed.json().items[0].sesSyncNote).toContain("bounce");

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("I3.20");
  });
});
