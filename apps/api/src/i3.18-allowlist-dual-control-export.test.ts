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

describe("I3.18 allowlist dual-control audit export", () => {
  it("exports requester stamp, pending filter, and dual-control counts", async () => {
    const store = seedStore("i318-export", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);

    await addEmailAllowlistEntry(store, carol, { email: "normal@example.com", note: "normal" });

    const app = buildServer({ store });
    const token = await loginCarol(app);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist?dualControlStatus=pending",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().increment).toBe("I3.19");
    expect(listed.json().pendingCount).toBe(1);
    expect(listed.json().items).toHaveLength(1);
    expect(listed.json().items[0].email).toBe("vip@example.com");

    const exported = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist/export?format=csv&pendingOnly=1",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I3.19");
    expect(exported.json().pendingCount).toBe(1);
    expect(exported.json().approvedCount).toBe(0);
    expect(exported.json().csv).toContain("sesApprovalRequestedByPrincipalId");
    expect(exported.json().csv).toContain("vip@example.com");
    expect(exported.json().csv).not.toContain("normal@example.com");
  });
});
