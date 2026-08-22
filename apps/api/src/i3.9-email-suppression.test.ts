import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { createEmailAdapter } from "./notifications/email.js";
import { handleSesDeliveryWebhook } from "./notifications/ses-webhook.js";
import { isEmailSuppressed, listEmailSuppressions } from "./notifications/email-suppression.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I3.9 SES email suppression / bounce hygiene", () => {
  it("adds suppression on bounce and blocks subsequent sends", async () => {
    const store = seedStore("i39-bounce", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    const sesMessageId = "ses-msg-i39-1";
    store.notifEmailOutbox.push({
      id: newId(),
      tenantId: carol.tenantId,
      principalId: carol.id,
      notificationKey: "test.i39",
      to: "bouncer@example.com",
      subject: "Test",
      bodyText: "Hello",
      templateKey: "default",
      status: "sent",
      adapter: "ses",
      sesMessageId,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    const webhook = await handleSesDeliveryWebhook(store, {
      body: {
        Type: "Notification",
        MessageId: "sns-i39-1",
        Message: JSON.stringify({
          notificationType: "Bounce",
          mail: { messageId: sesMessageId, destination: ["bouncer@example.com"] },
        }),
      },
    });
    expect(webhook.ok).toBe(true);
    expect(isEmailSuppressed(store, carol.tenantId, "bouncer@example.com")).toBe(true);

    const adapter = createEmailAdapter(store, carol);
    const result = await adapter.send({
      to: "bouncer@example.com",
      subject: "Again",
      bodyText: "Nope",
      notificationKey: "test.i39.again",
      templateKey: "default",
    });
    expect(result.status).toBe("skipped");
    expect(result.reason).toBe("suppressed");
  });

  it("lists and lifts suppressions via HTTP", async () => {
    const store = seedStore("i39-http", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    store.notifEmailSuppressions.push({
      id: newId(),
      tenantId: carol.tenantId,
      email: "blocked@example.com",
      reason: "complaint",
      createdAt: new Date().toISOString(),
    });

    const listed = listEmailSuppressions(store, carol);
    expect("items" in listed).toBe(true);
    if (!("items" in listed)) return;
    expect(listed.items).toHaveLength(1);
    expect(listed.increment).toBe("I3.17");

    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const token = login.json().accessToken as string;

    const httpList = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/suppressions",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(httpList.statusCode).toBe(200);
    expect(httpList.json().items).toHaveLength(1);

    const id = httpList.json().items[0].id as string;
    const lifted = await app.inject({
      method: "POST",
      url: `/v1/notifications/email/suppressions/${id}/lift`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(lifted.statusCode).toBe(200);
    expect(lifted.json().suppression.liftedAt).toBeTruthy();
    expect(isEmailSuppressed(store, carol.tenantId, "blocked@example.com")).toBe(false);
  });
});

