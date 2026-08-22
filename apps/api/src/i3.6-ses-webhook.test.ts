import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { handleSesDeliveryWebhook } from "./notifications/ses-webhook.js";

const P = TEST_BOOTSTRAP_SECRETS;

async function loginCarol(app: ReturnType<typeof buildServer>) {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
  });
  return res.json().accessToken as string;
}

describe("I3.6 SES bounce/complaint webhooks", () => {
  it("updates outbox status on bounce webhook", async () => {
    const store = seedStore("i36-bounce", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const sesMessageId = "ses-msg-bounce-1";
    store.notifEmailOutbox.push({
      id: newId(),
      tenantId: "11111111-1111-4111-8111-111111111111",
      principalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      notificationKey: "test.bounce",
      to: "guest@example.com",
      subject: "Test",
      bodyText: "Hello",
      templateKey: "default",
      status: "sent",
      adapter: "ses",
      sesMessageId,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    const result = await handleSesDeliveryWebhook(store, {
      body: {
        Type: "Notification",
        MessageId: "sns-1",
        Message: JSON.stringify({
          notificationType: "Bounce",
          mail: { messageId: sesMessageId, destination: ["guest@example.com"] },
        }),
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result).toBe("updated");
    expect(store.notifEmailOutbox[0]!.status).toBe("bounced");
    expect(store.notifEmailDeliveryEvents).toHaveLength(1);
    expect(store.notifEmailDeliveryEvents[0]!.eventType).toBe("bounce");
  });

  it("records complaint when outbox match is by recipient", async () => {
    const store = seedStore("i36-complaint", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    store.notifEmailOutbox.push({
      id: newId(),
      tenantId: "11111111-1111-4111-8111-111111111111",
      principalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      notificationKey: "test.complaint",
      to: "complainer@example.com",
      subject: "Digest",
      bodyText: "Digest body",
      templateKey: "default",
      status: "sent",
      adapter: "ses",
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    const result = await handleSesDeliveryWebhook(store, {
      body: {
        notificationType: "Complaint",
        mail: { destination: ["complainer@example.com"] },
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(store.notifEmailOutbox[0]!.status).toBe("complained");
    expect(store.notifEmailDeliveryEvents[0]!.eventType).toBe("complaint");
  });

  it("exposes HTTP webhook and delivery-events routes", async () => {
    const prevSecret = process.env.EOS_SES_WEBHOOK_SECRET;
    process.env.EOS_SES_WEBHOOK_SECRET = "test-webhook-secret";
    try {
      const store = seedStore("i36-http", TEST_BOOTSTRAP_SECRETS);
      ensureNotificationCollections(store);
      const sesMessageId = "ses-msg-http-1";
      store.notifEmailOutbox.push({
        id: newId(),
        tenantId: "11111111-1111-4111-8111-111111111111",
        principalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        notificationKey: "test.http",
        to: "http@example.com",
        subject: "HTTP test",
        bodyText: "Body",
        templateKey: "default",
        status: "sent",
        adapter: "ses",
        sesMessageId,
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      const app = buildServer({ store });
      const token = await loginCarol(app);

      const unauthorized = await app.inject({
        method: "POST",
        url: "/v1/notifications/email/ses-webhook",
        payload: { Type: "SubscriptionConfirmation" },
      });
      expect(unauthorized.statusCode).toBe(401);

      const webhook = await app.inject({
        method: "POST",
        url: "/v1/notifications/email/ses-webhook",
        headers: { "x-eos-webhook-secret": "test-webhook-secret" },
        payload: {
          Type: "Notification",
          Message: JSON.stringify({
            notificationType: "Bounce",
            mail: { messageId: sesMessageId },
          }),
        },
      });
      expect(webhook.statusCode).toBe(200);
      expect(webhook.json().increment).toBe("I3.6");

      const listed = await app.inject({
        method: "GET",
        url: "/v1/notifications/email/delivery-events",
        headers: { authorization: `Bearer ${token}` },
      });
      expect(listed.statusCode).toBe(200);
      expect(listed.json().increment).toBe("I3.6");
      expect(listed.json().items.length).toBeGreaterThan(0);
    } finally {
      if (prevSecret === undefined) delete process.env.EOS_SES_WEBHOOK_SECRET;
      else process.env.EOS_SES_WEBHOOK_SECRET = prevSecret;
    }
  });
});
