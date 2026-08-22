import { describe, expect, it } from "vitest";
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

describe("I3.19 allowlist dual-control reminder notifications", () => {
  it("emits urgent inbox item for pending SES dual-control and clears after approve", async () => {
    const store = seedStore("i319-reminder", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    const added = await addEmailAllowlistEntry(store, carol, { email: "vip@example.com", note: "VIP" });
    expect("entry" in added).toBe(true);
    noteAllowlistSesOverlap(store, carol.tenantId, [{ email: "vip@example.com", reason: "bounce" }]);
    const entryId = (added as { entry: { id: string } }).entry.id;

    const app = buildServer({ store });
    const carolToken = await login(app, "carol.admin@sedmc.local", P.carolPassword);

    const inbox = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    expect(inbox.statusCode).toBe(200);
    const items = inbox.json().items as Array<{ key: string; title: string; severity: string; href: string }>;
    const reminder = items.find((i) => i.key === `allowlist-ses-dual:${entryId}`);
    expect(reminder).toBeTruthy();
    expect(reminder!.title).toBe("SES allowlist dual-control pending");
    expect(reminder!.severity).toBe("urgent");
    expect(reminder!.href).toBe("/commercial/notifications");

    const aliceToken = await login(app, "alice.finance@sedmc.local", P.alicePassword);
    const approved = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/allowlist/${entryId}/approve-ses`,
      headers: { authorization: `Bearer ${aliceToken}` },
    });
    expect(approved.statusCode).toBe(200);

    const after = await app.inject({
      method: "GET",
      url: "/v1/notifications",
      headers: { authorization: `Bearer ${carolToken}` },
    });
    const afterItems = after.json().items as Array<{ key: string }>;
    expect(afterItems.find((i) => i.key === `allowlist-ses-dual:${entryId}`)).toBeFalsy();
  });
});
