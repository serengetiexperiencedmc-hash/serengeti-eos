import { describe, expect, it } from "vitest";
import { listMigrationFiles } from "@sedmc/db";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { addEmailAllowlistEntry, noteAllowlistSesOverlap } from "./notifications/email-allowlist.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function login(
  app: ReturnType<typeof buildServer>,
  email: string,
  password: string,
) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.20 allowlist dual-control reminder snooze/dismiss", () => {
  it("lists I3.20 migration", () => {
    expect(listMigrationFiles().some((f) => f.includes("057_i320_allowlist_dual_reminder"))).toBe(true);
  });

  it("snoozes, dismisses with reason, and clears dual-control inbox reminders", async () => {
    const store = seedStore("i320-reminder", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    const added = await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    expect("entry" in added).toBe(true);
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);
    const entryId = (added as { entry: { id: string } }).entry.id;

    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword);

    const before = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(before.json().items.find((i: { key: string }) => i.key === `allowlist-ses-dual:${entryId}`)).toBeTruthy();

    const snoozed = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist/${entryId}/reminder-snooze`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { hours: 24 },
    });
    expect(snoozed.statusCode).toBe(200);
    expect(snoozed.json().increment).toBe("I3.20");
    expect(snoozed.json().entry.dualReminderSnoozeUntil).toBeTruthy();

    const whileSnoozed = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(
      whileSnoozed.json().items.find((i: { key: string }) => i.key === `allowlist-ses-dual:${entryId}`),
    ).toBeFalsy();

    const cleared = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist/${entryId}/reminder-clear`,
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(cleared.statusCode).toBe(200);

    const afterClear = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(
      afterClear.json().items.find((i: { key: string }) => i.key === `allowlist-ses-dual:${entryId}`),
    ).toBeTruthy();

    const noReason = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist/${entryId}/reminder-dismiss`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: {},
    });
    expect(noReason.statusCode).toBe(400);
    expect(noReason.json().reason).toBe("reason_required");

    const dismissed = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist/${entryId}/reminder-dismiss`,
      headers: { authorization: `Bearer ${carolToken}` },
      payload: { reason: "Waiting on SES ticket" },
    });
    expect(dismissed.statusCode).toBe(200);
    expect(dismissed.json().entry.dualReminderDismissReason).toBe("Waiting on SES ticket");

    const afterDismiss = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(
      afterDismiss.json().items.find((i: { key: string }) => i.key === `allowlist-ses-dual:${entryId}`),
    ).toBeFalsy();

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(health.json().increment).toBe("I3.20");
  });
});
