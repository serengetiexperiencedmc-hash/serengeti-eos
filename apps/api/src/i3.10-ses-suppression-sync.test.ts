import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import {
  listEmailSuppressions,
  syncEmailSuppressionsFromSes,
  upsertEmailSuppression,
} from "./notifications/email-suppression.js";
import { createInMemorySesSuppressionClient } from "./notifications/ses-suppression-client.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I3.10 SES account suppression sync", () => {
  it("imports account suppressions into the tenant list", async () => {
    const store = seedStore("i310-sync", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    const ses = createInMemorySesSuppressionClient([
      { email: "bounce@example.com", reason: "bounce" },
      { email: "complaint@example.com", reason: "complaint" },
    ]);

    const result = await syncEmailSuppressionsFromSes(store, carol, { sesClient: ses });
    expect("imported" in result).toBe(true);
    if (!("imported" in result)) return;
    expect(result.imported).toBe(2);
    expect(result.updated).toBe(0);
    expect(result.activeCount).toBe(2);
    expect(result.increment).toBe("I3.10");

    const listed = listEmailSuppressions(store, carol);
    expect("items" in listed && listed.items.map((i) => i.email).sort()).toEqual([
      "bounce@example.com",
      "complaint@example.com",
    ]);
  });

  it("pushes local bounce suppressions to SES and removes on lift", async () => {
    const store = seedStore("i310-push", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    const ses = createInMemorySesSuppressionClient();

    await upsertEmailSuppression(
      store,
      { tenantId: carol.tenantId, email: "local-bounce@example.com", reason: "bounce" },
      { sesClient: ses },
    );
    expect(ses.store).toHaveLength(1);
    expect(ses.store[0]?.email).toBe("local-bounce@example.com");

    const listed = listEmailSuppressions(store, carol);
    expect("items" in listed).toBe(true);
    if (!("items" in listed)) return;
    const id = listed.items[0]!.id;

    const { liftEmailSuppression } = await import("./notifications/email-suppression.js");
    const lifted = await liftEmailSuppression(store, carol, id, { sesClient: ses });
    expect("suppression" in lifted).toBe(true);
    expect(ses.store).toHaveLength(0);
  });

  it("reports I3.10 on email health and rejects sync without SES client", async () => {
    const store = seedStore("i310-http", TEST_BOOTSTRAP_SECRETS);
    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const token = login.json().accessToken as string;

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("I3.11");

    const sync = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/suppressions/sync",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(sync.statusCode).toBe(400);
    expect(sync.json().reason).toBe("ses_suppression_sync_unavailable");
  });

  it("updates reason on re-sync without duplicating", async () => {
    const store = seedStore("i310-update", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    store.notifEmailSuppressions.push({
      id: newId(),
      tenantId: carol.tenantId,
      email: "dup@example.com",
      reason: "bounce",
      createdAt: new Date().toISOString(),
    });

    const ses = createInMemorySesSuppressionClient([{ email: "dup@example.com", reason: "complaint" }]);
    const result = await syncEmailSuppressionsFromSes(store, carol, { sesClient: ses });
    expect("updated" in result && result.updated).toBe(1);
    expect("imported" in result && result.imported).toBe(0);
    expect(store.notifEmailSuppressions.filter((s) => !s.liftedAt)).toHaveLength(1);
    expect(store.notifEmailSuppressions[0]?.reason).toBe("complaint");
  });
});
