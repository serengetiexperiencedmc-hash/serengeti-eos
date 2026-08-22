import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import {
  addEmailAllowlistEntry,
  isEmailAllowlisted,
} from "./notifications/email-allowlist.js";
import { syncEmailSuppressionsFromSes } from "./notifications/email-suppression.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I3.17 allowlist SES dual-control", () => {
  it("lists I3.17 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("054_i317_allowlist_ses_dual_control"))).toBe(true);
  });

  it("blocks SES-noted VIP bypass until a second principal approves", async () => {
    const store = seedStore("i317-dual", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    const alice = allPrincipals(store).find((p) => p.email === "alice.finance@sedmc.local")!;

    await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    expect(isEmailAllowlisted(store, carol.tenantId, "vip@example.com")).toBe(true);

    await syncEmailSuppressionsFromSes(store, carol, {
      sesClient: {
        async list() {
          return [{ email: "vip@example.com", reason: "bounce" as const }];
        },
        async put() {},
        async remove() {},
      },
    });

    const entry = store.notifEmailAllowlist.find((e) => e.email === "vip@example.com")!;
    expect(entry.sesDualControlStatus).toBe("pending");
    expect(isEmailAllowlisted(store, carol.tenantId, "vip@example.com")).toBe(false);

    const app = buildServer({ store });
    const carolLogin = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const carolToken = carolLogin.json().accessToken as string;

    const selfApprove = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist/${entry.id}/approve-ses`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(selfApprove.statusCode).toBe(403);
    expect(selfApprove.json().reason).toBe("self_approval_forbidden");

    const aliceLogin = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "alice.finance@sedmc.local", password: P.alicePassword, tenantSlug: "sedmc" },
    });
    const aliceToken = aliceLogin.json().accessToken as string;

    const approved = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist/${entry.id}/approve-ses`,
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(approved.statusCode).toBe(200);
    expect(approved.json().increment).toBe("I3.18");
    expect(approved.json().entry.sesDualControlStatus).toBe("approved");
    expect(isEmailAllowlisted(store, alice.tenantId, "vip@example.com")).toBe(true);

    const listed = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/allowlist",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(listed.json().increment).toBe("I3.18");
  });
});
