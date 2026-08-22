import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { isEmailSuppressed } from "./notifications/email-suppression.js";
import { addEmailAllowlistEntry } from "./notifications/email-allowlist.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I3.14 email allowlist transactional override", () => {
  it("bypasses active suppression when allowlisted", async () => {
    const store = seedStore("i314-allow", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    store.notifEmailSuppressions.push({
      id: newId(),
      tenantId: carol.tenantId,
      email: "vip@example.com",
      reason: "bounce",
      createdAt: new Date().toISOString(),
    });
    expect(isEmailSuppressed(store, carol.tenantId, "vip@example.com")).toBe(true);

    const added = await addEmailAllowlistEntry(store, carol, {
      email: "vip@example.com",
      note: "Transactional override",
    });
    expect("entry" in added && added.increment).toBe("I3.20");
    expect(isEmailSuppressed(store, carol.tenantId, "vip@example.com")).toBe(false);
  });

  it("exposes allowlist HTTP routes and I3.14 health", async () => {
    const store = seedStore("i314-http", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const token = login.json().accessToken as string;

    const created = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/allowlist",
      headers: { authorization: `Bearer ${token}` },
      payload: { email: "ops@example.com", note: "Ops digests" },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().increment).toBe("I3.20");
    const id = created.json().entry.id as string;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().items.some((e: { email: string }) => e.email === "ops@example.com")).toBe(true);

    const revoked = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist/${id}/revoke`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(revoked.statusCode).toBe(200);

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("I3.20");
    expect(health.json().allowlistCount).toBe(0);
  });
});

